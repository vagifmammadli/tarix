# Built museum

The project is a locally served, static Three.js museum with a Vite build. The supplied research documents and source assets have been preserved. No source files have been uploaded or published to an external hosting service.

## Run

Double-click `START-MUSEUM.cmd`, or run `npm install` followed by `npm run dev` in this folder. Use the Local URL printed in the terminal. Stop with Ctrl+C. Node.js 20.19+ or 22.12+ is required by Vite 7.

`npm run build` creates `dist/`, including models, fonts and model attributions. `npm run preview` serves that production build. The output needs a web server; opening index.html as a local file will not work.

English is the default interface and exhibit language. The header's **AZ** option switches to Azerbaijani; **EN** switches back. See `GITHUB_PAGES.md` for repository setup and publishing instructions.

## Lesson use

- The welcome screen offers a free visit or presentation route.
- WASD/arrow keys walk, Shift increases speed, dragging looks around. The footprints control optionally locks the mouse; Escape releases it.
- Click an object or press E over a highlighted object to read its evidence. In inspection mode, drag to orbit; use the wheel or buttons to zoom.
- On phones, use the left joystick to move and drag the scene to look around. Every exhibit also has a normal HTML button in Collection and the timeline.
- Presentation mode adds speaker notes and previous/next controls. All ten stops can be shared individually. There is no automatic synchronization between viewers.
- Share generates a QR code. A localhost or 127.0.0.1 link only works on the computer running the server. For a phone on the same Wi-Fi, substitute the computer's LAN address shown by Vite. Local network reachability depends on the network and existing firewall configuration; no firewall settings were changed.
- Graphics can be reduced; camera animation can be disabled. All text and sources remain available if WebGL initialization fails.
- Ambient sound is synthesized locally and is off by default. No analytics, account or external font service is used.

## Architecture

- `src/data/exhibits.js`: ten stops, sources, evidence limits, model provenance and environment definitions.
- `src/data/english.js` and `src/data/ui-en.js`: English exhibit content and interface text.
- `src/main.js`: accessible HTML interface, hash navigation, presentation route, sources, map, sharing and settings.
- `src/museum.js`: gallery architecture, GLB/STL loading and cache, first-person movement, collision bounds, picking, inspection and environment switching.
- `src/style.css`: responsive gallery shell and reading interface.
- `vite.config.js`: serves the original assets under `/models/` in development and copies them into the production output.

Models are loaded with bounded concurrency and cached. The Three.js engine is in a separate chunk. The authored gallery has flat-floor movement and collision boundaries; generic outdoor modules have conservative bounding-box collisions. These are illustrative environments, not a terrain physics simulation or authenticated reconstructions.

## Historical verification

Checked on 2026-11-04:

- McGovern et al. (2017), PNAS, DOI 10.1073/pnas.1714728114: early Georgian biomolecular evidence, chronology and limits of origin claims.
- Penn Museum object 69-12-15: Hajji Firuz jar, date and residue description. The Nature 1996 publication record was also checked; its full text is subscription content.
- Barnard et al. (2011), Journal of Archaeological Science, DOI 10.1016/j.jas.2010.11.012: Areni-1 evidence, dated approximately 4000 BCE in the abstract.
- Göygöl District Executive Power, History: German settlement and nineteenth-century wine-production heritage buildings.
- Presidential Library, Foundation of the German colony in Helenendorf: viticulture and winemaking context. Used for the relevant economic-history claim only.
- Azerbaijan's 2012–2020 viticulture development programme, approved 15 December 2011: historical industry changes and development planning. No invented production charts or unsupported before/after figures.

The Roman amphora's provenance and trade context are retained from the supplied asset register. This session could not fetch the museum object page (timeout) or Sketchfab page (403); do not describe those pages as newly reverified. The display marks the object as documented and gives its original sources and limitation.

Nakhchivan/Arpachay “6,000-year wine” and broad medieval continuity claims are not presented as verified facts. The medieval station is a source-evaluation exercise. All three downloaded environments remain explicitly illustrative. Model credits and licenses appear with each exhibit and in the source library.

## Verification scope

Production build and live browser checks cover the desktop and 390px mobile layouts, model loading, exhibit route, evidence panels, QR dialog, presentation flow, environment switching, WASD movement and keyboard interaction. No automated test suite was introduced, following the supplied handoff guidance. Real-device mobile GPU performance, phone-to-computer LAN access and every imported mesh's collision contour require device-specific checks before a live lesson.
