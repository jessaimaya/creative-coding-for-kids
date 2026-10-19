// A small tokenizer for Processing (Java mode) and p5.js code.
// It keeps every character, so joining the token texts gives back the exact source.
(function () {
  const words = (s) => new Set(s.split(/\s+/));
  const KEYWORDS = {
    pde: words('if else for while do return new class void break continue switch case default this extends static final import public private true false null'),
    js: words('if else for while do return new class function let const var break continue switch case default this extends import export async await true false null undefined of in typeof'),
  };
  const TYPES = words('int float boolean color String char double long byte PImage PVector PFont ArrayList HashMap');
  const BUILTIN_VARS = words('width height mouseX mouseY pmouseX pmouseY frameCount key keyCode mouseIsPressed keyIsPressed mouseButton');
  const CONSTANTS = words('PI TWO_PI HALF_PI QUARTER_PI CENTER LEFT RIGHT UP DOWN TOP BOTTOM HSB RGB CORNER CORNERS RADIUS CLOSE BASELINE LEFT_ARROW RIGHT_ARROW UP_ARROW DOWN_ARROW');

  const RULES = [
    ['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ['string', /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/y],
    ['number', /(?:\d+\.\d*|\.\d+|\d+)[fF]?/y],
    ['word', /[A-Za-z_$][\w$]*/y],
    ['space', /\s+/y],
    ['punct', /==|!=|<=|>=|&&|\|\||\+\+|--|\+=|-=|\*=|\/=|[\s\S]/y],
  ];

  CC.tokenize = function (src, lang = 'pde') {
    const tokens = [];
    let pos = 0;
    while (pos < src.length) {
      for (const [type, re] of RULES) {
        re.lastIndex = pos;
        const m = re.exec(src);
        if (!m) continue;
        tokens.push({ t: type, s: m[0] });
        pos += m[0].length;
        break;
      }
    }
    // Classify words now that we can look ahead to see if a "(" follows.
    const kw = KEYWORDS[lang] || KEYWORDS.pde;
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      if (tok.t !== 'word') continue;
      let j = i + 1;
      while (j < tokens.length && tokens[j].t === 'space') j++;
      const callsSomething = tokens[j] && tokens[j].s === '(';
      if (kw.has(tok.s)) tok.t = 'keyword';
      else if (TYPES.has(tok.s)) tok.t = 'type';
      else if (callsSomething) tok.t = 'func';
      else if (BUILTIN_VARS.has(tok.s)) tok.t = 'builtin';
      else if (CONSTANTS.has(tok.s)) tok.t = 'const';
      else tok.t = 'ident';
    }
    return tokens;
  };

  // Can this number turn negative when dragged? Only where a minus sign makes valid code:
  // right after "(", ",", "=" or "return" (e.g. speed = -3, random(-1, 1)).
  CC.allowsNegative = function (tokens, i) {
    for (let j = i - 1; j >= 0; j--) {
      const t = tokens[j];
      if (t.t === 'space') continue;
      return t.s === '(' || t.s === ',' || t.s === '=' || t.s === 'return';
    }
    return true;
  };

  // Render tokens as one <div class="line"> per source line.
  // Returns { el, lines: [lineEl...], numberEls: Map(tokenIndex -> span) }.
  CC.renderCode = function (tokens, opts = {}) {
    const root = CC.h('div.code');
    const lines = [];
    const numberEls = new Map();
    let line = null;
    let lineHasChangeMe = false;
    const pendingNums = [];
    const newLine = () => {
      if (line) finishLine();
      const n = lines.length + 1;
      line = CC.h('div.line', { 'data-n': n }, CC.h('span.ln', String(n)));
      line.src = CC.h('span.src');
      line.append(line.src);
      lines.push(line);
      root.append(line);
      lineHasChangeMe = false;
    };
    const finishLine = () => {
      if (lineHasChangeMe) {
        line.classList.add('change-line');
        for (const el of pendingNums) el.classList.add('hot');
      }
      pendingNums.length = 0;
      if (!line.src.childNodes.length) line.src.append('​');
    };
    newLine();
    tokens.forEach((tok, i) => {
      const parts = tok.s.split('\n');
      parts.forEach((part, k) => {
        if (k > 0) newLine();
        if (!part) return;
        if (tok.t === 'space' || (tok.t === 'punct' && !(CC.SYMBOLS && CC.SYMBOLS[tok.s]))) {
          line.src.append(part);
          return;
        }
        // every word, number and known symbol is clickable (data-tok) so it can be explained
        const span = CC.h('span.tok-' + (tok.t === 'punct' ? 'op' : tok.t), part);
        span.dataset.tok = i;
        if (tok.t === 'comment' && /CHANGE ME|TODO/.test(part)) {
          span.classList.add('tok-flag');
          if (/CHANGE ME/.test(part)) lineHasChangeMe = true;
        }
        if (tok.t === 'number') {
          numberEls.set(i, span);
          if (opts.scrub) {
            span.classList.add('scrub');
            span.tabIndex = 0;
            span.title = 'Drag to change me, click to ask what I mean';
          }
          pendingNums.push(span);
        }
        line.src.append(span);
      });
    });
    finishLine();
    return { el: root, lines, numberEls };
  };

  // Find line numbers (1-based) for a spotlight spec:
  // {lines:[3,4]} | {find:'text' or ['a','b']} | {from:'void setup', to:'}'}
  CC.findLines = function (source, spec) {
    if (!spec) return [];
    const srcLines = source.split('\n');
    if (spec.lines) return spec.lines.slice();
    if (spec.find) {
      const needles = [].concat(spec.find);
      const out = [];
      srcLines.forEach((l, i) => { if (needles.some((n) => l.includes(n))) out.push(i + 1); });
      return spec.first ? out.slice(0, 1) : out;
    }
    if (spec.from) {
      const start = srcLines.findIndex((l) => l.includes(spec.from));
      if (start < 0) return [];
      const to = spec.to || '}';
      let end = start;
      for (let i = start + 1; i < srcLines.length; i++) {
        end = i;
        if (srcLines[i].trim().startsWith(to)) break;
      }
      return Array.from({ length: end - start + 1 }, (_, k) => start + k + 1);
    }
    return [];
  };
})();
