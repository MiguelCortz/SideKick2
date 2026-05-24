import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";
import { useSection } from "./section-context";
import { semanasCalendario } from "./mock-data";

export function TopHeader() {
  const { approvals } = useSection();

  const { pct, publicado, enCurso, enCola, total, aprobadas } = useMemo(() => {
    const semana = semanasCalendario[0];
    const dias = semana.dias;
    let suma = 0;
    let publicado = 0;
    let enCurso = 0;
    let enCola = 0;
    let aprobadas = 0;

    for (const d of dias) {
      const aprobado = approvals[`${semana.id}:${d.dia}`] ? 1 : 0;
      const prod =
        d.estado === "publicado" ? 1 : d.estado === "en_curso" ? 0.5 : 0;
      suma += prod * 0.6 + aprobado * 0.4;
      if (d.estado === "publicado") publicado++;
      else if (d.estado === "en_curso") enCurso++;
      else enCola++;
      if (aprobado) aprobadas++;
    }

    const pct = Math.round((suma / dias.length) * 100);
    return { pct, publicado, enCurso, enCola, total: dias.length, aprobadas };
  }, [approvals]);

  return (
    <header className="flex flex-col gap-5 border-b border-border/60 pb-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Semana 47 · Activa
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
          <Sparkles className="h-3 w-3" />
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Sprint de Ejecución Semanal
        </h1>

        <div className="flex min-w-[320px] flex-1 flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-3 py-2 backdrop-blur md:max-w-[640px]">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Sprint weekly
            </span>
            <span className="text-sm font-semibold text-foreground">{pct}%</span>
          </div>
          <div className="min-w-[120px] flex-1">
            <Progress value={pct} className="h-1.5" />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
            <span>
              <span className="font-medium text-emerald-300">{publicado}</span> publicado
            </span>
            <span>
              <span className="font-medium text-primary">{enCurso}</span> en curso
            </span>
            <span>
              <span className="font-medium text-foreground">{enCola}</span> en cola
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span>
              <span className="font-medium text-foreground">{aprobadas}</span>/{total} aprobadas
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

