import { useState } from "react";
import { Sparkles, Calendar, FileText, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSection, type SectionId } from "./section-context";
import { FounderDnaDialog } from "./FounderDnaDialog";

const items: { id: SectionId; icon: typeof Calendar; label: string; number: string }[] = [
  { id: "calendar", icon: Calendar, label: "Weekly Calendar", number: "1" },
  { id: "content", icon: FileText, label: "Content Deliverables", number: "2" },
  { id: "meetings", icon: Users, label: "Meeting Prep", number: "3" },
];

export function AppSidebar() {
  const { active, setActive } = useSection();
  const [dnaOpen, setDnaOpen] = useState(false);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col items-center border-r border-border/60 bg-sidebar/80 py-5 backdrop-blur-xl md:flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-[var(--shadow-glow)]">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <nav className="mt-8 flex flex-col items-center gap-1">
          {items.map((item) => {
            const isActive = active === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                title={`${item.number}. ${item.label}`}
                className={cn(
                  "group relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground",
                  isActive && "bg-white/10 text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 h-5 w-0.5 -translate-x-3 rounded-r bg-primary" />
                )}
                <Icon className="h-[18px] w-[18px]" />
                <span className="absolute left-12 z-50 hidden whitespace-nowrap rounded-md border border-border/60 bg-popover px-2 py-1 text-[11px] text-foreground shadow-lg group-hover:block">
                  <span className="text-muted-foreground">Sec. {item.number} · </span>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setDnaOpen(true)}
          title="Mi ADN · Screening inicial"
          className="group relative mt-auto flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
        >
          <User className="h-[18px] w-[18px]" />
          <span className="absolute left-12 z-50 hidden whitespace-nowrap rounded-md border border-border/60 bg-popover px-2 py-1 text-[11px] text-foreground shadow-lg group-hover:block">
            <span className="text-muted-foreground">Tu ADN · </span>
            base del contenido
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDnaOpen(true)}
          className="mt-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent text-xs font-medium transition hover:opacity-90"
          title="Abrir Mi ADN"
        >
          F
        </button>
      </aside>

      <FounderDnaDialog open={dnaOpen} onOpenChange={setDnaOpen} />
    </>
  );
}
