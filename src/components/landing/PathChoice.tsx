import { ArrowRight, Upload, Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type LearningPath = "import" | "guided";

const OPTIONS: {
  id: LearningPath;
  icon: typeof Upload;
  title: string;
  subtext: string;
  cta: string;
  tone: string;
}[] = [
  {
    id: "import",
    icon: Upload,
    title: "Import Existing Commercial Context",
    subtext:
      "Upload documents, dashboards, transcripts, reports, CRM exports, or your website and I'll learn from what already exists.",
    cta: "Import Context",
    tone: "from-violet-400/20 to-fuchsia-500/10",
  },
  {
    id: "guided",
    icon: Compass,
    title: "Guided Strategic Setup",
    subtext: "I'll guide you step-by-step through a fast strategic diagnosis.",
    cta: "Start Guided Setup",
    tone: "from-sky-400/20 to-cyan-500/10",
  },
];

export function PathChoice({
  founderName,
  onChoose,
}: {
  founderName?: string;
  onChoose: (p: LearningPath) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <header className="text-center space-y-4 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs text-foreground/70">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {founderName ? `Hello, ${founderName.split(" ")[0]}` : "Choose your path"}
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
          How would you like to train MondayOS?
        </h1>
        <p className="mx-auto max-w-xl text-base text-foreground/70 leading-relaxed">
          Pick the path that matches what you have today. You can always add more context later.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 animate-fade-up">
        {OPTIONS.map((o) => {
          const Icon = o.icon;
          return (
            <button
              key={o.id}
              onClick={() => onChoose(o.id)}
              className="group relative overflow-hidden rounded-3xl glass-strong p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-glow border border-glass-border hover:border-primary/40"
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-50 bg-gradient-to-br transition-opacity group-hover:opacity-80",
                  o.tone,
                )}
                aria-hidden
              />
              <div className="relative flex flex-col h-full gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {o.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/70">{o.subtext}</p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-primary pt-2">
                  {o.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
