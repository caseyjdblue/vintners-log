# Fruit Wine App UI Brief for Claude

## Product Vision
Build a modern, approachable, premium fruit wine app that feels like a bespoke winemaking companion rather than generic production software. The app should support discovery, recipe creation, batch tracking, lab-style readings, inventory, and task management in one seamless experience.

The desired visual direction is:

**Apple-style artisan design + softened vineyard luxury + practical winemaker command center.**

The interface should be light, warm, elegant, and highly usable. It should feel premium but not intimidating.

Use the included image `ui_reference_soft_artisan.png` as the primary visual reference.

---

## Overall Style

### Mood
- Soft, bright, premium, inviting
- Clean and modern
- Consumer-grade polish
- Subtle winery/artisan character
- Friendly enough for hobbyists, structured enough for serious users

### Avoid
- Heavy dark-mode luxury as the default
- Enterprise dashboard stiffness
- Overly rustic farm/winery clichés
- Dense tables as the primary UI pattern
- Generic Bootstrap/admin-panel appearance

---

## Visual Language

### Backgrounds
Use a warm off-white base, not pure white.

Recommended background:
- `#FBF7F2` warm cream
- `#FFFDFC` card interiors
- optional soft gradient: `#FBF7F2 → #F7EEF6`

### Primary Color
Use a refined berry-purple as the main brand color.

- Primary: `#A8459F`
- Primary dark: `#7A2D73`
- Primary soft: `#EBD6E9`
- Primary pale: `#F7EEF6`

### Accent Colors
Use accents sparingly for status and fruit identity.

- Gold: `#D8A13A`
- Blackberry: `#5D2A68`
- Cherry: `#B93A50`
- Blueberry: `#4557A5`
- Strawberry: `#D9576A`
- Green success: `#3E8F62`
- Amber warning: `#D48A21`
- Red alert: `#CC4B4B`

### Typography
Use a clean sans-serif for most UI text and a refined serif only for hero titles or recipe names.

Suggested pairing:
- UI font: Inter, SF Pro, Avenir, or system sans-serif
- Display font: Cormorant Garamond, Playfair Display, or a restrained serif

Rules:
- Body text should remain highly readable.
- Serif should be used selectively for wine names, fruit profile titles, or large feature cards.
- Avoid overly decorative fonts.

### Corners and Surfaces
- Cards: 16–22px radius
- Buttons: 14–18px radius
- Bottom nav: soft floating or clean fixed navigation
- Use thin borders instead of heavy shadows
- Subtle shadows only: soft, diffuse, low opacity

### Imagery
Use fruit and wine photography generously, but not everywhere.

Best use cases:
- Home hero image
- Batch hero header
- Fruit profile card
- Recipe hero card
- Inventory thumbnails

Images should use soft fades or overlays so text remains readable.

---

## Navigation Model

Primary bottom navigation:
1. Home
2. Batches
3. Add / Quick Action
4. Recipes
5. More

The center Add button should be visually prominent and circular.

Primary app areas:
- Home Dashboard
- Batch Management
- Fruit Library
- Recipe Studio
- Inventory
- Lab Bench
- Tasks
- Reports / Insights
- Settings

Quick Access cards on the Home screen should expose key areas:
- Fruit Library
- Recipe Studio
- Inventory
- Lab Bench

---

## Core Screens to Build

### 1. Home Dashboard
Purpose: Give users immediate confidence about what needs attention.

Key sections:
- Greeting
- At a Glance summary
- Active Batches count
- Today's Tasks count
- Featured active batch card
- Quick Access cards
- Fermentation Timeline

Example content:
- Greeting: “Hi, Casey!”
- Subtext: “Let’s make something extraordinary today.”
- Active Batches: 8
- Today’s Tasks: 5
- Featured batch: Blackberry Reserve
- Batch status: Fermentation
- Completion: 65%
- Day: 17
- SG: 1.024

Design notes:
- Use a soft vineyard/fruit hero image at the top.
- Cards should feel tactile but light.
- Keep the data visible but not overwhelming.

---

### 2. Batch Detail Screen
Purpose: Track the status and progress of an active wine batch.

Header:
- Batch number
- Batch name
- Status pill
- Start date
- Current phase
- Hero image

Metrics:
- Day number
- Specific gravity
- Temperature

Tabs:
- Overview
- Graphs
- Notes
- Actions

Primary chart:
- Specific Gravity over time
- Use a simple line chart
- Purple line, subtle grid

Primary actions:
- Add Reading
- Add Note

Example data:
- Batch: Blackberry Reserve
- Batch #: 2026-014
- Status: Fermenting
- Started: May 5, 2025
- Phase: Primary Fermentation
- Day: 17 of ~26
- SG: 1.024, down 0.006
- Temp: 68.4°F, Stable

---

### 3. Fruit Library Screen
Purpose: Help users understand ingredients and choose fruit for recipes.

Header:
- Fruit image card
- Fruit name
- Scientific name
- Popular/favorite indicators

Tabs:
- Overview
- Flavor
- Winemaking
- Pairings

Profile metrics:
- Acidity
- Sugar
- Tannin
- Pectin

Example fruit profile:
- Fruit: Blackberry
- Scientific name: Rubus fruticosus
- Acidity: High
- Sugar: Medium
- Tannin: Medium
- Pectin: High

Supporting content:
- Flavor description
- Winemaking notes
- Recommended yeast
- Common issues
- Popular recipes using this fruit

---

### 4. Recipe Detail Screen
Purpose: Present a recipe in a premium but practical format.

Header:
- Recipe hero image
- Recipe name
- Rating
- Premium/featured pill

Tabs:
- Overview
- Ingredients
- Process
- Notes

Overview cards:
- Batch size
- Body
- Aging recommendation

Ingredients list:
- Fruit
- Sugar
- Pectic enzyme
- Yeast
- Tannin
- Acid blend if applicable

Primary CTA:
- View Full Recipe
- Start Batch from Recipe

Example recipe:
- Blackberry Merlot Style
- Rating: 4.8
- Batch size: 5.5 gal
- Body: Medium
- Age: 12–18 months

---

### 5. Inventory Screen
Purpose: Make ingredients and supplies easy to track.

Top controls:
- Search inventory
- Filter icon
- Category chips

Categories:
- All
- Fruit
- Yeast
- Additives
- Equipment

Inventory item card:
- Thumbnail
- Item name
- Quantity detail
- Unit/count at right

Example items:
- Blackberries (Frozen), 32.5 lbs, 2 bags
- Concord Grapes, 18.0 lbs, 1 bag
- Lalvin 71B Yeast, 3 packs, 2 pkgs
- Pectic Enzyme, 2 tsp

---

### 6. Today’s Tasks Screen
Purpose: Keep the user moving through the winemaking process.

Top controls:
- Filter chips: All, Due Today, Upcoming, Done
- Add task button

Task card:
- Completion circle
- Task name
- Related batch
- Due time
- Priority/status

Example tasks:
- Take SG reading — Blackberry Reserve — Due 10:00 AM
- Rack to secondary — Cherry Delight — Due 2:00 PM
- Add Campden — Peach Sunset — Due 4:00 PM
- Sanitize equipment — General Task — Due 6:00 PM

---

## Component Patterns

### Cards
Use rounded white or near-white cards with thin borders.

Recommended card styling:
- Background: `#FFFDFC`
- Border: `1px solid #E8DED8`
- Border radius: `18px`
- Shadow: `0 8px 24px rgba(80, 45, 70, 0.08)`

### Pills / Chips
Use for statuses, filters, and fruit attributes.

Examples:
- Fermenting
- Aging
- Conditioning
- Popular
- Premium Recipe
- High
- Medium
- Low

### Buttons
Primary button:
- Berry-purple gradient or solid purple
- White text
- Rounded corners

Secondary button:
- White background
- Thin border
- Dark text

### Charts
Use clean line charts with:
- Purple line
- Minimal labels
- Soft grid
- Rounded chart container
- Avoid overly technical chart styling

### Progress Indicators
Use rings and horizontal progress bars.

Good use cases:
- Fermentation day
- Completion percentage
- Task progress
- Batch phase timeline

---

## UX Priorities

1. Keep common actions one tap away.
2. Make batch status obvious at a glance.
3. Make recipe and fruit discovery visually rich.
4. Keep production data structured but approachable.
5. Use progressive disclosure: show summary first, detail on tap.
6. Avoid making hobby users feel like they are using enterprise manufacturing software.
7. Allow serious users to reach detailed data without cluttering the main screens.

---

## Suggested Information Architecture

```text
Home
├── Active Batch Summary
├── Today’s Tasks
├── Quick Access
│   ├── Fruit Library
│   ├── Recipe Studio
│   ├── Inventory
│   └── Lab Bench
└── Fermentation Timeline

Batches
├── Active
├── Aging
├── Bottled
├── Archived
└── Batch Detail
    ├── Overview
    ├── Readings / Graphs
    ├── Notes
    ├── Ingredients
    ├── Actions
    └── Bottling

Fruit Library
├── Fruit Profiles
├── Flavor Profiles
├── Winemaking Data
├── Pairings
└── Related Recipes

Recipes
├── Browse
├── Favorites
├── My Recipes
├── Recipe Builder
└── Start Batch

Inventory
├── Fruit
├── Yeast
├── Additives
├── Equipment
└── Alerts

Lab Bench
├── SG Readings
├── pH
├── TA
├── Brix
├── Temperature
└── Calculators

Tasks
├── Today
├── Upcoming
├── Overdue
└── Completed
```

---

## Implementation Guidance

When building the UI:
- Start with mobile-first screens.
- Use reusable card, chip, bottom-nav, button, and metric components.
- Treat the mockup image as the style target, not a strict pixel-perfect layout.
- Favor consistency and readability over visual flourish.
- Keep the app feeling calm, premium, and easy to use.
