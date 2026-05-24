import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// POST /api/transcribe — recibe audio (multipart/form-data field "audio"),
// lo manda a ElevenLabs Scribe, guarda audio + transcript en Cloud y devuelve la nota.
export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.ELEVENLABS_API_KEY;
        if (!key) {
          return Response.json({ error: "ELEVENLABS_API_KEY no configurado" }, { status: 500 });
        }

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return Response.json({ error: "Esperaba multipart/form-data" }, { status: 400 });
        }

        const audio = form.get("audio") as Blob | File | null;
        if (!audio || typeof (audio as Blob).arrayBuffer !== "function") {
          return Response.json({ error: "Campo 'audio' faltante" }, { status: 400 });
        }
        // Límite defensivo (~25MB)
        if ((audio as Blob).size > 25 * 1024 * 1024) {
          return Response.json({ error: "Audio mayor a 25MB" }, { status: 413 });
        }

        // 1) Subir audio original al bucket
        const filename = (audio as File).name ?? "";
        const ext = filename.includes(".") ? filename.split(".").pop() : "webm";
        const audioPath = `notes/${crypto.randomUUID()}.${ext}`;
        const buf = Buffer.from(await (audio as Blob).arrayBuffer());
        const upAudio = await supabaseAdmin.storage
          .from("content-assets")
          .upload(audioPath, buf, {
            contentType: (audio as Blob).type || "audio/webm",
            upsert: false,
          });
        if (upAudio.error) {
          return Response.json({ error: `Upload falló: ${upAudio.error.message}` }, { status: 500 });
        }
        const { data: pub } = supabaseAdmin.storage.from("content-assets").getPublicUrl(audioPath);

        // 2) Llamar a ElevenLabs Scribe
        const sttForm = new FormData();
        sttForm.append("file", new Blob([buf], { type: (audio as Blob).type || "audio/webm" }));
        sttForm.append("model_id", "scribe_v2");
        sttForm.append("diarize", "true");
        sttForm.append("tag_audio_events", "false");
        sttForm.append("language_code", "spa");

        const sttRes = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
          method: "POST",
          headers: { "xi-api-key": key },
          body: sttForm,
        });

        if (!sttRes.ok) {
          const t = await sttRes.text();
          return Response.json(
            { error: `ElevenLabs Scribe ${sttRes.status}: ${t}` },
            { status: 502 },
          );
        }

        const sttJson = (await sttRes.json()) as {
          text?: string;
          words?: Array<{ start?: number; end?: number }>;
        };
        const transcript = (sttJson.text ?? "").trim();
        if (!transcript) {
          return Response.json({ error: "Transcripción vacía" }, { status: 422 });
        }

        const lastWord = sttJson.words?.[sttJson.words.length - 1];
        const durationMs =
          typeof lastWord?.end === "number" ? Math.round(lastWord.end * 1000) : null;

        // 3) Insertar nota en DB
        const { data: inserted, error: insErr } = await supabaseAdmin
          .from("founder_notes")
          .insert({
            audio_url: pub.publicUrl,
            transcript,
            duration_ms: durationMs,
          })
          .select()
          .single();

        if (insErr) {
          return Response.json({ error: `DB insert: ${insErr.message}` }, { status: 500 });
        }

        return Response.json({ note: inserted });
      },
    },
  },
});
