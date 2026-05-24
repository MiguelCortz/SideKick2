import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Mic,
  Plus,
  Sparkles,
  Trash2,
  Link2,
  Upload,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AiBubble } from "@/components/onboarding/AiBubble";

// ---------- Types ----------

export interface FounderIntelligenceData {
  name: string;
  linkedin: string;
  website: string;
  founderType: string;
  knownFor: string[];
  identityContext: string;
  identityVoiceNote: boolean;
  sources: Record<SourceKey, SourceEntry[]>;
  sourcesVoiceNote: boolean;
  discovery: string[];
  blockers: string[];
  commercialContext: string;
  commercialVoiceNote: boolean;
  perceivedAs: string;
  shouldBeSeenAs: string;
  learningSignals: string[];
}

type SourceKey = "newsletters" | "websites" | "media" | "leaders" | "competitors";
interface SourceEntry {
  id: string;
  label: string;
  url: string;
}

// ---------- Static config ----------

const FOUNDER_TYPES = [
  "Technical Founder",
  "Commercial Founder",
  "Product Builder",
  "Category Visionary",
  "Operator",
];

const KNOWN_FOR = [
  "Industry authority",
  "Trusted operator",
  "Contrarian thinker",
  "Revenue educator",
  "Market visionary",
];

const DISCOVERY = [
  "Referrals",
  "Founder network",
  "Outbound",
  "Content",
  "Partnerships",
  "Events",
  "Product-led",
];

const BLOCKERS = [
  "Budget",
  "Urgency",
  "Implementation fear",
  "Internal buy-in",
  "Switching cost",
  "Unclear ROI",
];

const POSITIONING = [
  "Emerging challenger",
  "Technical specialist",
  "Reliable operator",
  "Category educator",
  "Unknown / undefined",
];

const LEARNING_SIGNALS = [
  "Upload documents",
  "Paste articles",
  "Voice note reflections",
  "CRM screenshots",
  "Meeting transcripts",
  "Weekly strategic check-ins",
];

const SOURCE_GROUPS: { key: SourceKey; title: string; placeholder: string }[] = [
  { key: "newsletters", title: "Newsletters I follow", placeholder: "e.g. Lenny's Newsletter" },
  { key: "websites", title: "Websites I read", placeholder: "e.g. firstround.com" },
  { key: "media", title: "Industry media I trust", placeholder: "e.g. The Information" },
  { key: "leaders", title: "Thought leaders I learn from", placeholder: "e.g. April Dunford" },
  { key: "competitors", title: "Competitors I watch", placeholder: "e.g. Acme Co" },
];

const SECTIONS = [
  { id: "identity", label: "Founder Identity" },
  { id: "sources", label: "Knowledge Sources" },
  { id: "motion", label: "Commercial Motion" },
  { id: "positioning", label: "Market Positioning" },
  { id: "learning", label: "Learning Preference" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

// ---------- Helpers ----------

const emptySources: Record<SourceKey, SourceEntry[]> = {
  newsletters: [],
  websites: [],
  media: [],
  leaders: [],
  competitors: [],
};

const initial: FounderIntelligenceData = {
  name: "",
  linkedin: "",
  website: "",
  founderType: "",
  knownFor: [],
  identityContext: "",
  identityVoiceNote: false,
  sources: emptySources,
  sourcesVoiceNote: false,
  discovery: [],
  blockers: [],
  commercialContext: "",
  commercialVoiceNote: false,
  perceivedAs: "",
  shouldBeSeenAs: "",
  learningSignals: [],
};

// ---------- Atomic UI ----------

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all",
        selected
          ? "border-primary bg-primary/15 text-foreground shadow-glow"
          : "border-glass-border bg-glass text-foreground/80 hover:border-primary/40 hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full border transition-all",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-glass-border opacity-60",
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
      {label}
    </button>
  );
}

function SelectCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all",
        "glass hover:-translate-y-0.5",
        selected
          ? "border-primary/60 shadow-glow bg-primary/10"
          : "border-glass-border hover:border-primary/30",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border transition-all",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-glass-border opacity-60",
          )}
        >
          {selected && <Check className="h-3 w-3" />}
        </span>
      </div>
    </button>
  );
}

function VoiceNoteToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs transition-all border",
        active
          ? "border-primary bg-primary/15 text-foreground"
          : "border-glass-border bg-glass text-foreground/70 hover:text-foreground",
      )}
    >
      <Mic className="h-3.5 w-3.5" />
      {active ? "Voice note attached" : "Add voice note (optional)"}
    </button>
  );
}

function OptionalField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(value.length > 0);
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-xs text-foreground/60 hover:text-foreground transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        {label}
      </button>
    );
  }
  return (
    <div className="space-y-1.5 animate-fade-up">
      <label className="text-xs text-foreground/60">{label}</label>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl bg-input/60 px-4 py-3 text-sm text-foreground border border-glass-border outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
      />
    </div>
  );
}

// ---------- Main component ----------

export function FounderIntelligence({
  initialName,
  initialCompany,
  onComplete,
}: {
  initialName?: string;
  initialCompany?: string;
  onComplete: (data: FounderIntelligenceData) => void;
}) {
  const [data, setData] = useState<FounderIntelligenceData>({
    ...initial,
    name: initialName ?? "",
    website: initialCompany ? "" : "",
  });
  const [sectionIndex, setSectionIndex] = useState(0);
  const section = SECTIONS[sectionIndex];

  function update<K extends keyof FounderIntelligenceData>(
    key: K,
    value: FounderIntelligenceData[K],
  ) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function toggleMulti<K extends "knownFor" | "discovery" | "blockers" | "learningSignals">(
    key: K,
    value: string,
  ) {
    setData((d) => {
      const cur = d[key];
      return {
        ...d,
        [key]: cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value],
      };
    });
  }

  function addSource(key: SourceKey, label: string, url: string) {
    if (!label.trim() && !url.trim()) return;
    setData((d) => ({
      ...d,
      sources: {
        ...d.sources,
        [key]: [
          ...d.sources[key],
          { id: Math.random().toString(36).slice(2, 9), label: label.trim(), url: url.trim() },
        ],
      },
    }));
  }
  function removeSource(key: SourceKey, id: string) {
    setData((d) => ({
      ...d,
      sources: { ...d.sources, [key]: d.sources[key].filter((s) => s.id !== id) },
    }));
  }

  const canAdvance = useMemo(() => {
    switch (section.id) {
      case "identity":
        return data.name.trim().length > 0 && !!data.founderType && data.knownFor.length > 0;
      case "sources":
        // Optional — always allow
        return true;
      case "motion":
        return data.discovery.length > 0 && data.blockers.length > 0;
      case "positioning":
        return !!data.perceivedAs && !!data.shouldBeSeenAs;
      case "learning":
        return data.learningSignals.length > 0;
    }
  }, [section.id, data]);

  function goNext() {
    if (!canAdvance) return;
    if (sectionIndex < SECTIONS.length - 1) {
      setSectionIndex((i) => i + 1);
    } else {
      onComplete(data);
    }
  }

  const progress = ((sectionIndex + 1) / SECTIONS.length) * 100;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header className="text-center space-y-3 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs text-foreground/70">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Founder Intelligence Flow
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient">
          A smart strategic diagnosis — not homework.
        </h1>
      </header>

      {/* Section rail */}
      <div className="glass-strong rounded-2xl p-4 space-y-3 animate-fade-up">
        <div className="flex items-center justify-between text-xs text-foreground/60">
          <span>
            Section {sectionIndex + 1} of {SECTIONS.length} · {section.label}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
          <div
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="hidden md:flex items-center gap-1.5 pt-1">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i < sectionIndex && setSectionIndex(i)}
              disabled={i > sectionIndex}
              className={cn(
                "flex-1 text-[10px] uppercase tracking-wider py-1.5 rounded-md transition-colors",
                i === sectionIndex
                  ? "text-foreground bg-primary/15"
                  : i < sectionIndex
                    ? "text-foreground/60 hover:text-foreground"
                    : "text-foreground/30",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <section
        key={section.id}
        className="glass-strong rounded-3xl p-6 md:p-8 space-y-7 animate-fade-up"
      >
        {section.id === "identity" && (
          <IdentitySection
            data={data}
            update={update}
            toggleMulti={toggleMulti}
          />
        )}
        {section.id === "sources" && (
          <SourcesSection
            data={data}
            update={update}
            addSource={addSource}
            removeSource={removeSource}
          />
        )}
        {section.id === "motion" && (
          <MotionSection data={data} update={update} toggleMulti={toggleMulti} />
        )}
        {section.id === "positioning" && (
          <PositioningSection data={data} update={update} />
        )}
        {section.id === "learning" && (
          <LearningSection data={data} toggleMulti={toggleMulti} />
        )}

        <div className="flex items-center justify-between border-t border-glass-border pt-5">
          <button
            type="button"
            disabled={sectionIndex === 0}
            onClick={() => setSectionIndex((i) => Math.max(0, i - 1))}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          >
            Back
          </button>
          <Button
            onClick={goNext}
            disabled={!canAdvance}
            size="lg"
            className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-6 h-12 text-base font-medium group"
          >
            {sectionIndex === SECTIONS.length - 1
              ? "Synthesize Understanding"
              : "Continue"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </section>
    </div>
  );
}

// ---------- Sections ----------

function IdentitySection({
  data,
  update,
  toggleMulti,
}: {
  data: FounderIntelligenceData;
  update: <K extends keyof FounderIntelligenceData>(
    k: K,
    v: FounderIntelligenceData[K],
  ) => void;
  toggleMulti: (
    key: "knownFor" | "discovery" | "blockers" | "learningSignals",
    value: string,
  ) => void;
}) {
  return (
    <div className="space-y-7">
      <AiBubble>Let&apos;s start with you. A few quick selections, no essays.</AiBubble>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/90">
          What should I call you?
        </label>
        <Input
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Your first name"
          className="h-11 bg-input/60 border-glass-border"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs text-foreground/60 inline-flex items-center gap-1.5">
            <Link2 className="h-3 w-3" /> LinkedIn profile (optional)
          </label>
          <Input
            value={data.linkedin}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/…"
            className="h-10 bg-input/60 border-glass-border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-foreground/60 inline-flex items-center gap-1.5">
            <Link2 className="h-3 w-3" /> Company website (optional)
          </label>
          <Input
            value={data.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://yourcompany.com"
            className="h-10 bg-input/60 border-glass-border"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground/90">
          Which best describes you?
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {FOUNDER_TYPES.map((t) => (
            <SelectCard
              key={t}
              label={t}
              selected={data.founderType === t}
              onClick={() => update("founderType", data.founderType === t ? "" : t)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground/90">
          What are you trying to become known for?
        </p>
        <div className="flex flex-wrap gap-2">
          {KNOWN_FOR.map((k) => (
            <Chip
              key={k}
              label={k}
              selected={data.knownFor.includes(k)}
              onClick={() => toggleMulti("knownFor", k)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <OptionalField
          label="Add more context (optional)"
          value={data.identityContext}
          onChange={(v) => update("identityContext", v)}
          placeholder="Anything else that sharpens who you are as a founder"
        />
        <VoiceNoteToggle
          active={data.identityVoiceNote}
          onToggle={() => update("identityVoiceNote", !data.identityVoiceNote)}
        />
      </div>
    </div>
  );
}

function SourcesSection({
  data,
  update,
  addSource,
  removeSource,
}: {
  data: FounderIntelligenceData;
  update: <K extends keyof FounderIntelligenceData>(
    k: K,
    v: FounderIntelligenceData[K],
  ) => void;
  addSource: (key: SourceKey, label: string, url: string) => void;
  removeSource: (key: SourceKey, id: string) => void;
}) {
  const totalEntries = Object.values(data.sources).reduce((n, arr) => n + arr.length, 0);
  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          What shapes your thinking?
        </h2>
        <p className="text-sm text-foreground/60 mt-1">
          Add as few or as many as you like — every source sharpens your model.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SOURCE_GROUPS.map((g) => (
          <SourceGroupCard
            key={g.key}
            title={g.title}
            placeholder={g.placeholder}
            entries={data.sources[g.key]}
            onAdd={(label, url) => addSource(g.key, label, url)}
            onRemove={(id) => removeSource(g.key, id)}
          />
        ))}
      </div>

      <VoiceNoteToggle
        active={data.sourcesVoiceNote}
        onToggle={() => update("sourcesVoiceNote", !data.sourcesVoiceNote)}
      />

      {totalEntries > 0 && (
        <AiBubble>
          I&apos;m mapping your intellectual inputs and strategic influence patterns.
        </AiBubble>
      )}
    </div>
  );
}

function SourceGroupCard({
  title,
  placeholder,
  entries,
  onAdd,
  onRemove,
}: {
  title: string;
  placeholder: string;
  entries: SourceEntry[];
  onAdd: (label: string, url: string) => void;
  onRemove: (id: string) => void;
}) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  function submit() {
    if (!label.trim() && !url.trim()) return;
    onAdd(label, url);
    setLabel("");
    setUrl("");
  }
  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <p className="text-sm font-medium text-foreground">{title}</p>

      {entries.length > 0 && (
        <div className="space-y-1.5">
          {entries.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-2 rounded-lg bg-background/30 px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                {e.label && (
                  <p className="text-sm text-foreground truncate">{e.label}</p>
                )}
                {e.url && (
                  <p className="text-[11px] text-foreground/55 truncate">{e.url}</p>
                )}
              </div>
              <button
                onClick={() => onRemove(e.id)}
                className="text-foreground/40 hover:text-foreground/80"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={placeholder}
          className="h-9 bg-input/60 border-glass-border text-sm"
        />
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL (optional)"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            className="h-9 bg-input/60 border-glass-border text-sm flex-1"
          />
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-1 rounded-lg bg-primary/20 px-3 text-xs font-medium text-foreground hover:bg-primary/30 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

function MotionSection({
  data,
  update,
  toggleMulti,
}: {
  data: FounderIntelligenceData;
  update: <K extends keyof FounderIntelligenceData>(
    k: K,
    v: FounderIntelligenceData[K],
  ) => void;
  toggleMulti: (
    key: "knownFor" | "discovery" | "blockers" | "learningSignals",
    value: string,
  ) => void;
}) {
  return (
    <div className="space-y-7">
      <AiBubble>Now show me how revenue actually flows today.</AiBubble>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground/90">
          How do customers currently find you?
        </p>
        <div className="flex flex-wrap gap-2">
          {DISCOVERY.map((d) => (
            <Chip
              key={d}
              label={d}
              selected={data.discovery.includes(d)}
              onClick={() => toggleMulti("discovery", d)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground/90">What usually blocks deals?</p>
        <div className="flex flex-wrap gap-2">
          {BLOCKERS.map((b) => (
            <Chip
              key={b}
              label={b}
              selected={data.blockers.includes(b)}
              onClick={() => toggleMulti("blockers", b)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <OptionalField
          label="Add specific context (optional)"
          value={data.commercialContext}
          onChange={(v) => update("commercialContext", v)}
          placeholder="A specific pattern, deal, or motion worth flagging"
        />
        <VoiceNoteToggle
          active={data.commercialVoiceNote}
          onToggle={() => update("commercialVoiceNote", !data.commercialVoiceNote)}
        />
      </div>
    </div>
  );
}

function PositioningSection({
  data,
  update,
}: {
  data: FounderIntelligenceData;
  update: <K extends keyof FounderIntelligenceData>(
    k: K,
    v: FounderIntelligenceData[K],
  ) => void;
}) {
  const gap =
    data.perceivedAs && data.shouldBeSeenAs && data.perceivedAs !== data.shouldBeSeenAs;
  return (
    <div className="space-y-7">
      <AiBubble>
        Positioning is the gap between how the market sees you today and how it should.
      </AiBubble>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground/90">
          How does your market currently see you?
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {POSITIONING.map((p) => (
            <SelectCard
              key={p}
              label={p}
              selected={data.perceivedAs === p}
              onClick={() => update("perceivedAs", data.perceivedAs === p ? "" : p)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground/90">How SHOULD they see you?</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {POSITIONING.map((p) => (
            <SelectCard
              key={p}
              label={p}
              selected={data.shouldBeSeenAs === p}
              onClick={() => update("shouldBeSeenAs", data.shouldBeSeenAs === p ? "" : p)}
            />
          ))}
        </div>
      </div>

      {gap && (
        <div className="glass rounded-2xl p-4 animate-fade-up">
          <p className="text-[11px] uppercase tracking-wider text-foreground/60">
            Positioning gap detected
          </p>
          <p className="mt-1 text-sm text-foreground/90">
            <span className="text-foreground/60">From</span>{" "}
            <span className="font-medium">{data.perceivedAs}</span>{" "}
            <span className="text-foreground/60">→ to</span>{" "}
            <span className="text-gradient-primary font-semibold">
              {data.shouldBeSeenAs}
            </span>
            . That delta becomes the spine of your authority strategy.
          </p>
        </div>
      )}
    </div>
  );
}

function LearningSection({
  data,
  toggleMulti,
}: {
  data: FounderIntelligenceData;
  toggleMulti: (
    key: "knownFor" | "discovery" | "blockers" | "learningSignals",
    value: string,
  ) => void;
}) {
  const iconFor = (s: string) => {
    if (s.toLowerCase().includes("voice")) return Mic;
    if (s.toLowerCase().includes("upload") || s.toLowerCase().includes("crm")) return Upload;
    return FileText;
  };
  return (
    <div className="space-y-7">
      <AiBubble>
        How should your coach learn from you moving forward? Pick anything that fits your
        rhythm.
      </AiBubble>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {LEARNING_SIGNALS.map((s) => {
          const Icon = iconFor(s);
          const selected = data.learningSignals.includes(s);
          return (
            <button
              key={s}
              onClick={() => toggleMulti("learningSignals", s)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all flex items-center gap-3",
                "glass hover:-translate-y-0.5",
                selected
                  ? "border-primary/60 shadow-glow bg-primary/10"
                  : "border-glass-border hover:border-primary/30",
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                  selected
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-secondary text-foreground/70",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground flex-1">{s}</span>
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-glass-border opacity-60",
                )}
              >
                {selected && <Check className="h-3 w-3" />}
              </span>
            </button>
          );
        })}
      </div>

      {data.learningSignals.length > 0 && (
        <AiBubble>
          I&apos;ll continuously refine your strategic intelligence model from these signals.
        </AiBubble>
      )}
    </div>
  );
}
