import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  autoFocus?: boolean;
}

export function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  multiline,
  autoFocus,
}: FieldProps) {
  return (
    <label className="group block animate-fade-up">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground/90">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {multiline ? (
        <textarea
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cn(
            "w-full resize-none rounded-xl bg-input/60 px-4 py-3 text-sm text-foreground",
            "border border-glass-border placeholder:text-muted-foreground/60",
            "outline-none transition-all duration-200",
            "focus:border-primary/50 focus:bg-input focus:ring-4 focus:ring-ring/20",
            "hover:border-glass-border/80",
          )}
        />
      ) : (
        <input
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl bg-input/60 px-4 py-3 text-sm text-foreground",
            "border border-glass-border placeholder:text-muted-foreground/60",
            "outline-none transition-all duration-200",
            "focus:border-primary/50 focus:bg-input focus:ring-4 focus:ring-ring/20",
            "hover:border-glass-border/80",
          )}
        />
      )}
    </label>
  );
}
