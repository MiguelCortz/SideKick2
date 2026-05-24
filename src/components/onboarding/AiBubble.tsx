import { Sparkles } from "lucide-react";

export function AiBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 animate-fade-up">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
        <Sparkles className="h-4 w-4 text-primary-foreground" />
        <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 max-w-xl">
        <p className="text-sm leading-relaxed text-foreground/90">{children}</p>
      </div>
    </div>
  );
}

export function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1">
      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft [animation-delay:300ms]" />
    </div>
  );
}
