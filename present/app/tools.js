// Classroom tools: countdown timer, whiteboard (drawing over anything), and a name picker.
(function () {
  const { h } = CC;

  function overlay(cls, onClose) {
    const box = h('div.overlay.' + cls, { role: 'dialog', 'aria-modal': 'true' });
    const close = () => { box.classList.add('out'); setTimeout(() => box.remove(), 200); onClose && onClose(); };
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    document.body.append(box);
    return { box, close };
  }
  CC.overlay = overlay;

  // ---------- timer ----------
  const timer = { endsAt: 0, total: 0, paused: 0, tick: null, pill: null, panel: null };
  CC.timer = timer;

  timer.fmt = (ms) => {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };
  timer.left = () => (timer.paused ? timer.paused : timer.endsAt - Date.now());
  timer.running = () => timer.endsAt > 0;

  timer.start = function (minutes) {
    timer.total = minutes * 60000;
    timer.endsAt = Date.now() + timer.total;
    timer.paused = 0;
    clearInterval(timer.tick);
    timer.tick = setInterval(timer.update, 250);
    CC.sound.blip();
    timer.update();
  };
  timer.togglePause = function () {
    if (!timer.running()) return;
    if (timer.paused) { timer.endsAt = Date.now() + timer.paused; timer.paused = 0; }
    else timer.paused = timer.endsAt - Date.now();
    timer.update();
  };
  timer.clear = function () {
    clearInterval(timer.tick);
    timer.endsAt = 0;
    timer.paused = 0;
    if (timer.pill) { timer.pill.remove(); timer.pill = null; }
    timer.update();
  };
  timer.update = function () {
    const left = timer.left();
    const frac = timer.total ? Math.max(0, left) / timer.total : 0;
    if (timer.running() && left <= 0 && !timer.paused) { timer.finish(); return; }
    // corner pill while the big panel is closed
    if (timer.running() && !timer.panel) {
      if (!timer.pill) {
        timer.pill = h('button.timer-pill', { type: 'button', onclick: () => timer.open(), 'aria-label': 'Open the timer' });
        document.body.append(timer.pill);
      }
      timer.pill.replaceChildren(CC.icon('timer'), h('span', timer.fmt(left)));
      timer.pill.classList.toggle('low', left < 30000);
      timer.pill.classList.toggle('paused', !!timer.paused);
    } else if (timer.pill && timer.panel) { timer.pill.remove(); timer.pill = null; }
    if (timer.panel) {
      timer.panel.time.textContent = timer.running() ? timer.fmt(left) : '0:00';
      timer.panel.ring.style.strokeDashoffset = String(565.5 * (1 - frac));
      timer.panel.box.classList.toggle('low', timer.running() && left < 30000);
      timer.panel.pause.querySelector('.btn-text').textContent = timer.paused ? 'Go on' : 'Pause';
    }
  };
  timer.finish = function () {
    timer.clear();
    CC.sound.chime();
    CC.confetti();
    const { box, close } = overlay('times-up');
    box.append(h('div.times-up-card', CC.cloud('pink', "Time's up!", 'big'), h('p', 'Hands off the keyboards. Eyes up here!'),
      h('button.cta', { type: 'button', onclick: close }, 'OK!')));
    setTimeout(() => box.isConnected && close(), 8000);
  };
  timer.open = function (minutes) {
    if (timer.panel) timer.panel.close();
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.classList.add('timer-ring');
    svg.innerHTML = '<circle cx="100" cy="100" r="90" class="track"/>';
    ring.setAttribute('cx', '100'); ring.setAttribute('cy', '100'); ring.setAttribute('r', '90');
    ring.setAttribute('class', 'bar');
    svg.append(ring);
    const time = h('div.timer-time', '0:00');
    const presets = h('div.timer-presets', [1, 2, 5, 10, 15, 20].map((m) =>
      h('button.chip', { type: 'button', onclick: () => timer.start(m) }, m + ' min')));
    const pause = CC.btn('timer', 'Pause or continue', () => timer.togglePause(), { text: 'Pause', cls: 'soft' });
    const stopB = CC.btn('stop', 'Stop the timer', () => timer.clear(), { text: 'Stop', cls: 'soft' });
    const { box, close } = overlay('timer-overlay', () => { timer.panel = null; timer.update(); });
    const card = h('div.timer-card', h('h2', 'Timer'), h('div.timer-dial', svg, time), presets, h('div.row', pause, stopB),
      h('button.icon-close', { type: 'button', 'aria-label': 'Close', onclick: close }, CC.icon('close')));
    box.append(card);
    timer.panel = { box: card, ring, time, pause, close };
    if (minutes) timer.start(minutes);
    timer.update();
  };

  // ---------- whiteboard engine ----------
  // Board(el, {grid}) draws with the mouse, pen or finger on a canvas that fills `el`.
  CC.Board = function (host, opts = {}) {
    const canvas = h('canvas.board-canvas');
    host.append(canvas);
    const ctx = canvas.getContext('2d');
    const strokes = [];
    let current = null;
    let color = opts.color || '#23303D';
    let size = 5;
    let eraser = false;

    function resize() {
      const r = host.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, r.width * dpr);
      canvas.height = Math.max(1, r.height * dpr);
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    }
    function drawStroke(s) {
      ctx.globalCompositeOperation = s.eraser ? 'destination-out' : 'source-over';
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.eraser ? s.size * 5 : s.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const p = s.points;
      ctx.beginPath();
      ctx.moveTo(p[0][0], p[0][1]);
      if (p.length === 1) ctx.lineTo(p[0][0] + 0.1, p[0][1]);
      for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i][0] + p[i + 1][0]) / 2;
        const my = (p[i][1] + p[i + 1][1]) / 2;
        ctx.quadraticCurveTo(p[i][0], p[i][1], mx, my);
      }
      if (p.length > 1) ctx.lineTo(p[p.length - 1][0], p[p.length - 1][1]);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
    function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokes.forEach(drawStroke);
    }
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    canvas.addEventListener('pointerdown', (e) => {
      canvas.setPointerCapture(e.pointerId);
      current = { color, size, eraser, points: [pos(e)] };
      strokes.push(current);
      redraw();
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!current) return;
      current.points.push(pos(e));
      redraw();
    });
    const end = () => { current = null; };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    return {
      canvas,
      setColor(c) { color = c; eraser = false; },
      setSize(s) { size = s; },
      setEraser(on) { eraser = on; },
      undo() { strokes.pop(); redraw(); },
      clear() { strokes.length = 0; redraw(); },
      get strokes() { return strokes; },
      load(list) { strokes.length = 0; strokes.push(...(list || [])); redraw(); },
      destroy() { ro.disconnect(); },
    };
  };

  // Pens + tools bar for a Board.
  CC.boardToolbar = function (board, extra = []) {
    const pens = [['#23303D', 'Black'], ['#E5487F', 'Pink'], ['#2E9E4F', 'Green'], ['#3D5BF5', 'Blue'], ['#F2A900', 'Yellow'], ['#FFFFFF', 'White']];
    const bar = h('div.board-bar');
    const sizes = [[3, 'Thin'], [6, 'Medium'], [12, 'Thick']];
    const select = (group, btn) => { bar.querySelectorAll('.' + group).forEach((b) => b.classList.remove('on')); btn.classList.add('on'); };
    pens.forEach(([c, name], i) => {
      const b = h('button.pen' + (i === 0 ? '.on' : ''), { type: 'button', style: { '--pen': c }, 'aria-label': name + ' pen', title: name,
        onclick: () => { board.setColor(c); select('pen', b); bar.querySelector('.eraser')?.classList.remove('on'); } });
      bar.append(b);
    });
    bar.append(h('span.sep'));
    sizes.forEach(([s, name], i) => {
      const b = h('button.size' + (i === 1 ? '.on' : ''), { type: 'button', 'aria-label': name, title: name,
        onclick: () => { board.setSize(s); select('size', b); } }, h('span.dot', { style: { '--d': (s + 4) + 'px' } }));
      bar.append(b);
    });
    board.setSize(6);
    bar.append(h('span.sep'));
    const er = CC.btn('eraser', 'Eraser', () => { board.setEraser(true); bar.querySelectorAll('.pen').forEach((b) => b.classList.remove('on')); er.classList.add('on'); }, { cls: 'eraser' });
    bar.append(er, CC.btn('undo', 'Undo', () => board.undo()), CC.btn('trash', 'Clear all', () => board.clear()), ...extra);
    return bar;
  };

  // Full-screen whiteboard over whatever is on screen. Drawings are kept per page while the app is open.
  const boardMemory = new Map();
  CC.whiteboard = {
    el: null,
    toggle(key) {
      if (this.el) { this.close(); return; }
      const host = h('div.board-overlay');
      document.body.append(host);
      const board = CC.Board(host);
      board.load(boardMemory.get(key));
      let gridOn = false;
      const gridBtn = CC.btn('hash', 'Grid paper', () => { gridOn = !gridOn; host.classList.toggle('grid', gridOn); gridBtn.classList.toggle('on', gridOn); });
      const closeBtn = CC.btn('close', 'Close the whiteboard', () => this.close(), { key: 'W' });
      const bar = CC.boardToolbar(board, [gridBtn, closeBtn]);
      host.append(bar);
      this.el = host;
      this.board = board;
      this.key = key;
      document.body.classList.add('drawing');
    },
    close() {
      if (!this.el) return;
      boardMemory.set(this.key, this.board.strokes.slice());
      this.board.destroy();
      this.el.remove();
      this.el = null;
      document.body.classList.remove('drawing');
    },
  };

  // ---------- name picker ----------
  CC.picker = {
    open() {
      const names = CC.store.get('names', []);
      const used = new Set(CC.store.get('namesUsed', []));
      const { box, close } = overlay('picker-overlay');
      const show = h('div.picker-show', names.length ? 'Ready?' : 'Add names first');
      const ta = h('textarea.picker-names', { rows: 8, placeholder: 'One name per line', 'aria-label': 'Names, one per line' });
      ta.value = names.join('\n');
      const noRepeat = h('input', { type: 'checkbox', id: 'norepeat' });
      noRepeat.checked = CC.store.get('noRepeat', true);
      const status = h('p.muted.small');
      const save = () => {
        const list = ta.value.split('\n').map((s) => s.trim()).filter(Boolean);
        CC.store.set('names', list);
        CC.store.set('noRepeat', noRepeat.checked);
        return list;
      };
      const updateStatus = (list) => {
        status.textContent = noRepeat.checked ? (list.length - [...used].filter((n) => list.includes(n)).length) + ' of ' + list.length + ' still to go' : list.length + ' names';
      };
      ta.addEventListener('input', () => updateStatus(save()));
      noRepeat.addEventListener('change', () => updateStatus(save()));
      updateStatus(names);
      const spin = () => {
        const list = save();
        if (!list.length) { show.textContent = 'Add names first'; return; }
        let pool = noRepeat.checked ? list.filter((n) => !used.has(n)) : list;
        if (!pool.length) { used.clear(); pool = list; }
        const winner = pool[(Math.random() * pool.length) | 0];
        let k = 0;
        const steps = CC.reducedMotion() ? 1 : 18;
        show.classList.remove('win');
        (function roll() {
          if (k < steps - 1) {
            show.textContent = list[(Math.random() * list.length) | 0];
            CC.sound.tone(500 + k * 20, 0, 0.05, 'square', 0.02);
            k++;
            setTimeout(roll, 40 + k * 9);
          } else {
            show.textContent = winner;
            show.classList.add('win');
            CC.sound.pop();
            used.add(winner);
            CC.store.set('namesUsed', [...used]);
            updateStatus(list);
          }
        })();
      };
      const card = h('div.picker-card',
        h('h2', 'Who\'s next?'), show,
        h('button.cta', { type: 'button', onclick: spin }, CC.icon('dice'), ' Pick someone!'),
        h('details.picker-edit', h('summary', 'Edit names'), ta,
          h('label.check', noRepeat, ' Everyone gets a turn before anyone repeats'), status,
          h('button.link-btn', { type: 'button', onclick: () => { used.clear(); CC.store.set('namesUsed', []); updateStatus(save()); } }, 'Start a new round')),
        h('p.muted.small', 'Names stay on this computer only.'),
        h('button.icon-close', { type: 'button', 'aria-label': 'Close', onclick: close }, CC.icon('close')));
      box.append(card);
    },
  };
})();
