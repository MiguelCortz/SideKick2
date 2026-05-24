/**
 * Preprocesamiento de submissions de Forms → score_[date].json
 *
 * Recibe un JSON con submissions del formulario de reunión. Cada submission
 * tiene la forma:
 *
 *   {
 *     "phone": "+34 600 000 000",
 *     "source": "InMail" | "Publication" | "Cold messages",
 *     "submittedAt": "2026-05-23T10:30:00Z"   // ISO date
 *   }
 *
 * El script:
 *  1. Agrupa las submissions por día (YYYY-MM-DD, UTC).
 *  2. Cuenta repeticiones por `source` dentro de cada día.
 *  3. Suma el total como métrica "New forms" (desempeño general).
 *  4. Genera un archivo `src/data/score_<YYYY-MM-DD>.json` por cada día de
 *     la última semana (7 días hacia atrás desde la fecha más reciente).
 *     Si un día no tiene submissions, escribe ceros.
 *
 * Uso:
 *   bun src/scripts/preprocesamiento.ts <ruta-al-json-de-submissions>
 *
 * Ejemplo:
 *   bun src/scripts/preprocesamiento.ts src/data/forms-submissions.json
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

type Source = "InMail" | "Publication" | "Cold messages";

interface Submission {
  phone: string;
  source: Source;
  submittedAt: string; // ISO
}

interface DailyScore {
  date: string; // YYYY-MM-DD
  scores: {
    InMail: number;
    Publication: number;
    "Cold messages": number;
    "New forms": number;
  };
}

const SOURCES: Source[] = ["InMail", "Publication", "Cold messages"];

function toDateKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function shiftDate(dateKey: string, deltaDays: number): string {
  const d = new Date(`${dateKey}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

export function aggregate(submissions: Submission[]): Map<string, DailyScore> {
  const byDay = new Map<string, DailyScore>();

  for (const s of submissions) {
    if (!SOURCES.includes(s.source)) continue;
    const day = toDateKey(s.submittedAt);
    if (!byDay.has(day)) {
      byDay.set(day, {
        date: day,
        scores: {
          InMail: 0,
          Publication: 0,
          "Cold messages": 0,
          "New forms": 0,
        },
      });
    }
    const bucket = byDay.get(day)!;
    bucket.scores[s.source] += 1;
    bucket.scores["New forms"] += 1;
  }

  return byDay;
}

/**
 * Genera 7 días hacia atrás desde la fecha más reciente encontrada.
 * Los días sin submissions se rellenan con ceros para que el frontend
 * pueda calcular deltas semana a semana sin huecos.
 */
export function buildWeek(byDay: Map<string, DailyScore>): DailyScore[] {
  if (byDay.size === 0) return [];
  const latest = [...byDay.keys()].sort().at(-1)!;
  const out: DailyScore[] = [];
  for (let i = 0; i < 7; i++) {
    const day = shiftDate(latest, -i);
    out.push(
      byDay.get(day) ?? {
        date: day,
        scores: {
          InMail: 0,
          Publication: 0,
          "Cold messages": 0,
          "New forms": 0,
        },
      },
    );
  }
  return out;
}

function writeFiles(week: DailyScore[], outDir: string) {
  mkdirSync(outDir, { recursive: true });
  for (const day of week) {
    const file = resolve(outDir, `score_${day.date}.json`);
    writeFileSync(file, JSON.stringify(day, null, 2) + "\n");
    console.log(`✓ ${file}`);
  }

  // Sobrescribe los archivos que consume el frontend: hoy y ayer.
  if (week[0]) {
    const today = resolve(outDir, "score-today.json");
    writeFileSync(today, JSON.stringify(week[0], null, 2) + "\n");
    console.log(`✓ ${today}`);
  }
  if (week[1]) {
    const yesterday = resolve(outDir, "score-yesterday.json");
    writeFileSync(yesterday, JSON.stringify(week[1], null, 2) + "\n");
    console.log(`✓ ${yesterday}`);
  }
}

function main() {
  const input = process.argv[2];
  if (!input) {
    console.error("Uso: bun src/scripts/preprocesamiento.ts <submissions.json>");
    process.exit(1);
  }
  const raw = readFileSync(resolve(input), "utf-8");
  const submissions = JSON.parse(raw) as Submission[];
  const byDay = aggregate(submissions);
  const week = buildWeek(byDay);

  const outDir = resolve(dirname(input).includes("src/data") ? dirname(input) : "src/data");
  writeFiles(week, outDir);

  console.log(`\nGenerados ${week.length} archivos en ${outDir}`);
}

// Ejecuta solo si se invoca directamente.
if (import.meta.main) {
  main();
}