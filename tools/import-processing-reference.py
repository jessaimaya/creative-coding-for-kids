#!/usr/bin/env python3
"""Import the Processing language reference into the presenter (present/reference/).

Reads the reference content from a checkout of github.com/processing/processing-website
(content/references/...) and writes compact data files plus resized example images:

  present/reference/en.js, es.js     the entries (English, Spanish)
  present/reference/examples.js      example code, picture file, and whether it can run in the browser
  present/reference/index.js         name -> page index (always loaded, small)
  present/reference/img/*.webp       example pictures, resized from 800x800 to 400x400
  present/reference/LICENSE.md       attribution (the content is CC BY-NC-SA 4.0)

Usage: tools/update-processing-reference.sh   (fetches the content, then runs this)
   or: python3 -I tools/import-processing-reference.py <processing-website checkout> present/reference
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image

LANGS = ["en", "es"]

# The index order used on processing.org/reference, and nicer subcategory titles.
CATEGORIES = ["structure", "environment", "data", "control", "shape", "input", "output", "transform",
              "lights_camera", "color", "image", "rendering", "typography", "math", "constants"]
CATEGORY_TITLES = {"lights_camera": "Lights, Camera"}
SUBCATEGORY_TITLES = {"string_functions": "String Functions", "array functions": "Array Functions",
                      "2d primitives": "2D Primitives", "3d primitives": "3D Primitives", "time date": "Time & Date",
                      "text area": "Text Area"}

# Examples that need files, 3D or Java-only features can't run in the browser preview (Processing.js).
NOT_IN_BROWSER = re.compile(
    r"\b(loadImage|requestImage|loadShape|loadStrings|loadBytes|loadTable|loadXML|loadJSONObject|loadJSONArray|"
    r"loadFont|createFont|loadShader|shader|selectInput|selectOutput|selectFolder|createReader|createWriter|"
    r"createInput|createOutput|saveStrings|saveBytes|saveTable|saveXML|saveJSONObject|saveJSONArray|saveStream|"
    r"beginRecord|beginRaw|thread|launch|link|settings|pixelDensity|displayDensity|fullScreen|smooth\(\s*\d|"
    r"P3D|OPENGL|P2D|PDF|SVG|FX2D|surface|cursor\(\s*\w+\s*,|Table|TableRow|XML|JSONObject|JSONArray|"
    r"FloatDict|IntDict|StringDict|FloatList|IntList|StringList|PrintWriter|BufferedReader|"
    r"textureMode|texture|camera|perspective|ortho|frustum|lights|ambientLight|directionalLight|pointLight|"
    r"spotLight|box|sphere|sphereDetail|modelX|screenX|beginCamera|PGraphics|createGraphics|PShape|createShape)\b")


# Examples that passed the check above but still fail in Processing.js (checked in headless Chrome).
BROWSER_FAILS = {"ArrayList#0", "PVector_copy_#0", "beginContour_#0", "endContour_#0", "blendMode_#0", "clip_#0",
                 "noClip_#0", "displayHeight#0", "displayWidth#0", "double#0", "long#0", "quadraticVertex_#0",
                 "quadraticVertex_#1", "super#0", "this#1"}


def as_list(value):
    """methods / classFields are sometimes stored as a JSON string instead of a list."""
    if isinstance(value, str):
        try:
            value = json.loads(value)
        except json.JSONDecodeError:
            return []
    return value if isinstance(value, list) else []


def norm_category(cat):
    cat = (cat or "").strip().lower()
    return cat


def title(text, table):
    text = (text or "").strip()
    if text.lower() in table:
        return table[text.lower()]
    return " ".join(w if w in ("&",) else w[:1].upper() + w[1:] for w in text.replace("_", " ").split())


def compact(entry):
    out = {
        "n": entry.get("name", ""),
        "b": (entry.get("brief") or "").strip(),
        "d": (entry.get("description") or "").strip(),
        "t": entry.get("type", ""),
        "c": norm_category(entry.get("category")),
        "sc": (entry.get("subcategory") or "").strip().lower(),
    }
    if entry.get("syntax"):
        out["s"] = entry["syntax"]
    if entry.get("returns"):
        out["r"] = entry["returns"]
    params = [{"n": p.get("name", ""), "d": (p.get("description") or "").strip(), "ty": p.get("type") or []}
              for p in entry.get("parameters") or []]
    if params:
        out["p"] = params
    if entry.get("related"):
        out["rel"] = entry["related"]
    if entry.get("classanchor") and entry.get("type") in ("method", "field"):
        out["ca"] = entry["classanchor"]
    methods = [{"a": m.get("anchor"), "n": m.get("name"), "d": m.get("desc", "")} for m in as_list(entry.get("methods"))]
    fields = [{"a": f.get("anchor"), "n": f.get("name"), "d": f.get("desc", "")} for f in as_list(entry.get("classFields"))]
    if methods:
        out["m"] = methods
    if fields:
        out["f"] = fields
    if entry.get("constructors"):
        out["k"] = entry["constructors"]
    return out


def write_js(path, call, data):
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    path.write_text("// Generated by tools/import-processing-reference.py. Content: Processing reference, CC BY-NC-SA 4.0.\n"
                    f"{call}({payload});\n", encoding="utf-8")


def main(src, out):
    refs = src / "content" / "references"
    out.mkdir(parents=True, exist_ok=True)
    img_dir = out / "img"
    if img_dir.exists():
        shutil.rmtree(img_dir)
    img_dir.mkdir()

    counts = {}
    for lang in LANGS:
        folder = refs / "translations" / lang / "processing"
        entries = {}
        for f in sorted(folder.glob("*.json")):
            anchor = f.stem[:-len("." + lang)] if f.stem.endswith("." + lang) else f.stem   # es files: ellipse_.es.json
            entries[anchor] = compact(json.loads(f.read_text(encoding="utf-8")))
        counts[lang] = len(entries)
        meta = {"categories": [{"id": c, "title": title(CATEGORY_TITLES.get(c, c), {})} for c in CATEGORIES],
                "subcategoryTitles": {k: v for k, v in SUBCATEGORY_TITLES.items()}}
        write_js(out / f"{lang}.js", "CC.REFDOC.load", {"lang": lang, "meta": meta, "entries": entries})
        if lang == "en":
            # small always-loaded index: plain name -> page, so explanation cards can link to the reference
            anchors = {}
            for anchor, e in entries.items():
                if e["t"] in ("method", "field") and e.get("ca"):
                    continue
                anchors.setdefault(re.sub(r"\(\)$", "", e["n"]).strip(), anchor)
            write_js(out / "index.js", "CC.REFDOC.setIndex", anchors)

    examples = {}
    n_img = n_run = 0
    for folder in sorted((refs / "examples" / "processing").iterdir()):
        if not folder.is_dir():
            continue
        items = []
        pdes = sorted(folder.glob("*.pde"), key=lambda p: [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", p.stem)])
        for index, pde in enumerate(pdes):
            code = pde.read_text(encoding="utf-8", errors="replace").replace("\r\n", "\n").strip("\n")
            png = pde.with_suffix(".png")
            img = None
            if png.exists():
                im = Image.open(png)
                im = im.convert("RGBA") if im.mode in ("P", "LA", "RGBA") else im.convert("RGB")
                im.thumbnail((400, 400), Image.LANCZOS)
                name = pde.stem + ".webp"
                im.save(img_dir / name, "WEBP", quality=82, method=6)
                img = "img/" + name
                n_img += 1
            run = not NOT_IN_BROWSER.search(code) and f"{folder.name}#{index}" not in BROWSER_FAILS
            n_run += run
            items.append({"code": code, "img": img, "run": run})
        if items:
            examples[folder.name] = items
    write_js(out / "examples.js", "CC.REFDOC.loadExamples", examples)

    commit = ""
    try:
        commit = subprocess.run(["git", "-C", str(src), "log", "-1", "--format=%H %cs"], capture_output=True, text=True).stdout.strip()
    except OSError:
        pass
    (out / "LICENSE.md").write_text(f"""# Processing reference (local copy)

The text, syntax tables and example pictures in this folder come from the **Processing reference**
(https://processing.org/reference), from the repository https://github.com/processing/processing-website
(content/references), commit {commit or 'unknown'}.

- The reference content is licensed under **Creative Commons Attribution-NonCommercial-ShareAlike 4.0**
  (CC BY-NC-SA 4.0, https://creativecommons.org/licenses/by-nc-sa/4.0/). This copy keeps that license.
- Examples without a credit line or credited to Daniel Shiffman are in the public domain
  (see https://github.com/processing/processing-examples/).
- Changes made for this course: converted from JSON to compact data files, example pictures resized
  from 800x800 to 400x400 WebP, and displayed in the Creative Coding Club presenter.

Because of the NonCommercial term, don't use this copy in a paid product without permission from the
Processing Foundation.
""", encoding="utf-8")

    print(f"entries: {counts}; examples: {sum(len(v) for v in examples.values())} in {len(examples)} pages; "
          f"pictures: {n_img}; runnable in browser: {n_run}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve())
