# Telegram Bridge - Quick Run

## Step 1: Set env vars (in terminal)
```bash
export TELEGRAM_TOKEN="your-bot-token-here"
export CHAT_ID="your-chat-id-here"  # e.g. -1001234567890 or @yourchannel
export PORT=3456
```

## Step 2: Install deps
```bash
cd /Users/campoffice/.openclaw/workspace
npm install
```

## Step 3: Run bridge
```bash
npm start
```

## Step 4: Set webhook (run this in another terminal while bridge is running)
```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-ngrok-or-public-url/webhook"}'
```

For local testing, use ngrok:
```bash
npx ngrok http 3456
# Then use the https URL from ngrok in setWebhook
```

## Step 5: Test approval flow
1. Trigger an approval from OpenClaw (it will POST to http://localhost:3456/request-approval)
2. Check Telegram - you should see the approval message
3. Reply with `/approve TICKET_ID` or `/deny TICKET_ID`
4. Bridge forwards decision back to OpenClaw

Done!