# Scene Asset Research

## Downloaded scene prototypes

These are complete GLB scenes for interaction and scene-transition prototyping. They are generic AI-generated environments, not verified reconstructions of any archaeological site or Azerbaijani historical place. Keep their visitor-facing labels explicit and contextual.

| File | Source pack | License | Size | Suitable use | Do not present as |
|---|---|---|---:|---|---|
| `assets/3d/scene-prototypes/prehistoric_survivor_settlement_starter_scene.glb` | [Prehistoric Survivor Settlement](https://3dassets.dev/packs/prehistoric-survivor-settlement) | CC0 1.0 | 276,156 bytes | Generic prehistoric environment for testing the earliest-period scene transition | Shulaveri, Gadachrili, Hajji Firuz, Areni-1, or an Azerbaijani archaeological reconstruction |
| `assets/3d/scene-prototypes/medieval_monastery_and_scriptorium_starter_scene.glb` | [Medieval Monastery and Scriptorium](https://3dassets.dev/packs/medieval-monastery-and-scriptorium) | CC0 1.0 | 4,178,164 bytes | Generic medieval architecture for testing a period transition and interactive navigation | A specific medieval Azerbaijani site, wine cellar, or evidence of wine production/consumption |
| `assets/3d/vineyard-winery-cc0/starter-scene-hillside-estate-open-cellar.glb` | [Vineyard and Winery](https://3dassets.dev/packs/vineyard-and-winery) | CC0 1.0 | 3,928,848 bytes | Generic modern Mediterranean winery environment and the initial scene-transition prototype | Göygöl/Helenendorf, the Vohrer winery, or a documented Azerbaijani estate |

All scene files were downloaded from the providers' manifest-listed CDN URLs and checked against the manifest's expected byte sizes. Both new scene packs identify their models as AI-generated; human review is still necessary.

## Historical scenes still requiring documented source material

1. **Early South Caucasus:** No downloadable, source-verified scene reconstruction for Shulaveri–Gadachrili or the other cited early sites was located. Use a map, evidence panels, and neutral landscape geometry until a specialist source or model is found.
2. **Azerbaijan archaeological map:** No wine-related scene model tied to a verified Azerbaijani findspot was located. Keep the map evidence-led and do not use a generic prehistoric village as proof of local winemaking.
3. **Medieval Azerbaijan:** The downloaded monastery is only a generic navigation prototype. Find a specific local source before depicting a building or cellar as a historical site; the environment alone cannot establish wine activity.
4. **Göygöl/Helenendorf, 19th century:** No downloadable 3D reconstruction of the historic town or Vohrer winery was located. Build a later reconstruction from dated photographs, maps, plans, and documented descriptions; label inferred geometry.
5. **Soviet period:** No source-verified Azerbaijani winery scene was located. Build with sourced machinery and period photographs, and distinguish illustrative props from identified local equipment.
6. **Modern period:** The CC0 Mediterranean winery scene can serve as a generic modern visual. Replace or contextualize it with local documentation if the exhibition claims to show a specific Azerbaijani producer or facility.

## Transition implementation note

The existing Three.js plan calls for tearing down and rebuilding modular scene layers as the visitor changes period or place. Treat these downloaded full-scene GLBs as isolated prototypes or reference compositions. For the final experience, prefer reusable modular parts so transitions can animate by layer and mobile visitors do not have to download every full scene at once.

## License note

The scene prototypes are released as CC0 1.0 by their listed providers. CC0 does not require attribution. Optional source links are recorded above. Provenance and historical accuracy are separate questions: an open license does not make a scene archaeologically accurate.
