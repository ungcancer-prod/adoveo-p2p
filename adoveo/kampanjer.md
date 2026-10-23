# Kampanjerna i Adoveo — vad som ligger var

All kod (CSS, header, meny, sök) laddas från det här repot. I Adoveo ligger
bara två rader per kampanj. Konceptfärgen väljs med Adoveos egen färgväljare.
Allt annat i Adoveo är **innehåll**: rubriker, texter och fältetiketter.
Det finns i `inputfalt/`.

## De två raderna — samma i alla kampanjer

**Theme → Head Markup (for Scripts)** — de här två raderna och inget mer.
SVG:n `#shape-box` som låg där tidigare ritas nu av scriptet och kan tas
bort. (Ligger den kvar gör det inget — scriptet använder den då i stället.)

```html
<link rel="stylesheet" href="https://ungcancer-prod.github.io/adoveo-p2p/uc-p2p.css">
<script src="https://ungcancer-prod.github.io/adoveo-p2p/uc-p2p.js"></script>
```

## Fält som ska vara tomma

| Fält | Varför |
|---|---|
| Theme → Custom CSS | All CSS kommer från repot. |
| Theme → Custom CSS Desktop / Mobile | Låg tidigare kopior av hela CSS:en här. Ska vara tomma. |
| Theme → Campaign Head | Headern byggs av scriptet. Ligger det kvar en gammal header här tas den bort automatiskt, men töm fältet. |
| Klassfältet för Campaign Head | Stod `.uc-campaign-head` (med punkt). Kan tömmas. |

## Kampanjerna

| Id | Vad | Konceptfärg | Innehåll |
|---|---|---|---|
| 294 | Summary, huvudsida | – | `inputfalt/294-summary.html` |
| 295 | Födelsedag | rosa i färgväljaren | `inputfalt/295-fodelsedag.html` |
| 297 | Utmaning | grön i färgväljaren | `inputfalt/297-utmaning.html` |
| 298 | Till minne | svart i färgväljaren | `inputfalt/298-till-minne.html` |
| 299 | Pepp | vit i färgväljaren | `inputfalt/299-pepp.html` |
| 308 | Infosida | – | `inputfalt/308-info.html` |

Insamlingssidorna (`/p/…`) som varje insamlare får hämtar sin kod och färg
från sin konceptkampanj — de behöver inget eget.

## Konceptfärgen

Väljs i **Adoveo admin**, med temats färgväljare för wrapperns bakgrund —
ingen kod. Sidans bakgrund är alltid vit (#ffffff, från repot).

Scriptet läser av den färg du valt och anpassar resten själv: på en mörk
yta blir texten krämvit och logotyperna efter "skapa" får en krämvit
platta; på en ljus yta blir texten svart.

| Koncept | Wrapperns färg i admin |
|---|---|
| 295 Födelsedag | Rosa `#FFB5D8` |
| 297 Utmaning | Grön `#8BEEA5` |
| 298 Till minne | Svart `#282826` |
| 299 Pepp | Vit `#FCF7E3` |

Alla färger är Ung Cancers egna. Theme → Custom CSS ska vara tomt i alla
kampanjer.

## Ny kampanj

1. Skapa den i Adoveo (P2P-mall eller Summary-mall).
2. Lägg in de två raderna i Head Markup. Töm Custom CSS-fälten och Campaign Head.
3. Konceptkampanj: välj wrapperns färg i Adoveos färgväljare.
4. Ska den synas i menyn: lägg till den i `src/js/uc-p2p.js` (listorna `MENU_MAIN` / `MENU_MORE`).
5. Fyll i tabellen ovan.

## Spara-fällor i Adoveo

- **Emoji kraschar spara** i alla fält, även i kommentarer.
- **Admin-förhandsvisningen visar inte vår CSS.** Kontrollera alltid på kampanjens riktiga adress.
