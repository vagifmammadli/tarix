# 3D and Media Asset Plan

## Scene-transition concept

When visitors change the date or place, the exhibition should feel as if the current scene is dismantling and a new one is being built for the selected moment. Build this from modular scene layers rather than one large environment model:

1. Fade or break apart the current period’s architecture and props.
2. Let terrain, map markers, and the date/location label transition.
3. Assemble the next environment from reusable modules and period-specific props.
4. Keep the visitor in control: allow pause, replay, skip, and reduced-motion modes.
5. Let visitors inspect and select objects once the new scene is in place.

The collapse/rebuild animation can be made in Three.js with particles, fragments, masks, and staged visibility. It does not require downloading a separate animated scene for every period. Preserve the real models as separate assets so the same object can appear in different contexts where historically appropriate.

## 3D asset list by priority

### Priority 1 — First interactive prototype

| Asset | Purpose | Source/accuracy requirement | Status |
|---|---|---|---|
| Ancient storage vessel / amphora | First rotatable exhibit; show form and annotated parts | Use as a clearly labeled generic vessel unless tied to a documented find | One generic neck amphora downloaded; see `assets/3d/ATTRIBUTION.md` |
| Stone press or fermentation vat | Explain what production equipment can and cannot prove | Prefer a documented archaeological example with its own context; do not label an unrelated press as Azerbaijani | Candidate generic winery press by amanmelle (CC BY), not downloaded: https://sketchfab.com/3d-models/winery-vineyard-wine-press-064044e22c11442ab804349e7da6a0be |
| Grape vine, bunch, and basket | Show cultivation and harvesting; reusable in more than one scene | Botanical/generic assets are fine when not presented as a specific ancient reconstruction | Candidate vine, bunch, and basket models identified, not downloaded |
| Modular terrain pieces: ground, hills, river, mountain backdrop | Rebuild scenes across places without huge downloads | Create procedurally in Three.js and label map locations separately | Create in code |

### Priority 2 — Historical route

| Asset | Scene | Accuracy note | Status |
|---|---|---|---|
| Transport amphora / merchant vessel | Mediterranean trade and Roman-era spread | Use a vessel with a documented wine-trade function where possible | Candidate Egyptian merchant ship by Kelisei Ventura (CC BY), not downloaded; illustrative maritime context only: https://sketchfab.com/3d-models/egyptian-ship-aefb6d69d12c41eda806350f419cb81f |
| Storage jar, cellar rack, or barrel | Medieval/early modern storage context | Select examples whose date and region are known; otherwise label as illustrative | Candidate old wine barrel by xpehik (CC BY), not downloaded: https://sketchfab.com/3d-models/realistic-old-wine-barrel-pbr-game-asset-7785037b519a4466a751a536a6dd0135 |
| Helenendorf/Göygöl house, cellar, press, and barrel props | 19th-century commercial winemaking | Base architecture on documented photographs, plans, or scans; do not invent a precise reconstruction without a source | Historical images and assets needed |
| Vineyard rows, hand tools, baskets, crates | 19th-century and Soviet agriculture | Reuse plant assets; add dated equipment only when sourced | Research needed |

### Priority 3 — Later periods and optional depth

| Asset | Scene | Accuracy note | Status |
|---|---|---|---|
| Soviet-era winery equipment, truck/tractor, bottles or crates | Soviet industrial expansion and anti-alcohol campaign | Prefer period photographs or museum-held objects; generic props must be marked as illustrative | Candidate low-poly MTZ-82 tractor by JUFF (CC BY), not downloaded; generic Soviet prop: https://sketchfab.com/3d-models/low-poly-tractor-d5e9b5a1bc1046ce821ac13c942c14c1 |
| Modern winery equipment and bottle | Contemporary revival | Use current documentary sources; avoid promoting a commercial brand unless the exhibit needs it | Research needed |
| Additional local archaeological vessels | Azerbaijan map exhibits | Prioritize actual scans of finds from Azerbaijan with clear museum/source rights | Search first; none verified yet |

## Scene-specific environment plan

| Scene | Reusable code-built environment | Hero assets |
|---|---|---|
| Early South Caucasus | Mountain foothills, river valley, settlement silhouettes | Vessel, grapes, possible documented fermentation equipment |
| Azerbaijan archaeological map | Terrain/map base with selectable find points | Only verified local scans; use neutral markers until then |
| Medieval period | Low-detail settlement/cellar layers | Source-supported storage vessel or press; otherwise text/map-led scene |
| Göygöl/Helenendorf | Vineyard, street and cellar layers informed by historical images | Barrel, press, building fragments only after sourcing |
| Soviet period | Vineyard grid and industrial silhouette | Period-specific equipment only when identified |
| Modern period | Contemporary vineyard and cellar | Modern equipment or bottle only if useful to the historical story |

## Downloaded asset

`neck_amphora_wikimedia_cc_by_sa_4.0.stl`

- A generic neck-amphora model, not a scan of an Azerbaijani archaeological find.
- Suitable for prototyping vessel rotation and the scene assembly animation.
- It may be described as an illustrative neck-amphora form; do not assign it to a specific Azerbaijani site or date.
- License: CC BY-SA 4.0. Provide attribution and a license link. If the model itself is adapted, distribute that adaptation under the same or a compatible license.
- See `assets/3d/ATTRIBUTION.md` for the full credit and source.
- STL has geometry but no authored texture; apply project materials or convert it for web use later.

## Asset research and selection rules

1. Start with museums, universities, archaeological projects, and open collections.
2. For each candidate, record source, creator, date/place, object type, license, file format, dimensions, and download URL.
3. Check whether the file is an original scan, a reconstruction, or a generic artist-made model.
4. Do not present a generic prop as an Azerbaijani artifact or as a verified reconstruction.
5. Check attribution requirements and any non-commercial or share-alike conditions before integration.
6. Optimize the selected file for mobile delivery and keep a static image alternative.

## Asset register

| ID | Asset | Source | License | Historical fit | Technical state | Status |
|---|---|---|---|---|---|---|
| A-001 | Generic neck amphora | Wikimedia Commons / Noedlh | CC BY-SA 4.0 | Illustrative vessel only; not Azerbaijan-specific | STL, 1.79 MB; no authored texture | Downloaded |

## Newly downloaded asset: A-002 — Laietana wine amphora

- **Local file:** `assets/3d/badalona_laietana_wine_amphora_glb_1k.glb`
- **Source page:** https://sketchfab.com/3d-models/amfora-laietana-museu-de-badalona-8d968905907f4ca7971bf8ad6639b6d0
- **Object record:** https://www.museudebadalona.cat/colleccions/amfora/
- **Creator/credit:** Yiting Tan / Museu de Badalona.
- **License:** CC BY 4.0; credit the creator and link to the license.
- **Historical fit:** A Laietana 1/Tarraconense 1 amphora from the Roman city of Baetulo. The museum’s description identifies it as a container used to export wine to southern France in the first half of the 1st century BCE. This makes it suitable for the Roman wine-trade scene, not for an Azerbaijani archaeological scene.
- **Downloaded variant:** GLB with 1K textures, about 5.9 MB. Keep this as the source file. Sketchfab reports about 177k triangles, so test and optimize a separate copy for mobile use before adding it to a web build.
- **Status:** Downloaded; attribution recorded in `assets/3d/ATTRIBUTION.md`.

## A-003 — Vineyard and Winery CC0 asset pack

- **Source:** https://3dassets.dev/packs/vineyard-and-winery
- **Downloaded to:** `assets/3d/vineyard-winery-cc0/`
- **Contents:** 61 individual GLB models plus the 3.93 MB hillside-estate starter scene. The individual models total about 9.53 MB; the complete local folder is about 13.46 MB.
- **License:** CC0 1.0 Universal; no attribution required. Optional credit and license details are in `assets/3d/ATTRIBUTION.md`.
- **Useful models:** Vine Row Bare/Leafed/Fruiting, Harvest Basket, Basket Press, Screw Press, Oak Barrel, Barrel Stack/Racks, fermentation tanks, bottles/crates, cellar modules, tractor and vineyard environment parts.
- **Provenance and limitations:** The provider identifies all models as AI-generated (Claude Opus 5) and prepared for human review. Treat the pack as generic illustrative content and prototype assets. It does not document Azerbaijani artifacts, regional historical accuracy, or a reconstruction of Göygöl/Helenendorf. The starter scene is a generic modern Mediterranean wine estate; do not present it as a specific historical Azerbaijani winery.
- **Verification:** All 61 downloaded GLBs and the starter scene were checked against the file sizes published in the source manifest.

## Downloaded complete scene prototypes

Two additional complete GLB scenes were found outside Sketchfab and downloaded to `assets/3d/scene-prototypes/`: a generic prehistoric settlement (276 KB) and a generic medieval monastery (4.18 MB), both CC0 1.0. Their providers identify them as AI-generated. They are for interaction and scene-transition prototyping only; they are not reconstructions of the South Caucasus sites or medieval Azerbaijan. Source links, size verification, and detailed cautions are in `SCENE_ASSET_RESEARCH.md`.
