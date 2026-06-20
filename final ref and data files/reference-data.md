# Reference Data & ID Scheme — App Architecture (Layer 1)

**File:** Reference Data (App Layer 1 of 4)
**Purpose:** Machine-readable, ID'd versions of the knowledge catalogues so batches can reference them and the UI can populate pickers and auto-fill. This is the foundation the Batch Data Model (Layer 2), Lifecycle (Layer 3), and Rules (Layer 4) all link to.
**Status:** Living data. The prose catalogues remain canonical for *explanation*; this file is canonical for the *structured values and IDs*. Keep numeric values in sync with the source catalogues (each record carries a `ref`).

> **Note on layers:** Files 01–11 are the *knowledge* layer (human-readable). These four app-architecture files are the *data/logic* layer beneath the UI. The batch *records* themselves are runtime user data, not authored here — Layer 2 defines their schema.

---

## ID conventions

- Format: `<namespace>.<slug>` — lowercase, ASCII, words joined by `_`. Stable and never reused.
- Namespaces: `fruit` · `yeast` · `additive` · `recipe` · `equipment` · `stage` · `reading_type` · `event_type` · `style` · `unit` · `sourcing_channel` · `rule` · `task` · `computed`.
- Cross-references between records use the full ID (e.g., a recipe's `fruit_id: "fruit.sweet_cherry"`).
- `ref` fields deep-link to the prose source (`<file>#<anchor>`).

---

## Enumerations

```json
{
  "style": ["dry", "off_dry", "sweet_dessert", "sparkling"],
  "tannin_level": ["very_low", "low", "low_moderate", "moderate", "moderate_high", "high", "varies"],
  "pectin_level": ["low", "moderate", "moderate_high", "high", "present"],
  "nutrient_demand": ["low", "low_medium", "medium", "medium_high", "high"],
  "ferment_speed": ["slow", "moderate", "fast", "very_fast"],
  "unit": ["lb", "oz", "g", "kg", "gal", "L", "ml", "tsp", "tbsp", "ppm", "brix", "sg", "percent", "fahrenheit", "celsius", "months", "days"],
  "reading_type": ["og", "sg", "fg", "temperature", "ta", "ph", "free_so2", "volume", "abv"],
  "event_type": ["sanitize", "fruit_prep", "sugar_addition", "additive_addition", "pitch", "nutrient_addition", "punch_down", "racking", "pressing", "sulfite_addition", "stabilize", "back_sweeten", "fining", "priming", "bottling", "taste", "note"],
  "sourcing_channel": ["forage", "u_pick", "farmers_market", "grocery", "fresh_juice", "frozen", "online"]
}
```

---

## Fruits

**Fields:** `id` · `name` · `harvest_months` (int[]) · `peak_months` (int[]) · `extended_months` (int[]) · `brix_min/max` · `ta_min/max` (% tartaric) · `ph_min/max` · `tannin` · `pectin` · `fruit_lb_per_gal_min/max` (null = juice only) · `target_og_min/max` · `target_abv_min/max` · `recommended_yeast_ids` · `key_additive_ids` · `aging_months_min` · `drink_window` · `ref`

```json
[
  {"id":"fruit.sweet_cherry","name":"Sweet Cherry","harvest_months":[6,7],"peak_months":[7],"extended_months":[],"brix_min":14,"brix_max":20,"ta_min":0.45,"ta_max":0.60,"ph_min":3.7,"ph_max":4.0,"tannin":"moderate","pectin":"moderate_high","fruit_lb_per_gal_min":3,"fruit_lb_per_gal_max":4,"target_og_min":1.085,"target_og_max":1.095,"target_abv_min":11,"target_abv_max":12,"recommended_yeast_ids":["yeast.71b","yeast.rc212","yeast.ec1118"],"key_additive_ids":["additive.k_meta","additive.pectic_enzyme","additive.acid_blend","additive.yeast_nutrient"],"aging_months_min":6,"drink_window":"6-12 mo+","ref":"fruit-profiles#sweet-cherry"},
  {"id":"fruit.strawberry","name":"Strawberry","harvest_months":[5,6],"peak_months":[6],"extended_months":[7,8,9,10],"brix_min":7,"brix_max":9,"ta_min":0.6,"ta_max":0.9,"ph_min":3.3,"ph_max":3.5,"tannin":"very_low","pectin":"high","fruit_lb_per_gal_min":3,"fruit_lb_per_gal_max":4,"target_og_min":1.080,"target_og_max":1.085,"target_abv_min":10,"target_abv_max":11,"recommended_yeast_ids":["yeast.qa23","yeast.cote_des_blancs","yeast.71b"],"key_additive_ids":["additive.k_meta","additive.pectic_enzyme","additive.yeast_nutrient"],"aging_months_min":0,"drink_window":"3-6 mo (young)","ref":"fruit-profiles#strawberry"},
  {"id":"fruit.blueberry","name":"Blueberry","harvest_months":[7,8,9],"peak_months":[8],"extended_months":[],"brix_min":10,"brix_max":15,"ta_min":0.5,"ta_max":0.8,"ph_min":3.2,"ph_max":3.4,"tannin":"low_moderate","pectin":"high","fruit_lb_per_gal_min":2,"fruit_lb_per_gal_max":3,"target_og_min":1.085,"target_og_max":1.095,"target_abv_min":11,"target_abv_max":12,"recommended_yeast_ids":["yeast.rc212","yeast.bm4x4","yeast.71b"],"key_additive_ids":["additive.k_meta","additive.pectic_enzyme","additive.yeast_nutrient"],"aging_months_min":6,"drink_window":"6-12 mo+ (to 2 yr)","ref":"fruit-profiles#blueberry"},
  {"id":"fruit.apple_cider","name":"Apple (Cider)","harvest_months":[9,10,11],"peak_months":[10,11],"extended_months":[],"brix_min":11,"brix_max":15,"ta_min":null,"ta_max":null,"ph_min":3.3,"ph_max":3.8,"tannin":"varies","pectin":"present","fruit_lb_per_gal_min":null,"fruit_lb_per_gal_max":null,"target_og_min":1.050,"target_og_max":1.060,"target_abv_min":5,"target_abv_max":8,"recommended_yeast_ids":["yeast.m02","yeast.wlp775","yeast.ec1118","yeast.71b"],"key_additive_ids":["additive.k_meta","additive.yeast_nutrient","additive.pectic_enzyme"],"aging_months_min":1,"drink_window":"1-3 mo+","ref":"fruit-profiles#apple-hard-cider"},
  {"id":"fruit.blackberry","name":"Blackberry","harvest_months":[7,8,9],"peak_months":[8,9],"extended_months":[],"brix_min":8,"brix_max":12,"ta_min":0.8,"ta_max":1.2,"ph_min":3.0,"ph_max":3.4,"tannin":"moderate_high","pectin":"high","fruit_lb_per_gal_min":3,"fruit_lb_per_gal_max":4,"target_og_min":1.085,"target_og_max":1.095,"target_abv_min":11,"target_abv_max":13,"recommended_yeast_ids":["yeast.rc212","yeast.pasteur_red","yeast.71b","yeast.ec1118"],"key_additive_ids":["additive.k_meta","additive.pectic_enzyme","additive.yeast_nutrient"],"aging_months_min":6,"drink_window":"6-12 mo+ (to 2 yr)","ref":"fruit-profiles#blackberry"}
]
```

---

## Yeasts

**Fields:** `id` · `name` · `species` · `abv_tolerance` (%) · `temp_min/max` (°F) · `temp_opt_min/max` (°F) · `speed` · `attenuation` · `nutrient_demand` · `flavor` · `best_for_fruit_ids` · `ref`

```json
[
  {"id":"yeast.71b","name":"Lalvin 71B","species":"cerevisiae","abv_tolerance":14,"temp_min":59,"temp_max":86,"temp_opt_min":64,"temp_opt_max":77,"speed":"fast","attenuation":"dry","nutrient_demand":"low_medium","flavor":"fruit-forward, softens acid","best_for_fruit_ids":["fruit.sweet_cherry","fruit.strawberry","fruit.blueberry","fruit.blackberry","fruit.apple_cider"],"ref":"yeast-strains#lalvin-71b"},
  {"id":"yeast.rc212","name":"Lalvin RC212","species":"cerevisiae","abv_tolerance":16,"temp_min":59,"temp_max":86,"temp_opt_min":68,"temp_opt_max":86,"speed":"moderate","attenuation":"dry","nutrient_demand":"high","flavor":"color + tannin structure, respects fruit","best_for_fruit_ids":["fruit.blueberry","fruit.blackberry","fruit.sweet_cherry"],"ref":"yeast-strains#lalvin-rc212"},
  {"id":"yeast.ec1118","name":"Lalvin EC-1118","species":"bayanus","abv_tolerance":18,"temp_min":50,"temp_max":86,"temp_opt_min":59,"temp_opt_max":77,"speed":"very_fast","attenuation":"bone_dry","nutrient_demand":"low","flavor":"neutral/clean, killer factor","best_for_fruit_ids":["fruit.sweet_cherry","fruit.blackberry","fruit.apple_cider"],"ref":"yeast-strains#lalvin-ec-1118"},
  {"id":"yeast.bm4x4","name":"Lalvin BM4x4","species":"cerevisiae","abv_tolerance":16,"temp_min":64,"temp_max":86,"temp_opt_min":68,"temp_opt_max":82,"speed":"moderate","attenuation":"dry","nutrient_demand":"medium_high","flavor":"body, mouthfeel, color stability","best_for_fruit_ids":["fruit.blueberry","fruit.blackberry"],"ref":"yeast-strains#lalvin-bm4x4"},
  {"id":"yeast.pasteur_red","name":"Red Star Pasteur Red","species":"cerevisiae","abv_tolerance":15,"temp_min":64,"temp_max":86,"temp_opt_min":70,"temp_opt_max":85,"speed":"moderate","attenuation":"dry","nutrient_demand":"medium","flavor":"full-bodied reds, varietal character","best_for_fruit_ids":["fruit.blackberry","fruit.blueberry","fruit.sweet_cherry"],"ref":"yeast-strains#red-star-pasteur-red"},
  {"id":"yeast.qa23","name":"Lalvin QA23","species":"bayanus","abv_tolerance":16,"temp_min":50,"temp_max":68,"temp_opt_min":59,"temp_opt_max":68,"speed":"fast","attenuation":"dry","nutrient_demand":"low","flavor":"crisp, aromatic, cool-ferment","best_for_fruit_ids":["fruit.strawberry","fruit.apple_cider"],"ref":"yeast-strains#lalvin-qa23"},
  {"id":"yeast.cote_des_blancs","name":"Lalvin Côte des Blancs","species":"cerevisiae","abv_tolerance":14,"temp_min":50,"temp_max":68,"temp_opt_min":50,"temp_opt_max":68,"speed":"slow","attenuation":"can_finish_sweet","nutrient_demand":"low","flavor":"preserves delicate fruit, fruity","best_for_fruit_ids":["fruit.strawberry"],"ref":"yeast-strains#lalvin-cote-des-blancs"},
  {"id":"yeast.m02","name":"Mangrove Jack's M02","species":"cerevisiae","abv_tolerance":12,"temp_min":57,"temp_max":79,"temp_opt_min":64,"temp_opt_max":79,"speed":"moderate","attenuation":"medium_dry","nutrient_demand":"medium","flavor":"fresh, fruity, crisp cider","best_for_fruit_ids":["fruit.apple_cider"],"ref":"yeast-strains#mangrove-jacks-m02-cider"},
  {"id":"yeast.wlp775","name":"White Labs WLP775","species":"cerevisiae","abv_tolerance":12,"temp_min":68,"temp_max":75,"temp_opt_min":68,"temp_opt_max":75,"speed":"moderate","attenuation":"medium_dry","nutrient_demand":"medium","flavor":"classic medium-dry English cider","best_for_fruit_ids":["fruit.apple_cider"],"ref":"yeast-strains#white-labs-wlp775-english-cider"}
]
```

---

## Additives

**Fields:** `id` · `name` · `function` · `dose_per_gal` · `stage` (when added) · `unit_note` · `ref`

```json
[
  {"id":"additive.k_meta","name":"Sulfite (Campden / K-meta)","function":"antimicrobial + antioxidant","dose_per_gal":"~50 ppm (1 tablet); ~25 ppm racking","stage":"must_prep, racking, bottling","unit_note":"dechlor ~1 tab/20 gal; sanitizing ~2 oz/gal are separate uses","ref":"additives#sulfite"},
  {"id":"additive.pectic_enzyme","name":"Pectic Enzyme","function":"break down pectin; yield, color, anti-haze","dose_per_gal":"~1/2 tsp","stage":"must_prep","unit_note":"add pre-ferment","ref":"additives#pectic-enzyme"},
  {"id":"additive.rehydration_nutrient","name":"Rehydration Nutrient (GoFerm-type)","function":"strong yeast start","dose_per_gal":"1.25 g per 1 g yeast","stage":"pitch (in rehydration water)","unit_note":"not a must nitrogen source","ref":"additives#rehydration-nutrient"},
  {"id":"additive.yeast_nutrient","name":"Yeast Nutrient","function":"nitrogen + micronutrients","dose_per_gal":"~1 tsp total, staged","stage":"pitch + 1/3 break","unit_note":"split dose","ref":"additives#yeast-nutrient"},
  {"id":"additive.yeast_energizer","name":"Yeast Energizer","function":"wake/restart sluggish ferment","dose_per_gal":"~1/2 tsp","stage":"sluggish/stuck or tough musts","unit_note":"","ref":"additives#yeast-energizer"},
  {"id":"additive.acid_blend","name":"Acid Blend","function":"raise TA","dose_per_gal":"~1 tsp ≈ +0.1% TA","stage":"pre-ferment; fine-tune at end","unit_note":"confirm by titration","ref":"additives#acid-blend"},
  {"id":"additive.acid_reducer","name":"Acid Reducer","function":"lower TA","dose_per_gal":"per kit, small increments","stage":"post-ferment","unit_note":"potassium bicarbonate","ref":"additives#acid-reducer"},
  {"id":"additive.wine_tannin","name":"Wine Tannin","function":"structure, mouthfeel, color","dose_per_gal":"~1/4-1/2 tsp","stage":"pre-ferment or aging","unit_note":"skip for blackberry","ref":"additives#wine-tannin"},
  {"id":"additive.fermentable_sugar","name":"Fermentable Sugar","function":"raise OG / ABV","dose_per_gal":"~1 lb ≈ +0.045 SG","stage":"pre-ferment to OG; step-feed for high ABV","unit_note":"cane sugar default","ref":"additives#fermentable-sugar"},
  {"id":"additive.potassium_sorbate","name":"Potassium Sorbate","function":"stabilize vs refermentation","dose_per_gal":"~1/2 tsp","stage":"stabilizing (with sulfite) only","unit_note":"never during ferment; never with bottle-conditioning","ref":"additives#potassium-sorbate"},
  {"id":"additive.finings","name":"Finings","function":"drop haze","dose_per_gal":"per package","stage":"clearing","unit_note":"bentonite / Sparkolloid / kieselsol+chitosan / gelatin","ref":"additives#finings"}
]
```

---

## Recipes

**Fields:** `id` · `number` · `name` · `fruit_id` · `style` · `yeast_ids` · `target_og` · `target_fg` · `target_abv_min/max` · `fruit_lb_per_gal` (null = juice) · `ferment_temp_min/max` (°F) · `step_fed` (bool) · `back_sweetened` (bool) · `sparkling` (bool) · `drink_window` · `ref`

```json
[
  {"id":"recipe.cherry_table","number":1,"name":"Sweet Cherry Table Wine","fruit_id":"fruit.sweet_cherry","style":"dry","yeast_ids":["yeast.71b"],"target_og":1.090,"target_fg":0.995,"target_abv_min":12,"target_abv_max":12,"fruit_lb_per_gal":3.5,"ferment_temp_min":65,"ferment_temp_max":72,"step_fed":false,"back_sweetened":false,"sparkling":false,"drink_window":"6-12 mo+","ref":"recipes#1-sweet-cherry-table-wine"},
  {"id":"recipe.cherry_dessert","number":2,"name":"Sweet Cherry Dessert (Port-Style)","fruit_id":"fruit.sweet_cherry","style":"sweet_dessert","yeast_ids":["yeast.ec1118"],"target_og":1.100,"target_fg":null,"target_abv_min":17,"target_abv_max":18,"fruit_lb_per_gal":4,"ferment_temp_min":68,"ferment_temp_max":75,"step_fed":true,"back_sweetened":true,"sparkling":false,"drink_window":"1 yr+","ref":"recipes#2-sweet-cherry-dessert-port-style"},
  {"id":"recipe.strawberry_light","number":3,"name":"Light Strawberry Wine","fruit_id":"fruit.strawberry","style":"off_dry","yeast_ids":["yeast.qa23","yeast.cote_des_blancs"],"target_og":1.082,"target_fg":0.995,"target_abv_min":10,"target_abv_max":11,"fruit_lb_per_gal":3.75,"ferment_temp_min":60,"ferment_temp_max":68,"step_fed":false,"back_sweetened":false,"sparkling":false,"drink_window":"3-6 mo","ref":"recipes#3-light-strawberry-wine"},
  {"id":"recipe.strawberry_rhubarb","number":4,"name":"Strawberry-Rhubarb Wine","fruit_id":"fruit.strawberry","style":"off_dry","yeast_ids":["yeast.qa23"],"target_og":1.085,"target_fg":0.995,"target_abv_min":10,"target_abv_max":11,"fruit_lb_per_gal":4,"ferment_temp_min":60,"ferment_temp_max":68,"step_fed":false,"back_sweetened":false,"sparkling":false,"drink_window":"3-9 mo","ref":"recipes#4-strawberry-rhubarb-wine"},
  {"id":"recipe.blueberry_dry","number":5,"name":"Blueberry Dry Red-Style","fruit_id":"fruit.blueberry","style":"dry","yeast_ids":["yeast.rc212"],"target_og":1.090,"target_fg":0.995,"target_abv_min":12,"target_abv_max":12,"fruit_lb_per_gal":2.75,"ferment_temp_min":68,"ferment_temp_max":74,"step_fed":false,"back_sweetened":false,"sparkling":false,"drink_window":"6-12 mo+","ref":"recipes#5-blueberry-dry-red-style"},
  {"id":"recipe.blueberry_offdry","number":6,"name":"Blueberry Off-Dry","fruit_id":"fruit.blueberry","style":"off_dry","yeast_ids":["yeast.71b"],"target_og":1.088,"target_fg":0.995,"target_abv_min":11,"target_abv_max":12,"fruit_lb_per_gal":2.75,"ferment_temp_min":64,"ferment_temp_max":74,"step_fed":false,"back_sweetened":true,"sparkling":false,"drink_window":"within ~1 yr","ref":"recipes#6-blueberry-off-dry"},
  {"id":"recipe.cider_dry","number":7,"name":"Traditional Dry Hard Cider","fruit_id":"fruit.apple_cider","style":"dry","yeast_ids":["yeast.m02","yeast.ec1118"],"target_og":1.050,"target_fg":0.999,"target_abv_min":6,"target_abv_max":7,"fruit_lb_per_gal":null,"ferment_temp_min":60,"ferment_temp_max":68,"step_fed":false,"back_sweetened":false,"sparkling":false,"drink_window":"1-3 mo+","ref":"recipes#7-traditional-dry-hard-cider"},
  {"id":"recipe.cider_sparkling","number":8,"name":"Sparkling Bottle-Conditioned Cider","fruit_id":"fruit.apple_cider","style":"sparkling","yeast_ids":["yeast.m02","yeast.ec1118"],"target_og":1.050,"target_fg":0.999,"target_abv_min":6,"target_abv_max":7,"fruit_lb_per_gal":null,"ferment_temp_min":60,"ferment_temp_max":68,"step_fed":false,"back_sweetened":false,"sparkling":true,"drink_window":"1-3 mo+","ref":"recipes#8-sparkling-bottle-conditioned-cider"},
  {"id":"recipe.apple_wine","number":9,"name":"Apple Wine","fruit_id":"fruit.apple_cider","style":"dry","yeast_ids":["yeast.71b","yeast.ec1118"],"target_og":1.088,"target_fg":0.995,"target_abv_min":11,"target_abv_max":12,"fruit_lb_per_gal":null,"ferment_temp_min":64,"ferment_temp_max":72,"step_fed":false,"back_sweetened":false,"sparkling":false,"drink_window":"6-12 mo","ref":"recipes#9-apple-wine"},
  {"id":"recipe.blackberry_dry","number":10,"name":"Blackberry Dry Red-Style","fruit_id":"fruit.blackberry","style":"dry","yeast_ids":["yeast.rc212","yeast.pasteur_red"],"target_og":1.090,"target_fg":0.995,"target_abv_min":12,"target_abv_max":13,"fruit_lb_per_gal":3.75,"ferment_temp_min":68,"ferment_temp_max":74,"step_fed":false,"back_sweetened":false,"sparkling":false,"drink_window":"6-12 mo+","ref":"recipes#10-blackberry-dry-red-style"},
  {"id":"recipe.blackberry_dessert","number":11,"name":"Blackberry Dessert (Port-Style)","fruit_id":"fruit.blackberry","style":"sweet_dessert","yeast_ids":["yeast.ec1118"],"target_og":1.100,"target_fg":null,"target_abv_min":17,"target_abv_max":17,"fruit_lb_per_gal":4,"ferment_temp_min":68,"ferment_temp_max":75,"step_fed":true,"back_sweetened":true,"sparkling":false,"drink_window":"1 yr+","ref":"recipes#11-blackberry-dessert-port-style"}
]
```

---

## Equipment (picker list)

**Fields:** `id` · `name` · `category` · `required` (bool) · `ref`

```json
[
  {"id":"equipment.primary_fermenter","name":"Primary fermenter (bucket)","category":"vessel","required":true,"ref":"equipment#fermentation-vessels"},
  {"id":"equipment.carboy","name":"Secondary carboy / jug","category":"vessel","required":true,"ref":"equipment#fermentation-vessels"},
  {"id":"equipment.airlock","name":"Airlock + bung/lid","category":"vessel","required":true,"ref":"equipment#airlocks-bungs-lids"},
  {"id":"equipment.straining_bag","name":"Straining bag","category":"prep","required":true,"ref":"equipment#fruit-prep-tools"},
  {"id":"equipment.scale","name":"Kitchen/bench scale","category":"prep","required":true,"ref":"equipment#fruit-prep-tools"},
  {"id":"equipment.press","name":"Fruit press","category":"prep","required":false,"ref":"equipment#fruit-prep-tools"},
  {"id":"equipment.auto_siphon","name":"Auto-siphon + tubing","category":"transfer","required":true,"ref":"equipment#transfer-racking"},
  {"id":"equipment.hydrometer","name":"Hydrometer + test jar","category":"measurement","required":true,"ref":"equipment#measurement-instruments"},
  {"id":"equipment.acid_kit","name":"Acid test kit","category":"measurement","required":true,"ref":"equipment#measurement-instruments"},
  {"id":"equipment.ph_meter","name":"pH meter + buffers","category":"measurement","required":false,"ref":"equipment#measurement-instruments"},
  {"id":"equipment.thermometer","name":"Thermometer","category":"measurement","required":true,"ref":"equipment#measurement-instruments"},
  {"id":"equipment.bottles","name":"Bottles + closures","category":"bottling","required":true,"ref":"equipment#bottling-closures"}
]
```

---

## Cross-references
- **Layer 2 (Data Model):** batch records reference `fruit_id`, `yeast_id`, `recipe_id`, `additive_id`, `equipment_id` from here.
- **Layer 3 (Lifecycle):** uses `stage`, `reading_type`, and `event_type` enumerations defined here.
- **Layer 4 (Rules):** reads typed fields here (e.g., `yeast.abv_tolerance`, `fruit.ph_*`, `recipe.target_*`) to compute and validate.
- **Knowledge catalogues:** every record's `ref` deep-links to the prose source, which remains canonical for explanation.
