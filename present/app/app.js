// App shell: dashboard, deck presenter, sketch lab and toolbox, with hash routing.
(function () {
  const { h, md } = CC;
  const app = document.getElementById('app');
  const decks = CC.decks;
  const deckById = (id) => decks.find((d) => d.id === id);

  const TEACHER_LINKS = [
    ['Teacher notes', '#/notes'],
    ['Teacher guide', '#/notes/guide'],
    ['Cheat sheet', '#/notes/cheatsheet'],
    ['Error decoder', '#/notes/error-decoder'],
    ['Glossary', '#/notes/glossary'],
    ['Coding Train guide', '#/notes/coding-train'],
    ['Book map', '#/notes/book-map'],
  ];

  // ---------------- shared top bar ----------------
  function topbar(active) {
    const link = (href, label, key) => h('a.nav-link' + (active === key ? '.on' : ''), { href }, label);
    return h('header.topbar',
      h('a.brand', { href: '#/' }, h('span.brand-mark', CC.icon('code')), h('span.brand-name', 'Creative Coding Club')),
      h('nav.nav', link('#/', 'Lessons', 'home'), link('#/learn', 'How code works', 'learn'), link('#/reference', 'Reference', 'reference'), link('#/lab', 'Sketch Lab', 'lab'), link('#/tools', 'Toolbox', 'tools'), link('#/notes', 'Teacher notes', 'notes')),
      soundToggle());
  }
  function soundToggle() {
    const b = CC.btn(CC.sound.on ? 'sound' : 'mute', 'Sound on/off', () => {
      CC.sound.toggle();
      b.replaceWith(soundToggle());
    }, { cls: 'ghost' });
    return b;
  }

  // ---------------- dashboard ----------------
  const HERO_SKETCH = (w, hgt) => `// The Creative Coding Club playground. It's a Processing sketch too!
// Move the mouse to push the shapes. Click to add a new one.
ArrayList<Blob> blobs = new ArrayList<Blob>();
color[] palette = new color[5];

void setup() {
  size(${w}, ${hgt});
  palette[0] = color(245, 155, 192);   // pink
  palette[1] = color(255, 197, 61);    // yellow
  palette[2] = color(255, 255, 255);   // white
  palette[3] = color(108, 134, 255);   // blue
  palette[4] = color(35, 48, 61);      // ink
  for (int i = 0; i < 22; i++) {       // CHANGE ME: how many shapes
    blobs.add(new Blob(random(width), random(height)));
  }
}

void draw() {
  background(87, 185, 106);
  for (int i = 0; i < blobs.size(); i++) {
    Blob b = blobs.get(i);
    b.move();
    b.show();
  }
}

void mousePressed() {
  blobs.add(new Blob(mouseX, mouseY));
}

class Blob {
  float x, y, vx, vy, size, angle, spin;
  int kind;
  color c;

  Blob(float x, float y) {
    this.x = x;
    this.y = y;
    vx = random(-1, 1);
    vy = random(-1, 1);
    size = random(18, 48);
    kind = int(random(3));             // 0 circle, 1 square, 2 triangle
    c = palette[int(random(5))];
    spin = random(-0.03, 0.03);
  }

  void move() {
    float d = dist(x, y, mouseX, mouseY);
    if (d < 90 && d > 0) {             // too close to the mouse? get pushed away
      vx = vx + (x - mouseX) / d * 0.6;
      vy = vy + (y - mouseY) / d * 0.6;
    }
    vx = vx * 0.98;                    // slow down a little
    vy = vy * 0.98;
    x = x + vx + sin(frameCount * 0.02 + size) * 0.4;
    y = y + vy + cos(frameCount * 0.02 + size) * 0.4;
    angle = angle + spin;
    if (x < 0 || x > width) vx = -vx;
    if (y < 0 || y > height) vy = -vy;
    x = constrain(x, 0, width);
    y = constrain(y, 0, height);
  }

  void show() {
    pushMatrix();
    translate(x, y);
    rotate(angle);
    noStroke();
    fill(c);
    if (kind == 0) {
      ellipse(0, 0, size, size);
    } else if (kind == 1) {
      rect(-size / 2, -size / 2, size, size, 8);
    } else {
      triangle(-size / 2, size / 2, 0, -size / 2, size / 2, size / 2);
    }
    popMatrix();
  }
}
`;

  function progressOf(deck) {
    const total = deck.slides.length;
    const seen = CC.store.get('seen:' + deck.id, -1);
    return { total, seen: Math.min(seen + 1, total), pos: CC.store.get('pos:' + deck.id, 0) };
  }

  function moduleCard(deck, i) {
    const p = progressOf(deck);
    const pct = Math.round((p.seen / p.total) * 100);
    const color = deck.color || CC.colorOf(i);
    const done = pct >= 100;
    return h('a.module-card.' + color + (done ? '.done' : ''), { href: '#/deck/' + deck.id + (p.pos ? '/' + (p.pos + 1) : '') },
      h('div.mc-top', h('span.mc-num', deck.num === 0 ? 'Hi!' : String(deck.num).padStart(2, '0')),
        h('span.mc-art', { html: CC.moduleArt(deck.icon) }),
        done ? h('span.mc-done', CC.icon('check'), 'done') : null),
      h('h3.mc-title', deck.title),
      h('p.mc-idea', { html: md(deck.kidIdea || deck.bigIdea) }),
      h('div.mc-foot',
        h('span.mc-meta', deck.sessions || ''),
        h('span.mc-progress', { 'aria-label': pct + '% of slides seen' }, h('span', { style: { width: pct + '%' } }))));
  }

  function dashboard() {
    const lastDeck = CC.store.get('lastDeck', null);
    const cont = lastDeck && deckById(lastDeck);
    const heroFrame = h('div.hero-sketch');
    const heroStage = { s: null };
    const hero = h('section.hero',
      CC.badges([['star', 'yellow', '3%', '12%', 44], ['heart', 'pink', '46%', '8%', 36], ['play', 'blue', '40%', '84%', 40]]),
      h('div.hero-text',
        h('div.hero-clouds', CC.cloud('yellow', 'Creative Coding', 'small'), CC.cloud('pink', 'Club', 'big')),
        h('p.hero-lead', 'Change a number. Press ', h('strong', 'Run'), '. See what happens!'),
        h('div.row.wrap',
          cont ? h('a.cta', { href: '#/deck/' + cont.id + '/' + (progressOf(cont).pos + 1) }, CC.icon('play'), ' Continue: ' + cont.title) : null,
          h('a.cta' + (cont ? '.soft' : ''), { href: '#/deck/' + (decks[0] && decks[0].id) }, CC.icon('flag'), cont ? ' From the start' : ' Start here'),
          h('a.cta.soft', { href: '#/lab' }, CC.icon('code'), ' Sketch Lab'))),
      h('div.hero-right', heroFrame,
        h('p.hero-caption', 'This is a Processing sketch too. Move your mouse, click to add shapes. ',
          h('button.link-btn', { type: 'button', onclick: () => CC.openPlayer('playground', heroSource) }, 'See the code'))));
    let heroSource = HERO_SKETCH(520, 340);

    const cards = h('div.module-grid', decks.map(moduleCard));
    const tools = h('div.tool-grid',
      toolTile('timer', 'Timer', 'Countdowns for work time', 'yellow', () => CC.timer.open()),
      toolTile('dice', "Who's next?", 'Pick a name, fairly', 'pink', () => CC.picker.open()),
      toolTile('pen', 'Whiteboard', 'Draw over anything (W)', 'blue', () => CC.whiteboard.toggle('home')),
      toolTile('hash', 'Grid paper', 'Coordinates from (0, 0)', 'green', () => openGridBoard()));

    const page = h('div.page.dashboard', topbar('home'), hero,
      h('section.section', h('div.section-head', h('h2', 'The path'), h('p.muted', 'Pick a module to present. Your place is saved on this computer.')), cards),
      h('section.section', h('div.section-head', h('h2', 'How code works'), h('p.muted', 'Interactive explainers. Tip: click any word in the code on a slide to see what it means.')), learnGrid()),
      h('section.section', h('div.section-head', h('h2', 'Quick tools'), h('p.muted', 'Also on every slide: T timer, P picker, W whiteboard.')), tools),
      footer());
    app.replaceChildren(page);

    // Size the hero sketch to its frame (no CSS scaling, so the mouse stays accurate).
    const w = Math.max(240, Math.min(560, Math.floor(heroFrame.clientWidth) - 16));   // minus the white frame
    const hgt = Math.round(w * 0.66);
    heroSource = HERO_SKETCH(w, hgt);
    heroStage.s = CC.Stage(heroSource, 'playground');
    heroFrame.append(heroStage.s.el);
    heroStage.s.start();
  }

  function toolTile(icon, title, text, color, onclick) {
    return h('button.tool-tile.' + color, { type: 'button', onclick }, h('span.tt-icon', CC.icon(icon)), h('strong', title), h('span.muted', text));
  }

  function footer() {
    return h('footer.footer', h('div.footer-links', TEACHER_LINKS.map(([l, href]) => h('a', { href }, l))),
      h('p.muted.small', 'Sketches run in the browser with Processing.js, a preview of real Processing. Fonts: Fredoka, Nunito, JetBrains Mono (SIL OFL).'));
  }

  function openGridBoard() {
    const slide = { type: 'whiteboard', title: 'Grid paper', grid: true, text: '(0, 0) is the **top-left** corner. x grows to the right, y grows **down**.' };
    const s = CC.slideTypes.whiteboard(slide, {});
    const { box } = CC.overlay('board-slide-overlay', () => s.leave());
    box.append(h('div.board-slide-card', s.el, h('button.icon-close', { type: 'button', 'aria-label': 'Close', onclick: () => box.click() }, CC.icon('close'))));
    s.enter();
  }

  // ---------------- deck presenter ----------------
  const deckState = { deck: null, index: 0, step: 0, slide: null, view: null, built: null };

  function presentDeck(id, slideNo) {
    const deck = deckById(id);
    if (!deck) { location.hash = '#/'; return; }
    CC.store.set('lastDeck', id);
    if (deckState.deck !== deck || !deckState.view || !deckState.view.isConnected) buildDeckView(deck);
    goTo(Math.max(0, Math.min(deck.slides.length - 1, (slideNo || 1) - 1)), deckState.wantLastStep ? 'last' : 0);
    deckState.wantLastStep = false;
  }

  function buildDeckView(deck) {
    deckState.deck = deck;
    const stage = h('main.deck-stage', { 'aria-live': 'polite' });
    const dots = h('div.dots');
    const counter = h('span.counter');
    const notes = h('aside.notes-drawer', { hidden: true });
    const overview = h('div.overview', { hidden: true });
    const bar = h('nav.deck-bar', { 'aria-label': 'Slide controls' },
      h('a.btn.ghost', { href: '#/', 'aria-label': 'Back to the lessons', title: 'Lessons (Esc)' }, CC.icon('home')),
      h('span.deck-chip.' + deck.color, deck.num === 0 ? 'Welcome' : String(deck.num).padStart(2, '0') + ' · ' + deck.title),
      dots,
      h('span.spacer'),
      counter,
      CC.btn('left', 'Previous', () => prev(), { key: '←' }),
      CC.btn('right', 'Next', () => next(), { key: '→ or Space', cls: 'next' }),
      h('span.sep'),
      CC.btn('grid', 'All slides', () => toggleOverview(), { key: 'O' }),
      CC.btn('pen', 'Whiteboard', () => CC.whiteboard.toggle(location.hash), { key: 'W' }),
      CC.btn('timer', 'Timer', () => CC.timer.open(), { key: 'T' }),
      CC.btn('dice', "Who's next?", () => CC.picker.open(), { key: 'P' }),
      CC.btn('notes', 'Teacher notes', () => toggleNotes(), { key: 'N' }),
      soundToggle(),
      CC.btn('expand', 'Full screen', () => toggleFullscreen(), { key: 'F' }));
    const view = h('div.deck-view.' + deck.color, stage, notes, overview, bar);
    app.replaceChildren(view);
    Object.assign(deckState, { view, stage, dots, counter, notes, overview });
    dots.replaceChildren(...deck.slides.map((s, i) => h('button.dot', { type: 'button', 'aria-label': 'Slide ' + (i + 1), onclick: () => go(i) })));
  }

  function slideHash(i) { return '#/deck/' + deckState.deck.id + '/' + (i + 1); }
  function go(i, lastStep) {
    if (lastStep) deckState.wantLastStep = true;
    location.hash = slideHash(i);
  }

  function goTo(index, step) {
    const { deck } = deckState;
    if (deckState.built && deckState.index === index && deckState.view.contains(deckState.built.el)) {
      setStep(step === 'last' ? deckState.built.steps : step);
      return;
    }
    if (deckState.built) { try { deckState.built.leave(); } catch (e) { console.error(e); } }
    CC.stopAllPlayers();
    if (CC.whiteboard.el) CC.whiteboard.close();
    const slide = deck.slides[index];
    const make = CC.slideTypes[slide.type];
    let built;
    try {
      built = make ? make(slide, deck) : null;
    } catch (e) {
      console.error(e);
      built = null;
    }
    if (!built) built = { el: CC.slideFrame({ type: 'list', title: 'Unknown slide type: ' + slide.type }, ''), steps: 0, step() {}, enter() {}, leave() {} };
    const dir = index >= deckState.index ? 'fwd' : 'back';
    built.el.classList.add('enter-' + dir);
    deckState.stage.replaceChildren(built.el);
    deckState.index = index;
    deckState.built = built;
    try { built.enter(); } catch (e) { console.error(e); }
    setStep(step === 'last' ? built.steps : step);
    CC.store.set('pos:' + deck.id, index);
    if (index > CC.store.get('seen:' + deck.id, -1)) CC.store.set('seen:' + deck.id, index);
    deckState.counter.textContent = (index + 1) + ' / ' + deck.slides.length;
    [...deckState.dots.children].forEach((d, i) => { d.classList.toggle('on', i === index); d.classList.toggle('seen', i < index); });
    renderNotes();
    if (!deckState.overview.hidden) renderOverview();
    document.title = (slide.title ? slide.title.replace(/[`*]/g, '') + ' · ' : '') + deck.title + ' · Creative Coding Club';
  }

  function setStep(n) {
    const b = deckState.built;
    deckState.step = Math.max(0, Math.min(n, b.steps));
    try { b.step(deckState.step); } catch (e) { console.error(e); }
    deckState.stage.classList.toggle('has-more', deckState.step < b.steps);
  }

  function next() {
    const b = deckState.built;
    if (b && deckState.step < b.steps) { setStep(deckState.step + 1); return; }
    if (deckState.index < deckState.deck.slides.length - 1) { go(deckState.index + 1); CC.sound.blip(); }
    else finishDeck();
  }
  function prev() {
    if (deckState.step > 0) { setStep(deckState.step - 1); return; }
    if (deckState.index > 0) go(deckState.index - 1, true);
  }
  function finishDeck() {
    const deck = deckState.deck;
    const nextDeck = decks[decks.indexOf(deck) + 1];
    CC.confetti();
    CC.sound.chime();
    const { box, close } = CC.overlay('finish-overlay');
    box.append(h('div.finish-card', CC.cloud('yellow', 'Well done!', 'big'),
      h('p.lead', 'That was the last slide of ', h('strong', deck.title), '.'),
      h('div.row.center',
        nextDeck ? h('a.cta', { href: '#/deck/' + nextDeck.id, onclick: close }, CC.icon('right'), ' Next: ' + nextDeck.title) : null,
        h('a.cta.soft', { href: '#/', onclick: close }, CC.icon('home'), ' All lessons'))));
  }

  function toggleNotes() {
    deckState.notes.hidden = !deckState.notes.hidden;
    renderNotes();
  }
  function renderNotes() {
    const { notes, deck, index } = deckState;
    if (notes.hidden) return;
    const slide = deck.slides[index];
    notes.replaceChildren(
      h('div.notes-head', CC.icon('notes'), h('strong', 'Teacher notes'), h('span.spacer'), h('button.icon-close', { type: 'button', 'aria-label': 'Close notes', onclick: toggleNotes }, CC.icon('close'))),
      h('div.notes-body', { html: md(slide.notes || 'No notes for this slide.') }),
      deck.plan ? h('a.small', { href: CC.notesHref(deck.plan), target: '_blank' }, CC.icon('external'), ' Full lesson plan') : '');
  }

  function toggleOverview() {
    deckState.overview.hidden = !deckState.overview.hidden;
    if (!deckState.overview.hidden) renderOverview();
  }
  function renderOverview() {
    const { overview, deck, index } = deckState;
    overview.replaceChildren(h('div.overview-head', h('h2', deck.title), h('button.icon-close', { type: 'button', 'aria-label': 'Close', onclick: toggleOverview }, CC.icon('close'))),
      h('div.overview-grid', deck.slides.map((s, i) => {
        const label = s.type === 'title' ? 'Title' : (s.kicker || ({ hook: 'Look!', big: 'Big idea', act: 'Unplugged', predict: 'Predict', code: 'Live code', tasks: 'Your turn', challenge: 'Create!', debug: 'Debug it!', vocab: 'Words', ican: 'I can', share: 'Share', whiteboard: 'Whiteboard', codingtrain: 'Coding Train', compare: 'Compare', mixer: 'Play', flow: 'Map' }[s.type] || ''));
        return h('button.ov-card.' + CC.colorOf(i) + (i === index ? '.on' : ''), { type: 'button', onclick: () => { toggleOverview(); go(i); } },
          h('span.ov-n', String(i + 1)), h('span.ov-kind', label), h('span.ov-title', { html: md(s.title || (s.type === 'title' ? deck.title : '')) }));
      })));
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen && document.exitFullscreen();
    else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {});
  }

  // ---------------- sketch lab ----------------
  function labGroups() {
    const all = Object.keys(window.SKETCHES || {});
    const groups = decks.filter((d) => d.sketches && d.sketches.length).map((d) => ({ deck: d, names: d.sketches.filter((n) => all.includes(n)) }));
    const listed = new Set(groups.flatMap((g) => g.names));
    const rest = all.filter((n) => !listed.has(n));
    if (rest.length) groups.push({ deck: { title: 'More sketches', num: '', color: 'blue' }, names: rest });
    return groups;
  }
  function describe(name) {
    const first = (CC.sketchSource(name).split('\n')[0] || '').replace(/^\/\/\s*/, '').replace(/^MODULE \d+\s*-\s*/i, '');
    return first;
  }

  // Thumbnails: run each sketch briefly off-screen and keep a picture. One at a time.
  const thumbCache = new Map();
  const thumbQueue = [];
  let thumbBusy = false;
  function thumb(name, img) {
    if (thumbCache.has(name)) { img.src = thumbCache.get(name); img.classList.add('ready'); return; }
    thumbQueue.push([name, img]);
    setTimeout(pumpThumbs, 0);   // after the cards are on the page
  }
  function pumpThumbs() {
    if (thumbBusy || !thumbQueue.length) return;
    const [name, img] = thumbQueue.shift();
    if (!img.isConnected) { pumpThumbs(); return; }
    thumbBusy = true;
    const holder = h('div.offscreen');
    const canvas = h('canvas');
    holder.append(canvas);
    document.body.append(holder);
    const savedLogger = Processing.logger;
    Processing.logger = { println() {}, print() {}, log() {} };
    let p = null;
    try {
      p = new Processing(canvas, CC.compile(CC.sketchSource(name)));
      CC.kickLoop(p, CC.sketchSource(name), () => holder.isConnected);
    } catch (e) { /* no thumbnail */ }
    setTimeout(() => {
      try {
        const url = canvas.toDataURL('image/png');
        thumbCache.set(name, url);
        img.src = url;
        img.classList.add('ready');
      } catch (e) { /* leave the placeholder */ }
      try { p && p.exit(); } catch (e) { /* gone */ }
      Processing.logger = savedLogger;
      holder.remove();
      thumbBusy = false;
      pumpThumbs();
    }, 700);
  }

  function lab() {
    const groups = labGroups();
    const page = h('div.page.lab', topbar('lab'),
      h('section.section.lab-head', h('div.hero-clouds.inline', CC.cloud('blue', 'Sketch Lab', 'big')),
        h('p.lead', 'Every sketch in the course, ready to run. Open one to drag the numbers, edit the code, or copy it into Processing.')),
      groups.map((g) => h('section.section',
        h('div.section-head', h('h2', g.deck.num !== '' && g.deck.num != null ? (g.deck.num === 0 ? '' : String(g.deck.num).padStart(2, '0') + ' · ') + g.deck.title : g.deck.title)),
        h('div.sketch-grid', g.names.map((name, i) => {
          const img = h('img.thumb', { alt: '', width: 400, height: 300 });
          const card = h('a.sketch-card.' + CC.colorOf(i), { href: '#/lab/' + name },
            h('span.thumb-wrap', img), h('strong', name), h('span.muted.small', describe(name)));
          thumb(name, img);
          return card;
        })))),
      footer());
    app.replaceChildren(page);
  }

  function labSketch(name) {
    if (!(window.SKETCHES || {})[name]) { location.hash = '#/lab'; return; }
    const deck = decks.find((d) => (d.sketches || []).includes(name));
    const player = CC.Player({ source: CC.sketchSource(name), name });
    const page = h('div.page.lab-player', topbar('lab'),
      h('div.lab-bar', h('a.cta.soft.small', { href: '#/lab' }, CC.icon('left'), ' All sketches'),
        h('h2', name), h('span.muted', describe(name)), h('span.spacer'),
        deck ? h('a.chip', { href: '#/deck/' + deck.id }, CC.icon('book'), 'Lesson: ' + deck.title) : null),
      h('div.lab-stage', player.el),
      h('p.muted.small.center', 'Tip: drag the yellow numbers, or press Edit to change anything. Ctrl+Enter runs your edits.'));
    app.replaceChildren(page);
    player.enter();
  }

  // ---------------- how code works ----------------
  function learnGrid() {
    return h('div.learn-grid', CC.LEARN.map((l) => h('a.learn-card.' + l.color, { href: l.href || '#/learn/' + l.id },
      h('span.mc-art', { html: CC.moduleArt(l.icon) }), h('strong', l.title), h('p', { html: md(l.text) }))));
  }
  function learnHub() {
    app.replaceChildren(h('div.page.learn', topbar('learn'),
      h('section.section', h('div.hero-clouds.inline', CC.cloud('green', 'How code works', 'big')),
        h('p.lead', 'Play with the ideas behind the code. Every explainer shows the real code it makes.'), learnGrid()),
      footer()));
  }
  let learnExplorer = null;
  function learnPage(id, extra) {
    if (learnExplorer) { learnExplorer.leave(); learnExplorer = null; }
    const item = CC.LEARN.find((l) => l.id === id);
    if (!item) { location.hash = '#/learn'; return; }
    const tabsRow = h('div.learn-tabs', CC.LEARN.map((l) => h('a.chip' + (l.id === id ? '.on' : ''), { href: l.href || '#/learn/' + l.id }, l.title)));
    let body;
    if (id === 'dictionary') body = CC.dictionaryPage(extra ? decodeURIComponent(extra) : null);
    else { learnExplorer = item.make(); body = learnExplorer.el; }
    app.replaceChildren(h('div.page.learn-page', topbar('learn'),
      h('div.learn-bar', h('a.cta.soft.small', { href: '#/learn' }, CC.icon('left'), ' All explainers'), h('h2', item.title), tabsRow),
      h('div.learn-stage' + (id === 'dictionary' ? '.dict' : ''), body)));
    if (learnExplorer) learnExplorer.enter();
  }

  // ---------------- Processing reference ----------------
  function referenceRoute(anchor) {
    let mount = document.querySelector('.ref-mount');
    if (!mount) {
      mount = h('div.ref-mount');
      app.replaceChildren(h('div.page.reference', topbar('reference'), mount, footer()));
    }
    CC.referencePage(anchor, mount);
    window.scrollTo(0, 0);
  }

  // ---------------- teacher notes ----------------
  function notesRoute(id, section) {
    app.replaceChildren(h('div.page.notes', topbar('notes'), h('div.ref-mount.tn-mount'), footer()));
    CC.notesPage(id, section, app.querySelector('.tn-mount'));
  }

  // ---------------- toolbox ----------------
  function toolbox() {
    const page = h('div.page.toolbox', topbar('tools'),
      h('section.section', h('div.hero-clouds.inline', CC.cloud('yellow', 'Toolbox', 'big')),
        h('div.tool-grid.big',
          toolTile('timer', 'Timer', 'Big countdown with a chime at the end', 'yellow', () => CC.timer.open()),
          toolTile('dice', "Who's next?", 'Picks a name; everyone gets a turn', 'pink', () => CC.picker.open()),
          toolTile('pen', 'Whiteboard', 'Draw over the screen like the Coding Train whiteboard', 'blue', () => CC.whiteboard.toggle('tools')),
          toolTile('hash', 'Grid paper', 'A labelled 400 × 400 canvas grid', 'green', () => openGridBoard()))),
      h('section.section', h('div.section-head', h('h2', 'Keyboard shortcuts'), h('p.muted', 'While presenting a lesson.')), shortcutsTable()),
      footer());
    app.replaceChildren(page);
  }

  const SHORTCUTS = [
    ['→  Space  PageDown', 'Next reveal or slide'], ['←  PageUp', 'Back'], ['Home / End', 'First / last slide'],
    ['O', 'All slides'], ['W', 'Whiteboard over the slide'], ['T', 'Timer'], ['P', "Who's next?"], ['N', 'Teacher notes'],
    ['F', 'Full screen'], ['M', 'Sound on/off'], ['Esc', 'Close / back to lessons'], ['?', 'This help'],
    ['Drag a yellow number', 'Change it and re-run the sketch'], ['Click the sketch', 'Send keys to the sketch (Esc to undo)'],
  ];
  function shortcutsTable() {
    return h('div.table-wrap', h('table.fun-table', h('tbody', SHORTCUTS.map(([k, v]) => h('tr', h('td', h('kbd', k)), h('td', v))))));
  }
  function help() {
    const { box, close } = CC.overlay('help-overlay');
    box.append(h('div.help-card', h('h2', 'Shortcuts'), shortcutsTable(), h('button.icon-close', { type: 'button', 'aria-label': 'Close', onclick: close }, CC.icon('close'))));
  }

  // ---------------- keyboard ----------------
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    const typing = t.closest && t.closest('input, textarea, select, [contenteditable], canvas');
    if (typing) return;
    const overlays = document.querySelectorAll('.overlay');
    if (overlays.length) {
      if (e.key === 'Escape') overlays[overlays.length - 1].click();
      return;
    }
    if (e.key === 'Escape' && CC.whiteboard.el) { CC.whiteboard.close(); return; }
    const inDeck = deckState.view && deckState.view.isConnected;
    const key = e.key;
    if (key === '?') { help(); return; }
    if (key === 't' || key === 'T') { CC.timer.open(); return; }
    if (key === 'p' || key === 'P') { CC.picker.open(); return; }
    if (key === 'w' || key === 'W') { CC.whiteboard.toggle(location.hash); return; }
    if (key === 'm' || key === 'M') { CC.sound.toggle(); return; }
    if (key === 'f' || key === 'F') { toggleFullscreen(); return; }
    if (!inDeck || CC.whiteboard.el) return;
    if (t.closest && t.closest('.scrub') && (key === 'ArrowUp' || key === 'ArrowDown')) return;
    if (t.closest && t.closest('button, a, summary') && (key === ' ' || key === 'Enter')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp'].includes(key)) { e.preventDefault(); prev(); }
    else if (key === 'Home') go(0);
    else if (key === 'End') go(deckState.deck.slides.length - 1);
    else if (key === 'o' || key === 'O') toggleOverview();
    else if (key === 'n' || key === 'N') toggleNotes();
    else if (key === 'Escape') { if (!deckState.overview.hidden) toggleOverview(); else location.hash = '#/'; }
  });

  // ---------------- router ----------------
  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (parts[0] !== 'deck') {
      if (deckState.built) { try { deckState.built.leave(); } catch (e) { /* ignore */ } }
      deckState.built = null;
      deckState.view = null;
      CC.stopAllPlayers();
      if (learnExplorer) { learnExplorer.leave(); learnExplorer = null; }
      if (CC.leaveReference) CC.leaveReference();
      if (CC.whiteboard.el) CC.whiteboard.close();
      document.title = 'Creative Coding Club';
      if (!(parts[0] === 'learn' && parts[1] === 'dictionary') && !(parts[0] === 'reference' && parts[1]) && !(parts[0] === 'notes' && parts[2])) window.scrollTo(0, 0);
    }
    if (parts[0] === 'deck') presentDeck(parts[1], parseInt(parts[2], 10) || 1);
    else if (parts[0] === 'reference') referenceRoute(parts[1] ? decodeURIComponent(parts[1]) : null);
    else if (parts[0] === 'learn' && parts[1]) learnPage(parts[1], parts[2]);
    else if (parts[0] === 'learn') learnHub();
    else if (parts[0] === 'lab' && parts[1]) labSketch(decodeURIComponent(parts[1]));
    else if (parts[0] === 'lab') lab();
    else if (parts[0] === 'notes') notesRoute(parts[1] && decodeURIComponent(parts[1]), parts[2] && decodeURIComponent(parts[2]));
    else if (parts[0] === 'tools') toolbox();
    else dashboard();
  }
  window.addEventListener('hashchange', route);
  route();
})();
