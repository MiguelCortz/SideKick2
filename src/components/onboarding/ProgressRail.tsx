import { cn } from "@/lib/utils";

interface ProgressRailProps {
  steps: { label: string }[];
  current: number;
}

export function ProgressRail({ steps, current }: ProgressRailProps) {
  return (
    <div className="flex items-center gap-1.5">
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5" title={s.label}>
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium transition-all",
                  state === "active" &&
                    "bg-gradient-primary text-primary-foreground shadow-glow",
                  state === "done" && "bg-primary/20 text-primary",
                  state === "todo" && "bg-secondary text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-3 transition-colors lg:w-5",
                  i < current ? "bg-primary/50" : "bg-glass-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
