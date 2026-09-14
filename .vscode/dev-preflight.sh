#!/usr/bin/env bash
# Env + deps only (the API itself is started via launch.json).
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT/.dev/logs"
mkdir -p "$LOG_DIR"

info() { printf '[dev-preflight] %s\n' "$*"; }
warn() { printf '[dev-preflight] WARN: %s\n' "$*"; }
err()  { printf '[dev-preflight] ERROR: %s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }

ensure_env() {
  local dir="$1" label="$2"
  if [ ! -f "$dir/.env" ]; then
    if [ -f "$dir/.env.example" ]; then
      cp "$dir/.env.example" "$dir/.env"
      warn "Created $label .env from .env.example — review its values."
    else
      err "No $label .env and no .env.example."
      exit 1
    fi
  fi
}
ensure_env "$ROOT/backend" "backend"

if ! have npm; then
  err "npm not found."
  exit 1
fi

if [ ! -d "$ROOT/backend/node_modules" ]; then
  info "Installing backend dependencies…"
  ( cd "$ROOT/backend" && npm install ) >>"$LOG_DIR/backend.log" 2>&1 || exit 1
fi

info "Preflight complete."
