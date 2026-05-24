import { useRef, useState } from "react";
import { TrendingUp, TrendingDown, Sparkles, Lightbulb, Wand2, Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { loadFounderDna } from "./FounderDnaDialog";

// Bloque "Aprendizajes de la semana pasada" · Input 3 visible al founder
// Hoy es mock; se reemplaza por datos reales de content_feedback cuando esté la integración LinkedIn
const topPiezas = [
  {
    titulo: "Las 3 señales que predicen tu próximo trimestre",
    formato: "Carrusel · 7 slides",
    metric: "save rate 9.2%",
    delta: "+187%",
  },
  {
    titulo: "Por qué tu forecast no es un número, es una hipótesis",
    formato: "Post largo · LinkedIn",
    metric: "12 DMs cualificados",
    delta: "+62%",
  },
];

const bottomPiezas = [
  {
    titulo: "Webinar recap · revenue ops",
    formato: "Post imagen",
    metric: "0.4% engagement",
    delta: "-71% vs media",
  },
];

const hipotesis = [
  "Carruseles con dato cuantitativo en slide 1 generan 2.3x más saves que sin dato.",
  "Posts publicados entre 9–11am hora founder convierten 1.8x más DMs cualificados.",
  "Hooks que abren con pregunta directa al ICP suben comentarios cualificados ~40%.",
];

export function WeeklyLearnings({ onGenerate }: { onGenerate: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleGenerate = () => {
    const dna = loadFounderDna();
    if (!dna || !dna.founderName) {
      toast.warning("Primero completá tu ADN", {
        description: "El agente necesita saber quién sos antes de generar contenido.",
        action: { label: "Abrir ADN", onClick: onGenerate },
      });
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success("Próximamente · generación en vivo", {
        description: "Conectaremos Lovable AI Gateway con tu ADN + feed semanal + aprendizajes.",
      });
    }, 1400);
  };

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setTranscribing(true);
        try {
          const form = new FormData();
          form.append("audio", blob, "nota.webm");
          const res = await fetch("/api/transcribe", { method: "POST", body: form });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error ?? "Error");
          toast.success("Nota guardada en el feed", {
            description:
              (json.note?.transcript as string)?.slice(0, 120) +
              ((json.note?.transcript?.length ?? 0) > 120 ? "…" : ""),
          });
        } catch (e) {
          toast.error("No se pudo transcribir", {
            description: e instanceof Error ? e.message : "",
          });
        } finally {
          setTranscribing(false);
        }
      };
      mr.start();
      recRef.current = mr;
      setRecording(true);
    } catch {
      toast.error("No se pudo acceder al micrófono");
    }
  };

  const stopRec = () => {
    recRef.current?.stop();
    setRecording(false);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 to-card/40 p-5 backdrop-blur">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Aprendizajes · semana pasada</h2>
            <p className="text-[11px] text-muted-foreground">
              Top, bottom e hipótesis. El agente lo usa para diseñar esta semana.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={recording ? stopRec : startRec}
            disabled={transcribing}
            size="sm"
            variant="outline"
            className={cn(
              "gap-1.5 border-border/60",
              recording && "border-rose-500/50 bg-rose-500/10 text-rose-300",
            )}
          >
            {transcribing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Transcribiendo…
              </>
            ) : recording ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current" />
                Detener
              </>
            ) : (
              <>
                <Mic className="h-3.5 w-3.5" />
                Grabar nota
              </>
            )}
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={generating}
            size="sm"
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {generating ? (
              <>
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Generando…
              </>
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5" />
                Generar semana
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Block
          title="Top · repetir patrón"
          icon={TrendingUp}
          accent="text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
        >
          {topPiezas.map((p) => (
            <PieceRow key={p.titulo} {...p} positive />
          ))}
        </Block>

        <Block
          title="Bottom · evitar"
          icon={TrendingDown}
          accent="text-rose-300 bg-rose-500/10 border-rose-500/20"
        >
          {bottomPiezas.map((p) => (
            <PieceRow key={p.titulo} {...p} positive={false} />
          ))}
        </Block>

        <Block
          title="Hipótesis del agente"
          icon={Sparkles}
          accent="text-primary bg-primary/10 border-primary/20"
        >
          <ul className="space-y-2 px-1">
            {hipotesis.map((h, i) => (
              <li key={i} className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {h}
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </section>
  );
}

function Block({
  title,
  icon: Icon,
  accent,
  children,
}: {
  title: string;
  icon: typeof TrendingUp;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/30 p-3">
      <div className="flex items-center gap-2">
        <span className={cn("flex h-5 w-5 items-center justify-center rounded-md border", accent)}>
          <Icon className="h-3 w-3" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function PieceRow({
  titulo,
  formato,
  metric,
  delta,
  positive,
}: {
  titulo: string;
  formato: string;
  metric: string;
  delta: string;
  positive: boolean;
}) {
  return (
    <div className="rounded-md border border-border/40 bg-card/40 px-2.5 py-2">
      <p className="line-clamp-1 text-[11px] font-medium text-foreground">{titulo}</p>
      <div className="mt-1 flex items-center justify-between gap-2 text-[10px]">
        <span className="text-muted-foreground">{formato}</span>
        <span className={cn("font-medium", positive ? "text-emerald-300" : "text-rose-300")}>
          {metric} · {delta}
        </span>
      </div>
    </div>
  );
}
