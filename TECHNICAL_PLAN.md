# Technical Plan: Three.js Interactive Museum

## Goal

A lightweight website for mobile and desktop browsers. Use Three.js for selected 3D exhibits and spatial experiences. Do not turn the entire site into a 3D scene: text, maps, timeline, and sources should remain fast and readable in a conventional web interface.

## Technology selection

Before coding, inspect the existing project and its instructions. Then choose currently supported tools that fit the requirements. A TypeScript-based React application with Three.js is a reasonable starting point. React Three Fiber may help integrate 3D into React. Choose Vite or Next.js based on hosting and content needs rather than assuming one in advance.

## Page and component areas

- Welcome page and exhibition entry.
- Mobile navigation and presentation mode.
- Timeline and interactive map.
- Exhibit card, evidence indicator, and source panel.
- Three.js viewer and static image alternative.

These are conceptual areas. Adapt their names and structure to the existing code if one already exists.

## URLs and presentation

- Give each exhibit a stable, shareable URL.
- A QR code should open a particular exhibit or section.
- Browser back navigation should work.
- The first release does not need automatic synchronization across audience phones.

## 3D viewer

- Support touch rotation and zoom on phones.
- Provide a clear control to restore the default view.
- Avoid automatic camera motion; respect reduced-motion preferences.
- Make annotations available as readable text outside the canvas.
- Show an image and text alternative if WebGL fails, a model cannot load, or the connection is slow.
- Reduce quality and detail on lower-powered devices.
- Use 3D to help visitors inspect an object’s shape or parts, not as decoration alone.

## Content data

Each exhibit should have a stable ID and URL, date range, place, short summary, extended explanation, evidence type, uncertainties, sources, media rights, and model details when applicable. Keep the historical claim separate from its interpretation.

## Performance and accessibility

- Do not make the first screen wait for a 3D model.
- Load models only when needed; consider GLB/glTF for delivery.
- Support screen readers, keyboard, touch, text scaling, adequate contrast, and reduced motion.
- Review Azerbaijani characters and spelling in the interface.
- Analytics are not required for the first release.

## Delivery stages

1. Inspect the existing project and technology.
2. Build a mobile prototype without 3D.
3. Add the map and timeline.
4. Add a viewer for an appropriately licensed model.
5. Connect source and evidence data to exhibit cards.
6. Add presentation links and QR codes.
7. Review loading, touch interaction, accessibility, and fallback behavior on real phones.

## Completion criteria

Core content works without 3D; each section has a shareable link; the 3D view supports touch and keyboard interaction; a static alternative exists; historical cards show sources and explain the evidence.

## Dynamic scene transitions

Treat each combination of period and location as a scene configuration, not as a separate monolithic model. A configuration should identify the reusable terrain layer, architecture modules, period props, lighting, atmosphere, map focus, date label, and source-linked exhibit hotspots.

When a visitor changes time or place, use a cancellable transition with clear phases:

1. **Dismantle:** existing objects lose cohesion, break into restrained fragments or particles, and fade or move out.
2. **Reframe:** the date, location, map focus, light, and atmosphere update.
3. **Rebuild:** terrain and architecture appear first, then vegetation and period objects assemble in order.
4. **Settle and explore:** restore object selection, camera controls, and exhibit hotspots.

Keep transitions short and understandable. Let visitors pause, replay, skip, or reduce motion. Preserve the selected destination in the URL so a presenter can link directly to a place and period. Do not make a long animation block reading, source access, or navigation.

Use Three.js animations, staged visibility, lightweight particles, shader masks, or instanced fragments to create the disassembly and reconstruction. Do not download a full new environment for every date. Keep archaeological objects separate from scenic modules so they can be selected and inspected. Distinguish historically sourced models from illustrative props in both the data and visitor interface.

### Interactions across the scene

- Select a period on the timeline or a location on the map to begin the transition.
- Tap a reconstructed object or hotspot to open its short explanation and source.
- Drag to orbit the exhibit; pinch to zoom on touch screens; provide a reset control.
- Keep navigation and evidence cards outside the 3D canvas so they remain accessible.
- Provide a static destination view if WebGL is unavailable or reduced motion is requested.
