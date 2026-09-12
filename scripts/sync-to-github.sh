#!/bin/bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOCK_DIR="$REPO_ROOT/.git/auto-sync.lock"
LOG_FILE="$REPO_ROOT/.git/auto-sync.log"

exec >>"$LOG_FILE" 2>&1
printf '\n[%s] Starting automatic sync\n' "$(date '+%Y-%m-%d %H:%M:%S %z')"

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "Another automatic sync is already running; skipping."
  exit 0
fi
trap 'rmdir "$LOCK_DIR"' EXIT

cd "$REPO_ROOT"

if [[ -n "$(git status --porcelain)" ]]; then
  git add --all
  git commit -m "chore(sync): automatic local backup $(date '+%Y-%m-%d %H:%M %z')"
else
  echo "No local changes to commit."
  exit 0
fi

git push origin "$(git branch --show-current)"
printf '[%s] Automatic sync completed\n' "$(date '+%Y-%m-%d %H:%M:%S %z')"
