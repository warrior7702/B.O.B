#!/usr/bin/env node
/**
 * B.O.B. Message Poller
 * Checks Convex for new messages every 30 seconds
 * Sends Telegram notification when messages arrive
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHECK_INTERVAL = 30000; // 30 seconds
const SEEN_FILE = path.join(__dirname, '.seen-messages.json');
const AGENT_BRIDGE_DIR = '/Users/campoffice/.openclaw/workspace/agent-bridge';

// Load seen message IDs
function loadSeenMessages() {
  try {
    const data = fs.readFileSync(SEEN_FILE, 'utf8');
    return new Set(JSON.parse(data));
  } catch {
    return new Set();
  }
}

// Save seen message IDs
function saveSeenMessages(seen) {
  fs.writeFileSync(SEEN_FILE, JSON.stringify([...seen]));
}

// Get messages from Convex
function getMessages() {
  try {
    const result = execSync(
      `cd "${AGENT_BRIDGE_DIR}" && npx convex run agentComms:getMessagesForAgent '{"toAgent": "bob", "unreadOnly": true}' 2>/dev/null`,
      { encoding: 'utf8', timeout: 10000 }
    );
    
    // Parse the JSON from the output (strip warnings)
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    return [];
  }
}

// Send Telegram notification via OpenClaw
function notifyTelegram(message) {
  try {
    // Use OpenClaw's sessions_send or message tool via gateway
    const payload = JSON.stringify({
      action: 'send',
      channel: 'telegram',
      message: message
    });
    
    // For now, just log to console - in production this would call OpenClaw
    console.log(`[${new Date().toISOString()}] 📨 NEW MESSAGE: ${message.substring(0, 100)}...`);
    
    // You could also write to a file that OpenClaw watches
    const notifyFile = path.join(__dirname, '.notify-queue.json');
    const notifications = fs.existsSync(notifyFile) 
      ? JSON.parse(fs.readFileSync(notifyFile, 'utf8')) 
      : [];
    notifications.push({
      timestamp: Date.now(),
      message: message
    });
    fs.writeFileSync(notifyFile, JSON.stringify(notifications, null, 2));
    
  } catch (err) {
    console.error('Error sending notification:', err.message);
  }
}

// Mark message as read in Convex
function markRead(messageId) {
  try {
    execSync(
      `cd "${AGENT_BRIDGE_DIR}" && npx convex run agentComms:markMessageRead '{"messageId": "${messageId}"}' 2>/dev/null`,
      { timeout: 5000 }
    );
  } catch (err) {
    // Silent fail - will retry next poll
  }
}

// Main polling loop
async function poll() {
  const seen = loadSeenMessages();
  const messages = getMessages();
  
  let newCount = 0;
  
  for (const msg of messages) {
    if (!seen.has(msg._id)) {
      newCount++;
      seen.add(msg._id);
      
      const notification = `🪨 **From ${msg.fromAgent}** (${msg.fromInstance})\n\n${msg.content}\n\n_Priority: ${msg.priority}_`;
      notifyTelegram(notification);
      
      // Mark as read so we don't see it again
      markRead(msg._id);
    }
  }
  
  if (newCount > 0) {
    console.log(`[${new Date().toISOString()}] ✅ Found ${newCount} new message(s)`);
  } else {
    console.log(`[${new Date().toISOString()}] ✓ No new messages`);
  }
  
  saveSeenMessages(seen);
}

// Initial check
console.log('🦦 B.O.B. Message Poller Starting...');
console.log(`Checking Convex every ${CHECK_INTERVAL/1000}s for messages to "bob"`);
console.log('Press Ctrl+C to stop\n');

poll();

// Set up interval
setInterval(poll, CHECK_INTERVAL);

// Also send heartbeat every 5 minutes
setInterval(() => {
  try {
    execSync(
      `cd "${AGENT_BRIDGE_DIR}" && npx convex run agentComms:heartbeat '{"agentId": "bob", "instanceId": "bob-intel-macbook", "status": "online", "capabilities": ["web-search", "scrapling", "ollama"], "currentTask": "Polling for messages"}' 2>/dev/null`,
      { timeout: 5000 }
    );
    console.log(`[${new Date().toISOString()}] 💓 Heartbeat sent`);
  } catch (err) {
    // Silent fail
  }
}, 300000); // 5 minutes
