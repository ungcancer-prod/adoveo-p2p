/* ==========================================================================
   UNG CANCER — P2P PÅ ADOVEO: header, meny, sök och ankare
   --------------------------------------------------------------------------
   Laddas på alla P2P-sidor via Theme → Head Markup (se README).
   Bygger headern och menypanelen själv, så Campaign Head ska vara tomt.

   VANLIGASTE ÄNDRINGEN: menyn. Ändra listorna under MENY nedan.
   Spara på github.com — sidan uppdateras inom några minuter.
   ========================================================================== */
(function () {
  if (window.ucHeaderInit) return;            /* lås mot dubbel-init */
  window.ucHeaderInit = true;

  /* ---------- MENY ---------- */
  var BASE = 'https://ungcancer.adoveo.com/start/';
  /* Nivå 1: visas i mitten av headern på desktop och överst i menypanelen.
     Det här är också listan över koncepten: id = kampanjens nummer, och
     bg/ink = konceptets färger på insamlingskorten (textruta och etikett). */
  var MENU_MAIN = [
    { text: 'Födelsedag', id: '295', bg: 'var(--uc-pink)',  ink: 'var(--uc-black)', href: BASE + '295/?location=summary' },
    { text: 'Utmaning',   id: '297', bg: 'var(--uc-green)', ink: 'var(--uc-black)', href: BASE + '297/?location=summary' },
    { text: 'Till minne', id: '298', bg: 'var(--uc-black)', ink: 'var(--uc-cream)', href: BASE + '298/?location=summary' },
    { text: 'Pepp',       id: '299', bg: 'var(--uc-cream)', ink: 'var(--uc-black)', href: BASE + '299/?location=summary' }
  ];
  /* Nivå 2: bara i menypanelen. Ankaret (#...) = rubrikens text, se README */
  var MENU_MORE = [
    { text: 'Så funkar det',     href: BASE + '294/#sa-funkar-det' },
    { text: 'Spridningstips',    href: BASE + '308/#spridningstips' },
    { text: 'Vanliga frågor',    href: BASE + '308/#vanliga-fragor' },
    { text: 'Kontakt',           href: BASE + '308/#kontakt' },
    { text: 'Din integritet',    href: BASE + '308/#din-integritet' },
    { text: 'Till ungcancer.se', href: 'https://ungcancer.se/' }
  ];

  /* ---------- Former (oregelbundna kanter) ---------- */
  /* clip-path-former i objectBoundingBox (0–1 = elementets bredd/höjd).
     Används i CSS som url(#id), t.ex. via --uc-clip eller class="uc-clip".
     Lägg till fler former här om olika element ska ha olika kant. */
  var SHAPES = {
    'shape-box': 'M0.998 0.993L0.748 0.994L0.5 0.992L0.252 1L0.006 0.992L0.003 0.747L0 0.5L0.007 0.252L0.006 0.005L0.252 0.006L0.5 0L0.748 0.009L0.998 0.001L1 0.252L0.993 0.5L0.995 0.748L0.998 0.993Z'
  };

  /* ---------- Inställningar ---------- */
  var SUMMARY_URL = BASE + '294/';
  var SUMMARY_ID  = '294';                     /* sökningen frågar alltid med Summary-kampanjens id */
  var FOLDER      = 'P2P-2026-WIP';            /* Adoveo-mappen; BYT om mappen byter namn */
  var MAX_HITS    = 6;                         /* kort i sökpanelen, resten via "Visa alla" */

  var root = document.documentElement;
  var STATES = { 'uc-meny': 'uc-nav-open', 'uc-sok': 'uc-search-open' };
  var lastTrigger = null;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function anyOpen() { return root.classList.contains('uc-nav-open') || root.classList.contains('uc-search-open'); }

  function setOpen(id, on, refocus) {
    var panel = document.getElementById(id);
    if (!panel) return;
    if (on) { Object.keys(STATES).forEach(function (k) { root.classList.remove(STATES[k]); }); }
    root.classList.toggle(STATES[id], on);
    document.querySelectorAll('[aria-controls="' + id + '"]').forEach(function (t) {
      t.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    if (on) {
      /* Sök: fokus i fältet. Meny: fokus på panelen, så att ingen fokusram
         hamnar på krysset vid musklick (Tab går vidare till länkarna) */
      var f = panel.querySelector('.uc-search__input') || panel.querySelector('.uc-drawer__panel');
      if (f && !f.matches('input')) f.tabIndex = -1;
      if (f) setTimeout(function () { f.focus(); }, 50);
    } else if (refocus && lastTrigger) {
      lastTrigger.focus();
    }
  }
  function closeAll(refocus) {
    Object.keys(STATES).forEach(function (k) { if (root.classList.contains(STATES[k])) setOpen(k, false, refocus); });
  }

  /* ---------- Header + menypanel ---------- */
  /* Byggs direkt när scriptet körs (överst i body), så headern finns innan
     resten av sidan ritas — inget hopp. Läggs som barn till body. */
  function link(cls, item) {
    var a = el('a', cls, item.text);
    a.href = item.href;
    return a;
  }
  function list(cls, linkCls, items) {
    var ul = el('ul', cls);
    items.forEach(function (it) { var li = el('li'); li.appendChild(link(linkCls, it)); ul.appendChild(li); });
    return ul;
  }
  function icon(mod, controls, label) {
    var li = el('li');
    var a = el('a', 'uc-header__icon uc-header__icon--' + mod);
    a.href = '#' + controls;
    a.setAttribute('role', 'button');
    a.setAttribute('aria-controls', controls);
    a.setAttribute('aria-expanded', 'false');
    a.appendChild(el('span', 'uc-sr', label));
    li.appendChild(a);
    return li;
  }
  function buildHeader() {
    if (document.querySelector('.uc-header')) return;
    var header = el('header', 'uc-header');
    var inner = el('div', 'uc-header__inner');
    var logo = el('a', 'uc-header__logo');
    logo.href = SUMMARY_URL;
    logo.appendChild(el('span', 'uc-sr', 'Ung Cancer'));
    var nav = el('nav', 'uc-header__menu');
    nav.setAttribute('aria-label', 'Huvudmeny');
    nav.appendChild(list('uc-header__list', 'uc-header__link', MENU_MAIN));
    var actions = el('ul', 'uc-header__actions');
    actions.appendChild(icon('menu', 'uc-meny', 'Meny'));
    actions.appendChild(icon('search', 'uc-sok', 'Sök insamling'));
    inner.appendChild(logo); inner.appendChild(nav); inner.appendChild(actions);
    header.appendChild(inner);

    var drawer = el('div', 'uc-drawer');
    drawer.id = 'uc-meny';
    var back = el('a', 'uc-drawer__backdrop'); back.href = '#'; back.tabIndex = -1; back.setAttribute('aria-hidden', 'true');
    var panel = el('div', 'uc-drawer__panel');
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Meny');
    var close = el('a', 'uc-drawer__close'); close.href = '#'; close.setAttribute('role', 'button');
    close.appendChild(el('span', 'uc-sr', 'Stäng meny'));
    var dnav = el('nav');
    dnav.setAttribute('aria-label', 'Meny');
    dnav.appendChild(list('uc-drawer__list', 'uc-drawer__link', MENU_MAIN));
    dnav.appendChild(list('uc-drawer__list uc-drawer__list--sub', 'uc-drawer__link', MENU_MORE));
    panel.appendChild(close); panel.appendChild(dnav);
    drawer.appendChild(back); drawer.appendChild(panel);

    var body = document.body;
    body.insertBefore(drawer, body.firstChild);
    body.insertBefore(header, body.firstChild);
  }
  /* Formerna läggs i en osynlig SVG överst i body. Finns en form redan
     (gammal SVG i Head Markup) används den. Klassen uc-shape på html slår
     på --uc-clip i CSS:en först när formen garanterat finns. */
  function buildShapes() {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = null;
    Object.keys(SHAPES).forEach(function (id) {
      if (document.getElementById(id)) return;
      if (!svg) {
        svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        svg.style.position = 'absolute';
        svg.appendChild(document.createElementNS(NS, 'defs'));
      }
      var cp = document.createElementNS(NS, 'clipPath');
      cp.setAttribute('id', id);
      cp.setAttribute('clipPathUnits', 'objectBoundingBox');
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', SHAPES[id]);
      cp.appendChild(path);
      svg.firstChild.appendChild(cp);
    });
    if (svg) document.body.insertBefore(svg, document.body.firstChild);
    root.classList.add('uc-shape');
  }

  /* Konceptfärgen väljs i Adoveo admin och hamnar som bakgrund på
     wrappern. Här läses den av, och text- och detaljfärger anpassas:
     mörk yta -> krämvit text och ljus platta bakom logotyperna. */
  function conceptColors() {
    var w = document.querySelector('#phase-before-coupon .wrapper, #phase-after-coupon .wrapper, #phase-swish-result .wrapper');
    if (!w) return;
    /* Adoveo har en transition på wrappern: stäng av den medan färgen
       läses, annars kan ett mellanläge läsas av */
    var t = w.style.transition;
    w.style.transition = 'none';
    var m = getComputedStyle(w).backgroundColor.match(/[\d.]+/g);
    w.style.transition = t;
    if (!m) return;
    var alpha = m.length === 4 ? +m[3] : 1;
    if (alpha === 0) return;                    /* genomskinlig: låt standard gälla */
    var lin = function (c) { c = c / 255; return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92; };
    var L = 0.2126 * lin(+m[0]) + 0.7152 * lin(+m[1]) + 0.0722 * lin(+m[2]);
    var dark = L !== Math.max(L, 0.18);          /* L under 0.18 = mörk yta */
    root.style.setProperty('--uc-concept-bg', 'rgb(' + m[0] + ',' + m[1] + ',' + m[2] + ')');
    root.style.setProperty('--uc-concept-ink', dark ? 'var(--uc-cream)' : 'var(--uc-black)');
    root.style.setProperty('--uc-concept-logo-bg', dark ? 'var(--uc-cream)' : 'transparent');
  }

  /* En gammal header i Campaign Head (från tiden före repot) tas bort */
  function removeOldHeaders() {
    var all = document.querySelectorAll('.uc-header');
    for (var i = 1; i !== all.length && all.length; i++) {
      var old = all[i], box = old.parentElement;
      old.remove();
      if (box && box !== document.body && !box.children.length) box.remove();
    }
    var drawers = document.querySelectorAll('#uc-meny');
    for (var j = 1; j !== drawers.length && drawers.length; j++) drawers[j].remove();
  }

  /* ---------- Klick & tangentbord (delegerat) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a, button') : null;
    if (!a) return;
    var target = a.getAttribute('aria-controls');
    if (target && STATES[target] && document.getElementById(target)) {
      e.preventDefault(); lastTrigger = a; setOpen(target, true); return;
    }
    if (a.matches('.uc-drawer__close, .uc-drawer__backdrop')) { e.preventDefault(); closeAll(true); return; }
    if (a.closest('.uc-drawer') && a.tagName === 'A') closeAll(false);   /* länk i panel: stäng, låt länken gå */
    /* Ankarlänk till den här sidan: scrolla själva, med rätt avstånd */
    if (a.tagName === 'A' && a.hash) {
      var u = new URL(a.href, location.href);
      var t = document.getElementById(decodeURIComponent(u.hash.slice(1)));
      if (t && u.host === location.host && u.pathname === location.pathname) {
        e.preventDefault();
        history.pushState(null, '', u.hash);
        scrollToAnchor(t, true);
      }
    }
  });

  /* ---------- Ankare ---------- */
  /* Avståndet styrs i CSS med scroll-margin-top (standard: --uc-anchor-offset).
     Scrollar man uppåt syns headern, så då läggs dess höjd till. */
  function scrollToAnchor(t, smooth) {
    var bar = document.querySelector('.uc-header');
    if (bar && bar.parentElement !== document.body) bar = bar.parentElement;
    var margin = parseFloat(getComputedStyle(t).scrollMarginTop) || 0;
    var top = t.getBoundingClientRect().top + window.scrollY - margin;
    if (bar && top - window.scrollY !== Math.abs(top - window.scrollY)) top -= bar.offsetHeight;   /* uppåt */
    window.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' });
  }
  /* "Så funkar det" -> "sa-funkar-det" */
  function slug(text) {
    return text.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  /* Varje rubrik (h1–h3) i sidans sektioner får ett ankare av sin text, om
     den inte redan har ett id. Skriv id själv i fältet för att styra det. */
  function makeAnchors() {
    document.querySelectorAll('.p2p-main .cc-section :is(h1, h2, h3)').forEach(function (h) {
      if (h.id) return;
      var id = slug(h.textContent);
      if (id && !document.getElementById(id)) h.id = id;
    });
    /* Listan Pågående insamlingar har ingen rubrik-tagg: ankra sektionen */
    var list = document.querySelector('.fundraisersWrapper');
    var sec = list ? list.closest('.cc-section') : null;
    if (sec && !document.getElementById('pagaende-insamlingar')) sec.id = 'pagaende-insamlingar';
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && anyOpen()) closeAll(true);
  });

  /* ---------- Sök ---------- */
  /* Bara 294 räknas: infosidan (308) är också en Summary med en egen lista */
  function onSummary() {
    return location.pathname.indexOf('/start/' + SUMMARY_ID + '/') === 0 && !!document.querySelector('#searchInput');
  }

  function showAll(q) {
    if (onSummary()) {
      var inp = document.querySelector('#searchInput');
      inp.value = q;
      var btn = document.querySelector('#searchBtn');
      if (btn) btn.click();
      closeAll(false);
      var list = document.getElementById('pagaende-insamlingar');
      if (list) scrollToAnchor(list, true);
    } else {
      location.href = SUMMARY_URL + '?sok=' + encodeURIComponent(q) + '#pagaende-insamlingar';
    }
  }

  function fetchHits(q) {
    /* Vänta in konceptfrågorna om de pågår: Adoveo tål inte samtidiga frågor */
    var wait = conceptBusy && conceptMap ? conceptMap : Promise.resolve();
    return wait.then(function () { return searchNow(q); });
  }
  function searchNow(q) {
    var fol = document.querySelector('#folder');
    var body = new URLSearchParams({
      search_name: q,
      campaign_id: SUMMARY_ID,                 /* alltid 294, oavsett sida */
      folder: (fol && fol.value) || FOLDER
    });
    return fetch('/searchP2PCardsData', {
      method: 'POST', body: body, headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).then(function (r) { return r.json(); }).then(function (j) {
      var doc = new DOMParser().parseFromString((j && j.html) || '', 'text/html');
      return Array.prototype.map.call(doc.querySelectorAll('.cc-card'), function (c) {
        var link = c.querySelector('a');
        var img = c.querySelector('img');
        var sums = c.querySelectorAll('span.cc-title');
        return {
          name: ((c.querySelector('p.cc-title') || {}).textContent || '').trim(),
          img: img ? img.getAttribute('src') : '',
          sum: sums.length ? sums[sums.length - 1].textContent.trim() : '',
          href: link ? link.getAttribute('href').replace(/^http:/, 'https:') : '#'
        };
      });
    });
  }

  function renderHits(box, q, hits) {
    box.textContent = '';
    if (!hits.length) {
      box.appendChild(el('p', 'uc-search__empty', 'Ingen insamling matchar "' + q + '". Prova förnamnet eller kolla stavningen.'));
      return;
    }
    box.appendChild(el('p', 'uc-search__label', 'Pågående insamlingar'));
    var grid = el('ul', 'uc-search__grid');
    hits.slice(0, MAX_HITS).forEach(function (h) {
      var li = el('li');
      var a = el('a', 'uc-search__card');
      a.href = h.href;
      var fig = el('span', 'uc-search__img');
      if (h.img) { var im = el('img'); im.src = h.img; im.alt = ''; im.loading = 'lazy'; fig.appendChild(im); }
      a.appendChild(fig);
      a.appendChild(el('span', 'uc-search__name', h.name));
      if (h.sum) a.appendChild(el('span', 'uc-search__sum', h.sum + ' insamlat'));
      li.appendChild(a);
      grid.appendChild(li);
    });
    box.appendChild(grid);
    var all = el('button', 'uc-search__all', 'Visa alla resultat för "' + q + '"');
    all.type = 'button';
    all.addEventListener('click', function () { showAll(q); });
    box.appendChild(all);
  }

  function buildSearch() {
    if (document.getElementById('uc-sok')) return;
    var drawer = el('div', 'uc-drawer uc-drawer--search');
    drawer.id = 'uc-sok';
    var back = el('a', 'uc-drawer__backdrop'); back.href = '#'; back.tabIndex = -1; back.setAttribute('aria-hidden', 'true');
    var panel = el('div', 'uc-drawer__panel');
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Sök insamling');
    var title = el('p', 'uc-search__title', 'Sök');
    var close = el('a', 'uc-drawer__close'); close.href = '#'; close.setAttribute('role', 'button');
    close.appendChild(el('span', 'uc-sr', 'Stäng sök'));
    var form = el('form', 'uc-search__form'); form.setAttribute('role', 'search');
    var label = el('label', 'uc-sr', 'Sök insamling'); label.htmlFor = 'uc-sok-falt';
    var input = el('input', 'uc-search__input');
    input.id = 'uc-sok-falt'; input.type = 'search'; input.autocomplete = 'off';
    input.placeholder = 'Sök på namn eller insamling';
    var submit = el('button', 'uc-search__submit'); submit.type = 'submit';
    submit.appendChild(el('span', 'uc-sr', 'Sök'));
    form.appendChild(label); form.appendChild(input); form.appendChild(submit);
    var results = el('div', 'uc-search__results'); results.setAttribute('aria-live', 'polite');
    panel.appendChild(title); panel.appendChild(close); panel.appendChild(form); panel.appendChild(results);
    drawer.appendChild(back); drawer.appendChild(panel);
    document.body.appendChild(drawer);

    var timer = null, seq = 0;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var q = input.value.trim();
      if (q.length === 0 || q.length === 1) { results.textContent = ''; return; }
      timer = setTimeout(function () {
        var mine = ++seq;
        fetchHits(q).then(function (hits) { if (mine === seq) renderHits(results, q, hits); })
          .catch(function () { if (mine === seq) { results.textContent = ''; results.appendChild(el('p', 'uc-search__empty', 'Sökningen fungerar inte just nu. Försök igen om en stund.')); } });
      }, 250);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (q) showAll(q);
    });
  }

  /* ---------- Insamlingskorten (Pågående insamlingar) ---------- */
  /* Plattformens kort byggs om till samma uppställning som artikelkorten
     på ungcancer.se: bild överst, textruta under, etikett med konceptet i
     hörnet. Hela kortet är en länk som öppnas i samma fönster. Gäller både
     listan och plattformens sökresultat, även kort som laddas med "Se fler". */
  function p2pCode(href) {
    var m = String(href || '').match(/\/p\/([^\/?#]+)/);
    return m ? m[1] : '';
  }
  /* Vilket koncept hör insamlingen till? Plattformen säger det inte på
     kortet, så listan hämtas en gång per koncept och kopplas på länken.
     VIKTIGT: frågorna måste gå EN I TAGET. Adoveo blandar ihop svaren om
     två frågor körs samtidigt (testat 2026-10-23). Därför hålls också
     klick på "Se fler" och "Sök" kvar tills frågorna är klara, och
     resultatet sparas i 10 minuter så att det inte hämtas vid varje sidbyte. */
  var conceptMap = null, conceptBusy = false, heldClick = null;
  var CONCEPT_CACHE = 'uc-koncept', CONCEPT_TTL = 10 * 60 * 1000;
  function byId(id) {
    return MENU_MAIN.filter(function (c) { return c.id === id; })[0] || null;
  }
  function loadConcepts() {
    if (conceptMap) return conceptMap;
    try {
      var saved = JSON.parse(sessionStorage.getItem(CONCEPT_CACHE) || 'null');
      var age = saved ? Date.now() - saved.t : -1;
      if (saved && age >= 0 && CONCEPT_TTL >= age) {
        var m0 = {};
        Object.keys(saved.m).forEach(function (k) { var c = byId(saved.m[k]); if (c) m0[k] = c; });
        return (conceptMap = Promise.resolve(m0));
      }
    } catch (e) { /* ingen sessionStorage: hämta */ }
    var camp = (document.querySelector('#campaignId') || {}).value || SUMMARY_ID;
    var fol = (document.querySelector('#folder') || {}).value || FOLDER;
    var map = {}, ids = {};
    conceptBusy = true;
    conceptMap = MENU_MAIN.reduce(function (prev, c) {
      return prev.then(function () {
        var q = new URLSearchParams({ offset: 0, limit: 1000, campaign_id: camp, single_campaign_id: c.id, folder: fol });
        return fetch('/getP2PCards?' + q, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            var doc = new DOMParser().parseFromString((j && j.html) || '', 'text/html');
            doc.querySelectorAll('.cc-card a[href]').forEach(function (a) {
              var k = p2pCode(a.getAttribute('href'));
              if (k) { map[k] = c; ids[k] = c.id; }
            });
          })
          .catch(function () { /* ett koncept utan svar: korten får ingen etikett */ });
      });
    }, Promise.resolve()).then(function () {
      conceptBusy = false;
      try { sessionStorage.setItem(CONCEPT_CACHE, JSON.stringify({ t: Date.now(), m: ids })); } catch (e) { /* ok */ }
      if (heldClick) { var b = heldClick; heldClick = null; b.click(); }
      return map;
    });
    return conceptMap;
  }
  document.addEventListener('click', function (e) {
    if (!conceptBusy) return;
    var b = e.target.closest ? e.target.closest('#viewMoreBtn, #searchBtn') : null;
    if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation(); heldClick = b;
  }, true);
  document.addEventListener('keypress', function (e) {
    if (!conceptBusy || e.key !== 'Enter' || !e.target.matches || !e.target.matches('#searchInput')) return;
    e.preventDefault(); e.stopImmediatePropagation(); heldClick = document.getElementById('searchBtn');
  }, true);
  /* Texten får så många rader som ryms i rutan och slutar med ... */
  function clampText(card) {
    var t = card.querySelector('.uc-fcard__text');
    if (!t) return;
    t.style.removeProperty('-webkit-line-clamp');
    t.style.removeProperty('max-height');
    var lh = parseFloat(getComputedStyle(t).lineHeight) || 24;
    var n = Math.max(1, Math.floor((t.clientHeight + 2) / lh));
    t.style.setProperty('-webkit-line-clamp', String(n));
    t.style.setProperty('max-height', (n * lh) + 'px');   /* annars syns en halv rad under ... */
  }
  /* Räkna om när kortet byter storlek (fönsterbredd, sökresultat som
     visas, typsnitt som laddas). Kortet har fast format, så omräkningen
     ändrar inte kortets storlek och ger ingen loop. */
  var cardResize = window.ResizeObserver
    ? new ResizeObserver(function (entries) { entries.forEach(function (en) { clampText(en.target); }); })
    : null;
  function conceptLabel(card, map) {
    if (!map || card.querySelector('.uc-fcard__label')) return;
    var a = card.querySelector('.uc-fcard__link');
    var c = a ? map[p2pCode(a.getAttribute('href'))] : null;
    if (!c) return;
    card.style.setProperty('--uc-card-bg', c.bg);      /* textrutan och etiketten */
    card.style.setProperty('--uc-card-ink', c.ink);
    card.appendChild(el('span', 'uc-fcard__label', c.text));
  }
  function upgradeCard(card, map) {
    if (card.classList.contains('uc-fcard')) { conceptLabel(card, map); return; }
    var a = card.querySelector('a[href]');
    var title = card.querySelector('p.cc-title');
    if (!a || !title) return;
    var img = card.querySelector('img');
    var txt = card.querySelector('p.cc-txt');
    var sums = card.querySelectorAll('span.cc-title');
    var sum = sums.length ? sums[sums.length - 1].textContent.trim() : '';
    var name = title.textContent.trim();

    var link = el('a', 'uc-fcard__link');
    link.href = a.getAttribute('href').replace(/^http:/, 'https:');   /* samma fönster: inget target */
    link.setAttribute('aria-label', name + (sum ? ', ' + sum + ' insamlat' : ''));
    var media = el('div', 'uc-fcard__media');
    if (img) { img.removeAttribute('style'); img.alt = ''; img.loading = 'lazy'; media.appendChild(img); }
    var body = el('div', 'uc-fcard__body');
    body.appendChild(el('h3', 'uc-fcard__title', name));
    if (txt && txt.textContent.trim()) body.appendChild(el('p', 'uc-fcard__text', txt.textContent.trim()));
    if (sum) {
      var s = el('p', 'uc-fcard__sum');
      s.appendChild(el('strong', null, sum));
      s.appendChild(document.createTextNode(' insamlat'));
      body.appendChild(s);
    }
    card.textContent = '';
    card.classList.add('uc-fcard');
    card.appendChild(link); card.appendChild(media); card.appendChild(body);
    conceptLabel(card, map);
    clampText(card);
    if (cardResize) cardResize.observe(card);
  }
  function fundraiserCards() {
    var boxes = document.querySelectorAll('#fundraisersDisplay, #searchDisplay');
    if (!boxes.length) return;
    var map = null;
    var run = function () {
      boxes.forEach(function (b) {
        b.querySelectorAll('.cc-card').forEach(function (c) { upgradeCard(c, map); });
      });
    };
    run();
    loadConcepts().then(function (m) { map = m; run(); });
    var mo = new MutationObserver(run);                  /* "Se fler" och sökresultat */
    boxes.forEach(function (b) { mo.observe(b, { childList: true }); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
      document.querySelectorAll('.uc-fcard').forEach(clampText);
    });
  }

  /* ---------- Skapa-sidan: formulär till vänster, telefon till höger ---------- */
  /* Konceptets startsida (/start/ID/). Plattformen har redan en
     förhandsvisning av insamlingssidan (#giftcard-preview-container, öppnas
     med ögat) och fyller den medan man skriver. På bred skärm flyttas den
     ut ur formuläret och visas hela tiden som en telefon bredvid
     formuläret, som i kampanj 300. Under brytpunkten flyttas den tillbaka
     och ögat fungerar som vanligt. */
  var CREATE_MQ = window.matchMedia ? window.matchMedia('(min-width: 1000px)') : null;
  function createLayout() {
    var phase = document.getElementById('phase-before-coupon');
    var box = document.getElementById('giftcard-preview-container');
    var heading = document.getElementById('coupon-heading');
    if (!phase || !box || !heading || !CREATE_MQ || document.querySelector('.uc-create')) return;
    var col = heading.parentElement;              /* rubrik, ingress och formulär */
    var home = box.parentElement, homeNext = box.nextSibling;
    var grid = el('div', 'uc-create');
    col.parentNode.insertBefore(grid, col);
    col.classList.add('uc-create__form');
    grid.appendChild(col);
    var phone = el('div', 'uc-create__phone');
    phone.setAttribute('aria-label', 'Så här blir din insamlingssida');
    grid.appendChild(phone);

    var place = function () {
      var wide = CREATE_MQ.matches;
      root.classList.toggle('uc-create-split', wide);
      if (wide && box.parentElement !== phone) phone.appendChild(box);
      if (!wide && box.parentElement !== home) {
        home.insertBefore(box, homeNext && homeNext.parentNode === home ? homeNext : null);
      }
    };
    place();
    if (CREATE_MQ.addEventListener) CREATE_MQ.addEventListener('change', place);
    else if (CREATE_MQ.addListener) CREATE_MQ.addListener(place);
    /* Flyttar plattformen tillbaka rutan (t.ex. när popupen stängs) */
    new MutationObserver(function () {
      if (CREATE_MQ.matches && box.parentElement !== phone) phone.appendChild(box);
    }).observe(phase, { childList: true, subtree: true });

    /* Innan man skrivit något visar plattformen {your_name} och
       {description} rått. De byts mot fältens etiketter i spökskrift.
       Plattformen bygger om texten vid varje tangent, så det görs om
       varje gång texten ändras. */
    var msg = box.querySelector('#coupon-page-message');
    var label = function (id, fallback) {
      var l = document.getElementById(id);
      return (l && l.textContent.trim()) || fallback;
    };
    var GHOST = { your_name: label('name_label', 'Ditt namn'), description: label('custom_field_3_label', 'Din text') };
    var ghost = function () {
      for (var round = 0; round !== 5; round++) {
        var w = document.createTreeWalker(msg, NodeFilter.SHOW_TEXT), t = null, m = null;
        while (w.nextNode()) {
          m = w.currentNode.nodeValue.match(/\{(your_name|description)\}/);
          if (m) { t = w.currentNode; break; }
        }
        if (!t) return;
        var rest = t.splitText(m.index);
        rest.nodeValue = rest.nodeValue.slice(m[0].length);
        t.parentNode.insertBefore(el('span', 'uc-ghost', GHOST[m[1]]), rest);
      }
    };
    if (msg) {
      ghost();
      new MutationObserver(ghost).observe(msg, { childList: true, characterData: true, subtree: true });
    }

    /* Bilden: visa den valda bilden direkt, utan att vänta på uppladdningen */
    var file = document.getElementById('registration_file_upload');
    var img = box.querySelector('#coupon-page-title img');
    if (file && img) file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      if (f && /^image\//.test(f.type)) img.src = URL.createObjectURL(f);
    });
  }

  /* ---------- Start ---------- */
  function init() {
    removeOldHeaders();
    conceptColors();
    var menu = document.getElementById('uc-meny');
    /* Panelerna flyttas till body: den sticky behållaren får transform vid
       scroll, och fixed inuti en transform hamnar annars fel */
    if (menu && menu.parentNode !== document.body) document.body.appendChild(menu);
    buildSearch();
    var sIcon = document.querySelector('.uc-header__icon--search');
    if (sIcon) sIcon.setAttribute('href', '#uc-sok');

    /* Markera sidan man står på */
    var here = location.pathname.replace(/\/$/, '');
    document.querySelectorAll('.uc-header__link, .uc-drawer__link').forEach(function (a) {
      var u = new URL(a.href, location.href);
      if (u.hash || u.host !== location.host) return;
      if (u.pathname.replace(/\/$/, '') === here) a.setAttribute('aria-current', 'page');
    });

    makeAnchors();
    fundraiserCards();
    createLayout();

    /* Platshållare i plattformens sökfält, samma som i sökpanelen */
    var listSearch = onSummary() ? document.querySelector('#searchInput') : null;
    if (listSearch && !listSearch.placeholder) listSearch.placeholder = 'Sök på namn eller insamling';

    /* ?sok=namn från en annan sida: kör sökningen i listan på Summary */
    var q = new URLSearchParams(location.search).get('sok');
    if (q && onSummary()) setTimeout(function () { showAll(q); }, 300);
    else if (location.hash) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) setTimeout(function () { scrollToAnchor(t, false); }, 0);
    }

    /* Göm headern vid scroll nedåt, visa vid scroll uppåt */
    var head = document.querySelector('.uc-header');
    if (!head) return;
    var bar = head.parentElement === document.body ? head : head.parentElement;
    var last = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var hide = y > last && y > bar.offsetHeight && !anyOpen();
      bar.classList.toggle('uc-header-bar--hidden', hide);
      last = y;
    }, { passive: true });
  }

  if (document.body) { buildShapes(); buildHeader(); }   /* direkt, om scriptet ligger i body */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { buildShapes(); buildHeader(); init(); });
  else { buildShapes(); buildHeader(); init(); }
})();
