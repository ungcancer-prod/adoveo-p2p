// Bygger dist/uc-p2p.css och dist/uc-p2p.js av filerna i src/.
// Körs automatiskt av GitHub Actions vid varje ändring (se .github/workflows).
// Lokalt: node build/build.mjs   (inga beroenden behövs)
//
// Vad bygget gör med CSS:en:
//  1. Slår ihop src/css/*.css i nummerordning.
//  2. Ersätter @@NAMN@@ med ikonen src/icons/namn.svg som data-URI.
//  3. Lägger :not(uc-x) sist i varje selektor. Det matchar allt (det finns
//     inget element som heter uc-x) men ger +1 i specificitet. Filen laddas
//     tidigare på sidan än Adoveos egen CSS, och utan tillägget skulle
//     Adoveos regler vinna varje gång specificiteten är lika.
//     Undantag: :root-regler (variablerna ska kunna skrivas över av en
//     kampanjs Custom CSS) och @font-face/@keyframes.

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'dist');
const BUMP = ':not(uc-x)';

const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
const sha = (process.env.GITHUB_SHA || 'lokalt').slice(0, 7);
const banner = (what) =>
  `/* ${what} — GENERERAD FIL, ÄNDRA INTE HÄR.\n` +
  `   Källa: github.com/ungcancer-prod/adoveo-p2p (src/). Byggd ${stamp}, ${sha}. */\n`;

// ---------- ikoner ----------
function svgUri(svg) {
  const s = svg.replace(/\s+/g, ' ').trim().replace(/"/g, "'");
  return 'url("data:image/svg+xml,' +
    s.replace(/%/g, '%25').replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E') + '")';
}
const icons = Object.fromEntries(
  readdirSync(join(SRC, 'icons')).filter(f => f.endsWith('.svg'))
    .map(f => [f.replace(/\.svg$/, '').toUpperCase(), svgUri(readFileSync(join(SRC, 'icons', f), 'utf8'))])
);

// ---------- specificitet ----------
// Hittar slutet på en kommentar/sträng från position i.
function skipComment(css, i) { const e = css.indexOf('*/', i + 2); return e === -1 ? css.length : e + 2; }
function skipString(css, i) {
  const q = css[i];
  for (let j = i + 1; j !== css.length; j++) {
    if (css[j] === '\\') { j++; continue; }
    if (css[j] === q) return j + 1;
  }
  return css.length;
}
// Index efter matchande } för blocket som börjar vid { på position i.
function blockEnd(css, i) {
  let depth = 0;
  for (let j = i; j !== css.length; j++) {
    const c = css[j];
    if (c === '/' && css[j + 1] === '*') { j = skipComment(css, j) - 1; continue; }
    if (c === '"' || c === "'") { j = skipString(css, j) - 1; continue; }
    if (c === '{') depth++;
    if (c === '}') { depth--; if (depth === 0) return j + 1; }
  }
  throw new Error('Obalanserade klamrar i CSS:en');
}
function bumpSelector(sel) {
  const t = sel.trim();
  if (!t || t.startsWith(':root')) return sel;
  // Före pseudo-element (::placeholder m.fl.) på yttersta nivån
  let depth = 0, at = -1;
  for (let j = 0; j !== t.length; j++) {
    const c = t[j];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (depth === 0 && c === ':' && t[j + 1] === ':') { at = j; break; }
  }
  const bumped = at === -1 ? t + BUMP : t.slice(0, at) + BUMP + t.slice(at);
  return sel.replace(t, bumped);
}
function bumpPrelude(prelude) {
  // Kommentarer i selektorlistan skyddas med platshållare
  const saved = [];
  let p = prelude.replace(/\/\*[\s\S]*?\*\//g, m => `\u0000${saved.push(m) - 1}\u0000`);
  const parts = []; let depth = 0, start = 0;
  for (let j = 0; j !== p.length; j++) {
    const c = p[j];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ',' && depth === 0) { parts.push(p.slice(start, j)); start = j + 1; }
  }
  parts.push(p.slice(start));
  p = parts.map(part => {
    // selektorn = texten utan platshållare i kanterna
    const m = part.match(/^((?:\s|\u0000\d+\u0000)*)([\s\S]*?)((?:\s|\u0000\d+\u0000)*)$/);
    return m[1] + bumpSelector(m[2]) + m[3];
  }).join(',');
  return p.replace(/\u0000(\d+)\u0000/g, (_, n) => saved[+n]);
}
const RECURSE = /^@(media|supports|layer|container)\b/i;
function transform(css) {
  let out = '', i = 0;
  while (i !== css.length) {
    const c = css[i];
    if (/\s/.test(c)) { out += c; i++; continue; }
    if (c === '/' && css[i + 1] === '*') { const e = skipComment(css, i); out += css.slice(i, e); i = e; continue; }
    // läs prelude till { eller ;
    let j = i;
    while (j !== css.length && css[j] !== '{' && css[j] !== ';' && css[j] !== '}') {
      if (css[j] === '/' && css[j + 1] === '*') { j = skipComment(css, j); continue; }
      if (css[j] === '"' || css[j] === "'") { j = skipString(css, j); continue; }
      j++;
    }
    if (j === css.length) { out += css.slice(i); break; }
    if (css[j] === '}') { out += css.slice(i, j + 1); i = j + 1; continue; }
    const prelude = css.slice(i, j);
    if (css[j] === ';') { out += prelude + ';'; i = j + 1; continue; }
    const end = blockEnd(css, j);
    const atRule = prelude.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (atRule.startsWith('@')) {
      if (RECURSE.test(atRule)) out += prelude + '{' + transform(css.slice(j + 1, end - 1)) + '}';
      else out += css.slice(i, end);                         // @font-face, @keyframes …
    } else {
      out += bumpPrelude(prelude) + css.slice(j, end);
    }
    i = end;
  }
  return out;
}

// ---------- bygg ----------
const cssFiles = readdirSync(join(SRC, 'css')).filter(f => f.endsWith('.css')).sort();
let css = cssFiles.map(f => `\n/* ===== src/css/${f} ===== */\n` + readFileSync(join(SRC, 'css', f), 'utf8')).join('\n');
css = css.replace(/@@([A-Z0-9_-]+)@@/g, (m, n) => {
  if (!icons[n]) throw new Error(`Ikonen ${m} saknas i src/icons/`);
  return icons[n];
});
css = transform(css);

const js = readFileSync(join(SRC, 'js', 'uc-p2p.js'), 'utf8');

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'uc-p2p.css'), banner('uc-p2p.css') + css);
writeFileSync(join(OUT, 'uc-p2p.js'), banner('uc-p2p.js') + js);
writeFileSync(join(OUT, 'index.html'),
  '<!doctype html><meta charset="utf-8"><title>Ung Cancer P2P — filer</title>' +
  '<p>Filerna som laddas på Ung Cancers P2P-sidor på Adoveo:</p><ul>' +
  '<li><a href="uc-p2p.css">uc-p2p.css</a></li><li><a href="uc-p2p.js">uc-p2p.js</a></li></ul>' +
  `<p>Byggd ${stamp}, ${sha}. Källa: <a href="https://github.com/ungcancer-prod/adoveo-p2p">github.com/ungcancer-prod/adoveo-p2p</a></p>\n`);
console.log(`Byggt: ${cssFiles.join(', ')} -> dist/uc-p2p.css (${css.length} tecken), dist/uc-p2p.js`);
