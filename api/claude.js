export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { model, max_tokens, messages, tools } = req.body;
    if (!messages) return res.status(400).json({ error: 'Missing messages' });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured on server' });

    const body = {
      model: model || 'claude-sonnet-4-6',
      max_tokens: max_tokens || 4000,
      messages
    };
    if (Array.isArray(tools) && tools.length > 0) {
      body.tools = tools;
    }

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const data = await claudeResponse.json();
    return res.status(claudeResponse.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
