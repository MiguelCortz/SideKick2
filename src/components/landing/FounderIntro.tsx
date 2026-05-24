import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiBubble } from "@/components/onboarding/AiBubble";

export interface FounderIdentity {
  name: string;
  company: string;
}

export function FounderIntro({ onComplete }: { onComplete: (v: FounderIdentity) => void }) {
  const [stage, setStage] = useState<"name" | "company" | "ready">("name");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const canContinue =
    (stage === "name" && name.trim().length > 0) ||
    (stage === "company" && company.trim().length > 0) ||
    stage === "ready";

  function next() {
    if (!canContinue) return;
    if (stage === "name") setStage("company");
    else if (stage === "company") setStage("ready");
    else onComplete({ name: name.trim(), company: company.trim() });
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-10">
      <header className="text-center space-y-5 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs text-foreground/70">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Founder Intelligence
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gradient">
          Meet Your Revenue Coach
        </h1>
        <p className="mx-auto max-w-xl text-base md:text-lg leading-relaxed text-foreground/70">
          Let&apos;s understand how your business grows so we can build your strategic revenue
          system.
        </p>
      </header>

      <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-6 animate-fade-up">
        <AiBubble>What should I call you?</AiBubble>
        <Input
          autoFocus
          placeholder="Your first name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && stage === "name") next();
          }}
          className="h-12 text-base bg-input/60 border-glass-border focus-visible:ring-ring/30"
        />

        {(stage === "company" || stage === "ready") && (
          <div className="space-y-3 animate-fade-up">
            <AiBubble>
              Nice to meet you{name ? `, ${name.split(" ")[0]}` : ""}. What&apos;s your company
              called?
            </AiBubble>
            <Input
              autoFocus={stage === "company"}
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && stage === "company") next();
              }}
              className="h-12 text-base bg-input/60 border-glass-border focus-visible:ring-ring/30"
            />
          </div>
        )}

        {stage === "ready" && (
          <div className="animate-fade-up">
            <AiBubble>Great. Let&apos;s decide how we should learn your business.</AiBubble>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            onClick={next}
            disabled={!canContinue}
            size="lg"
            className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-6 h-12 text-base font-medium group"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
