#!/usr/bin/env python3
"""Take the README screenshots of the presenter and frame them (browser window or phone, soft shadow).

Needs Google Chrome or Chromium and Pillow. Build the site first (./build-site.sh), then:

    python3 tools/screenshots.py            writes docs/screenshots/*.png

Each shot opens site/index.html at a route in headless Chrome (2x pixels). A few shots click something
first (an explanation card, dots on the coordinates grid); those actions are in ACTIONS below.
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
OUT = ROOT / "docs" / "screenshots"
FONT = ROOT / "present" / "vendor" / "fonts" / "Nunito-normal.woff2"
SCALE = 2

# name, route, window size, background colours (top-left, bottom-right), address bar text
SHOTS = [
    ("dashboard", "#/", (1280, 800), ("#57B96A", "#2B7F43"), "Lessons"),
    ("phone", "#/", (390, 844), None, None),
    ("live-code", "#/deck/06/10", (1280, 800), ("#FFE7A3", "#FFC53D"), "Module 6 · Loops"),
    ("explain", "#/deck/06/3", (1280, 800), ("#FFF2CC", "#FFC53D"), "Click any word to explain it"),
    ("coordinates", "#/learn/coordinates", (1280, 700), ("#E5F5E8", "#9FD8AC"), "How code works · Coordinates"),
    ("shapes", "#/learn/shapes", (1280, 680), ("#FDE1EC", "#F27BAA"), "How code works · Shape builder"),
    ("colour", "#/learn/colour", (1280, 600), ("#E4E9FF", "#8EA2FF"), "How code works · Colour codes"),
    ("reference", "#/reference/arc_", (1280, 800), ("#E4E9FF", "#4D6BFE"), "Processing reference · arc()"),
    ("teacher-notes", "#/notes/05-conditionals", (1280, 800), ("#FDE1EC", "#F27BAA"), "Teacher notes · Module 5"),
    ("sketch-lab", "#/lab", (1280, 800), ("#E5F5E8", "#57B96A"), "Sketch Lab"),
]

ACTIONS = """
const shot = new URLSearchParams(location.search).get('shot');
setTimeout(() => {
  if (shot === 'explain') {   // open the card for the ellipse's width
    const line = [...document.querySelectorAll('.code-panel .line')].find((l) => l.textContent.includes('ellipse('));
    const nums = [...line.querySelectorAll('[data-tok]')].filter((t) => t.textContent === '30');
    nums[nums.length - 2].click();
  }
  if (shot === 'coordinates') {   // drop four dots and hover a fifth spot
    const c = document.querySelector('.learn-stage canvas');
    const r = c.getBoundingClientRect();
    const at = (fx, fy) => ({ bubbles: true, clientX: r.left + r.width * fx, clientY: r.top + r.height * fy });
    [[.25, .25], [.5, .5], [.75, .3], [.3, .75]].forEach(([x, y]) => c.dispatchEvent(new MouseEvent('click', at(x, y))));
    c.dispatchEvent(new PointerEvent('pointermove', at(.62, .68)));
  }
}, 1200);
"""


def chrome():
    for name in ("google-chrome-stable", "google-chrome", "chromium", "chromium-browser"):
        if shutil.which(name):
            return name
    sys.exit("Chrome or Chromium is needed.")


def take(raw_dir):
    page = SITE / "zz-screenshots.html"
    script = SITE / "zz-screenshots.js"
    html = (SITE / "index.html").read_text(encoding="utf-8")
    page.write_text(html.replace("</body>", '<script src="zz-screenshots.js"></script></body>'), encoding="utf-8")
    script.write_text(ACTIONS, encoding="utf-8")
    try:
        procs = []
        for name, route, (w, h), *_ in SHOTS:
            procs.append(subprocess.Popen([chrome(), "--headless", "--disable-gpu", "--allow-file-access-from-files", "--hide-scrollbars",
                                           f"--window-size={w},{h}", f"--force-device-scale-factor={SCALE}", "--virtual-time-budget=5000",
                                           f"--screenshot={raw_dir / (name + '.png')}", f"{page.as_uri()}?shot={name}{route}"],
                                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL))
        for p in procs:
            p.wait()
    finally:
        page.unlink(missing_ok=True)
        script.unlink(missing_ok=True)


def font(size):
    return ImageFont.truetype(str(FONT), size)


def gradient(size, a, b):
    """Diagonal gradient from colour a (top-left) to b (bottom-right)."""
    w, h = size
    a, b = Image.new("RGB", (1, 1), a).getpixel((0, 0)), Image.new("RGB", (1, 1), b).getpixel((0, 0))
    small = Image.new("RGB", (64, 64))
    for y in range(64):
        for x in range(64):
            t = (x + y) / 126
            small.putpixel((x, y), tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3)))
    return small.resize((w, h), Image.BILINEAR)


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius, fill=255)
    return mask


def shadow(canvas, box, radius, blur=40, offset=24, alpha=70):
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    x0, y0, x1, y1 = box
    ImageDraw.Draw(layer).rounded_rectangle((x0, y0 + offset, x1, y1 + offset), radius, fill=(20, 30, 45, alpha))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur)))


def browser(shot, address):
    """The screenshot inside a light browser window."""
    bar = 76
    w, h = shot.size
    win = Image.new("RGBA", (w, h + bar), "#FFFFFF")
    d = ImageDraw.Draw(win)
    d.rectangle((0, 0, w, bar), fill="#F1F3F6")
    for i, c in enumerate(("#FF6159", "#FFBD2E", "#28C941")):
        d.ellipse((30 + i * 36, bar / 2 - 11, 52 + i * 36, bar / 2 + 11), fill=c)
    pill = (170, 16, w - 170, bar - 16)
    d.rounded_rectangle(pill, 22, fill="#FFFFFF")
    f = font(26)
    text = "Creative Coding Club" + (" · " + address if address else "")
    tw = d.textlength(text, font=f)
    d.text(((w - tw) / 2, bar / 2), text, font=f, fill="#5E6B78", anchor="lm")
    win.paste(shot, (0, bar))
    win.putalpha(rounded_mask(win.size, 28))
    return win


def phone(shot):
    """The screenshot inside a phone with rounded corners, a status bar and a camera notch."""
    border, status = 26, 100
    w, h = shot.size
    body = Image.new("RGBA", (w + border * 2, h + status + border * 2), (0, 0, 0, 0))
    ImageDraw.Draw(body).rounded_rectangle((0, 0, body.width - 1, body.height - 1), 110, fill="#1E2740")
    screen = Image.new("RGBA", (w, h + status), "#FFFBF3")
    screen.paste(shot, (0, status))
    sd = ImageDraw.Draw(screen)
    sd.text((70, status / 2 + 6), "9:41", font=font(34), fill="#23303D", anchor="lm")
    sd.rounded_rectangle((w - 120, status / 2 - 6, w - 70, status / 2 + 18), 7, outline="#23303D", width=3)
    sd.rounded_rectangle((w - 115, status / 2 - 1, w - 82, status / 2 + 13), 4, fill="#23303D")
    screen.putalpha(rounded_mask(screen.size, 86))
    body.alpha_composite(screen, (border, border))
    d = ImageDraw.Draw(body)
    d.rounded_rectangle((body.width / 2 - 90, border + 18, body.width / 2 + 90, border + 58), 20, fill="#1E2740")
    return body


def framed(shot, address, colours, out_width=1600):
    win = browser(shot, address)
    pad = 120
    canvas = gradient((win.width + pad * 2, win.height + pad * 2), *colours).convert("RGBA")
    shadow(canvas, (pad, pad, pad + win.width, pad + win.height), 28)
    canvas.alpha_composite(win, (pad, pad))
    canvas = canvas.convert("RGB")
    return canvas.resize((out_width, round(canvas.height * out_width / canvas.width)), Image.LANCZOS)


def hero(desktop, mobile, out_width=1800):
    """The dashboard in a browser window with the phone version in front of it."""
    win = browser(desktop, "Lessons")
    ph = phone(mobile)
    ph = ph.resize((round(ph.width * 0.82), round(ph.height * 0.82)), Image.LANCZOS)
    pad = 140
    W = win.width + pad * 2 + ph.width // 2
    H = win.height + pad * 2
    canvas = gradient((W, H), "#57B96A", "#2B7F43").convert("RGBA")
    # a few soft dots, like the presenter's clouds and stickers
    dots = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(dots)
    for x, y, r, c in ((0.04, 0.12, 60, "#FFC53D"), (0.95, 0.08, 46, "#F27BAA"), (0.92, 0.9, 70, "#4D6BFE"), (0.03, 0.88, 40, "#FFFFFF")):
        d.ellipse((W * x - r, H * y - r, W * x + r, H * y + r), fill=c)
    canvas.alpha_composite(dots)
    shadow(canvas, (pad, pad, pad + win.width, pad + win.height), 28)
    canvas.alpha_composite(win, (pad, pad))
    px, py = W - pad // 2 - ph.width, H - ph.height - pad // 3
    shadow(canvas, (px, py, px + ph.width, py + ph.height), 90, blur=36, alpha=90)
    canvas.alpha_composite(ph, (px, py))
    canvas = canvas.convert("RGB")
    return canvas.resize((out_width, round(canvas.height * out_width / canvas.width)), Image.LANCZOS)


def main():
    if not (SITE / "index.html").exists():
        sys.exit("Build the site first: ./build-site.sh")
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp)
        take(raw)
        shots = {name: Image.open(raw / (name + ".png")).convert("RGB") for name, *_ in SHOTS}
        hero(shots["dashboard"], shots["phone"]).save(OUT / "hero.png", optimize=True)
        for name, _, _, colours, address in SHOTS:
            if colours and name != "dashboard":
                framed(shots[name], address, colours).save(OUT / (name + ".png"), optimize=True)
    for f in sorted(OUT.glob("*.png")):
        print(f"{f.relative_to(ROOT)}  {f.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
