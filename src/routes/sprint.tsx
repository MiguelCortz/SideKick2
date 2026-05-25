import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppSidebar } from "@/components/sprint/AppSidebar";
import { TopHeader } from "@/components/sprint/TopHeader";


import { VideoStudio } from "@/components/sprint/VideoStudio";
import { MeetingPrepBriefings } from "@/components/sprint/MeetingPrepBriefings";
import { WeeklyCalendar } from "@/components/sprint/WeeklyCalendar";
import { WeeklyLearnings } from "@/components/sprint/WeeklyLearnings";
import { FounderTasksBar } from "@/components/sprint/FounderTasksBar";
import { FounderDnaDialog } from "@/components/sprint/FounderDnaDialog";
import { SectionContext, sections, type SectionId } from "@/components/sprint/section-context";
import { semanasCalendario } from "@/components/sprint/mock-data";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sprint")({
  component: SprintDashboard,
  head: () => ({
    meta: [
      { title: "Sprint de Ejecución Semanal · Revenue Intelligence" },
      {
        name: "description",
        content:
          "Calendario, founder tasks, deliverables y meeting prep — una sola operación semanal integrada.",
      },
    ],
  }),
});

function SprintDashboard() {
  const [active, setActive] = useState<SectionId>("calendar");
  const [approvals, setApprovals] = useState<Record<string, boolean>>({});
  const [dnaOpen, setDnaOpen] = useState(false);
  const setApproval = (key: string, value: boolean) =>
    setApprovals((prev) => ({ ...prev, [key]: value }));
  const totalPublicaciones = semanasCalendario.reduce((acc, s) => acc + s.dias.length, 0);
  const currentIdx = sections.findIndex((s) => s.id === active);
  const next = sections[(currentIdx + 1) % sections.length];

  return (
    <SectionContext.Provider value={{ active, setActive, approvals, setApproval, totalPublicaciones }}>

      <div className="relative min-h-screen bg-background text-foreground">
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
          <div className="absolute left-1/3 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute right-0 top-1/2 h-[360px] w-[360px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <AppSidebar />

        <main className="md:pl-16">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
            <TopHeader />
            <FounderTasksBar />

            {/* Section pills · also clickable */}
            <nav className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-card/40 p-1.5 backdrop-blur">
              {sections.map((s) => {
                const isActive = s.id === active;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActive(s.id)}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                      isActive
                        ? "bg-primary/15 text-foreground shadow-[var(--shadow-glow)]"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border text-[10px] font-semibold",
                        isActive
                          ? "border-primary/40 bg-primary/20 text-primary"
                          : "border-border/60 bg-background/40"
                      )}
                    >
                      {s.number}
                    </span>
                    {s.label}
                  </button>
                );
              })}
            </nav>

            {/* SECCIÓN 1 — Aprendizajes + Calendario unificado */}
            {active === "calendar" && (
              <div className="flex flex-col gap-8 animate-fade-in-up">
                <WeeklyLearnings onGenerate={() => setDnaOpen(true)} />
                <WeeklyCalendar />
              </div>
            )}

            {/* SECCIÓN 2 — Studios funcionales */}
            {active === "content" && (
              <div className="flex flex-col gap-8 animate-fade-in-up">
                <VideoStudio />
              </div>
            )}

            {/* SECCIÓN 3 — Meeting Prep */}
            {active === "meetings" && (
              <div className="flex flex-col gap-8 animate-fade-in-up">
                <MeetingPrepBriefings />
              </div>
            )}

            {/* Global next-section nav */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur">
              <div className="text-[11px] text-muted-foreground">
                <span className="text-foreground/80">Sección {sections[currentIdx].number} de 3:</span> {sections[currentIdx].label}
              </div>
              <Button
                onClick={() => setActive(next.id)}
                size="sm"
                className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continuar a Sección {next.number} · {next.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <footer className="border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
              Revenue Intelligence · Sprint generado para la Semana 47 · Construido para founders que ejecutan.
            </footer>
          </div>
        </main>
      </div>

      <FounderDnaDialog open={dnaOpen} onOpenChange={setDnaOpen} />
    </SectionContext.Provider>
  );
}