#!/bin/bash
# B.O.B. Git + OneDrive Backup Pipeline
# Backs up workspace to both GitHub and OneDrive

set -euo pipefail

WORKSPACE="/Users/campoffice/.openclaw/workspace"
ONEDRIVE_DIR="/Users/campoffice/OneDrive - First Baptist Church Arlington/B.O.B. Backup"
LOG_FILE="$WORKSPACE/backup.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

log() {
    echo "[$DATE] $1" | tee -a "$LOG_FILE"
}

cd "$WORKSPACE"

log "=== Starting Backup ==="

# Step 1: Git commit any changes
if [[ -n $(git status --porcelain) ]]; then
    log "Changes detected, committing..."
    git add -A
    git commit -m "Auto-backup: $(date '+%Y-%m-%d %H:%M')" || log "Nothing to commit"
    git push origin main && log "✅ Pushed to GitHub"
else
    log "✅ No changes to commit"
fi

# Step 2: Sync to OneDrive
mkdir -p "$ONEDRIVE_DIR"

# Use rsync for efficient sync (exclude node_modules, .next, etc.)
rsync -av --delete \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='__pycache__' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    "$WORKSPACE/" "$ONEDRIVE_DIR/" >> "$LOG_FILE" 2>&1

log "✅ Synced to OneDrive: $ONEDRIVE_DIR"

# Step 3: Create backup manifest
MANIFEST="$ONEDRIVE_DIR/BACKUP-MANIFEST.txt"
echo "B.O.B. Backup Manifest" > "$MANIFEST"
echo "Generated: $DATE" >> "$MANIFEST"
echo "Git Commit: $(git rev-parse --short HEAD)" >> "$MANIFEST"
echo "Git Branch: $(git branch --show-current)" >> "$MANIFEST"
echo "Git Remote: $(git remote get-url origin)" >> "$MANIFEST"
echo "Total Size: $(du -sh "$WORKSPACE" | cut -f1)" >> "$MANIFEST"

log "✅ Backup manifest created"
log "=== Backup Complete ==="

# Send Telegram notification
if command -v openclaw &> /dev/null; then
    openclaw message send "🦦 B.O.B. Backup Complete\nGit: $(git rev-parse --short HEAD)\nOneDrive: $(basename "$ONEDRIVE_DIR")\nTime: $(date '+%H:%M')" 2>/dev/null || true
fi
