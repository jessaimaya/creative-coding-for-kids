// Small shape drawings for the module cards (each one hints at the big idea).
CC.moduleArt = function (name) {
  const P = '#F27BAA', Y = '#FFC53D', G = '#57B96A', B = '#4D6BFE', K = '#23303D';
  const art = {
    star: `<path d="M40 8l9 19 21 3-15 14 4 21-19-10-19 10 4-21-15-14 21-3z" fill="${Y}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>`,
    shapes: `<circle cx="26" cy="30" r="16" fill="${P}"/><rect x="40" y="16" width="28" height="28" rx="4" fill="${Y}"/><path d="M14 70l16-26 16 26z" fill="${B}"/><line x1="50" y1="70" x2="72" y2="50" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`,
    grid: `<g stroke="${K}" stroke-width="2" opacity=".35"><path d="M10 10h60v60H10zM30 10v60M50 10v60M10 30h60M10 50h60"/></g><circle cx="10" cy="10" r="6" fill="${P}"/><circle cx="50" cy="30" r="7" fill="${B}"/><path d="M50 30" />`,
    box: `<rect x="14" y="30" width="52" height="40" rx="6" fill="${Y}" stroke="${K}" stroke-width="3"/><rect x="22" y="18" width="36" height="16" rx="4" fill="#fff" stroke="${K}" stroke-width="3"/><text x="40" y="58" font-size="16" font-family="Fredoka" text-anchor="middle" fill="${K}">200</text>`,
    flipbook: `<rect x="14" y="20" width="44" height="44" rx="6" fill="#fff" stroke="${K}" stroke-width="3"/><rect x="22" y="14" width="44" height="44" rx="6" fill="#fff" stroke="${K}" stroke-width="3"/><circle cx="40" cy="36" r="9" fill="${P}"/><path d="M58 70h12M62 64h8" stroke="${B}" stroke-width="4" stroke-linecap="round"/>`,
    question: `<path d="M40 8l30 32-30 32-30-32z" fill="${B}"/><text x="40" y="50" font-size="30" font-family="Fredoka" font-weight="700" text-anchor="middle" fill="#fff">?</text>`,
    loop: `<circle cx="16" cy="40" r="9" fill="${P}"/><circle cx="36" cy="40" r="9" fill="${Y}"/><circle cx="56" cy="40" r="9" fill="${G}"/><path d="M14 60c10 14 44 14 54 0" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/><path d="M62 54l6 6-8 3" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
    recipe: `<rect x="16" y="10" width="48" height="60" rx="6" fill="#fff" stroke="${K}" stroke-width="3"/><path d="M26 26h28M26 38h28M26 50h18" stroke="${P}" stroke-width="4" stroke-linecap="round"/>`,
    dice: `<rect x="14" y="14" width="52" height="52" rx="12" fill="${P}"/><g fill="#fff"><circle cx="28" cy="28" r="5"/><circle cx="52" cy="52" r="5"/><circle cx="40" cy="40" r="5"/><circle cx="52" cy="28" r="5"/><circle cx="28" cy="52" r="5"/></g>`,
    cookie: `<path d="M40 10l9 19 21 3-15 14 4 21-19-10-19 10 4-21-15-14 21-3z" fill="none" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><circle cx="40" cy="40" r="6" fill="${Y}"/>`,
    game: `<rect x="8" y="24" width="64" height="34" rx="17" fill="${B}"/><path d="M24 34v14M17 41h14" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="52" cy="37" r="4" fill="${Y}"/><circle cx="60" cy="45" r="4" fill="${P}"/>`,
    book: `<path d="M14 18c8-4 18-4 26 2v44c-8-6-18-6-26-2z" fill="#fff" stroke="${K}" stroke-width="3" stroke-linejoin="round"/><path d="M66 18c-8-4-18-4-26 2v44c8-6 18-6 26-2z" fill="${Y}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/><path d="M20 30h12M20 38h12M48 30h12M48 38h12" stroke="${P}" stroke-width="3" stroke-linecap="round"/>`,
    browser: `<rect x="8" y="14" width="64" height="52" rx="8" fill="#fff" stroke="${K}" stroke-width="3"/><path d="M8 28h64" stroke="${K}" stroke-width="3"/><circle cx="16" cy="21" r="2.5" fill="${P}"/><circle cx="24" cy="21" r="2.5" fill="${Y}"/><circle cx="32" cy="21" r="2.5" fill="${G}"/><circle cx="40" cy="47" r="10" fill="${P}"/>`,
  };
  return '<svg viewBox="0 0 80 80" aria-hidden="true">' + (art[name] || art.star) + '</svg>';
};
