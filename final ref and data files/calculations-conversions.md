# Calculations & Conversions — Winemaking Reference Catalogue

**Catalogue:** Calculations & Conversions (Reference File 08)
**Scope of this edition:** The canonical home for every formula and constant used across the knowledge base — ABV, sugar/chaptalization, Brix, acid, sulfite, priming, scaling, yeast pitch, vessel/bottle math — plus unit-conversion tables. Each calculator is specified input → formula → output for direct UI use.
**Status:** Living document — this file is the **single source of truth** for the math; if a constant changes, change it here and propagate to the files that cite it.

---

## How to use this file

Other catalogues *apply* these numbers in context; this file *defines* them. When the UI builds calculators, wire them to the specs here so there's one authoritative implementation. Two standing rules carry over from the rest of the base: **measure, don't guess** (use the hydrometer, acid kit, and pH meter rather than trusting recipe amounts), and **confirm FG is stable** over 2–3 days before any bottling math.

### Conventions
- All per-volume figures are **per US gallon** unless noted; scale linearly (see Batch scaling).
- "Points" = SG × 1000 above 1.000 (e.g., 1.045 = 45 points).
- Constants below are the values used throughout the base — verified consistent at build time.

---

## Canonical constants

| Constant | Value | Cited by |
|---|---|---|
| **ABV factor** | `ABV ≈ (OG − FG) × 131.25` | Fruit, SOP, Equipment, Recipes |
| **Sugar → gravity** | ~**45 points** (≈ +0.045 SG) per lb cane/sucrose per gal | Fruit, Additives, Recipes |
| **Brix → gravity** | **1 °Bx ≈ 4 SG points** (≈ +0.004 SG) | (defined here) |
| **Potential alcohol** | ≈ **Brix × 0.55–0.59** = %ABV (rough) | (defined here) |
| **Acid (practical)** | ~1 tsp acid blend per gal ≈ **+0.1% TA** (approx) | Additives, Fruit, Recipes |
| **Acid (by weight)** | **1 g/L tartaric = +0.1% TA** | (defined here) |
| **Sulfite — must/bottling** | 1 campden tablet ≈ 1/16 tsp K-meta ≈ **~50 ppm**/gal | Additives, SOP, Recipes, Sanitation |
| **Sulfite — racking** | **~25 ppm** maintenance | Additives, SOP, Recipes |
| **Sulfite — dechlorination** | **~1 campden tablet per ~20 gal** | SOP, Sanitation |
| **Sulfite — sanitizing solution** | **~2 oz K-meta per gal** | Sanitation |
| **Free SO₂ by pH** (to hold ~0.8 ppm molecular) | 3.0→13 · 3.2→22 · 3.4→35 · 3.6→56 · 3.8→90 · 4.0→140 ppm | Additives, SOP |
| **Priming sugar** | ~**1 oz (28 g) dextrose per gal** ≈ 2.2–2.5 vol CO₂ | SOP, Recipes |
| **Yeast pitch** | 1 × **5 g sachet ≈ 5 gal** | Yeast, Equipment |
| **Rehydration nutrient** | **1.25 g per 1 g yeast** | Yeast, Additives, Equipment |
| **Rehydration temp** | **~104°F / 40°C** | Yeast, Additives, SOP, Equipment |
| **Primary vessel** | **~1.3× batch volume** | SOP, Equipment |
| **Bottle yield** | 1 gal ≈ **5 × 750 mL** (5 gal ≈ ~25; ~23–24 after lees loss) | Equipment |

---

## Calculators

### 1 — ABV
- **Inputs:** OG, FG
- **Formula:** `ABV% = (OG − FG) × 131.25`
- **Output:** % alcohol by volume
- **Example:** OG 1.090, FG 0.995 → (0.095) × 131.25 ≈ **12.5%**

### 2 — Sugar addition (chaptalization)
- **Inputs:** current SG, target OG, batch volume (gal)
- **Formula:** `sugar (lb) = ((target_points − current_points) ÷ 45) × gallons`
- **Output:** pounds of cane sugar to add (add gradually, re-measure)
- **Example:** current 1.040 (40 pts), target 1.090 (90 pts), 1 gal → (50 ÷ 45) ≈ **1.1 lb/gal** (×5 = ~5.5 lb for 5 gal)

### 3 — Step-feeding (high-ABV dessert/port)
- **Inputs:** target OG (high), yeast tolerance
- **Method:** set an initial OG (~1.100), then as gravity falls to ~1.010–1.020 add ~**3–4 oz sugar/gal** dissolved, in 2–3 additions, until the ferment slows near the yeast's tolerance (EC-1118 ~18%). Avoids osmotic shock from one large charge.
- **Output:** staged sugar schedule

### 4 — Brix ↔ SG ↔ potential alcohol
- **Inputs:** Brix (fresh fruit/juice) *or* SG
- **Formulas:** `SG ≈ 1 + (Brix × 0.004)` · `Brix ≈ (SG_points) ÷ 4` · `potential ABV ≈ Brix × 0.55–0.59`
- **Output:** approximate SG and potential alcohol
- **Example:** 22 °Bx → SG ≈ 1.088, potential ABV ≈ ~12%. *(Refractometers read Brix accurately only* **before** *fermentation — use the hydrometer for FG.)*

### 5 — Acid adjustment
- **Raise TA:** `acid blend (tsp) ≈ desired_increase(% ) ÷ 0.1 × gallons` (practical), or by weight `tartaric (g) = desired_increase(%) × 10 × liters` (since 1 g/L = +0.1%).
- **Lower TA:** add acid reducer (potassium bicarbonate) in small increments; cold-stabilizing also drops some tartaric.
- **Output:** acid (or reducer) to add — **always confirm by titration**
- **Example:** raise 1 gal from 0.45% to 0.60% TA = +0.15% → ~1.5 tsp acid blend (matches the cherry recipe)

### 6 — Sulfite dosing
- **Inputs:** wine pH, batch volume, stage
- **Method:** target the **free SO₂ for your pH** (constants table). Practical dosing: 1 campden tablet (≈1/16 tsp K-meta) per gallon ≈ ~50 ppm; ~25 ppm at racking. Tablets/powders vary, so **a free-SO₂ test is the real check**, especially at high pH (sweet cherry needs far more than blackberry).
- **Output:** sulfite to add per stage
- *Three distinct sulfite uses (don't confuse): dechlorination ~1 tab/20 gal · must/aging/bottling ~50/25 ppm · sanitizing ~2 oz/gal.*

### 7 — Priming sugar (sparkling)
- **Inputs:** batch volume
- **Formula:** `dextrose (oz) = 1 oz × gallons` (≈ 2.2–2.5 vol CO₂)
- **Output:** priming sugar; mix evenly, **pressure-rated bottles only**, never with sorbate
- **Example:** 5 gal → ~5 oz (~140 g) dextrose

### 8 — Batch scaling
- **Inputs:** per-gallon recipe, target gallons (N)
- **Method:** **multiply linearly** — fruit, sugar, water, acid, tannin, nutrient, sulfite, pectic enzyme, sorbate, priming all × N. **Do NOT scale** OG/TA/pH (concentrations) or process timings.
- **Output:** scaled ingredient list

### 9 — Yeast pitch & rehydration nutrient
- **Inputs:** batch volume, yeast weight
- **Method:** 1 × 5 g dry sachet per ~5 gal (multiple sachets/starter beyond that); rehydration nutrient = **1.25 g per 1 g yeast** in **~104°F** water.
- **Output:** sachet count + rehydration nutrient amount
- **Example:** 5 g yeast → ~6.25 g rehydration nutrient

### 10 — Vessel sizing & bottle yield
- **Inputs:** batch volume
- **Formulas:** `primary vessel ≥ 1.3 × batch` · `750 mL bottles ≈ 5 × gallons` (expect ~23–24 for a 5-gal batch after lees loss)
- **Output:** primary vessel size and bottle count

---

## Unit conversions

**Volume**

| | mL | L | fl oz | cup | qt | gal |
|---|---|---|---|---|---|---|
| 1 gal | 3785 | 3.785 | 128 | 16 | 4 | 1 |
| 1 qt | 946 | 0.946 | 32 | 4 | 1 | 0.25 |
| 1 cup | 237 | 0.237 | 8 | 1 | — | — |
| 1 fl oz | 29.6 | — | 1 | — | — | — |

**Weight**

| | g | oz | lb | kg |
|---|---|---|---|---|
| 1 lb | 454 | 16 | 1 | 0.454 |
| 1 oz | 28.35 | 1 | 0.0625 | — |
| 1 kg | 1000 | 35.3 | 2.2 | 1 |

**Small measures**

| | mL | tsp | tbsp |
|---|---|---|---|
| 1 tbsp | 14.8 | 3 | 1 |
| 1 tsp | 4.93 | 1 | 0.33 |

**Temperature** — `°C = (°F − 32) × 5/9` · `°F = (°C × 9/5) + 32`

| Reference | °F | °C |
|---|---|---|
| Yeast rehydration | 104 | 40 |
| Warm-red ferment | ~70–75 | ~21–24 |
| Cool/aroma ferment | ~60–68 | ~16–20 |
| Cellar/aging | ~55–60 | ~13–16 |

**Gravity / Brix quick reference**

| SG | Points | ≈ Brix | ≈ Potential ABV |
|---|---|---|---|
| 1.040 | 40 | 10 | ~5.5% |
| 1.050 | 50 | 12.5 | ~6.5% |
| 1.090 | 90 | 22 | ~12% |
| 1.100 | 100 | 24 | ~13% |
| 1.110 | 110 | 27 | ~14.5% |

---

## Cross-references

- **Fruit Profiles / Recipes:** OG, ABV, sugar, and acid targets are computed with the constants above.
- **Additives:** sulfite doses, the free-SO₂-by-pH table, and acid math live here as the authoritative version; Additives applies them in the schedule.
- **Yeast Strains / Equipment:** pitch rate, rehydration nutrient/temp, vessel sizing, and bottle yield.
- **Process & SOP:** measurement procedures use the ABV, Brix, and sulfite math; Scaling uses calculator 8.

> **Consistency:** the constants here were verified equal to every value used across the other catalogues at build time. Treat this file as canonical — update a number here and propagate, then re-run the regression check.
