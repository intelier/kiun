export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
      }),
    });
    const data = await r.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // Gemini 응답을 Anthropic 형식으로 변환 (프론트엔드 코드 유지)
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return res.status(200).json({
      content: [{ text: text }]
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
