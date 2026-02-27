const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const OPENCLAW_URL = process.env.OPENCLAW_URL || 'http://localhost:3000';

if (!TOKEN || !CHAT_ID) {
  console.error('Missing TELEGRAM_TOKEN or CHAT_ID env vars');
  process.exit(1);
}

const API = `https://api.telegram.org/bot${TOKEN}`;

// Send approval request to Telegram
async function sendApproval(ticket) {
  const text = `🔔 OpenClaw Approval Needed\n\nTicket: ${ticket.id}\nAction: ${ticket.action}\nSummary: ${ticket.summary}\nFrom: ${ticket.instance}\n\nReply with:\n/approve ${ticket.id}\n/deny ${ticket.id}`;
  
  await axios.post(`${API}/sendMessage`, {
    chat_id: CHAT_ID,
    text: text
  });
}

// Handle Telegram commands
app.post('/webhook', async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.text) return res.sendStatus(200);
  
  const text = msg.text.trim();
  const parts = text.split(' ');
  const cmd = parts[0];
  const ticketId = parts[1];
  
  if (cmd === '/approve' || cmd === '/deny') {
    const decision = cmd === '/approve' ? 'approved' : 'denied';
    
    // Notify OpenClaw of decision
    await axios.post(`${OPENCLAW_URL}/api/v1/approve`, {
      ticket_id: ticketId,
      decision: decision,
      timestamp: new Date().toISOString()
    });
    
    // Confirm to user
    await axios.post(`${API}/sendMessage`, {
      chat_id: CHAT_ID,
      text: `✅ Ticket ${ticketId} ${decision}`
    });
  }
  
  res.sendStatus(200);
});

// Expose function for OpenClaw to call
app.post('/request-approval', async (req, res) => {
  await sendApproval(req.body);
  res.json({ status: 'sent' });
});

const PORT = process.env.PORT || 3457;
app.listen(PORT, () => {
  console.log(`Bridge running on port ${PORT}`);
});
