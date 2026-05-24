import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Pencil,
  Sparkles,
  UserCircle2,
  TrendingUp,
  Mic,
  Target,
  BookOpen,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AiBubble } from "@/components/onboarding/AiBubble";

interface IntelligenceCard {
  id: string;
  icon: typeof UserCircle2;
  label: string;
  value: string;
  tone: string;
}

export interface RevenueDNASeed {
  founderName?: string;
  company?: string;
  cards?: Partial<Record<string, string>>;
}

const DEFAULTS: IntelligenceCard[] = [
  {
    id: "identity",
    icon: UserCircle2,
    label: "Founder Identity Model",
    value:
      "Operator-builder profile with sharp commercial instincts — earns trust through lived expertise.",
    tone: "from-violet-400/20 to-fuchsia-500/10",
  },
  {
    id: "motion",
    icon: TrendingUp,
    label: "Commercial Motion Model",
    value:
      "Sales-led motion compounded by referrals and founder network; outbound still searching for repeatable form.",
    tone: "from-emerald-400/20 to-teal-500/10",
  },
  {
    id: "authority",
    icon: Mic,
    label: "Authority Opportunity Map",
    value:
      "Under-leveraged POV on operational simplicity — clear path to becoming the trusted voice in your category.",
    tone: "from-sky-400/20 to-cyan-500/10",
  },
  {
    id: "positioning",
    icon: Target,
    label: "Positioning Gap Analysis",
    value:
      "Currently perceived as a technical specialist; should be seen as a category educator. That delta is your authority playbook.",
    tone: "from-rose-400/20 to-fuchsia-500/10",
  },
  {
    id: "sources",
    icon: BookOpen,
    label: "Strategic Influence Sources",
    value:
      "Inputs span operator newsletters and category-defining thought leaders — shaping a credible, non-derivative voice.",
    tone: "from-primary/20 to-accent/10",
  },
  {
    id: "constraints",
    icon: AlertTriangle,
    label: "Revenue Growth Constraints",
    value:
      "Deals stall on internal alignment and unclear ROI framing — late-stage business case isn't doing the lifting.",
    tone: "from-amber-400/20 to-orange-500/10",
  },
];

export function RevenueDNAComplete({ seed }: { seed?: RevenueDNASeed }) {
  const [cards, setCards] = useState<IntelligenceCard[]>(() =>
    DEFAULTS.map((c) => ({ ...c, value: seed?.cards?.[c.id] ?? c.value })),
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    let v = 0;
    const target = 94;
    const interval = setInterval(() => {
      v += 1;
      setConfidence(v);
      if (v >= target) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, []);

  function startEdit(c: IntelligenceCard) {
    setEditing(c.id);
    setDraft(c.value);
  }
  function saveEdit() {
    if (!editing) return;
    setCards((prev) => prev.map((c) => (c.id === editing ? { ...c, value: draft } : c)));
    setEditing(null);
  }
  function refine(c: IntelligenceCard) {
    const refined = c.value.includes("—")
      ? c.value
      : c.value.replace(/\.$/, "") + " — sharpening for narrative use.";
    setCards((prev) => prev.map((x) => (x.id === c.id ? { ...x, value: refined } : x)));
  }

  function activate() {
    setActivating(true);
    setTimeout(() => setActivated(true), 2200);
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <header className="text-center space-y-4 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs text-foreground/70">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Strategic Understanding Activated
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
          {seed?.company ? `${seed.company}'s Revenue DNA` : "Your Revenue DNA"}
        </h1>
        <p className="mx-auto max-w-2xl text-base text-foreground/70 leading-relaxed">
          {seed?.founderName ? `${seed.founderName.split(" ")[0]}, here's ` : "Here's "}
          what I&apos;ve learned. Approve, edit, or refine each insight — this becomes the
          foundation of your growth system.
        </p>
      </header>

      {/* Confidence meter */}
      <div className="glass-strong rounded-2xl p-5 space-y-2 animate-fade-up">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/70">Strategic Confidence Score</span>
          <span className="text-2xl font-semibold text-gradient-primary tabular-nums">
            {confidence}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-primary/15">
          <div
            className="h-full bg-gradient-primary transition-all duration-150"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 animate-fade-up">
        {cards.map((c) => {
          const Icon = c.icon;
          const isEditing = editing === c.id;
          const isApproved = approved[c.id];
          return (
            <div
              key={c.id}
              className="group relative overflow-hidden rounded-2xl glass-strong p-5 flex flex-col gap-3"
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-50 bg-gradient-to-br",
                  c.tone,
                )}
                aria-hidden
              />
              <div className="relative flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/40 backdrop-blur">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-foreground/60">
                    {c.label}
                  </p>
                  {isEditing ? (
                    <textarea
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={3}
                      className="mt-1 w-full resize-none rounded-lg bg-input/60 px-3 py-2 text-sm text-foreground border border-glass-border outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
                    />
                  ) : (
                    <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                      {c.value}
                    </p>
                  )}
                </div>
                {isApproved && !isEditing && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    <Check className="h-3 w-3" /> Approved
                  </span>
                )}
              </div>

              <div className="relative flex items-center gap-2 pt-1">
                {isEditing ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-primary/30"
                    >
                      <Check className="h-3 w-3" /> Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-glass px-3 py-1.5 text-xs text-foreground/70 hover:text-foreground"
                    >
                      <X className="h-3 w-3" /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setApproved((p) => ({ ...p, [c.id]: !p[c.id] }))}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                        isApproved
                          ? "bg-emerald-500/20 text-emerald-200"
                          : "bg-glass text-foreground/70 hover:text-foreground",
                      )}
                    >
                      <Check className="h-3 w-3" /> Approve
                    </button>
                    <button
                      onClick={() => startEdit(c)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-glass px-3 py-1.5 text-xs text-foreground/70 hover:text-foreground"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => refine(c)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-glass px-3 py-1.5 text-xs text-foreground/70 hover:text-foreground"
                    >
                      <Sparkles className="h-3 w-3" /> Refine
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="animate-fade-up">
        <AiBubble>
          I now understand how you think, how your business sells, what shapes your market
          perspective, and where your greatest authority-driven growth opportunities exist.
        </AiBubble>
      </div>

      <div className="flex justify-center pb-4">
        <Button
          onClick={activate}
          disabled={activating}
          size="lg"
          className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-8 h-12 text-base font-medium group"
        >
          {activated ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Revenue DNA Activated
            </>
          ) : activating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Calibrating your Revenue Coach…
            </>
          ) : (
            <>
              Activate Revenue DNA
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
