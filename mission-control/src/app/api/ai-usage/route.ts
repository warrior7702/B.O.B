import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'No API key configured' }, { status: 500 });

  try {
    // Ping Anthropic with a minimal request just to read rate limit headers
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      }),
      cache: 'no-store',
    });

    const h = res.headers;
    return NextResponse.json({
      provider: 'Anthropic',
      model: 'claude-sonnet-4-6',
      rateLimit: {
        requestsLimit:       parseInt(h.get('anthropic-ratelimit-requests-limit') ?? '0'),
        requestsRemaining:   parseInt(h.get('anthropic-ratelimit-requests-remaining') ?? '0'),
        requestsReset:       h.get('anthropic-ratelimit-requests-reset'),
        inputTokensLimit:    parseInt(h.get('anthropic-ratelimit-input-tokens-limit') ?? '0'),
        inputTokensRemaining:parseInt(h.get('anthropic-ratelimit-input-tokens-remaining') ?? '0'),
        outputTokensLimit:   parseInt(h.get('anthropic-ratelimit-output-tokens-limit') ?? '0'),
        outputTokensRemaining:parseInt(h.get('anthropic-ratelimit-output-tokens-remaining') ?? '0'),
        tokensLimit:         parseInt(h.get('anthropic-ratelimit-tokens-limit') ?? '0'),
        tokensRemaining:     parseInt(h.get('anthropic-ratelimit-tokens-remaining') ?? '0'),
      },
      organizationId: h.get('anthropic-organization-id'),
      consoleUrl: 'https://console.anthropic.com/settings/billing',
      checkedAt: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ error: 'Anthropic API unreachable' }, { status: 503 });
  }
}
