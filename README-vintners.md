# Vintner's Log 🍷

A personal wine batch lifecycle manager built for home winemakers. Track every stage from fruit selection through bottling and aging — all in your browser, no server required.

## Files

| File | Purpose |
|---|---|
| `wine.html` | The main app — open this in any browser |
| `wine-core.js` | Shared logic library (data layer, utilities) |
| `wine-tests.html` | Unit test runner — open to run 80 tests |

## How to Use

1. Download all three files into the same folder
2. Open `wine.html` in any browser
3. Your first batch — **Backyard Sweet Cherry 2026** — is pre-loaded

> All data is stored in your browser's localStorage. Nothing is sent to any server.

## Lifecycle Stages

```
🍒 Fruit Selection → 📋 Methodology → 🧪 Recipe → ⚗️ Preparation
→ 🫧 Primary Fermentation → 🔬 Secondary Fermentation → ✨ Clarification
→ 🍾 Bottling → 🪵 Aging
```

## First Batch: Backyard Sweet Cherry 2026

- **Trees blossomed:** April 11, 2026
- **Estimated harvest:** ~June 20, 2026
- **Planned batch size:** 3 gallons
- **Recommended yeast:** Lalvin 71B (preserves cherry fruit aromas)

## Running Tests

Open `wine-tests.html` in any browser and click **Run All Tests**.
All 3 files must be in the same folder for tests to work.
