// Interactive explainers: coordinates, colour (RGB, hex, grey, HSB), a shape builder,
// and the parts of a line of code. Each one works as a slide and as a page under #/learn.
(function () {
  const { h, md } = CC;
  const E = (CC.explorers = {});
  const COLORS = { pink: '#E5487F', yellow: '#D69400', green: '#2E9E4F', blue: '#3D5BF5', purple: '#8B5CF6', orange: '#F07A1A', ink: '#23303D', muted: '#8893A2' };
  const ARG = ['pink', 'yellow', 'green', 'blue', 'purple', 'orange'];

  // A canvas that shows a W×H "sketch" area scaled to fit its box, with a margin for labels.
  // Drawing happens in sketch units; pointer positions come back in sketch units too.
  function scaledCanvas(host, getSize, draw, margin = 44) {
    const canvas = h('canvas.ex-canvas');
    host.append(canvas);
    const ctx = canvas.getContext('2d');
    let scale = 1;
    function resize() {
      const { w, h: hh } = getSize();
      const box = host.getBoundingClientRect();
      if (!box.width || !box.height) return;
      scale = Math.min(box.width / (w + margin * 2), box.height / (hh + margin * 2));
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = (w + margin * 2) * scale + 'px';
      canvas.style.height = (hh + margin * 2) * scale + 'px';
      canvas.width = (w + margin * 2) * scale * dpr;
      canvas.height = (hh + margin * 2) * scale * dpr;
      redraw();
    }
    function redraw() {
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, margin * scale * dpr, margin * scale * dpr);
      draw(ctx, scale);
    }
    const toSketch = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) / scale - margin, y: (e.clientY - r.top) / scale - margin };
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    return { canvas, ctx, resize, redraw, toSketch, destroy: () => ro.disconnect(), get scale() { return scale; } };
  }

  function grid(ctx, w, hh, opts = {}) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, hh);
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 25) {
      ctx.strokeStyle = x % 100 === 0 ? '#C9D1DC' : '#EBEFF4';
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, hh); ctx.stroke();
    }
    for (let y = 0; y <= hh; y += 25) {
      ctx.strokeStyle = y % 100 === 0 ? '#C9D1DC' : '#EBEFF4';
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, w, hh);
    ctx.font = '600 13px Fredoka, sans-serif';
    ctx.fillStyle = COLORS.muted;
    const step = w > 450 ? 100 : 50;
    ctx.textAlign = 'center';
    for (let x = 0; x <= w; x += step) ctx.fillText(String(x), x, -10);
    ctx.textAlign = 'right';
    for (let y = 0; y <= hh; y += step) ctx.fillText(String(opts.maths ? hh - y : y), -8, y + 4);
  }

  function label(ctx, text, x, y, color, align = 'left', bg = true) {
    ctx.font = '700 15px Nunito, sans-serif';
    const w = ctx.measureText(text).width;
    const bx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    if (bg) {
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(bx - 5, y - 15, w + 10, 21, 6) : ctx.rect(bx - 5, y - 15, w + 10, 21);
      ctx.fill();
    }
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.fillText(text, bx, y);
  }

  function dashed(ctx, x1, y1, x2, y2, color) {
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  }

  function arrow(ctx, x1, y1, x2, y2, color) {
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const head = (ax, ay, bx, by) => {
      const a = Math.atan2(by - ay, bx - ax);
      ctx.beginPath(); ctx.moveTo(bx, by);
      ctx.lineTo(bx - 10 * Math.cos(a - 0.45), by - 10 * Math.sin(a - 0.45));
      ctx.lineTo(bx - 10 * Math.cos(a + 0.45), by - 10 * Math.sin(a + 0.45));
      ctx.closePath(); ctx.fill();
    };
    head(x1, y1, x2, y2); head(x2, y2, x1, y1);
    ctx.restore();
  }

  function dot(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
  }

  function codeLine(name, values, names) {
    return h('code.ex-codeline', h('span.tok-func', name), '(',
      values.map((v, k) => [k ? ', ' : '', h('span.sig-arg.' + ARG[k % 6], String(v))]), ');');
  }

  function copyButton(getText) {
    return CC.btn('copy', 'Copy the code', () => {
      const text = getText();
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => CC.toast('Copied!'), () => CC.toast(text));
    }, { cls: 'small', text: 'Copy' });
  }

  function tabs(list, onPick) {
    const bar = h('div.ex-tabs', { role: 'tablist' });
    list.forEach(([id, text], i) => {
      const b = h('button.ex-tab' + (i === 0 ? '.on' : ''), { type: 'button', role: 'tab', onclick: () => {
        bar.querySelectorAll('.ex-tab').forEach((x) => x.classList.remove('on'));
        b.classList.add('on');
        onPick(id);
        CC.sound.blip();
      } }, text);
      bar.append(b);
    });
    return bar;
  }

  // =====================================================================
  // Coordinates
  // =====================================================================
  E.coords = function () {
    let W = 400, H = 400;
    let mode = 'explore';
    let mouse = null;
    const pins = [];
    let target = null, guess = null, score = 0, tries = 0;
    const stage = h('div.ex-stage');
    const side = h('div.ex-side');
    const readout = h('div.cx-readout');
    const sizeCode = h('div.cx-size');
    const msg = h('div.ex-msg');
    const pinCode = h('pre.ex-code');

    const view = scaledCanvas(stage, () => ({ w: W, h: H }), draw, 48);

    function draw(ctx) {
      const maths = mode === 'maths';
      grid(ctx, W, H, { maths });
      // corners
      label(ctx, maths ? '(0, ' + H + ')' : '(0, 0)', 6, 20, COLORS.pink);
      label(ctx, '(' + W + ', ' + (maths ? H : 0) + ')', W - 6, 20, COLORS.muted, 'right');
      label(ctx, maths ? '(0, 0)' : '(0, ' + H + ')', 6, H - 8, maths ? COLORS.pink : COLORS.muted);
      label(ctx, '(' + W + ', ' + (maths ? 0 : H) + ')', W - 6, H - 8, COLORS.muted, 'right');
      dot(ctx, 0, maths ? H : 0, 7, COLORS.pink);
      // axis arrows
      ctx.font = '700 16px Fredoka, sans-serif';
      ctx.fillStyle = COLORS.blue;
      ctx.textAlign = 'left';
      ctx.fillText('x →', W + 8, maths ? H + 5 : 5);
      ctx.save();
      ctx.translate(-30, maths ? -16 : H + 26);
      ctx.fillText(maths ? 'y ↑' : 'y ↓', 0, 0);
      ctx.restore();
      pins.forEach((p, k) => { dot(ctx, p.x, p.y, 7, COLORS[ARG[k % 6]]); label(ctx, '(' + p.x + ', ' + (maths ? H - p.y : p.y) + ')', p.x + 10, p.y - 8, COLORS[ARG[k % 6]]); });
      if (mode === 'find' && guess) {
        dashed(ctx, guess.x, guess.y, target.x, target.y, COLORS.muted);
        dot(ctx, guess.x, guess.y, 7, COLORS.blue);
        star(ctx, target.x, target.y);
        label(ctx, '(' + target.x + ', ' + target.y + ')', target.x + 14, target.y + 22, COLORS.yellow);
      }
      if (mouse && mouse.x >= 0 && mouse.y >= 0 && mouse.x <= W && mouse.y <= H) {
        const mx = Math.round(mouse.x), my = Math.round(mouse.y);
        const shownY = maths ? H - my : my;
        if (mode !== 'find' || !guess) {
          if (maths) { dashed(ctx, 0, my, mx, my, COLORS.pink); dashed(ctx, mx, H, mx, my, COLORS.green); }
          else { dashed(ctx, 0, my, mx, my, COLORS.pink); dashed(ctx, mx, 0, mx, my, COLORS.green); }
          label(ctx, 'x = ' + mx, Math.max(4, mx / 2 - 20), my - 8, COLORS.pink);
          label(ctx, 'y = ' + shownY, mx + 8, maths ? (my + H) / 2 : my / 2, COLORS.green);
        }
        dot(ctx, mx, my, 6, COLORS.ink);
      }
    }
    function star(ctx, x, y) {
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#FFC53D'; ctx.strokeStyle = COLORS.ink; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let k = 0; k < 10; k++) { const r = k % 2 ? 7 : 16; const a = -Math.PI / 2 + k * Math.PI / 5; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    }

    function updateText() {
      const m = mouse && mouse.x >= 0 && mouse.y >= 0 && mouse.x <= W && mouse.y <= H ? { x: Math.round(mouse.x), y: Math.round(mouse.y) } : null;
      const maths = mode === 'maths';
      readout.replaceChildren(m
        ? h('div.cx-big', '(', h('span.c-pink', String(m.x)), ', ', h('span.c-green', String(maths ? H - m.y : m.y)), ')')
        : h('div.cx-big.muted', '( ?, ? )'),
        h('p.small', m ? [h('span.c-pink', String(m.x)), ' pixels from the left, ', h('span.c-green', String(maths ? H - m.y : m.y)), maths ? ' pixels up from the bottom.' : ' pixels down from the top.'] : 'Move your mouse over the canvas.'));
      sizeCode.replaceChildren(h('code.ex-codeline', h('span.tok-func', 'size'), '(', h('span.sig-arg.pink', String(W)), ', ', h('span.sig-arg.yellow', String(H)), ');'),
        h('p.small', { html: md('So `width` is **' + W + '** and `height` is **' + H + '**. The middle is (`width / 2`, `height / 2`) = (' + W / 2 + ', ' + H / 2 + ').') }));
      if (mode === 'explore') {
        pinCode.textContent = pins.length ? pins.map((p) => 'ellipse(' + p.x + ', ' + p.y + ', 20, 20);').join('\n') : '// Click the canvas to drop dots.\n// Their code appears here.';
      }
    }

    function newTarget() {
      target = { x: 20 + Math.round(Math.random() * (W - 40) / 10) * 10, y: 20 + Math.round(Math.random() * (H - 40) / 10) * 10 };
      guess = null;
      msg.className = 'ex-msg';
      msg.replaceChildren(h('p.cx-find', 'Find ', h('strong', '(' + target.x + ', ' + target.y + ')'), '!'), h('p.small', 'Click where you think it is. Score: ' + score + ' / ' + tries));
      view.redraw();
    }

    view.canvas.addEventListener('pointermove', (e) => { mouse = view.toSketch(e); view.redraw(); updateText(); });
    view.canvas.addEventListener('pointerleave', () => { mouse = null; view.redraw(); updateText(); });
    view.canvas.addEventListener('click', (e) => {
      const p = view.toSketch(e);
      if (p.x < 0 || p.y < 0 || p.x > W || p.y > H) return;
      const q = { x: Math.round(p.x), y: Math.round(p.y) };
      if (mode === 'find') {
        if (guess) { newTarget(); return; }
        guess = q; tries++;
        const d = Math.round(Math.hypot(q.x - target.x, q.y - target.y));
        let text;
        if (d <= 15) { score++; text = 'Bullseye! You were only ' + d + ' pixels away.'; CC.sound.chime(); const r = view.canvas.getBoundingClientRect(); CC.confetti(e.clientX, e.clientY); void r; }
        else if (d <= 45) { text = 'So close! ' + d + ' pixels away.'; CC.sound.pop(); }
        else { text = 'You clicked (' + q.x + ', ' + q.y + '). The star shows where (' + target.x + ', ' + target.y + ') is.'; CC.sound.blip(); }
        msg.className = 'ex-msg ' + (d <= 15 ? 'win' : '');
        msg.replaceChildren(h('p.cx-find', text), h('p.small', 'Score: ' + score + ' / ' + tries + '. Click the canvas for the next one.'));
      } else {
        if (pins.length >= 8) pins.shift();
        pins.push(q);
        CC.sound.pop();
      }
      view.redraw(); updateText();
    });

    const modeBar = tabs([['explore', 'Explore'], ['find', 'Find it! (game)'], ['maths', 'Maths class vs screen']], (m) => {
      mode = m; pins.length = 0;
      if (m === 'find') { score = 0; tries = 0; newTarget(); }
      else if (m === 'maths') {
        msg.className = 'ex-msg';
        msg.replaceChildren(h('p', { html: md('In **maths class**, (0, 0) is at the **bottom-left** and y goes **up**.') }),
          h('p', { html: md('On a **screen**, (0, 0) is at the **top-left** and y goes **down**, because screens draw line by line from the top, like you read a page.') }),
          h('p.small', 'Processing always uses the screen way.'));
      } else { msg.className = 'ex-msg'; msg.replaceChildren(h('p', { html: md('Every spot has two numbers: **x** (how far from the left) and **y** (how far from the top). Click to drop dots!') })); }
      pinCode.hidden = m !== 'explore';
      view.redraw(); updateText();
    });
    const sizeBar = h('div.row.wrap', h('span.small.muted', 'Canvas size:'), [[400, 400], [600, 300], [300, 450]].map(([w, hh]) =>
      h('button.chip', { type: 'button', onclick: () => { W = w; H = hh; pins.length = 0; if (mode === 'find') newTarget(); view.resize(); updateText(); CC.sound.blip(); } }, w + ' × ' + hh)));
    msg.append(h('p', { html: md('Every spot has two numbers: **x** (how far from the left) and **y** (how far from the top). Click to drop dots!') }));
    side.append(modeBar, readout, msg, pinCode, h('div.ex-box', sizeBar, sizeCode));
    updateText();
    const el = h('div.explorer.ex-coords', stage, side);
    return { el, enter() { view.resize(); }, leave() { view.destroy(); } };
  };

  // =====================================================================
  // Colour: RGB, hex, grey & see-through, HSB
  // =====================================================================
  const toHex = (v) => Math.round(v).toString(16).padStart(2, '0').toUpperCase();
  function hsbToRgb(hh, s, b) {
    s /= 100; b /= 100;
    const k = (n) => (n + hh / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [f(5) * 255, f(3) * 255, f(1) * 255].map(Math.round);
  }
  function rgbToHsb(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let hh = 0;
    if (d) hh = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    hh = Math.round(hh * 60 + 360) % 360;
    return [hh, Math.round(max ? (d / max) * 100 : 0), Math.round(max * 100)];
  }

  E.colours = function () {
    const st = { r: 255, g: 100, b: 150, a: 255, grey: 128 };
    let tab = 'rgb';
    const panel = h('div.co-panel');
    const swatchBig = h('div.co-swatch');
    const codeBox = h('div.co-code');
    const mixCanvas = h('canvas.co-mix', { width: 300, height: 260 });

    function slider(label, cls, min, max, get, set, track) {
      const input = h('input', { type: 'range', min, max, value: get(), 'aria-label': label });
      const out = h('output', String(get()));
      input.addEventListener('input', () => { set(+input.value); refresh(); });
      const row = h('label.mixer-row.' + cls, h('span.mixer-name', label), input, out);
      if (track) input.style.background = track;
      row.sync = () => { input.value = get(); out.textContent = String(Math.round(get())); };
      return row;
    }

    const rgbRows = [
      slider('Red', 'r', 0, 255, () => st.r, (v) => (st.r = v), 'linear-gradient(90deg,#000,#f00)'),
      slider('Green', 'g', 0, 255, () => st.g, (v) => (st.g = v), 'linear-gradient(90deg,#000,#0f0)'),
      slider('Blue', 'b', 0, 255, () => st.b, (v) => (st.b = v), 'linear-gradient(90deg,#000,#00f)'),
    ];
    const greyRow = slider('Grey', 'grey', 0, 255, () => st.grey, (v) => (st.grey = v), 'linear-gradient(90deg,#000,#fff)');
    const alphaRow = slider('Alpha', 'alpha', 0, 255, () => st.a, (v) => (st.a = v));
    const hsb = { h: 0, s: 0, b: 0 };
    const hsbRows = [
      slider('Hue', 'hue', 0, 360, () => hsb.h, (v) => { hsb.h = v; [st.r, st.g, st.b] = hsbToRgb(hsb.h, hsb.s, hsb.b); }, 'linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)'),
      slider('Saturation', 'sat', 0, 100, () => hsb.s, (v) => { hsb.s = v; [st.r, st.g, st.b] = hsbToRgb(hsb.h, hsb.s, hsb.b); }),
      slider('Brightness', 'bri', 0, 100, () => hsb.b, (v) => { hsb.b = v; [st.r, st.g, st.b] = hsbToRgb(hsb.h, hsb.s, hsb.b); }),
    ];
    const hexInput = h('input.co-hexin', { type: 'text', maxlength: 7, 'aria-label': 'Type a hex colour', spellcheck: 'false' });
    hexInput.addEventListener('input', () => {
      const m = /^#?([0-9a-f]{6})$/i.exec(hexInput.value.trim());
      if (m) { st.r = parseInt(m[1].slice(0, 2), 16); st.g = parseInt(m[1].slice(2, 4), 16); st.b = parseInt(m[1].slice(4), 16); refresh(true); }
    });
    const hexBreak = h('div.co-hexbreak');
    const digits = h('div.co-digits', '0123456789ABCDEF'.split('').map((d, k) => h('span.co-digit' + (k > 9 ? '.letter' : ''), h('b', d), h('small', String(k)))));

    const presets = h('div.row.wrap', [['Sky', 135, 206, 250], ['Grass', 60, 160, 80], ['Sun', 255, 200, 0], ['Sunset', 255, 120, 60], ['Night', 20, 20, 60], ['Bubblegum', 255, 120, 190]].map(([n, r, g, b]) =>
      h('button.chip', { type: 'button', onclick: () => { Object.assign(st, { r, g, b }); refresh(); CC.sound.pop(); } }, h('span.chip-dot', { style: { background: 'rgb(' + r + ',' + g + ',' + b + ')' } }), n)),
      h('button.chip', { type: 'button', onclick: () => { st.r = (Math.random() * 256) | 0; st.g = (Math.random() * 256) | 0; st.b = (Math.random() * 256) | 0; refresh(); CC.sound.pop(); } }, CC.icon('dice'), 'Surprise me'));

    function drawMix() {
      const c = mixCanvas.getContext('2d');
      c.globalCompositeOperation = 'source-over';
      c.fillStyle = '#111';
      c.fillRect(0, 0, 300, 260);
      c.globalCompositeOperation = 'lighter';
      [[150, 95, 'rgb(' + st.r + ',0,0)'], [110, 165, 'rgb(0,' + st.g + ',0)'], [190, 165, 'rgb(0,0,' + st.b + ')']].forEach(([x, y, col]) => {
        c.fillStyle = col; c.beginPath(); c.arc(x, y, 72, 0, Math.PI * 2); c.fill();
      });
      c.globalCompositeOperation = 'source-over';
    }

    function codeRows(rows) {
      codeBox.replaceChildren(...rows.map(([label, text]) => h('div.co-row', h('span.co-label', label), h('code', text))),
        copyButton(() => rows.map((r) => r[1]).join('\n')));
    }

    function refresh(fromHex) {
      const hex = '#' + toHex(st.r) + toHex(st.g) + toHex(st.b);
      rgbRows.forEach((r) => r.sync());
      greyRow.sync(); alphaRow.sync();
      if (!fromHex && document.activeElement !== hexInput) hexInput.value = hex;
      if (tab === 'grey') swatchBig.style.background = 'rgb(' + st.grey + ',' + st.grey + ',' + st.grey + ')';
      else if (tab === 'alpha') swatchBig.style.background = 'linear-gradient(rgba(' + st.r + ',' + st.g + ',' + st.b + ',' + st.a / 255 + '), rgba(' + st.r + ',' + st.g + ',' + st.b + ',' + st.a / 255 + ')), repeating-conic-gradient(#ddd 0 25%, #fff 0 50%) 0 0 / 24px 24px';
      else swatchBig.style.background = hex;
      alphaRow.querySelector('input').style.background = 'linear-gradient(90deg, rgba(' + st.r + ',' + st.g + ',' + st.b + ',0), rgb(' + st.r + ',' + st.g + ',' + st.b + ')), repeating-conic-gradient(#ddd 0 25%, #fff 0 50%) 0 0 / 16px 16px';
      if (tab === 'rgb') {
        drawMix();
        codeRows([['Processing', 'fill(' + st.r + ', ' + st.g + ', ' + st.b + ');'], ['Same colour as hex', 'fill(' + hex + ');']]);
      } else if (tab === 'hex') {
        hexBreak.replaceChildren(...[['red', st.r, 'pink'], ['green', st.g, 'green'], ['blue', st.b, 'blue']].map(([name, v, cls]) => {
          const pair = toHex(v);
          const d1 = parseInt(pair[0], 16), d2 = parseInt(pair[1], 16);
          return h('div.co-pair.' + cls, h('code.co-pairhex', pair), h('span.co-name', name),
            h('span.co-math', pair[0] + ' (' + d1 + ') × 16 + ' + pair[1] + ' (' + d2 + ') = ', h('strong', String(v))));
        }));
        codeRows([['Processing', 'fill(' + hex + ');'], ['Same as', 'fill(' + st.r + ', ' + st.g + ', ' + st.b + ');'], ['p5.js and websites', "fill('" + hex + "');"]]);
      } else if (tab === 'grey') {
        codeRows([['One number = grey', 'fill(' + st.grey + ');'], ['Same as', 'fill(' + st.grey + ', ' + st.grey + ', ' + st.grey + ');']]);
      } else if (tab === 'alpha') {
        codeRows([['4th number = see-through', 'fill(' + st.r + ', ' + st.g + ', ' + st.b + ', ' + st.a + ');']]);
      } else if (tab === 'hsb') {
        hsbRows.forEach((r) => r.sync());
        codeRows([['First, once', 'colorMode(HSB, 360, 100, 100);'], ['Then', 'fill(' + hsb.h + ', ' + hsb.s + ', ' + hsb.b + ');']]);
      }
    }

    function show(t) {
      tab = t;
      if (t === 'hsb') [hsb.h, hsb.s, hsb.b] = rgbToHsb(st.r, st.g, st.b);
      const parts = {
        rgb: [h('p.lead.tight', { html: md('Screens mix **light**. Red + green light makes **yellow**! Each dial goes from **0** (off) to **255** (full).') }),
          h('div.co-rgb', h('div', rgbRows), h('figure.co-figure', mixCanvas, h('figcaption.small.muted', 'Three lights on a black wall')))],
        hex: [h('p.lead.tight', { html: md('A **hex code** is the same three dials, written in **base 16**: two digits each for red, green and blue.') }),
          h('div.co-hexrow', h('label.co-hexlabel', 'Type a hex code: ', hexInput)), hexBreak,
          h('div.co-digitsbox', h('p.small', { html: md('Hex counts with 16 digits: after 9 come **A=10, B=11, C=12, D=13, E=14, F=15**. So `FF` = 15 × 16 + 15 = **255**, the biggest.') }), digits)],
        grey: [h('p.lead.tight', { html: md('**One** number makes a grey: **0** is black, **255** is white.') }), greyRow],
        alpha: [h('p.lead.tight', { html: md('A **4th** number makes a colour **see-through**. It\'s called **alpha**: 0 is invisible, 255 is solid.') }), rgbRows, alphaRow],
        hsb: [h('p.lead.tight', { html: md('**HSB** picks colours like a colour wheel: **hue** is which colour, **saturation** is how strong, **brightness** is how light.') }), hsbRows],
      };
      panel.replaceChildren(...parts[t].flat(), presets);
      refresh();
    }

    const bar = tabs([['rgb', 'RGB'], ['hex', 'Hex codes'], ['grey', 'Grey'], ['alpha', 'See-through'], ['hsb', 'HSB']], show);
    const el = h('div.explorer.ex-colours', h('div.co-left', bar, panel), h('div.co-right', swatchBig, codeBox));
    show('rgb');
    return { el, enter() {}, leave() {} };
  };

  // =====================================================================
  // Shape builder: drag the handles, watch the numbers
  // =====================================================================
  const SHAPES = {
    rect: { args: ['x', 'y', 'width', 'height'], v: { x: 80, y: 110, width: 220, height: 140 } },
    ellipse: { args: ['x', 'y', 'width', 'height'], v: { x: 200, y: 200, width: 240, height: 150 } },
    line: { args: ['x1', 'y1', 'x2', 'y2'], v: { x1: 60, y1: 330, x2: 340, y2: 80 } },
    triangle: { args: ['x1', 'y1', 'x2', 'y2', 'x3', 'y3'], v: { x1: 200, y1: 60, x2: 70, y2: 330, x3: 330, y3: 330 } },
  };

  E.shapes = function (opts = {}) {
    const W = 400, H = 400;
    let shape = opts.shape || 'rect';
    const vals = JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(SHAPES).map(([k, s]) => [k, s.v]))));
    let dragging = null;
    let hover = null;
    const stage = h('div.ex-stage');
    const code = h('div.sh-code');
    const meaning = h('ul.arg-list');
    const tip = h('div.ex-msg');
    const view = scaledCanvas(stage, () => ({ w: W, h: H }), draw, 40);
    const col = (k) => COLORS[ARG[k % 6]];

    function handles() {
      const v = vals[shape];
      if (shape === 'rect') return [{ id: 'corner', x: v.x, y: v.y, color: COLORS.pink, label: 'drag the corner' }, { id: 'size', x: v.x + v.width, y: v.y + v.height, color: COLORS.green, label: 'drag to resize' }];
      if (shape === 'ellipse') return [{ id: 'centre', x: v.x, y: v.y, color: COLORS.pink }, { id: 'w', x: v.x + v.width / 2, y: v.y, color: COLORS.green }, { id: 'h', x: v.x, y: v.y + v.height / 2, color: COLORS.blue }];
      if (shape === 'line') return [{ id: 1, x: v.x1, y: v.y1, color: COLORS.pink }, { id: 2, x: v.x2, y: v.y2, color: COLORS.green }];
      return [{ id: 1, x: v.x1, y: v.y1, color: COLORS.pink }, { id: 2, x: v.x2, y: v.y2, color: COLORS.green }, { id: 3, x: v.x3, y: v.y3, color: COLORS.purple }];
    }

    function draw(ctx) {
      grid(ctx, W, H);
      const v = vals[shape];
      ctx.fillStyle = 'rgba(255, 197, 61, .55)';
      ctx.strokeStyle = COLORS.ink;
      ctx.lineWidth = 3;
      if (shape === 'rect') {
        ctx.fillRect(v.x, v.y, v.width, v.height); ctx.strokeRect(v.x, v.y, v.width, v.height);
        dashed(ctx, 0, v.y, v.x, v.y, col(0)); dashed(ctx, v.x, 0, v.x, v.y, col(1));
        label(ctx, 'x = ' + v.x, Math.max(4, v.x / 2 - 24), v.y - 8, col(0));
        label(ctx, 'y = ' + v.y, v.x + 6, Math.max(18, v.y / 2), col(1));
        arrow(ctx, v.x, v.y + v.height + 18, v.x + v.width, v.y + v.height + 18, col(2));
        label(ctx, 'width = ' + v.width, v.x + v.width / 2, v.y + v.height + 38, col(2), 'center');
        arrow(ctx, v.x + v.width + 18, v.y, v.x + v.width + 18, v.y + v.height, col(3));
        label(ctx, 'height = ' + v.height, v.x + v.width + 26, v.y + v.height / 2 + 5, col(3));
      } else if (shape === 'ellipse') {
        ctx.beginPath(); ctx.ellipse(v.x, v.y, Math.abs(v.width / 2), Math.abs(v.height / 2), 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = COLORS.muted; ctx.lineWidth = 1.5; ctx.strokeRect(v.x - v.width / 2, v.y - v.height / 2, v.width, v.height); ctx.restore();
        dashed(ctx, 0, v.y, v.x, v.y, col(0)); dashed(ctx, v.x, 0, v.x, v.y, col(1));
        label(ctx, 'x = ' + v.x, Math.max(4, v.x / 2 - 24), v.y - 8, col(0));
        label(ctx, 'y = ' + v.y, v.x + 6, Math.max(18, v.y / 2), col(1));
        arrow(ctx, v.x - v.width / 2, v.y + v.height / 2 + 18, v.x + v.width / 2, v.y + v.height / 2 + 18, col(2));
        label(ctx, 'width = ' + v.width, v.x, v.y + v.height / 2 + 38, col(2), 'center');
        arrow(ctx, v.x + v.width / 2 + 18, v.y - v.height / 2, v.x + v.width / 2 + 18, v.y + v.height / 2, col(3));
        label(ctx, 'height = ' + v.height, v.x + v.width / 2 + 26, v.y + 5, col(3));
      } else if (shape === 'line') {
        ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(v.x1, v.y1); ctx.lineTo(v.x2, v.y2); ctx.stroke();
        label(ctx, '(x1, y1) = (' + v.x1 + ', ' + v.y1 + ')', v.x1 + 12, v.y1 + 24, col(0));
        label(ctx, '(x2, y2) = (' + v.x2 + ', ' + v.y2 + ')', v.x2 + 12, v.y2 - 12, col(2));
      } else {
        ctx.beginPath(); ctx.moveTo(v.x1, v.y1); ctx.lineTo(v.x2, v.y2); ctx.lineTo(v.x3, v.y3); ctx.closePath(); ctx.fill(); ctx.stroke();
        label(ctx, '(x1, y1)', v.x1 + 12, v.y1 - 8, col(0));
        label(ctx, '(x2, y2)', v.x2 - 8, v.y2 + 26, col(2), 'right');
        label(ctx, '(x3, y3)', v.x3 + 8, v.y3 + 26, col(4));
      }
      handles().forEach((hd) => { dot(ctx, hd.x, hd.y, hover === hd.id || dragging === hd.id ? 11 : 9, hd.color); });
    }

    function updateText() {
      const s = SHAPES[shape];
      const v = vals[shape];
      code.replaceChildren(codeLine(shape, s.args.map((a) => v[a]), s.args), copyButton(() => shape + '(' + s.args.map((a) => v[a]).join(', ') + ');'));
      const ref = CC.REF[shape];
      meaning.replaceChildren(...s.args.map((a, k) => h('li', h('span.sig-arg.' + ARG[k % 6], a), h('span', { html: md(ref.args[a]) }))));
    }

    function pick(p) { return handles().find((hd) => Math.hypot(hd.x - p.x, hd.y - p.y) < 16 / Math.min(1, view.scale)); }
    const clamp = (n) => Math.max(0, Math.min(400, Math.round(n)));
    view.canvas.addEventListener('pointerdown', (e) => {
      const hd = pick(view.toSketch(e));
      if (!hd) return;
      dragging = hd.id;
      view.canvas.setPointerCapture(e.pointerId);
    });
    view.canvas.addEventListener('pointermove', (e) => {
      const p = view.toSketch(e);
      const v = vals[shape];
      if (!dragging) {
        const hd = pick(p);
        const id = hd ? hd.id : null;
        if (id !== hover) { hover = id; view.canvas.style.cursor = id ? 'grab' : 'default'; view.redraw(); }
        return;
      }
      if (shape === 'rect') {
        if (dragging === 'corner') { v.x = clamp(p.x); v.y = clamp(p.y); }
        else { v.width = Math.max(5, clamp(p.x - v.x)); v.height = Math.max(5, clamp(p.y - v.y)); }
      } else if (shape === 'ellipse') {
        if (dragging === 'centre') { v.x = clamp(p.x); v.y = clamp(p.y); }
        else if (dragging === 'w') v.width = Math.max(5, Math.round(Math.abs(p.x - v.x) * 2));
        else v.height = Math.max(5, Math.round(Math.abs(p.y - v.y) * 2));
      } else { v['x' + dragging] = clamp(p.x); v['y' + dragging] = clamp(p.y); }
      view.redraw(); updateText();
    });
    const stop = () => { dragging = null; };
    view.canvas.addEventListener('pointerup', stop);
    view.canvas.addEventListener('pointercancel', stop);

    const tips = {
      rect: 'A rectangle is placed by its **top-left corner**. Drag the pink dot to move it, the green dot to resize it.',
      ellipse: 'An ellipse is placed by its **centre**. Drag the pink dot to move it, the green and blue dots to stretch it.',
      line: 'A line needs **two points**: where it starts and where it ends.',
      triangle: 'A triangle needs **three corners**, so six numbers.',
    };
    function show(s) {
      shape = s;
      tip.replaceChildren(h('p', { html: md(tips[s]) }));
      view.redraw(); updateText();
    }
    const bar = tabs(Object.keys(SHAPES).map((s) => [s, s + '()']), show);
    const tryBtn = h('button.cta.small', { type: 'button', onclick: () => {
      const s = SHAPES[shape];
      CC.openPlayer('my_shape', 'size(400, 400);\nbackground(255);\nstrokeWeight(3);\nfill(255, 197, 61);\n' + shape + '(' + s.args.map((a) => vals[shape][a]).join(', ') + ');');
    } }, CC.icon('play'), ' Run it as a sketch');
    const el = h('div.explorer.ex-shapes', stage, h('div.ex-side', bar, tip, code, meaning, tryBtn));
    show(shape);
    return { el, enter() { view.resize(); }, leave() { view.destroy(); } };
  };

  // =====================================================================
  // Parts of a line of code (what is a function?)
  // =====================================================================
  const ANATOMY = [
    { line: 'ellipse(200, 200, 160, 110);' },
    { line: 'rect(60, 80, 220, 140);' },
    { line: 'fill(255, 100, 150);', preview: 'fill(255, 100, 150);\nnoStroke();\nellipse(200, 200, 260, 260);' },
    { line: 'line(40, 360, 360, 40);', preview: 'strokeWeight(8);\nline(40, 360, 360, 40);' },
    { line: 'background(135, 206, 250);', preview: 'background(135, 206, 250);' },
    { line: 'drawHouse(120, 120, 160);', own: true,
      preview: 'drawHouse(120, 120, 160);\n}\nvoid drawHouse(float x, float y, float s) {\n  fill(230, 200, 150);\n  rect(x, y + s * 0.5, s, s * 0.8);\n  fill(180, 60, 60);\n  triangle(x - 10, y + s * 0.5, x + s / 2, y, x + s + 10, y + s * 0.5);' },
  ];

  E.anatomy = function (opts = {}) {
    let current = ANATOMY[0];
    let revealed = opts.reveal ? 0 : 4;
    const lineBox = h('div.an-line');
    const notes = h('div.an-notes');
    const machine = h('div.an-machine');
    const preview = h('div.an-preview');
    let stage = null;

    function parts() {
      const m = /^(\w+)\((.*)\);$/.exec(current.line);
      return { name: m[1], args: m[2].split(',').map((s) => s.trim()) };
    }
    function render() {
      const { name, args } = parts();
      const ref = CC.REF[name];
      const sig = ref && ref.sigs ? ref.sigs[args.length] : null;
      const argNames = current.own ? ['x', 'y', 's'] : sig || args.map((_, k) => 'input ' + (k + 1));
      const piece = (cls, text, step) => h('span.an-piece.' + cls + (revealed >= step ? '.lit' : ''), text);
      lineBox.replaceChildren(...[
        piece('name', name, 1), piece('paren', '(', 2),
        args.map((a, k) => [k ? piece('comma', ', ', 4) : null, h('span.an-piece.arg.' + ARG[k % 6] + (revealed >= 3 ? '.lit' : ''), h('span.an-val', a), revealed >= 3 ? h('span.an-argname', argNames[k]) : null)]),
        piece('paren', ')', 2), piece('semi', ';', 4)].flat(2).filter(Boolean));
      const card = (step, cls, title, text) => revealed >= step ? h('div.an-note.' + cls, h('strong', title), h('p', { html: md(text) })) : null;
      notes.replaceChildren(...[
        card(1, 'pink', 'The name', current.own
          ? '`' + name + '` is a function **we made ourselves** with `void ' + name + '(...) { ... }`.'
          : '`' + name + '` is the **command**: what to do. ' + (ref ? ref.say : '')),
        card(2, 'blue', 'The brackets ( )', 'The **inputs** go inside. Even with no inputs you still need them: `noStroke();`'),
        card(3, 'yellow', 'The arguments', 'The **details**: numbers that say where, how big, or which colour. Their **order** matters!'),
        card(4, 'green', 'Commas and ;', 'Commas **separate** the inputs. The `;` **ends** the instruction, like a full stop.')].filter(Boolean));
    }
    function runPreview() {
      if (stage) stage.destroy();
      const body = current.preview || current.line;
      const src = current.own
        ? 'void setup() {\n  size(400, 400);\n  background(135, 206, 250);\n  noStroke();\n  ' + body + '\n}'
        : (/^background/.test(current.line) ? 'size(400, 400);\n' : 'size(400, 400);\nbackground(255);\nstrokeWeight(3);\nfill(255, 197, 61);\n') + body;
      stage = CC.Stage(src, 'preview');
      preview.replaceChildren(stage.el);
      stage.start();
    }
    function feed() {
      const chips = [...lineBox.querySelectorAll('.an-piece.arg')];
      machine.classList.remove('working');
      void machine.offsetWidth;
      machine.classList.add('working');
      chips.forEach((c, k) => { c.classList.remove('fly'); void c.offsetWidth; c.style.setProperty('--d', k * 0.12 + 's'); c.classList.add('fly'); });
      CC.sound.pop();
      setTimeout(() => { runPreview(); CC.sound.chime(); }, CC.reducedMotion() ? 0 : 700);
    }
    const picker = h('div.row.wrap', ANATOMY.map((a, k) => h('button.chip' + (k === 0 ? '.on' : ''), { type: 'button', onclick: (e) => {
      current = a;
      picker.querySelectorAll('.chip').forEach((c) => c.classList.remove('on'));
      e.currentTarget.classList.add('on');
      render();
      preview.replaceChildren(h('p.muted.small', 'Press "Run it" to feed the machine.'));
      if (stage) { stage.destroy(); stage = null; }
      CC.sound.blip();
    } }, a.line.replace(/\(.*/, '()'))));
    machine.append(h('div.an-hopper'), h('div.an-box', CC.icon('sparkle'), h('span', 'function machine')), h('div.an-chute'));
    const runBtn = h('button.cta', { type: 'button', onclick: feed }, CC.icon('play'), ' Run it');
    const builtin = h('div.an-kinds',
      h('div.an-kind', h('strong', 'Built-in functions'), h('p', { html: md('Come **with Processing**: `size`, `fill`, `ellipse`... there are hundreds! Find them in **Help → Reference**, or our dictionary.') }), h('a.chip', { href: '#/learn/dictionary' }, CC.icon('book'), 'Dictionary')),
      h('div.an-kind', h('strong', 'Your own functions'), h('p', { html: md('You can **make new commands**: `void drawHouse(float x, float y, float s) { ... }`. That\'s Module 7!') })));
    preview.append(h('p.muted.small', 'Press "Run it" to feed the machine.'));
    render();
    const el = h('div.explorer.ex-anatomy',
      h('div.an-left', picker, lineBox, notes, builtin),
      h('div.an-right', machine, runBtn, preview));
    return {
      el,
      steps: opts.reveal ? 4 : 0,
      step(i) { revealed = opts.reveal ? i : 4; render(); },
      enter() {},
      leave() { if (stage) stage.destroy(); },
    };
  };

  // ---------------- as slides ----------------
  const T = CC.slideTypes;
  const asSlide = (make) => (slide) => {
    const ex = make(slide);
    const el = CC.slideFrame(slide, [slide.text ? h('p.lead.tight', { html: md(slide.text) }) : null, ex.el], 'ex-slide');
    return { el, steps: ex.steps || 0, step: ex.step || (() => {}), enter: ex.enter, leave: ex.leave };
  };
  T.coords = asSlide(() => E.coords());
  T.colours = asSlide(() => E.colours());
  T.mixer = T.colours;
  T.shapes = asSlide((s) => E.shapes({ shape: s.shape }));
  T.anatomy = asSlide((s) => E.anatomy({ reveal: s.reveal !== false }));

  // ---------------- the learn pages ----------------
  CC.LEARN = [
    { id: 'coordinates', title: 'Coordinates', color: 'blue', icon: 'grid', text: 'Where is (0, 0)? Find any spot on the canvas, play the find-it game, and see how `size()` works.', make: () => E.coords() },
    { id: 'colour', title: 'Colour codes', color: 'pink', icon: 'shapes', text: 'RGB, hex codes like `#FF6496`, grey, see-through and HSB, with the code for each.', make: () => E.colours() },
    { id: 'shapes', title: 'Shape builder', color: 'yellow', icon: 'box', text: 'Drag a shape around and watch its numbers change: `rect`, `ellipse`, `line`, `triangle`.', make: () => E.shapes() },
    { id: 'functions', title: 'Parts of a line', color: 'green', icon: 'recipe', text: 'What is a function? The name, the brackets, the arguments and the `;`, fed into a function machine.', make: () => E.anatomy({ reveal: false }) },
    { id: 'dictionary', title: 'Code dictionary', color: 'blue', icon: 'question', text: 'Every word and symbol in our code, explained, with examples to play with.' },
    { id: 'reference', href: '#/reference', title: 'Processing reference', color: 'pink', icon: 'book', text: 'The full official reference (English and Spanish), with search and examples you can run.' },
  ];
})();
