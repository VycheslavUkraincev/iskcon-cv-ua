#!/bin/zsh
# Usage: tools/deploy.sh <domain-build-dir> [--dry-run]
# Uploads a built site to iskcon.cv.ua:public_html over SSH (rsync), keeps a dated backup on the server first,
# then sets permissions (dirs 755, files 644).
set -euo pipefail
SRC="${1:?usage: deploy-iskcon.sh <build-dir> [--dry-run]}"
[ -f "$SRC/index.html" ] || { echo "no index.html in $SRC"; exit 1; }
DRY=""; [ "${2:-}" = "--dry-run" ] && DRY="-n"
STAMP=$(date +%Y-%m-%d_%H-%M-%S)
if [ -z "$DRY" ]; then
  ssh iskcon "tar -czf public_html_backup_${STAMP}.tar.gz public_html && echo backup: public_html_backup_${STAMP}.tar.gz"
fi
# no --delete: extra files on the server are kept; add --delete deliberately if you want an exact mirror
rsync -rlptvzc $DRY --exclude '.usermin' --exclude 'cgi-bin' "$SRC"/ iskcon:public_html/
if [ -z "$DRY" ]; then
  ssh iskcon "find public_html -path public_html/.usermin -prune -o -path public_html/cgi-bin -prune -o -type d -exec chmod 755 {} + ; find public_html -path public_html/.usermin -prune -o -path public_html/cgi-bin -prune -o -type f -exec chmod 644 {} + ; echo permissions set"
fi
