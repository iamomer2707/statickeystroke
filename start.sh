#!/usr/bin/env bash
# SKDA — start backend + frontend with a single command.
#   $ ./start.sh
# Stops both servers on Ctrl-C.

set -euo pipefail

cd "$(dirname "$0")"

PY=${PYTHON:-python3}

# 1. Backend dependencies + migrations (only run once unless something changes)
echo "→ Ensuring Python dependencies"
$PY -m pip install --quiet --disable-pip-version-check -r requirements.txt
$PY manage.py migrate --noinput

# 2. Frontend dependencies
if [ ! -d frontend/node_modules ]; then
  echo "→ Installing frontend dependencies (first run only)"
  (cd frontend && npm install)
fi

# 3. Run both servers, kill them together on exit
echo "→ Starting Django on http://localhost:8000"
$PY manage.py runserver 0.0.0.0:8000 &
DJANGO_PID=$!

echo "→ Starting Vite on http://localhost:3000"
(cd frontend && npm run dev) &
VITE_PID=$!

cleanup() {
  echo ""
  echo "Stopping servers…"
  kill "$DJANGO_PID" "$VITE_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

wait
