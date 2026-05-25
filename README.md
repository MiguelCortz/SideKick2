# SideKick — Revenue DNA Onboarding (rama de cambios)

Esta rama refina el flujo de onboarding "Build Your Revenue DNA" y lo prepara para una fusión con el proyecto base colaborativo. A continuación se documentan **los cambios añadidos respecto a la base**, para facilitar la revisión del merge.

---

## Resumen ejecutivo

- Onboarding de 7 pasos rediseñado como _debrief estratégico_.
- Sustitución de campos de texto libre por **preguntas cerradas** en los pasos cuyo contenido es **material útil para Data Science** (segmentación, modelos, scoring).
- Componente nuevo `ChoiceField` para selección única o múltiple con estilo glassmorphism del sistema.
- Pantalla final "Revenue DNA Activated" con resumen ejecutivo generado a partir de las respuestas.
---
## Campos convertidos a preguntas cerradas (data-science friendly)

| Paso       | Campo        | Tipo                   | Notas                                   |
| ---------- | ------------ | ---------------------- | --------------------------------------- |
| Commercial | `howBuy`     | single-choice          | Motion comercial (PLG, sales-led, etc.) |
| Commercial | `pricing`    | single-choice (3 cols) | Modelo de pricing                       |
| Commercial | `customers`  | single-choice (3 cols) | Rangos discretos de clientes            |
| Commercial | `salesCycle` | single-choice (3 cols) | Duración del ciclo                      |
| Tried      | `triedWhat`  | **multi-choice**       | Canales / tácticas probadas             |
| Tried      | `stuck`      | single-choice          | Punto de fricción dominante             |
| Objectives | `outcome90`  | single-choice          | Objetivo 90 días                        |
| Objectives | `meetings`   | single-choice (3 cols) | Meetings/mes objetivo                   |

Los campos **cualitativos** (`company`, `problem`, `whyMatters`, `competitors`, `whyChoose`, `whyHesitate`, `misunderstood`, `truth`, `lesson`, `style`, `success`, `worked`, `notWorked`) **se mantienen abiertos** porque aportan contexto narrativo, no señal estructurada.

---

## Stack

TanStack Start · React 19 · Vite 7 · Tailwind v4 · Lovable Cloud (Supabase).
