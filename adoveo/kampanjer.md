# Kampanjerna i Adoveo — vad som ligger var

All kod (CSS, header, meny, sök) laddas från det här repot. I Adoveo ligger
bara två rader per kampanj, plus konceptfärgen på konceptkampanjerna.
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
| Theme → Custom CSS | All CSS kommer från repot. Undantag: konceptfärgen, se nedan. |
| Theme → Custom CSS Desktop / Mobile | Låg tidigare kopior av hela CSS:en här. Ska vara tomma. |
| Theme → Campaign Head | Headern byggs av scriptet. Ligger det kvar en gammal header här tas den bort automatiskt, men töm fältet. |
| Klassfältet för Campaign Head | Stod `.uc-campaign-head` (med punkt). Kan tömmas. |

## Kampanjerna

| Id | Vad | Theme → Custom CSS | Innehåll |
|---|---|---|---|
| 294 | Summary, huvudsida | tomt | `inputfalt/294-summary.html` |
| 295 | Födelsedag | konceptfärg (rosa) | `inputfalt/295-fodelsedag.html` |
| 297 | Utmaning | konceptfärg (grön) | `inputfalt/297-utmaning.html` |
| 298 | Till minne | konceptfärg (krämvit + ram) | `inputfalt/298-till-minne.html` |
| 299 | Stå bakom (arbetsnamn) | konceptfärg (röd) | `inputfalt/299-sta-bakom.html` |
| 308 | Infosida | tomt | `inputfalt/308-info.html` |

Insamlingssidorna (`/p/…`) som varje insamlare får hämtar sin kod och färg
från sin konceptkampanj — de behöver inget eget.

## Konceptfärgen

Det enda som skiljer konceptkampanjerna åt i koden. Klistras in som hela
innehållet i kampanjens **Theme → Custom CSS**. (Insamlingssidorna avslöjar
inte vilket koncept de hör till, därför kan färgen inte ligga i repot.)

**295 Födelsedag** — rosa, festligt utan att bli barnkalas
```css
:root {
    --uc-concept-bg:    var(--uc-pink);
    --uc-concept-ink:   var(--uc-black);
    --uc-concept-frame: none;
}
```

**297 Utmaning** — grön, som korten på Summary
```css
:root {
    --uc-concept-bg:    var(--uc-green);
    --uc-concept-ink:   var(--uc-black);
    --uc-concept-frame: none;
}
```

**298 Till minne** — ingen färgyta, krämvitt med svart ram som en dödsannons
```css
:root {
    --uc-concept-bg:    var(--uc-cream);
    --uc-concept-ink:   var(--uc-black);
    --uc-concept-frame: var(--uc-border);
}
```

**299 Stå bakom** — röd med krämvit text (kontrast 4,5:1, klarar AA)
```css
:root {
    --uc-concept-bg:    var(--uc-red);
    --uc-concept-ink:   var(--uc-cream);
    --uc-concept-frame: none;
}
```

## Ny kampanj

1. Skapa den i Adoveo (P2P-mall eller Summary-mall).
2. Lägg in de två raderna i Head Markup. Töm Custom CSS-fälten och Campaign Head.
3. Konceptkampanj: lägg in en konceptfärg i Custom CSS.
4. Ska den synas i menyn: lägg till den i `src/js/uc-p2p.js` (listorna `MENU_MAIN` / `MENU_MORE`).
5. Fyll i tabellen ovan.

## Spara-fällor i Adoveo

- **Emoji kraschar spara** i alla fält, även i kommentarer.
- **Admin-förhandsvisningen visar inte vår CSS.** Kontrollera alltid på kampanjens riktiga adress.
