# MondayOS — Revenue DNA Onboarding (rama de cambios)

Esta rama refina el flujo de onboarding "Build Your Revenue DNA" y lo prepara para una fusión con el proyecto base colaborativo. A continuación se documentan **los cambios añadidos respecto a la base**, para facilitar la revisión del merge.

---

## Resumen ejecutivo

- Onboarding de 7 pasos rediseñado como _debrief estratégico_.
- Sustitución de campos de texto libre por **preguntas cerradas** en los pasos cuyo contenido es **material útil para Data Science** (segmentación, modelos, scoring).
- Componente nuevo `ChoiceField` para selección única o múltiple con estilo glassmorphism del sistema.
- Pantalla final "Revenue DNA Activated" con resumen ejecutivo generado a partir de las respuestas.
- Mejora UX en el botón Continue (mensaje de ayuda cuando está deshabilitado).

---

## Cambios por archivo

### Nuevos

- `src/components/onboarding/ChoiceField.tsx`
  - Componente reutilizable de selección (radio o multi).
  - Props: `label`, `hint`, `options[{value,label,hint}]`, `value`, `onChange`, `multi`, `columns (1|2|3)`.
  - Estilos integrados con tokens del sistema (`glass-border`, `primary`, `shadow-glow`).

### Modificados

- `src/components/onboarding/Onboarding.tsx`
  - `State` ampliado: `triedWhat: string[]`, y `customers`, `salesCycle`, `outcome90`, `meetings` como categorías cerradas.
  - Conjuntos de opciones añadidos: `motionOptions`, `pricingOptions`, `customerCountOptions`, `cycleOptions`, `channelOptions`, `stuckOptions`, `meetingsOptions`, `outcomeOptions`.
  - Renderers reemplazados en los pasos **Commercial**, **Tried** y **Objectives** para usar `ChoiceField`.
  - `canAdvance` actualizado para validar arrays no vacíos en multi-select.
  - Botón Continue con mensaje contextual _"Complete every field to continue"_ cuando está deshabilitado.

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

## Cómo fusionar con el proyecto base

1. Conecta este proyecto a GitHub desde Lovable (botón **+** → **GitHub** → **Connect project**).
2. En GitHub, abre un Pull Request desde esta rama hacia la rama principal del repo base colaborativo.
3. Resuelve cualquier conflicto en `src/components/onboarding/Onboarding.tsx` (es el archivo con más cambios).
4. Tras el merge, los datos categóricos quedan listos para entrenar modelos de segmentación / scoring sin preprocesamiento adicional de texto libre.

---

## Stack

TanStack Start · React 19 · Vite 7 · Tailwind v4 · Lovable Cloud (Supabase).

# Edición de Jesús

note un problema principal, hasta ahora tenemos 3 productos

MondayOS -> sistema operativo, estamos compitiendo con Windows, Mac, Linux, Android.

Revenue Coach -> Agente de IA, le damos datos de la empresa, nos difiere que funciona y que no. Max(Awareness) y de colateral educar al usuario y entrar en el flujo del trafico masivo online (primera parte del fundel)

SideKick

Mi modificación fue quitar MondayOS, esto porque aunque puede sonar una palabra apantalladora
tiene el problema de que la aceptación de un nuevo sistema operativo es más dificil ya que es mudar todo el entorno
de trabajo y se enfrenta a incompatibilidad, además no corresponde con la definición.

Remplace todo MondayOS por SideKick, el nombre que le dimos en la presentación.

agregue la carpeta data la cual simula reuniones con clientes y el medio por el que nos conocieron (retroalimentación)
@preprocesamiento.ts convierte los datos de entrada en la salida de decisiones a futuro.

Score.tsx e improve.tsx resumen los datos obtenidos
