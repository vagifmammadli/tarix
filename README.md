# Tarix Project — Interactive History Museum

This folder is the project root for an interactive history museum website that visitors can open on their phones during a live presentation. The first exhibition explores the history and spread of wine, with a focus on the South Caucasus and Azerbaijan.

## Project documents

- `PRODUCT_BRIEF.md` — purpose, audience, and product principles.
- `EXPERIENCE_AND_CONTENT.md` — visitor journey and exhibition sections.
- `MUSEUM_STORYLINE.md` — the exhibition’s narrative arc and live-presentation flow.
- `TECHNICAL_PLAN.md` — implementation direction for a Three.js-based website.
- `HISTORICAL_RESEARCH.md` — initial claims, evidence levels, and research gaps.
- `ASSET_RESEARCH.md` — criteria for researching 3D models, images, and maps.
- `AI_HANDOFF.md` — working context and guidelines for Gemini and Claude.
- `CLAUDE_IMPLEMENTATION_GUIDE.md` — implementation handoff covering the exhibition story, chronology, source rules, Three.js architecture, scene transitions, asset use, and completion criteria.

The Perplexity exports in this folder are research material, not verified final history. Check each historical claim against suitable sources before publishing it.

Downloaded and planned 3D assets are tracked in `ASSET_RESEARCH.md`; model credits and licenses are stored alongside files in `assets/3d/ATTRIBUTION.md`.

## Purpose

Create a mobile-friendly web museum that accompanies a speaker’s presentation. Visitors should be able to explore maps, a timeline, stories, and interactive 3D exhibits on their own devices. The exhibition should also work without a presenter.

## Work stages

1. Verify historical claims against reliable sources.
2. Design the mobile experience and presentation flow.
3. Find media and 3D models with verified historical relevance and usage rights.
4. Build the site, add the content, and review it on phones.
5. Prepare and review QR links and presentation mode.

## Local development

```bash
npm install
npm run dev
```

The site opens in English. Use **AZ** in the header for Azerbaijani and **EN** to return to English; the choice is saved in the browser. Historical copy lives in `src/data/`. 3D files in `assets/3d/` are served at `/models/` during development and at the repository subpath after deployment.

## Built application

The walkable Three.js museum is now implemented. Double-click `START-MUSEUM.cmd` to start it, or use the development commands above. Open the Local URL printed by Vite.

Features include ten interactive exhibits, first-person and touch navigation, three illustrative environments, a chronological route, evidence map, source and license panels, presentation notes, shareable exhibit links and QR codes. `npm run build` produces the static website in `dist/`; `npm run preview` previews that build.

See `IMPLEMENTATION_NOTES.md` for classroom setup, controls, source-verification limits, and the code structure. The scene prototypes are not authenticated historical reconstructions.

To publish on GitHub Pages, follow [`GITHUB_PAGES.md`](GITHUB_PAGES.md). The GitHub Actions workflow builds and deploys on pushes to `main` once the repository is connected and Pages is set to GitHub Actions.

## Core principles

Historical accuracy, fast loading, clear navigation, accessibility, and respect for media rights.


