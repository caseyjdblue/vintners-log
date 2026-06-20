# Lifecycle Stages — App Architecture (Layer 3)

**File:** Lifecycle Stages (App Layer 3 of 4)
**Purpose:** The canonical states a batch moves through from harvest to drinking, with entry/exit criteria, expected readings/actions, and allowed transitions. This is the spine of lifecycle management — it maps the Process & SOP Stages 0–12 onto application states the app tracks and enforces.
**Status:** Living definition. Stage IDs here are the values used by `Batch.stage` and `StageHistory.stage` (Layer 2).

---

## How it works

A batch occupies exactly one `stage` at a time; transitions are recorded in `stage_history`. Each stage declares what data is **expected** (so the UI can prompt for it), its **entry/exit criteria** (so Layer 4 can gate transitions — e.g., block bottling until FG is stable), and its **allowed next stages**. Two stages are **optional** (`stabilizing`, `conditioning`) and skipped by style: stabilizing applies when back-sweetening; conditioning applies to sparkling.

---

## Stages

**Fields:** `id` · `order` · `name` · `sop_stages` · `description` · `expected_readings` · `expected_events` · `entry_criteria` · `exit_criteria` · `typical_duration` · `next` · `optional`

```json
[
  {"id":"stage.planned","order":1,"name":"Planned","sop_stages":[0],"description":"Recipe/fruit/yeast chosen; equipment gathered and sanitized; not yet started.","expected_readings":[],"expected_events":["sanitize"],"entry_criteria":["recipe_id or fruit_id+yeast_id set"],"exit_criteria":["fruit acquired"],"typical_duration":"—","next":["stage.fruit_prep"],"optional":false},
  {"id":"stage.fruit_prep","order":2,"name":"Fruit Prep","sop_stages":[1],"description":"Sort/wash; freeze-thaw berries; pit cherries; crush in straining bag.","expected_readings":[],"expected_events":["fruit_prep","sanitize"],"entry_criteria":["fruit acquired"],"exit_criteria":["fruit prepared"],"typical_duration":"1 day","next":["stage.must_prep"],"optional":false},
  {"id":"stage.must_prep","order":3,"name":"Must Prep","sop_stages":[2,3],"description":"Combine fruit, water, sugar to OG; add sulfite + pectic enzyme + acid/tannin; wait 12–24 h.","expected_readings":["og","ta","ph"],"expected_events":["sugar_addition","sulfite_addition","additive_addition"],"entry_criteria":["fruit prepared"],"exit_criteria":["OG measured to target","12–24 h sulfite-out wait elapsed"],"typical_duration":"~1 day","next":["stage.primary"],"optional":false},
  {"id":"stage.primary","order":4,"name":"Primary Fermentation","sop_stages":[4,5],"description":"Pitch yeast (rehydrated, half nutrient); ferment on the fruit; punch cap; add remaining nutrient at 1/3 break.","expected_readings":["sg","temperature"],"expected_events":["pitch","nutrient_addition","punch_down"],"entry_criteria":["must_prep exit criteria met"],"exit_criteria":["primary complete (~3–7 days; cider 1–2 wk)"],"typical_duration":"3–7 days (cider 1–2 wk)","next":["stage.secondary"],"optional":false},
  {"id":"stage.secondary","order":5,"name":"Secondary Fermentation","sop_stages":[6,7],"description":"Press/strain off fruit; transfer to carboy under airlock; ferment to dry.","expected_readings":["sg","fg","temperature"],"expected_events":["pressing","racking"],"entry_criteria":["primary complete"],"exit_criteria":["FG reached and STABLE over 2–3 days"],"typical_duration":"1–3 weeks","next":["stage.bulk_aging"],"optional":false},
  {"id":"stage.bulk_aging","order":6,"name":"Bulk Aging","sop_stages":[8,9],"description":"Rack off gross then fine lees; sulfite top-ups; degas; clear (time/cold, finings if needed).","expected_readings":["sg","free_so2"],"expected_events":["racking","sulfite_addition","fining"],"entry_criteria":["FG stable"],"exit_criteria":["wine clear and stable"],"typical_duration":"1–12 months","next":["stage.stabilizing","stage.bottling"],"optional":false},
  {"id":"stage.stabilizing","order":7,"name":"Stabilizing & Back-Sweetening","sop_stages":[10],"description":"On a finished, cleared wine: add sorbate + sulfite, then back-sweeten to taste.","expected_readings":["sg"],"expected_events":["stabilize","sulfite_addition","back_sweeten"],"entry_criteria":["wine clear and stable","intends to back-sweeten"],"exit_criteria":["stabilized and sweetened"],"typical_duration":"days","next":["stage.bottling"],"optional":true},
  {"id":"stage.bottling","order":8,"name":"Bottling","sop_stages":[11],"description":"Sanitize bottles; add bottling sulfite; fill; still or prime for sparkling.","expected_readings":["volume"],"expected_events":["sulfite_addition","priming","bottling"],"entry_criteria":["FG stable","stabilized if back-sweetened"],"exit_criteria":["bottled; bottle_count recorded"],"typical_duration":"1 day","next":["stage.conditioning","stage.cellaring"],"optional":false},
  {"id":"stage.conditioning","order":9,"name":"Conditioning (Sparkling)","sop_stages":[11],"description":"Bottle-condition primed sparkling cider ~2 weeks warm, then refrigerate.","expected_readings":[],"expected_events":[],"entry_criteria":["sparkling style","primed","no sorbate used"],"exit_criteria":["carbonated"],"typical_duration":"~2 weeks","next":["stage.cellaring"],"optional":true},
  {"id":"stage.cellaring","order":10,"name":"Cellaring / Bottle Aging","sop_stages":[12],"description":"Age in bottle toward the fruit's drinking window.","expected_readings":[],"expected_events":[],"entry_criteria":["bottled (and conditioned if sparkling)"],"exit_criteria":["drinking window reached"],"typical_duration":"per fruit drink_window","next":["stage.drinking"],"optional":false},
  {"id":"stage.drinking","order":11,"name":"Drinking","sop_stages":[12],"description":"In its drinking window; logging tasting notes.","expected_readings":[],"expected_events":["taste"],"entry_criteria":["drinking window reached"],"exit_criteria":["consumed"],"typical_duration":"per style","next":["stage.archived"],"optional":false},
  {"id":"stage.archived","order":12,"name":"Archived","sop_stages":[],"description":"Batch complete (consumed or dumped); kept for records.","expected_readings":[],"expected_events":["note"],"entry_criteria":["consumed or dumped"],"exit_criteria":[],"typical_duration":"—","next":[],"optional":false}
]
```

---

## Allowed transitions

Mostly linear, with two optional branches. The UI should offer only the `next` stages for the current state (and allow a backward correction with a recorded reason).

| From | To (normal) | Notes |
|---|---|---|
| planned | fruit_prep | |
| fruit_prep | must_prep | |
| must_prep | primary | gated: OG measured + sulfite wait elapsed |
| primary | secondary | |
| secondary | bulk_aging | gated: **FG stable** |
| bulk_aging | stabilizing *or* bottling | stabilizing only if back-sweetening |
| stabilizing | bottling | |
| bottling | conditioning *or* cellaring | conditioning only if sparkling |
| conditioning | cellaring | |
| cellaring | drinking | gated: drink window reached |
| drinking | archived | |

A batch may also move to `status: dumped` → `stage.archived` from any stage (e.g., spoilage; see Troubleshooting).

---

## Cross-references
- **Layer 2:** `Batch.stage` and `StageHistory.stage` use these IDs; `expected_readings`/`expected_events` use the Layer 1 enumerations.
- **Layer 4:** the `entry_criteria`/`exit_criteria` (especially "FG stable", "stabilized if back-sweetened", "drink window reached") are enforced by validation rules; per-stage scheduled tasks (nutrient, racking, sulfite top-ups) attach to these stages.
- **Process & SOP:** `sop_stages` maps each app state back to the SOP's Stages 0–12.
