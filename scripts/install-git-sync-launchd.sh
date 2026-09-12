#!/bin/bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LABEL="com.zeta-hugh.wastlandhunter.git-sync"
PLIST_PATH="$HOME/Library/LaunchAgents/$LABEL.plist"
SYNC_SCRIPT="$REPO_ROOT/scripts/sync-to-github.sh"

chmod +x "$SYNC_SCRIPT"
mkdir -p "$HOME/Library/LaunchAgents"

cat >"$PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>$SYNC_SCRIPT</string>
  </array>
  <key>WorkingDirectory</key>
  <string>$REPO_ROOT</string>
  <key>StartInterval</key>
  <integer>18000</integer>
  <key>RunAtLoad</key>
  <false/>
  <key>StandardOutPath</key>
  <string>$REPO_ROOT/.git/auto-sync.log</string>
  <key>StandardErrorPath</key>
  <string>$REPO_ROOT/.git/auto-sync.log</string>
</dict>
</plist>
EOF

if launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; then
  launchctl bootout "gui/$(id -u)" "$PLIST_PATH"
fi
launchctl bootstrap "gui/$(id -u)" "$PLIST_PATH"

echo "Installed $LABEL"
echo "Schedule: every 5 hours"
echo "Log: $REPO_ROOT/.git/auto-sync.log"
