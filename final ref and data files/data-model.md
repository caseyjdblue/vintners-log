# Batch Data Model — App Architecture (Layer 2)

**File:** Batch Data Model (App Layer 2 of 4)
**Purpose:** Defines the `Batch` entity and its child records — the structure that lets a user create a batch and log data from harvest to bottling and beyond. References Layer 1 (Reference Data) by ID; its stages come from Layer 3; its computed/validated behavior comes from Layer 4.
**Status:** Living schema. These define the *shape* of runtime user data; the records themselves are created by users in the app.

---

## Entity overview

```
Batch (1)
├── readings[]        (timestamped measurements)
├── events[]          (timestamped actions/additions)
├── stage_history[]   (stage transitions over time)
├── tasting_notes[]   (post-bottling evaluations)
└── outcome           (final summary, optional)
```

A **Batch** is the root. It references a `recipe_id`, `fruit_id`, and `yeast_id` from Layer 1, holds its current lifecycle `stage` (Layer 3), and accumulates child records over its life. Readings and events are append-only logs (never edited in place — corrections are new entries) so the history stays trustworthy.

---

## Batch

**Fields**

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | unique batch ID |
| `name` | string | user label (e.g., "Cherry 2026 #1") |
| `recipe_id` | string\|null | FK → `recipe.*` (null = freeform batch) |
| `fruit_id` | string | FK → `fruit.*` |
| `yeast_id` | string | FK → `yeast.*` |
| `batch_size_gal` | number | finished target volume |
| `style` | enum | `style.*` |
| `stage` | string | current `stage.*` (Layer 3) |
| `status` | enum | `active` · `complete` · `archived` · `dumped` |
| `target_og` | number | from recipe/fruit, editable |
| `target_abv` | number | target % |
| `started_at` | datetime | batch creation / fruit prep |
| `bottled_at` | datetime\|null | set at bottling |
| `flags` | string[] | active warnings (Layer 4 rule IDs) |
| `created_at` / `updated_at` | datetime | audit |

## Reading (child, append-only)

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `batch_id` | string | FK → Batch |
| `type` | enum | `reading_type.*` (sg, og, fg, temperature, ta, ph, free_so2, volume, abv) |
| `value` | number | |
| `unit` | enum | `unit.*` |
| `stage` | string | stage when recorded |
| `recorded_at` | datetime | |
| `note` | string\|null | |

## Event (child, append-only)

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `batch_id` | string | FK → Batch |
| `type` | enum | `event_type.*` (pitch, nutrient_addition, racking, sulfite_addition, …) |
| `additive_id` | string\|null | FK → `additive.*` when applicable (or `yeast.*` for a `pitch` event) |
| `amount` | number\|null | |
| `unit` | enum\|null | `unit.*` |
| `stage` | string | stage when performed |
| `performed_at` | datetime | |
| `note` | string\|null | |

## StageHistory (child)

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `batch_id` | string | FK → Batch |
| `stage` | string | `stage.*` entered |
| `entered_at` | datetime | |
| `exited_at` | datetime\|null | null = current |

## TastingNote (child)

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `batch_id` | string | FK → Batch |
| `tasted_at` | datetime | |
| `rating` | int (1–5)\|null | |
| `notes` | string | |

## Outcome (embedded, optional)

| Field | Type | Notes |
|---|---|---|
| `final_abv` | number | computed at FG |
| `final_fg` | number | |
| `bottle_count` | int | |
| `summary` | string | |

---

## Example batch record (JSON)

```json
{
  "id": "b_0001",
  "name": "Cherry 2026 #1",
  "recipe_id": "recipe.cherry_table",
  "fruit_id": "fruit.sweet_cherry",
  "yeast_id": "yeast.71b",
  "batch_size_gal": 5,
  "style": "dry",
  "stage": "stage.primary",
  "status": "active",
  "target_og": 1.090,
  "target_abv": 12,
  "started_at": "2026-07-10T09:00:00Z",
  "bottled_at": null,
  "flags": [],
  "readings": [
    {"id":"r1","batch_id":"b_0001","type":"og","value":1.090,"unit":"sg","stage":"stage.must_prep","recorded_at":"2026-07-10T12:00:00Z","note":"after sugar to target"},
    {"id":"r2","batch_id":"b_0001","type":"ph","value":3.85,"unit":"ph","stage":"stage.must_prep","recorded_at":"2026-07-10T12:05:00Z","note":"high — extra sulfite per pH table"},
    {"id":"r3","batch_id":"b_0001","type":"sg","value":1.040,"unit":"sg","stage":"stage.primary","recorded_at":"2026-07-13T08:00:00Z","note":"~1/3 break"}
  ],
  "events": [
    {"id":"e1","batch_id":"b_0001","type":"sulfite_addition","additive_id":"additive.k_meta","amount":50,"unit":"ppm","stage":"stage.must_prep","performed_at":"2026-07-10T12:10:00Z","note":"must prep; wait 24h"},
    {"id":"e2","batch_id":"b_0001","type":"pitch","additive_id":"yeast.71b","amount":5,"unit":"g","stage":"stage.primary","performed_at":"2026-07-11T12:00:00Z","note":"rehydrated 104F; half nutrient"},
    {"id":"e3","batch_id":"b_0001","type":"nutrient_addition","additive_id":"additive.yeast_nutrient","amount":0.5,"unit":"tsp","stage":"stage.primary","performed_at":"2026-07-13T08:10:00Z","note":"second half at 1/3 break"}
  ],
  "stage_history": [
    {"id":"s1","batch_id":"b_0001","stage":"stage.must_prep","entered_at":"2026-07-10T12:00:00Z","exited_at":"2026-07-11T12:00:00Z"},
    {"id":"s2","batch_id":"b_0001","stage":"stage.primary","entered_at":"2026-07-11T12:00:00Z","exited_at":null}
  ],
  "tasting_notes": [],
  "outcome": null
}
```

---

## Notes
- **Append-only logs:** readings/events are never edited in place; a correction is a new record. This preserves an auditable lifecycle history.
- **Units stored explicitly** on every reading/event so conversions (Layer 4 / Calculations) are unambiguous.
- **`flags`** holds active Layer-4 warnings (e.g., `rule.fg_not_stable`) so the UI can surface them on the batch.
- **Computed values** (ABV, days-in-stage) are *not* stored as fields — they're derived on read per Layer 4, to avoid stale data.

## Cross-references
- **Layer 1:** all `*_id` fields are FKs into Reference Data; enumerations (`reading_type`, `event_type`, `unit`, `style`) are defined there.
- **Layer 3:** `stage` and `stage_history.stage` use the lifecycle stage IDs.
- **Layer 4:** computed fields, validation flags, and scheduled tasks operate on these records.
