import { useMemo, useState } from "react";
import { useSection, type SectionId } from "./section-context";
import { semanasCalendario } from "./mock-data";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  TrendingUp,
  Video,
  Users,
  Check,
  ArrowRight,
} from "lucide-react";

type Task = {
  id: string;
  icon: typeof CalendarCheck;
  label: string;
  hint: string;
  tiempo: string;
  section: SectionId;
  auto?: boolean;
};

export function FounderTasksBar() {
  const { approvals, totalPublicaciones, setActive } = useSection();

  const aprobadasCount = useMemo(
    () => Object.values(approvals).filter(Boolean).length,
    [approvals]
  );
  const todoAprobado =
    aprobadasCount === totalPublicaciones && totalPublicaciones > 0;

  const [manualDone, setManualDone] = useState<Record<string, boolean>>({
    t2: false,
    t3: false,
    t4: false,
  });

  const tasks: Task[] = [
    {
      id: "t1",
      icon: CalendarCheck,
      label: "Aprobar contenido",
      hint: `${aprobadasCount}/${totalPublicaciones} aprobadas en calendario`,
      tiempo: "5 min",
      section: "calendar",
      auto: true,
    },
    {
      id: "t2",
      icon: TrendingUp,
      label: "Analizar input semanal",
      hint: "Llamadas, métricas y deals movidos · insumo del carrusel",
      tiempo: "2 min",
      section: "content",
    },
    {
      id: "t3",
      icon: Video,
      label: "Grabar / subir clip 45s",
      hint: "Video founder Mar 19 Nov · guion listo",
      tiempo: "15 min",
      section: "content",
    },
    {
      id: "t4",
      icon: Users,
      label: "Meeting prep",
      hint: "Briefing de la próxima reunión",
      tiempo: "3 min",
      section: "meetings",
    },
  ];

  const isDone = (t: Task) => (t.auto ? todoAprobado : !!manualDone[t.id]);
  const completed = tasks.filter(isDone).length;
  const pct = Math.round((completed / tasks.length) * 100);

  return (
    <section className="rounded-lg border border-border/60 bg-card/60 px-2.5 py-2 backdrop-blur">
      <div className="mb-1.5 flex items-center justify-between gap-3 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Acciones del founder
          </span>
          <span className="rounded border border-border/60 bg-background/40 px-1 py-px text-[9px] text-muted-foreground">
            {completed}/{tasks.length} · {pct}%
          </span>
        </div>
        <span className="text-[9px] text-muted-foreground/70">Fijo en todas las pestañas</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
        {tasks.map((t) => {
          const done = isDone(t);
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              className={cn(
                "group flex items-center gap-2 rounded-md border px-2 py-1.5 transition-colors",
                done
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-border/40 bg-white/[0.02] hover:bg-white/[0.04]"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[10px]",
                  done
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                    : "border-border/60 bg-background/40 text-muted-foreground"
                )}
              >
                {done ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "truncate text-[11px] font-medium leading-tight",
                      done ? "text-muted-foreground line-through" : "text-foreground"
                    )}
                  >
                    {t.label}
                  </span>
                  {t.auto && (
                    <span className="shrink-0 rounded border border-primary/30 bg-primary/10 px-1 text-[8px] font-semibold uppercase tracking-wider text-primary">
                      Auto
                    </span>
                  )}
                </div>
                <p className="truncate text-[9.5px] leading-tight text-muted-foreground">
                  ~{t.tiempo} · {t.hint}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {!t.auto && (
                  <button
                    type="button"
                    onClick={() => setManualDone((p) => ({ ...p, [t.id]: !p[t.id] }))}
                    className={cn(
                      "rounded border px-1.5 py-0.5 text-[9px] font-medium transition",
                      done
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-border/60 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {done ? "✓" : "Marcar"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActive(t.section)}
                  className="inline-flex items-center gap-0.5 rounded border border-border/60 bg-background/40 px-1.5 py-0.5 text-[9px] font-medium text-foreground/80 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  Ir
                  <ArrowRight className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

