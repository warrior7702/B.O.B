/**
 * Gmail OAuth Token Generator — one-time run
 * Gets a refresh token for Dubya to access Gmail
 * Run: node gmail-auth.js
 */

const http = require('node:http');
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Load from .secrets
const secretsPath = path.join(process.env.HOME, '.openclaw', '.secrets');
const secrets = fs.readFileSync(secretsPath, 'utf8');
const get = (key) => {
  const match = secrets.match(new RegExp(`^${key}=(.+)$`, 'm'));
  if (!match) throw new Error(`Missing ${key} in .secrets`);
  return match[1].trim();
};

const CLIENT_ID = get('GMAIL_CLIENT_ID');
const CLIENT_SECRET = get('GMAIL_CLIENT_SECRET');
const REDIRECT_URI = 'http://localhost:8080/callback';
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
].join(' ');

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${encodeURIComponent(CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log('\n🦦 Gmail OAuth Token Generator\n');
console.log('Starting local server on port 8080...');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:8080');
  
  if (url.pathname !== '/callback') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>Error: ${error}</h1><p>You can close this tab.</p>`);
    server.close();
    console.error('❌ Auth error:', error);
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400);
    res.end('No code received');
    return;
  }

  // Exchange code for tokens
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();

    if (tokens.error) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<h1>Token error: ${tokens.error}</h1><p>${tokens.error_description}</p>`);
      console.error('❌ Token error:', tokens);
      server.close();
      return;
    }

    // Success
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1 style="color:green">✅ Authorization successful!</h1>
      <p>Dubya now has Gmail access. You can close this tab.</p>
    `);

    console.log('\n✅ Tokens received!\n');
    console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('\nAdd this to Dubya\'s .secrets file:');
    console.log('─'.repeat(60));
    console.log(`GMAIL_CLIENT_ID=${CLIENT_ID}`);
    console.log(`GMAIL_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('─'.repeat(60));

    // Also save to local .secrets
    const secretsContent = fs.readFileSync(secretsPath, 'utf8');
    if (!secretsContent.includes('GMAIL_REFRESH_TOKEN')) {
      fs.appendFileSync(secretsPath, `\nGMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`);
      console.log('\n✅ Refresh token saved to ~/.openclaw/.secrets');
    }

    server.close();
    setTimeout(() => process.exit(0), 500);

  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    res.writeHead(500);
    res.end('Internal error: ' + err.message);
    server.close();
  }
});

server.listen(8080, () => {
  console.log('✅ Server ready. Opening browser...\n');
  console.log('If browser does not open, paste this URL manually:\n');
  console.log(authUrl + '\n');
  
  // Open browser
  try {
    execSync(`open "${authUrl}"`);
  } catch {
    console.log('Could not auto-open browser — paste the URL above manually.');
  }
});
