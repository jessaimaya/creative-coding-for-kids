// The code player: highlighted code (numbers you can drag) next to the running sketch.
// Sketches run with Processing.js, a browser version of Processing. It's less strict than
// the real Processing (it forgives a missing ; and 5/2 gives 2.5), so the player says so.
(function () {
  const { h } = CC;

  CC.players = new Set();
  CC.stopAllPlayers = () => { for (const p of [...CC.players]) p.destroy(); if (CC.closeExplain) CC.closeExplain(); };

  // Processing.js is older than circle(), square() and printArray(). Add them to every sketch,
  // and point calls at them (unless the sketch defines its own function with that name).
  if (window.Processing) {
    Processing.lib.ccExtras = { attach(p) {
      p.circle = (x, y, d) => p.ellipse(x, y, d, d);
      p.square = (x, y, s) => p.rect(x, y, s, s);
      p.printArray = (a) => { for (let i = 0; i < a.length; i++) p.println('[' + i + '] ' + a[i]); };
    } };
  }
  CC.pjsSource = (src) => src.replace(/(^|[^.\w$])(circle|square|printArray)(\s*\()/g, (m, before, name, paren) =>
    new RegExp('\\b(void|int|float|boolean|color|String)\\s+' + name + '\\s*\\(').test(src) ? m : before + '$p.' + name + paren);
  CC.compile = (src) => Processing.compile(CC.pjsSource(src));

  // Only one sketch prints at a time: the one started most recently.
  let printTarget = null;
  if (window.Processing) {
    Processing.logger = {
      println: (m) => printTarget && printTarget.print(m, true),
      print: (m) => printTarget && printTarget.print(m, false),
      log: (m) => printTarget && printTarget.print(m, true),
    };
  }
  // Errors thrown inside draw() surface here; send them to the active player.
  window.addEventListener('error', (e) => {
    if (printTarget && printTarget.running) {
      printTarget.fail(e.message || String(e.error));
      e.preventDefault();
    }
  });

  // Processing.js sometimes never starts its draw loop (frameCount stays 0). If a sketch
  // with a draw() hasn't drawn a frame shortly after starting, restart its loop.
  // Sketches that called noLoop() have already drawn once, so they are left alone.
  CC.kickLoop = function (p, source, stillCurrent) {
    if (!/void\s+draw\s*\(/.test(source)) return;
    setTimeout(() => {
      try {
        if (stillCurrent() && p.frameCount === 0) { p.noLoop(); p.loop(); }
      } catch (e) { /* the sketch is gone */ }
    }, 200);
  };

  CC.toast = function (msg) {
    const t = h('div.toast', { role: 'status' }, msg);
    document.body.append(t);
    setTimeout(() => t.classList.add('out'), 1800);
    setTimeout(() => t.remove(), 2300);
  };

  CC.friendlyError = function (msg) {
    let m;
    if ((m = /^(?:ReferenceError: )?([\w$]+) is not defined/.exec(msg)))
      return 'I don\'t know what `' + m[1] + '` is. Check the spelling (capital letters matter!) and that you made it before using it.';
    if (/is not a function/.test(msg)) return 'That command name doesn\'t exist. Check its spelling on the cheat sheet.';
    if (/Cannot read propert|null|undefined/.test(msg)) return 'Something is empty. Did you forget `new` when making an object?';
    if (/Unexpected|missing|Unterminated|Invalid/i.test(msg)) return 'Something is missing or extra. Check every `;` `(` `)` `{` `}` near your last change.';
    return 'Something went wrong. Read the message, then look at your last change.';
  };

  CC.Player = function (opts) {
    const o = Object.assign({ name: 'sketch', lang: 'pde', run: true, autorun: true, scrub: true, editable: true, layout: 'side' }, opts);
    const original = o.source;
    let source = o.source;
    let tokens = [];
    let analysis = null;
    let view = null;
    let dragMoved = false;
    let editing = false;
    let instance = null;
    let rerunTimer = null;
    const self = { running: false };
    const runnable = o.run && o.lang === 'pde' && !!window.Processing;

    // ---------- code side ----------
    const codeScroll = h('div.code-scroll');
    const spotNote = h('div.spot-note', { hidden: true });
    const tabs = h('div.code-tabs');
    const fileChip = h('span.file-chip', CC.icon('code'), o.name + (o.lang === 'pde' ? '.pde' : '.js'));
    const editBtn = o.editable ? CC.btn('edit', 'Edit the code', () => setEditing(!editing), { text: 'Edit', cls: 'small' }) : null;
    const copyBtn = CC.btn('copy', 'Copy the code', copy, { cls: 'small' });
    const resetBtn = CC.btn('reset', 'Back to the original code', reset, { cls: 'small' });
    tabs.append(...[fileChip, h('span.spacer'), editBtn, resetBtn, copyBtn].filter(Boolean));
    const codePanel = h('div.code-panel', tabs, codeScroll, spotNote);

    function renderCode() {
      tokens = CC.tokenize(source, o.lang);
      analysis = CC.analyze ? CC.analyze(tokens) : null;
      view = CC.renderCode(tokens, { scrub: o.scrub && runnable });
      codeScroll.replaceChildren(view.el);
      if (o.scrub && runnable) wireScrub(view.el);
      if (analysis) wireExplain(view.el);
      if (lastSpot) applySpot(lastSpot.lines, lastSpot.note, false);
      for (const [n, cls] of markers) markLine(n, cls);
    }

    function setEditing(on) {
      editing = on;
      codePanel.classList.toggle('editing', on);
      if (on) {
        const ta = h('textarea.code-edit', { spellcheck: 'false', 'aria-label': 'Code editor' });
        ta.value = source;
        ta.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const s = ta.selectionStart;
            ta.setRangeText('  ', s, ta.selectionEnd, 'end');
          } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            source = ta.value;
            start();
          } else if (e.key === 'Escape') {
            ta.blur();
          }
        });
        ta.addEventListener('input', () => { source = ta.value; });
        codeScroll.replaceChildren(ta);
        if (editBtn) editBtn.querySelector('.btn-text').textContent = 'Done';
        setTimeout(() => ta.focus(), 0);
      } else {
        if (editBtn) editBtn.querySelector('.btn-text').textContent = 'Edit';
        renderCode();
        if (runnable) start();
      }
    }

    function copy() {
      const done = () => CC.toast('Copied! Paste it into Processing.');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(source).then(done, fallback);
      } else fallback();
      function fallback() {
        const ta = h('textarea', { style: { position: 'fixed', opacity: 0 } });
        ta.value = source;
        document.body.append(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { CC.toast('Could not copy. Select the code and press Ctrl+C.'); }
        ta.remove();
      }
    }

    function reset() {
      source = original;
      if (editing) setEditing(false); else { renderCode(); if (runnable) start(); }
      CC.toast('Back to the original code.');
    }

    // ---------- click any word, number or symbol to see what it means ----------
    function wireExplain(root) {
      root.addEventListener('click', (e) => {
        const el = e.target.closest('[data-tok]');
        if (!el) return;
        if (dragMoved) { dragMoved = false; return; }
        const i = +el.dataset.tok;
        const info = CC.explain(tokens, i, analysis, {
          scrub: el.classList.contains('scrub'),
          onShowLine: (line, note) => { CC.closeExplain(); applySpot([line], note); },
        });
        root.querySelectorAll('.asked').forEach((x) => x.classList.remove('asked'));
        if (info) el.classList.add('asked');
        CC.showExplain(el, info);
      });
    }

    // ---------- dragging numbers ----------
    function wireScrub(root) {
      root.addEventListener('pointerdown', (e) => {
        const el = e.target.closest('.scrub');
        if (!el) return;
        e.preventDefault();
        const i = +el.dataset.tok;
        const startText = tokens[i].s;
        const suffix = /[fF]$/.test(startText) ? startText.slice(-1) : '';
        const num = parseFloat(startText);
        const decimals = (startText.replace(/[fF]$/, '').split('.')[1] || '').length;
        const step = decimals ? Math.pow(10, -decimals) : 1;
        const canGoNegative = CC.allowsNegative(tokens, i) || num < 0;
        const x0 = e.clientX;
        dragMoved = false;
        el.setPointerCapture(e.pointerId);
        el.classList.add('dragging');
        document.body.classList.add('scrubbing');
        const move = (ev) => {
          if (Math.abs(ev.clientX - x0) > 3 && !dragMoved) { dragMoved = true; CC.closeExplain(); }
          if (!dragMoved) return;
          const steps = Math.round((ev.clientX - x0) / (decimals ? 4 : 3));
          let v = num + steps * step;
          if (!canGoNegative) v = Math.max(0, v);
          setNumber(i, el, v.toFixed(decimals) + suffix);
        };
        const up = () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerup', up);
          el.removeEventListener('pointercancel', up);
          el.classList.remove('dragging');
          document.body.classList.remove('scrubbing');
          setTimeout(() => { dragMoved = false; }, 0);   // the click after a drag is ignored, then reset
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
      });
      root.addEventListener('keydown', (e) => {
        const el = e.target.closest('.scrub');
        if (!el || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
        e.preventDefault();
        const i = +el.dataset.tok;
        const text = tokens[i].s;
        const suffix = /[fF]$/.test(text) ? text.slice(-1) : '';
        const decimals = (text.replace(/[fF]$/, '').split('.')[1] || '').length;
        const step = (decimals ? Math.pow(10, -decimals) : 1) * (e.shiftKey ? 10 : 1);
        let v = parseFloat(text) + (e.key === 'ArrowUp' ? step : -step);
        if (!CC.allowsNegative(tokens, i)) v = Math.max(0, v);
        setNumber(i, el, v.toFixed(decimals) + suffix);
      });
    }

    function setNumber(i, el, text) {
      if (tokens[i].s === text) return;
      tokens[i].s = text;
      el.textContent = text;
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
      source = tokens.map((t) => t.s).join('');
      clearTimeout(rerunTimer);
      rerunTimer = setTimeout(start, 40);
    }

    // ---------- spotlight + markers ----------
    let lastSpot = null;
    const markers = new Map();
    function applySpot(lines, note, scroll = true) {
      lastSpot = lines && lines.length ? { lines, note } : null;
      if (!view) return;
      view.el.classList.toggle('dimmed', !!lastSpot);
      view.lines.forEach((l, k) => l.classList.toggle('lit', !!lastSpot && lines.includes(k + 1)));
      if (lastSpot && note) {
        spotNote.hidden = false;
        const label = lines.length === 1 ? 'Line ' + lines[0] : 'Lines ' + lines[0] + '-' + lines[lines.length - 1];
        spotNote.replaceChildren(h('span.spot-chip', label), h('span', { html: CC.md(note) }));
        spotNote.classList.remove('pop');
        void spotNote.offsetWidth;
        spotNote.classList.add('pop');
      } else {
        spotNote.hidden = true;
      }
      if (lastSpot && scroll) {
        const first = view.lines[lines[0] - 1];
        if (first) {
          const top = first.offsetTop - codeScroll.clientHeight / 3;
          codeScroll.scrollTo({ top: Math.max(0, top), behavior: CC.reducedMotion() ? 'auto' : 'smooth' });
        }
      }
    }
    function markLine(n, cls) {
      markers.set(n, cls);
      if (!view) return;
      const line = view.lines[n - 1];
      if (!line) return;
      line.classList.remove('mark-bug', 'mark-fixed');
      line.classList.add('mark-' + cls);
    }

    // ---------- stage side ----------
    const stageFrame = h('div.stage-frame');
    const consoleBody = h('div.console-body', { 'aria-live': 'polite' });
    const consoleBox = h('div.console', { hidden: true },
      h('div.console-head', CC.icon('console'), h('span', 'Console'), h('span.spacer'),
        h('button.link-btn', { type: 'button', onclick: () => { consoleBody.replaceChildren(); consoleBox.hidden = true; } }, 'clear')),
      consoleBody);
    const errorBox = h('div.error-box', { hidden: true, role: 'alert' });
    const keysPill = h('div.keys-pill', 'Keys go to the sketch now. Press Esc to get them back.');
    const runBtn = CC.btn('play', 'Run the sketch', () => start(), { text: 'Run', cls: 'run' });
    const stopBtn = CC.btn('stop', 'Stop the sketch', () => stop(), { cls: 'small' });
    const controls = h('div.stage-controls', runBtn, stopBtn);
    const stage = h('div.stage', controls, h('div.stage-well', stageFrame, keysPill), errorBox, consoleBox,
      h('p.preview-note', CC.icon('eye'), 'Browser preview. Real Processing is stricter, so test there too.'));

    function print(msg, newline) {
      consoleBox.hidden = false;
      const text = String(msg);
      const last = consoleBody.lastChild;
      if (last && last.dataset.open === '1') last.textContent += text;
      else consoleBody.append(h('div', text));
      consoleBody.lastChild.dataset.open = newline ? '0' : '1';
      while (consoleBody.childNodes.length > 60) consoleBody.firstChild.remove();
      consoleBody.scrollTop = consoleBody.scrollHeight;
    }

    function fail(msg) {
      stopInstance();
      errorBox.hidden = false;
      errorBox.replaceChildren(
        h('div.error-title', CC.icon('bug'), 'Oops! The computer got confused.'),
        h('p', { html: CC.md(CC.friendlyError(msg)) }),
        h('code.error-raw', msg));
      CC.sound.tone(220, 0, 0.18, 'square', 0.03);
    }

    function stopInstance() {
      if (instance) { try { instance.exit(); } catch (e) { /* already gone */ } }
      instance = null;
      self.running = false;
      stage.classList.remove('is-running');
    }

    function start() {
      if (!runnable) return;
      stopInstance();
      errorBox.hidden = true;
      consoleBody.replaceChildren();
      consoleBox.hidden = true;
      // A fresh canvas each run, so old event listeners don't pile up.
      const canvas = h('canvas.sketch-canvas', { tabindex: '0', 'aria-label': 'Running sketch: ' + o.name });
      canvas.addEventListener('focus', () => stage.classList.add('keys-to-sketch'));
      canvas.addEventListener('blur', () => stage.classList.remove('keys-to-sketch'));
      canvas.addEventListener('keydown', (e) => { if (e.key === 'Escape') canvas.blur(); });
      stageFrame.replaceChildren(canvas);
      printTarget = self;
      try {
        self.running = true;
        stage.classList.add('is-running');
        const p = new Processing(canvas, CC.compile(source));
        instance = p;
        CC.kickLoop(p, source, () => instance === p);
      } catch (e) {
        fail(e.message || String(e));
      }
    }

    function stop() {
      stopInstance();
      if (instance === null) stage.classList.remove('is-running');
    }

    const sized = /size\(\s*(\d+)\s*,\s*(\d+)/.exec(source);
    if (sized) { stageFrame.style.minWidth = (+sized[1] + 16) + 'px'; stageFrame.style.minHeight = (+sized[2] + 16) + 'px'; }
    renderCode();
    const el = h('div.player.layout-' + o.layout + (runnable ? '' : '.no-run'), codePanel, runnable ? stage : null);

    Object.assign(self, {
      el, start, stop, print, fail,
      get source() { return source; },
      spotlight: (lines, note) => applySpot(lines, note),
      mark: markLine,
      unmark: (n) => { markers.delete(n); if (view && view.lines[n - 1]) view.lines[n - 1].classList.remove('mark-bug', 'mark-fixed'); },
      enter() { if (runnable && o.autorun) start(); },
      destroy() { stopInstance(); clearTimeout(rerunTimer); CC.players.delete(self); if (printTarget === self) printTarget = null; },
    });
    CC.players.add(self);
    return self;
  };

  // Just the running canvas, for hooks and the dashboard.
  CC.Stage = function (source, name) {
    let instance = null;
    const frame = h('div.stage-frame.solo');
    const self = {
      el: frame,
      start() {
        self.stop();
        const canvas = h('canvas.sketch-canvas', { tabindex: '0', 'aria-label': 'Running sketch: ' + (name || 'sketch') });
        frame.replaceChildren(canvas);
        try {
          const p = new Processing(canvas, CC.compile(source));
          instance = p;
          CC.kickLoop(p, source, () => instance === p);
        } catch (e) { frame.replaceChildren(h('p.muted', 'This sketch could not run in the browser. Open it in Processing.')); }
      },
      stop() { if (instance) { try { instance.exit(); } catch (e) { /* gone */ } } instance = null; },
      enter() { self.start(); },
      destroy() { self.stop(); CC.players.delete(self); },
    };
    CC.players.add(self);
    return self;
  };

  CC.sketchSource = function (name) {
    const src = (window.SKETCHES || {})[name];
    if (src == null) return '// Sketch "' + name + '" was not found.\n// Run ./build-site.sh to bundle the sketches.\n';
    return src;
  };
})();
