import { createFileRoute, Link } from "@tanstack/react-router";
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
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />

      <div className="relative px-5 py-14 md:py-20">
        <Onboarding />

        {/* Botones */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/score"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black shadow-lg transition hover:scale-105"
          >
            weekly report
          </Link>

          <Link
            to="/p"
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
          >
            share your company's operations with SideKick
          </Link>

          <Link
            to="/sprint"
            className="rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
            style={{ backgroundColor: "oklch(0.74 0.18 290)" }}
          >
            Sprint
          </Link>
        </div>
      </div>
    </main>
  );
}