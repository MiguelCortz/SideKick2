import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Edit3,
  Loader2,
  Mic,
  Pencil,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AiBubble, TypingDots } from "@/components/onboarding/AiBubble";

// ---------- Types ----------

interface EntrySignals {
  name: string;
  linkedin: string;
  company: string;
  website: string;
}

interface InfluenceItem {
  id: string;
  label: string;
  value: string;
}

type Accuracy = "exact" | "mostly" | "correction" | "";

interface ValidationState {
  business: {
    influencers: string[];
    signers: string[];
    industries: string[];
    customIndustry: string;
    maturity: string;
    constraint: string;
    refine: string;
    accuracy: Accuracy;
    approved: boolean;
  };
  motion: {
    discovery: string[];
    friction: string[];
    worked: string[];
    voiceNote: boolean;
    approved: boolean;
  };
  positioning: { perceivedAs: string; shouldBe: string; approved: boolean };
  influence: { items: InfluenceItem[]; voiceNote: boolean; approved: boolean };
  thesis: { selected: string; custom: string; approved: boolean };
  objective: { focus: string; meetings: number; approved: boolean };
}

type Stage =
  | "entry"
  | "analyzing"
  | "ready"
  | "business"
  | "motion"
  | "positioning"
  | "influence"
  | "thesis"
  | "objective"
  | "final";

// ---------- Static data ----------

const INFLUENCERS = [
  "Founder / CEO",
  "Revenue Leadership",
  "Marketing Leadership",
  "Commercial Leadership",
  "Operations Leadership",
  "Technical Decision Makers",
  "Innovation Teams",
  "Procurement / Finance",
  "Agency Owners",
  "Marketplace Operators",
  "Other",
];
const SIGNERS = [
  "Founder / CEO",
  "Department Leader",
  "Budget Owner",
  "Procurement",
  "Board / Executive Committee",
  "Operational Champion",
  "Technical Approver",
];
const INDUSTRIES = [
  "Sports & Entertainment",
  "Marketing Agencies",
  "Fintech",
  "Insurance",
  "Healthcare",
  "E-commerce",
  "Marketplaces",
  "AI Software",
  "Enterprise SaaS",
  "Developer Tools",
  "Infrastructure / APIs",
  "Logistics",
  "Education",
  "Retail",
  "Hospitality",
  "Media",
  "Professional Services",
  "Other",
];
const MATURITY = [
  { id: "validation", title: "Still validating first customers", body: "Proving the wedge with early design partners." },
  { id: "founder-led", title: "Founder-led sales motion", body: "Every deal still flows through the founder." },
  { id: "repeatable", title: "Building repeatable pipeline", body: "Patterns are starting to compound." },
  { id: "scaling", title: "Scaling predictable acquisition", body: "Forecastable pipeline, quarter over quarter." },
  { id: "enterprise", title: "Enterprise expansion motion", body: "Land-and-expand into strategic accounts." },
];
const CONSTRAINTS = [
  { id: "meetings", title: "Not enough qualified meetings" },
  { id: "authority", title: "Weak authority positioning" },
  { id: "conversion", title: "Low conversion rate" },
  { id: "enterprise-cycles", title: "Slow enterprise cycles" },
  { id: "differentiation", title: "Poor market differentiation" },
  { id: "outbound", title: "Low outbound effectiveness" },
  { id: "messaging", title: "Messaging inconsistency" },
  { id: "predictability", title: "Pipeline unpredictability" },
];
const DISCOVERY = [
  "Inbound from content",
  "Outbound prospecting",
  "Founder network",
  "Referrals",
  "Partnerships",
  "Paid acquisition",
  "Events / community",
];
const FRICTION = [
  "Unclear ROI framing",
  "Internal alignment",
  "Procurement / legal",
  "Budget timing",
  "Champion turnover",
  "Wrong buyer profile",
];
const WORKED = [
  "Founder-led sales",
  "Strategic content",
  "Targeted outbound",
  "Live demos",
  "Pilot programs",
  "Partner introductions",
];
const PERCEPTION = [
  "Technical specialist",
  "Generic vendor",
  "Niche player",
  "Premium consultancy",
  "New entrant",
  "Status quo alternative",
];
const SHOULD_BE = [
  "Category educator",
  "Strategic operating system",
  "Trusted authority",
  "Default infrastructure choice",
  "Movement leader",
  "Premium standard",
];
const THESIS_CARDS = [
  {
    id: "simplicity",
    title: "Operational Simplicity Wins",
    body: "Complexity is a tax on growth. The companies that compound are the ones that strip it out.",
  },
  {
    id: "execution",
    title: "Execution Beats Complexity",
    body: "Markets reward shipping velocity, not strategic theater. Authority follows visible momentum.",
  },
  {
    id: "infra",
    title: "Revenue Infrastructure as Competitive Edge",
    body: "Pipeline is engineered, not hoped for. Founders who own their revenue OS win the decade.",
  },
];
const FOCUS = [
  "More meetings",
  "Faster conversions",
  "Better positioning",
  "Pipeline reactivation",
  "Authority building",
];

// ---------- Component ----------

export function StrategicValidation() {
  const [stage, setStage] = useState<Stage>("entry");
  const [entry, setEntry] = useState<EntrySignals>({
    name: "",
    linkedin: "",
    company: "",
    website: "",
  });
  const [analysisStep, setAnalysisStep] = useState(0);
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  const [v, setV] = useState<ValidationState>({
    business: {
      influencers: [],
      signers: [],
      industries: [],
      customIndustry: "",
      maturity: "",
      constraint: "",
      refine: "",
      accuracy: "",
      approved: false,
    },
    motion: {
      discovery: [],
      friction: [],
      worked: [],
      voiceNote: false,
      approved: false,
    },
    positioning: { perceivedAs: "", shouldBe: "", approved: false },
    influence: { items: [], voiceNote: false, approved: false },
    thesis: { selected: "", custom: "", approved: false },
    objective: { focus: "", meetings: 8, approved: false },
  });

  // Entry validation — only foundational identity is mandatory.
  // Mandatory: name + company + (linkedin OR website).
  const hasLinkedIn = entry.linkedin.trim().includes("linkedin");
  const hasWebsite = entry.website.trim().includes(".");
  const entryValid =
    !!entry.name.trim() && !!entry.company.trim() && (hasLinkedIn || hasWebsite);

  // Analysis sequence
  const analysisLines = [
    "Reading public positioning…",
    "Mapping authority signals…",
    "Scanning business context…",
    "Detecting market presence…",
  ];
  useEffect(() => {
    if (stage !== "analyzing") return;
    setAnalysisStep(0);
    const t = setInterval(() => {
      setAnalysisStep((s) => {
        if (s >= analysisLines.length - 1) {
          clearInterval(t);
          setTimeout(() => setStage("ready"), 700);
          return s;
        }
        return s + 1;
      });
    }, 850);
    return () => clearInterval(t);
  }, [stage]);

  const firstName = entry.name.split(" ")[0] || "there";

  // ---------- Render ----------

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10">
      <Header stage={stage} />

      {stage === "entry" && (
        <EntryForm
          value={entry}
          onChange={setEntry}
          canContinue={!!entryValid}
          onContinue={() => setStage("analyzing")}
        />
      )}

      {stage === "analyzing" && (
        <AnalyzingPanel lines={analysisLines} activeIndex={analysisStep} />
      )}

      {stage === "ready" && (
        <ReadyPanel firstName={firstName} onContinue={() => setStage("business")} />
      )}

      {stage === "business" && (
        <BusinessStage
          state={v.business}
          firstName={firstName}
          company={entry.company}
          onChange={(b) => setV((p) => ({ ...p, business: b }))}
          onApprove={() => {
            setV((p) => ({ ...p, business: { ...p.business, approved: true } }));
            setStage("motion");
          }}
        />
      )}

      {stage === "motion" && (
        <MotionStage
          state={v.motion}
          onChange={(m) => setV((p) => ({ ...p, motion: m }))}
          onApprove={() => {
            setV((p) => ({ ...p, motion: { ...p.motion, approved: true } }));
            setStage("positioning");
          }}
        />
      )}

      {stage === "positioning" && (
        <PositioningStage
          state={v.positioning}
          onChange={(s) => setV((p) => ({ ...p, positioning: s }))}
          onApprove={() => {
            setV((p) => ({
              ...p,
              positioning: { ...p.positioning, approved: true },
            }));
            setStage("influence");
          }}
        />
      )}

      {stage === "influence" && (
        <InfluenceStage
          state={v.influence}
          onChange={(s) => setV((p) => ({ ...p, influence: s }))}
          onApprove={() => {
            setV((p) => ({
              ...p,
              influence: { ...p.influence, approved: true },
            }));
            setStage("thesis");
          }}
        />
      )}

      {stage === "thesis" && (
        <ThesisStage
          state={v.thesis}
          onChange={(s) => setV((p) => ({ ...p, thesis: s }))}
          onApprove={() => {
            setV((p) => ({ ...p, thesis: { ...p.thesis, approved: true } }));
            setStage("objective");
          }}
        />
      )}

      {stage === "objective" && (
        <ObjectiveStage
          state={v.objective}
          onChange={(s) => setV((p) => ({ ...p, objective: s }))}
          onApprove={() => {
            setV((p) => ({
              ...p,
              objective: { ...p.objective, approved: true },
            }));
            setStage("final");
          }}
        />
      )}

      {stage === "final" && (
        <FinalDashboard
          entry={entry}
          v={v}
          activating={activating}
          activated={activated}
          onActivate={() => {
            setActivating(true);
            setTimeout(() => setActivated(true), 2200);
          }}
        />
      )}
    </div>
  );
}

// ---------- Header / progress ----------

const STAGE_ORDER: Stage[] = [
  "business",
  "motion",
  "positioning",
  "influence",
  "thesis",
  "objective",
  "final",
];

function Header({ stage }: { stage: Stage }) {
  const inLoop = STAGE_ORDER.includes(stage);
  const stepIndex = STAGE_ORDER.indexOf(stage);
  const total = STAGE_ORDER.length;
  return (
    <header className="text-center space-y-4 animate-fade-up">
      <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs text-foreground/70">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Strategic Co-Validation
      </div>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
        {stage === "entry" || stage === "analyzing" || stage === "ready"
          ? "Train Your Revenue Coach"
          : stage === "final"
            ? "Validated Strategic Understanding"
            : "Let's validate this together"}
      </h1>
      <p className="mx-auto max-w-xl text-base text-foreground/70 leading-relaxed">
        {stage === "entry"
          ? "A few baseline signals so I can begin understanding your business with you."
          : stage === "analyzing"
            ? "Reading the public signal layer before we go deeper."
            : stage === "ready"
              ? "Baseline context gathered. Now we co-validate the strategic layer."
              : stage === "final"
                ? "Every layer below has been confirmed by you. This becomes your growth system's source of truth."
                : "I'll propose an interpretation — you confirm, refine, or correct before we move on."}
      </p>

      {inLoop && stage !== "final" && (
        <div className="mx-auto flex max-w-md items-center gap-1.5 pt-2">
          {Array.from({ length: total - 1 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= stepIndex ? "bg-gradient-primary" : "bg-glass",
              )}
            />
          ))}
        </div>
      )}
    </header>
  );
}

// ---------- Entry form ----------

function EntryForm({
  value,
  onChange,
  canContinue,
  onContinue,
}: {
  value: EntrySignals;
  onChange: (v: EntrySignals) => void;
  canContinue: boolean;
  onContinue: () => void;
}) {
  function set<K extends keyof EntrySignals>(k: K, v: string) {
    onChange({ ...value, [k]: v } as EntrySignals);
  }
  return (
    <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-6 animate-fade-up">
      <AiBubble>
        Just the basics to get started — your name, company, and either a website or
        LinkedIn so I have a public signal to read. Everything else is optional, and you
        can deepen the picture anytime.
      </AiBubble>

      <div className="grid gap-4">
        <FieldRow label="What should I call you?" required>
          <Input
            placeholder="Your first name"
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            className="h-11 bg-input/60 border-glass-border"
          />
        </FieldRow>
        <FieldRow label="What company are you building?" required>
          <Input
            placeholder="Company name"
            value={value.company}
            onChange={(e) => set("company", e.target.value)}
            className="h-11 bg-input/60 border-glass-border"
          />
        </FieldRow>
        <FieldRow label="Company website URL" hint="Website or LinkedIn required">
          <Input
            placeholder="https://yourcompany.com"
            value={value.website}
            onChange={(e) => set("website", e.target.value)}
            className="h-11 bg-input/60 border-glass-border"
          />
        </FieldRow>
        <FieldRow label="LinkedIn profile URL" hint="Website or LinkedIn required">
          <Input
            placeholder="https://linkedin.com/in/your-handle"
            value={value.linkedin}
            onChange={(e) => set("linkedin", e.target.value)}
            className="h-11 bg-input/60 border-glass-border"
          />
        </FieldRow>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={onContinue}
          disabled={!canContinue}
          size="lg"
          className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-6 h-12 text-base font-medium group"
        >
          Begin Analysis
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </section>
  );
}

function FieldRow({
  label,
  children,
  required,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/60">
        {label}
        {required && (
          <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] tracking-wider text-primary">
            Required
          </span>
        )}
        {hint && !required && (
          <span className="rounded-full bg-glass border border-glass-border px-1.5 py-0.5 text-[9px] tracking-wider text-foreground/55 normal-case">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

// ---------- Analyzing ----------

function AnalyzingPanel({ lines, activeIndex }: { lines: string[]; activeIndex: number }) {
  return (
    <section className="glass-strong rounded-3xl p-8 space-y-5 animate-fade-up">
      <AiBubble>Reading what's already visible about you and your company.</AiBubble>
      <div className="space-y-3">
        {lines.map((l, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <div
              key={l}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                active
                  ? "bg-primary/10 border border-primary/30"
                  : done
                    ? "bg-glass border border-glass-border"
                    : "opacity-40",
              )}
            >
              {done ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : active ? (
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-glass-border" />
              )}
              <span className="text-sm text-foreground/85">{l}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ReadyPanel({
  firstName,
  onContinue,
}: {
  firstName: string;
  onContinue: () => void;
}) {
  return (
    <section className="glass-strong rounded-3xl p-8 space-y-6 animate-fade-up">
      <AiBubble>
        Thanks {firstName}. I've gathered enough baseline context to begin understanding
        your business with you. From here we work as a pair — I propose, you validate.
      </AiBubble>
      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-6 h-12 text-base font-medium group"
        >
          Begin Strategic Validation
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </section>
  );
}

// ---------- Reusable validation block ----------

function ValidationBlock({
  interpretation,
  onApprove,
  canApprove,
  refineValue,
  onRefineChange,
  showRefine,
  onToggleRefine,
  onSkip,
}: {
  interpretation: React.ReactNode;
  canApprove: boolean;
  onApprove: () => void;
  refineValue: string;
  onRefineChange: (v: string) => void;
  showRefine: boolean;
  onToggleRefine: () => void;
  onSkip?: () => void;
}) {
  const [synthesizing, setSynthesizing] = useState(true);
  const [skipped, setSkipped] = useState(false);
  useEffect(() => {
    setSynthesizing(true);
    const t = setTimeout(() => setSynthesizing(false), 900);
    return () => clearTimeout(t);
  }, [interpretation]);

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="rounded-2xl glass-strong p-5 space-y-3">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-primary/80">
          <Sparkles className="h-3 w-3" /> AI Interpretation
        </div>
        {synthesizing ? (
          <TypingDots />
        ) : (
          <p className="text-sm md:text-base leading-relaxed text-foreground/90">
            {interpretation}
          </p>
        )}
      </div>

      {showRefine && (
        <Textarea
          autoFocus
          value={refineValue}
          onChange={(e) => onRefineChange(e.target.value)}
          rows={3}
          placeholder="Refine the interpretation in your own words…"
          className="bg-input/60 border-glass-border"
        />
      )}

      <div className="flex flex-wrap items-center justify-end gap-2">
        {onSkip && (
          <button
            onClick={() => {
              setSkipped(true);
              setTimeout(onSkip, 650);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-glass px-3.5 py-2 text-xs text-foreground/70 hover:text-foreground"
          >
            Add later
          </button>
        )}
        <button
          onClick={onToggleRefine}
          className="inline-flex items-center gap-1.5 rounded-full bg-glass px-3.5 py-2 text-xs text-foreground/70 hover:text-foreground"
        >
          <Edit3 className="h-3 w-3" />
          {showRefine ? "Hide refinement" : "Needs adjustment"}
        </button>
        <Button
          onClick={onApprove}
          disabled={!canApprove || synthesizing}
          className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-5 h-10 text-sm font-medium group"
        >
          <Check className="h-4 w-4" /> Correct — continue
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>

      {skipped && (
        <p className="text-right text-xs text-foreground/60 animate-fade-up">
          No problem. I'll refine this understanding naturally as we work together.
        </p>
      )}
    </div>
  );
}

// ---------- Chip / Card helpers ----------

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs md:text-sm border transition-all",
        active
          ? "bg-primary/20 border-primary/50 text-foreground"
          : "bg-glass border-glass-border text-foreground/75 hover:text-foreground hover:border-foreground/20",
      )}
    >
      {children}
    </button>
  );
}

function SelectCard({
  active,
  onClick,
  title,
  body,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  body?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left rounded-2xl p-4 border transition-all",
        active
          ? "bg-primary/15 border-primary/50 shadow-glow"
          : "glass border-glass-border hover:border-foreground/20",
      )}
    >
      <div className="text-sm font-medium text-foreground">{title}</div>
      {body && <p className="mt-1.5 text-xs text-foreground/70 leading-relaxed">{body}</p>}
    </button>
  );
}

function VoiceToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs border transition-all",
        active
          ? "bg-primary/20 border-primary/50 text-foreground"
          : "bg-glass border-glass-border text-foreground/70 hover:text-foreground",
      )}
    >
      <Mic className="h-3 w-3" />
      {active ? "Voice note attached" : "Add a voice note (optional)"}
    </button>
  );
}

// ---------- Stage: Business ----------

function BusinessStage({
  state,
  firstName,
  company,
  onChange,
  onApprove,
}: {
  state: ValidationState["business"];
  firstName: string;
  company: string;
  onChange: (s: ValidationState["business"]) => void;
  onApprove: () => void;
}) {
  // Only the basic business type (maturity stage) is mandatory.
  // Everything else enriches the read but never blocks progress.
  const ready = !!state.maturity;

  const interpretation = useMemo(
    () => buildBusinessInterpretation({ state, firstName, company }),
    [state, firstName, company],
  );

  const [synthesizing, setSynthesizing] = useState(true);
  useEffect(() => {
    setSynthesizing(true);
    const t = setTimeout(() => setSynthesizing(false), 1100);
    return () => clearTimeout(t);
  }, [interpretation]);

  function setAccuracy(a: Accuracy) {
    onChange({ ...state, accuracy: a });
  }

  function addCustomIndustry() {
    const v = state.customIndustry.trim();
    if (!v) return;
    if (state.industries.includes(v)) {
      onChange({ ...state, customIndustry: "" });
      return;
    }
    onChange({
      ...state,
      industries: [...state.industries, v],
      customIndustry: "",
    });
  }

  return (
    <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-7 animate-fade-up">
      {/* STEP 1 — Commercial Maturity (the only required pick in this stage) */}
      <StepLabel n={1} title="Commercial Maturity" required />
      <AiBubble>
        Pick the stage that best describes where you are today. This is the only
        selection I need to start.
      </AiBubble>
      <div className="grid gap-2 sm:grid-cols-2">
        {MATURITY.map((m) => (
          <SelectCard
            key={m.id}
            active={state.maturity === m.id}
            onClick={() => onChange({ ...state, maturity: m.id })}
            title={m.title}
            body={m.body}
          />
        ))}
      </div>

      <OptionalDivider>
        Optional enrichment — sharpen the read, or skip and I'll learn as we work.
      </OptionalDivider>

      {/* STEP 2 — Buyer Influence Map (optional) */}
      <StepLabel n={2} title="Buyer Influence Map" optional />
      <AiBubble>Who typically influences your commercial wins? (optional)</AiBubble>
      <div className="flex flex-wrap gap-2">
        {INFLUENCERS.map((b) => (
          <Chip
            key={b}
            active={state.influencers.includes(b)}
            onClick={() =>
              onChange({ ...state, influencers: toggle(state.influencers, b) })
            }
          >
            {b}
          </Chip>
        ))}
      </div>

      {/* STEP 3 — Final Decision Authority (optional) */}
      <StepLabel n={3} title="Final Decision Authority" optional />
      <AiBubble>Who usually signs the final decision? (optional)</AiBubble>
      <div className="flex flex-wrap gap-2">
        {SIGNERS.map((b) => (
          <Chip
            key={`s-${b}`}
            active={state.signers.includes(b)}
            onClick={() => onChange({ ...state, signers: toggle(state.signers, b) })}
          >
            {b}
          </Chip>
        ))}
      </div>

      {/* STEP 4 — Industry Focus (optional) */}
      <StepLabel n={4} title="Industry Focus" optional />
      <AiBubble>Which industries are you selling into? (optional)</AiBubble>
      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map((i) => (
          <Chip
            key={`i-${i}`}
            active={state.industries.includes(i)}
            onClick={() =>
              onChange({ ...state, industries: toggle(state.industries, i) })
            }
          >
            {i}
          </Chip>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={state.customIndustry}
          onChange={(e) => onChange({ ...state, customIndustry: e.target.value })}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addCustomIndustry())
          }
          placeholder="Add a custom industry…"
          className="h-10 bg-input/60 border-glass-border"
        />
        <Button
          onClick={addCustomIndustry}
          variant="secondary"
          className="h-10 bg-glass border border-glass-border hover:bg-glass/80"
        >
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {/* STEP 5 — Strategic Commercial Constraint (optional) */}
      <StepLabel n={5} title="Strategic Commercial Constraint" optional />
      <AiBubble>What is your biggest growth bottleneck today? (optional)</AiBubble>
      <div className="grid gap-2 sm:grid-cols-2">
        {CONSTRAINTS.map((c) => (
          <SelectCard
            key={c.id}
            active={state.constraint === c.id}
            onClick={() => onChange({ ...state, constraint: c.id })}
            title={c.title}
          />
        ))}
      </div>


      {/* AI Interpretation + multi-state validation */}
      <div className="space-y-4">
        <div className="rounded-2xl glass-strong p-5 space-y-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-primary/80">
            <Sparkles className="h-3 w-3" /> AI Strategic Synthesis
          </div>
          {!ready ? (
            <p className="text-sm leading-relaxed text-foreground/60">
              Pick your commercial stage above and I'll synthesize a read — enrich with
              the optional signals to sharpen it.
            </p>
          ) : synthesizing ? (
            <TypingDots />
          ) : (
            <p className="text-sm md:text-[15px] leading-relaxed text-foreground/90 whitespace-pre-line">
              {interpretation}
            </p>
          )}
        </div>


        {ready && !synthesizing && (
          <div className="grid gap-2 sm:grid-cols-3 animate-fade-up">
            <AccuracyButton
              active={state.accuracy === "exact"}
              onClick={() => setAccuracy("exact")}
              label="Exactly Right"
              tone="emerald"
            />
            <AccuracyButton
              active={state.accuracy === "mostly"}
              onClick={() => setAccuracy("mostly")}
              label="Mostly Right"
              tone="primary"
            />
            <AccuracyButton
              active={state.accuracy === "correction"}
              onClick={() => setAccuracy("correction")}
              label="Needs Correction"
              tone="amber"
            />
          </div>
        )}

        {state.accuracy === "correction" && (
          <div className="space-y-2 animate-fade-up">
            <p className="text-xs text-foreground/70">
              Tell me what I missed — I'll re-synthesize live as you type.
            </p>
            <Textarea
              autoFocus
              value={state.refine}
              onChange={(e) => onChange({ ...state, refine: e.target.value })}
              rows={3}
              placeholder="e.g. We don't sell into Marketing — buyers are heads of RevOps inside scale-ups…"
              className="bg-input/60 border-glass-border"
            />
          </div>
        )}

        {state.accuracy === "mostly" && (
          <Textarea
            value={state.refine}
            onChange={(e) => onChange({ ...state, refine: e.target.value })}
            rows={2}
            placeholder="Optional nuance to sharpen the read…"
            className="bg-input/60 border-glass-border animate-fade-up"
          />
        )}

        <div className="flex justify-end pt-1">
          <Button
            onClick={onApprove}
            disabled={
              !ready ||
              synthesizing ||
              !state.accuracy ||
              (state.accuracy === "correction" && state.refine.trim().length < 4)
            }
            className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-5 h-10 text-sm font-medium group"
          >
            <Check className="h-4 w-4" /> Lock this understanding
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function AccuracyButton({
  active,
  onClick,
  label,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  tone: "emerald" | "primary" | "amber";
}) {
  const toneClasses = {
    emerald: active
      ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-100"
      : "hover:border-emerald-400/40",
    primary: active
      ? "bg-primary/20 border-primary/60 text-foreground"
      : "hover:border-primary/40",
    amber: active
      ? "bg-amber-500/15 border-amber-400/60 text-amber-100"
      : "hover:border-amber-400/40",
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
        "bg-glass border-glass-border text-foreground/80",
        toneClasses,
      )}
    >
      {label}
    </button>
  );
}

function StepLabel({
  n,
  title,
  required,
  optional,
}: {
  n: number;
  title: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[11px] font-semibold text-foreground">
        {n}
      </span>
      <span className="text-[11px] uppercase tracking-[0.15em] text-foreground/55">
        {title}
      </span>
      {required && (
        <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-primary">
          Required
        </span>
      )}
      {optional && (
        <span className="rounded-full bg-glass border border-glass-border px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-foreground/55">
          Optional
        </span>
      )}
    </div>
  );
}

function OptionalDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2 text-[11px] uppercase tracking-[0.15em] text-foreground/45">
      <div className="h-px flex-1 bg-glass-border" />
      <span className="normal-case tracking-normal text-xs text-foreground/55">
        {children}
      </span>
      <div className="h-px flex-1 bg-glass-border" />
    </div>
  );
}

function buildBusinessInterpretation({
  state,
  firstName,
  company,
}: {
  state: ValidationState["business"];
  firstName: string;
  company: string;
}): string {
  const maturity = MATURITY.find((m) => m.id === state.maturity);
  const constraint = CONSTRAINTS.find((c) => c.id === state.constraint);

  const maturityLead: Record<string, string> = {
    validation: "an early-stage company still validating its first customers",
    "founder-led": "an early-stage founder-led company",
    repeatable: "a company transitioning from founder-led traction into repeatable pipeline",
    scaling: "a company scaling predictable acquisition",
    enterprise: "a company in enterprise expansion mode",
  };
  const constraintFraming: Record<string, string> = {
    meetings:
      "Your growth challenge is concentrated around generating enough qualified meetings — pipeline volume is the bottleneck, not conversion.",
    authority:
      "Your growth challenge is evolving from founder-led traction into repeatable authority-driven pipeline generation, with differentiation strongest around strategic execution simplicity.",
    conversion:
      "Your growth challenge sits in the conversion layer — pipeline exists, but it isn't compounding into closed revenue yet.",
    "enterprise-cycles":
      "Your growth challenge is sequencing through slow enterprise cycles — narrative, champion enablement, and procurement velocity all matter.",
    differentiation:
      "Your growth challenge is differentiation — buyers can't yet clearly articulate why you, and that erodes price and urgency.",
    outbound:
      "Your growth challenge is outbound effectiveness — the motion runs, but reply and meeting rates aren't compounding.",
    messaging:
      "Your growth challenge is messaging consistency — the same story isn't reaching every buyer in every channel.",
    predictability:
      "Your growth challenge is pipeline predictability — the system works, but it doesn't forecast.",
  };

  const audience = describeAudience(state.influencers);
  const industries = describeIndustries(state.industries);

  const para1 = `${firstName}, I'm interpreting ${company || "your company"} as ${
    maturityLead[state.maturity] ?? "a strategically positioned company"
  } selling into ${audience} across ${industries}.`;

  const para2 =
    constraintFraming[state.constraint] ??
    `Your growth challenge centers on ${constraint?.title.toLowerCase() ?? "your stated bottleneck"}.`;

  const signer = describeSigners(state.signers);
  const para3 = `Final commit authority typically sits with ${signer} — that's where the narrative ultimately has to land.`;

  const para4 = state.refine.trim()
    ? `\n\nIncorporating your correction: "${state.refine.trim()}" — I'll bias the synthesis around that signal.`
    : "";

  return `${para1}\n\n${para2}\n\n${para3}${para4}`;
}

function describeIndustries(industries: string[]): string {
  if (industries.length === 0) return "your target industries";
  const lower = industries.map((i) => i.toLowerCase());
  if (lower.length === 1) return lower[0];
  if (lower.length === 2) return `${lower[0]} and ${lower[1]}`;
  if (lower.length === 3) return `${lower[0]}, ${lower[1]}, and ${lower[2]}`;
  return `${lower.slice(0, 2).join(", ")}, and ${lower.length - 2} other sectors`;
}

function describeAudience(influencers: string[]): string {
  if (influencers.length === 0) return "your target stakeholders";
  const map: Record<string, string> = {
    "Revenue Leader": "commercial leadership",
    "Marketing Director": "marketing leadership",
    "Commercial Director": "commercial leadership",
    "Operations Leader": "operational leadership",
    "Founder / CEO": "founder offices",
    "Enterprise Buyer": "enterprise buying committees",
    "Technical Decision Maker": "technical decision-makers",
    "Agency Owner": "agency owners",
    "Marketplace Operator": "marketplace operators",
    "Product Leader": "product leadership",
    "Innovation Team": "innovation teams",
    "Procurement / Finance": "procurement and finance gatekeepers",
  };
  const mapped = Array.from(
    new Set(influencers.map((i) => map[i] ?? i.toLowerCase())),
  );
  if (mapped.length === 1) return mapped[0];
  if (mapped.length === 2) return `${mapped[0]} and ${mapped[1]}`;
  return `${mapped.slice(0, -1).join(", ")}, and ${mapped[mapped.length - 1]}`;
}

function describeSigners(signers: string[]): string {
  if (signers.length === 0) return "the executive sponsor";
  if (signers.length === 1) return signers[0];
  if (signers.length === 2) return `${signers[0]} or ${signers[1]}`;
  return `${signers.slice(0, -1).join(", ")}, or ${signers[signers.length - 1]}`;
}

// ---------- Stage: Motion ----------

function MotionStage({
  state,
  onChange,
  onApprove,
}: {
  state: ValidationState["motion"];
  onChange: (s: ValidationState["motion"]) => void;
  onApprove: () => void;
}) {
  const [showRefine, setShowRefine] = useState(false);
  const ready = state.discovery.length > 0 && state.friction.length > 0;
  const interpretation = ready
    ? `Your strongest acquisition motion appears to be ${joinList(state.discovery.slice(0, 2))}, while growth friction is concentrated around ${joinList(state.friction.slice(0, 2))}. ${
        state.worked.length
          ? `What's worked historically: ${joinList(state.worked.slice(0, 2))}.`
          : ""
      }`
    : "Pick at least one acquisition source and one friction point so I can read the motion.";

  return (
    <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-6 animate-fade-up">
      <AiBubble>How do customers currently find you?</AiBubble>
      <MultiChips
        options={DISCOVERY}
        values={state.discovery}
        onToggle={(v) => onChange({ ...state, discovery: toggle(state.discovery, v) })}
      />

      <AiBubble>What slows deals most often?</AiBubble>
      <MultiChips
        options={FRICTION}
        values={state.friction}
        onToggle={(v) => onChange({ ...state, friction: toggle(state.friction, v) })}
      />

      <AiBubble>What has historically worked best?</AiBubble>
      <MultiChips
        options={WORKED}
        values={state.worked}
        onToggle={(v) => onChange({ ...state, worked: toggle(state.worked, v) })}
      />

      <VoiceToggle
        active={state.voiceNote}
        onToggle={() => onChange({ ...state, voiceNote: !state.voiceNote })}
      />

      <ValidationBlock
        interpretation={interpretation}
        canApprove={ready}
        onApprove={onApprove}
        refineValue={""}
        onRefineChange={() => {}}
        showRefine={false}
        onToggleRefine={() => setShowRefine((s) => !s)}
        onSkip={onApprove}
      />
    </section>
  );
}

function MultiChips({
  options,
  values,
  onToggle,
}: {
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o} active={values.includes(o)} onClick={() => onToggle(o)}>
          {o}
        </Chip>
      ))}
    </div>
  );
}

// ---------- Stage: Positioning ----------

function PositioningStage({
  state,
  onChange,
  onApprove,
}: {
  state: ValidationState["positioning"];
  onChange: (s: ValidationState["positioning"]) => void;
  onApprove: () => void;
}) {
  const [showRefine, setShowRefine] = useState(false);
  const ready = !!state.perceivedAs && !!state.shouldBe;
  const interpretation = ready
    ? `Your authority positioning is currently misaligned toward "${state.perceivedAs}" when it should emphasize "${state.shouldBe}". That delta is the foundation of your authority playbook.`
    : "Select both a current perception and the target perception.";

  return (
    <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-6 animate-fade-up">
      <AiBubble>How does your market currently perceive you?</AiBubble>
      <div className="flex flex-wrap gap-2">
        {PERCEPTION.map((p) => (
          <Chip
            key={p}
            active={state.perceivedAs === p}
            onClick={() => onChange({ ...state, perceivedAs: p })}
          >
            {p}
          </Chip>
        ))}
      </div>

      <AiBubble>How should they perceive you?</AiBubble>
      <div className="flex flex-wrap gap-2">
        {SHOULD_BE.map((p) => (
          <Chip
            key={p}
            active={state.shouldBe === p}
            onClick={() => onChange({ ...state, shouldBe: p })}
          >
            {p}
          </Chip>
        ))}
      </div>

      <ValidationBlock
        interpretation={interpretation}
        canApprove={ready}
        onApprove={onApprove}
        refineValue={""}
        onRefineChange={() => {}}
        showRefine={false}
        onToggleRefine={() => setShowRefine((s) => !s)}
        onSkip={onApprove}
      />
    </section>
  );
}

// ---------- Stage: Influence ----------

const INFLUENCE_CATEGORIES = [
  { id: "newsletters", label: "Newsletter" },
  { id: "media", label: "Media source" },
  { id: "leaders", label: "Thought leader" },
  { id: "article", label: "Article" },
  { id: "website", label: "Website" },
  { id: "research", label: "Research" },
];

function InfluenceStage({
  state,
  onChange,
  onApprove,
}: {
  state: ValidationState["influence"];
  onChange: (s: ValidationState["influence"]) => void;
  onApprove: () => void;
}) {
  const [cat, setCat] = useState(INFLUENCE_CATEGORIES[0].id);
  const [draft, setDraft] = useState("");

  function add() {
    if (!draft.trim()) return;
    const label =
      INFLUENCE_CATEGORIES.find((c) => c.id === cat)?.label ?? "Source";
    onChange({
      ...state,
      items: [
        ...state.items,
        { id: crypto.randomUUID(), label, value: draft.trim() },
      ],
    });
    setDraft("");
  }
  function remove(id: string) {
    onChange({ ...state, items: state.items.filter((i) => i.id !== id) });
  }

  const themes = useMemo(() => deriveThemes(state.items), [state.items]);
  const ready = state.items.length >= 1 || state.voiceNote;
  const interpretation = ready
    ? `Detected strategic influence themes: ${themes.join(", ")}. These shape the credibility frame of your voice — your POV will sound non-derivative when it leans into them.`
    : "Add at least one influence source — or attach a voice note — so I can detect your strategic frame.";

  return (
    <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-6 animate-fade-up">
      <AiBubble>What's shaping your strategic perspective right now?</AiBubble>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {INFLUENCE_CATEGORIES.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder={`Add a ${INFLUENCE_CATEGORIES.find((c) => c.id === cat)?.label.toLowerCase()}…`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            className="h-11 bg-input/60 border-glass-border"
          />
          <Button
            onClick={add}
            variant="secondary"
            className="h-11 bg-glass border border-glass-border hover:bg-glass/80"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        {state.items.length > 0 && (
          <ul className="space-y-1.5">
            {state.items.map((i) => (
              <li
                key={i.id}
                className="flex items-center gap-2 rounded-xl bg-glass border border-glass-border px-3 py-2 text-sm"
              >
                <span className="text-[10px] uppercase tracking-wider text-foreground/55">
                  {i.label}
                </span>
                <span className="flex-1 truncate text-foreground/90">{i.value}</span>
                <button
                  onClick={() => remove(i.id)}
                  className="text-foreground/50 hover:text-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <VoiceToggle
        active={state.voiceNote}
        onToggle={() => onChange({ ...state, voiceNote: !state.voiceNote })}
      />

      <ValidationBlock
        interpretation={interpretation}
        canApprove={ready}
        onApprove={onApprove}
        refineValue={""}
        onRefineChange={() => {}}
        showRefine={false}
        onToggleRefine={() => {}}
        onSkip={onApprove}
      />
    </section>
  );
}

function deriveThemes(items: InfluenceItem[]): string[] {
  if (items.length === 0) return ["—"];
  const pool = [
    "operator-led growth",
    "category design",
    "founder authority",
    "revenue infrastructure",
    "narrative-led marketing",
    "execution velocity",
  ];
  // pick deterministic-ish themes based on count
  return pool.slice(0, Math.min(3, Math.max(2, items.length)));
}

// ---------- Stage: Thesis ----------

function ThesisStage({
  state,
  onChange,
  onApprove,
}: {
  state: ValidationState["thesis"];
  onChange: (s: ValidationState["thesis"]) => void;
  onApprove: () => void;
}) {
  const selected = THESIS_CARDS.find((c) => c.id === state.selected);
  const ready = !!state.selected || !!state.custom.trim();
  const interpretation = ready
    ? `I'll treat your core authority thesis as: "${state.custom.trim() || selected?.title}". Every narrative asset we build will reinforce this single idea.`
    : "Pick the closest authority narrative, or write your own.";

  return (
    <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-6 animate-fade-up">
      <AiBubble>
        Based on everything we've validated, here are the authority narratives you could
        credibly own. Pick the one that fits — or write your own.
      </AiBubble>

      <div className="grid gap-3 md:grid-cols-3">
        {THESIS_CARDS.map((c) => (
          <SelectCard
            key={c.id}
            active={state.selected === c.id}
            onClick={() => onChange({ ...state, selected: c.id })}
            title={c.title}
            body={c.body}
          />
        ))}
      </div>

      <Textarea
        value={state.custom}
        onChange={(e) => onChange({ ...state, custom: e.target.value })}
        rows={2}
        placeholder="Or write your own one-line thesis…"
        className="bg-input/60 border-glass-border"
      />

      <ValidationBlock
        interpretation={interpretation}
        canApprove={ready}
        onApprove={onApprove}
        refineValue={""}
        onRefineChange={() => {}}
        showRefine={false}
        onToggleRefine={() => {}}
        onSkip={onApprove}
      />
    </section>
  );
}

// ---------- Stage: Objective ----------

function ObjectiveStage({
  state,
  onChange,
  onApprove,
}: {
  state: ValidationState["objective"];
  onChange: (s: ValidationState["objective"]) => void;
  onApprove: () => void;
}) {
  const ready = !!state.focus;
  const interpretation = ready
    ? `This growth system will optimize around "${state.focus}", with a target band of roughly ${state.meetings} qualified meetings per month over the next 90 days.`
    : "Pick a primary 90-day focus.";
  return (
    <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-6 animate-fade-up">
      <AiBubble>What's the primary 90-day focus I should optimize for?</AiBubble>
      <div className="grid gap-2 sm:grid-cols-2">
        {FOCUS.map((f) => (
          <SelectCard
            key={f}
            active={state.focus === f}
            onClick={() => onChange({ ...state, focus: f })}
            title={f}
          />
        ))}
      </div>

      <div className="space-y-3 rounded-2xl glass border border-glass-border p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/70">Target qualified meetings / month</span>
          <span className="text-xl font-semibold text-gradient tabular-nums">
            {state.meetings}
          </span>
        </div>
        <input
          type="range"
          min={2}
          max={40}
          step={1}
          value={state.meetings}
          onChange={(e) =>
            onChange({ ...state, meetings: parseInt(e.target.value, 10) })
          }
          className="w-full accent-primary"
        />
      </div>

      <ValidationBlock
        interpretation={interpretation}
        canApprove={ready}
        onApprove={onApprove}
        refineValue={""}
        onRefineChange={() => {}}
        showRefine={false}
        onToggleRefine={() => {}}
        onSkip={onApprove}
      />
    </section>
  );
}

// ---------- Final dashboard ----------

function FinalDashboard({
  entry,
  v,
  activating,
  activated,
  onActivate,
}: {
  entry: EntrySignals;
  v: ValidationState;
  activating: boolean;
  activated: boolean;
  onActivate: () => void;
}) {
  const [confidence, setConfidence] = useState(0);
  useEffect(() => {
    let x = 0;
    const target = 96;
    const t = setInterval(() => {
      x += 1;
      setConfidence(x);
      if (x >= target) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, []);

  const cards = [
    {
      label: "Validated Business Model",
      value: summarizeBusiness(v.business),
    },
    {
      label: "Validated Commercial Motion",
      value: `Acquisition gravity: ${joinList(v.motion.discovery.slice(0, 2)) || "—"}. Historically working: ${joinList(v.motion.worked.slice(0, 2)) || "—"}.`,
    },
    {
      label: "Validated Growth Friction",
      value: `Concentrated around ${joinList(v.motion.friction.slice(0, 2)) || "—"}.`,
    },
    {
      label: "Validated Positioning Gap",
      value: `From "${v.positioning.perceivedAs}" → to "${v.positioning.shouldBe}".`,
    },
    {
      label: "Validated Thought Leadership Thesis",
      value:
        v.thesis.custom.trim() ||
        THESIS_CARDS.find((c) => c.id === v.thesis.selected)?.title ||
        "—",
    },
    {
      label: "Validated Revenue Objective",
      value: `${v.objective.focus} • ~${v.objective.meetings} qualified meetings / month.`,
    },
  ];

  if (activated) {
    return (
      <section className="glass-strong rounded-3xl p-10 text-center space-y-6 animate-fade-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <Rocket className="h-7 w-7 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-gradient">
          Revenue Coach Ready
        </h2>
        <p className="text-foreground/70 max-w-lg mx-auto">
          {entry.name.split(" ")[0]}, your founder-led growth operating system is live.
          Transitioning you into this week's execution flow…
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
          <Loader2 className="h-4 w-4 animate-spin" /> Preparing Week 1 sprint
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-2xl p-5 space-y-2 animate-fade-up">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/70">Strategic Confidence Score</span>
          <span className="text-2xl font-semibold text-gradient tabular-nums">
            {confidence}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-primary/15">
          <div
            className="h-full bg-gradient-primary transition-all duration-100"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 animate-fade-up">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl glass-strong p-5 flex flex-col gap-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-foreground/60">
                {c.label}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> Approved by founder
              </span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="animate-fade-up">
        <AiBubble>
          We now share a validated strategic understanding of your business. This
          intelligence layer is sufficient to begin executing your founder-led growth
          operating system.
        </AiBubble>
      </div>

      <div className="flex justify-center pb-4">
        <Button
          onClick={onActivate}
          disabled={activating}
          size="lg"
          className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-8 h-12 text-base font-medium group"
        >
          {activating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Calibrating MondayOS…
            </>
          ) : (
            <>
              Launch MondayOS
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ---------- helpers ----------

function joinList(arr: string[]): string {
  if (arr.length === 0) return "";
  if (arr.length === 1) return arr[0].toLowerCase();
  return arr.map((s) => s.toLowerCase()).join(" and ");
}

function toggle(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function summarizeBusiness(b: ValidationState["business"]): string {
  const maturity = MATURITY.find((m) => m.id === b.maturity)?.title ?? "—";
  const constraint = CONSTRAINTS.find((c) => c.id === b.constraint)?.title ?? "—";
  const audience = describeAudience(b.influencers);
  const signer = describeSigners(b.signers);
  const industries = describeIndustries(b.industries);
  const note = b.refine.trim() ? ` Founder note: "${b.refine.trim()}".` : "";
  return `${maturity} • Industries: ${industries}. Selling into ${audience}; final sign-off with ${signer}. Constraint: ${constraint.toLowerCase()}.${note}`;
}
