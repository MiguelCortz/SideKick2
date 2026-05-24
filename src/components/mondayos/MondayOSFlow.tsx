import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Upload,
  Compass,
  Check,
  Loader2,
  Calendar,
  Linkedin,
  Mail,
  Database,
  FileText,
  Mic,
  ChevronRight,
  Radar,
  Target,
  Brain,
  Zap,
  Activity,
  TrendingUp,
  Rocket,
  CheckCircle2,
  CircleDashed,
  Settings2,
  AlertTriangle,
  X,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/* =========================================================================
   Types & constants
   ========================================================================= */

type ScreenId =
  | "intake"
  | "thesis"
  | "enrich"
  | "validate"
  | "connect"
  | "segmentation"
  | "export"
  | "sprint"
  | "launching"
  | "active";

type CardStatus = "pending" | "approved" | "refined";

interface Hypothesis {
  id: string;
  label: string;
  value: string;
  confidence: number; // 0-100
  status: CardStatus;
}

interface State {
  // Required identity
  name: string;
  // Business type (selectable)
  model: string;
  // Strategic intake
  problem: string;
  audiences: string[];
  industries: string[];
  stage: string;
  challenge: string;
  // Business thesis validation
  thesisStatus: "pending" | "approved" | "refined";
  thesisRefinement: string;
  // Optional enrichment (uploads come AFTER thesis is understood)
  importedFiles: string[];
  contextLinks: string;
  hasContext: boolean;
  // Extracted strategic hypotheses (pre-filled, editable)
  hypotheses: Hypothesis[];
  clarifications: Record<string, string>;
  // Connect
  connections: Record<string, "connected" | "pending" | "skipped" | "idle">;
  // Segmentation
  segmentApprovals: Record<string, boolean>;
}

const MODELS = [
  "B2B SaaS",
  "AI Agentic Product",
  "Marketplace",
  "Agency",
  "Software + Services Hybrid",
  "Consulting Product",
  "Infrastructure / API",
  "Still Exploring",
];

const AUDIENCES = [
  "Founders",
  "Marketing teams",
  "Revenue teams",
  "Operations leaders",
  "Finance / procurement",
  "Consumers",
  "Enterprise buyers",
  "Technical teams",
  "Other",
];

const INDUSTRIES = [
  "Sports & Entertainment",
  "Agencies",
  "Fintech",
  "Insurance",
  "Healthcare",
  "Enterprise SaaS",
  "AI Software",
  "Retail",
  "Marketplaces",
  "Media",
  "Logistics",
  "Hospitality",
  "Developer Tools",
  "Education",
  "Professional Services",
  "Other",
];

const STAGES = [
  "Idea validation",
  "Early traction",
  "Founder-led selling",
  "Building repeatability",
  "Scaling acquisition",
  "Enterprise expansion",
];

const CHALLENGES = [
  "Not enough meetings",
  "Weak positioning clarity",
  "Low conversion",
  "Long sales cycles",
  "Pipeline inconsistency",
  "Poor authority / visibility",
  "Messaging confusion",
];

const CONNECTORS: { id: string; label: string; icon: typeof Mail }[] = [
  { id: "gcal", label: "Google Calendar", icon: Calendar },
  { id: "hubspot", label: "HubSpot", icon: Database },
  { id: "salesforce", label: "Salesforce", icon: Database },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "website", label: "Company website", icon: Database },
  { id: "email", label: "Email", icon: Mail },
  { id: "notion", label: "Notion", icon: FileText },
  { id: "crm", label: "CRM exports", icon: Upload },
  { id: "transcripts", label: "Meeting transcripts", icon: Mic },
  { id: "analytics", label: "Analytics dashboards", icon: Activity },
];

const SEGMENT_CARDS = [
  { id: "primary", label: "Primary Buyer Segment", icon: Target },
  { id: "secondary", label: "Secondary Buyer Segment", icon: Target },
  { id: "friction", label: "Commercial Friction Map", icon: Activity },
  { id: "authority", label: "Authority Opportunity Map", icon: Sparkles },
  { id: "gap", label: "Positioning Gap", icon: Radar },
  { id: "influence", label: "Strategic Influence Signals", icon: Brain },
];

const initial: State = {
  name: "",
  model: "",
  problem: "",
  audiences: [],
  industries: [],
  stage: "",
  challenge: "",
  thesisStatus: "pending",
  thesisRefinement: "",
  importedFiles: [],
  contextLinks: "",
  hasContext: false,
  hypotheses: [],
  clarifications: {},
  connections: {},

  segmentApprovals: {},
};

/* =========================================================================
   Structured strategic extraction — CRO-grade interpretation model
   Eight explicit fields, each with confidence + tier + alternatives + a
   guided refinement question for yellow/red interpretations.
   ========================================================================= */

type Tier = "high" | "medium" | "low";

interface StrategicField {
  id: string;
  label: string;
  icon: typeof Brain;
  rationale: string;
  alternatives: string[];
  refineQuestion: string;
  build: (s: State) => string;
  baseWithContext: number;
  baseWithoutContext: number;
}

const STRATEGIC_FIELDS: StrategicField[] = [
  {
    id: "problem",
    label: "Business Problem",
    icon: Target,
    rationale:
      "Inferred from positioning language, product framing, and the pain you keep returning to.",
    alternatives: [
      "GTM execution is slow & inconsistent",
      "Founders lack repeatable revenue rhythm",
      "Buyers can't justify implementation cost",
      "Authority is weak in a crowded category",
    ],
    refineQuestion: "Which pain best matches what customers actually hire you to solve?",
    build: (s) =>
      `${s.name ? s.name + "'s venture" : "Your venture"} closes the gap between strategic intent and repeatable commercial execution for founders moving past founder-led traction.`,
    baseWithContext: 88,
    baseWithoutContext: 62,
  },
  {
    id: "solution",
    label: "Solution Model",
    icon: Zap,
    rationale:
      "Inferred from product mechanism, delivery model, and your technical / product wedge.",
    alternatives: [
      "AI-orchestrated revenue OS",
      "Workflow consolidation platform",
      "Embedded strategic co-pilot",
      "Vertical AI agent suite",
    ],
    refineQuestion:
      "How would you describe the wedge — mechanism, delivery model, and what's truly novel?",
    build: () =>
      "An AI-native operating layer that translates founder intelligence into structured, executable weekly revenue motion — delivered as an always-on coach rather than a dashboard.",
    baseWithContext: 84,
    baseWithoutContext: 58,
  },
  {
    id: "icp",
    label: "ICP / Buyer Profile",
    icon: Target,
    rationale:
      "Inferred buyer roles — primary buyer, economic buyer, champion, operational stakeholder.",
    alternatives: [
      "Founder/CEO as economic buyer · CRO as champion",
      "Head of Revenue as economic buyer · RevOps champion",
      "Head of Marketing as champion · CEO sign-off",
      "Founder-led only at this stage",
    ],
    refineQuestion: "Who actually controls budget vs. who champions you internally?",
    build: () =>
      "Primary: Founders & Heads of Revenue at 10–80 person B2B teams. Economic buyer: CEO. Champion: revenue or marketing leader. Operational stakeholder: RevOps / Chief of Staff.",
    baseWithContext: 72,
    baseWithoutContext: 48,
  },
  {
    id: "market",
    label: "Market / Industry Context",
    icon: Radar,
    rationale: "Inferred vertical focus from references, customer language, and wedge fit.",
    alternatives: [
      "Sports & Entertainment",
      "Enterprise SaaS",
      "Fintech",
      "Agencies & Services",
      "Marketplaces",
      "Insurance",
    ],
    refineQuestion: "Where do you actually win most consistently today?",
    build: () =>
      "Sports + enterprise SaaS today, with adjacent pull from agencies and AI-native services firms.",
    baseWithContext: 68,
    baseWithoutContext: 45,
  },
  {
    id: "motion",
    label: "Commercial Motion",
    icon: Activity,
    rationale: "Inferred from how deals actually originate, progress, and close today.",
    alternatives: [
      "Founder-led sales",
      "Outbound sales motion",
      "Authority-driven inbound",
      "Partnerships & referrals",
      "Product-led growth",
      "Enterprise field motion",
    ],
    refineQuestion: "Where do your best deals actually originate today?",
    build: () =>
      "Founder-led validation transitioning into authority-driven inbound, with referral leakage you haven't formalized.",
    baseWithContext: 82,
    baseWithoutContext: 70,
  },
  {
    id: "differentiation",
    label: "Differentiation Signals",
    icon: Sparkles,
    rationale: "Inferred from why customers pick you over alternatives or status quo.",
    alternatives: [
      "Implementation simplicity",
      "Time-to-value advantage",
      "Founder-grade strategic depth",
      "AI-native architecture",
      "Vertical specialization",
    ],
    refineQuestion: "What do customers actually say when they pick you over an alternative?",
    build: () =>
      "Operational simplicity + speed-to-value vs. tooling-heavy competitors. Customers describe it as 'finally strategic, not just another dashboard.'",
    baseWithContext: 65,
    baseWithoutContext: 50,
  },
  {
    id: "friction",
    label: "Growth Friction Hypotheses",
    icon: AlertTriangle,
    rationale: "Most likely blockers based on stage, motion, and positioning maturity.",
    alternatives: [
      "Positioning confusion",
      "Implementation hesitation",
      "Unclear ROI narrative",
      "Weak authority signal",
      "Slow enterprise trust cycles",
    ],
    refineQuestion: "Which of these blockers do you feel most acutely right now?",
    build: () =>
      "Authority is under-published relative to capability — buyers hesitate at qualification because they can't yet contextualize ROI without reinforcement.",
    baseWithContext: 70,
    baseWithoutContext: 55,
  },
  {
    id: "narrative",
    label: "Thought Leadership Opportunity",
    icon: Brain,
    rationale: "The authority narrative the founder is uniquely positioned to own publicly.",
    alternatives: [
      "Contrarian POV on AI-native GTM",
      "Operator-grade RevOps playbooks",
      "Founder-led category reframe",
      "Implementation-simplicity manifesto",
    ],
    refineQuestion: "What perspective do you hold that the market is under-discussing?",
    build: () =>
      "A contrarian, operator-grade POV on AI-native commercial motion — under-published today but strongly implied by how you describe the work.",
    baseWithContext: 60,
    baseWithoutContext: 42,
  },
];

const FIELD_BY_ID: Record<string, StrategicField> = STRATEGIC_FIELDS.reduce(
  (acc, f) => ({ ...acc, [f.id]: f }),
  {} as Record<string, StrategicField>,
);

function tierOf(confidence: number): Tier {
  if (confidence >= 80) return "high";
  if (confidence >= 60) return "medium";
  return "low";
}

function extractHypotheses(s: State): Hypothesis[] {
  const hasFiles = s.importedFiles.length > 0 || s.contextLinks.trim().length > 0;
  return STRATEGIC_FIELDS.map((f) => {
    const base = hasFiles ? f.baseWithContext : f.baseWithoutContext;
    const jitter = ((f.id.charCodeAt(0) + f.id.length) % 7) - 3;
    const confidence = Math.max(35, Math.min(96, base + jitter));
    return {
      id: f.id,
      label: f.label,
      value: f.build(s),
      confidence,
      status: "pending",
    };
  });
}



/* =========================================================================
   Root
   ========================================================================= */

export function MondayOSFlow() {
  const [screen, setScreen] = useState<ScreenId>("enrich");
  const [state, setState] = useState<State>(initial);

  const go = (s: ScreenId) => setScreen(s);
  const patch = (p: Partial<State>) => setState((prev) => ({ ...prev, ...p }));

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--gradient-primary)", filter: "blur(140px)" }}
        aria-hidden
      />

      <TopBar screen={screen} />

      <div className="relative px-5 pb-24 pt-10 md:pt-16">
        <div className="mx-auto w-full max-w-5xl">
          {screen === "intake" && (
            <Intake state={state} patch={patch} onNext={() => go("thesis")} />
          )}
          {screen === "thesis" && (
            <ThesisReview
              state={state}
              patch={patch}
              onNext={() => {
                patch({ hypotheses: extractHypotheses(state), hasContext: false });
                go("validate");
              }}
            />
          )}
          {screen === "enrich" && (
            <ContextFlow
              state={state}
              patch={patch}
              onNext={() => {
                patch({ hypotheses: extractHypotheses({ ...state, hasContext: true }), hasContext: true });
                go("validate");
              }}
              onSkip={() => go("intake")}
            />
          )}
          {screen === "validate" && (
            <UnifiedValidation state={state} patch={patch} onNext={() => go("connect")} />
          )}

          {screen === "connect" && (
            <ConnectSystems state={state} patch={patch} onNext={() => go("segmentation")} />
          )}
          {screen === "segmentation" && (
            <Segmentation state={state} patch={patch} onNext={() => go("export")} />
          )}
          {screen === "export" && <ExportDashboard state={state} onNext={() => go("sprint")} />}
          {screen === "sprint" && (
            <SprintZero state={state} onLaunch={() => go("launching")} />
          )}
          {screen === "launching" && <Launching onDone={() => go("active")} />}
          {screen === "active" && <Active name={state.name} />}
        </div>
      </div>
    </main>
  );
}

/* =========================================================================
   Top bar
   ========================================================================= */

const STEP_ORDER: ScreenId[] = [
  "enrich",
  "validate",
  "intake",
  "thesis",
  "connect",
  "segmentation",
  "export",
  "sprint",
];
const STEP_LABELS: Record<ScreenId, string> = {
  enrich: "Ingest",
  validate: "Interpret",
  intake: "Manual setup",
  thesis: "Thesis",
  connect: "Connect",
  segmentation: "Intelligence",
  export: "Activation",
  sprint: "Sprint Zero",
  launching: "Launching",
  active: "Active",
};


function TopBar({ screen }: { screen: ScreenId }) {
  const idx = Math.max(0, STEP_ORDER.indexOf(screen));

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 pt-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold tracking-tight">MondayOS</span>
        <span className="ml-2 hidden md:inline text-xs text-muted-foreground">
          AI Chief Revenue Coach
        </span>
      </div>
      <div className="hidden md:flex items-center gap-1.5">
        {STEP_ORDER.map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium transition-all",
                i < idx && "bg-primary/20 text-primary",
                i === idx && "bg-gradient-primary text-primary-foreground shadow-glow",
                i > idx && "bg-secondary text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            {i < STEP_ORDER.length - 1 && (
              <div
                className={cn(
                  "h-px w-5 transition-colors",
                  i < idx ? "bg-primary/50" : "bg-glass-border",
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground hidden sm:block">
        {STEP_LABELS[screen]}
      </div>
    </div>
  );
}

/* =========================================================================
   Shared atoms
   ========================================================================= */

function AiBubble({ children, typing = false }: { children?: React.ReactNode; typing?: boolean }) {
  return (
    <div className="flex items-start gap-3 animate-fade-up">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
        <Sparkles className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 max-w-xl">
        {typing ? (
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft [animation-delay:300ms]" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-foreground/90">{children}</p>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="space-y-3 text-center animate-fade-up">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs text-foreground/70">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {eyebrow}
        </div>
      )}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">{title}</h1>
      {subtitle && (
        <p className="mx-auto max-w-2xl text-base text-foreground/70 leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  );
}

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
        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
        active
          ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
          : "glass border-glass-border text-foreground/80 hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function PrimaryCTA({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-all",
        "bg-gradient-primary text-primary-foreground shadow-glow hover:-translate-y-0.5",
        disabled && "opacity-40 pointer-events-none",
      )}
    >
      <span className="relative">{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-foreground/70">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

/* =========================================================================
   Screen 1 — Intake (strategy-first, no public-profile scanning)
   ========================================================================= */

const INTAKE_STEPS = [
  { id: "name", label: "Your name" },
  { id: "model", label: "What you're building" },
  { id: "problem", label: "Problem you solve" },
  { id: "audience", label: "Who feels it" },
  { id: "industry", label: "Industries" },
  { id: "stage", label: "Stage" },
  { id: "challenge", label: "Growth challenge" },
] as const;

function Intake({
  state,
  patch,
  onNext,
}: {
  state: State;
  patch: (p: Partial<State>) => void;
  onNext: () => void;
}) {
  const [step, setStep] = useState(0);

  const stepValid = (i: number): boolean => {
    switch (i) {
      case 0:
        return state.name.trim().length > 0;
      case 1:
        return !!state.model;
      case 2:
        return state.problem.trim().length > 0;
      case 3:
        return state.audiences.length > 0;
      case 4:
        return state.industries.length > 0;
      case 5:
        return !!state.stage;
      case 6:
        return !!state.challenge;
      default:
        return false;
    }
  };

  const toggleIn = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const next = () => {
    if (step < INTAKE_STEPS.length - 1) setStep(step + 1);
    else onNext();
  };
  const back = () => setStep(Math.max(0, step - 1));

  const current = INTAKE_STEPS[step];

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Strategic Initialization"
        title="What are we helping you grow?"
        subtitle="Let's understand your business so we can build the commercial motion that creates qualified meetings."
      />

      {/* Progress rail */}
      <div className="glass rounded-2xl p-3 animate-fade-up">
        <div className="flex items-center gap-1.5">
          {INTAKE_STEPS.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i < step
                  ? "bg-primary/60"
                  : i === step
                    ? "bg-gradient-primary"
                    : "bg-secondary",
              )}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            Step {step + 1} of {INTAKE_STEPS.length} · {current.label}
          </span>
          <span>No public profiles required</span>
        </div>
      </div>

      <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-6 animate-fade-up">
        {step === 0 && (
          <div className="space-y-3">
            <AiBubble>What should I call you?</AiBubble>
            <Input
              autoFocus
              value={state.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="Alex"
              className="glass border-glass-border text-base h-12"
            />
            <p className="text-[11px] text-muted-foreground">
              Required. Everything else after this stays optional or selectable.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <AiBubble>What are you building?</AiBubble>
            <div className="flex flex-wrap gap-2">
              {MODELS.map((m) => (
                <Chip key={m} active={state.model === m} onClick={() => patch({ model: m })}>
                  {m}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <AiBubble>
              What problem are you solving? Even a rough sketch works — I'll interpret it.
            </AiBubble>
            <Textarea
              value={state.problem}
              onChange={(e) => patch({ problem: e.target.value })}
              placeholder="The pain customers actually hire you to remove…"
              className="glass border-glass-border min-h-[120px] text-sm"
            />
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Mic className="h-3 w-3" />
              Voice notes will be supported here once your workspace mic is enabled.
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <AiBubble>Who experiences this problem most?</AiBubble>
            <div className="flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <Chip
                  key={a}
                  active={state.audiences.includes(a)}
                  onClick={() => patch({ audiences: toggleIn(state.audiences, a) })}
                >
                  {a}
                </Chip>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Select all that apply.</p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <AiBubble>Which industries are you solving this for?</AiBubble>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((a) => (
                <Chip
                  key={a}
                  active={state.industries.includes(a)}
                  onClick={() => patch({ industries: toggleIn(state.industries, a) })}
                >
                  {a}
                </Chip>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Pick the ones where you actually win — not the ones you'd like to.</p>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3">
            <AiBubble>What stage are you in today?</AiBubble>
            <div className="flex flex-wrap gap-2">
              {STAGES.map((s) => (
                <Chip key={s} active={state.stage === s} onClick={() => patch({ stage: s })}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-3">
            <AiBubble>What growth challenge matters most right now?</AiBubble>
            <div className="flex flex-wrap gap-2">
              {CHALLENGES.map((c) => (
                <Chip
                  key={c}
                  active={state.challenge === c}
                  onClick={() => patch({ challenge: c })}
                >
                  {c}
                </Chip>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-glass-border pt-4">
          <button
            type="button"
            disabled={step === 0}
            onClick={back}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            Back
          </button>
          <PrimaryCTA disabled={!stepValid(step)} onClick={next}>
            {step === INTAKE_STEPS.length - 1 ? "Synthesize my business thesis" : "Continue"}
          </PrimaryCTA>
        </div>
      </section>
    </div>
  );
}

/* =========================================================================
   Screen 2 — Business Thesis Review
   The AI synthesizes 6 explicit strategic blocks from the intake.
   Founder validates: Exactly Right · Adjust It · Let's Refine Together.
   ========================================================================= */

function ThesisReview({
  state,
  patch,
  onNext,
}: {
  state: State;
  patch: (p: Partial<State>) => void;
  onNext: () => void;
}) {
  const [typing, setTyping] = useState(true);
  const [mode, setMode] = useState<"idle" | "adjust" | "refine">("idle");
  const [draft, setDraft] = useState(state.thesisRefinement);

  useEffect(() => {
    const t = setTimeout(() => setTyping(false), 900);
    return () => clearTimeout(t);
  }, []);

  const thesis = buildThesis(state);

  const approve = () => {
    patch({ thesisStatus: "approved" });
    setTimeout(onNext, 300);
  };

  const saveRefinement = () => {
    if (!draft.trim()) return;
    patch({ thesisStatus: "refined", thesisRefinement: draft.trim() });
    setMode("idle");
    setTimeout(onNext, 300);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Business Thesis"
        title="Here's how I'm reading your business."
        subtitle="A structured interpretation built purely from what you told me — not from scraping a website."
      />

      <AiBubble typing={typing}>
        {!typing && "I synthesized your intake into a six-block thesis. Tell me how close I got."}
      </AiBubble>

      <div className="grid gap-3 md:grid-cols-2 animate-fade-up">
        {thesis.map((t) => {
          const Icon = t.icon;
          return (
            <article key={t.id} className="glass-strong rounded-2xl p-5 space-y-2">
              <header className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                  <Icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t.label}
                </div>
              </header>
              <p className="text-sm leading-relaxed text-foreground/90">{t.value}</p>
            </article>
          );
        })}
      </div>

      <div className="glass-strong rounded-3xl p-6 space-y-4 animate-fade-up">
        <p className="text-sm text-foreground/85">Did I understand your business correctly?</p>

        {mode === "idle" && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={approve}
              className="text-xs rounded-full bg-emerald-400/15 px-3 py-1.5 text-emerald-300 hover:bg-emerald-400/25"
            >
              Exactly Right
            </button>
            <button
              onClick={() => {
                setMode("adjust");
                setDraft(state.thesisRefinement);
              }}
              className="text-xs rounded-full bg-amber-300/15 px-3 py-1.5 text-amber-200 hover:bg-amber-300/25"
            >
              Adjust It
            </button>
            <button
              onClick={() => {
                setMode("refine");
                setDraft(state.thesisRefinement);
              }}
              className="text-xs rounded-full bg-primary/15 px-3 py-1.5 text-primary hover:bg-primary/25"
            >
              Let's Refine Together
            </button>
          </div>
        )}

        {mode !== "idle" && (
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground">
              {mode === "adjust"
                ? "Tell me what to tweak — I'll update the thesis accordingly."
                : "Talk it through — I'll fold your wording into the working model."}
            </p>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="What should I change, sharpen, or rethink?"
              className="glass border-glass-border min-h-[100px] text-sm"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMode("idle")}
                className="text-xs rounded-full glass border border-glass-border px-3 py-1.5 text-muted-foreground"
              >
                Cancel
              </button>
              <button
                disabled={!draft.trim()}
                onClick={saveRefinement}
                className="text-xs rounded-full bg-primary/20 px-3 py-1.5 text-primary hover:bg-primary/30 disabled:opacity-40"
              >
                Update thesis & continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function buildThesis(s: State) {
  const audience = s.audiences.length
    ? s.audiences.slice(0, 3).join(", ").toLowerCase()
    : "the buyers you serve";
  const inds = s.industries.length
    ? s.industries.slice(0, 3).join(", ")
    : "your chosen verticals";
  const problemLine = s.problem.trim()
    ? s.problem.trim()
    : "an unspoken commercial pain your customers carry today";
  return [
    {
      id: "thesis",
      label: "Business Thesis",
      icon: Brain,
      value: `${s.model || "Your venture"} exists to make ${problemLine.toLowerCase().replace(/\.$/, "")} solvable in a structured, repeatable way.`,
    },
    {
      id: "problem",
      label: "Problem Solved",
      icon: Target,
      value: problemLine,
    },
    {
      id: "buyer",
      label: "Buyer Reality",
      icon: Target,
      value: `Felt most acutely by ${audience} — the people whose week looks different when this is solved.`,
    },
    {
      id: "industry",
      label: "Industry Context",
      icon: Radar,
      value: `Anchored in ${inds}, with adjacent pull wherever the same pain shows up.`,
    },
    {
      id: "stage",
      label: "Growth Stage",
      icon: Activity,
      value: s.stage || "Early commercial motion — repeatability is the next unlock.",
    },
    {
      id: "constraint",
      label: "Commercial Constraint",
      icon: AlertTriangle,
      value: s.challenge
        ? `${s.challenge} — the single bottleneck shaping every other metric right now.`
        : "Pipeline rhythm is the constraint you'll feel first as you scale.",
    },
  ];
}


/* =========================================================================
   Shared helpers
   ========================================================================= */

function findHypo(state: State, id: string): Hypothesis | undefined {
  return state.hypotheses.find((h) => h.id === id);
}

function getDerivedIndustry(state: State): string {
  return (
    state.clarifications.market ||
    findHypo(state, "market")?.value ||
    "your category"
  );
}

function getDerivedBottleneck(state: State): string {
  return (
    state.clarifications.friction ||
    findHypo(state, "friction")?.value ||
    "Pipeline unpredictability"
  );
}


function updateHypothesis(state: State, id: string, patch: Partial<Hypothesis>): Hypothesis[] {
  return state.hypotheses.map((h) => (h.id === id ? { ...h, ...patch } : h));
}

/* -------------------------------------------------------------------------
   Market-agnostic context resolver

   MondayOS works for ANY founder — sports, insurance, fintech, marketplace,
   AI software, agency, healthcare, infrastructure, consumer, services.
   The invariant is universal: translate what you're building into
   repeatable authority-driven commercial momentum. Everything else is
   inferred from validated context — never hardcoded.
   ------------------------------------------------------------------------- */

export interface BusinessContext {
  founder: string;
  venture: string;
  archetype: string; // inferred business archetype (free text)
  buyer: string; // ICP / buyer environment
  industry: string; // industry context
  maturity: string; // commercial maturity stage
  motion: string; // commercial motion
  bottleneck: string; // growth bottleneck
  wedge: string; // differentiation wedge
  authorityPath: string; // contextual authority opportunity
  proofType: string; // what credibility looks like in this domain
}

const ARCHETYPE_RULES: { keys: RegExp; archetype: string; proof: string; authority: string }[] = [
  {
    keys: /(sport|athlet|club|league|team|fan|stadium)/i,
    archetype: "sports / fan economy operator",
    proof: "audience traction + community ritual",
    authority: "fan-trust positioning around culture, performance, and monetization integrity",
  },
  {
    keys: /(insur|underwrit|claim|actuar|risk pool)/i,
    archetype: "insurance operator",
    proof: "loss-ratio improvements + regulatory clarity",
    authority: "trust-building around claim transparency and pricing fairness",
  },
  {
    keys: /(fintech|bank|payment|lending|treasury|wallet|trading|brokerage)/i,
    archetype: "fintech operator",
    proof: "ROI precision + compliance posture",
    authority: "compliance clarity, capital efficiency narratives, and quantified outcome storytelling",
  },
  {
    keys: /(marketplace|two-sided|supply|demand match|platform)/i,
    archetype: "marketplace operator",
    proof: "supply-side reliability + liquidity proof",
    authority: "execution-proof narratives that demonstrate operational reliability before scale",
  },
  {
    keys: /(\bai\b|ml|model|llm|agent|gpt|inference)/i,
    archetype: "AI-native software founder",
    proof: "workflow displacement + accuracy benchmarks",
    authority: "category-shaping POV on where AI changes the work, not just the tool",
  },
  {
    keys: /(agency|consult|services-led|done-for-you|studio)/i,
    archetype: "services-led / agency operator",
    proof: "execution leverage + repeatable engagement IP",
    authority: "proof-based thought leadership that productizes how the work is done",
  },
  {
    keys: /(health|clinic|patient|provider|hospital|biotech|life science|medical)/i,
    archetype: "healthcare operator",
    proof: "clinical outcomes + workflow safety",
    authority: "outcome-led narratives anchored in clinician trust and patient evidence",
  },
  {
    keys: /(infra|devtool|platform engineer|kubernetes|database|observab|sre|cloud native)/i,
    archetype: "infrastructure / developer-platform startup",
    proof: "reliability benchmarks + integration depth",
    authority: "technical authority translated into commercial-buyer ROI language",
  },
  {
    keys: /(consumer|d2c|brand|retail|cpg|lifestyle|ecommerce)/i,
    archetype: "consumer product founder",
    proof: "repeat-purchase + brand resonance",
    authority: "story-driven brand authority anchored in product point-of-view",
  },
  {
    keys: /(logistics|supply chain|warehouse|fleet|freight|3pl)/i,
    archetype: "operational / logistics founder",
    proof: "uptime + unit-economics gains",
    authority: "implementation credibility translated into operator-grade educational authority",
  },
  {
    keys: /(saas|b2b software|workflow|crm|ops platform)/i,
    archetype: "B2B SaaS operator",
    proof: "time-to-value + retained workflow adoption",
    authority: "category-defining POV on the workflow your software replaces",
  },
];

function resolveContext(state: State): BusinessContext {
  const founder = state.name?.trim() || "Founder";
  const venture = state.name ? `${state.name}'s venture` : "your venture";
  const industry =
    state.clarifications.market ||
    findHypo(state, "market")?.value ||
    state.industries.join(", ") ||
    "your category";
  const buyer =
    state.clarifications.icp ||
    findHypo(state, "icp")?.value ||
    state.audiences.join(", ") ||
    "your target buyers";
  const motion =
    state.clarifications.motion ||
    findHypo(state, "motion")?.value ||
    "founder-led commercial motion";
  const bottleneck =
    state.clarifications.friction ||
    findHypo(state, "friction")?.value ||
    "Authority signal that compresses qualification time";
  const wedge =
    state.clarifications.differentiation ||
    findHypo(state, "differentiation")?.value ||
    "An under-published angle only you can credibly own";
  const maturity = state.stage || "early-stage";
  const solution = findHypo(state, "solution")?.value || state.model || "";
  const problem = findHypo(state, "problem")?.value || state.problem || "";

  // Infer archetype from the strongest free-text signals
  const blob = [state.model, industry, buyer, solution, problem, state.industries.join(" ")]
    .filter(Boolean)
    .join(" ");
  const match = ARCHETYPE_RULES.find((r) => r.keys.test(blob));
  const archetype = match?.archetype || state.model || "operator";
  const proofType = match?.proof || "validated outcomes specific to your buyers";
  const baseAuthority =
    match?.authority ||
    "translating lived operational credibility into educational authority your buyers can't get elsewhere";
  const authorityPath =
    findHypo(state, "narrative")?.value || baseAuthority;

  return {
    founder,
    venture,
    archetype,
    buyer,
    industry,
    maturity,
    motion,
    bottleneck,
    wedge,
    authorityPath,
    proofType,
  };
}

function buildSynthesis(ctx: BusinessContext): string {
  return `As a ${ctx.maturity.toLowerCase()} ${ctx.archetype} serving ${ctx.buyer.toLowerCase()} in ${ctx.industry.toLowerCase()}, your strongest commercial leverage comes from converting ${ctx.proofType} into ${ctx.authorityPath}. Your immediate constraint — ${ctx.bottleneck.toLowerCase().replace(/\.$/, "")} — is unblocked by a repeatable narrative cadence built around ${ctx.wedge.toLowerCase().replace(/\.$/, "")}, executed through ${ctx.motion.toLowerCase().replace(/\.$/, "")}.`;
}


/* =========================================================================
   Screen 2 — Context (optional uploads → feeds same intelligence model)
   ========================================================================= */

const CONTEXT_CATEGORIES: { label: string; items: string[] }[] = [
  {
    label: "Strategic decks & presentations",
    items: [
      "Investor pitch decks",
      "Commercial presentations",
      "Sales enablement decks",
      "Product presentations",
      "Competitor decks",
    ],
  },
  {
    label: "Documents & reports",
    items: [
      "Strategic PDFs",
      "Internal reports",
      "Customer case studies",
      "Strategic notes",
    ],
  },
  {
    label: "Commercial signals",
    items: [
      "CRM exports",
      "Performance snapshots",
      "Dashboard screenshots",
      "Meeting transcripts",
    ],
  },
  {
    label: "External context",
    items: [
      "Competitor websites",
      "Industry articles",
      "Newsletters followed",
      "Voice reflections",
    ],
  },
];

const CONTEXT_TYPES = CONTEXT_CATEGORIES.flatMap((c) => c.items);

const CONTEXT_PROCESS = [
  "Reading your business...",
  "Extracting commercial logic...",
  "Mapping market opportunity...",
  "Detecting growth friction...",
  "Building strategic memory...",
];

// Heuristic source-type classifier from filename or link
function classifySource(name: string): { kind: string; tone: string } {
  const n = name.toLowerCase();
  if (/(pitch|investor)/.test(n))
    return { kind: "Pitch deck", tone: "bg-violet-400/15 text-violet-300" };
  if (/\.(ppt|pptx|key)$/.test(n) || /deck|presentation|slides/.test(n))
    return { kind: "Presentation", tone: "bg-fuchsia-400/15 text-fuchsia-300" };
  if (/\.(csv|xlsx|xls)$/.test(n) || /crm|pipeline|export/.test(n))
    return { kind: "CRM export", tone: "bg-emerald-400/15 text-emerald-300" };
  if (/transcript|meeting|call|recording/.test(n) || /\.(vtt|srt)$/.test(n))
    return { kind: "Transcript", tone: "bg-sky-400/15 text-sky-300" };
  if (/\.(mp3|m4a|wav|ogg)$/.test(n) || /voice|reflection/.test(n))
    return { kind: "Voice note", tone: "bg-rose-400/15 text-rose-300" };
  if (/\.(png|jpg|jpeg|webp)$/.test(n) || /dashboard|screenshot|snapshot/.test(n))
    return { kind: "Snapshot", tone: "bg-amber-400/15 text-amber-300" };
  if (/competitor|vs-/.test(n))
    return { kind: "Competitor", tone: "bg-orange-400/15 text-orange-300" };
  if (/article|newsletter|blog|substack/.test(n) || /^https?:\/\//.test(n))
    return { kind: "External read", tone: "bg-cyan-400/15 text-cyan-300" };
  if (/\.(pdf|doc|docx|md)$/.test(n) || /report|memo|strategy|case/.test(n))
    return { kind: "Strategy doc", tone: "bg-indigo-400/15 text-indigo-300" };
  return { kind: "Context source", tone: "bg-primary/15 text-primary" };
}

function ContextFlow({
  state,
  patch,
  onNext,
  onSkip,
}: {
  state: State;
  patch: (p: Partial<State>) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const [phase, setPhase] = useState<"upload" | "processing">("upload");
  const [procIdx, setProcIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    patch({ importedFiles: [...state.importedFiles, ...names] });
  };

  const beginProcessing = () => {
    setPhase("processing");
    setProcIdx(0);
    let i = 0;
    const tick = () => {
      i++;
      if (i < CONTEXT_PROCESS.length) {
        setProcIdx(i);
        setTimeout(tick, 700);
      } else {
        setTimeout(onNext, 700);
      }
    };
    setTimeout(tick, 700);
  };

  const hasAnything =
    state.importedFiles.length > 0 || state.contextLinks.trim().length > 0;

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Step 1 — Strategic Ingestion"
        title="Train Your Revenue Coach"
        subtitle="Drop anything that helps me understand your business. I'll transform it into structured commercial intelligence — decks, transcripts, dashboards, articles, voice notes, screenshots. The more raw context, the sharper my first interpretation."
      />


      {phase === "upload" && (
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] animate-fade-up">
          <div className="space-y-4">
            <div
              onClick={() => inputRef.current?.click()}
              className="relative cursor-pointer rounded-3xl glass-strong p-10 text-center transition-all hover:shadow-glow border-2 border-dashed border-glass-border hover:border-primary/40"
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
                <Upload className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-base font-medium">Drop files, paste links, or upload exports</p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDFs, decks, transcripts, CRM exports, dashboards, voice notes — anything that
                explains how your business sells.
              </p>

              {state.importedFiles.length > 0 && (
                <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                  {state.importedFiles.slice(0, 10).map((f, i) => {
                    const c = classifySource(f);
                    return (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${c.tone}`}
                        title={f}
                      >
                        <span className="opacity-70">{c.kind}</span>
                        <span className="opacity-40">·</span>
                        <span className="max-w-[140px] truncate">{f}</span>
                      </span>
                    );
                  })}
                  {state.importedFiles.length > 10 && (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">
                      +{state.importedFiles.length - 10} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="glass rounded-2xl p-4 space-y-2">
              <span className="text-xs font-medium text-foreground/70">
                Links to articles, competitors, thought leaders you follow
              </span>
              <Textarea
                value={state.contextLinks}
                onChange={(e) => patch({ contextLinks: e.target.value })}
                placeholder="One per line — newsletters, competitor pages, voices that shape your perspective…"
                className="glass border-glass-border min-h-[80px] text-sm"
              />
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6">
            <div className="text-xs uppercase tracking-wider text-foreground/60 mb-3">
              What I can learn from
            </div>
            <div className="space-y-3">
              {CONTEXT_CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <div className="text-[10px] uppercase tracking-wider text-foreground/40 mb-1.5">
                    {cat.label}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((t) => (
                      <span
                        key={t}
                        className="rounded-full glass border border-glass-border px-2.5 py-1 text-[11px] text-foreground/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Button
                onClick={beginProcessing}
                disabled={!hasAnything}
                className="bg-gradient-primary text-primary-foreground shadow-glow"
              >
                {hasAnything
                  ? `Train coach on ${state.importedFiles.length + (state.contextLinks.trim() ? 1 : 0)} sources`
                  : "Drop sources to begin training"}
              </Button>
              <button
                onClick={onSkip}
                className="text-[11px] text-muted-foreground/70 hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Skip and build manually
              </button>
              <p className="text-[11px] text-muted-foreground/70 pt-1 leading-relaxed">
                Most founders upload first — the system understands their business in seconds,
                then asks only what remains unclear.
              </p>
            </div>
          </div>
        </div>
      )}

      {phase === "processing" && (
        <div className="grid gap-5 md:grid-cols-[1fr_1.2fr] animate-fade-up">
          <div className="glass-strong rounded-3xl p-8">
            <div className="text-[10px] uppercase tracking-wider text-foreground/50 mb-4">
              Ingestion pipeline
            </div>
            <ul className="space-y-3">
              {CONTEXT_PROCESS.map((s, i) => {
                const done = procIdx > i;
                const active = procIdx === i;
                return (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : active ? (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    ) : (
                      <CircleDashed className="h-4 w-4 text-muted-foreground/40" />
                    )}
                    <span
                      className={done || active ? "text-foreground" : "text-muted-foreground/60"}
                    >
                      {s}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 border-t border-glass-border pt-4 text-[11px] text-muted-foreground leading-relaxed">
              Every source is parsed for: problem, solution, buyers, industry, motion,
              constraints, differentiation, authority opportunity, proof signals & revenue
              hypotheses — each scored independently before reconciliation.
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6">
            <div className="text-[10px] uppercase tracking-wider text-foreground/50 mb-3">
              Sources being interpreted
            </div>
            <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
              {[
                ...state.importedFiles,
                ...state.contextLinks
                  .split("\n")
                  .map((l) => l.trim())
                  .filter(Boolean),
              ].map((src, i) => {
                const c = classifySource(src);
                const reached = procIdx >= Math.min(i, CONTEXT_PROCESS.length - 1);
                const conf = 60 + ((i * 7) % 35);
                return (
                  <div
                    key={src + i}
                    className="glass rounded-xl p-3 flex items-center gap-3 text-xs"
                  >
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${c.tone}`}>
                      {c.kind}
                    </span>
                    <span className="flex-1 truncate text-foreground/85">{src}</span>
                    {reached ? (
                      <span className="inline-flex items-center gap-1 text-emerald-300 tabular-nums">
                        <CheckCircle2 className="h-3 w-3" />
                        {conf}%
                      </span>
                    ) : (
                      <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-[11px] text-muted-foreground/80 leading-relaxed">
              When signals are weak, MondayOS flags low-confidence fields and asks a
              lightweight follow-up question instead of hallucinating certainty.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Screen 3 — Strategic Interpretation Review
   AI presents structured extraction across 8 strategic fields, tiered by
   confidence (green / yellow / red). Founder validates greens once,
   iteratively refines yellows & reds until overall confidence ≥ 90%.
   ========================================================================= */

const CONFIDENCE_THRESHOLD = 90;

type ReviewMode = "idle" | "alt" | "freeform";

function UnifiedValidation({
  state,
  patch,
  onNext,
}: {
  state: State;
  patch: (p: Partial<State>) => void;
  onNext: () => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mode, setMode] = useState<ReviewMode>("idle");
  const [draft, setDraft] = useState("");

  const overallConfidence = useMemo(() => {
    if (state.hypotheses.length === 0) return 0;
    const sum = state.hypotheses.reduce((acc, h) => {
      const lift = h.status === "approved" ? 6 : h.status === "refined" ? 8 : 0;
      return acc + Math.min(100, h.confidence + lift);
    }, 0);
    return Math.round(sum / state.hypotheses.length);
  }, [state.hypotheses]);

  const grouped = useMemo(() => {
    const g: Record<Tier, Hypothesis[]> = { high: [], medium: [], low: [] };
    for (const h of state.hypotheses) g[tierOf(h.confidence)].push(h);
    return g;
  }, [state.hypotheses]);

  const totalUnclear = grouped.medium.length + grouped.low.length;
  const resolvedUnclear = [...grouped.medium, ...grouped.low].filter(
    (h) => h.status !== "pending",
  ).length;

  const canContinue = overallConfidence >= CONFIDENCE_THRESHOLD;

  const openCard = (id: string) => {
    setActiveId(id);
    setMode("idle");
    setDraft("");
  };

  const closeCard = () => {
    setActiveId(null);
    setMode("idle");
    setDraft("");
  };

  const approve = (h: Hypothesis) => {
    patch({
      hypotheses: updateHypothesis(state, h.id, {
        status: "approved",
        confidence: Math.max(h.confidence, 94),
      }),
    });
    closeCard();
  };

  const adjustWithAlt = (h: Hypothesis, alt: string) => {
    patch({
      hypotheses: updateHypothesis(state, h.id, {
        value: alt,
        status: "refined",
        confidence: Math.max(h.confidence + 18, 92),
      }),
      clarifications: { ...state.clarifications, [h.id]: alt },
    });
    closeCard();
  };

  const correct = (h: Hypothesis) => {
    if (!draft.trim()) return;
    patch({
      hypotheses: updateHypothesis(state, h.id, {
        value: draft.trim(),
        status: "refined",
        confidence: Math.max(h.confidence + 22, 93),
      }),
      clarifications: { ...state.clarifications, [h.id]: draft.trim() },
    });
    closeCard();
  };

  const tierMeta: Record<
    Tier,
    { label: string; sub: string; ring: string; chip: string; dot: string }
  > = {
    high: {
      label: "What I confidently understand",
      sub: "High confidence — confirm and move on.",
      ring: "border-emerald-400/30 bg-emerald-400/[0.04]",
      chip: "bg-emerald-400/15 text-emerald-300",
      dot: "bg-emerald-400",
    },
    medium: {
      label: "What I partially understand",
      sub: "Medium confidence — quick refinement sharpens this.",
      ring: "border-amber-300/30 bg-amber-300/[0.04]",
      chip: "bg-amber-300/15 text-amber-200",
      dot: "bg-amber-300",
    },
    low: {
      label: "What I need your help clarifying",
      sub: "Low confidence — I won't fabricate certainty. Please correct me.",
      ring: "border-rose-400/30 bg-rose-400/[0.04]",
      chip: "bg-rose-400/15 text-rose-300",
      dot: "bg-rose-400",
    },
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Strategic Interpretation Review"
        title="Here's how I'm reading your business."
        subtitle="I extracted eight strategic fields from everything you shared. Green is solid, amber needs a quick refinement, red I'm flagging as low-confidence — I won't pretend to know what I don't."
      />

      {/* Confidence header */}
      <div className="glass-strong rounded-2xl p-5 animate-fade-up">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Strategic Confidence</div>
          <div className="text-xl font-semibold text-gradient-primary tabular-nums">
            {overallConfidence}%
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500",
              canContinue ? "bg-gradient-primary" : "bg-amber-300/70",
            )}
            style={{ width: `${overallConfidence}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {resolvedUnclear} of {totalUnclear} unclear fields refined · threshold{" "}
          {CONFIDENCE_THRESHOLD}%
        </p>
      </div>

      <AiBubble>
        {state.hasContext
          ? "I parsed your uploaded context like a CRO reading a deal review. Below is my structured interpretation across the strategic fields that matter."
          : "Without uploads I'm working from your baseline identity. Several fields will be low-confidence — that's expected. Help me sharpen the amber and red ones."}
      </AiBubble>

      {/* Tiered card groups */}
      {(["high", "medium", "low"] as Tier[]).map((tier) => {
        const items = grouped[tier];
        if (items.length === 0) return null;
        const meta = tierMeta[tier];
        return (
          <section key={tier} className="space-y-3 animate-fade-up">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
              <h3 className="text-sm font-semibold">{meta.label}</h3>
              <span className="text-[11px] text-muted-foreground">{meta.sub}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((h) => {
                const field = FIELD_BY_ID[h.id];
                const Icon = field?.icon ?? Brain;
                const open = activeId === h.id;
                return (
                  <article
                    key={h.id}
                    className={cn(
                      "rounded-2xl border p-5 space-y-3 transition-all",
                      meta.ring,
                      open && "shadow-glow",
                    )}
                  >
                    <header className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg glass border border-glass-border">
                          <Icon className="h-4 w-4 text-foreground/80" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">{h.label}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {tier === "high"
                              ? "High confidence"
                              : tier === "medium"
                                ? "Medium confidence"
                                : "Low confidence"}
                          </div>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] tabular-nums",
                          meta.chip,
                        )}
                      >
                        {h.confidence}%
                      </span>
                    </header>

                    <p className="text-sm leading-relaxed text-foreground/90">{h.value}</p>

                    {field && (
                      <p className="text-[11px] text-muted-foreground italic">
                        {field.rationale}
                      </p>
                    )}

                    {h.status !== "pending" && (
                      <div className="flex items-center gap-2">
                        {h.status === "approved" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] text-emerald-300">
                            <Check className="h-3 w-3" /> Validated by founder
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">
                            <Settings2 className="h-3 w-3" /> Refined by founder
                          </span>
                        )}
                      </div>
                    )}

                    {!open && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={() => approve(h)}
                          className="text-[11px] rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-300 hover:bg-emerald-400/25"
                        >
                          Exactly right
                        </button>
                        <button
                          onClick={() => {
                            openCard(h.id);
                            setMode("alt");
                          }}
                          className="text-[11px] rounded-full bg-amber-300/15 px-2.5 py-1 text-amber-200 hover:bg-amber-300/25"
                        >
                          Close but adjust
                        </button>
                        <button
                          onClick={() => {
                            openCard(h.id);
                            setMode("freeform");
                            setDraft("");
                          }}
                          className="text-[11px] rounded-full bg-rose-400/15 px-2.5 py-1 text-rose-300 hover:bg-rose-400/25"
                        >
                          Not correct
                        </button>
                      </div>
                    )}

                    {open && field && (
                      <div className="rounded-xl border border-glass-border bg-background/30 p-3 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs text-foreground/80">
                            {field.refineQuestion}
                          </p>
                          <button
                            onClick={closeCard}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {mode === "alt" && (
                          <div className="flex flex-wrap gap-1.5">
                            {field.alternatives.map((alt) => (
                              <button
                                key={alt}
                                onClick={() => adjustWithAlt(h, alt)}
                                className="text-[11px] rounded-full glass border border-glass-border px-2.5 py-1 text-foreground/80 hover:border-primary/40 hover:text-foreground"
                              >
                                {alt}
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                setMode("freeform");
                                setDraft("");
                              }}
                              className="text-[11px] rounded-full bg-primary/15 px-2.5 py-1 text-primary hover:bg-primary/25 inline-flex items-center gap-1"
                            >
                              <Pencil className="h-3 w-3" /> Write my own
                            </button>
                          </div>
                        )}

                        {mode === "freeform" && (
                          <div className="space-y-2">
                            <Textarea
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              placeholder="Correct me in your own words…"
                              className="glass border-glass-border min-h-[72px] text-sm"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={closeCard}
                                className="text-[11px] rounded-full glass border border-glass-border px-2.5 py-1 text-muted-foreground"
                              >
                                Cancel
                              </button>
                              <button
                                disabled={!draft.trim()}
                                onClick={() => correct(h)}
                                className="text-[11px] rounded-full bg-primary/20 px-2.5 py-1 text-primary hover:bg-primary/30 disabled:opacity-40"
                              >
                                Update understanding
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="flex items-center justify-between border-t border-glass-border pt-5">
        <p className="text-xs text-muted-foreground max-w-md">
          {canContinue
            ? "Strategic confidence is high enough — I have a defensible interpretation of your business."
            : "Refine the amber and red cards until strategic confidence crosses 90% — I won't move forward on weak inferences."}
        </p>
        <PrimaryCTA disabled={!canContinue} onClick={onNext}>
          {canContinue
            ? "Generate Revenue Intelligence Export"
            : `Refine to ${CONFIDENCE_THRESHOLD}% to continue`}
        </PrimaryCTA>
      </div>
    </div>
  );
}





/* =========================================================================
   Screen 4 — Connect
   ========================================================================= */

function ConnectSystems({
  state,
  patch,
  onNext,
}: {
  state: State;
  patch: (p: Partial<State>) => void;
  onNext: () => void;
}) {
  const setStatus = (id: string, status: "connected" | "pending" | "skipped") => {
    patch({ connections: { ...state.connections, [id]: status } });
    if (status === "pending") {
      setTimeout(() => {
        patch({ connections: { ...state.connections, [id]: "connected" } });
      }, 1200);
    }
  };

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Revenue Systems"
        title="Connect Your Revenue Systems"
        subtitle="These systems will continuously train your revenue intelligence layer. Connect what you have — skip the rest."
      />

      <div className="grid gap-3 md:grid-cols-3 animate-fade-up">
        {CONNECTORS.map((c) => {
          const Icon = c.icon;
          const status = state.connections[c.id] || "idle";
          return (
            <div
              key={c.id}
              className="glass-strong rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl glass border border-glass-border">
                <Icon className="h-4 w-4 text-foreground/80" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{c.label}</div>
                <div className="text-[11px] text-muted-foreground capitalize">
                  {status === "idle" ? "Not connected" : status}
                </div>
              </div>
              {status === "connected" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">
                  <Check className="h-3 w-3" /> Connected
                </span>
              ) : status === "pending" ? (
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              ) : status === "skipped" ? (
                <button
                  onClick={() => setStatus(c.id, "pending")}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Connect
                </button>
              ) : (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setStatus(c.id, "pending")}
                    className="text-[11px] rounded-full bg-primary/15 px-2.5 py-1 text-primary hover:bg-primary/25"
                  >
                    Connect
                  </button>
                  <button
                    onClick={() => setStatus(c.id, "skipped")}
                    className="text-[11px] rounded-full glass border border-glass-border px-2.5 py-1 text-muted-foreground hover:text-foreground"
                  >
                    Skip
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mx-auto max-w-xl">
        <AiBubble>
          These systems will continuously train your revenue intelligence layer.
        </AiBubble>
      </div>

      <div className="flex justify-end">
        <PrimaryCTA onClick={onNext}>Continue</PrimaryCTA>
      </div>
    </div>
  );
}

/* =========================================================================
   Screen 5 — Segmentation
   ========================================================================= */

function Segmentation({
  state,
  patch,
  onNext,
}: {
  state: State;
  patch: (p: Partial<State>) => void;
  onNext: () => void;
}) {
  const company = state.name ? state.name + "’s venture" : "your venture";
  const ind1 = getDerivedIndustry(state);
  const friction = getDerivedBottleneck(state);


  const synth: Record<string, string> = {
    primary: `Senior commercial leaders at ${ind1.toLowerCase()} companies, 10–80 employees, scaling past founder-led traction.`,
    secondary: `Founder-operators bridging product and GTM at adjacent verticals where ${company}'s wedge translates.`,
    friction: `${friction} concentrated at the qualification-to-commitment stage — buyers stall without authority reinforcement.`,
    authority: `An under-published contrarian POV on AI-native commercial motion that ${company} is uniquely positioned to own.`,
    gap: `Competitors over-index on tooling depth; ${company} can lead with implementation simplicity and time-to-value.`,
    influence: `Founder-led narrative + customer proof + repeatable POV cadence = compounding inbound authority signals.`,
  };

  const allApproved = SEGMENT_CARDS.every((c) => state.segmentApprovals[c.id]);

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Revenue Intelligence Segmentation"
        title="Validate your strategic model."
        subtitle="I've synthesized your commercial intelligence into validated segments. Approve or refine each."
      />

      <div className="grid gap-4 md:grid-cols-2 animate-fade-up">
        {SEGMENT_CARDS.map((c) => {
          const Icon = c.icon;
          const approved = !!state.segmentApprovals[c.id];
          return (
            <div key={c.id} className="glass-strong rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg glass border border-glass-border">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="text-sm font-semibold">{c.label}</h4>
                </div>
                {approved && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">
                    <Check className="h-3 w-3" /> Validated
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{synth[c.id]}</p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    patch({
                      segmentApprovals: { ...state.segmentApprovals, [c.id]: true },
                    })
                  }
                  className={cn(
                    "text-xs rounded-full px-3 py-1 transition",
                    approved
                      ? "bg-primary/25 text-primary"
                      : "bg-primary/15 text-primary hover:bg-primary/25",
                  )}
                >
                  Approve
                </button>
                <button
                  className="text-xs rounded-full glass border border-glass-border px-3 py-1 text-foreground/80 hover:border-primary/40"
                  onClick={() =>
                    patch({
                      segmentApprovals: { ...state.segmentApprovals, [c.id]: true },
                    })
                  }
                >
                  Refine
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <PrimaryCTA disabled={!allApproved} onClick={onNext}>
          {allApproved ? "Build intelligence layer" : "Validate all cards to continue"}
        </PrimaryCTA>
      </div>
    </div>
  );
}

/* =========================================================================
   Screen 6 — Export dashboard
   ========================================================================= */

function ExportDashboard({ state, onNext }: { state: State; onNext: () => void }) {
  const finalScore = useMemo(() => {
    if (state.hypotheses.length === 0) return 0;
    const sum = state.hypotheses.reduce((acc, h) => {
      const lift = h.status === "approved" ? 6 : h.status === "refined" ? 8 : 0;
      return acc + Math.min(100, h.confidence + lift);
    }, 0);
    return Math.round(sum / state.hypotheses.length);
  }, [state.hypotheses]);

  const [score, setScore] = useState(0);
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += 2;
      if (v >= finalScore) {
        v = finalScore;
        clearInterval(id);
      }
      setScore(v);
    }, 18);
    return () => clearInterval(id);
  }, [finalScore]);

  // Persist validated Founder Revenue Intelligence Database (FRID).
  // Consumed downstream by Weekly Memory Engine, Strategic Scoring Engine,
  // and Sprint Generation Engine.
  useEffect(() => {
    try {
      const frid = {
        version: 1,
        updatedAt: new Date().toISOString(),
        founder: { name: state.name, model: state.model, stage: state.stage },
        market: { industries: state.industries, audiences: state.audiences },
        intelligence: Object.fromEntries(
          state.hypotheses.map((h) => [
            h.id,
            {
              label: h.label,
              value: h.value,
              confidence: h.confidence,
              status: h.status,
              validatedByFounder: h.status !== "pending",
            },
          ]),
        ),
        segments: state.segmentApprovals,
        sources: {
          files: state.importedFiles,
          links: state.contextLinks
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean),
        },
        readiness: finalScore,
      };
      localStorage.setItem("mondayos.frid", JSON.stringify(frid));
    } catch {
      /* storage unavailable — non-blocking */
    }
  }, [state, finalScore]);



  const ctx = resolveContext(state);
  const company = ctx.venture;
  const synthesis = buildSynthesis(ctx);

  // Map structured fields to a labelled export grid
  const exportSections: { id: string; label: string }[] = [
    { id: "problem", label: "Problem Being Solved" },
    { id: "solution", label: "Solution Mechanism" },
    { id: "icp", label: "Target Buyers" },
    { id: "market", label: "Industry Focus" },
    { id: "motion", label: "Commercial Motion" },
    { id: "friction", label: "Growth Bottlenecks" },
    { id: "differentiation", label: "Competitive Wedge" },
    { id: "narrative", label: "Authority Narrative" },
  ];

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Founder Revenue Intelligence Database"
        title="Your Validated Strategic Model"
        subtitle="Every field below is explicit, structured, and validated by you. This database now powers the Weekly Memory Engine, Strategic Scoring Engine, and Sprint Generation Engine."
      />

      <div className="mx-auto flex items-center gap-2 rounded-full glass border border-glass-border px-3 py-1.5 text-[11px] text-foreground/70 w-fit">
        <Database className="h-3.5 w-3.5 text-primary" />
        FRID persisted — {state.importedFiles.length} files ·{" "}
        {state.contextLinks.split("\n").filter((l) => l.trim()).length} links ·{" "}
        {state.hypotheses.filter((h) => h.status !== "pending").length}/
        {state.hypotheses.length} fields validated
      </div>

      <div className="grid gap-3 md:grid-cols-2 animate-fade-up">
        {exportSections.map((s) => {
          const h = findHypo(state, s.id);
          const field = FIELD_BY_ID[s.id];
          const Icon = field?.icon ?? Brain;
          return (
            <article
              key={s.id}
              className="glass-strong rounded-2xl p-5 space-y-2.5"
            >
              <header className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                    <Icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </div>
                    <div className="text-xs text-foreground/60">{h?.confidence ?? 0}% confidence</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] text-emerald-300">
                  <Check className="h-3 w-3" /> Validated by founder
                </span>
              </header>
              <p className="text-sm leading-relaxed text-foreground/90">
                {h?.value ?? "—"}
              </p>
            </article>
          );
        })}

        <div className="glass-strong rounded-2xl p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Strategic Readiness Score</div>
            <div className="text-xl font-semibold text-gradient-primary tabular-nums">
              {score}%
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-100"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="glass-strong rounded-3xl p-7 animate-fade-up">
        <div className="flex items-center gap-2 text-xs text-foreground/60 uppercase tracking-wider mb-3">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          CRO synthesis
        </div>
        <p className="text-base leading-relaxed text-foreground/90">{synthesis}</p>
        <p className="mt-5 text-sm text-foreground/70 italic">
          We now understand enough to begin executing your founder-led growth engine.
        </p>
      </div>

      <div className="flex justify-end">
        <PrimaryCTA onClick={onNext}>Generate Sprint Zero</PrimaryCTA>
      </div>
    </div>
  );
}


/* =========================================================================
   Screen 7 — Sprint Zero
   ========================================================================= */

function SprintZero({ state, onLaunch }: { state: State; onLaunch: () => void }) {
  const ctx = resolveContext(state);
  const buyerShort = ctx.buyer.split(/[,.]/)[0].trim().toLowerCase() || "your buyers";
  const proofShort = ctx.proofType.toLowerCase();
  const authShort = ctx.authorityPath.toLowerCase().replace(/\.$/, "");

  const blocks = [
    {
      label: "This Week's Narrative",
      icon: FileText,
      items: [
        `Authority post — ${ctx.founder}'s contrarian POV on ${authShort}`,
        `Long-form draft — a ${ctx.archetype}'s honest take on "${ctx.bottleneck.replace(/\.$/, "")}"`,
        `Short-form script — 60s insight aimed at ${buyerShort}`,
      ],
    },
    {
      label: "Founder Actions Required",
      icon: Zap,
      items: [
        `Approve positioning angle around ${ctx.wedge.toLowerCase().replace(/\.$/, "")}`,
        `Surface one proof point that demonstrates ${proofShort}`,
        `Record a 60s reflection in your own voice (no script)`,
      ],
    },
    {
      label: "Commercial Activation",
      icon: TrendingUp,
      items: [
        `Re-engage warm ${buyerShort} contacts with a context-specific nudge`,
        `Pressure-test the new narrative against ${ctx.motion.toLowerCase().replace(/\.$/, "")}`,
        `Capture one signal that confirms or breaks the positioning hypothesis`,
      ],
    },
  ];

  const calendar = [
    { day: "Monday", task: `Approve positioning angle for ${ctx.archetype}` },
    { day: "Tuesday", task: `Record founder insight for ${buyerShort}` },
    { day: "Wednesday", task: `Publish narrative anchored in ${authShort.split(",")[0]}` },
    { day: "Thursday", task: `Re-engage warm ${buyerShort} contacts` },
    { day: "Friday", task: `Review which signals confirm the wedge` },
  ];

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Sprint Zero"
        title="Your First Revenue Sprint Is Ready"
        subtitle={`Engineered from your validated intelligence layer — adapted to a ${ctx.archetype} selling into ${buyerShort}.`}
      />

      <div className="grid gap-4 md:grid-cols-3 animate-fade-up">
        {blocks.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.label} className="glass-strong rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                  <Icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <h4 className="text-sm font-semibold">{b.label}</h4>
              </div>
              <ul className="space-y-2">
                {b.items.map((it) => (
                  <li key={it} className="flex gap-2 text-sm text-foreground/80 leading-relaxed">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="glass-strong rounded-3xl p-6 animate-fade-up">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/60 mb-4">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          Weekly calendar
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {calendar.map((c) => (
            <div key={c.day} className="rounded-2xl glass border border-glass-border p-4">
              <div className="text-[10px] uppercase tracking-wider text-primary">{c.day}</div>
              <div className="mt-1.5 text-sm text-foreground/90 leading-snug">{c.task}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onLaunch}
          className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5"
        >
          <Rocket className="h-5 w-5" />
          Launch MondayOS
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   Launching + Active
   ========================================================================= */

const LAUNCH_STEPS = [
  "Training Revenue Memory...",
  "Activating Strategic Intelligence...",
  "Launching Sprint Zero...",
];

function Launching({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i < LAUNCH_STEPS.length) {
      const t = setTimeout(() => setI(i + 1), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, 700);
    return () => clearTimeout(t);
  }, [i, onDone]);
  return (
    <div className="mx-auto max-w-md glass-strong rounded-3xl p-10 text-center space-y-6 animate-fade-up">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
        <Loader2 className="h-7 w-7 text-primary-foreground animate-spin" />
      </div>
      <ul className="space-y-3 text-left">
        {LAUNCH_STEPS.map((s, idx) => {
          const done = i > idx;
          const active = i === idx;
          return (
            <li key={s} className="flex items-center gap-3 text-sm">
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : active ? (
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              ) : (
                <CircleDashed className="h-4 w-4 text-muted-foreground/40" />
              )}
              <span className={done || active ? "text-foreground" : "text-muted-foreground/60"}>
                {s}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Active({ name }: { name: string }) {
  const first = name.split(" ")[0] || "Founder";
  return (
    <div className="mx-auto max-w-xl glass-strong rounded-3xl p-10 text-center space-y-6 animate-fade-up">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
        <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-gradient">Revenue Coach Active</h2>
        <p className="text-foreground/70">
          Welcome aboard, {first}. Sprint Zero is live. Ready for weekly execution.
        </p>
      </div>
      <div className="flex justify-center gap-3 pt-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
          Intelligence layer streaming
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full glass border border-glass-border px-3 py-1 text-xs text-foreground/70">
          Sprint 1 in 7 days
        </span>
      </div>
    </div>
  );
}
