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
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
      }),
    });
    const data = await r.json();

    if (data.error) return res.status(500).json({ error: data.error.message });

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    let parsed = {};
    try {
      const clean = raw.replace(/```json\s*/g,'').replace(/```\s*/g,'').trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    } catch(e) {}

    function str(v) {
      if (typeof v === 'string') return v;
      if (Array.isArray(v)) return v.map(i => String(i));
      if (v && typeof v === 'object') return JSON.stringify(v);
      return String(v || '');
    }

    const result = {
      headline:        str(parsed.headline),
      energyMsg:       str(parsed.energyMsg),
      keywords:        Array.isArray(parsed.keywords) ? parsed.keywords.map(k => String(k)) : [],
      wardrobeColors:  str(parsed.wardrobeColors),
      wardrobeItems:   Array.isArray(parsed.wardrobeItems) ? parsed.wardrobeItems.map(i => String(i)) : [],
      wardrobeTip:     str(parsed.wardrobeTip),
      avoidColor:      str(parsed.avoidColor),
      avoidReason:     str(parsed.avoidReason),
      keyItem:         str(parsed.keyItem),
      keyItemReason:   str(parsed.keyItemReason),
      situationTip:    str(parsed.situationTip),
      shoppingKeyword: str(parsed.shoppingKeyword),
    };

    return res.status(200).json({ content: [{ text: JSON.stringify(result) }] });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
