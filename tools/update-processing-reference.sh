#!/usr/bin/env bash
# Fetch the Processing reference content (a sparse copy of processing-website) and import it
# into present/reference/. Needs git, python3 and Pillow. Run ./build-site.sh afterwards.
set -euo pipefail
cd "$(dirname "$0")/.."
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
git clone -q --depth 1 --filter=blob:none --sparse https://github.com/processing/processing-website.git "$tmp/pw"
git -C "$tmp/pw" sparse-checkout set \
  content/references/translations/en/processing \
  content/references/translations/es/processing \
  content/references/examples/processing
python3 -I tools/import-processing-reference.py "$tmp/pw" present/reference
