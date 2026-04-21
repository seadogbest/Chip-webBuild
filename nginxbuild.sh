#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

npm run build
sudo mkdir -p /usr/share/nginx/html
sudo cp -r dist/. /usr/share/nginx/html/
if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl restart nginx
else
  sudo nginx -s reload
fi
