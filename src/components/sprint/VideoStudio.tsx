import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Film,
  Loader2,
  Check,
  Scissors,
  Subtitles,
  Sparkles,
  Wand2,
  Download,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type StageState = "idle" | "running" | "done";

const STAGES: { id: string; label: string; detail: string; icon: typeof Scissors }[] = [
  { id: "ingest", label: "Ingesta y análisis", detail: "Detectando silencios, muletillas y mejores tomas", icon: Wand2 },
  { id: "cuts", label: "Cortes inteligentes", detail: "Removiendo pausas y reorganizando para mantener ritmo", icon: Scissors },
  { id: "broll", label: "B-roll y motion graphics", detail: "Insertando gráficos, lower thirds y transiciones", icon: Sparkles },
  { id: "subs", label: "Subtítulos burned-in", detail: "Estilo founder, palabra-a-palabra, highlight en keywords", icon: Subtitles },
  { id: "render", label: "Render final 1080p", detail: "Color grading boardroom + master MP4 listo", icon: Film },
];

export function VideoStudio() {
  const [file, setFile] = useState<File | null>(null);
  const [hook, setHook] = useState("");
  const [running, setRunning] = useState(false);
  const [stageIdx, setStageIdx] = useState<number>(-1);
  const [done, setDone] = useState(false);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    if (!file) {
      previewRef.current = null;
      return;
    }
    const url = URL.createObjectURL(file);
    previewRef.current = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const stageState = (i: number): StageState => {
    if (done) return "done";
    if (i < stageIdx) return "done";
    if (i === stageIdx) return "running";
    return "idle";
  };

  const start = async () => {
    if (!file) {
      toast.warning("Subí un clip primero");
      return;
    }
    setRunning(true);
    setDone(false);
    for (let i = 0; i < STAGES.length; i++) {
      setStageIdx(i);
      // simulación visual del pipeline (placeholder hasta enchufar el agente real)
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
    }
    setStageIdx(STAGES.length);
    setDone(true);
    setRunning(false);
    toast.success("Video editado y listo para publicar");
  };

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/90 text-background">
            <Film className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Video Studio · edición autónoma</h3>
            <p className="text-[11px] text-muted-foreground">
              Subís el raw · el agente entrega el master listo para LinkedIn / YouTube
            </p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
          AI editor activo
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Upload + preview */}
        <div className="flex flex-col gap-3">
          <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-background/30 px-6 py-8 text-center transition hover:border-primary/40 hover:bg-background/50">
            <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            <div className="text-xs font-medium text-foreground">
              {file ? file.name : "Arrastrá o seleccioná tu video raw"}
            </div>
            <div className="text-[10px] text-muted-foreground">
              MP4 / MOV · hasta 500MB · sin editar
            </div>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setDone(false);
                setStageIdx(-1);
              }}
            />
          </label>

          {previewRef.current && (
            <video
              src={previewRef.current}
              controls
              className="aspect-video w-full rounded-lg border border-border/60 bg-black object-cover"
            />
          )}

          <input
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            placeholder="Hook opcional (10 palabras): el gancho que el agente forzará en el segundo 1"
            className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none"
          />
        </div>

        {/* Pipeline */}
        <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-background/30 p-4">
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Pipeline del agente editor
          </div>
          {STAGES.map((s, i) => {
            const st = stageState(i);
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={cn(
                  "flex items-start gap-2.5 rounded-md border px-2.5 py-2 transition",
                  st === "done" && "border-emerald-500/20 bg-emerald-500/5",
                  st === "running" && "border-primary/30 bg-primary/5",
                  st === "idle" && "border-border/40 bg-background/40 opacity-60",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    st === "done" && "bg-emerald-500/15 text-emerald-300",
                    st === "running" && "bg-primary/15 text-primary",
                    st === "idle" && "bg-muted/40 text-muted-foreground",
                  )}
                >
                  {st === "done" ? (
                    <Check className="h-3 w-3" />
                  ) : st === "running" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Icon className="h-3 w-3" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[11.5px] font-medium text-foreground">{s.label}</div>
                  <div className="text-[10.5px] text-muted-foreground">{s.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3">
        <span className="text-[11px] text-muted-foreground">
          {done
            ? "Master listo · 1080p · subtítulos quemados · CTA al final"
            : running
              ? "Editando en segundo plano · podés seguir trabajando"
              : "El agente edita en ~2 min por cada minuto de raw"}
        </span>
        <div className="flex items-center gap-2">
          {done && (
            <>
              <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs">
                <Play className="h-3.5 w-3.5" />
                Previsualizar
              </Button>
              <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" />
                MP4 final
              </Button>
            </>
          )}
          <Button
            size="sm"
            onClick={start}
            disabled={!file || running}
            className="h-8 gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
          >
            {running ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Editando…
              </>
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5" />
                {done ? "Re-editar con otra dirección" : "Editar con el agente"}
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
