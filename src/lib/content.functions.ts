import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

function requireLovableKey() {
  const k = process.env.LOVABLE_API_KEY;
  if (!k) throw new Error("LOVABLE_API_KEY no configurado");
  return k;
}

function requireElevenLabsKey() {
  const k = process.env.ELEVENLABS_API_KEY;
  if (!k) throw new Error("ELEVENLABS_API_KEY no configurado");
  return k;
}

// ---------- 1) Generar copy del post ----------

export const generatePostCopy = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        insightBase: z.string().min(1).max(2000),
        formato: z.enum(["post", "carrusel", "video", "dm", "newsletter"]).default("post"),
        tono: z.string().max(200).optional(),
        founderName: z.string().max(120).optional(),
        icp: z.string().max(300).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const key = requireLovableKey();

    const system = `Sos el ghostwriter de un founder B2B. Escribís en español, primera persona, sin emojis, sin clichés de LinkedIn. Tono ${data.tono ?? "directo, ejecutivo, sin relleno"}. ICP: ${data.icp ?? "founders y heads of revenue B2B"}. Founder: ${data.founderName ?? "el cliente"}.`;

    const user = `Insight base: ${data.insightBase}
Formato: ${data.formato}
Devolvé un JSON con: { "titulo": string (hook de 1 línea), "copy": string (post completo listo para LinkedIn, 800–1200 caracteres, con saltos de línea), "cta": string (1 línea accionable), "hashtags": string[] (3-5 hashtags relevantes sin #) }`;

    const res = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_post",
              description: "Devuelve el post estructurado",
              parameters: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  copy: { type: "string" },
                  cta: { type: "string" },
                  hashtags: { type: "array", items: { type: "string" } },
                },
                required: ["titulo", "copy", "cta", "hashtags"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "emit_post" } },
      }),
    });

    if (res.status === 429) throw new Error("Rate limit alcanzado. Esperá un momento.");
    if (res.status === 402) throw new Error("Sin créditos de Lovable AI. Agregá fondos en Settings → Usage.");
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI gateway error ${res.status}: ${t}`);
    }

    const json = await res.json();
    const call = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!call) throw new Error("No se recibió respuesta estructurada");
    const parsed = JSON.parse(call) as {
      titulo: string;
      copy: string;
      cta: string;
      hashtags: string[];
    };

    return parsed;
  });

// ---------- 2) Generar imagen del post ----------

export const generatePostImage = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        prompt: z.string().min(3).max(1500),
        aspect: z.enum(["4:5", "1:1", "16:9"]).default("4:5"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const key = requireLovableKey();

    const finalPrompt = `${data.prompt}. Estilo: editorial premium, dark mode boardroom, tipografía moderna, alto contraste, sin texto en la imagen. Formato vertical optimizado para feed de LinkedIn, aspect ratio ${data.aspect} (idealmente 1200x1500), composición centrada con respiración a los lados, safe area para que nada importante quede cerca de los bordes.`;

    const res = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: finalPrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (res.status === 429) throw new Error("Rate limit. Esperá un momento.");
    if (res.status === 402) throw new Error("Sin créditos de Lovable AI.");
    if (!res.ok) throw new Error(`Image gen error ${res.status}`);

    const json = await res.json();
    const dataUrl: string | undefined =
      json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!dataUrl) throw new Error("No se generó imagen");

    // data:image/png;base64,xxx → bytes → upload a storage
    const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) throw new Error("Formato de imagen inesperado");
    const mime = match[1];
    const ext = mime.split("/")[1].split("+")[0];
    const bytes = Buffer.from(match[2], "base64");

    const path = `posts/${crypto.randomUUID()}.${ext}`;
    const up = await supabaseAdmin.storage.from("content-assets").upload(path, bytes, {
      contentType: mime,
      upsert: false,
    });
    if (up.error) throw new Error(`Upload falló: ${up.error.message}`);

    const { data: pub } = supabaseAdmin.storage.from("content-assets").getPublicUrl(path);
    return { url: pub.publicUrl, path };
  });

// ---------- 3) Voiceover con ElevenLabs TTS ----------

export const synthesizeVoiceover = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        text: z.string().min(1).max(5000),
        voiceId: z.string().min(1).max(64).default("JBFqnCBsd6RMkjVDRZzb"), // George
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const key = requireElevenLabsKey();

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(data.voiceId)}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (res.status === 429) throw new Error("ElevenLabs rate limit. Esperá un momento.");
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`ElevenLabs error ${res.status}: ${t}`);
    }

    const buf = Buffer.from(await res.arrayBuffer());
    const path = `voiceovers/${crypto.randomUUID()}.mp3`;
    const up = await supabaseAdmin.storage.from("content-assets").upload(path, buf, {
      contentType: "audio/mpeg",
      upsert: false,
    });
    if (up.error) throw new Error(`Upload falló: ${up.error.message}`);

    const { data: pub } = supabaseAdmin.storage.from("content-assets").getPublicUrl(path);
    return { url: pub.publicUrl, path, sizeBytes: buf.byteLength };
  });

// ---------- 4) Listar notas del founder (memory feed) ----------

export const listFounderNotes = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("founder_notes")
    .select("id, audio_url, transcript, duration_ms, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return { notes: data ?? [] };
});
