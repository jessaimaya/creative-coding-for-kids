// Slide types. Each one returns { el, steps, step(i), enter(), leave() }.
// "steps" are reveals inside a slide: → shows the next one before moving to the next slide.
(function () {
  const { h, md } = CC;
  const T = CC.slideTypes;

  const KINDS = {
    hook: ['Look!', 'eye', 'pink'],
    big: ['Big idea', 'bulb', 'yellow'],
    act: ['Unplugged', 'users', 'green'],
    predict: ['Predict', 'eye', 'blue'],
    code: ['Live code', 'code', 'green'],
    tasks: ['Your turn', 'edit', 'pink'],
    challenge: ['Create!', 'star', 'yellow'],
    debug: ['Debug it!', 'bug', 'pink'],
    vocab: ['New words', 'book', 'blue'],
    ican: ['I can...', 'check', 'green'],
    share: ['Share', 'heart', 'pink'],
    whiteboard: ['Whiteboard', 'pen', 'blue'],
    codingtrain: ['Coding Train challenge', 'train', 'yellow'],
    list: ['', 'sparkle', 'green'],
    table: ['', 'grid', 'blue'],
    compare: ['Side by side', 'code', 'blue'],
    mixer: ['Play', 'sparkle', 'pink'],
    flow: ['Map', 'flag', 'yellow'],
    coords: ['Explore', 'hash', 'blue'],
    colours: ['Explore', 'sparkle', 'pink'],
    shapes: ['Explore', 'grid', 'yellow'],
    anatomy: ['How code works', 'code', 'green'],
  };

  const simple = (el, extra = {}) => Object.assign({ el, steps: 0, step() {}, enter() {}, leave() {} }, extra);

  function timerButton(minutes, label) {
    return h('button.chip.timer-chip', { type: 'button', onclick: () => CC.timer.open(minutes) }, CC.icon('timer'), (label || 'Timer') + ': ' + minutes + ' min');
  }

  // Common frame: kicker chip + title + body.
  function frame(slide, body, cls = '') {
    const [label, icon, color] = KINDS[slide.type] || ['', 'sparkle', 'green'];
    const kicker = slide.kicker || label;
    const head = h('header.slide-head',
      kicker ? h('span.kicker.' + color, CC.icon(icon), kicker) : null,
      slide.title ? h('h2.slide-title', { html: md(slide.title) }) : null,
      slide.timer ? timerButton(slide.timer) : null);
    return h('section.slide.slide-' + slide.type + (cls ? '.' + cls : ''), head, h('div.slide-body', body));
  }
  CC.slideFrame = frame;

  function numberCard(i, title, text, opts = {}) {
    const color = CC.colorOf(i);
    return h('div.num-card.' + color + (opts.cls ? '.' + opts.cls : ''),
      h('span.num', String(i + 1).padStart(2, '0')),
      h('div.num-text', title ? h('strong', { html: md(title) }) : null, text ? h('p', { html: md(text) }) : null));
  }

  function sourceFor(slide) {
    return slide.code != null ? slide.code.replace(/^\n/, '') : CC.sketchSource(slide.sketch);
  }
  function nameFor(slide) {
    return slide.name || slide.sketch || 'example';
  }

  // ---------------- title ----------------
  T.title = (slide, deck) => {
    const label = deck.num === 0 ? 'Welcome!' : 'Module ' + deck.num;
    const el = h('section.slide.slide-cover.' + deck.color,
      CC.badges([['star', 'pink', '8%', '14%', 54], ['heart', 'yellow', '86%', '18%', 46], ['code', 'blue', '12%', '72%', 50], ['sparkle', 'pink', '84%', '70%', 58], ['play', 'yellow', '70%', '86%', 40]]),
      h('div.cover-clouds', CC.cloud('yellow', label, 'small'), CC.cloud('pink', deck.title, 'big')),
      deck.bigIdea ? h('p.cover-idea', { html: md(deck.bigIdea) }) : null,
      h('div.cover-meta',
        deck.sessions ? h('span.chip.light', CC.icon('timer'), deck.sessions) : null,
        deck.sketches && deck.sketches.length ? h('span.chip.light', CC.icon('code'), deck.sketches.length + ' sketches') : null));
    return simple(el);
  };

  // ---------------- hook ----------------
  T.hook = (slide) => {
    const stage = CC.Stage(sourceFor(slide), nameFor(slide));
    const el = frame(slide, h('div.split.hook-split',
      h('div.hook-text', h('p.huge', { html: md(slide.text || '') }), slide.sub ? h('p.lead', { html: md(slide.sub) }) : null,
        slide.sketch ? h('span.chip', CC.icon('code'), slide.sketch) : null),
      h('div.hook-stage', stage.el)));
    return simple(el, { enter: () => stage.start(), leave: () => stage.destroy() });
  };

  // ---------------- big idea ----------------
  T.big = (slide) => {
    const art = slide.art && CC.art[slide.art] ? CC.art[slide.art](slide) : null;
    const el = frame(slide, h('div.big-wrap' + (art ? '.with-art' : ''),
      h('div.big-text',
        slide.statement ? h('p.statement', { html: md(slide.statement) }) : null,
        slide.text ? h('p.lead', { html: md(slide.text) }) : null,
        slide.analogy ? h('div.analogy', CC.icon('bulb'), h('div', h('strong', { html: md(slide.analogy.title) }), h('p', { html: md(slide.analogy.text) }))) : null),
      art ? h('div.big-art', art) : null));
    return simple(el);
  };

  // ---------------- unplugged activity / numbered cards ----------------
  T.act = (slide) => {
    const cards = (slide.steps || []).map((s, i) => typeof s === 'string' ? numberCard(i, null, s) : numberCard(i, s.t, s.d));
    const grid = h('div.card-grid.n' + Math.min(cards.length, 4), cards);
    const el = frame(slide, [slide.text ? h('p.lead', { html: md(slide.text) }) : null, grid]);
    if (!slide.reveal) return simple(el);
    cards.forEach((c) => c.classList.add('hidden-step'));
    return simple(el, { steps: cards.length, step(i) { cards.forEach((c, k) => c.classList.toggle('hidden-step', k >= i)); } });
  };

  // ---------------- predict ----------------
  T.predict = (slide) => {
    const player = CC.Player({ source: sourceFor(slide), name: nameFor(slide), autorun: false, scrub: false, run: slide.run !== false });
    const cover = h('div.predict-cover', h('div.q-bubble', h('span.q-mark', '?'), h('p', { html: md(slide.question || 'What will it draw?') })),
      h('p.muted', 'Shout your guess! Then press →'));
    const answer = slide.answer ? h('div.answer.hidden-step', CC.icon('check'), h('p', { html: md(slide.answer) })) : null;
    const stageWell = player.el.querySelector('.stage-well');
    if (stageWell) stageWell.append(cover); else player.el.append(cover);
    const el = frame(slide, [player.el, answer]);
    return simple(el, {
      steps: 1,
      step(i) {
        const show = i >= 1;
        cover.classList.toggle('gone', show);
        if (answer) answer.classList.toggle('hidden-step', !show);
        if (show) { player.start(); CC.sound.pop(); } else player.stop();
      },
      leave: () => player.destroy(),
    });
  };

  // ---------------- live code ----------------
  T.code = (slide) => {
    const source = sourceFor(slide);
    const player = CC.Player({ source, name: nameFor(slide), scrub: slide.scrub !== false, run: slide.run !== false, lang: slide.lang || 'pde' });
    const spots = slide.spotlight || [];
    const el = frame(slide, [slide.text ? h('p.lead.tight', { html: md(slide.text) }) : null, player.el], spots.length ? 'has-spots' : '');
    return simple(el, {
      steps: spots.length,
      step(i) {
        if (i === 0) player.spotlight(null);
        else player.spotlight(CC.findLines(player.source, spots[i - 1]), spots[i - 1].note);
      },
      enter: () => player.enter(),
      leave: () => player.destroy(),
    });
  };

  // A player in a big overlay, used by "Try it here" buttons.
  CC.openPlayer = function (name, source) {
    const player = CC.Player({ source: source || CC.sketchSource(name), name });
    const { box } = CC.overlay('player-overlay', () => player.destroy());
    box.append(h('div.player-card', player.el, h('button.icon-close', { type: 'button', 'aria-label': 'Close', onclick: () => box.click() }, CC.icon('close'))));
    player.enter();
  };

  // ---------------- tasks ----------------
  T.tasks = (slide) => {
    const items = slide.items || [];
    const cards = items.map((t, i) => {
      const card = numberCard(i, null, t, { cls: 'tick' });
      card.tabIndex = 0;
      card.setAttribute('role', 'checkbox');
      card.setAttribute('aria-checked', 'false');
      const toggle = () => {
        const on = !card.classList.contains('done');
        card.classList.toggle('done', on);
        card.setAttribute('aria-checked', String(on));
        if (on) CC.sound.pop();
        if (cards.every((c) => c.classList.contains('done'))) { CC.sound.chime(); const r = card.getBoundingClientRect(); CC.confetti(r.left + r.width / 2, r.top); }
      };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); toggle(); } });
      card.append(h('span.tickbox', CC.icon('check')));
      return card;
    });
    const side = h('aside.task-side',
      slide.sketch ? h('div.open-card', h('p.small.muted', 'Open in Processing'), h('p.file', CC.icon('code'), slide.sketch + '.pde'),
        h('p.small', 'Save As a new name first, so the original stays safe.'),
        h('button.cta.small', { type: 'button', onclick: () => CC.openPlayer(slide.sketch) }, CC.icon('play'), ' Try it here')) : null,
      h('div.rule-card', CC.icon('sparkle'), h('p', { html: md(slide.rule || 'Change **one** thing. Run it. Then the next.') })));
    const el = frame(slide, h('div.split.tasks-split', h('div.task-list', cards), side));
    return simple(el);
  };

  // ---------------- challenge ----------------
  T.challenge = (slide) => {
    const el = frame(slide, h('div.challenge-wrap',
      h('div.challenge-main',
        slide.text ? h('p.statement', { html: md(slide.text) }) : null,
        slide.rules ? h('ul.rules', slide.rules.map((r) => h('li', CC.icon('check'), h('span', { html: md(r) })))) : null,
        slide.examples ? h('p.lead', h('strong', 'Ideas: '), h('span', { html: md(slide.examples) })) : null),
      h('div.challenge-side',
        slide.stretch ? h('div.stretch-card', h('span.kicker.yellow', CC.icon('star'), 'Stretch'), h('p', { html: md(slide.stretch) })) : null,
        slide.sketch ? h('p.chip', CC.icon('code'), 'Start from ' + slide.sketch) : null,
        slide.minutes ? h('button.cta.big', { type: 'button', onclick: () => CC.timer.open(slide.minutes) }, CC.icon('timer'), ' Start ' + slide.minutes + ' min') : null)));
    return simple(el);
  };

  // ---------------- debug it ----------------
  T.debug = (slide) => {
    const player = CC.Player({ source: sourceFor(slide), name: slide.name || 'buggy', lang: slide.lang || 'pde', run: false, scrub: false, editable: false });
    const bugs = slide.bugs || [];
    const msgBox = h('div.red-console', { hidden: true });
    const found = h('div.bug-count');
    const updateCount = (n) => found.replaceChildren(...bugs.map((_, k) => h('span.bug-dot' + (k < n ? '.found' : ''), CC.icon(k < n ? 'check' : 'bug'))));
    const intro = h('p.lead.tight', { html: md(slide.text || 'This code has bugs. Can you find them **before** we reveal them?') });
    const el = frame(slide, [h('div.debug-top', intro, found), player.el, msgBox]);
    const lineOf = (b) => b.line || CC.findLines(player.source, { find: b.find, first: true })[0];
    bugs.forEach((b) => player.mark(lineOf(b), 'bug'));
    updateCount(0);
    return simple(el, {
      steps: bugs.length,
      step(i) {
        bugs.forEach((b, k) => player.mark(lineOf(b), k < i ? 'fixed' : 'bug'));
        updateCount(i);
        if (i === 0) { player.spotlight(null); msgBox.hidden = true; return; }
        const b = bugs[i - 1];
        player.spotlight([lineOf(b)], b.fix);
        if (b.message) {
          msgBox.hidden = false;
          msgBox.replaceChildren(h('span.red-label', b.messageLabel || 'Processing says:'), h('code', b.message));
        } else msgBox.hidden = true;
        CC.sound.pop();
        if (i === bugs.length) CC.sound.chime();
      },
      leave: () => player.destroy(),
    });
  };

  // ---------------- vocab flip cards ----------------
  T.vocab = (slide) => {
    const cards = (slide.words || []).map(([word, meaning], i) => {
      const card = h('button.flip-card.' + CC.colorOf(i), { type: 'button', 'aria-label': word + ': flip to see the meaning' },
        h('span.flip-inner', h('span.flip-front', { html: md(word) }), h('span.flip-back', { html: md(meaning) })));
      card.addEventListener('click', () => { card.classList.toggle('flipped'); CC.sound.blip(); });
      return card;
    });
    const el = frame(Object.assign({ title: 'Say it, then flip it' }, slide), [h('div.flip-grid', cards), h('p.muted.center', 'Click a card to see what it means.')]);
    return simple(el);
  };

  // ---------------- I can ----------------
  T.ican = (slide) => {
    const cards = (slide.items || []).map((t, i) => {
      const c = h('button.ican-card.' + CC.colorOf(i), { type: 'button', 'aria-pressed': 'false' }, h('span.tickbox', CC.icon('check')), h('span', { html: md('I can ' + t) }));
      c.addEventListener('click', () => {
        const on = !c.classList.contains('done');
        c.classList.toggle('done', on);
        c.setAttribute('aria-pressed', String(on));
        if (on) CC.sound.pop();
        if (cards.every((x) => x.classList.contains('done'))) { CC.sound.chime(); CC.confetti(); }
      });
      return c;
    });
    const el = frame(Object.assign({ title: 'Thumbs up if you can...' }, slide), h('div.ican-grid', cards));
    return simple(el);
  };

  // ---------------- share ----------------
  T.share = (slide) => {
    const el = frame(Object.assign({ title: 'Share time' }, slide), [
      h('div.bubbles', (slide.prompts || []).map((p, i) => h('div.speech.' + CC.colorOf(i), { html: md(p) }))),
      slide.feedback !== false ? h('div.feedback-row', h('span.chip.light', 'I liked...'), h('span.chip.light', 'I wonder...')) : null,
      h('div.row.center', h('button.cta', { type: 'button', onclick: () => CC.picker.open() }, CC.icon('dice'), " Who's next?"),
        slide.timer ? null : h('button.chip', { type: 'button', onclick: () => CC.timer.open(2) }, CC.icon('timer'), '2 min each')),
    ]);
    return simple(el);
  };

  // ---------------- whiteboard slide ----------------
  T.whiteboard = (slide) => {
    const area = h('div.board-area' + (slide.grid ? '.with-grid' : ''));
    if (slide.grid) area.append(CC.art.coordGrid(slide.grid === true ? {} : slide.grid));
    const el = frame(slide, [slide.text ? h('p.lead.tight', { html: md(slide.text) }) : null, area]);
    let board = null;
    return simple(el, {
      enter() {
        board = CC.Board(area);
        area.append(CC.boardToolbar(board));
      },
      leave() { if (board) board.destroy(); },
    });
  };

  // ---------------- Coding Train ----------------
  T.codingtrain = (slide) => {
    const player = slide.sketch || slide.code ? CC.Player({ source: sourceFor(slide), name: nameFor(slide), layout: 'stack' }) : null;
    const info = h('div.ct-info',
      h('p.ct-num', '#' + slide.num),
      h('p.lead', { html: md(slide.text || '') }),
      slide.steps ? h('ol.ct-steps', slide.steps.map((s) => h('li', { html: md(s) }))) : null,
      h('div.row',
        slide.url ? h('a.cta.small', { href: slide.url, target: '_blank', rel: 'noopener' }, CC.icon('external'), ' Open the challenge') : null,
        slide.clip ? h('span.chip', CC.icon('eye'), 'Clip: ' + slide.clip) : null));
    const el = frame(slide, h('div.split.ct-split', info, player ? player.el : null));
    return simple(el, { enter: () => player && player.enter(), leave: () => player && player.destroy() });
  };

  // ---------------- list ----------------
  T.list = (slide) => {
    const icons = ['check', 'star', 'heart', 'sparkle', 'bulb', 'flag'];
    const items = (slide.points || []).map((p, i) => h('li.point', h('span.point-icon.' + CC.colorOf(i), CC.icon(slide.icon || icons[i % icons.length])), h('span', { html: md(p) })));
    const el = frame(slide, [slide.text ? h('p.lead', { html: md(slide.text) }) : null, h('ul.points' + (items.length > 4 ? '.two-col' : ''), items)]);
    if (!slide.reveal) return simple(el);
    items.forEach((c) => c.classList.add('hidden-step'));
    return simple(el, { steps: items.length, step(i) { items.forEach((c, k) => c.classList.toggle('hidden-step', k >= i)); } });
  };

  // ---------------- table ----------------
  T.table = (slide) => {
    const el = frame(slide, [slide.text ? h('p.lead.tight', { html: md(slide.text) }) : null,
      h('div.table-wrap', h('table.fun-table',
        h('thead', h('tr', slide.head.map((c) => h('th', { html: md(c) })))),
        h('tbody', slide.rows.map((r) => h('tr', r.map((c) => h('td', { html: md(c) })))))))]);
    return simple(el);
  };

  // ---------------- compare two codes ----------------
  T.compare = (slide) => {
    const left = CC.Player({ source: slide.left.code || CC.sketchSource(slide.left.sketch), name: slide.left.name, lang: slide.left.lang || 'pde', run: false, scrub: false, editable: false });
    const right = CC.Player({ source: slide.right.code || (window.SKETCHES_P5 || {})[slide.right.sketch] || '', name: slide.right.name, lang: slide.right.lang || 'js', run: false, scrub: false, editable: false });
    const labels = h('div.compare-labels', h('span.chip.blue-soft', slide.left.label || 'Processing'), h('span.chip.pink-soft', slide.right.label || 'p5.js'));
    const el = frame(slide, [labels, h('div.compare', left.el, right.el)]);
    const spots = slide.spotlight || [];
    return simple(el, {
      steps: spots.length,
      step(i) {
        if (i === 0) { left.spotlight(null); right.spotlight(null); return; }
        const s = spots[i - 1];
        left.spotlight(CC.findLines(left.source, s.left), s.note);
        right.spotlight(CC.findLines(right.source, s.right), s.rightNote || null);
      },
      leave() { left.destroy(); right.destroy(); },
    });
  };

  // ---------------- colour mixer ----------------
  T.mixer = (slide) => {
    const vals = { r: 255, g: 100, b: 150 };
    const swatch = h('div.swatch');
    const code = h('code.mixer-code');
    const sliders = h('div.mixer-sliders');
    const inputs = {};
    const update = () => {
      swatch.style.background = 'rgb(' + vals.r + ',' + vals.g + ',' + vals.b + ')';
      code.innerHTML = '<span class="tok-func">fill</span>(<span class="tok-number">' + vals.r + '</span>, <span class="tok-number">' + vals.g + '</span>, <span class="tok-number">' + vals.b + '</span>);';
      for (const k in inputs) { inputs[k].value = vals[k]; inputs[k].parentElement.querySelector('output').textContent = vals[k]; }
    };
    [['r', 'Red'], ['g', 'Green'], ['b', 'Blue']].forEach(([k, name]) => {
      const input = h('input', { type: 'range', min: 0, max: 255, value: vals[k], 'aria-label': name });
      input.addEventListener('input', () => { vals[k] = +input.value; update(); });
      inputs[k] = input;
      sliders.append(h('label.mixer-row.' + k, h('span.mixer-name', name), input, h('output', String(vals[k]))));
    });
    const preset = (label, r, g, b) => h('button.chip', { type: 'button', onclick: () => { Object.assign(vals, { r, g, b }); update(); CC.sound.pop(); } }, label);
    const presets = h('div.row.wrap',
      preset('Red', 255, 0, 0), preset('Red + Green = ?', 255, 255, 0), preset('Green + Blue = ?', 0, 255, 255),
      preset('All 255', 255, 255, 255), preset('All 0', 0, 0, 0), preset('All 128', 128, 128, 128),
      h('button.chip', { type: 'button', onclick: () => { vals.r = (Math.random() * 256) | 0; vals.g = (Math.random() * 256) | 0; vals.b = (Math.random() * 256) | 0; update(); CC.sound.pop(); } }, CC.icon('dice'), 'Surprise me'));
    update();
    const el = frame(slide, [slide.text ? h('p.lead.tight', { html: md(slide.text) }) : null,
      h('div.split.mixer-split', h('div', sliders, presets), h('div.mixer-right', swatch, code))]);
    return simple(el);
  };

  // ---------------- flow map (game states) ----------------
  T.flow = (slide) => {
    const parts = [];
    (slide.nodes || []).forEach((n, i) => {
      if (n.arrow != null) parts.push(h('div.flow-arrow', h('span', { html: md(n.arrow) }), h('span.arrow-line')));
      else parts.push(h('div.flow-node.' + (n.color || CC.colorOf(i)), h('strong', { html: md(n.t) }), n.d ? h('span', { html: md(n.d) }) : null));
    });
    const el = frame(slide, [slide.text ? h('p.lead.tight', { html: md(slide.text) }) : null, h('div.flow', parts),
      slide.loop ? h('p.flow-loop', CC.icon('restart'), h('span', { html: md(slide.loop) })) : null]);
    return simple(el);
  };

  // ---------------- illustrations ----------------
  CC.art = {
    box(slide) {
      const values = slide.values || ['200', '80', '380'];
      let k = 0;
      const value = h('span.box-value', values[0]);
      const wrap = h('button.art-box', { type: 'button', 'aria-label': 'Swap the card inside the box' },
        h('span.box-label', slide.label || 'faceSize'), h('span.box-body', value), h('span.box-hint', 'click me'));
      wrap.addEventListener('click', () => {
        k = (k + 1) % values.length;
        value.classList.remove('swap'); void value.offsetWidth; value.classList.add('swap');
        value.textContent = values[k];
        CC.sound.pop();
      });
      return wrap;
    },
    flipbook() {
      return h('div.art-flipbook', { 'aria-hidden': 'true' }, [0, 1, 2, 3].map((i) => h('div.page', { style: { '--i': i } }, h('span.ball'))));
    },
    mailboxes(slide) {
      const vals = slide.values || ['100', '150', '0', '0', '0'];
      return h('div.art-mailboxes', vals.map((v, i) => h('div.mailbox.' + CC.colorOf(i), h('span.mb-value', v), h('span.mb-index', 'x[' + i + ']'))));
    },
    cookie() {
      return h('div.art-cookie', { html:
        '<svg viewBox="0 0 360 200" aria-hidden="true">' +
        '<g transform="translate(20 30)"><path d="M70 10 l18 38 42 6 -30 29 7 42 -37 -20 -37 20 7 -42 -30 -29 42 -6z" fill="none" stroke="#23303D" stroke-width="7" stroke-linejoin="round"/>' +
        '<text x="70" y="168" text-anchor="middle" class="art-label">class</text></g>' +
        '<g transform="translate(170 20) scale(.55)"><path d="M70 10 l18 38 42 6 -30 29 7 42 -37 -20 -37 20 7 -42 -30 -29 42 -6z" fill="#F59BC0"/></g>' +
        '<g transform="translate(250 20) scale(.55)"><path d="M70 10 l18 38 42 6 -30 29 7 42 -37 -20 -37 20 7 -42 -30 -29 42 -6z" fill="#FFC53D"/></g>' +
        '<g transform="translate(210 95) scale(.55)"><path d="M70 10 l18 38 42 6 -30 29 7 42 -37 -20 -37 20 7 -42 -30 -29 42 -6z" fill="#57B96A"/></g>' +
        '<text x="262" y="198" text-anchor="middle" class="art-label">objects</text></svg>' });
    },
    loop() {
      return h('div.art-loop',
        h('div.loop-part.pink', h('code', 'int i = 0'), h('span', 'start')),
        h('div.loop-part.yellow', h('code', 'i < 10'), h('span', 'keep going while')),
        h('div.loop-part.green', h('code', 'i++'), h('span', 'after each round')));
    },
    recipe() {
      return h('div.art-recipe',
        h('div.recipe-card', h('strong', 'drawHouse(x, y, s)'), h('ol', h('li', 'walls'), h('li', 'roof'), h('li', 'door'))),
        h('div.recipe-calls', ['drawHouse(40, 150, 100);', 'drawHouse(200, 150, 140);', 'drawHouse(400, 150, 70);'].map((c, i) => h('code.' + CC.colorOf(i), c))));
    },
    coordGrid(opts) {
      const w = opts.w || 400, hgt = opts.h || 400, step = opts.step || 50;
      let s = '<svg class="coord-grid" viewBox="-46 -40 ' + (w + 110) + ' ' + (hgt + 80) + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
      s += '<rect x="0" y="0" width="' + w + '" height="' + hgt + '" class="cg-bg"/>';
      for (let x = 0; x <= w; x += step) s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + hgt + '" class="cg-line"/><text x="' + x + '" y="-10" class="cg-num" text-anchor="middle">' + x + '</text>';
      for (let y = 0; y <= hgt; y += step) s += '<line x1="0" y1="' + y + '" x2="' + w + '" y2="' + y + '" class="cg-line"/><text x="-8" y="' + (y + 4) + '" class="cg-num" text-anchor="end">' + y + '</text>';
      s += '<circle cx="0" cy="0" r="7" class="cg-origin"/><text x="10" y="20" class="cg-label">(0, 0)</text>';
      s += '<text x="' + (w + 22) + '" y="6" class="cg-axis">x →</text><text x="-40" y="' + (hgt + 32) + '" class="cg-axis">y ↓</text></svg>';
      return h('div.coord-wrap', { html: s });
    },
  };
})();
