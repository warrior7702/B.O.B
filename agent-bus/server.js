/**
 * AgentBus — Local SQLite message bus for B.O.B., Cornerstone, Dubya
 * Runs on Dubya's Windows PC at 100.90.196.118:4747
 * Requires Node.js 22+ (uses built-in node:sqlite — zero npm deps)
 */

const { DatabaseSync } = require('node:sqlite');
const { createServer } = require('node:http');
const { randomUUID } = require('node:crypto');
const { join } = require('node:path');
const os = require('node:os');

const PORT = 4747;
const DB_PATH = join(__dirname, 'agentbus.db');
const MAX_MESSAGES = 2000;

// ── Database ─────────────────────────────────────────────────────────────────

const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS messages (
    id          TEXT PRIMARY KEY,
    fromAgent   TEXT NOT NULL,
    toAgent     TEXT NOT NULL,
    messageType TEXT NOT NULL DEFAULT 'chat',
    content     TEXT NOT NULL,
    priority    INTEGER DEFAULT 5,
    contextId   TEXT,
    read        INTEGER DEFAULT 0,
    createdAt   INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS presence (
    agentId     TEXT PRIMARY KEY,
    status      TEXT NOT NULL DEFAULT 'online',
    lastSeen    INTEGER NOT NULL,
    currentTask TEXT,
    capabilities TEXT
  );

  CREATE TABLE IF NOT EXISTS learnings (
    id        TEXT PRIMARY KEY,
    agentId   TEXT NOT NULL,
    content   TEXT NOT NULL,
    category  TEXT DEFAULT 'general',
    createdAt INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(createdAt DESC);
  CREATE INDEX IF NOT EXISTS idx_messages_toAgent  ON messages(toAgent);

  CREATE TABLE IF NOT EXISTS tasks (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    status      TEXT NOT NULL DEFAULT 'todo',
    assignee    TEXT DEFAULT 'bob',
    priority    TEXT DEFAULT 'medium',
    category    TEXT,
    tags        TEXT DEFAULT '[]',
    dueDate     INTEGER,
    createdAt   INTEGER NOT NULL,
    updatedAt   INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks(status);
  CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);
`);

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMsg(r) {
  return {
    _id: r.id, _creationTime: r.createdAt,
    fromAgent: r.fromAgent, toAgent: r.toAgent,
    messageType: r.messageType, content: r.content,
    read: r.read === 1, priority: r.priority, contextId: r.contextId,
  };
}

function fmtTask(r) {
  return {
    _id: r.id, _creationTime: r.createdAt,
    title: r.title, description: r.description || '',
    status: r.status, assignee: r.assignee,
    priority: r.priority, category: r.category || '',
    tags: r.tags ? JSON.parse(r.tags) : [],
    dueDate: r.dueDate || null,
    createdAt: r.createdAt, updatedAt: r.updatedAt,
  };
}

function fmtPresence(r) {
  return {
    agentId: r.agentId, status: r.status, lastSeen: r.lastSeen,
    currentTask: r.currentTask,
    capabilities: r.capabilities ? JSON.parse(r.capabilities) : [],
  };
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => raw += c);
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error('Invalid JSON')); }
    });
  });
}

function parseQuery(url) {
  const q = {};
  const idx = url.indexOf('?');
  if (idx === -1) return q;
  url.slice(idx + 1).split('&').forEach(p => {
    const [k, v] = p.split('=');
    if (k) q[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });
  return q;
}

function pruneIfNeeded() {
  const count = db.prepare('SELECT COUNT(*) as c FROM messages').get().c;
  if (count > MAX_MESSAGES) {
    db.exec(`DELETE FROM messages WHERE id NOT IN (SELECT id FROM messages ORDER BY createdAt DESC LIMIT ${MAX_MESSAGES})`);
    console.log(`[prune] Trimmed to ${MAX_MESSAGES} (was ${count})`);
  }
}
setInterval(pruneIfNeeded, 60 * 60 * 1000);

// ── Router ────────────────────────────────────────────────────────────────────

const server = createServer(async (req, res) => {
  const url = req.url || '/';
  const path = url.split('?')[0];
  const method = req.method;
  const q = parseQuery(url);
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${method} ${path}`);

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  try {
    // GET /health
    if (method === 'GET' && path === '/health') {
      const count = db.prepare('SELECT COUNT(*) as c FROM messages').get().c;
      return json(res, 200, { status: 'ok', host: os.hostname(), uptime: Math.floor(process.uptime()), messages: count, db: DB_PATH, ts: Date.now() });
    }

    // GET /messages
    if (method === 'GET' && path === '/messages') {
      const limit = Math.min(parseInt(q.limit) || 100, 500);
      const agent = q.agent;
      const unread = q.unread === 'true';
      let rows;
      if (unread && agent) {
        rows = db.prepare('SELECT * FROM messages WHERE toAgent=? AND read=0 ORDER BY createdAt ASC').all(agent.toLowerCase());
      } else if (agent) {
        rows = db.prepare('SELECT * FROM messages WHERE toAgent=? ORDER BY createdAt DESC LIMIT ?').all(agent.toLowerCase(), limit);
      } else {
        rows = db.prepare('SELECT * FROM messages ORDER BY createdAt DESC LIMIT ?').all(limit);
      }
      return json(res, 200, rows.map(fmtMsg));
    }

    // POST /messages
    if (method === 'POST' && path === '/messages') {
      const body = await parseBody(req);
      const { fromAgent, toAgent, messageType = 'chat', content, priority = 5, contextId } = body;
      if (!fromAgent || !toAgent || !content) return json(res, 400, { error: 'fromAgent, toAgent, content required' });
      const msg = {
        id: randomUUID(),
        fromAgent: fromAgent.toLowerCase(),
        toAgent: toAgent.toLowerCase(),
        messageType,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        priority,
        contextId: contextId || null,
        createdAt: Date.now(),
      };
      db.prepare('INSERT INTO messages (id,fromAgent,toAgent,messageType,content,priority,contextId,read,createdAt) VALUES (?,?,?,?,?,?,?,0,?)').run(msg.id, msg.fromAgent, msg.toAgent, msg.messageType, msg.content, msg.priority, msg.contextId, msg.createdAt);
      return json(res, 201, fmtMsg({ ...msg, read: 0 }));
    }

    // PATCH /messages/read?agent=bob
    if (method === 'PATCH' && path === '/messages/read') {
      if (!q.agent) return json(res, 400, { error: 'agent required' });
      const r = db.prepare('UPDATE messages SET read=1 WHERE toAgent=?').run(q.agent.toLowerCase());
      return json(res, 200, { marked: r.changes });
    }

    // PATCH /messages/:id/read
    if (method === 'PATCH' && path.match(/^\/messages\/[^/]+\/read$/)) {
      const id = path.split('/')[2];
      db.prepare('UPDATE messages SET read=1 WHERE id=?').run(id);
      return json(res, 200, { ok: true });
    }

    // GET /presence
    if (method === 'GET' && path === '/presence') {
      return json(res, 200, db.prepare('SELECT * FROM presence').all().map(fmtPresence));
    }

    // POST /presence
    if (method === 'POST' && path === '/presence') {
      const body = await parseBody(req);
      const { agentId, status = 'online', currentTask, capabilities } = body;
      if (!agentId) return json(res, 400, { error: 'agentId required' });
      const entry = {
        agentId: agentId.toLowerCase(), status,
        lastSeen: Date.now(),
        currentTask: currentTask || null,
        capabilities: capabilities ? JSON.stringify(capabilities) : null,
      };
      db.prepare('INSERT INTO presence (agentId,status,lastSeen,currentTask,capabilities) VALUES (?,?,?,?,?) ON CONFLICT(agentId) DO UPDATE SET status=excluded.status,lastSeen=excluded.lastSeen,currentTask=excluded.currentTask,capabilities=excluded.capabilities').run(entry.agentId, entry.status, entry.lastSeen, entry.currentTask, entry.capabilities);
      return json(res, 200, fmtPresence(entry));
    }

    // GET /learnings
    if (method === 'GET' && path === '/learnings') {
      const limit = parseInt(q.limit) || 50;
      return json(res, 200, db.prepare('SELECT * FROM learnings ORDER BY createdAt DESC LIMIT ?').all(limit));
    }

    // POST /learnings
    if (method === 'POST' && path === '/learnings') {
      const body = await parseBody(req);
      const { agentId, content, category = 'general' } = body;
      if (!agentId || !content) return json(res, 400, { error: 'agentId, content required' });
      const l = { id: randomUUID(), agentId: agentId.toLowerCase(), content, category, createdAt: Date.now() };
      db.prepare('INSERT INTO learnings (id,agentId,content,category,createdAt) VALUES (?,?,?,?,?)').run(l.id, l.agentId, l.content, l.category, l.createdAt);
      return json(res, 201, l);
    }

    // GET /tasks
    if (method === 'GET' && path === '/tasks') {
      const assignee = q.assignee;
      const status = q.status;
      let rows;
      if (assignee && status) {
        rows = db.prepare('SELECT * FROM tasks WHERE assignee=? AND status=? ORDER BY createdAt DESC').all(assignee.toLowerCase(), status);
      } else if (assignee) {
        rows = db.prepare('SELECT * FROM tasks WHERE assignee=? ORDER BY createdAt DESC').all(assignee.toLowerCase());
      } else if (status) {
        rows = db.prepare('SELECT * FROM tasks WHERE status=? ORDER BY createdAt DESC').all(status);
      } else {
        rows = db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC LIMIT 200').all();
      }
      return json(res, 200, rows.map(fmtTask));
    }

    // POST /tasks
    if (method === 'POST' && path === '/tasks') {
      const body = await parseBody(req);
      const { title, description, status = 'todo', assignee = 'bob', priority = 'medium', category, tags = [], dueDate } = body;
      if (!title) return json(res, 400, { error: 'title required' });
      const now = Date.now();
      const t = { id: randomUUID(), title, description: description || null, status, assignee: assignee.toLowerCase(), priority, category: category || null, tags: JSON.stringify(tags), dueDate: dueDate || null, createdAt: now, updatedAt: now };
      db.prepare('INSERT INTO tasks (id,title,description,status,assignee,priority,category,tags,dueDate,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)').run(t.id, t.title, t.description, t.status, t.assignee, t.priority, t.category, t.tags, t.dueDate, t.createdAt, t.updatedAt);
      return json(res, 201, fmtTask(t));
    }

    // PATCH /tasks/:id
    if (method === 'PATCH' && path.match(/^\/tasks\/[^/]+$/)) {
      const id = path.split('/')[2];
      const body = await parseBody(req);
      const existing = db.prepare('SELECT * FROM tasks WHERE id=?').get(id);
      if (!existing) return json(res, 404, { error: 'Task not found' });
      const updated = {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        status: body.status ?? existing.status,
        assignee: body.assignee ? body.assignee.toLowerCase() : existing.assignee,
        priority: body.priority ?? existing.priority,
        category: body.category ?? existing.category,
        tags: body.tags ? JSON.stringify(body.tags) : existing.tags,
        dueDate: body.dueDate ?? existing.dueDate,
        updatedAt: Date.now(),
      };
      db.prepare('UPDATE tasks SET title=?,description=?,status=?,assignee=?,priority=?,category=?,tags=?,dueDate=?,updatedAt=? WHERE id=?').run(updated.title, updated.description, updated.status, updated.assignee, updated.priority, updated.category, updated.tags, updated.dueDate, updated.updatedAt, id);
      return json(res, 200, fmtTask({ ...existing, ...updated, id }));
    }

    // DELETE /tasks/:id
    if (method === 'DELETE' && path.match(/^\/tasks\/[^/]+$/)) {
      const id = path.split('/')[2];
      db.prepare('DELETE FROM tasks WHERE id=?').run(id);
      return json(res, 200, { ok: true });
    }

    json(res, 404, { error: 'Not found' });

  } catch (err) {
    console.error('[error]', err.message);
    json(res, 500, { error: err.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚌 AgentBus running on port ${PORT}`);
  console.log(`   DB    : ${DB_PATH}`);
  console.log(`   Local : http://localhost:${PORT}/health`);
  console.log(`   Remote: http://100.90.196.118:${PORT}/health\n`);
});

process.on('uncaughtException', err => console.error('[uncaughtException]', err.message));
process.on('unhandledRejection', err => console.error('[unhandledRejection]', err));
