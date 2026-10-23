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
  /* Nivå 1: visas i mitten av headern på desktop och överst i menypanelen */
  var MENU_MAIN = [
    { text: 'Födelsedag', href: BASE + '295/?location=summary' },
    { text: 'Utmaning',   href: BASE + '297/?location=summary' },
    { text: 'Till minne', href: BASE + '298/?location=summary' },
    { text: 'Stå bakom',  href: BASE + '299/?location=summary' }
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

  /* ---------- Start ---------- */
  function init() {
    removeOldHeaders();
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

  if (document.body) buildHeader();           /* direkt, om scriptet ligger i body */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { buildHeader(); init(); });
  else { buildHeader(); init(); }
})();
