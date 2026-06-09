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

  // 모델 순서: 2.5-flash 실패 시 2.0-flash-lite 시도
  const MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash-lite',
  ];

  async function callGemini(model) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
      }),
    });
    return await r.json();
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  let lastError = '';

  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const data = await callGemini(model);

        if (data.error) {
          const msg = data.error.message || '';
          // 과부하 에러면 재시도
          if (msg.includes('high demand') || msg.includes('overloaded') || msg.includes('503')) {
            lastError = msg;
            await wait(2000 * attempt);
            continue;
          }
          // 모델 없음 에러면 다음 모델로
          if (msg.includes('not found') || msg.includes('not supported')) {
            lastError = msg;
            break;
          }
          return res.status(500).json({ error: msg });
        }

       const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

// 응답 비어있으면 에러 반환
if (!raw) {
  const reason = data.candidates?.[0]?.finishReason || 'NO_CONTENT';
  return res.status(500).json({ error: '응답 없음: ' + reason + ' / ' + JSON.stringify(data).slice(0, 200) });
}

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

      } catch(e) {
        lastError = e.message;
        await wait(1000 * attempt);
      }
    }
  }

  return res.status(500).json({ error: '잠시 후 다시 시도해주세요. (' + lastError + ')' });
}
