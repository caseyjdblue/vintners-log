# Seasonal & Sourcing Calendar — Winemaking Reference Catalogue

**Catalogue:** Seasonal & Sourcing Calendar (Reference File 11)
**Region:** Pacific Northwest, western Washington
**Scope of this edition:** When each fruit is available and where to source it, structured so a UI can render a seasonal calendar directly. Harvest windows mirror the Fruit Profiles catalogue (canonical for those windows).
**Status:** Living document — refine from local seasons and your own sourcing.

---

## How to use this file

This file is shaped for the **calendar UI**, not just for reading: it defines a per-fruit data schema, gives the records in that schema, and provides a month-by-month matrix the UI can map straight onto a calendar. Harvest windows are **mirrored from Fruit Profiles** — if a window changes, change it there first (canonical) and update here.

> **Sync note:** harvest windows here must match **Fruit Profiles** (canonical). Months use numbers 1–12 for UI convenience.

---

## Data schema

Each fruit record carries these fields (UI contract):

- `fruit` — display name
- `season_start` / `season_end` — first/last month of fresh local availability (1–12)
- `peak` — peak month(s)
- `fresh_months` — array of months fresh locally
- `extended_months` — array for everbearing/extended availability (or empty)
- `sourcing` — array of channels: `forage` · `u_pick` · `farmers_market` · `grocery` · `fresh_juice` · `frozen` · `online`
- `buy_ahead` — guidance for the off-season (freeze, etc.)
- `prep_note` — pre-use prep tied to the recipes

**Example record (JSON):**

```json
{
  "fruit": "Blueberry",
  "season_start": 7,
  "season_end": 9,
  "peak": [8],
  "fresh_months": [7, 8, 9],
  "extended_months": [],
  "sourcing": ["u_pick", "farmers_market", "grocery", "frozen"],
  "buy_ahead": "Freezes very well and cheaply year-round; freezing also improves the wine.",
  "prep_note": "Freeze then thaw before fermenting to break cells and release color."
}
```

---

## Fruit records

| Fruit | Start | End | Peak | Fresh months | Extended | Sourcing | Prep note |
|---|---|---|---|---|---|---|---|
| **Sweet cherry** | 6 (late) | 7 | early–mid Jul | 6, 7 | — | u_pick, farmers_market, grocery, frozen | Short season — freeze if not fermenting now; pit, don't crush pits |
| **Strawberry** | 5 (late) | 6 | Jun | 5, 6 | 7, 8, 9, 10 (everbearing) | u_pick, farmers_market, grocery, frozen | Use dead-ripe; ferment cool; drink young |
| **Blueberry** | 7 | 9 | Aug | 7, 8, 9 | — | u_pick, farmers_market, grocery, frozen | Freeze/thaw before fermenting |
| **Apple (cider)** | 9 | 11 | Oct–Nov | 9, 10, 11 | — | u_pick, farm_stand, fresh_juice, grocery | Use **preservative-free** fresh-pressed juice; blend varieties |
| **Blackberry** | 7 (late) | 9 | Aug–Sep | 7, 8, 9 | — | forage, u_pick, farmers_market, frozen | Forage Himalayan (wash; avoid sprayed/roadside); freeze/thaw; don't crush seeds |

---

## Month-by-month availability (western WA)

For the calendar grid — which fruits are fresh locally each month.

| Month | Fresh & in season | Notes |
|---|---|---|
| Jan | — | Use frozen/stored fruit; supplies year-round |
| Feb | — | — |
| Mar | — | — |
| Apr | — | — |
| May | Strawberry (late) | Main strawberry season starting |
| Jun | Strawberry (peak), Sweet cherry (late Jun) | — |
| Jul | Sweet cherry (peak), Blueberry, Blackberry (late), Strawberry (everbearing) | Busiest fresh month begins |
| Aug | Blueberry (peak), Blackberry (peak), Strawberry (everbearing) | Berry peak |
| Sep | Blueberry (late), Blackberry (late), Apple (start), Strawberry (everbearing) | Transition to apples |
| Oct | Apple (peak), Strawberry (everbearing, to frost) | Cider pressing season |
| Nov | Apple (late) | Last fresh fruit |
| Dec | — | Use frozen/stored |

---

## Sourcing channels

**Fruit**
- **Forage** — Himalayan blackberry is free and ubiquitous in western WA (wash well; avoid sprayed or roadside patches).
- **U-pick / farm stands** — cherries, strawberries (Hood/Shuksan), blueberries (abundant locally), cultivated blackberries (Marionberry/Boysenberry), and cider/dessert apples.
- **Farmers markets** — all five in season; good for variety and ripeness.
- **Grocery** — in season for all; for cider, only **preservative-free** juice will ferment.
- **Fresh-pressed juice** — orchards/cideries in fall for cider; confirm no potassium sorbate/benzoate.
- **Frozen** — cherries, strawberries, blueberries, blackberries available year-round; freezing berries also improves the wine, so frozen is a legitimate primary source, not just a fallback.

**Supplies (year-round, not seasonal)**
- **Yeast, additives, equipment** — local homebrew shops or online; available all year. Buy **yeast fresh** and check dates.
- **The one seasonal supply constraint is fresh-pressed cider juice** (fall only) — plan cider for fall, or freeze juice for later batches.

---

## Buy-ahead & freezing guidance

- **Cherry:** shortest window (a few weeks in late Jun–Jul) — buy and **freeze** to ferment later.
- **Berries (blueberry, blackberry, strawberry):** freeze freely; for blueberry/blackberry the freeze/thaw step is a *recipe benefit* (cell breakdown, color). Strawberry still drinks best young regardless.
- **Apple/cider:** fresh-pressed juice is fall-only; freeze juice if you want to brew cider off-season.
- **Off-season (Dec–Apr):** brew from frozen fruit; all supplies remain available.

---

## Cross-references
- **Fruit Profiles:** canonical source of harvest windows, ripeness, and prep cautions mirrored here.
- **Recipes:** the freeze/thaw and preservative-free-juice prep notes tie to the recipe methods.
- **Equipment:** a fruit press matters mainly for fall cider pressing.
