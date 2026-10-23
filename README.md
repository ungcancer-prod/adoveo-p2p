# adoveo-p2p

Kod för Ung Cancers P2P-insamlingar på Adoveo (ungcancer.adoveo.com):
CSS, header med meny och sök, och dokumentation av vad som ligger i
vilken kampanj.

Alla P2P-sidor laddar två filer härifrån. Ändrar man något här slår det
igenom på alla sidor inom några minuter — ingen kopiering in i Adoveo.

- **CSS:** https://ungcancer-prod.github.io/adoveo-p2p/uc-p2p.css
- **JS:** https://ungcancer-prod.github.io/adoveo-p2p/uc-p2p.js

## Ändra något

1. Öppna filen under `src/` på github.com och tryck på pennan (Edit).
2. Ändra, tryck **Commit changes** och skriv kort vad du ändrat.
3. Fliken **Actions** visar bygget. Grön bock = publicerat. Röd = något
   gick fel, och det som låg ute innan ligger kvar.
4. Vänta ett par minuter (cachen) och kontrollera på kampanjens riktiga
   adress — inte i Adoveos förhandsvisning, den visar inte vår CSS.

Ändringen syns på **alla** P2P-sidor samtidigt. Gör en sak i taget och
kontrollera efteråt.

## Vad som ligger var

| Vill du ändra … | Fil |
|---|---|
| Menyn (länkar, ordning, texter) | `src/js/uc-p2p.js`, listorna `MENU_MAIN` och `MENU_MORE` högst upp |
| Färger, typsnitt, knappar, avstånd | `src/css/01-bas.css` (sektion 0–8, tokens överst) |
| Skapa-sidan och insamlingssidorna | `src/css/02-koncept.css` (sektion 9–11) |
| Header, menypanel, sök, ankare, infosidan | `src/css/03-header.css` (sektion 12) |
| Logga och ikoner | `src/icons/*.svg` |
| Konceptfärgerna | ligger i respektive kampanj i Adoveo, se `adoveo/kampanjer.md` |
| Rubriker, texter, fältetiketter | ligger i Adoveo, dokumenterade i `adoveo/inputfalt/` |

`dist/` skapas av bygget och ska inte ändras — den finns inte ens i repot.

## Backa en ändring

Öppna filen → **History** → välj versionen som fungerade → kopiera
innehållet → klistra in i filen och spara igen. Eller be Claude backa.

## Bra att veta

- **Ankare:** varje rubrik (h1–h3) på en sida får ett ankare av sin text:
  "Så funkar det" → `#sa-funkar-det`, "Kontakt" → `#kontakt`. Menyns
  länkar bygger på det — byter man en rubrik i Adoveo måste länken
  följa med, eller så skriver man id:t själv på rubriken.
- **Sök:** frågar Adoveo efter insamlingar i mappen `P2P-2026-WIP`. Byter
  mappen namn i Adoveo måste `FOLDER` i `src/js/uc-p2p.js` ändras.
- **Specificitet:** bygget lägger `:not(uc-x)` sist i varje selektor så att
  våra regler vinner över Adoveos egna. Det står inte i källfilerna och
  ska inte skrivas dit.
- **Rotfonten:** Adoveo har `html { font-size: 62.5% }`, så 1rem = 10px.
  Typografi-tokens är omräknade ×1.6 — se kommentaren i `01-bas.css`.

## Kampanjerna

Se `adoveo/kampanjer.md`: vilka kampanjer som finns, vad som ska ligga i
vilket admin-fält, och konceptfärgerna.
