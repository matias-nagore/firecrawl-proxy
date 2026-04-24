export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { url, mode } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });

    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Firecrawl key not configured' });

    const isML = url.includes('mercadolibre.com') || url.includes('mercadolibre.com.ar');

    // Limpiar URL
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

    // Acciones para MercadoLibre: abrir reviews y scrollear mucho
    const mlActions = [
      { type: 'wait', milliseconds: 4000 },
      { type: 'scroll', direction: 'down', amount: 2000 },
      { type: 'wait', milliseconds: 2000 },
      // Intentar hacer click en "Mostrar todas las opiniones"
      { type: 'click', selector: '[class*="review"] button, [data-testid*="review"] button, button[class*="opinion"], .ui-review-capability__action, [class*="show-more-reviews"]' },
      { type: 'wait', milliseconds: 3000 },
      // Scrollear dentro del modal de reviews
      { type: 'scroll', direction: 'down', amount: 1500 },
      { type: 'wait', milliseconds: 1500 },
      { type: 'scroll', direction: 'down', amount: 1500 },
      { type: 'wait', milliseconds: 1500 },
      { type: 'scroll', direction: 'down', amount: 1500 },
      { type: 'wait', milliseconds: 1500 },
      { type: 'scroll', direction: 'down', amount: 1500 },
      { type: 'wait', milliseconds: 1500 },
      { type: 'scroll', direction: 'down', amount: 1500 },
      { type: 'wait', milliseconds: 1500 },
      { type: 'scroll', direction: 'down', amount: 1500 },
      { type: 'wait', milliseconds: 1500 },
      { type: 'scroll', direction: 'down', amount: 1500 },
      { type: 'wait', milliseconds: 1500 },
      { type: 'scroll', direction: 'down', amount: 1500 },
      { type: 'wait', milliseconds: 1000 },
    ];

    const standardActions = [
      { type: 'wait', milliseconds: 3000 },
      { type: 'scroll', direction: 'down', amount: 2000 },
      { type: 'wait', milliseconds: 1500 },
      { type: 'scroll', direction: 'down', amount: 2000 },
      { type: 'wait', milliseconds: 1500 },
      { type: 'scroll', direction: 'down', amount: 2000 },
    ];

    const body = {
      url: cleanUrl,
      formats: ['markdown'],
      onlyMainContent: false,
      waitFor: isML ? 10000 : 5000,
      timeout: 55000,
      actions: isML ? mlActions : standardActions
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
