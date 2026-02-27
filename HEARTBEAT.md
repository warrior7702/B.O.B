# Security Monitoring Tasks
# Run these checks periodically via OpenClaw heartbeat

## SSH Brute Force Monitor
# Run every 10 minutes
check_ssh() {
    /Users/campoffice/.openclaw/workspace/monitors/ssh-monitor.sh
}

## Disk Space Monitor  
# Run every hour
check_disk() {
    /Users/campoffice/.openclaw/workspace/monitors/disk-monitor.sh
}

## Config Audit
# Run daily (when HEARTBEAT first runs each day)
check_config() {
    /Users/campoffice/.openclaw/workspace/monitors/config-audit.sh
}