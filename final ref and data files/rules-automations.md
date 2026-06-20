# Rules & Automations — App Architecture (Layer 4)

**File:** Rules & Automations (App Layer 4 of 4)
**Purpose:** The logic that turns stored data into a smart lifecycle assistant — values the app computes, guardrails it enforces, and reminders it schedules. These rules make explicit what is implicit across the knowledge catalogues (Calculations, SOP, Yeast tolerances, Additives timing).
**Status:** Living ruleset. Formulas are owned by the Calculations & Conversions catalogue (canonical); this file wires them to batch data, lifecycle stages, and reference values.

---

## How it works

Three rule types, each as structured records the app implements:
- **Computed fields** — derived on read from batch data + Layer 1 values (never stored, to avoid staleness).
- **Validations** — checked on data entry or stage transition; `severity` is `block` (prevents the action) or `warn` (flags it, allows override). Active warnings are written to `Batch.flags`.
- **Scheduled tasks** — reminders triggered by elapsed time or a measured condition, attached to a lifecycle stage.

---

## Computed fields

**Fields:** `id` · `name` · `formula` · `inputs` · `source`

```json
[
  {"id":"computed.abv","name":"ABV","formula":"(og - fg) * 131.25","inputs":["reading.og","reading.fg"],"source":"calculations-conversions#1-abv"},
  {"id":"computed.potential_abv","name":"Potential ABV (from current SG)","formula":"((sg - 1) * 1000 / 4) * 0.57","inputs":["reading.sg"],"source":"calculations-conversions#4-brix-sg-potential-alcohol"},
  {"id":"computed.attenuation_pct","name":"Apparent attenuation %","formula":"((og - sg) / (og - 1)) * 100","inputs":["reading.og","reading.sg"],"source":"calculations-conversions"},
  {"id":"computed.sugar_to_target","name":"Sugar to reach target OG (lb)","formula":"((target_og_points - current_sg_points) / 45) * batch_size_gal","inputs":["batch.target_og","reading.sg","batch.batch_size_gal"],"source":"calculations-conversions#2-sugar-addition-chaptalization"},
  {"id":"computed.free_so2_target","name":"Free SO2 target for pH (ppm)","formula":"lookup(reading.ph) -> {3.0:13,3.2:22,3.4:35,3.6:56,3.8:90,4.0:140} (interpolate)","inputs":["reading.ph"],"source":"calculations-conversions#canonical-constants"},
  {"id":"computed.priming_sugar","name":"Priming dextrose (oz)","formula":"1 * batch_size_gal","inputs":["batch.batch_size_gal"],"source":"calculations-conversions#7-priming-sugar-sparkling"},
  {"id":"computed.days_in_stage","name":"Days in current stage","formula":"now - stage_history[current].entered_at","inputs":["stage_history"],"source":"—"},
  {"id":"computed.days_total","name":"Days since start","formula":"now - batch.started_at","inputs":["batch.started_at"],"source":"—"},
  {"id":"computed.fg_stable","name":"FG stable?","formula":"last 2+ sg readings over >=2 days are equal (±0.001)","inputs":["readings.sg"],"source":"process-sop#master-process-workflow"},
  {"id":"computed.bottle_count_est","name":"Estimated bottles (750 mL)","formula":"round(batch_size_gal * 5 * 0.93)","inputs":["batch.batch_size_gal"],"source":"calculations-conversions#10-vessel-sizing-bottle-yield"}
]
```

---

## Validations (guardrails)

**Fields:** `id` · `trigger` · `condition` · `severity` · `message` · `source`

```json
[
  {"id":"rule.abv_exceeds_tolerance","trigger":"on set target_abv / pick yeast","condition":"batch.target_abv > yeast.abv_tolerance","severity":"warn","message":"Target ABV exceeds this yeast's tolerance — fermentation may stick. Choose a higher-tolerance yeast (e.g., EC-1118) or lower the target.","source":"yeast-strains; calculations-conversions"},
  {"id":"rule.ferment_temp_out_of_range","trigger":"on temperature reading","condition":"reading.temperature < yeast.temp_min OR > yeast.temp_max","severity":"warn","message":"Ferment temperature is outside this yeast's range — risk of stall (cold) or fusel/off-flavors (hot).","source":"yeast-strains; troubleshooting#A3,B6"},
  {"id":"rule.high_ph_low_so2","trigger":"on ph or free_so2 reading","condition":"reading.ph > 3.6 AND latest free_so2 < free_so2_target","severity":"warn","message":"High pH needs more free SO2 to stay protected (see pH table). Consider adding sulfite or an acid addition.","source":"calculations-conversions#canonical-constants; additives#sulfite-by-ph"},
  {"id":"rule.bottle_before_fg_stable","trigger":"on transition -> stage.bottling","condition":"computed.fg_stable == false","severity":"block","message":"FG is not yet stable over 2–3 days. Bottling now risks refermentation and bottle bombs.","source":"process-sop#bottling-carbonation; troubleshooting#F1"},
  {"id":"rule.backsweeten_without_stabilize","trigger":"on event back_sweeten","condition":"no stabilize event (sorbate + sulfite) recorded before this","severity":"block","message":"Stabilize first: add potassium sorbate + sulfite before back-sweetening, or the wine can referment.","source":"additives#potassium-sorbate; recipes"},
  {"id":"rule.sorbate_with_sparkling","trigger":"on event priming OR transition -> stage.conditioning","condition":"style == sparkling AND sorbate event recorded","severity":"block","message":"Sorbate blocks bottle-conditioning. For sparkling cider, do not stabilize with sorbate.","source":"process-sop#bottling-carbonation; recipes#8"},
  {"id":"rule.sparkling_bottle_check","trigger":"on transition -> stage.bottling (style sparkling)","condition":"style == sparkling","severity":"warn","message":"Use pressure-rated bottles only (champagne / swing-top / beer + caps). Standard wine bottles can explode.","source":"equipment#bottling-closures; troubleshooting#F1"},
  {"id":"rule.pitch_before_sulfite_wait","trigger":"on event pitch","condition":"must-prep sulfite event < 12 h before pitch","severity":"warn","message":"Wait 12–24 h after must-prep sulfite before pitching, or it can inhibit the yeast.","source":"additives#sulfite; process-sop"},
  {"id":"rule.cider_juice_preservative","trigger":"on plan cider","condition":"fruit_id == fruit.apple_cider","severity":"warn","message":"Confirm the juice is preservative-free (no potassium sorbate/benzoate) or it won't ferment.","source":"fruit-profiles#apple-hard-cider; recipes#7"},
  {"id":"rule.stuck_no_gravity_drop","trigger":"daily during stage.primary/secondary","condition":"no sg decrease over 5+ days and sg > expected fg","severity":"warn","message":"Possible stuck/sluggish ferment — check temperature and nutrient; see troubleshooting.","source":"troubleshooting#A2"}
]
```

---

## Scheduled tasks (reminders)

**Fields:** `id` · `stage` · `trigger` · `action` · `source`

```json
[
  {"id":"task.nutrient_second_dose","stage":"stage.primary","trigger":"sg dropped ~1/3 from og toward fg (≈ og_points * 2/3) OR ~2–3 days after pitch","action":"Add the remaining half of the yeast nutrient (1/3 sugar break). Critical for RC212/BM4x4.","source":"additives#yeast-nutrient; process-sop"},
  {"id":"task.step_feed","stage":"stage.primary","trigger":"step_fed recipe AND sg fallen to ~1.010–1.020","action":"Add the next sugar increment (~3–4 oz/gal) for the dessert/port build.","source":"calculations-conversions#3-step-feeding; recipes#2,11"},
  {"id":"task.rack_gross_lees","stage":"stage.bulk_aging","trigger":"~3 weeks after pitch","action":"Rack off the gross lees; add ~25 ppm sulfite.","source":"process-sop#master-process-workflow; additives#sulfite"},
  {"id":"task.rack_fine_lees","stage":"stage.bulk_aging","trigger":"~2–3 months after pitch","action":"Rack off the fine lees; add ~25 ppm sulfite.","source":"process-sop; additives#sulfite"},
  {"id":"task.sulfite_topup","stage":"stage.bulk_aging","trigger":"every ~3 months during aging","action":"Check/top up free SO2 toward the pH target.","source":"additives#sulfite; calculations-conversions#canonical-constants"},
  {"id":"task.fg_stability_check","stage":"stage.secondary","trigger":"sg appears stable","action":"Take 2–3 SG readings over 2–3 days to confirm FG is stable before advancing.","source":"process-sop; computed.fg_stable"},
  {"id":"task.conditioning_done","stage":"stage.conditioning","trigger":"~2 weeks after priming","action":"Carbonation should be set — refrigerate the sparkling cider.","source":"recipes#8; process-sop#bottling-carbonation"},
  {"id":"task.drink_window","stage":"stage.cellaring","trigger":"bottled_at + fruit.aging_months_min reached","action":"Entering its drinking window — ready to taste; log tasting notes.","source":"fruit-profiles; reference-data (fruit.drink_window)"}
]
```

---

## Notes
- **Computed, not stored.** Derived values are calculated on read so they never go stale; only raw readings/events are persisted (Layer 2).
- **Formulas are owned by Calculations.** If a constant changes there, these `formula`/`source` references should be re-verified.
- **Warnings vs blocks.** Blocks protect against unrecoverable mistakes (bottle bombs, refermentation, geranium taint); warnings inform but allow an override the user can acknowledge.

## Cross-references
- **Layer 1:** reads `yeast.abv_tolerance`, `yeast.temp_*`, `fruit.ph_*`, `fruit.aging_months_min`, `recipe.step_fed`, `style`.
- **Layer 2:** operates on `readings`, `events`, `stage_history`, and writes `Batch.flags`.
- **Layer 3:** validations gate stage transitions; tasks attach to stages.
- **Calculations & Conversions:** canonical owner of every formula referenced here.
- **Troubleshooting:** warning messages link to the relevant fault entries.
