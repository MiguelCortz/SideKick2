import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

// Screening inicial · Input 1 del motor de contenido
// Persiste local por ahora; cuando agreguemos auth se mueve a tabla founder_profile
const STORAGE_KEY = "founder_dna_v1";

export type FounderDna = {
  founderName: string;
  companyName: string;
  icp: string;
  positioning: string;
  pillars: string;
  toneAdjectives: string;
  toneReferences: string;
  offLimits: string;
  realCases: string;
  ctas: string;
  updatedAt?: string;
};

const empty: FounderDna = {
  founderName: "",
  companyName: "",
  icp: "",
  positioning: "",
  pillars: "",
  toneAdjectives: "",
  toneReferences: "",
  offLimits: "",
  realCases: "",
  ctas: "",
};

export function loadFounderDna(): FounderDna | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FounderDna) : null;
  } catch {
    return null;
  }
}

export function FounderDnaDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [data, setData] = useState<FounderDna>(empty);

  useEffect(() => {
    if (open) {
      const stored = loadFounderDna();
      if (stored) setData(stored);
    }
  }, [open]);

  const set = <K extends keyof FounderDna>(key: K, value: FounderDna[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    const payload: FounderDna = { ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    toast.success("Tu ADN fue guardado", {
      description: "El agente lo usará como base para generar contenido esta semana.",
    });
    onOpenChange(false);
  };

  const completion = Object.entries(data).filter(([k, v]) => k !== "updatedAt" && (v as string).trim().length > 0).length;
  const total = 10;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-border/60 bg-card/95 p-0 backdrop-blur-xl">
        <DialogHeader className="border-b border-border/60 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-transparent text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-base font-semibold">Mi ADN · Screening inicial</DialogTitle>
              <DialogDescription className="text-xs">
                Define quién sos y cómo sonás. El agente usa este input como base para cada pieza que genera.
              </DialogDescription>
            </div>
            <Badge variant="outline" className="border-border/60 text-[10px] font-normal">
              {completion}/{total} completos
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <Field label="Founder" hint="Nombre que firma los posts">
              <Input
                value={data.founderName}
                onChange={(e) => set("founderName", e.target.value)}
                placeholder="Ej: Martín Suárez"
              />
            </Field>
            <Field label="Empresa" hint="Nombre comercial">
              <Input
                value={data.companyName}
                onChange={(e) => set("companyName", e.target.value)}
                placeholder="Ej: Helio Revenue"
              />
            </Field>

            <Field label="ICP" hint="A quién le hablás (industria, tamaño, rol, ARR)" full>
              <Textarea
                value={data.icp}
                onChange={(e) => set("icp", e.target.value)}
                rows={2}
                placeholder="Founders B2B SaaS · $500K–$5M ARR · sales-led · LATAM/US"
              />
            </Field>

            <Field label="Posicionamiento" hint="Tu propuesta en 1 línea" full>
              <Textarea
                value={data.positioning}
                onChange={(e) => set("positioning", e.target.value)}
                rows={2}
                placeholder="Convierto founder-led sales caótico en un revenue system predecible sin contratar VP of Sales."
              />
            </Field>

            <Field label="Pilares de contenido" hint="3–5 temas separados por coma" full>
              <Textarea
                value={data.pillars}
                onChange={(e) => set("pillars", e.target.value)}
                rows={2}
                placeholder="Revenue Ops, Founder-led sales, Forecasting, ICP discovery, Sales hiring"
              />
            </Field>

            <Field label="Tono · 3 adjetivos" hint="Cómo te leés">
              <Input
                value={data.toneAdjectives}
                onChange={(e) => set("toneAdjectives", e.target.value)}
                placeholder="Directo, analítico, sin BS"
              />
            </Field>
            <Field label="Tono · 2 referencias" hint="Posts/founders que admirás">
              <Input
                value={data.toneReferences}
                onChange={(e) => set("toneReferences", e.target.value)}
                placeholder="Jason Lemkin, April Dunford"
              />
            </Field>

            <Field label="Off-limits" hint="Temas o competidores que NO mencionás" full>
              <Textarea
                value={data.offLimits}
                onChange={(e) => set("offLimits", e.target.value)}
                rows={2}
                placeholder="No hablo de política, no nombro competidores directos, evito el tema cripto."
              />
            </Field>

            <Field label="Casos reales citables" hint="3–5 historias anonimizables que el agente puede usar" full>
              <Textarea
                value={data.realCases}
                onChange={(e) => set("realCases", e.target.value)}
                rows={3}
                placeholder="· SaaS fintech LATAM pasó de $40K a $120K MRR cambiando ICP\n· Founder healthtech bajó CAC 60% con outbound founder-led\n· Empresa de logística cerró $250K reescribiendo discovery"
              />
            </Field>

            <Field label="CTAs estándar" hint="A dónde llevás el tráfico" full>
              <Textarea
                value={data.ctas}
                onChange={(e) => set("ctas", e.target.value)}
                rows={2}
                placeholder="Calendly de diagnóstico 30 min · Newsletter quincenal · Comunidad privada de founders"
              />
            </Field>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-border/60 p-4">
          <div className="flex w-full items-center justify-between">
            <p className="text-[10px] text-muted-foreground">
              Se guarda en este dispositivo. Cuando conectes tu cuenta, sincronizamos.
            </p>
            <Button onClick={handleSave} size="sm" className="gap-1.5">
              <Check className="h-3.5 w-3.5" />
              Guardar ADN
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  hint,
  children,
  full,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-medium text-foreground">{label}</span>
        {hint && <span className="text-[10px] font-normal text-muted-foreground">{hint}</span>}
      </Label>
      {children}
    </div>
  );
}
