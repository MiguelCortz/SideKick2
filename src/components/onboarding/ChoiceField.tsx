import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
  hint?: string;
}

interface ChoiceFieldProps {
  label: string;
  hint?: string;
  options: Option[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
  columns?: 1 | 2 | 3;
}

export function ChoiceField({
  label,
  hint,
  options,
  value,
  onChange,
  multi,
  columns = 2,
}: ChoiceFieldProps) {
  const selected = (v: string) =>
    multi ? Array.isArray(value) && value.includes(v) : value === v;

  function toggle(v: string) {
    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      onChange(v);
    }
  }

  const grid =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className="animate-fade-up">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground/90">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        {multi && !hint && (
          <span className="text-xs text-muted-foreground">Select all that apply</span>
        )}
      </div>
      <div className={cn("grid gap-2", grid)}>
        {options.map((opt) => {
          const isSel = selected(opt.value);
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={cn(
                "group relative flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200",
                "bg-input/40 hover:bg-input/70",
                isSel
                  ? "border-primary/60 bg-primary/10 shadow-glow"
                  : "border-glass-border hover:border-glass-border/80",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-colors",
                  isSel
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-glass-border bg-background/40",
                )}
              >
                {isSel && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span className="flex-1">
                <span
                  className={cn(
                    "block font-medium",
                    isSel ? "text-foreground" : "text-foreground/90",
                  )}
                >
                  {opt.label}
                </span>
                {opt.hint && (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {opt.hint}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
