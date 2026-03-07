# Campaign Website — Washington State Senate, 41st Legislative District

A modern, mobile-responsive campaign website for a Democratic candidate running for Washington State Senate in the 41st Legislative District.

## Quick Start

Open `index.html` in any browser — no build tools required.
For production, deploy the entire folder to any static host (Netlify, GitHub Pages, Vercel, etc.).

---

## Customization Checklist

Search the project for every `[PLACEHOLDER]` token and replace it with real content.

### Candidate Identity
| Placeholder | Replace With |
|---|---|
| `[CANDIDATE NAME]` | Full name, e.g. *Jane Smith* |
| `[Campaign Tagline]` | Short slogan, e.g. *"Forward Together"* |
| `[City, WA]` | City of residence |
| `[he/she/they]` | Correct pronoun |

### LinkedIn-Sourced Biography (`index.html` → `#about`)
- Replace all `[Job Title]`, `[Company / Organization]`, `[Years]` entries in `<ul class="bio-experience">` with the candidate's actual work history.
- Fill in `[Degree, Field of Study]`, `[University Name]`, `[Year]`.
- Add community involvement items.
- Replace the `<div class="photo-placeholder">` block with an `<img>` tag pointing to the candidate's photo.

### Policy Positions (`index.html` → `#issues`)
All 7 issue cards include the candidate name as a placeholder. The policy text itself is ready-to-use Democratic platform language for WA State — adjust emphasis, add local stats, or swap any card for a different issue.

### Contact & Legal
| Placeholder | Replace With |
|---|---|
| `[CAMPAIGN OFFICE ADDRESS]` | Physical campaign office |
| `info@[candidatedomain].com` | Real campaign email |
| `(XXX) XXX-XXXX` | Campaign phone number |
| Social link `href="#"` | Real Facebook / X / Instagram URLs |

### Donation Integration
1. Create an **ActBlue** account at actblue.com.
2. In `js/main.js`, replace `ACTBLUE_BASE` with your real ActBlue donate page URL:
   ```js
   const ACTBLUE_BASE = 'https://secure.actblue.com/donate/your-slug-here';
   ```
3. Update the footer legal line with your official committee name.

### Email List / Forms
Replace `simulateSubmit()` calls in `js/main.js` with real API calls to:
- **NGP VAN / EveryAction** — standard for Democratic campaigns
- **Action Network** — open source alternative
- **Mailchimp** — for newsletter-only signups
- **Formspree / Netlify Forms** — simple contact form backends

---

## File Structure

```
/
├── index.html          # Single-page site (all sections)
├── css/
│   └── styles.css      # All styles — variables, layout, responsive
├── js/
│   └── main.js         # Nav, scroll FX, donate widget, forms
└── images/             # Add candidate photo + any other assets here
```

## Design Inspiration
- **Obama 2008**: Bold navy/gold palette, serif headlines, aspirational tone
- **Obama 2012**: Organized action flows, volunteer-first CTAs
- **Elizabeth Warren**: Issue-first layout, policy depth, pill tags
- **Pete Buttigieg**: Clean white space, personal story emphasis, modern grid

## Washington State Campaign Finance
- Individual contribution limit: **$2,000 per election**
- Report online: [Public Disclosure Commission](https://www.pdc.wa.gov/)
- Treasurer filing required before accepting contributions
