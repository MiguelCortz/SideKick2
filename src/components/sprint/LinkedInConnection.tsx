import { Linkedin, CheckCircle2, Calendar, Zap } from "lucide-react";

export function LinkedInConnection() {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a66c2]">
          <Linkedin className="h-6 w-6 text-white" />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-emerald-500">
            <CheckCircle2 className="h-2.5 w-2.5 text-white" />
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">LinkedIn conectado</span>
            <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-300">
              Activo
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            in/founder-revenue · publicación automática habilitada · OAuth válido hasta Mar 2026
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span><span className="font-medium text-foreground">10 piezas</span> programadas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span>Próxima: <span className="font-medium text-foreground">Lun 18 · 08:30</span></span>
        </div>
      </div>
    </section>
  );
}
