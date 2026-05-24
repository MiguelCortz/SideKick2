import post1 from "@/assets/posts/post-1.jpg";
import post2 from "@/assets/posts/post-2.jpg";
import post3 from "@/assets/posts/post-3.jpg";
import post4 from "@/assets/posts/post-4.jpg";
import post5 from "@/assets/posts/post-5.jpg";
import post6 from "@/assets/posts/post-6.jpg";
import post7 from "@/assets/posts/post-7.jpg";
import post8 from "@/assets/posts/post-8.jpg";
import post9 from "@/assets/posts/post-9.jpg";
import post10 from "@/assets/posts/post-10.jpg";

export type Prioridad = "Alta" | "Media" | "Baja";
export type Estado = "publicado" | "en_curso" | "pendiente";
export type Plataforma = "LinkedIn";

export type PublicacionDia = {
  dia: string;
  fecha: string;
  canal: "LinkedIn" | "LinkedIn DM" | "Newsletter" | "Studio";
  accion: string;
  prioridad: Prioridad;
  impacto: string;
  estado: Estado;
  contenido: {
    formato: string;
    titulo: string;
    copy: string;
    hashtags?: string[];
    cta: string;
    mediaTipo: "imagen" | "video" | "carrusel" | "email";
    mediaPreview: string;
    mediaUrl?: string;
    mediaLabel: string;
    fuenteInsight: string;
  };
};

export const semanasCalendario: { id: string; label: string; rango: string; dias: PublicacionDia[] }[] = [
  {
    id: "w47",
    label: "Semana actual",
    rango: "18 – 22 Nov",
    dias: [
      {
        dia: "Lunes", fecha: "18 Nov", canal: "LinkedIn", accion: "Publicar awareness post",
        prioridad: "Alta", impacto: "+12% alcance proyectado", estado: "publicado",
        contenido: {
          formato: "Post largo · LinkedIn",
          titulo: "El error que cometen 9 de cada 10 founders en su forecast",
          copy: "Esta semana hablé con 3 founders B2B y todos coincidieron en lo mismo:\n\nConfunden actividad con progreso.\n\nHicimos los números con uno de ellos:\n→ 1,247 touches en 30 días\n→ Solo 11% generó señal real\n→ El 89% restante fue ruido caro\n\nEl problema no es el equipo. Es el sistema que mide lo que ya pasó en vez de construir lo que viene.\n\nAquí están las 3 señales que SÍ predicen revenue ↓",
          hashtags: ["#RevenueOps", "#B2BSales", "#FounderLed"],
          cta: "Comenta ‘sistema’ y te mando el framework completo.",
          mediaTipo: "imagen",
          mediaPreview: "linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #db2777 100%)",
          mediaUrl: post1,
          mediaLabel: "Carátula · dato 1,247 → 11%",
          fuenteInsight: "Llamada Mara Okafor · 12 Nov",
        },
      },
      {
        dia: "Martes", fecha: "19 Nov", canal: "Studio", accion: "Grabar video founder (45s)",
        prioridad: "Alta", impacto: "Insumo clave para Jueves", estado: "en_curso",
        contenido: {
          formato: "Video vertical 9:16 · 45s",
          titulo: "Cómo construir un sistema de revenue que no dependa del founder",
          copy: "HOOK (0–3s): Si tu pipeline depende de tu calendario, no tienes un sistema. Tienes un cuello de botella.\n\nBEAT 1 (3–15s): Caso real de un cliente esta semana — 4 SDRs, 4 playbooks, 0 consistencia.\n\nBEAT 2 (15–30s): Lo que cambiamos en 7 días.\n\nBEAT 3 (30–40s): Resultado medible (MQL→SQL +28%).\n\nCTA (40–45s): ‘Si querés el playbook, dejá ‘playbook’ abajo.’",
          cta: "DM ‘playbook’ para recibir el documento.",
          mediaTipo: "video",
          mediaPreview: "linear-gradient(135deg, #0f172a 0%, #6366f1 100%)",
          mediaUrl: post2,
          mediaLabel: "Storyboard · 4 beats · vertical 9:16",
          fuenteInsight: "Reunión Verda SaaS · 15 Nov",
        },
      },
      {
        dia: "Miércoles", fecha: "20 Nov", canal: "Newsletter", accion: "Aprobar newsletter semanal",
        prioridad: "Media", impacto: "1.2K suscriptores activos", estado: "pendiente",
        contenido: {
          formato: "Newsletter · email semanal",
          titulo: "Revenue Notes #47 — La pregunta que nadie hace en discovery",
          copy: "Subject: La pregunta que NADIE hace en los primeros 8 minutos\n\nHola founder,\n\nEsta semana revisamos 1,247 discovery calls. El 89% murió en los primeros 8 minutos por una razón simple: nadie hizo LA pregunta.\n\nAdentro:\n• La pregunta exacta (palabra por palabra)\n• 3 ejemplos reales (anonimizados)\n• El template para tu equipo\n\nLeer (4 min) →",
          cta: "Botón: ‘Leer el análisis completo’",
          mediaTipo: "email",
          mediaPreview: "linear-gradient(135deg, #047857 0%, #0891b2 100%)",
          mediaUrl: post3,
          mediaLabel: "Header email · estilo editorial",
          fuenteInsight: "Síntesis 4 cuentas · semana 47",
        },
      },
      {
        dia: "Jueves", fecha: "21 Nov", canal: "LinkedIn", accion: "Publicar carrusel educativo",
        prioridad: "Alta", impacto: "Activo evergreen · save rate >8%", estado: "pendiente",
        contenido: {
          formato: "Carrusel · 7 slides · LinkedIn",
          titulo: "Las 3 señales que predicen tu próximo trimestre (antes que el CRM)",
          copy: "Carrusel de 7 slides diseñado por el agente de diseño:\n\nSlide 1 · Hook: ‘Tu CRM te dice lo que ya pasó. Estas 3 señales te dicen lo que viene.’\nSlide 2 · Contexto: por qué el forecast tradicional falla en founder-led sales.\nSlide 3 · Señal #1 · Velocidad de respuesta del ICP correcto (no del lead promedio).\nSlide 4 · Señal #2 · Densidad de objeciones repetidas en discovery (patrón > volumen).\nSlide 5 · Señal #3 · Tiempo entre ‘interesante’ y ‘mandame propuesta’ (compresión = intent real).\nSlide 6 · Mini-framework: cómo trackearlas sin tooling nuevo.\nSlide 7 · CTA: ‘Comentá ‘señales’ y te mando el template de tracking.’\n\nDiseño: tipografía editorial, paleta dark premium, layout 4:5 optimizado para feed.",
          hashtags: ["#RevenueOps", "#FounderLed", "#B2BSales"],
          cta: "Comentar ‘señales’ → DM con template de tracking",
          mediaTipo: "carrusel",
          mediaPreview: "linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)",
          mediaUrl: post4,
          mediaLabel: "Carrusel · 7 slides · 4:5",
          fuenteInsight: "Síntesis 7 discoveries · semanas 46-47",
        },
      },
      {
        dia: "Viernes", fecha: "22 Nov", canal: "LinkedIn", accion: "Publicar CTA de conversión",
        prioridad: "Alta", impacto: "Cierre semanal · pipeline", estado: "pendiente",
        contenido: {
          formato: "Post conversión · LinkedIn",
          titulo: "Lo que aprendí esta semana hablando con 7 founders B2B",
          copy: "7 conversaciones. 1 patrón.\n\nTodos están midiendo lo que YA pasó (MRR, pipeline, win rate).\nNadie está construyendo el sistema para lo que VIENE.\n\nLes dije lo mismo a los 7:\n\n‘Tu forecast no es un número. Es una hipótesis. Y si no podés defender las 3 señales que la sostienen, no tenés forecast — tenés deseo.’\n\nEsta semana abro 3 espacios para diagnóstico de revenue system (90 min, sin costo, founders >$500K ARR).\n\nSi querés uno, comentá ‘diagnóstico’ ↓",
          hashtags: ["#RevenueLeadership", "#FounderLed"],
          cta: "Comentar ‘diagnóstico’ → DM con Calendly",
          mediaTipo: "imagen",
          mediaPreview: "linear-gradient(135deg, #be185d 0%, #f59e0b 100%)",
          mediaUrl: post5,
          mediaLabel: "Cita destacada · tipografía editorial",
          fuenteInsight: "Síntesis semanal · agente memoria",
        },
      },
    ],
  },
  {
    id: "w48",
    label: "Próxima semana",
    rango: "25 – 29 Nov",
    dias: [
      {
        dia: "Lunes", fecha: "25 Nov", canal: "LinkedIn", accion: "Post analítico · pipeline calificado",
        prioridad: "Alta", impacto: "Predicción 5.4K impresiones", estado: "pendiente",
        contenido: {
          formato: "Post largo · LinkedIn",
          titulo: "Por qué tu ‘pipeline calificado’ probablemente no lo está",
          copy: "Revisamos 4 pipelines de clientes esta semana.\n\nEl 62% de los deals marcados como ‘calificados’ no tenían NI UNA de las 3 señales que importan:\n\n1. Un dolor cuantificado en dinero\n2. Un compelling event con fecha\n3. Un sponsor con poder de firma\n\nSin las 3, no es pipeline. Es esperanza con CRM.\n\nEsto fue lo que cambiamos ↓",
          hashtags: ["#PipelineHygiene", "#RevOps"],
          cta: "Guarda este post para tu próximo pipeline review.",
          mediaTipo: "imagen",
          mediaPreview: "linear-gradient(135deg, #312e81 0%, #be123c 100%)",
          mediaUrl: post6,
          mediaLabel: "Visual · 62% en rojo",
          fuenteInsight: "Patrón detectado en 4 clientes",
        },
      },
      {
        dia: "Martes", fecha: "26 Nov", canal: "Studio", accion: "Video framework 3 preguntas",
        prioridad: "Alta", impacto: "Insumo para newsletter Miércoles", estado: "pendiente",
        contenido: {
          formato: "Video vertical 9:16 · 45s",
          titulo: "El framework de 3 preguntas para cerrar más rápido",
          copy: "HOOK (0–3s): Dejá de hacer demos. Empezá con estas 3 preguntas.\n\nBEAT 1: ‘¿Qué pasa si no resolvés esto en 90 días?’\nBEAT 2: ‘¿Quién más en la organización vive este dolor?’\nBEAT 3: ‘Si tuvieras que defender este budget mañana, ¿qué dirías?’\n\nCTA: ‘Probalo una mañana. Contame cómo te fue.’",
          cta: "DM si querés el script completo",
          mediaTipo: "video",
          mediaPreview: "linear-gradient(135deg, #0c4a6e 0%, #7c3aed 100%)",
          mediaUrl: post7,
          mediaLabel: "Storyboard · 3 preguntas en pantalla",
          fuenteInsight: "Helio Payments · llamada 12 Nov",
        },
      },
      {
        dia: "Miércoles", fecha: "27 Nov", canal: "LinkedIn", accion: "Carrusel · caso 58% → 87%",
        prioridad: "Alta", impacto: "Predicción 14K alcance", estado: "pendiente",
        contenido: {
          formato: "Carrusel · 8 slides",
          titulo: "Cómo subimos forecast accuracy del 58% al 87% en 4 semanas",
          copy: "Slide 1 — Problema: forecast en 58%, board impaciente.\nSlide 2 — Diagnóstico: 4 SDRs, 4 playbooks, 0 consistencia.\nSlide 3 — Decisión: un único criterio de calificación.\nSlide 4 — Pipeline review semanal de 30 min.\nSlide 5 — Matar deals zombies (>45 días sin movimiento).\nSlide 6 — Forecast en 3 escenarios (commit / best / pull-in).\nSlide 7 — Resultado: 87% accuracy en semana 4.\nSlide 8 — ‘Guarda esto para tu próximo board.’",
          cta: "Compartir con tu Head of Sales",
          mediaTipo: "carrusel",
          mediaPreview: "linear-gradient(135deg, #064e3b 0%, #0d9488 50%, #facc15 100%)",
          mediaUrl: post8,
          mediaLabel: "8 slides · gráfico 58→87",
          fuenteInsight: "Northwind Labs · seguimiento",
        },
      },
      {
        dia: "Jueves", fecha: "28 Nov", canal: "LinkedIn", accion: "Post dato · SDRs improvisan",
        prioridad: "Media", impacto: "Predicción 4.7K impresiones", estado: "pendiente",
        contenido: {
          formato: "Post dato · LinkedIn",
          titulo: "1 de cada 3 SDRs improvisa su discovery. Esto pasa cuando lo arreglás.",
          copy: "Verda SaaS tenía 4 SDRs corriendo 4 playbooks distintos.\nMQL→SQL: 11%.\n\nHicimos UNO solo. Mismas 5 preguntas. Mismo criterio. Misma forma de tomar notas.\n\nResultado en 21 días:\n→ MQL→SQL: 11% → 39%\n→ Discovery: 42 min → 28 min\n→ Stage 2 con sponsor: 23% → 81%\n\nEl problema casi nunca es la gente. Es el sistema.",
          hashtags: ["#SalesEnablement", "#Discovery"],
          cta: "¿Tu equipo tiene UN playbook o 4?",
          mediaTipo: "imagen",
          mediaPreview: "linear-gradient(135deg, #7c2d12 0%, #f59e0b 100%)",
          mediaUrl: post9,
          mediaLabel: "Visual · barras 11% → 39%",
          fuenteInsight: "Verda SaaS · reunión 15 Nov",
        },
      },
      {
        dia: "Viernes", fecha: "29 Nov", canal: "LinkedIn", accion: "Post reflexión · board sessions",
        prioridad: "Alta", impacto: "Predicción 3.8K · alto save rate", estado: "pendiente",
        contenido: {
          formato: "Post reflexión · LinkedIn",
          titulo: "El board no quiere ver tu pipeline. Quiere ver tu sistema.",
          copy: "Esta semana acompañé a un founder a una sesión de board.\n\nLa pregunta no fue cuánto. Fue cómo.\nY nadie tenía la respuesta clara.\n\nEn 48h armamos:\n• 1 dashboard con 3 métricas (no 30)\n• 1 narrativa de 90 segundos sobre por qué esas 3\n• 1 plan de 90 días con dueños y fechas\n\nEl board no aplaudió. Hizo algo mejor: dejó de preguntar.\n\nSi estás preparando un board, no lleves números. Llevá un sistema.",
          hashtags: ["#BoardReadiness", "#FounderLed"],
          cta: "DM ‘board’ para el template de 90 segundos.",
          mediaTipo: "imagen",
          mediaPreview: "linear-gradient(135deg, #18181b 0%, #52525b 50%, #c9a84c 100%)",
          mediaUrl: post10,
          mediaLabel: "Cita editorial · fondo boardroom",
          fuenteInsight: "Síntesis sesión board cliente",
        },
      },
    ],
  },
];

export const diasSemana = semanasCalendario[0].dias;

export const accionesFounder = [
  { id: "t1", label: "Aprobar contenido antes de las 10:00", urgencia: "alta", tiempo: "5 min", hecho: false },
  { id: "t2", label: "Subir métrica de cliente", urgencia: "alta", tiempo: "2 min", hecho: false },
  { id: "t3", label: "Grabar clip de 45s", urgencia: "alta", tiempo: "15 min", hecho: false },
  { id: "t4", label: "Revisar CTA", urgencia: "media", tiempo: "3 min", hecho: false },
];

export type Semana = "Semana 47" | "Semana 48";

export const contenidoGenerado: {
  id: string;
  semana: Semana;
  fecha: string;
  hora: string;
  formato: "Post largo" | "Video corto" | "Carrusel" | "Post reflexión" | "Post dato";
  titulo: string;
  tono: string;
  preview: string;
  metrica: string;
  estado: "borrador" | "aprobado" | "programado";
  fuenteInsight: string;
}[] = [
  // Semana actual (47)
  { id: "c1", semana: "Semana 47", fecha: "Lun 18 Nov", hora: "08:30", formato: "Post largo", titulo: "El error que cometen 9 de cada 10 founders en su forecast", tono: "Analítico", preview: "Esta semana, 3 de tus clientes coincidieron en lo mismo: confunden actividad con progreso. Hicimos los números — 1,247 touches y solo 11% generó señal. Aquí lo que vimos en el 89% restante…", metrica: "Est. 4.8K impresiones · 38 leads", estado: "aprobado", fuenteInsight: "Llamada Mara Okafor · 12 Nov" },
  { id: "c2", semana: "Semana 47", fecha: "Mar 19 Nov", hora: "07:45", formato: "Video corto", titulo: "Cómo construir un sistema de revenue que no dependa del founder", tono: "Educativo", preview: "Hook (0–3s): Si tu pipeline depende de tu calendario, no tienes un sistema, tienes un cuello de botella. Beats (3–35s): el caso real con un cliente esta semana. Cierre con CTA suave…", metrica: "Objetivo: 45s · vertical 9:16", estado: "borrador", fuenteInsight: "Reunión Verda SaaS · 15 Nov" },
  { id: "c3", semana: "Semana 47", fecha: "Mié 20 Nov", hora: "09:15", formato: "Carrusel", titulo: "5 señales de que tu sistema comercial está roto", tono: "Directo", preview: "Slide 1: Tu CRM no es el problema. Slide 2–6: cada señal con ejemplo real (anonimizado) de un cliente que factura $2M ARR. Slide 7: CTA…", metrica: "Est. 12K alcance · 4.2% guardados", estado: "borrador", fuenteInsight: "Northwind Labs · WhatsApp 14 Nov" },
  { id: "c4", semana: "Semana 47", fecha: "Jue 21 Nov", hora: "08:00", formato: "Post dato", titulo: "El número que cambió cómo pensamos el discovery", tono: "Punzante", preview: "Analizamos 1,247 discovery calls este trimestre. Solo el 11% terminó en señal real. La razón está en una pregunta que NADIE hace en los primeros 8 minutos…", metrica: "Est. 6.1K impresiones · 22 leads", estado: "programado", fuenteInsight: "Agregado de 4 cuentas · semana 47" },
  { id: "c5", semana: "Semana 47", fecha: "Vie 22 Nov", hora: "10:30", formato: "Post reflexión", titulo: "Lo que aprendí esta semana hablando con 7 founders", tono: "Personal", preview: "7 conversaciones. 1 patrón. Todos están midiendo lo que ya pasó y nadie está construyendo el sistema para lo que viene. Esto fue lo que les dije…", metrica: "Est. 3.2K impresiones · alto save rate", estado: "borrador", fuenteInsight: "Síntesis semanal · agente memoria" },

  // Semana siguiente (48)
  { id: "c6", semana: "Semana 48", fecha: "Lun 25 Nov", hora: "08:30", formato: "Post largo", titulo: "Por qué tu ‘pipeline calificado’ probablemente no lo está", tono: "Analítico", preview: "Acabamos de revisar 4 pipelines de clientes. El 62% de los deals marcados como ‘calificados’ no tenían ni una de las 3 señales que importan. Esto es lo que cambiamos…", metrica: "Predicción: 5.4K impresiones", estado: "borrador", fuenteInsight: "Patrón detectado en 4 clientes" },
  { id: "c7", semana: "Semana 48", fecha: "Mar 26 Nov", hora: "07:45", formato: "Video corto", titulo: "El framework de 3 preguntas para cerrar más rápido", tono: "Hook fuerte", preview: "Hook (0–3s): Deja de hacer demos. Empieza con estas 3 preguntas. Beats (3–35s): cada pregunta + el momento exacto en una llamada real. Cierre: invitación…", metrica: "Objetivo: 45s · vertical 9:16", estado: "borrador", fuenteInsight: "Helio Payments · llamada 12 Nov" },
  { id: "c8", semana: "Semana 48", fecha: "Mié 27 Nov", hora: "09:15", formato: "Carrusel", titulo: "El playbook que usamos para subir forecast accuracy del 58% al 87%", tono: "Caso", preview: "Slide 1: el problema (forecast en 58%). Slides 2–7: las 6 decisiones que tomamos en 4 semanas. Slide 8: resultado + CTA…", metrica: "Predicción: 14K alcance", estado: "borrador", fuenteInsight: "Northwind Labs · seguimiento" },
  { id: "c9", semana: "Semana 48", fecha: "Jue 28 Nov", hora: "08:00", formato: "Post dato", titulo: "1 de cada 3 SDRs improvisa su discovery. Esto pasa cuando lo arreglas.", tono: "Punzante", preview: "Verda SaaS tenía 4 SDRs corriendo 4 playbooks distintos. Hicimos UNO solo. En 21 días: +28% en meeting-to-opportunity…", metrica: "Predicción: 4.7K impresiones", estado: "borrador", fuenteInsight: "Verda SaaS · reunión 15 Nov" },
  { id: "c10", semana: "Semana 48", fecha: "Vie 29 Nov", hora: "10:30", formato: "Post reflexión", titulo: "El board no quiere ver tu pipeline. Quiere ver tu sistema.", tono: "Personal", preview: "Esta semana acompañé a un founder a una sesión de board. La pregunta no fue cuánto. Fue cómo. Y nadie tenía la respuesta clara. Esto fue lo que armamos en 48h…", metrica: "Predicción: 3.8K impresiones", estado: "borrador", fuenteInsight: "Síntesis sesión board cliente" },
];

export const agentes: {
  id: string;
  nombre: string;
  rol: string;
  estado: "completado" | "ejecutando" | "en_cola";
  progreso: number;
  piezas: number;
  detalle: string;
}[] = [
  { id: "a1", nombre: "Agente de Posts", rol: "Texto LinkedIn", estado: "completado", progreso: 100, piezas: 8, detalle: "8 posts generados · 2 semanas · tono calibrado al founder" },
  { id: "a2", nombre: "Agente de Video", rol: "Edición profesional", estado: "ejecutando", progreso: 64, piezas: 2, detalle: "Editando clip Martes · subtítulos + b-roll en proceso" },
  { id: "a3", nombre: "Agente de Publicación", rol: "LinkedIn API · scheduler", estado: "en_cola", progreso: 0, piezas: 10, detalle: "Listo para programar 10 piezas en cuenta del founder" },
];

// Etapas del pipeline de edición de video (mock visual)
export const etapasVideo: {
  id: string;
  nombre: string;
  estado: "completado" | "ejecutando" | "pendiente";
  detalle: string;
}[] = [
  { id: "v1", nombre: "Transcripción", estado: "completado", detalle: "Whisper · 02:14 procesados" },
  { id: "v2", nombre: "Guion + hook", estado: "completado", detalle: "Hook reescrito · 3 variantes" },
  { id: "v3", nombre: "Cortes inteligentes", estado: "completado", detalle: "12 cortes · pausas eliminadas" },
  { id: "v4", nombre: "B-roll & overlays", estado: "ejecutando", detalle: "Insertando 4 b-rolls contextuales" },
  { id: "v5", nombre: "Subtítulos animados", estado: "pendiente", detalle: "Estilo founder · marca registrada" },
  { id: "v6", nombre: "Render final 1080p", estado: "pendiente", detalle: "Vertical 9:16 · listo para LinkedIn" },
];

// Video raw subido por el founder
export const videoRaw = {
  nombre: "founder-clip-martes.mov",
  duracion: "02:14",
  peso: "184 MB",
  subidoHace: "hace 2 horas",
  resolucionOriginal: "4K · horizontal",
  resolucionSalida: "1080p · vertical 9:16",
};

// Interacciones con clientes — auto-sincronizado de Gmail, Calendar, Zoom, WhatsApp Business, HubSpot
export type FuenteInteraccion = "Zoom" | "Gmail" | "Calendar" | "WhatsApp" | "HubSpot" | "LinkedIn DM";

export type InteraccionCliente = {
  id: string;
  cliente: string;
  empresa: string;
  cargo: string;
  iniciales: string;
  fuente: FuenteInteraccion;
  tipo: string;
  fecha: string;
  hora: string;
  duracion?: string;
  arr: string;
  etapa: "Discovery" | "Negociación" | "Cliente activo" | "Renovación" | "Riesgo";
  sentimiento: "positivo" | "neutro" | "riesgo";
  insight: string;
  accionSugerida: string;
  usadoEn: string;
  // — enriquecido —
  historial: { totalTouches: number; primeraInteraccion: string; ultimasN: number };
  buyingSignals: { score: number; cambio: number; señales: string[] };
  quote: { texto: string; minuto?: string };
  dolores: string[];
  decisionMakers: { nombre: string; rol: string; poder: "Decisor" | "Influencer" | "Bloqueador" | "Champion" }[];
  proximoPaso: { que: string; cuando: string; owner: "Founder" | "Agente" };
  contextoDeal: { etapaCRM: string; montoPotencial: string; probabilidad: number; bloqueadores: string[] };
  temasDetectados: string[];
};

export const interaccionesCliente: InteraccionCliente[] = [
  {
    id: "i1", cliente: "Mara Okafor", empresa: "Helio Payments", cargo: "Co-founder & CRO", iniciales: "MO",
    fuente: "Zoom", tipo: "Llamada estratégica", fecha: "12 Nov", hora: "10:30", duracion: "48 min",
    arr: "$2.4M ARR", etapa: "Cliente activo", sentimiento: "positivo",
    insight: "Pierde 18–22% de atribución de pipeline por tracking fragmentado entre HubSpot y Segment.",
    accionSugerida: "Proponer audit de atribución de 2 semanas",
    usadoEn: "Post Lun 18 Nov · Video Mar 26",
    historial: { totalTouches: 23, primeraInteraccion: "Mar 2024", ultimasN: 4 },
    buyingSignals: { score: 87, cambio: +12, señales: [
      "Mencionó budget Q1 disponible (min 14:22)",
      "Pidió referencia de cliente similar (min 31:05)",
      "Compartió pantalla con su CRM real",
      "Involucró a su VP Finance en el call",
    ]},
    quote: { texto: "Si me ayudas a recuperar aunque sea la mitad de ese 20%, esto se paga solo el primer mes.", minuto: "min 38:14" },
    dolores: [
      "Forecast no confiable: el board pidió cambiar la metodología en 60 días",
      "Atribución rota entre HubSpot ↔ Segment ↔ Stripe",
      "3 SDRs salieron en Q3, equipo en reconstrucción",
    ],
    decisionMakers: [
      { nombre: "Mara Okafor", rol: "Co-founder & CRO", poder: "Decisor" },
      { nombre: "Jordan Lee", rol: "VP Finance", poder: "Influencer" },
      { nombre: "Sam Patel", rol: "Head of RevOps", poder: "Champion" },
    ],
    proximoPaso: { que: "Enviar propuesta de audit (2 semanas, $18K)", cuando: "Antes del Jue 21 Nov", owner: "Founder" },
    contextoDeal: { etapaCRM: "Expansion · upsell", montoPotencial: "+$36K ARR / año", probabilidad: 72, bloqueadores: ["Aprobación CFO pendiente"] },
    temasDetectados: ["Atribución", "Forecast", "Board pressure", "Expansion"],
  },
  {
    id: "i2", cliente: "David Reyes", empresa: "Northwind Labs", cargo: "CEO", iniciales: "DR",
    fuente: "WhatsApp", tipo: "Mensaje directo", fecha: "14 Nov", hora: "21:14",
    arr: "$1.1M ARR", etapa: "Riesgo", sentimiento: "riesgo",
    insight: "Forecast bajo 60%, presión del board en aumento. Pidió ayuda urgente para sesión del 28 Nov.",
    accionSugerida: "Agendar working session esta semana",
    usadoEn: "Carrusel Mié 27 Nov",
    historial: { totalTouches: 41, primeraInteraccion: "Oct 2023", ultimasN: 7 },
    buyingSignals: { score: 54, cambio: -18, señales: [
      "Mensaje a las 21:14 un viernes — urgencia real",
      "Pidió ‘sesión’ sin pedir precio — confianza alta",
      "Mencionó al board 3 veces en 4 mensajes",
      "No abrió el último deck (señal mixta)",
    ]},
    quote: { texto: "El lunes me preguntan números que no tengo. Necesito tu ayuda antes del miércoles, no después." },
    dolores: [
      "Sesión de board el 28 Nov sin historia clara",
      "Pipeline review semanal sin un solo criterio compartido",
      "Forecast accuracy 58% — meta del board 80%",
      "CFO empujando recorte de equipo comercial",
    ],
    decisionMakers: [
      { nombre: "David Reyes", rol: "CEO", poder: "Decisor" },
      { nombre: "Karen Wu", rol: "CFO", poder: "Bloqueador" },
      { nombre: "Ana Torres", rol: "VP Sales (nueva)", poder: "Champion" },
    ],
    proximoPaso: { que: "Working session de 90 min · armar narrativa del board", cuando: "Mar 19 Nov · 16:00", owner: "Founder" },
    contextoDeal: { etapaCRM: "Retención · riesgo de churn", montoPotencial: "Renovación $1.1M ARR", probabilidad: 48, bloqueadores: ["CFO escéptico", "Board impaciente"] },
    temasDetectados: ["Board", "Forecast", "Churn risk", "Crisis"],
  },
  {
    id: "i3", cliente: "Laura Méndez", empresa: "Verda SaaS", cargo: "VP Sales", iniciales: "LM",
    fuente: "Zoom", tipo: "Reunión 1:1", fecha: "15 Nov", hora: "16:00", duracion: "62 min",
    arr: "$3.8M ARR", etapa: "Cliente activo", sentimiento: "neutro",
    insight: "Equipo de 4 SDRs sin playbook unificado. Cada uno improvisa discovery, MQL→SQL en 11%.",
    accionSugerida: "Diseñar playbook único en 7 días",
    usadoEn: "Post Jue 28 Nov",
    historial: { totalTouches: 18, primeraInteraccion: "Jun 2024", ultimasN: 3 },
    buyingSignals: { score: 71, cambio: +6, señales: [
      "Compartió grabaciones de 12 discovery calls reales",
      "Confirmó budget Q1 para enablement: $40K",
      "Pidió involucrar a sus 4 SDRs en el siguiente call",
    ]},
    quote: { texto: "No tengo problema de leads. Tengo problema de que mis 4 SDRs convierten distinto el mismo lead.", minuto: "min 22:40" },
    dolores: [
      "MQL→SQL: 11% (benchmark sector 28%)",
      "4 SDRs con 4 criterios de calificación distintos",
      "Notas en HubSpot inconsistentes — imposible coaching real",
    ],
    decisionMakers: [
      { nombre: "Laura Méndez", rol: "VP Sales", poder: "Decisor" },
      { nombre: "Rita Kim", rol: "Head of Enablement", poder: "Champion" },
    ],
    proximoPaso: { que: "Diseñar playbook único de discovery (5 preguntas)", cuando: "Entrega Vie 22 Nov", owner: "Agente" },
    contextoDeal: { etapaCRM: "Expansion · enablement", montoPotencial: "+$40K Q1 + retainer", probabilidad: 81, bloqueadores: [] },
    temasDetectados: ["Discovery", "SDR enablement", "Playbook", "Conversión"],
  },
  {
    id: "i4", cliente: "Tomás Iglesias", empresa: "Atrium Cloud", cargo: "Founder", iniciales: "TI",
    fuente: "Gmail", tipo: "Email seguimiento", fecha: "13 Nov", hora: "08:42",
    arr: "$680K ARR", etapa: "Negociación", sentimiento: "positivo",
    insight: "Confirmó budget Q1. Pregunta concreta: cómo medir ROI de un revenue coach en 90 días.",
    accionSugerida: "Enviar plan 90 días con KPIs claros",
    usadoEn: "Post Lun 25 Nov",
    historial: { totalTouches: 9, primeraInteraccion: "Sep 2024", ultimasN: 3 },
    buyingSignals: { score: 79, cambio: +9, señales: [
      "Pidió contrato — no descuento (señal de compra fuerte)",
      "Cc’ó a su co-founder técnico en el email",
      "Pregunta de medición de ROI = está justificando internamente",
    ]},
    quote: { texto: "El budget existe. Lo único que necesito es saber qué te voy a poder mostrar el día 90." },
    dolores: [
      "Equipo comercial de 2 personas, founder vendiendo 60% del tiempo",
      "Pipeline ad-hoc en spreadsheets",
      "Sin métricas leading — solo MRR mensual",
    ],
    decisionMakers: [
      { nombre: "Tomás Iglesias", rol: "Founder/CEO", poder: "Decisor" },
      { nombre: "Pablo Rey", rol: "Co-founder CTO", poder: "Influencer" },
    ],
    proximoPaso: { que: "Enviar plan 90 días con 3 KPIs y entregables semanales", cuando: "Antes del Lun 18 Nov", owner: "Founder" },
    contextoDeal: { etapaCRM: "Negociación · contrato", montoPotencial: "$48K / 6 meses", probabilidad: 84, bloqueadores: ["Definición de scope final"] },
    temasDetectados: ["ROI", "Plan 90 días", "Founder-led sales"],
  },
  {
    id: "i5", cliente: "Priya Shah", empresa: "Northstar Health", cargo: "Chief Revenue Officer", iniciales: "PS",
    fuente: "Calendar", tipo: "QBR programada", fecha: "20 Nov", hora: "11:00", duracion: "90 min",
    arr: "$5.2M ARR", etapa: "Renovación", sentimiento: "positivo",
    insight: "Renovación en 38 días. Pide caso de uso documentado para llevar a su CEO.",
    accionSugerida: "Preparar one-pager de impacto",
    usadoEn: "Carrusel Mié 20 Nov",
    historial: { totalTouches: 56, primeraInteraccion: "Ene 2023", ultimasN: 5 },
    buyingSignals: { score: 91, cambio: +4, señales: [
      "Agendó QBR ella misma — no esperó al equipo",
      "Pidió one-pager para CEO — está vendiendo arriba",
      "NPS de su equipo subió de 7 → 9 último trimestre",
      "Mencionó ‘expansión a Europa Q2’ en último email",
    ]},
    quote: { texto: "Mi CEO me preguntó por qué seguimos pagando esto. Dame algo que pueda enseñarle en 1 minuto." },
    dolores: [
      "CEO escéptico de servicios recurrentes",
      "Necesita pruebas duras de ROI para defender renovación",
    ],
    decisionMakers: [
      { nombre: "Priya Shah", rol: "CRO", poder: "Champion" },
      { nombre: "Robert Chen", rol: "CEO", poder: "Decisor" },
      { nombre: "Ana Beltrán", rol: "Head of Sales Ops", poder: "Influencer" },
    ],
    proximoPaso: { que: "One-pager + 3 datos duros para llevar al CEO", cuando: "Mié 20 Nov · 11:00 QBR", owner: "Founder" },
    contextoDeal: { etapaCRM: "Renovación · 38 días", montoPotencial: "Renovación $5.2M + expansión EU", probabilidad: 88, bloqueadores: ["Validación CEO"] },
    temasDetectados: ["Renovación", "ROI", "Expansión EU", "Defensa interna"],
  },
  {
    id: "i6", cliente: "Marcus Brenner", empresa: "Quanta Logistics", cargo: "Co-founder", iniciales: "MB",
    fuente: "LinkedIn DM", tipo: "Mensaje entrante", fecha: "16 Nov", hora: "14:22",
    arr: "Prospect · $1.4M ARR est.", etapa: "Discovery", sentimiento: "positivo",
    insight: "Vio el post del 11 Nov sobre forecast accuracy. Quiere agendar discovery, ICP perfecto.",
    accionSugerida: "Agendar discovery esta semana",
    usadoEn: "Pendiente de incorporar",
    historial: { totalTouches: 1, primeraInteraccion: "16 Nov 2024", ultimasN: 1 },
    buyingSignals: { score: 68, cambio: +68, señales: [
      "Inbound directo desde contenido orgánico",
      "Self-identifica el dolor en el mensaje inicial",
      "Mencionó timeline: ‘antes de fin de año’",
    ]},
    quote: { texto: "Tu post del lunes describió mi viernes. ¿Cuándo podemos hablar?" },
    dolores: [
      "Forecast off ±35% trimestre tras trimestre",
      "Acaba de levantar Serie A — board nuevo, expectativas altas",
    ],
    decisionMakers: [
      { nombre: "Marcus Brenner", rol: "Co-founder/CEO", poder: "Decisor" },
    ],
    proximoPaso: { que: "Discovery call 30 min", cuando: "Jue 21 Nov · ventana 14:00-17:00", owner: "Founder" },
    contextoDeal: { etapaCRM: "Discovery · inbound", montoPotencial: "$36-60K piloto", probabilidad: 42, bloqueadores: ["Aún no conocido"] },
    temasDetectados: ["Inbound", "Serie A", "Forecast", "Board nuevo"],
  },
  {
    id: "i7", cliente: "Sofía Aranda", empresa: "Lumen Studio", cargo: "Founder & CEO", iniciales: "SA",
    fuente: "HubSpot", tipo: "Nota de actividad", fecha: "17 Nov", hora: "09:05",
    arr: "$420K ARR", etapa: "Cliente activo", sentimiento: "neutro",
    insight: "Marcó 3 deals como ‘calificados’ sin ninguna de las 3 señales del playbook. Patrón recurrente.",
    accionSugerida: "Revisión de criterios en 30 min",
    usadoEn: "Post Lun 25 Nov",
    historial: { totalTouches: 14, primeraInteraccion: "Abr 2024", ultimasN: 2 },
    buyingSignals: { score: 49, cambio: -5, señales: [
      "Engagement con contenido bajó 40% mes a mes",
      "Saltó el último coaching 1:1",
      "Sigue pagando pero sin uso activo del playbook",
    ]},
    quote: { texto: "Sé que tengo que hacerlo bien, pero esta semana no me da la vida." },
    dolores: [
      "Founder vendiendo + entregando + operando — sin foco",
      "Calificación de deals por intuición, no por criterio",
      "Sin tiempo para implementar el playbook que ya pagó",
    ],
    decisionMakers: [
      { nombre: "Sofía Aranda", rol: "Founder/CEO", poder: "Decisor" },
    ],
    proximoPaso: { que: "Sesión 30 min · simplificar playbook a 3 preguntas", cuando: "Vie 22 Nov", owner: "Agente" },
    contextoDeal: { etapaCRM: "Retención · uso bajo", montoPotencial: "Renovación $420K en riesgo", probabilidad: 61, bloqueadores: ["Falta de tiempo del founder"] },
    temasDetectados: ["Adopción baja", "Founder overload", "Riesgo silencioso"],
  },
];
