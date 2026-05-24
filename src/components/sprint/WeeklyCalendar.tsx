import { useMemo, useState } from "react";
import { useSection } from "./section-context";
import {
  Check,
  Circle,
  Clock,
  Linkedin,
  Mail,
  Video,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Hash,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Edit3,
  RefreshCw,
} from "lucide-react";
import { semanasCalendario, type Estado, type PublicacionDia } from "./mock-data";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const configEstado: Record<Estado, { icon: typeof Check; className: string; label: string }> = {
  publicado: { icon: Check, className: "bg-emerald-500/15 text-emerald-400", label: "Publicado" },
  en_curso: { icon: Clock, className: "bg-primary/15 text-primary", label: "En curso" },
  pendiente: { icon: Circle, className: "bg-white/5 text-muted-foreground", label: "Pendiente" },
};

const iconoCanal = {
  LinkedIn: Linkedin,
  "LinkedIn DM": MessageCircle,
  Newsletter: Mail,
  Studio: Video,
} as const;

const colorCanal: Record<string, string> = {
  LinkedIn: "text-[#4a9eff]",
  "LinkedIn DM": "text-[#4a9eff]",
  Newsletter: "text-emerald-300",
  Studio: "text-violet-300",
};

const mediaIcon = {
  imagen: ImageIcon,
  video: Video,
  carrusel: ImageIcon,
  email: Mail,
} as const;

export function WeeklyCalendar() {
  const [semanaIdx, setSemanaIdx] = useState(0);
  const [openDia, setOpenDia] = useState<PublicacionDia | null>(null);
  const { approvals, setApproval } = useSection();

  const semana = semanasCalendario[semanaIdx];
  const aprobadas = useMemo(
    () => semana.dias.filter((d) => approvals[`${semana.id}:${d.dia}`]).length,
    [approvals, semana],
  );

  const toggle = (dia: string) => {
    const key = `${semana.id}:${dia}`;
    setApproval(key, !approvals[key]);
  };

  const todasAprobadas = aprobadas === semana.dias.length;
  const aprobarTodas = () => {
    const objetivo = !todasAprobadas;
    semana.dias.forEach((d) => setApproval(`${semana.id}:${d.dia}`, objetivo));
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Calendario de publicación</h2>
          <p className="text-xs text-muted-foreground">
            {aprobadas}/{semana.dias.length} aprobadas · click en un día para revisar y editar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={aprobarTodas}
            size="sm"
            className={cn(
              "h-8 gap-1.5 text-xs",
              todasAprobadas
                ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Check className="h-3.5 w-3.5" />
            {todasAprobadas ? "Todas aprobadas" : `Autorizar las ${semana.dias.length} publicaciones`}
          </Button>

        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/60 p-1">
          <button
            onClick={() => setSemanaIdx((i) => Math.max(0, i - 1))}
            disabled={semanaIdx === 0}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-white/5 hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-col items-center px-2 leading-tight">
            <span className="text-[11px] font-medium text-foreground">{semana.label}</span>
            <span className="text-[10px] text-muted-foreground">{semana.rango}</span>
          </div>
          <button
            onClick={() => setSemanaIdx((i) => Math.min(semanasCalendario.length - 1, i + 1))}
            disabled={semanaIdx === semanasCalendario.length - 1}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-white/5 hover:text-foreground disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {semana.dias.map((d, i) => (
          <DiaCard
            key={`${semana.id}-${d.dia}`}
            dia={d}
            index={i}
            aprobado={!!approvals[`${semana.id}:${d.dia}`]}
            onOpen={() => setOpenDia(d)}
          />
        ))}
      </div>

      <Sheet open={!!openDia} onOpenChange={(o) => !o && setOpenDia(null)}>
        <SheetContent className="w-full overflow-y-auto border-l-border/60 bg-background/95 backdrop-blur-xl sm:max-w-xl">
          {openDia && (
            <DetalleDia
              dia={openDia}
              aprobado={!!approvals[`${semana.id}:${openDia.dia}`]}
              onToggle={() => toggle(openDia.dia)}
            />
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}

function DiaCard({
  dia,
  index,
  aprobado,
  onOpen,
}: {
  dia: PublicacionDia;
  index: number;
  aprobado: boolean;
  onOpen: () => void;
}) {
  const cfg = configEstado[dia.estado];
  const StatusIcon = cfg.icon;
  const CanalIcon = iconoCanal[dia.canal];
  const MediaIcon = mediaIcon[dia.contenido.mediaTipo];

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ animationDelay: `${index * 50}ms` }}
      className={cn(
        "group flex flex-col items-stretch gap-2.5 rounded-xl border bg-card/50 p-3 text-left transition-all animate-fade-in-up",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/80",
        aprobado ? "border-emerald-500/40" : "border-border/60",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{dia.dia}</div>
          <div className="text-[10px] text-muted-foreground/60">{dia.fecha}</div>
        </div>
        <div className={cn("flex h-5 w-5 items-center justify-center rounded-full", cfg.className)}>
          <StatusIcon className="h-2.5 w-2.5" strokeWidth={2.5} />
        </div>
      </div>

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md border border-white/5">
        {dia.contenido.mediaUrl ? (
          <img
            src={dia.contenido.mediaUrl}
            alt={dia.contenido.mediaLabel}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: dia.contenido.mediaPreview }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[9px] text-white/90 backdrop-blur">
          <MediaIcon className="h-2 w-2" />
          {dia.contenido.formato.split("·")[0].trim()}
        </div>
        <div className="absolute bottom-1.5 left-1.5 right-1.5 line-clamp-2 text-[10.5px] font-medium leading-snug text-white drop-shadow">
          {dia.contenido.titulo}
        </div>
      </div>

      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <CanalIcon className={cn("h-3 w-3", colorCanal[dia.canal])} />
          <span className="text-[10px] text-muted-foreground">{dia.canal}</span>
        </div>
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide",
            dia.prioridad === "Alta"
              ? "bg-rose-500/15 text-rose-300"
              : dia.prioridad === "Media"
                ? "bg-amber-500/15 text-amber-300"
                : "bg-white/5 text-muted-foreground",
          )}
        >
          {dia.prioridad}
        </span>
      </div>

      <div className="line-clamp-2 text-[10.5px] leading-snug text-muted-foreground">
        {dia.accion}
      </div>

      <div className="flex items-center justify-between gap-1.5 border-t border-border/40 pt-2">
        <div className="flex items-center gap-1 text-[10px] text-primary/80">
          <Sparkles className="h-2.5 w-2.5 shrink-0" />
          <span className="truncate">{dia.impacto}</span>
        </div>
        {aprobado && (
          <Check className="h-2.5 w-2.5 shrink-0 text-emerald-300" strokeWidth={3} />
        )}
      </div>

      {dia.contenido.hashtags && dia.contenido.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {dia.contenido.hashtags.slice(0, 3).map((h) => (
            <span
              key={h}
              className="rounded bg-white/5 px-1 py-0.5 text-[9px] text-muted-foreground/80"
            >
              {h}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

function DetalleDia({
  dia,
  aprobado,
  onToggle,
}: {
  dia: PublicacionDia;
  aprobado: boolean;
  onToggle: () => void;
}) {
  const CanalIcon = iconoCanal[dia.canal];

  return (
    <div className="flex flex-col gap-5">
      <SheetHeader className="space-y-1.5 text-left">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <CanalIcon className={cn("h-3.5 w-3.5", colorCanal[dia.canal])} />
          <span>{dia.canal}</span>
          <span>·</span>
          <span>
            {dia.dia} {dia.fecha}
          </span>
          <span>·</span>
          <span>{dia.contenido.formato}</span>
        </div>
        <SheetTitle className="text-lg leading-snug">{dia.contenido.titulo}</SheetTitle>
        <SheetDescription className="text-[11px]">
          Insight base · {dia.contenido.fuenteInsight}
        </SheetDescription>
      </SheetHeader>

      {/* Media */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-border/60">
        {dia.contenido.mediaUrl ? (
          <img
            src={dia.contenido.mediaUrl}
            alt={dia.contenido.mediaLabel}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: dia.contenido.mediaPreview }} />
        )}
      </div>
      <div className="-mt-3 text-[10px] text-muted-foreground">{dia.contenido.mediaLabel}</div>

      {/* Copy */}
      <div className="rounded-lg border border-border/60 bg-card/40 p-4">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Copy
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {dia.contenido.copy}
        </p>
      </div>

      {/* Hashtags */}
      {dia.contenido.hashtags && dia.contenido.hashtags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Hash className="h-3 w-3 text-muted-foreground" />
          {dia.contenido.hashtags.map((h) => (
            <span
              key={h}
              className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {h}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-[11px] text-primary/90">
        <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
        <span>{dia.contenido.cta}</span>
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-2 border-t border-border/60 pt-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={onToggle}
            className={cn(
              "h-9 flex-1 gap-1.5",
              aprobado
                ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Check className="h-4 w-4" />
            {aprobado ? "Aprobado" : "Aprobar publicación"}
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 border-border/60">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 flex-1 gap-1.5 text-xs">
            <Edit3 className="h-3.5 w-3.5" />
            Editar copy
          </Button>
          <Button variant="ghost" size="sm" className="h-8 flex-1 gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerar imagen
          </Button>
        </div>
      </div>
    </div>
  );
}
