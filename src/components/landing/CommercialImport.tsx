import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  Link2,
  Sparkles,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Trophy,
  Mic,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiBubble } from "@/components/onboarding/AiBubble";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "done";
}

const PROCESSING_STAGES = [
  { label: "Analyzing commercial signals", icon: Brain },
  { label: "Mapping revenue patterns", icon: TrendingUp },
  { label: "Detecting growth friction", icon: AlertTriangle },
  { label: "Identifying narrative opportunities", icon: Lightbulb },
];

const INSIGHT_CARDS = [
  {
    icon: TrendingUp,
    label: "Pipeline Velocity",
    text: "Pipeline velocity slowing in mid-funnel",
    tone: "from-amber-400/20 to-orange-500/10",
  },
  {
    icon: AlertTriangle,
    label: "Buyer Friction",
    text: "Enterprise buyers hesitate around implementation complexity",
    tone: "from-rose-400/20 to-red-500/10",
  },
  {
    icon: Lightbulb,
    label: "Narrative Opportunity",
    text: "Thought leadership opportunity in operational simplicity positioning",
    tone: "from-violet-400/20 to-fuchsia-500/10",
  },
  {
    icon: Trophy,
    label: "Proof Points",
    text: "High-value proof points found in customer success materials",
    tone: "from-emerald-400/20 to-teal-500/10",
  },
  {
    icon: Mic,
    label: "Founder Authority",
    text: "Founder authority themes identified from uploaded research",
    tone: "from-sky-400/20 to-cyan-500/10",
  },
];

const ACCEPTED_TYPES = [
  "CRM exports",
  "Sales dashboards",
  "Pipeline screenshots",
  "Revenue reports",
  "Meeting transcripts",
  "Commercial notes",
  "Strategic documents",
  "Articles",
  "Product decks",
  "Case studies",
  "Performance reports",
];

export function CommercialImport({ onComplete }: { onComplete: () => void }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stageIndex, setStageIndex] = useState(-1);
  const [stageDone, setStageDone] = useState<boolean[]>([false, false, false, false]);
  const [visibleInsights, setVisibleInsights] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [complete, setComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasInput = files.length > 0 || websiteUrl.trim().length > 0;

  const addFiles = useCallback((list: FileList | File[]) => {
    const arr = Array.from(list).slice(0, 12);
    const next: UploadedFile[] = arr.map((f) => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      status: "uploading",
    }));
    setFiles((prev) => [...prev, ...next]);
    next.forEach((nf, i) => {
      setTimeout(() => {
        setFiles((prev) => prev.map((p) => (p.id === nf.id ? { ...p, status: "done" } : p)));
      }, 600 + i * 250);
    });
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const beginProcessing = () => {
    if (!hasInput || processing) return;
    setProcessing(true);
    setStageIndex(0);
  };

  // Drive stages
  useEffect(() => {
    if (!processing || stageIndex < 0 || stageIndex >= PROCESSING_STAGES.length) return;
    const t = setTimeout(() => {
      setStageDone((prev) => {
        const next = [...prev];
        next[stageIndex] = true;
        return next;
      });
      setStageIndex((i) => i + 1);
    }, 1100);
    return () => clearTimeout(t);
  }, [processing, stageIndex]);

  // After stages done → reveal insights, ramp confidence
  useEffect(() => {
    if (!processing || stageIndex < PROCESSING_STAGES.length) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setVisibleInsights(i);
      if (i >= INSIGHT_CARDS.length) clearInterval(interval);
    }, 320);
    return () => clearInterval(interval);
  }, [processing, stageIndex]);

  useEffect(() => {
    if (visibleInsights < INSIGHT_CARDS.length) return;
    let v = 0;
    const target = 87;
    const interval = setInterval(() => {
      v += 1;
      setConfidence(v);
      if (v >= target) {
        clearInterval(interval);
        setTimeout(() => setComplete(true), 400);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [visibleInsights]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-12">
      {/* Hero */}
      <header className="text-center space-y-5 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs text-foreground/70">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Commercial Context Import
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gradient">
          Train Your Revenue Coach
        </h1>
        <p className="mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-foreground/70">
          Import your commercial intelligence so MondayOS can deeply understand your business
          before designing your growth system.
        </p>
      </header>

      {/* Upload zone */}
      {!processing && (
        <section className="space-y-6 animate-fade-up">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-3xl glass-strong p-10 md:p-14 transition-all",
              dragActive && "shadow-glow ring-1 ring-primary/60",
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{ background: "var(--gradient-aurora)" }}
              aria-hidden
            />
            <div className="relative flex flex-col items-center text-center gap-5">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
                <Upload className="h-7 w-7 text-primary-foreground" />
                <span className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
              </div>
              <div className="space-y-1.5">
                <p className="text-lg font-medium text-foreground">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-foreground/60 max-w-md">
                  CRM exports, dashboards, transcripts, decks, reports, case studies, strategic
                  notes — anything that explains how your business sells.
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl pt-2">
                {ACCEPTED_TYPES.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-glass-border bg-glass px-2.5 py-1 text-[11px] text-foreground/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Website URL */}
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <Link2 className="h-4 w-4 text-foreground/70" />
            </div>
            <Input
              placeholder="Or paste your website URL (e.g. https://yourcompany.com)"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0"
            />
          </div>

          {/* Files list */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="glass flex items-center gap-3 rounded-xl px-4 py-3 animate-fade-up"
                >
                  <FileText className="h-4 w-4 text-foreground/60 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-foreground/90">{f.name}</p>
                    <p className="text-[11px] text-foreground/50">
                      {(f.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {f.status === "uploading" ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(f.id);
                    }}
                    className="text-foreground/40 hover:text-foreground/80 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={beginProcessing}
              disabled={!hasInput}
              size="lg"
              className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-7 h-12 text-base font-medium"
            >
              Analyze Commercial Context
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      )}

      {/* Processing stages */}
      {processing && (
        <section className="space-y-6 animate-fade-up">
          <div className="glass-strong rounded-3xl p-6 md:p-8 space-y-3">
            {PROCESSING_STAGES.map((s, i) => {
              const active = stageIndex === i;
              const done = stageDone[i];
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                    active && "bg-primary/10",
                    done && "opacity-90",
                    !active && !done && "opacity-40",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      done ? "bg-emerald-500/20" : "bg-primary/15",
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : active ? (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4 text-foreground/60" />
                    )}
                  </div>
                  <p className="text-sm text-foreground/90 flex-1">
                    {s.label}
                    {active && <span className="text-foreground/50">…</span>}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Insights */}
          {visibleInsights > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/60">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Commercial Reality Detected
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {INSIGHT_CARDS.slice(0, visibleInsights).map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.label}
                      className="group relative overflow-hidden rounded-2xl glass p-4 animate-fade-up"
                    >
                      <div
                        className={cn(
                          "pointer-events-none absolute inset-0 opacity-60 bg-gradient-to-br",
                          card.tone,
                        )}
                        aria-hidden
                      />
                      <div className="relative flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/40 backdrop-blur">
                          <Icon className="h-4 w-4 text-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] uppercase tracking-wider text-foreground/60">
                            {card.label}
                          </p>
                          <p className="text-sm text-foreground/90 leading-relaxed">
                            {card.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Confidence */}
          {visibleInsights >= INSIGHT_CARDS.length && (
            <div className="glass-strong rounded-2xl p-6 space-y-3 animate-fade-up">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/80">Strategic Understanding Confidence</p>
                <p className="text-2xl font-semibold text-gradient-primary tabular-nums">
                  {confidence}%
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-primary/15">
                <div
                  className="h-full bg-gradient-primary transition-all duration-150"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <div className="flex gap-1 pt-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all",
                      i < Math.floor((confidence / 100) * 24)
                        ? "bg-primary animate-pulse-soft"
                        : "bg-primary/10",
                    )}
                    style={{ animationDelay: `${i * 40}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {complete && (
            <div className="space-y-6 animate-fade-up">
              <AiBubble>
                I&apos;ve begun mapping how your company sells, where your growth friction
                exists, and what strategic authority opportunities are currently
                under-leveraged. Now I need to understand the founder behind the business.
              </AiBubble>
              <div className="flex justify-center pt-2">
                <Button
                  onClick={onComplete}
                  size="lg"
                  className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 px-8 h-12 text-base font-medium group"
                >
                  Begin Strategic Debrief
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
