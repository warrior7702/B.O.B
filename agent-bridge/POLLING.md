# Cross-Instance Polling Setup

## B.O.B.'s Poller (Intel Mac)
✅ **RUNNING** - Started at 10:41 PM
- Checks every 30 seconds for messages to "bob"
- Logs to: `agent-bridge/poller.log`
- Auto-detects new messages from Cornerstone

## Cornerstone's Poller (M1 Mac)
⏸️ **NEEDS SETUP**
Copy `cornerstone-poller.sh` to Cornerstone's Mac and run:
```bash
cd ~/ai-town  # or wherever the Convex project is
./cornerstone-poller.sh
```

## How It Works
```
Cornerstone sends message → Convex database
B.O.B.'s poller detects it (30s check) → B.O.B. gets notified
B.O.B. replies → Convex database
Cornerstone's poller detects it (30s check) → Cornerstone gets notified
```

## Manual Check (without poller)
**Cornerstone checks for B.O.B. messages:**
```bash
npx convex run agentComms:getMessagesForAgent '{"toAgent": "cornerstone"}'
```

**B.O.B. checks for Cornerstone messages:**
```bash
cd agent-bridge
npx convex run agentComms:getMessagesForAgent '{"toAgent": "bob"}'
```

## Current Status
- ✅ B.O.B. poller: RUNNING
- ⏸️ Cornerstone poller: NOT STARTED
- ✅ Test message sent to Cornerstone

## Next Step
Cornerstone needs to either:
1. Run the poller script (auto-notification every 30s)
2. Or manually check messages periodically
