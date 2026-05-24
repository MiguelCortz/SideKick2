import { cn } from "@/lib/utils";
import { Check, type LucideIcon } from "lucide-react";

interface StyleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export function StyleCard({
  icon: Icon,
  title,
  description,
  selected,
  onSelect,
}: StyleCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300",
        "glass hover:-translate-y-0.5",
        selected
          ? "border-primary/60 shadow-glow"
          : "border-glass-border hover:border-primary/30",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none",
          "bg-gradient-to-br from-primary/15 via-transparent to-accent/10",
          selected ? "opacity-100" : "group-hover:opacity-60",
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
            selected
              ? "bg-gradient-primary text-primary-foreground"
              : "bg-secondary text-foreground/80 group-hover:text-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border transition-all",
            selected
              ? "border-primary bg-primary text-primary-foreground scale-100"
              : "border-glass-border scale-90 opacity-60",
          )}
        >
          {selected && <Check className="h-3.5 w-3.5" />}
        </div>
      </div>
      <h4 className="relative mt-4 font-semibold tracking-tight text-foreground">{title}</h4>
      <p className="relative mt-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </button>
  );
}
