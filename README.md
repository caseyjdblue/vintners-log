# Project README & Build Brief

**Project:** PNW Fruit-Winemaking Lifecycle App — knowledge base & app architecture
**Region:** Pacific Northwest, western Washington
**Contents:** 15 files (11 knowledge catalogues + 4 architecture layers), plus this README.
**Status:** Foundation complete. All files regression-tested; all JSON validated; all cross-references resolve; shared values verified consistent.

---

## What this project is

The foundation for an app whose primary purpose is **full-lifecycle batch management** — letting a user create a fruit-wine or cider batch and record data from harvest through bottling and beyond — backed by a curated winemaking knowledge base tuned for western Washington (5 fruits, 9 yeast strains, 11 recipes).

The repository is built in **two layers**, and the distinction matters for the UI build:

- **Knowledge layer (11 files):** human-readable domain reference. This is *content the app surfaces* (help, tooltips, lookups, the calendar).
- **Architecture layer (4 files):** the data and logic *contract the UI is built against*. Machine-readable (markdown data-dictionary + JSON Schema + records).

Runtime **batch records are user data created in the app** — not authored here. The architecture layer defines their *shape and rules*.

---

## How the layers relate

```
            UI  (built in the next chat)
             │  built against
             ▼
  ┌──────────────────────────────────────────┐
  │  ARCHITECTURE LAYER (the contract)         │
  │  data-model · lifecycle-stages ·           │
  │  rules-automations  ── reference ──▶ reference-data
  └──────────────────────────────────────────┘
             │  values come from / deep-link to
             ▼
  ┌──────────────────────────────────────────┐
  │  KNOWLEDGE LAYER (the content)             │
  │  fruit-profiles · yeast-strains · additives│
  │  recipes · process-sop · equipment ·       │
  │  sanitation · calculations-conversions ·   │
  │  troubleshooting · glossary · seasonal-srcg │
  └──────────────────────────────────────────┘
```

---

## Architecture layer — build against these

| File | Purpose | Drives in the UI |
|---|---|---|
| **reference-data** | ID scheme + structured records for fruits, yeasts, additives, recipes, equipment + enumerations | Pickers, dropdowns, seed data, calendar source |
| **data-model** | `Batch` entity + append-only `readings`/`events`/`stage_history`/`tasting_notes` | Batch creation & data-logging screens |
| **lifecycle-stages** | 12 states (mapped to SOP 0–12) with entry/exit gates and transitions | The lifecycle flow / stage progression UI |
| **rules-automations** | Computed fields, validation guardrails (block/warn), scheduled reminders | Calculators, safety gates, task reminders |

---

## Knowledge layer — surface these as content

| File | What it covers |
|---|---|
| **fruit-profiles** | Per-fruit specs: harvest, Brix/TA/pH, ratios, target OG/ABV, aging |
| **yeast-strains** | 9 strains: tolerance, temp, nutrient demand, best-for fruit |
| **additives** | Doses, timing, the three sulfite uses, sulfite-by-pH |
| **recipes** | 11 full per-batch recipes across styles |
| **process-sop** | The 13-stage workflow, measurement procedures, water prep |
| **equipment** | Vessels/sizing, instruments, bottling hardware |
| **sanitation** | Clean-then-sanitize, the "sanitize everything" checklist |
| **calculations-conversions** | Canonical formulas/constants + unit tables |
| **troubleshooting** | Full faults catalogue + diagnostic index |
| **glossary** | A–Z term definitions for tooltips/search |
| **seasonal-sourcing** | Month-by-month availability + sourcing (calendar data) |

---

## Canonical sources & sync dependencies (must respect)

Some values intentionally live in one place and are mirrored elsewhere. Preserve these so nothing drifts:

- **calculations-conversions** owns all **formulas and constants** (ABV, sugar, sulfite, priming, scaling). Everything else applies them.
- **reference-data** owns all **structured values and IDs**. The prose catalogues remain canonical for *explanation*.
- **fruit-profiles** owns **harvest windows**; *seasonal-sourcing mirrors* them.
- **process-sop** owns **water prep / dechlorination**; *sanitation mirrors* it.
- **troubleshooting** is the **full faults** catalogue; *process-sop keeps a quick subset* that points to it.

IDs follow `namespace.slug` (defined in reference-data). Logs are **append-only**; computed values are **derived on read, never stored**.

---

## Non-negotiable guardrails (block-severity rules)

The app must *prevent* (not just warn) these, because they cause unrecoverable failures:

- **No bottling before FG is stable** (refermentation / bottle bombs).
- **No back-sweetening before stabilizing** (sorbate + sulfite first).
- **No sorbate on a sparkling/bottle-conditioned cider** (it blocks carbonation).

Warn-level rules (ABV vs. yeast tolerance, ferment temp out of range, high-pH/low-SO₂, preservative in cider juice, stalled gravity) inform but allow an acknowledged override. See **rules-automations**.

---

## Suggested UI build order

1. **Load reference-data** → build pickers and seed the fruit/yeast/recipe/additive lists.
2. **Implement the Batch model** (data-model) → create-batch flow and the readings/events log.
3. **Add the lifecycle** (lifecycle-stages) → stage progression with the entry/exit gates.
4. **Wire rules-automations** → computed fields and the guardrails/reminders, with formulas pulled from calculations-conversions.
5. **Surface knowledge content** → help/lookups (troubleshooting, glossary), the seasonal calendar, and recipe/fruit detail views.

If context gets tight during heavy code generation, the must-load files are the four architecture files plus **calculations-conversions**; the deep prose catalogues can be pulled in on demand.

---

## Future backlog (intentionally not yet built)

Removed from the files during cleanup to keep the foundation tight, but tracked here so they aren't lost: **oak** aging, **malolactic** fermentation, **cold-stabilization**, **kegging / force-carbonation**, additional **fruits** (raspberry, plum, pear/perry, peach, elderberry, currant), additional **yeast strains**, **blending/bench-trial** method, a **session-strength cider**, and a detailed **step-feeding worksheet**. Add these to the relevant catalogues (and their structured records in reference-data) when wanted — re-run the regression check after.
