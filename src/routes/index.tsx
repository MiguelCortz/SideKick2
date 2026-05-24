import { createFileRoute } from "@tanstack/react-router";
import { Onboarding } from "@/components/onboarding/Onboarding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SideKick — Scale up your time on what you specialize in while your sidebreak takes on smaller jobs" },
      {
        name: "description",
        content:
          "SideKick is the AI Chief Revenue Coach for early-stage B2B SaaS founders. Build your Revenue DNA in minutes.",
      },
      {
        property: "og:title",
        content: "SideKick — Scale up your time on what you specialize in while your sidebreak takes on smaller jobs",
      },
      {
        property: "og:description",
        content: "Turn founder expertise into repeatable thought leadership and qualified pipeline growth.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--gradient-primary)", filter: "blur(120px)" }}
        aria-hidden
      />

      <div className="relative px-5 py-14 md:py-20">
        <Onboarding />
      </div>
    </main>
  );
}
