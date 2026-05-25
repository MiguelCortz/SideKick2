import { createFileRoute } from "@tanstack/react-router";
import { MondayOSFlow } from "@/components/mondayos/MondayOSFlow";

export const Route = createFileRoute("/p")({
  head: () => ({
    meta: [
      { title: "MondayOS — Activate Your AI Chief Revenue Coach" },
      {
        name: "description",
        content:
          "A cinematic, AI-native onboarding that absorbs your business, validates strategic intelligence, connects revenue systems, and launches your first founder-led growth sprint.",
      },
      { property: "og:title", content: "MondayOS — AI Chief Revenue Coach" },
      {
        property: "og:description",
        content:
          "Initialize your AI Revenue Coach, validate your commercial intelligence, and launch Sprint Zero.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return <MondayOSFlow />;
}
