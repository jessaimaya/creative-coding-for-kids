// The Processing reference, served locally (data in reference/, imported by tools/update-processing-reference.sh).
// Content: Processing reference (processing.org/reference), CC BY-NC-SA 4.0.
(function () {
  const { h, md } = CC;

  const R = (CC.REFDOC = {
    langs: {},
    examples: null,
    anchors: {},
    lang: CC.store.get('refLang', 'en'),
    load(data) { this.langs[data.lang] = data; },
    loadExamples(data) { this.examples = data; },
    setIndex(map) { this.anchors = map; },
    // the reference page for a plain name like "ellipse", "if" or "PI" (or null)
    anchorFor(name) { return this.anchors[name] || null; },
  });

  // Load a data script once (works from file://, unlike fetch).
  const loading = {};
  function loadScript(src) {
    if (!loading[src]) {
      loading[src] = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = () => { delete loading[src]; reject(new Error('Could not load ' + src)); };
        document.head.append(s);
      });
    }
    return loading[src];
  }
  R.ready = function () {
    const need = ['reference/en.js', 'reference/examples.js'];
    if (R.lang !== 'en') need.push('reference/' + R.lang + '.js');
    return Promise.all(need.map(loadScript));
  };

  const UI = {
    en: { title: 'Processing Reference', sub: 'Every function in Processing, with examples. A local copy of processing.org/reference.',
      search: 'Search the reference: ellipse, mouseX, for...', description: 'Description', examples: 'Examples', syntax: 'Syntax',
      parameters: 'Parameters', returns: 'Returns', related: 'Related', constructors: 'Constructors', fields: 'Fields', methods: 'Methods',
      run: 'Run it here', copy: 'Copy', picture: 'Picture from processing.org', noRun: 'This example needs files, 3D or features the browser preview doesn\'t have. Try it in Processing!',
      results: 'results', none: 'Nothing found. Try another word.', onSite: 'View on processing.org', untranslated: 'Not translated yet: showing the English text.',
      methodOf: 'Method of', fieldOf: 'Field of', classLabel: 'Class', reference: 'Reference', type: 'Type', name: 'Name', loading: 'Loading the reference...',
      license: 'Content from the Processing reference, CC BY-NC-SA 4.0.', ourDict: 'Kid-friendly explanation', pictureNote: 'The picture shows the official result. "Run it here" shows what the code draws in the browser preview.' },
    es: { title: 'Referencia de Processing', sub: 'Todas las funciones de Processing, con ejemplos. Una copia local de processing.org/reference.',
      search: 'Busca en la referencia: ellipse, mouseX, for...', description: 'Descripción', examples: 'Ejemplos', syntax: 'Sintaxis',
      parameters: 'Parámetros', returns: 'Devuelve', related: 'Relacionado', constructors: 'Constructores', fields: 'Campos', methods: 'Métodos',
      run: 'Ejecutar aquí', copy: 'Copiar', picture: 'Imagen de processing.org', noRun: 'Este ejemplo necesita archivos, 3D u opciones que la vista previa del navegador no tiene. ¡Pruébalo en Processing!',
      results: 'resultados', none: 'No se encontró nada. Prueba otra palabra.', onSite: 'Ver en processing.org', untranslated: 'Aún sin traducir: se muestra el texto en inglés.',
      methodOf: 'Método de', fieldOf: 'Campo de', classLabel: 'Clase', reference: 'Referencia', type: 'Tipo', name: 'Nombre', loading: 'Cargando la referencia...',
      license: 'Contenido de la referencia de Processing, CC BY-NC-SA 4.0.', ourDict: 'Explicación para niños', pictureNote: 'La imagen muestra el resultado oficial. "Ejecutar aquí" muestra lo que dibuja el código en la vista previa del navegador.' },
  };
  const ui = () => UI[R.lang] || UI.en;
  const CATEGORY_ES = { structure: 'Estructura', environment: 'Entorno', data: 'Datos', control: 'Control', shape: 'Forma', input: 'Entrada', output: 'Salida',
    transform: 'Transformar', lights_camera: 'Luces, cámara', color: 'Color', image: 'Imagen', rendering: 'Renderizado', typography: 'Tipografía', math: 'Matemáticas', constants: 'Constantes' };

  const entriesFor = (lang) => (R.langs[lang] && R.langs[lang].entries) || {};
  // The entry in the chosen language, falling back to English.
  // Missing pages, and empty fields inside a translated page, use the English text.
  function entry(anchor) {
    const en = entriesFor('en')[anchor];
    if (!en) return null;
    if (R.lang === 'en') return { e: en, fallback: false };
    const local = entriesFor(R.lang)[anchor];
    if (!local) return { e: en, fallback: true };
    let fallback = false;
    const e = Object.assign({}, en);
    for (const [k, v] of Object.entries(local)) {
      if (v != null && v !== '' && !(Array.isArray(v) && !v.length)) e[k] = v;
    }
    const norm = (t) => (t || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const same = (a, b) => norm(a) === norm(b);
    if (en.d && (!local.d || same(local.d, en.d))) fallback = true;   // the official translation is partial
    if (en.p && local.p) e.p = en.p.map((p, i) => Object.assign({}, p, local.p[i] && local.p[i].d ? { d: local.p[i].d } : {}));
    return { e, fallback };
  }
  const allAnchors = () => Object.keys(entriesFor('en'));
  const catTitle = (id) => R.lang === 'es' ? (CATEGORY_ES[id] || id) : ((R.langs.en.meta.categories.find((c) => c.id === id) || {}).title || id);
  function subTitle(sc) {
    if (!sc) return '';
    const t = R.langs.en.meta.subcategoryTitles[sc];
    return t || sc.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  }
  const displayName = (anchor, e) => (e.ca && (e.t === 'method' || e.t === 'field')) ? e.ca + '.' + e.n.replace(/^\./, '') : e.n;

  // ---------- safe HTML: the descriptions contain a little HTML (b, br, a, em, pre...) ----------
  const ALLOWED = new Set(['B', 'STRONG', 'I', 'EM', 'BR', 'P', 'A', 'PRE', 'CODE', 'TT', 'UL', 'OL', 'LI', 'SUP', 'SUB', 'KBD', 'S']);
  function safeHTML(html) {
    const doc = new DOMParser().parseFromString('<body>' + (html || '') + '</body>', 'text/html');
    const frag = document.createDocumentFragment();
    const copy = (node, into) => {
      for (const child of node.childNodes) {
        if (child.nodeType === 3) { into.append(child.textContent); continue; }
        if (child.nodeType !== 1) continue;
        if (!ALLOWED.has(child.tagName)) { copy(child, into); continue; }
        const tag = child.tagName === 'TT' ? 'code' : child.tagName.toLowerCase();
        const el = document.createElement(tag);
        if (tag === 'a') {
          const href = (child.getAttribute('href') || '').trim();
          const local = /^(?:\.\.\/|\.\/)*([A-Za-z0-9_]+)(?:\.html)?\/?$/.exec(href);
          if (local && entriesFor('en')[local[1]]) el.href = '#/reference/' + local[1];
          else if (/^https?:\/\//.test(href)) { el.href = href; el.target = '_blank'; el.rel = 'noopener'; }
        }
        copy(child, el);
        into.append(el);
      }
    };
    copy(doc.body, frag);
    return frag;
  }
  const rich = (tag, html) => { const el = h(tag); el.append(safeHTML(html)); return el; };
  const plain = (html) => (new DOMParser().parseFromString('<body>' + (html || '') + '</body>', 'text/html').body.textContent || '').replace(/\s+/g, ' ').trim();

  // ---------- search ----------
  function search(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    const out = [];
    for (const anchor of allAnchors()) {
      const { e } = entry(anchor);
      const name = displayName(anchor, e).toLowerCase();
      const bare = name.replace(/\(\)$/, '');
      let score = 0;
      if (bare === q || name === q) score = 100;
      else if (bare.startsWith(q)) score = 80 - bare.length / 100;
      else if (bare.includes(q)) score = 60;
      else if (plain(e.b).toLowerCase().includes(q)) score = 30;
      else if (R.lang !== 'en' && plain(entriesFor('en')[anchor].b).toLowerCase().includes(q)) score = 20;
      if (score) out.push({ anchor, e, score: score - (e.t === 'method' || e.t === 'field' ? 5 : 0) });
    }
    return out.sort((a, b) => b.score - a.score || a.e.n.localeCompare(b.e.n)).slice(0, 60);
  }

  function langToggle(rerender) {
    return h('div.ref-lang', { role: 'group', 'aria-label': 'Language' }, ['en', 'es'].map((l) => h('button.ex-tab' + (R.lang === l ? '.on' : ''), {
      type: 'button', onclick: () => { R.lang = l; CC.store.set('refLang', l); R.ready().then(rerender); },
    }, l === 'en' ? 'English' : 'Español')));
  }

  function searchBox(onResults, initial = '') {
    const input = h('input.ref-search', { type: 'search', placeholder: ui().search, 'aria-label': ui().search, value: initial, autocomplete: 'off' });
    input.addEventListener('input', () => onResults(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const first = search(input.value)[0]; if (first) location.hash = '#/reference/' + first.anchor; }
      if (e.key === 'ArrowDown') { const link = document.querySelector('.ref-results a'); if (link) { e.preventDefault(); link.focus(); } }
    });
    return input;
  }

  function resultsList(q) {
    const res = search(q);
    if (!res.length) return h('p.muted.ref-none', ui().none);
    return h('div.ref-results', h('p.muted.small', res.length + ' ' + ui().results),
      res.map(({ anchor, e }) => h('a.ref-result', { href: '#/reference/' + anchor },
        h('code.ref-rname', displayName(anchor, e)), h('span.ref-rbrief', plain(e.b)),
        h('span.chip', e.ca && (e.t === 'method' || e.t === 'field') ? e.ca : catTitle(e.c)))));
  }

  // ---------- index ----------
  function indexBody() {
    const groups = {};
    for (const anchor of allAnchors()) {
      const { e } = entry(anchor);
      if ((e.t === 'method' || e.t === 'field') && e.ca) continue;
      if (!e.c) continue;
      ((groups[e.c] = groups[e.c] || {})[e.sc] = groups[e.c][e.sc] || []).push([anchor, e]);
    }
    const colors = ['pink', 'yellow', 'green', 'blue'];
    return h('div.ref-cats', R.langs.en.meta.categories.filter((c) => groups[c.id]).map((c, i) =>
      h('section.ref-cat.' + colors[i % 4], h('h3', catTitle(c.id)),
        Object.keys(groups[c.id]).sort((a, b) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b))).map((sc) =>
          h('div.ref-sub', sc ? h('h4', subTitle(sc)) : null,
            h('div.ref-links', groups[c.id][sc].sort((a, b) => a[1].n.localeCompare(b[1].n)).map(([anchor, e]) =>
              h('a.ref-link', { href: '#/reference/' + anchor, title: plain(e.b) }, e.n))))))));
  }

  CC.referencePage = function (anchor, mount) {
    mount.replaceChildren(h('div.ref-loading', CC.icon('book'), ui().loading));
    R.ready().then(() => {
      if (anchor && !entriesFor('en')[anchor]) { location.hash = '#/reference'; return; }
      const rerender = () => CC.referencePage(anchor, mount);
      mount.replaceChildren(anchor ? entryPage(anchor, rerender) : indexPage(rerender));
      if (!anchor) { const s = mount.querySelector('.ref-search'); if (s && !('ontouchstart' in window)) s.focus(); }
    }, (err) => mount.replaceChildren(h('div.ref-loading', CC.icon('bug'), String(err.message || err), h('p.small', 'Run tools/update-processing-reference.sh, then ./build-site.sh.'))));
  };

  function indexPage(rerender) {
    const body = h('div.ref-body', indexBody());
    const box = searchBox((q) => body.replaceChildren(q.trim() ? resultsList(q) : indexBody()));
    return h('div.ref-index',
      h('div.ref-hero', h('div.hero-clouds.inline', CC.cloud('blue', ui().title, 'big')), h('p.lead', ui().sub),
        h('div.ref-tools', box, langToggle(rerender))),
      body,
      h('p.muted.small.ref-license', ui().license + ' ', h('a', { href: 'reference/LICENSE.md', target: '_blank' }, 'LICENSE')));
  }

  // ---------- one entry ----------
  let livePlayers = [];
  function entryPage(anchor, rerender) {
    livePlayers.forEach((p) => p.destroy());
    livePlayers = [];
    const { e, fallback } = entry(anchor);
    const t = ui();
    const parent = e.ca && (e.t === 'method' || e.t === 'field') ? e.ca : null;

    // side: search + the other entries in the same category
    const sideList = h('div.ref-sidelist');
    const fillSide = (q) => {
      if (q && q.trim()) { sideList.replaceChildren(resultsList(q)); return; }
      const same = allAnchors().map((a) => [a, entry(a).e]).filter(([a, x]) => parent ? x.ca === parent : x.c === e.c && !(x.ca && (x.t === 'method' || x.t === 'field')));
      sideList.replaceChildren(h('p.ref-sidehead', parent ? parent : catTitle(e.c)),
        ...same.sort((a, b) => a[1].n.localeCompare(b[1].n)).map(([a, x]) => h('a.dict-item' + (a === anchor ? '.on' : ''), { href: '#/reference/' + a }, x.n)));
    };
    fillSide('');
    const side = h('aside.ref-side', searchBox(fillSide), langToggle(rerender), sideList);

    const ourKey = CC.REF && (CC.REF[e.n.replace(/\(\)$/, '')] ? e.n.replace(/\(\)$/, '') : null);
    const head = h('header.ref-head',
      h('nav.ref-crumbs', h('a', { href: '#/reference' }, t.reference), ' › ', h('a', { href: '#/reference' }, catTitle(e.c) || ''),
        e.sc ? [' › ', h('span', subTitle(e.sc))] : null,
        parent ? [' › ', h('a', { href: '#/reference/' + parent }, parent)] : null),
      h('h2.ref-title', parent ? h('span.muted', parent + '.') : null, e.n.replace(/^\./, '')),
      h('div.row.wrap',
        parent ? h('span.chip', (e.t === 'field' ? t.fieldOf : t.methodOf) + ' ' + parent) : null,
        e.t === 'class' ? h('span.chip', t.classLabel) : null,
        ourKey ? h('a.chip', { href: '#/learn/dictionary/' + encodeURIComponent(ourKey) }, CC.icon('heart'), t.ourDict) : null),
      fallback ? h('p.ref-fallback', CC.icon('bulb'), t.untranslated) : null);

    const sections = [];
    sections.push(h('section.ref-sec', h('h3', t.description), rich('div.ref-desc', e.d || e.b)));

    const ex = (R.examples || {})[anchor] || [];
    if (ex.length) {
      sections.push(h('section.ref-sec', h('h3', t.examples), ex.map((item, k) => {
        const player = CC.Player({ source: item.code, name: anchor.replace(/_$/, '') + (ex.length > 1 ? '_' + k : ''), run: false, scrub: false, editable: false });
        livePlayers.push(player);
        const actions = h('div.row.wrap',
          item.run ? h('button.cta.small', { type: 'button', onclick: () => CC.openPlayer(anchor.replace(/_$/, '') + '_example', item.code) }, CC.icon('play'), ' ' + t.run) : null);
        return h('div.ref-example' + (item.img ? '' : '.no-img'),
          h('div.ref-excode', player.el, actions, item.run ? null : h('p.small.muted', t.noRun)),
          item.img ? h('figure.ref-figure', h('img', { src: 'reference/' + item.img, alt: '', loading: 'lazy', width: 400, height: 400 }), h('figcaption.small.muted', t.picture)) : null);
      }), ex.some((x) => x.img && x.run) ? h('p.small.muted', t.pictureNote) : null));
    }
    if (e.k && e.k.length) sections.push(h('section.ref-sec', h('h3', t.constructors), syntaxBlock(e.k)));
    if (e.s && e.s.length) sections.push(h('section.ref-sec', h('h3', t.syntax), syntaxBlock(e.s)));
    if (e.p && e.p.length) {
      sections.push(h('section.ref-sec', h('h3', t.parameters), h('div.table-wrap', h('table.fun-table',
        h('thead', h('tr', h('th', t.name), h('th', t.type), h('th', t.description))),
        h('tbody', e.p.map((p) => h('tr', h('td', h('code', p.n)), h('td', (p.ty || []).map((x, i) => [i ? ', ' : '', h('code', x)])), h('td', rich('span', p.d)))))))));
    }
    if (e.r) sections.push(h('section.ref-sec', h('h3', t.returns), h('code.ref-returns', e.r)));
    if (e.f && e.f.length) sections.push(listSection(t.fields, e.f));
    if (e.m && e.m.length) sections.push(listSection(t.methods, e.m));
    if (e.rel && e.rel.length) {
      sections.push(h('section.ref-sec', h('h3', t.related), h('div.row.wrap', e.rel.filter((a) => entriesFor('en')[a]).map((a) =>
        h('a.chip', { href: '#/reference/' + a }, displayName(a, entry(a).e))))));
    }
    const article = h('article.ref-article', head, sections,
      h('footer.ref-foot', h('a', { href: 'https://processing.org/reference/' + anchor + '.html', target: '_blank', rel: 'noopener' }, CC.icon('external'), ' ' + t.onSite),
        h('span.muted.small', t.license)));
    return h('div.ref-entry', side, article);
  }

  function syntaxBlock(lines) {
    const tokens = CC.tokenize(lines.join('\n'), 'pde');
    const view = CC.renderCode(tokens, {});
    return h('div.ref-syntax', view.el);
  }
  function listSection(title, items) {
    return h('section.ref-sec', h('h3', title), h('div.table-wrap', h('table.fun-table', h('tbody', items.map((m) =>
      h('tr', h('td', entriesFor('en')[m.a] ? h('a', { href: '#/reference/' + m.a }, h('code', m.n)) : h('code', m.n)), h('td', rich('span', m.d))))))));
  }

  CC.leaveReference = () => { livePlayers.forEach((p) => p.destroy()); livePlayers = []; };
})();
