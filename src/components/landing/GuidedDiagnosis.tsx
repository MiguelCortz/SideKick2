import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AiBubble } from "@/components/onboarding/AiBubble";

type Mode = "single" | "multi";

interface MicroQuestion {
  id: string;
  prompt: string;
  mode: Mode;
  options: string[];
  ack: (selected: string[]) => string;
}

const QUESTIONS: MicroQuestion[] = [
  {
    id: "problem",
    prompt: "What problem does your company solve?",
    mode: "single",
    options: [
      "Operational efficiency",
      "Revenue acceleration",
      "Workflow simplification",
      "Category innovation",
    ],
    ack: (s) => `This sounds like ${s[0].toLowerCase()} — that shapes how buyers value you.`,
  },
  {
    id: "discovery",
    prompt: "How do customers usually discover you?",
    mode: "multi",
    options: [
      "Referrals",
      "Outbound sales",
      "Founder network",
      "Content / inbound",
      "Partnerships",
      "Events",
    ],
    ack: (s) =>
      `Got it — your strongest acquisition gravity is ${s.slice(0, 2).join(" and ").toLowerCase()}.`,
  },
  {
    id: "blockers",
    prompt: "What usually blocks deals?",
    mode: "multi",
    options: [
      "Budget",
      "Urgency",
      "Implementation fear",
      "Switching cost",
      "Unclear ROI",
      "Internal alignment",
    ],
    ack: (s) => `Friction is concentrating around ${s[0].toLowerCase()} — we'll attack that.`,
  },
  {
    id: "positioning",
    prompt: "What best describes your positioning?",
    mode: "single",
    options: [
      "Category challenger",
      "Operational expert",
      "Technical innovator",
      "Strategic thought leader",
    ],
    ack: (s) =>
      `I'm beginning to see that your strongest commercial advantage is ${s[0].toLowerCase()} credibility.`,
  },
];

const CONFIDENCE_STEPS = [22, 48, 71, 91];

export interface GuidedAnswers {
  problem: string[];
  discovery: string[];
  blockers: string[];
  positioning: string[];
}

export function GuidedDiagnosis({ onComplete }: { onComplete: (a: GuidedAnswers) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showAck, setShowAck] = useState(false);
  const [confidence, setConfidence] = useState(8);

  const q = QUESTIONS[index];
  const selected = answers[q?.id ?? ""] ?? [];

  const canAdvance = selected.length > 0;

  // Ramp confidence smoothly when index changes
  useEffect(() => {
    const target = index === 0 ? 8 : CONFIDENCE_STEPS[index - 1];
    let v = confidence;
    const dir = v < target ? 1 : -1;
    const interval = setInterval(() => {
      v += dir;
      setConfidence(v);
      if ((dir === 1 && v >= target) || (dir === -1 && v <= target)) {
        clearInterval(interval);
      }
    }, 22);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function toggle(opt: string) {
    setAnswers((prev) => {
      const cur = prev[q.id] ?? [];
      if (q.mode === "single") return { ...prev, [q.id]: [opt] };
      return {
        ...prev,
        [q.id]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt],
      };
    });
  }

  function next() {
    if (!canAdvance) return;
    setShowAck(true);
    setTimeout(() => {
      setShowAck(false);
      if (index < QUESTIONS.length - 1) {
        setIndex((i) => i + 1);
      } else {
        onComplete({
          problem: answers.problem ?? [],
          discovery: answers.discovery ?? [],
          blockers: answers.blockers ?? [],
          positioning: answers.positioning ?? [],
        });
      }
    }, 1400);
  }

  const liveSummary = useMemo(() => {
    if (answers.positioning?.[0])
      return `I'm beginning to see that your strongest commercial advantage is ${answers.positioning[0].toLowerCase()} credibility.`;
    if (answers.blockers?.length)
      return `Mapping the friction pattern around ${answers.blockers[0].toLowerCase()}.`;
    if (answers.discovery?.length)
      return `Tracking how growth compounds through ${answers.discovery[0].toLowerCase()}.`;
    if (answers.problem?.[0])
      return `Anchoring your thesis around ${answers.problem[0].toLowerCase()}.`;
    return "Listening for the signal in how your business actually wins.";
  }, [answers]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header className="text-center space-y-3 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs text-foreground/70">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Guided Strategic Diagnosis
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient">
          One question at a time.
        </h1>
      </header>

      {/* Confidence meter */}
      <div className="glass-strong rounded-2xl p-5 space-y-2 animate-fade-up">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/70">Strategic Understanding Confidence</span>
          <span className="text-xl font-semibold text-gradient-primary tabular-nums">
            {confidence}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-primary/15">
          <div
            className="h-full bg-gradient-primary transition-all duration-150"
            style={{ width: `${confidence}%` }}
          />
        </div>
        <p className="text-xs text-foreground/55 pt-1">{liveSummary}</p>
      </div>

      <section
        key={q.id}
        className="glass-strong rounded-3xl p-6 md:p-8 space-y-6 animate-fade-up"
      >
        <div className="flex items-center justify-between text-xs text-foreground/55">
          <span>
            Question {index + 1} of {QUESTIONS.length}
          </span>
          <span>{q.mode === "multi" ? "Select all that apply" : "Choose one"}</span>
        </div>

        <AiBubble>{q.prompt}</AiBubble>

        <div className="flex flex-wrap gap-2.5">
          {q.options.map((opt) => {
            const isSelected = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all",
                  isSelected
                    ? "border-primary bg-primary/15 text-foreground shadow-glow"
                    : "border-glass-border bg-glass text-foreground/80 hover:border-primary/40 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border transition-all",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-glass-border opacity-60",
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {showAck && selected.length > 0 && (
          <AiBubble>{q.ack(selected)}</AiBubble>
        )}

        <div className="flex items-center justify-between border-t border-glass-border pt-5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          >
            Back
          </button>
          <Button
            onClick={next}
            disabled={!canAdvance}
            size="lg"
            className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-6 h-12 text-base font-medium group"
          >
            {index === QUESTIONS.length - 1 ? "Synthesize Understanding" : "Continue"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
