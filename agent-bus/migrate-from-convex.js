/**
 * One-time migration: Convex merry-rabbit-524 → AgentBus
 * Run once on B.O.B.'s machine while Convex is still accessible.
 * node migrate-from-convex.js
 */

const CONVEX_URL = 'https://merry-rabbit-524.convex.cloud';
const AGENTBUS_URL = 'http://localhost:4747';

async function convexQuery(path, args = {}) {
  const r = await fetch(`${CONVEX_URL}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args }),
  });
  const d = await r.json();
  return d.value;
}

async function post(path, body) {
  const r = await fetch(`${AGENTBUS_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function main() {
  console.log('Fetching messages from Convex...');
  const messages = await convexQuery('agentComms:getAllMessages', { limit: 200 });
  console.log(`Got ${messages.length} messages`);

  // Seed in chronological order
  const sorted = [...messages].reverse();
  let ok = 0;
  for (const m of sorted) {
    if (m.messageType === 'heartbeat') continue; // skip heartbeats
    try {
      await post('/messages', {
        fromAgent: m.fromAgent,
        toAgent: m.toAgent,
        messageType: m.messageType,
        content: m.content,
        priority: m.priority || 5,
        contextId: m.contextId,
      });
      ok++;
    } catch (e) {
      console.warn('Failed to migrate message:', e.message);
    }
  }
  console.log(`Migrated ${ok} messages to AgentBus`);

  console.log('\nFetching presence from Convex...');
  const presence = await convexQuery('agentComms:getAgentPresence', {});
  for (const p of presence) {
    await post('/presence', { agentId: p.agentId, status: p.status, currentTask: p.currentTask });
  }
  console.log(`Migrated ${presence.length} presence records`);

  console.log('\n✅ Migration complete. AgentBus is seeded.');
  const health = await fetch(`${AGENTBUS_URL}/health`).then(r => r.json());
  console.log('AgentBus health:', health);
}

main().catch(console.error);
