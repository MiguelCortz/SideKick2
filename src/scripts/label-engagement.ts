/**
 * Etiqueta publicaciones por engagement diario.
 *
 * Lee todos los archivos `src/data/score_YYYY-MM-DD.json`, calcula el
 * engagement rate de cada día como el promedio de los scores por formato
 * dentro de `scores.Publication` (text, carousel, video, image, poll),
 * selecciona el día de mayor y de menor engagement, y guarda todas las
 * publicaciones (una por formato) en `src/data/labeled/`:
 *
 *   - positive.json → día con mayor engagement, label: "positive"
 *   - negative.json → día con menor engagement, label: "negative"
 *
 * Uso:
 *   bun src/scripts/label-engagement.ts
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

type Format = "text" | "carousel" | "video" | "image" | "poll";
const FORMATS: Format[] = ["text", "carousel", "video", "image", "poll"];

interface DailyScore {
  date: string;
  scores: {
    Publication: Record<Format, number>;
    [k: string]: unknown;
  };
}

interface LabeledPublication {
  date: string;
  format: Format;
  score: number;
  engagementRate: number;
  label: "positive" | "negative";
}

const DATA_DIR = resolve("src/data");
const OUT_DIR = resolve(DATA_DIR, "labeled");

function loadDays(): DailyScore[] {
  return readdirSync(DATA_DIR)
    .filter((f) => /^score_\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => JSON.parse(readFileSync(resolve(DATA_DIR, f), "utf-8")) as DailyScore);
}

function engagementRate(day: DailyScore): number {
  const vals = FORMATS.map((f) => day.scores.Publication[f] ?? 0);
  return vals.reduce((s, n) => s + n, 0) / vals.length;
}

function publicationsOf(day: DailyScore, label: "positive" | "negative", rate: number): LabeledPublication[] {
  return FORMATS.map((f) => ({
    date: day.date,
    format: f,
    score: day.scores.Publication[f] ?? 0,
    engagementRate: Math.round(rate * 100) / 100,
    label,
  }));
}

function main() {
  const days = loadDays();
  if (days.length === 0) {
    console.error("No se encontraron archivos score_YYYY-MM-DD.json");
    process.exit(1);
  }

  const ranked = days
    .map((d) => ({ day: d, rate: engagementRate(d) }))
    .sort((a, b) => b.rate - a.rate);

  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  mkdirSync(OUT_DIR, { recursive: true });

  const positive = publicationsOf(best.day, "positive", best.rate);
  const negative = publicationsOf(worst.day, "negative", worst.rate);

  writeFileSync(resolve(OUT_DIR, "positive.json"), JSON.stringify(positive, null, 2) + "\n");
  writeFileSync(resolve(OUT_DIR, "negative.json"), JSON.stringify(negative, null, 2) + "\n");

  console.log(`✓ positive → ${best.day.date} (engagement ${best.rate.toFixed(2)})`);
  console.log(`✓ negative → ${worst.day.date} (engagement ${worst.rate.toFixed(2)})`);
}

if (import.meta.main) {
  main();
}