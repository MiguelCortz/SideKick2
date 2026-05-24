import { Mail, Linkedin, Video, FileText, Sparkles, ArrowRight, Clock, Building2, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSection } from "./section-context";

type Temperatura = "Hot" | "Warm" | "Cold";

type Consumido = {
  tipo: "Newsletter" | "Post LinkedIn" | "Video" | "Carrusel";
  ref: string;
  fecha: string;
  signal: string;
  deliverableId?: string;
};

type Meeting = {
  id: string;
  hora: string;
  dia: string;
  prospect: {
    nombre: string;
    rol: string;
    empresa: string;
    arr: string;
    iniciales: string;
  };
  temperatura: Temperatura;
  scoreFit: number;
  consumido: Consumido[];
  hipotesis: string;
  angulo: string;
  preguntas: string[];
  proxima: string;
  fuenteOrigen: string;
};

const meetings: Meeting[] = [
  {
    id: "m1",
    hora: "10:30",
    dia: "Mar 19 Nov",
    prospect: {
      nombre: "Laura Bennett",
      rol: "VP Revenue",
      empresa: "Helio Payments",
      arr: "$48M ARR · Series B",
      iniciales: "LB",
    },
    temperatura: "Hot",
    scoreFit: 94,
    consumido: [
      { tipo: "Newsletter", ref: "Revenue Brief #46 · Forecast accuracy", fecha: "Vie 15 Nov", signal: "Abrió 3 veces · clic en framework", deliverableId: "d2" },
      { tipo: "Post LinkedIn", ref: "El error que cometen 9 de cada 10 founders", fecha: "Lun 18 Nov", signal: "Like + comentario: ‘esto nos pasa’", deliverableId: "d1" },
      { tipo: "Video", ref: "Sistema de revenue que no dependa del founder", fecha: "Mar 19 · 07:12", signal: "Vio 100% · guardó", deliverableId: "d3" },
    ],
    hipotesis: "Forecast en 61% — board pidió plan de 90 días. Buscan sistema, no más SDRs.",
    angulo: "Mostrar el case Verda SaaS (58% → 87% en 4 sprints). Mismo perfil, mismo problema.",
    preguntas: [
      "¿Qué pregunta del board está sin respuesta hoy?",
      "¿Cuál de las 3 señales de pipeline calificado no estás midiendo?",
      "Si tuvieras que cerrar Q4 en 30 días, ¿qué quitas del plan?",
    ],
    proxima: "Proponer diagnóstico 1:1 + acceso al playbook (CTA del Viernes)",
    fuenteOrigen: "Inbound desde post del Lunes · agente de scoring",
  },
  {
    id: "m2",
    hora: "14:00",
    dia: "Mié 20 Nov",
    prospect: {
      nombre: "Marcus Chen",
      rol: "Head of Sales",
      empresa: "Northwind Labs",
      arr: "$22M ARR · Series A",
      iniciales: "MC",
    },
    temperatura: "Warm",
    scoreFit: 81,
    consumido: [
      { tipo: "Carrusel", ref: "5 señales de que tu sistema comercial está roto", fecha: "Mié 20 Nov", signal: "Guardó + compartió interno", deliverableId: "c3" },
      { tipo: "Newsletter", ref: "Revenue Brief #45 · Discovery roto", fecha: "Vie 08 Nov", signal: "Abrió + reply: ‘interesa demo’" },
    ],
    hipotesis: "4 SDRs corriendo 4 playbooks distintos. Conversion meeting→opp en 9%.",
    angulo: "Caso Verda: 1 playbook unificado en 21 días = +28% meeting-to-opp.",
    preguntas: [
      "¿Cuántas versiones del discovery están vivas hoy?",
      "¿Quién es dueño del playbook — el founder o el equipo?",
      "¿Qué pasa si en 30 días tu SDR senior se va?",
    ],
    proxima: "Compartir framework de 3 preguntas (Video #2 del Martes próximo)",
    fuenteOrigen: "WhatsApp 14 Nov · seguimiento Northwind",
  },
  {
    id: "m3",
    hora: "16:30",
    dia: "Jue 21 Nov",
    prospect: {
      nombre: "Sofía Reyes",
      rol: "CRO",
      empresa: "Verda SaaS",
      arr: "$12M ARR · cliente activo",
      iniciales: "SR",
    },
    temperatura: "Hot",
    scoreFit: 97,
    consumido: [
      { tipo: "Newsletter", ref: "Revenue Brief #47 · Pipeline calificado", fecha: "Mié 20 Nov", signal: "Reply directo: ‘quiero ver el playbook’", deliverableId: "d2" },
      { tipo: "Post LinkedIn", ref: "El número que cambió cómo pensamos el discovery", fecha: "Jue 21 · 08:00", signal: "Comentario: ‘subámoslo en la sesión’", deliverableId: "c4" },
    ],
    hipotesis: "Cliente activo · expansión a equipo de partnerships. Sponsor interno listo.",
    angulo: "Validar resultados Q4 actuales (87% forecast) y abrir conversación expansión.",
    preguntas: [
      "¿Qué métrica del Q4 vas a presentar al board?",
      "¿Dónde sientes que el sistema todavía depende de ti?",
      "Si replicáramos esto en partnerships, ¿qué resultado esperarías en 60 días?",
    ],
    proxima: "Pre-propuesta expansión · ticket estimado +$36K ARR",
    fuenteOrigen: "Cliente activo · agente de cuentas + memoria comercial",
  },
];

const tempStyles: Record<Temperatura, string> = {
  Hot: "text-rose-300 bg-rose-400/10 border-rose-400/30",
  Warm: "text-amber-300 bg-amber-400/10 border-amber-400/30",
  Cold: "text-sky-300 bg-sky-400/10 border-sky-400/30",
};

const iconConsumido = {
  Newsletter: Mail,
  "Post LinkedIn": Linkedin,
  Video: Video,
  Carrusel: FileText,
};

export function MeetingPrepBriefings() {
  const { setActive } = useSection();
  return (
    <section id="meeting-prep" className="flex flex-col gap-4 scroll-mt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">

        <div>
          <h2 className="text-lg font-semibold text-foreground">Meeting Prep Briefings · Esta semana</h2>
          <p className="text-xs text-muted-foreground">
            3 reuniones priorizadas · cada brief construido desde el contenido que ya consumieron
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] text-primary">
          <Sparkles className="h-3 w-3" />
          Briefs generados desde Sprint Deliverables
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {meetings.map((m, i) => (
          <article
            key={m.id}
            style={{ animationDelay: `${i * 80}ms` }}
            className="group grid grid-cols-1 gap-5 rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 animate-fade-in-up hover:border-primary/40 hover:shadow-[var(--shadow-glow)] lg:grid-cols-[260px_1fr]"
          >
            {/* Prospect column */}
            <div className="flex flex-col gap-3 border-b border-border/40 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="font-medium text-foreground">{m.dia}</span>
                <span>·</span>
                <span>{m.hora}</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-semibold text-primary">
                  {m.prospect.iniciales}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-foreground">{m.prospect.nombre}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{m.prospect.rol}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Building2 className="h-3 w-3" />
                <span className="truncate">{m.prospect.empresa}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>{m.prospect.arr}</span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", tempStyles[m.temperatura])}>
                  {m.temperatura}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Fit</span>
                  <span className="text-sm font-semibold text-foreground">{m.scoreFit}</span>
                  <span className="text-[10px] text-muted-foreground">/100</span>
                </div>
              </div>

              <div className="rounded-md border border-border/40 bg-background/40 px-2 py-1.5 text-[10px] text-muted-foreground">
                <span className="text-foreground/80">Origen:</span> {m.fuenteOrigen}
              </div>
            </div>

            {/* Brief column */}
            <div className="flex flex-col gap-4">
              {/* Consumed */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Consumió de nuestro contenido
                  </div>
                  <span className="text-[10px] text-muted-foreground">{m.consumido.length} señales</span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {m.consumido.map((c, idx) => {
                    const Icon = iconConsumido[c.tipo];
                    return (
                      <li
                        key={idx}
                        className="flex items-start gap-2 rounded-lg border border-border/40 bg-background/40 px-2.5 py-2 text-[11px]"
                      >
                        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-medium text-foreground">{c.tipo}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="truncate text-foreground/80">{c.ref}</span>
                            {c.deliverableId && (
                              <span className="rounded bg-primary/10 px-1.5 py-0 text-[9px] font-medium text-primary">
                                #{c.deliverableId}
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <span>{c.fecha}</span>
                            <span>·</span>
                            <span className="text-emerald-300/90">{c.signal}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Hipótesis + Ángulo */}
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="rounded-lg border border-border/40 bg-background/40 p-3">
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Hipótesis</div>
                  <p className="text-xs leading-relaxed text-foreground/90">{m.hipotesis}</p>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/[0.05] p-3">
                  <div className="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-primary">
                    <Target className="h-2.5 w-2.5" />
                    Ángulo de apertura
                  </div>
                  <p className="text-xs leading-relaxed text-foreground">{m.angulo}</p>
                </div>
              </div>

              {/* Preguntas */}
              <div>
                <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  3 preguntas para los primeros 8 minutos
                </div>
                <ol className="flex flex-col gap-1">
                  {m.preguntas.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground/85">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[9px] font-semibold text-primary">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Next step */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3">
                <div className="text-[11px] text-muted-foreground">
                  <span className="text-foreground/80">Próximo paso:</span> {m.proxima}
                </div>
                <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-foreground hover:bg-primary/10 hover:text-primary">
                  Abrir brief completo
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Section nav */}
      <div className="mt-2 flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur">
        <div className="text-[11px] text-muted-foreground">
          <span className="text-foreground/80">Siguiente:</span> Sprint Semanal · Calendario + Founder Tasks
        </div>
        <Button onClick={() => setActive("calendar")} size="sm" className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
          Ir al Sprint Semanal
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </section>
  );
}
