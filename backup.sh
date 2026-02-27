# Git + OneDrive Backup Pipeline for B.O.B.
# Backs up workspace to Git and syncs to OneDrive

set -euo pipefail

WORKSPACE_DIR="/Users/campoffice/.openclaw/workspace"
ONEDRIVE_DIR="${ONEDRIVE_BACKUP_DIR:-$HOME/OneDrive/OpenClaw-Backup}"
LOG_FILE="$WORKSPACE_DIR/backup.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting backup..." >> "$LOG_FILE"

cd "$WORKSPACE_DIR"

# 1. Git backup
echo "[$DATE] Git backup..." >> "$LOG_FILE"
git add -A 2>/dev/null || true
git commit -m "Auto-backup: $DATE" 2>/dev/null || echo "[$DATE] Nothing to commit or already committed" >> "$LOG_FILE"

# 2. OneDrive sync (if directory exists)
if [ -d "$HOME/OneDrive" ]; then
    echo "[$DATE] OneDrive sync..." >> "$LOG_FILE"
    mkdir -p "$ONEDRIVE_DIR"
    
    # Use rsync for efficient sync (exclude node_modules, .git)
    rsync -av --delete \
        --exclude='node_modules/' \
        --exclude='.git/' \
        --exclude='.openclaw/' \
        --exclude='functions.write_141_{' \
        "$WORKSPACE_DIR/" "$ONEDRIVE_DIR/" >> "$LOG_FILE" 2>&1
    
    echo "[$DATE] OneDrive sync complete" >> "$LOG_FILE"
else
    echo "[$DATE] OneDrive not found, skipping cloud sync" >> "$LOG_FILE"
fi

echo "[$DATE] Backup complete" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"