import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useSection, type SectionId } from "./section-context";
import { semanasCalendario } from "./mock-data";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ArrowRight,
  CalendarCheck,
  TrendingUp,
  Video,
  MousePointerClick,
} from "lucide-react";

const colorUrgencia: Record<string, string> = {
  alta: "bg-rose-400",
  media: "bg-amber-400",
  baja: "bg-emerald-400",
};

type Tarea = {
  id: string;
  icon: typeof CheckCircle2;
  label: string;
  detalle: string;
  urgencia: "alta" | "media";
  tiempo: string;
  hecho: boolean;
  auto?: boolean; // checked automatically (no manual toggle)
  link?: { section: SectionId; cta: string };
  meta?: string; // small status line
};

export function FounderTasks() {
  const { approvals, totalPublicaciones, setActive } = useSection();

  // Auto-derived: approval count across all weeks
  const aprobadasCount = useMemo(
    () => Object.values(approvals).filter(Boolean).length,
    [approvals]
  );
  const todoAprobado = aprobadasCount === totalPublicaciones && totalPublicaciones > 0;

  const piezasSemanaActual = semanasCalendario[0].dias.length;
  const aprobadasSemanaActual = semanasCalendario[0].dias.filter(
    (d) => approvals[`${semanasCalendario[0].id}:${d.dia}`]
  ).length;

  const [manualTareas, setManualTareas] = useState<Tarea[]>([
    {
      id: "t2",
      icon: TrendingUp,
      label: "Analizar input semanal",
      detalle:
        "Revisa señales de la semana (llamadas, métricas, deals movidos) — insumo base para el carrusel del Miércoles 27.",
      urgencia: "alta",
      tiempo: "2 min",
      hecho: false,
      link: { section: "content", cta: "Ver dónde se usa" },
      meta: "Pendiente · usado en Sec. 3",
    },
    {
      id: "t3",
      icon: Video,
      label: "Grabar / subir clip de 45s",
      detalle:
        "Video founder Martes 19 Nov — guion ya generado, hook en 0–3s. Studio listo para post-procesar.",
      urgencia: "alta",
      tiempo: "15 min",
      hecho: false,
      link: { section: "content", cta: "Abrir Studio" },
      meta: "Studio editando · 64% listo",
    },
    {
      id: "t4",
      icon: MousePointerClick,
      label: "Meeting prep",
      detalle:
        "Revisa el briefing de la próxima reunión (contexto, objetivos y next steps sugeridos) antes de entrar.",
      urgencia: "media",
      tiempo: "3 min",
      hecho: false,
      link: { section: "meetings", cta: "Ver briefing" },
      meta: "Briefing listo · 3 min de revisión",
    },
  ]);

  // Compose final list with the auto-approval task on top
  const aprobacionTarea: Tarea = {
    id: "t1",
    icon: CalendarCheck,
    label: "Aprobar contenido antes de las 10:00",
    detalle: todoAprobado
      ? "Todas las publicaciones aprobadas en el calendario · listo para programar."
      : `Aprueba las ${totalPublicaciones} publicaciones en la Sección 1. Esta tarea se completa sola al terminar.`,
    urgencia: "alta",
    tiempo: "5 min",
    hecho: todoAprobado,
    auto: true,
    link: { section: "calendar", cta: "Ir al calendario" },
    meta: `${aprobadasCount}/${totalPublicaciones} aprobadas · semana actual ${aprobadasSemanaActual}/${piezasSemanaActual}`,
  };

  const tareas = [aprobacionTarea, ...manualTareas];
  const pendientes = tareas.filter((t) => !t.hecho).length;
  const completadas = tareas.length - pendientes;
  const progreso = Math.round((completadas / tareas.length) * 100);

  // Subtle: when todoAprobado becomes true, ensure UI reflects instantly (state is derived from context)
  useEffect(() => {
    // no-op: derived value
  }, [todoAprobado]);

  const toggleManual = (id: string) =>
    setManualTareas((prev) => prev.map((x) => (x.id === id ? { ...x, hecho: !x.hecho } : x)));

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Acciones del founder</h2>
          <p className="text-xs text-muted-foreground">
            {pendientes} pendientes hoy · {completadas}/{tareas.length} listas
          </p>
        </div>
        <span className="rounded-md border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {progreso}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
          style={{ width: `${progreso}%` }}
        />
      </div>

      <ul className="mt-1 flex flex-col gap-2">
        {tareas.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.id}>
              <div
                className={cn(
                  "group flex items-start gap-3 rounded-lg border p-3 transition-colors",
                  t.hecho
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-border/40 bg-white/[0.02] hover:bg-white/[0.04]"
                )}
              >
                <Checkbox
                  checked={t.hecho}
                  disabled={t.auto}
                  onCheckedChange={() => !t.auto && toggleManual(t.id)}
                  className={cn("mt-0.5", t.auto && "cursor-not-allowed opacity-80")}
                />
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5",
                          t.hecho ? "text-emerald-400" : "text-muted-foreground"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium transition-all",
                          t.hecho ? "text-muted-foreground line-through" : "text-foreground"
                        )}
                      >
                        {t.label}
                      </span>
                    </div>
                    {t.auto && (
                      <span className="shrink-0 rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-primary">
                        Auto
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] leading-snug text-muted-foreground">{t.detalle}</p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className={cn("h-1.5 w-1.5 rounded-full", colorUrgencia[t.urgencia])} />
                      <span className="capitalize">{t.urgencia}</span>
                    </span>
                    <span>·</span>
                    <span>~{t.tiempo}</span>
                    {t.meta && (
                      <>
                        <span>·</span>
                        <span className="text-muted-foreground/80">{t.meta}</span>
                      </>
                    )}
                  </div>

                  {t.link && (
                    <button
                      type="button"
                      onClick={() => setActive(t.link!.section)}
                      className="mt-1 inline-flex w-fit items-center gap-1 rounded-md border border-border/60 bg-background/40 px-2 py-1 text-[10px] font-medium text-foreground/80 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                    >
                      {t.link.cta}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
