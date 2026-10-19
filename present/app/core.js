// Shared helpers for the Creative Coding Club presenter.
// Everything hangs off one global (CC) so the site works from file:// with plain <script> tags.
window.CC = { decks: [], slideTypes: {} };

CC.deck = function (deck) { CC.decks.push(deck); };

// h('div.card.pink', {onclick: fn}, child, 'text', [more]) -> element
CC.h = function (tag, attrs, ...kids) {
  if (attrs == null || attrs.nodeType || typeof attrs !== 'object' || Array.isArray(attrs)) {
    if (attrs != null) kids.unshift(attrs);
    attrs = {};
  }
  const [name, ...classes] = tag.split('.');
  const el = document.createElement(name || 'div');
  if (classes.length) el.className = classes.join(' ');
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'class') el.className = (el.className + ' ' + v).trim();
    else if (k === 'style' && typeof v === 'object') {
      for (const [prop, val] of Object.entries(v)) {
        if (prop.startsWith('--')) el.style.setProperty(prop, val); else el.style[prop] = val;
      }
    }
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
};

CC.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Tiny inline markdown: `code`, **bold**, *em*, [text](url). Input is escaped first.
CC.md = function (text) {
  let s = CC.esc(text || '');
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
       .replace(/\*([^*]+)\*/g, '<em>$1</em>')
       .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => '<code>' + codes[i] + '</code>');
};
CC.mdEl = (tag, text) => CC.h(tag, { html: CC.md(text) });

// localStorage can be missing or blocked (private windows, previews), so every access is guarded.
CC.store = {
  get(key, fallback) {
    try { const v = localStorage.getItem('cc:' + key); return v == null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('cc:' + key, JSON.stringify(value)); } catch (e) { /* not saved, still works */ }
  },
};

CC.palette = ['pink', 'yellow', 'green', 'blue'];
CC.colorOf = (i) => CC.palette[((i % 4) + 4) % 4];

CC.reducedMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- sound: short, quiet blips made with WebAudio (no files) ----------
CC.sound = {
  on: CC.store.get('sound', true),
  ctx: null,
  tone(freq, start, dur, type = 'sine', vol = 0.08) {
    if (!this.on) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const t = this.ctx.currentTime + start;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    } catch (e) { /* audio not available */ }
  },
  blip() { this.tone(660, 0, 0.12, 'triangle', 0.05); },
  pop() { this.tone(520, 0, 0.08, 'sine', 0.06); this.tone(780, 0.06, 0.1, 'sine', 0.05); },
  chime() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.12, 0.35, 'triangle', 0.07)); },
  toggle() { this.on = !this.on; CC.store.set('sound', this.on); if (this.on) this.blip(); return this.on; },
};

// ---------- confetti ----------
CC.confetti = function (originX, originY) {
  if (CC.reducedMotion()) return;
  const canvas = CC.h('canvas.confetti');
  document.body.append(canvas);
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const colors = ['#F27BAA', '#FFC53D', '#57B96A', '#4D6BFE', '#FFFFFF'];
  const x0 = originX ?? innerWidth / 2;
  const y0 = originY ?? innerHeight / 2;
  const bits = Array.from({ length: 140 }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 4 + Math.random() * 9;
    return {
      x: x0, y: y0, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6,
      r: 4 + Math.random() * 6, c: colors[(Math.random() * colors.length) | 0],
      spin: Math.random() * 6, shape: Math.random() < 0.5 ? 'circle' : 'rect',
    };
  });
  let frame = 0;
  (function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const b of bits) {
      b.x += b.vx; b.y += b.vy; b.vy += 0.28; b.vx *= 0.99; b.spin += 0.2;
      ctx.fillStyle = b.c;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.spin);
      if (b.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, b.r / 2, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2);
      ctx.restore();
    }
    if (++frame < 150) requestAnimationFrame(tick); else canvas.remove();
  })();
};

// ---------- icons (24px stroke icons, inline SVG) ----------
const ICONS = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
  pen: '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/><path d="M14 6l3 3"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M9 2h6"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.3" fill="currentColor"/><circle cx="15" cy="15" r="1.3" fill="currentColor"/><circle cx="15" cy="9" r="1.3" fill="currentColor"/><circle cx="9" cy="15" r="1.3" fill="currentColor"/>',
  notes: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 7h4"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  sound: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/>',
  mute: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>',
  play: '<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>',
  restart: '<path d="M20 12a8 8 0 11-2.3-5.7"/><path d="M20 4v5h-5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>',
  reset: '<path d="M3 12a9 9 0 109-9"/><path d="M3 4v5h5"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  star: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z" fill="currentColor" stroke="none"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" fill="currentColor" stroke="none"/>',
  code: '<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v6H4V6h6"/>',
  sparkle: '<path d="M12 3v6M12 15v6M3 12h6M15 12h6" /><path d="M12 9l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor"/>',
  train: '<rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 10h14M9 20l-2 2M15 20l2 2"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/>',
  bug: '<rect x="7" y="8" width="10" height="12" rx="5"/><path d="M12 8v12M7 12H3M21 12h-4M7 17l-3 2M17 17l3 2M8 6l-2-3M16 6l2-3"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0012 3z"/>',
  eraser: '<path d="M8 20l-4-4 10-10 6 6-8 8z"/><path d="M8 20h12"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0112 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15 14a5 5 0 016 5"/>',
  book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5"/>',
  hash: '<path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  console: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>',
};
CC.icon = function (name, cls) {
  const span = document.createElement('span');
  span.className = 'icon' + (cls ? ' ' + cls : '');
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || '') + '</svg>';
  return span;
};

// An icon button with an accessible label and an optional keyboard hint in the tooltip.
CC.btn = function (icon, label, onclick, opts = {}) {
  const b = CC.h('button.btn' + (opts.cls ? '.' + opts.cls : ''), {
    type: 'button', 'aria-label': label, title: label + (opts.key ? '  (' + opts.key + ')' : ''), onclick,
  }, CC.icon(icon), opts.text ? CC.h('span.btn-text', opts.text) : null);
  return b;
};

// A soft cloud (circles + a rounded base). Used for the titles, like stacked stickers.
CC.cloudSVG = function (fill) {
  return '<svg class="cloud-shape" viewBox="0 0 420 220" preserveAspectRatio="none" aria-hidden="true"><g fill="' + fill + '">' +
    '<circle cx="95" cy="130" r="72"/><circle cx="175" cy="88" r="86"/><circle cx="268" cy="92" r="80"/>' +
    '<circle cx="340" cy="138" r="62"/><rect x="60" y="120" width="310" height="86" rx="43"/></g></svg>';
};
CC.cloud = function (color, text, cls) {
  const fills = { pink: '#F59BC0', yellow: '#FFC53D', green: '#57B96A', blue: '#6C86FF', white: '#FFFFFF' };
  return CC.h('div.cloud.' + color + (cls ? '.' + cls : ''), { html: CC.cloudSVG(fills[color] || color) }, CC.h('span.cloud-text', text));
};

// Little round sticker badges scattered around a title.
CC.badges = function (list) {
  return CC.h('div.badges', { 'aria-hidden': 'true' },
    list.map(([icon, color, x, y, size]) => CC.h('span.badge.' + color, { style: { left: x, top: y, '--s': (size || 46) + 'px' } }, CC.icon(icon))));
};
