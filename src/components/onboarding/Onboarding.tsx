import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Compass,
  Rocket,
  Sparkles,
  Loader2,
  Target,
  Telescope,
  Wrench,
  Zap,
  CheckCircle2,
  Building2,
  LineChart,
  AlertTriangle,
  Swords,
  Mic,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AiBubble, TypingDots } from "./AiBubble";
import { Field } from "./Field";
import { ChoiceField } from "./ChoiceField";
import { StyleCard } from "./StyleCard";
import { ProgressRail } from "./ProgressRail";

type StepKey =
  | "founder"
  | "commercial"
  | "tried"
  | "competitive"
  | "thesis"
  | "style"
  | "objectives";

interface State {
  // Founder (qualitative — open)
  company: string;
  doesWhat: string;
  problem: string;
  whyMatters: string;
  // Commercial Reality (closed — categorical/quant for DS)
  howBuy: string;
  pricing: string;
  customers: string;
  salesCycle: string;
  // Tried (closed — channels & funnel stage)
  triedWhat: string[];
  worked: string;
  notWorked: string;
  stuck: string;
  // Competitive (qualitative — open)
  competitors: string;
  whyChoose: string;
  whyHesitate: string;
  // Thesis (qualitative — open)
  misunderstood: string;
  truth: string;
  lesson: string;
  // Style
  style: string;
  // Objectives (closed for quant fields)
  outcome90: string;
  meetings: string;
  success: string;
}

const initial: State = {
  company: "",
  doesWhat: "",
  problem: "",
  whyMatters: "",
  howBuy: "",
  pricing: "",
  customers: "",
  salesCycle: "",
  triedWhat: [],
  worked: "",
  notWorked: "",
  stuck: "",
  competitors: "",
  whyChoose: "",
  whyHesitate: "",
  misunderstood: "",
  truth: "",
  lesson: "",
  style: "",
  outcome90: "",
  meetings: "",
  success: "",
};

const steps: { key: StepKey; label: string; intro: string; ack: string }[] = [
  {
    key: "founder",
    label: "Founder",
    intro:
      "Let's start with the foundation. Before tactics, I need to understand the company you're building and why it exists.",
    ack: "I'm starting to understand your company's purpose and strategic foundation.",
  },
  {
    key: "commercial",
    label: "Commercial",
    intro:
      "Now let's look at how revenue actually moves through your business today.",
    ack: "I'm mapping your commercial operating model.",
  },
  {
    key: "tried",
    label: "Traction",
    intro:
      "Every founder has a graveyard of experiments. That history is signal — let's mine it.",
    ack: "I'm identifying your growth friction points.",
  },
  {
    key: "competitive",
    label: "Competitive",
    intro: "Every market has gravity. Let's locate yours.",
    ack: "I'm defining your strategic wedge in the market.",
  },
  {
    key: "thesis",
    label: "Thesis",
    intro: "A founder without a thesis is a vendor. Let's surface yours.",
    ack: "This becomes the intellectual foundation of your authority strategy.",
  },
  {
    key: "style",
    label: "Voice",
    intro: "How do you sound when you're at your sharpest?",
    ack: "I'll adapt your strategic voice accordingly.",
  },
  {
    key: "objectives",
    label: "Objectives",
    intro: "Finally — what does winning look like over the next 90 days?",
    ack: "Now we can align your weekly execution to measurable growth.",
  },
];

const styleOptions = [
  {
    id: "Analytical Operator",
    icon: BarChart3,
    description: "Data-led, framework-driven, sharp on numbers and unit economics.",
  },
  {
    id: "Contrarian Builder",
    icon: Zap,
    description: "Opinionated takes, breaks conventional wisdom, challenges norms.",
  },
  {
    id: "Visionary Category Creator",
    icon: Telescope,
    description: "Paints the 10-year picture, names the new category, defines language.",
  },
  {
    id: "Tactical Problem Solver",
    icon: Wrench,
    description: "Playbooks, tactical specifics, ships value from line one.",
  },
];

// ---------------------------------------------------------------------------
// Closed-question option sets (categorical / bucketed numeric — DS-friendly)
// ---------------------------------------------------------------------------

const motionOptions = [
  { value: "self-serve", label: "Self-serve", hint: "Sign up & pay without sales" },
  { value: "plg", label: "Product-led (PLG)", hint: "Free → upgrade motion" },
  { value: "inbound-sales", label: "Inbound sales", hint: "Demos from marketing leads" },
  { value: "outbound-sales", label: "Outbound sales", hint: "SDR / founder-led outreach" },
  { value: "channel-partner", label: "Channel / partner", hint: "Resellers, integrators" },
  { value: "enterprise", label: "Enterprise / RFP", hint: "Procurement-driven cycles" },
];

const pricingOptions = [
  { value: "<$100/mo", label: "< $100 / mo" },
  { value: "$100–500/mo", label: "$100 – $500 / mo" },
  { value: "$500–2k/mo", label: "$500 – $2k / mo" },
  { value: "$2k–10k/mo", label: "$2k – $10k / mo" },
  { value: "$10k+/mo", label: "$10k+ / mo" },
  { value: "custom", label: "Custom / enterprise" },
];

const customerCountOptions = [
  { value: "0", label: "Pre-revenue" },
  { value: "1–10", label: "1 – 10" },
  { value: "11–50", label: "11 – 50" },
  { value: "51–200", label: "51 – 200" },
  { value: "201–1000", label: "201 – 1,000" },
  { value: "1000+", label: "1,000+" },
];

const cycleOptions = [
  { value: "<7d", label: "< 1 week" },
  { value: "1–4w", label: "1 – 4 weeks" },
  { value: "1–3mo", label: "1 – 3 months" },
  { value: "3–6mo", label: "3 – 6 months" },
  { value: "6mo+", label: "6 months+" },
];

const channelOptions = [
  { value: "cold-outbound", label: "Cold outbound" },
  { value: "linkedin-content", label: "LinkedIn content" },
  { value: "seo-content", label: "SEO / blog" },
  { value: "paid-ads", label: "Paid ads" },
  { value: "events", label: "Events / conferences" },
  { value: "webinars", label: "Webinars" },
  { value: "partnerships", label: "Partnerships" },
  { value: "referrals", label: "Referrals" },
  { value: "communities", label: "Communities" },
  { value: "podcasts", label: "Podcast / PR" },
];

const stuckOptions = [
  { value: "top-of-funnel", label: "Top of funnel", hint: "Not enough qualified leads" },
  { value: "discovery", label: "Discovery", hint: "Leads don't convert to meetings" },
  { value: "demo", label: "Demo / evaluation", hint: "Prospects ghost after demo" },
  { value: "proposal", label: "Proposal / pricing", hint: "Stalls on pricing pushback" },
  { value: "procurement", label: "Procurement / legal", hint: "Security & contract delays" },
  { value: "champion", label: "Champion buy-in", hint: "Internal selling fails" },
];

const meetingsOptions = [
  { value: "<5", label: "Fewer than 5 / mo" },
  { value: "5–10", label: "5 – 10 / mo" },
  { value: "10–25", label: "10 – 25 / mo" },
  { value: "25–50", label: "25 – 50 / mo" },
  { value: "50+", label: "50+ / mo" },
];

const outcomeOptions = [
  { value: "pipeline", label: "Build pipeline coverage" },
  { value: "logos", label: "Sign new logos" },
  { value: "expansion", label: "Expand existing accounts" },
  { value: "shorten-cycle", label: "Shorten the sales cycle" },
  { value: "category", label: "Establish category authority" },
  { value: "fundraise", label: "Prep for fundraise / round" },
];

export function Onboarding() {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<State>(initial);
  const [ackVisible, setAckVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  const step = steps[stepIndex];

  const canAdvance = useMemo(() => {
    switch (step.key) {
      case "founder":
        return data.company && data.doesWhat && data.problem && data.whyMatters;
      case "commercial":
        return data.howBuy && data.pricing && data.customers && data.salesCycle;
      case "tried":
        return data.triedWhat.length > 0 && data.worked && data.notWorked && data.stuck;
      case "competitive":
        return data.competitors && data.whyChoose && data.whyHesitate;
      case "thesis":
        return data.misunderstood && data.truth && data.lesson;
      case "style":
        return !!data.style;
      case "objectives":
        return data.outcome90 && data.meetings && data.success;
    }
  }, [step.key, data]);

  useEffect(() => {
    setAckVisible(false);
  }, [stepIndex]);

  function handleNext() {
    if (!canAdvance) return;
    setAckVisible(true);
    setTimeout(() => {
      if (stepIndex < steps.length - 1) {
        setStepIndex((i) => i + 1);
      } else {
        setDone(true);
      }
    }, 1200);
  }

  function update<K extends keyof State>(key: K, value: State[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  if (done) {
    return (
      <SummaryScreen
        data={data}
        activating={activating}
        activated={activated}
        onActivate={() => {
          setActivating(true);
          setTimeout(() => setActivated(true), 2400);
        }}
      />
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="mb-10 animate-fade-up">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Brand />
          <ProgressRail steps={steps} current={stepIndex} />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
          Scale up your time on what you specialize in while your sidebreak takes on smaller jobs
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          From solo operator to enterprise: discover the roadmap that transforms
          your small business into a scalable revenue machine.
        </p>
      </div>

      <div
        key={step.key}
        className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up space-y-6"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
            Step {stepIndex + 1} of {steps.length} · {step.label}
          </span>
          <span className="text-xs text-muted-foreground">Revenue DNA Engine</span>
        </div>

        <AiBubble>{step.intro}</AiBubble>

        <div className="space-y-4 pt-2">
          {step.key === "founder" && (
            <>
              <Field
                autoFocus
                label="What company are you building?"
                placeholder="Company name"
                value={data.company}
                onChange={(v) => update("company", v)}
              />
              <Field
                label="What does your company do?"
                placeholder="Product, category, core promise"
                value={data.doesWhat}
                onChange={(v) => update("doesWhat", v)}
                multiline
              />
              <Field
                label="What problem are you solving?"
                placeholder="The pain that makes them pay"
                value={data.problem}
                onChange={(v) => update("problem", v)}
                multiline
              />
              <Field
                label="Why does this problem matter to you?"
                placeholder="The founder reason — not the deck reason"
                value={data.whyMatters}
                onChange={(v) => update("whyMatters", v)}
                multiline
              />
            </>
          )}

          {step.key === "commercial" && (
            <>
              <ChoiceField
                label="How do customers buy from you today?"
                options={motionOptions}
                value={data.howBuy}
                onChange={(v) => update("howBuy", v as string)}
              />
              <ChoiceField
                label="What's your typical price point?"
                options={pricingOptions}
                value={data.pricing}
                onChange={(v) => update("pricing", v as string)}
                columns={3}
              />
              <ChoiceField
                label="How many paying customers do you have today?"
                options={customerCountOptions}
                value={data.customers}
                onChange={(v) => update("customers", v as string)}
                columns={3}
              />
              <ChoiceField
                label="What's your average sales cycle length?"
                options={cycleOptions}
                value={data.salesCycle}
                onChange={(v) => update("salesCycle", v as string)}
                columns={3}
              />
            </>
          )}

          {step.key === "tried" && (
            <>
              <ChoiceField
                multi
                label="Which channels have you tried to generate customers?"
                options={channelOptions}
                value={data.triedWhat}
                onChange={(v) => update("triedWhat", v as string[])}
              />
              <Field
                label="What has worked best — and why?"
                placeholder="The repeatable bright spots"
                value={data.worked}
                onChange={(v) => update("worked", v)}
                multiline
              />
              <Field
                label="What hasn't worked?"
                placeholder="The honest list — failed bets, dead channels"
                value={data.notWorked}
                onChange={(v) => update("notWorked", v)}
                multiline
              />
              <ChoiceField
                label="Where do deals usually get stuck?"
                options={stuckOptions}
                value={data.stuck}
                onChange={(v) => update("stuck", v as string)}
              />
            </>
          )}

          {step.key === "competitive" && (
            <>
              <Field
                autoFocus
                label="Who are your primary competitors?"
                placeholder="Direct, indirect, the status quo"
                value={data.competitors}
                onChange={(v) => update("competitors", v)}
              />
              <Field
                label="Why do customers choose you over them?"
                placeholder="The real reason — not the brochure version"
                value={data.whyChoose}
                onChange={(v) => update("whyChoose", v)}
                multiline
              />
              <Field
                label="Why do prospects hesitate?"
                placeholder="Friction, risk, missing proof"
                value={data.whyHesitate}
                onChange={(v) => update("whyHesitate", v)}
                multiline
              />
            </>
          )}

          {step.key === "thesis" && (
            <>
              <Field
                autoFocus
                label="What does your market misunderstand?"
                placeholder="The most common wrong belief in your space"
                value={data.misunderstood}
                onChange={(v) => update("misunderstood", v)}
                multiline
              />
              <Field
                label="What truth do you believe others ignore?"
                placeholder="The non-consensus take only you say out loud"
                value={data.truth}
                onChange={(v) => update("truth", v)}
                multiline
              />
              <Field
                label="What should your audience learn from you?"
                placeholder="The one shift you want to install in their thinking"
                value={data.lesson}
                onChange={(v) => update("lesson", v)}
                multiline
              />
            </>
          )}

          {step.key === "style" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {styleOptions.map((s) => (
                <StyleCard
                  key={s.id}
                  icon={s.icon}
                  title={s.id}
                  description={s.description}
                  selected={data.style === s.id}
                  onSelect={() => update("style", s.id)}
                />
              ))}
            </div>
          )}

          {step.key === "objectives" && (
            <>
              <ChoiceField
                label="What commercial outcome matters most over the next 90 days?"
                options={outcomeOptions}
                value={data.outcome90}
                onChange={(v) => update("outcome90", v as string)}
              />
              <ChoiceField
                label="How many qualified meetings do you want per month?"
                options={meetingsOptions}
                value={data.meetings}
                onChange={(v) => update("meetings", v as string)}
                columns={3}
              />
              <Field
                label="What would success look like?"
                placeholder="If 90 days from now you're winning, describe it"
                value={data.success}
                onChange={(v) => update("success", v)}
                multiline
              />
            </>
          )}
        </div>

        {ackVisible && (
          <div className="pt-2">
            <AiBubble>
              <span className="inline-flex items-center gap-2">
                <TypingDots />
                <span>{step.ack}</span>
              </span>
            </AiBubble>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-glass-border pt-5">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
          >
            Back
          </button>

          <div className="flex items-center gap-3">
            {!canAdvance && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Complete every field to continue
              </span>
            )}
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!canAdvance}
              className={cn(
                "group relative overflow-hidden rounded-xl px-5 font-medium",
                "bg-gradient-primary text-primary-foreground hover:opacity-95",
                "shadow-glow disabled:shadow-none disabled:opacity-40",
              )}
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {stepIndex === steps.length - 1 ? "Generate my Revenue DNA" : "Continue"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Your answers train your private Revenue Coach. Nothing is shared.
      </p>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
        <Sparkles className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-tight">SideKick</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          AI Revenue Coach
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Summary — Revenue DNA Activated dashboard
// ============================================================================

function synthesize(d: State): string {
  const company = d.company || "Your company";
  const positioning = trim(d.doesWhat || d.problem, 90);
  const edge = trim(d.whyChoose || "operational credibility", 80);
  const friction =
    trim(d.stuck, 70) || trim(d.whyHesitate, 70) || "late-stage stakeholder risk";
  const thesis =
    trim(d.truth, 90) || trim(d.misunderstood, 90) || "an uncomfortable market truth";
  const voice = d.style || "Analytical Operator";
  const target = d.meetings ? `${d.meetings} qualified meetings/mo` : "a measurable pipeline goal";
  const outcome = trim(d.outcome90, 70) || "compounding pipeline";

  return `${company}'s strongest opportunity lies in translating ${edge} into thought leadership that directly addresses ${friction}. Your market thesis — that ${thesis.toLowerCase().replace(/\.$/, "")} — is the wedge most competitors won't touch, and it should anchor every weekly POV. Operating in the voice of a ${voice}, the highest-leverage move over the next 90 days is to convert ${positioning.toLowerCase().replace(/\.$/, "")} into a publishable proof system, then channel that authority into ${target} so it compounds into ${outcome.toLowerCase().replace(/\.$/, "")}.`;
}

function SummaryScreen({
  data,
  activating,
  activated,
  onActivate,
}: {
  data: State;
  activating: boolean;
  activated: boolean;
  onActivate: () => void;
}) {
  const summary = useMemo(() => synthesize(data), [data]);

  const cards: { icon: typeof Compass; label: string; value: string }[] = [
    {
      icon: Building2,
      label: "Company Positioning",
      value: `${data.company || "—"} — ${data.doesWhat || "—"}`,
    },
    {
      icon: LineChart,
      label: "Commercial Reality",
      value: [
        data.pricing && `${data.pricing}`,
        data.customers && `${data.customers} customers`,
        data.salesCycle && `cycle: ${trim(data.salesCycle, 60)}`,
      ]
        .filter(Boolean)
        .join(" · ") || "—",
    },
    {
      icon: AlertTriangle,
      label: "Growth Friction Points",
      value:
        [
          data.notWorked && `Dead channels: ${trim(data.notWorked, 60)}`,
          data.stuck && `Deals stall at: ${trim(data.stuck, 60)}`,
        ]
          .filter(Boolean)
          .join(" · ") || "—",
    },
    {
      icon: Swords,
      label: "Competitive Edge",
      value: data.whyChoose || "—",
    },
    {
      icon: Brain,
      label: "Core Market Thesis",
      value: data.truth || data.misunderstood || "—",
    },
    {
      icon: Mic,
      label: "Founder Communication Style",
      value: data.style || "—",
    },
    {
      icon: Flag,
      label: "90-Day Revenue Objective",
      value:
        [data.outcome90, data.meetings && `${data.meetings}/mo`]
          .filter(Boolean)
          .join(" · ") || "—",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <div className="mb-8 flex items-center justify-between animate-fade-up">
        <Brand />
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Onboarding complete
        </span>
      </div>

      <div className="animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
          <Sparkles className="h-3 w-3" />
          Revenue DNA Activated
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
          Your strategic profile is live.
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A synthesized executive view of how {data.company || "your company"} wins —
          ready to drive every Monday execution sprint.
        </p>
      </div>

      <div className="relative mt-8 animate-fade-up">
        <div className="absolute -inset-px rounded-3xl bg-gradient-primary opacity-25 blur-2xl" />
        <div className="glass-strong relative rounded-3xl p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((c) => (
              <SummaryCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/[0.06] p-5 md:p-6">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <Brain className="h-3.5 w-3.5" />
              AI Strategic Summary
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/95">
              {summary}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center animate-fade-up">
        {!activated ? (
          <>
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
              <span className="text-gradient">
                Your AI Revenue Coach is now trained and ready
              </span>
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              We'll build your first strategic growth sprint and prepare your Monday
              execution plan the moment you activate.
            </p>

            <div className="mt-7 flex justify-center">
              <Button
                size="lg"
                onClick={onActivate}
                disabled={activating}
                className={cn(
                  "group relative h-12 overflow-hidden rounded-xl px-7 text-base font-medium",
                  "bg-gradient-primary text-primary-foreground hover:opacity-95",
                  "shadow-glow",
                )}
              >
                <span className="relative z-10 inline-flex items-center gap-2.5">
                  {activating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Calibrating your Revenue Coach…
                    </>
                  ) : (
                    <>
                      Activate SideKick
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
                <span
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full"
                  style={{ transition: "transform 1.2s ease" }}
                />
              </Button>
            </div>
          </>
        ) : (
          <div className="animate-fade-up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl text-gradient">
              SideKick activated.
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Your first Monday strategic execution sprint is being prepared. You'll
              be notified the moment it's ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Compass;
  label: string;
  value: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-glass-border bg-secondary/40 p-4 transition-colors hover:border-primary/30">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </span>
        {label}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/95">{value}</p>
    </div>
  );
}

function trim(s: string, n: number) {
  const t = (s || "").trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}

// Suppress unused warnings for icons that may be tree-shaken later
void Rocket;
void Target;
