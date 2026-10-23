# Instruktioner för Claude i det här repot

Repot driver Ung Cancers P2P-sidor på Adoveo. Ändringar i `main` publiceras
automatiskt till GitHub Pages och slår igenom på **alla live-sidor** inom
några minuter. Behandla varje push som en produktionsrelease.

- Svara på svenska.
- Läs `README.md` och `adoveo/kampanjer.md` först.
- Ändra bara i `src/` och `adoveo/`. `dist/` byggs av `build/build.mjs`
  och committas inte.
- Kör `node build/build.mjs` innan commit. Bygget avbryts om CSS:en har
  obalanserade klamrar eller om en @@IKON@@ saknas.
- **Testa live innan push**: injicera den byggda CSS:en/JS:en i en
  P2P-sida (t.ex. ungcancer.adoveo.com/start/294/) via webbläsaren och
  jämför. Adoveos admin-förhandsvisning visar inte vår CSS.
- Skriv inte `:not(uc-x)` i källfilerna — bygget lägger till det.
- Adoveos rot är 10px. `--fs-*`/`--gap-*` är rem ×1.6, `--sp-*` är px.
- Ingen emoji i något som ska klistras in i Adoveo (sparandet kraschar).
- Inga hemligheter i repot — det är publikt.
- Plattformsdetaljer (DOM, fas-id:n, shortcodes, fällor) finns i
  Claude-projektet "Ung Cancer - Adoveo assistent" (`claude/p2p-2026.md`).
