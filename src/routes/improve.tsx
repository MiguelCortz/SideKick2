import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowDown,
  ArrowUp,
  Minus,
  Linkedin,
  Lock,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import todayData from "@/data/score-today.json";
import lastWeekData from "@/data/score-last-week.json";
import { PUBLICATION_FORMATS, type PublicationFormat } from "./score";

export const Route = createFileRoute("/improve")({
  head: () => ({
    meta: [
      { title: "Improve my score — SideKick" },
      {
        name: "description",
        content: "Prioritized recommendations and 30/60/90 day plan to raise your Revenue DNA Score.",
      },
      { property: "og:title", content: "Improve my score — SideKick" },
      {
        property: "og:description",
        content: "Actionable plan to raise your Revenue DNA Score this week.",
      },
    ],
  }),
  component: ImprovePage,
});

type Playbook = {
  key: string;
  label: string;
  icon: typeof Target;
  actions: string[];
};

const PUBLICATION_FORMAT_ACTIONS: Record<PublicationFormat, string> = {
  text: "Ship 2 short-form text posts/week with a sharp founder POV.",
  carousel: "Turn the top-performing text post into a 6-slide carousel.",
  video: "Record one 45-sec talking-head video tied to this week's POV.",
  image: "Publish one branded chart/quote image — strong visual hierarchy.",
  poll: "Run one poll to crowdsource an ICP pain point (qualitative gold).",
};

const PLAYBOOKS: Playbook[] = [
  {
    key: "InMail",
    label: "InMail",
    icon: Target,
    actions: [
      "Audit the last 50 sequences and isolate the 3 hooks with the best reply rate.",
      "Launch an A/B subject-line test on 100 ICP contacts this week.",
      "Define a <2h response SLA for all hot replies.",
    ],
  },
  {
    key: "Publication",
    label: "Publication",
    icon: TrendingUp,
    actions: PUBLICATION_FORMATS.map((f) => PUBLICATION_FORMAT_ACTIONS[f]),
  },
  {
    key: "Cold messages",
    label: "Cold messages",
    icon: Users,
    actions: [
      "Rewrite the first line with a per-account contextual trigger.",
      "Segment by size and vertical before sending.",
      "Daily cap of 40 messages to maintain reply rate.",
    ],
  },
];

const todayScores = todayData.scores as unknown as Record<string, unknown>;
const lastWeekScores = lastWeekData.scores as unknown as Record<string, unknown>;

function pubAvg(scores: Record<string, unknown>): number {
  const v = scores["Publication"];
  if (v && typeof v === "object") {
    const vals = Object.values(v as Record<string, number>);
    return vals.length ? Math.round(vals.reduce((s, n) => s + n, 0) / vals.length) : 0;
  }
  return typeof v === "number" ? v : 0;
}
function scoreOf(scores: Record<string, unknown>, key: string): number {
  if (key === "Publication") return pubAvg(scores);
  const v = scores[key];
  return typeof v === "number" ? v : 0;
}
function pubFormats(scores: Record<string, unknown>): Record<PublicationFormat, number> {
  const v = scores["Publication"];
  const out = {} as Record<PublicationFormat, number>;
  for (const f of PUBLICATION_FORMATS) {
    out[f] = v && typeof v === "object" ? ((v as Record<string, number>)[f] ?? 0) : 0;
  }
  return out;
}

const todayPubFormats = pubFormats(todayScores);

function Delta({ diff }: { diff: number }) {
  const Icon = diff > 0 ? ArrowUp : diff < 0 ? ArrowDown : Minus;
  const tone =
    diff > 0
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : diff < 0
        ? "text-rose-400 bg-rose-400/10 border-rose-400/20"
        : "text-muted-foreground bg-white/5 border-glass-border";
  const text = diff === 0 ? "0" : `${diff > 0 ? "+" : ""}${diff}`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums",
        tone,
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={3} />
      {text}
    </span>
  );
}

function ImprovePage() {
  const items = PLAYBOOKS.filter((p) => p.key in todayScores).map((p) => {
    const score = scoreOf(todayScores, p.key);
    const previous = scoreOf(lastWeekScores, p.key);
    return { ...p, score, previous, diff: score - previous };
  });

  // Prioritize: first the ones that dropped (biggest drop first), then the lowest scores
  const prioritized = [...items].sort((a, b) => {
    if (a.diff < 0 && b.diff >= 0) return -1;
    if (b.diff < 0 && a.diff >= 0) return 1;
    if (a.diff < 0 && b.diff < 0) return a.diff - b.diff;
    return a.score - b.score;
  });

  const top3 = prioritized.slice(0, 3);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--gradient-primary)", filter: "blur(120px)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 py-14 md:py-20">
        <Link
          to="/score"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to score
        </Link>

        <div className="mt-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Improvement plan
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gradient md:text-5xl">Improve my score</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Actions prioritized by the areas that dropped vs. last week and the lowest-scoring criteria. Start with this
            week's top three priorities.
          </p>
        </div>

        {/* Top 3 priorities */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {top3.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={p.key} className="glass-strong relative rounded-3xl p-6 animate-fade-up">
                <div className="absolute right-4 top-4 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Priority {i + 1}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary/20 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{p.label}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                      <span>{p.score}/100</span>
                      <Delta diff={p.diff} />
                    </div>
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {p.actions.slice(0, 2).map((a) => (
                    <li key={a} className="flex gap-2 text-sm text-foreground/90">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        {/* Full playbook */}
        <section className="mt-10 glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Full playbook</h2>
            <div className="text-xs text-muted-foreground">Ordered by priority</div>
          </div>

          <ul className="space-y-3">
            {prioritized.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.key} className="rounded-2xl border border-glass-border bg-glass p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary/20 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="truncate text-sm font-medium">{p.label}</div>
                        <div className="flex items-baseline gap-2 tabular-nums">
                          <span className="text-base font-semibold">{p.score}</span>
                          <span className="text-xs text-muted-foreground">/100</span>
                          <Delta diff={p.diff} />
                        </div>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {p.actions.map((a) => (
                          <li key={a} className="flex gap-2 text-xs text-muted-foreground md:text-sm">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/80" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* What happens in LinkedIn */}
        <LinkedInSection />
      </div>
    </main>
  );
}

// ---------------- LinkedIn synthetic insights ----------------

// Synthetic data — would be fed by the LinkedIn Marketing/Posts API.
// Only aggregated, non-personal signals are shown (privacy-first).
const LI_IMPRESSIONS = [
  { day: "Mon", impressions: 1240, engagements: 86 },
  { day: "Tue", impressions: 1580, engagements: 142 },
  { day: "Wed", impressions: 980, engagements: 71 },
  { day: "Thu", impressions: 2110, engagements: 198 },
  { day: "Fri", impressions: 2640, engagements: 644 },
  { day: "Sat", impressions: 1320, engagements: 112 },
  { day: "Sun", impressions: 1760, engagements: 156 },
];

const LI_FORMATS = PUBLICATION_FORMATS.map((f) => ({
  format: f.charAt(0).toUpperCase() + f.slice(1),
  reach: todayPubFormats[f],
}));

const LI_TRENDS = [
  { tag: "#AIagents", momentum: 94, posts: "12.4k" },
  { tag: "#RevOps", momentum: 81, posts: "6.8k" },
  { tag: "#FoundersJourney", momentum: 76, posts: "9.1k" },
  { tag: "#OutboundIsBack", momentum: 68, posts: "3.2k" },
  { tag: "#PLG", momentum: 57, posts: "4.7k" },
  { tag: "#GTMEngineer", momentum: 49, posts: "2.1k" },
];

function LinkedInSection() {
  return (
    <section className="mt-10 glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A66C2]/15 text-[#4DA3F5]">
            <Linkedin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">What happens in LinkedIn?</h2>
            <p className="text-xs text-muted-foreground">
              Aggregated post signals from the LinkedIn API — last 7 days.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-glass px-2.5 py-1 text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3" />
          Privacy-first · anonymized & aggregated
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Impressions over time */}
        <div className="rounded-2xl border border-glass-border bg-glass p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <div className="text-sm font-medium">Post impressions</div>
            <div className="text-[11px] text-muted-foreground">Engagements overlay</div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={LI_IMPRESSIONS} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="liImp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C4B5FD" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="liEng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7DD3FC" stopOpacity={0.65} />
                    <stop offset="100%" stopColor="#7DD3FC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#F1F5F9" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#F1F5F9" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,15,25,0.92)",
                    color: "#F1F5F9",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="impressions" stroke="#C4B5FD" strokeWidth={2} fill="url(#liImp)" />
                <Area type="monotone" dataKey="engagements" stroke="#7DD3FC" strokeWidth={2} fill="url(#liEng)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reach by format */}
        <div className="rounded-2xl border border-glass-border bg-glass p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <div className="text-sm font-medium">Avg. reach by format</div>
            <div className="text-[11px] text-muted-foreground">Relative index</div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LI_FORMATS} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="format" tick={{ fontSize: 11, fill: "#F1F5F9" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#F1F5F9" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(196,181,253,0.1)" }}
                  contentStyle={{
                    background: "rgba(15,15,25,0.92)",
                    color: "#F1F5F9",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="reach" fill="#A5F3FC" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Engagement rate derived from impressions */}
      <div className="mt-4 rounded-2xl border border-glass-border bg-glass p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <div className="text-sm font-medium">Engagement rate</div>
          <div className="text-[11px] text-muted-foreground">
            engagements ÷ impressions · derived from post impressions
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={LI_IMPRESSIONS.map((d) => ({
                day: d.day,
                rate: Number(((d.engagements / d.impressions) * 100).toFixed(2)),
              }))}
              margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.25} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#F1F5F9" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#F1F5F9" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                formatter={(v: number) => [`${v}%`, "Engagement rate"]}
                contentStyle={{
                  background: "rgba(15,15,25,0.92)",
                  color: "#F1F5F9",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#FBCFE8"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#FBCFE8", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trending topics */}
      <div className="mt-4 rounded-2xl border border-glass-border bg-glass p-4">
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-400" />
          <div className="text-sm font-medium">Trending topics in your network</div>
        </div>
        <ul className="grid gap-2 md:grid-cols-2">
          {LI_TRENDS.map((t) => (
            <li
              key={t.tag}
              className="flex items-center gap-3 rounded-xl border border-glass-border bg-background/30 px-3 py-2"
            >
              <span className="text-sm font-medium text-foreground">{t.tag}</span>
              <div className="ml-auto flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground tabular-nums">{t.posts} posts</span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${t.momentum}%` }} />
                </div>
                <span className="w-8 text-right text-[11px] font-medium tabular-nums text-primary">{t.momentum}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Source: LinkedIn API · only public post metadata is processed; no personal author data is stored.
        </p>
      </div>
    </section>
  );
}
