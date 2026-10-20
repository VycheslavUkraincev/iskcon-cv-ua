#!/bin/zsh
# Build for iskcon.cv.ua from this repo: same files, but <base href> points to the domain root instead of /iskcon-cv-ua/ (GitHub Pages).
# Usage: tools/build-domain.sh [out-dir]   (default: dist-domain)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:-dist-domain}"
rm -rf "$OUT"; mkdir -p "$OUT"
git ls-files -z -- assets food courses donation '*.html' | xargs -0 -I{} sh -c 'mkdir -p "$1/$(dirname "$2")" && cp "$2" "$1/$2"' _ "$OUT" {}
find "$OUT" -name '*.html' -exec sed -i '' 's#<base href="/iskcon-cv-ua/">#<base href="/">#' {} +
echo "domain build in $OUT ($(find "$OUT" -type f | wc -l | tr -d ' ') files)"
