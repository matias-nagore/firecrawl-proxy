// Vercel Serverless Function - Proxy para Firecrawl
// Esta función actúa como intermediario para evitar problemas de CORS

export default async function handler(req, res) {
  // Habilitar CORS para que el frontend pueda llamar a esta función
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar preflight request de CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, apiKey } = req.body;

    // Validar inputs
    if (!url || !apiKey) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Both url and apiKey are required'
      });
    }

    // Llamar a Firecrawl API desde el servidor (sin CORS)
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 3000,
        timeout: 30000
      })
    });

    // Si Firecrawl devuelve error
    if (!firecrawlResponse.ok) {
      const errorData = await firecrawlResponse.json().catch(() => ({}));
      return res.status(firecrawlResponse.status).json({ 
        error: errorData.error || `Firecrawl API error: ${firecrawlResponse.status}`,
        details: errorData
      });
    }

    // Devolver datos exitosos
    const data = await firecrawlResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Scrape function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
