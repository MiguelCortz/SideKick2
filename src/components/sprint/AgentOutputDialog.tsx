import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { semanasCalendario, type PublicacionDia } from "./mock-data";
import { FileText, Film, Send, Calendar, Hash, Sparkles, Play, Mail, Images, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AgentKey = "posts" | "video" | "publicacion";

const agentMeta: Record<AgentKey, { title: string; subtitle: string; icon: typeof FileText; accent: string }> = {
  posts: {
    title: "Agente de Posts · Output",
    subtitle: "Textos generados con el tono del founder, listos para LinkedIn",
    icon: FileText,
    accent: "from-[#0a66c2]/30 to-transparent text-[#4a9eff]",
  },
  video: {
    title: "Agente de Video · Output",
    subtitle: "Clips editados con subtítulos, b-roll y cortes profesionales",
    icon: Film,
    accent: "from-violet-500/30 to-transparent text-violet-300",
  },
  publicacion: {
    title: "Agente de Publicación · Output",
    subtitle: "Piezas programadas en LinkedIn API · scheduler activo",
    icon: Send,
    accent: "from-emerald-500/30 to-transparent text-emerald-300",
  },
};

function mediaIcon(tipo: PublicacionDia["contenido"]["mediaTipo"]) {
  if (tipo === "video") return Play;
  if (tipo === "email") return Mail;
  if (tipo === "carrusel") return Images;
  return ImageIcon;
}

export function AgentOutputDialog({
  agentKey,
  open,
  onOpenChange,
}: {
  agentKey: AgentKey | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!agentKey) return null;
  const meta = agentMeta[agentKey];
  const Icon = meta.icon;

  // Aplanar todas las piezas de las dos semanas
  const allItems = semanasCalendario.flatMap((s) =>
    s.dias.map((d) => ({ semana: s.label, rango: s.rango, ...d }))
  );

  // Filtrar según el agente
  const items = allItems.filter((it) => {
    if (agentKey === "video") return it.contenido.mediaTipo === "video";
    if (agentKey === "posts") return it.contenido.mediaTipo !== "video";
    return true; // publicación: todo
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-border/60 bg-card/95 p-0 backdrop-blur-xl">
        <DialogHeader className="border-b border-border/60 p-6">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br", meta.accent)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-base font-semibold">{meta.title}</DialogTitle>
              <DialogDescription className="text-xs">{meta.subtitle}</DialogDescription>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> {items.length} piezas
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            {items.map((it, i) => {
              const MIcon = mediaIcon(it.contenido.mediaTipo);
              return (
                <article
                  key={`${it.semana}-${it.dia}-${i}`}
                  className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-background/40"
                >
                  <div
                    className="relative flex h-40 items-end justify-between overflow-hidden p-3"
                    style={it.contenido.mediaUrl ? undefined : { background: it.contenido.mediaPreview }}
                  >
                    {it.contenido.mediaUrl && (
                      <>
                        <img
                          src={it.contenido.mediaUrl}
                          alt={it.contenido.titulo}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      </>
                    )}
                    <span className="relative inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                      <MIcon className="h-3 w-3" /> {it.contenido.formato}
                    </span>
                    <span className="relative rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                      {it.dia} · {it.fecha}
                    </span>
                    {it.contenido.mediaTipo === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                          <Play className="h-5 w-5 fill-white text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-border/60 text-[10px] font-normal">
                        {it.semana}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-normal",
                          it.estado === "publicado" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                          it.estado === "en_curso" && "border-primary/30 bg-primary/10 text-primary",
                          it.estado === "pendiente" && "border-border/60 text-muted-foreground"
                        )}
                      >
                        {it.estado === "publicado" ? "Publicado" : it.estado === "en_curso" ? "En curso" : "En cola"}
                      </Badge>
                    </div>

                    <h3 className="text-sm font-semibold leading-snug text-foreground">
                      {it.contenido.titulo}
                    </h3>

                    <p className="line-clamp-4 whitespace-pre-line text-[11px] leading-relaxed text-muted-foreground">
                      {it.contenido.copy}
                    </p>

                    {it.contenido.hashtags && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {it.contenido.hashtags.map((h) => (
                          <span key={h} className="inline-flex items-center gap-0.5 rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            <Hash className="h-2.5 w-2.5" />
                            {h.replace("#", "")}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex items-start gap-1.5 border-t border-border/60 pt-2 text-[10px] text-muted-foreground">
                      <Calendar className="mt-px h-3 w-3 shrink-0" />
                      <span>
                        <span className="text-foreground/80">CTA:</span> {it.contenido.cta}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground/80">
                      <span className="text-foreground/70">Fuente:</span> {it.contenido.fuenteInsight}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
