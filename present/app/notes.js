// Teacher notes: the course's Markdown documents (bundled by tools/build-notes.py into app/notes-data.js
// as window.NOTES), shown inside the presenter with live code, tickable checklists and search.
(function () {
  const { h } = CC;

  const GROUPS = [
    ['start', 'Start here', 'Read these first: how the course works and how to run a session.'],
    ['module', 'Lesson plans', 'One plan per module: demo script, tasks, Debug It! and reflection.'],
    ['resource', 'Classroom resources', 'Print them, project them, or keep them open while you teach.'],
  ];
  const LOOK = {   // colour and icon for the documents that aren't modules
    overview: ['green', 'flag'], guide: ['pink', 'users'], presenter: ['blue', 'play'],
    cheatsheet: ['yellow', 'code'], 'error-decoder': ['pink', 'bug'], glossary: ['green', 'book'],
    'coding-train': ['blue', 'train'], 'book-map': ['yellow', 'book'],
  };

  const all = () => window.NOTES || [];
  const byId = (id) => all().find((n) => n.id === id);
  const deckFor = (id) => CC.decks.find((d) => d.plan && d.plan.replace(/^.*\//, '').replace(/\.html$/, '') === id);
  CC.notesHref = (plan) => '#/notes/' + plan.replace(/^.*\//, '').replace(/\.html$/, '');

  function look(n) {
    const deck = deckFor(n.id);
    if (deck) return { color: deck.color, art: deck.icon, deck };
    const [color, icon] = LOOK[n.id] || ['green', 'notes'];
    return { color, icon };
  }
  const shortTitle = (n) => n.short || n.title.replace(/^Module \d+:\s*/, '').replace(/\s*\((print this!|kid language)\)$/i, '');
  const badge = (n, L) => L.deck ? h('span.mc-num', String(L.deck.num)) : h('span.mc-num', CC.icon(L.icon));

  // plain text of each document, and which section each bit of text is in (for search)
  let sections = null;
  function searchIndex() {
    if (sections) return sections;
    sections = [];
    for (const n of all()) {
      const tmp = document.createElement('div');
      tmp.innerHTML = n.html;
      let cur = { note: n, id: null, head: shortTitle(n), text: '' };
      sections.push(cur);
      for (const el of tmp.children) {
        if (/^H[23]$/.test(el.tagName)) {
          cur = { note: n, id: el.id, head: el.textContent, text: el.textContent + ' ' };
          sections.push(cur);
        } else cur.text += el.textContent + ' ';
      }
    }
    return sections;
  }
  function search(q) {
    q = q.trim().toLowerCase();
    if (q.length < 2) return [];
    const hits = [];
    for (const s of searchIndex()) {
      const text = s.text.replace(/\s+/g, ' ');
      const at = text.toLowerCase().indexOf(q);
      if (at < 0) continue;
      const start = Math.max(0, at - 50);
      hits.push({ s, score: (s.head.toLowerCase().includes(q) ? 0 : 1),
        before: (start ? '…' : '') + text.slice(start, at), match: text.slice(at, at + q.length), after: text.slice(at + q.length, at + q.length + 80) + '…' });
    }
    return hits.sort((a, b) => a.score - b.score).slice(0, 40);
  }
  function resultList(q, compact) {
    const hits = search(q);
    if (!hits.length) return h('p.muted.tn-none', q.trim().length < 2 ? 'Type at least two letters.' : 'Nothing found for “' + q.trim() + '”.');
    return h('div.tn-results', hits.map(({ s, before, match, after }) => h('a.tn-result', { href: '#/notes/' + s.note.id + (s.id ? '/' + s.id : '') },
      h('span.tn-rdoc', shortTitle(s.note) + (s.id ? ' · ' + s.head : '')),
      compact ? null : h('span.tn-rsnip', before, h('mark', match), after))));
  }
  function searchBox(onInput, placeholder) {
    const input = h('input.ref-search', { type: 'search', placeholder: placeholder || 'Search the teacher notes…', 'aria-label': 'Search the teacher notes' });
    input.addEventListener('input', () => onInput(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const first = search(input.value)[0];
      if (first) location.hash = '#/notes/' + first.s.note.id + (first.s.id ? '/' + first.s.id : '');
    });
    return input;
  }

  // ---------- index ----------
  function indexPage(mount) {
    const groups = h('div.tn-groups');
    const results = h('div.tn-index-results');
    results.hidden = true;
    const box = searchBox((q) => {
      results.hidden = !q.trim();
      groups.hidden = !results.hidden;
      results.replaceChildren(resultList(q));
    });
    groups.append(...GROUPS.map(([g, title, text]) => h('section.tn-group',
      h('div.section-head', h('h2', title), h('p.muted', text)),
      h('div.tn-cards', all().filter((n) => n.group === g).map(card)))));
    mount.replaceChildren(h('div.ref-hero',
      h('div.hero-clouds.inline', CC.cloud('yellow', 'Teacher', 'small'), CC.cloud('green', 'notes', 'big')),
      h('p.lead', 'Lesson plans, the teacher guide and classroom resources, with the same live code as the slides.'),
      h('div.ref-tools', box)), results, groups);
    if (!all().length) mount.append(h('p.ref-none', 'The notes are bundled when the site is built: run ', h('code', './build-site.sh'), ' and open ', h('code', 'site/index.html'), '.'));
  }
  function card(n) {
    const L = look(n);
    const d = L.deck;
    return h('div.tn-card.' + L.color,
      h('a.tn-card-main', { href: '#/notes/' + n.id },
        h('div.mc-top', badge(n, L), L.art ? h('span.mc-art', { html: CC.moduleArt(L.art) }) : null),
        h('strong.mc-title', shortTitle(n)),
        d && d.kidIdea ? h('span.mc-idea', d.kidIdea) : null),
      d ? h('div.tn-card-foot', d.sessions ? h('span', CC.icon('timer'), ' ' + d.sessions) : null, h('span.spacer'),
        h('a.chip', { href: '#/deck/' + d.id + '/1' }, CC.icon('play'), 'Slides')) : null);
  }

  // ---------- one document ----------
  function docPage(n, section, mount) {
    const L = look(n);
    const d = L.deck;
    const article = h('article.ref-article.tn-article.' + L.color);
    const body = h('div.tn-body', { html: n.html });
    enhance(body, n);

    const list = all();
    const at = list.indexOf(n);
    const prev = list[at - 1];
    const next = list[at + 1];
    article.append(
      h('header.tn-head',
        h('p.ref-crumbs', h('a', { href: '#/notes' }, 'Teacher notes'), ' › ', GROUPS.find((g) => g[0] === n.group)[1]),
        h('div.tn-titlerow', badge(n, L),
          h('div', d ? h('p.kicker.' + L.color, 'Module ' + d.num) : null, h('h1.tn-title', shortTitle(n))),
          h('span.spacer'),
          L.art ? h('span.mc-art.tn-art', { html: CC.moduleArt(L.art) }) : null,
          h('button.cta.soft.small.tn-print', { type: 'button', onclick: () => window.print() }, CC.icon('notes'), ' Print')),
        d && d.bigIdea ? h('p.tn-bigidea', { html: CC.md(d.bigIdea) }) : null,
        d ? h('div.row.wrap.tn-actions',
          h('a.cta.small', { href: '#/deck/' + d.id + '/1' }, CC.icon('play'), ' Present the slides'),
          (d.sketches || []).map((s) => h('a.chip', { href: '#/lab/' + encodeURIComponent(s) }, CC.icon('code'), s))) : null),
      body,
      h('nav.tn-pager',
        prev ? h('a.tn-page.prev', { href: '#/notes/' + prev.id }, CC.icon('left'), h('span', h('small', 'Previous'), shortTitle(prev))) : h('span'),
        next ? h('a.tn-page.next', { href: '#/notes/' + next.id }, h('span', h('small', 'Next'), shortTitle(next)), CC.icon('right')) : h('span')));

    // sidebar: search, all documents, this page's sections
    const sideList = h('div.tn-sidelist');
    const showList = (q) => {
      if (q.trim()) { sideList.replaceChildren(resultList(q, true)); return; }
      sideList.replaceChildren(...GROUPS.map(([g, title]) => h('div',
        h('p.ref-sidehead', title),
        list.filter((x) => x.group === g).map((x) => h('a.tn-sideitem' + (x === n ? '.on' : ''), { href: '#/notes/' + x.id }, shortTitle(x))))));
    };
    showList('');
    const heads = [...body.querySelectorAll('h2[id]')];
    const toc = heads.length > 2 ? h('div.tn-toc', h('p.ref-sidehead', 'On this page'),
      heads.map((hd) => h('a', { href: '#/notes/' + n.id + '/' + hd.id }, hd.textContent))) : null;

    mount.replaceChildren(h('div.ref-entry.tn-entry',
      h('aside.ref-side.tn-side', searchBox(showList),
        h('details.tn-contents', { open: innerWidth > 900 }, h('summary.chip', CC.icon('notes'), 'Contents'), toc, sideList)), article));
    document.title = shortTitle(n) + ' · Teacher notes';

    if (section) {
      const target = body.querySelector('#' + CSS.escape(section));
      if (target) requestAnimationFrame(() => { target.scrollIntoView({ block: 'start' }); target.classList.add('flash'); });
    } else window.scrollTo(0, 0);
  }

  // turn the plain pandoc HTML into presenter pieces
  function enhance(body, n) {
    const ticks = CC.store.get('notes-ticks:' + n.id, []);
    body.querySelectorAll('ul.task-list input[type=checkbox]').forEach((box, i) => {
      box.disabled = false;
      box.after(h('span', [...box.parentNode.childNodes].filter((x) => x !== box)));   // one text block next to the box
      box.checked = ticks.includes(i);
      box.addEventListener('change', () => {
        const now = [...body.querySelectorAll('ul.task-list input[type=checkbox]')].map((b, k) => (b.checked ? k : -1)).filter((k) => k >= 0);
        CC.store.set('notes-ticks:' + n.id, now);
        if (box.checked) CC.sound.pop();
      });
    });
    body.querySelectorAll('table').forEach((t) => {
      t.className = 'fun-table';
      t.replaceWith(h('div.table-wrap.tn-table', t.cloneNode(true)));
    });
    body.querySelectorAll('a[href^="http"]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
    body.querySelectorAll('code').forEach((c) => {   // sketch names open in the Sketch Lab
      const name = c.textContent.trim();
      if (c.closest('pre, a') || !(window.SKETCHES || {})[name]) return;
      c.replaceWith(h('a.tn-sketch', { href: '#/lab/' + encodeURIComponent(name), title: 'Open in the Sketch Lab' }, CC.icon('code'), name));
    });
    let count = 0;
    body.querySelectorAll('pre').forEach((pre) => {
      const lang = /\bjs\b|javascript/.test(pre.className) ? 'js' : /\bjava\b|processing/.test(pre.className) ? 'pde' : null;
      if (!lang) { pre.classList.add('notes-plain'); return; }
      const code = pre.textContent.replace(/\n$/, '');
      let head = pre.previousElementSibling;   // the heading this code sits under
      while (head && !/^H[1-4]$/.test(head.tagName)) head = head.previousElementSibling;
      const buggy = !!head && /debug/i.test(head.textContent);
      const runnable = lang === 'pde' && !buggy && /\bvoid\s+(setup|draw)\s*\(|\bsize\s*\(/.test(code) && !/\.\.\./.test(code);
      count += 1;
      const name = (buggy ? 'buggy_' : 'example_') + count;
      const player = CC.Player({ source: code, name, lang, run: false, scrub: false, editable: false });
      pre.replaceWith(h('div.tn-code',
        player.el,
        buggy ? h('p.small.tn-codetag', CC.icon('bug'), ' Bugs on purpose: find them before you run it in Processing.') : null,
        runnable ? h('button.cta.small', { type: 'button', onclick: () => CC.openPlayer(name, code) }, CC.icon('play'), ' Run it here') : null));
      player.enter();
    });
  }

  CC.notesPage = function (id, section, mount) {
    const n = id && byId(id);
    if (id && !n) { location.hash = '#/notes'; return; }
    if (n) docPage(n, section, mount);
    else { indexPage(mount); document.title = 'Teacher notes · Creative Coding Club'; }
  };
})();
