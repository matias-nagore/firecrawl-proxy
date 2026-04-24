export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });

    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Firecrawl key not configured' });

    // Limpiar URL de tracking params y hash
    let cleanUrl = url;
    try {
      const parsed = new URL(url);
      parsed.hash = '';
      const keep = ['searchVariation'];
      const newParams = new URLSearchParams();
      keep.forEach(p => { if (parsed.searchParams.get(p)) newParams.set(p, parsed.searchParams.get(p)); });
      parsed.search = newParams.toString();
      cleanUrl = parsed.toString();
    } catch(e) {}

    const body = {
      url: cleanUrl,
      formats: ['markdown'],
      onlyMainContent: true,
      waitFor: 4000,
      timeout: 50000,
      actions: [
        { type: 'wait', milliseconds: 2000 },
        { type: 'scroll', direction: 'down', amount: 2000 },
        { type: 'wait', milliseconds: 1000 },
        { type: 'scroll', direction: 'down', amount: 2000 },
        { type: 'wait', milliseconds: 1000 },
        { type: 'scroll', direction: 'down', amount: 2000 },
      ]
    };

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
