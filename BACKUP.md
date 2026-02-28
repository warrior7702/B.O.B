# B.O.B. Backup Pipeline

## What It Does
- **GitHub**: Pushes code changes (version control)
- **OneDrive**: Syncs entire workspace (cloud redundancy)
- **Automation**: Runs daily at 2 AM via cron

## Manual Backup
```bash
cd /Users/campoffice/.openclaw/workspace
./backup.sh
```

## Automated Backup
Runs daily at 2:00 AM via cron job:
- Commits all changes to Git
- Pushes to GitHub
- Syncs to OneDrive (FBCA account)
- Creates backup manifest

## Backup Locations
| Location | Path | Purpose |
|----------|------|---------|
| GitHub | warrior7702/B.O.B | Version control, public |
| OneDrive | `OneDrive - FBCA/B.O.B. Backup` | Cloud redundancy, private |
| Local | `.openclaw/workspace` | Active workspace |

## What's Backed Up
✅ All configs (openclaw.json, SOUL.md, etc.)
✅ Memory files (daily logs, learnings)
✅ Code and scripts
✅ Agent communication setup

❌ Excluded: node_modules, .next cache, logs, temp files

## Restore
From GitHub:
```bash
git clone https://github.com/warrior7702/B.O.B.git
```

From OneDrive:
Copy from `OneDrive - FBCA/B.O.B. Backup`

## Last Backup
Run: `cat backup.log | tail -5`
