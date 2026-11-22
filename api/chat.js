export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    return res.status(500).json({ reply: 'Cle GEMINI_API_KEY manquante.' });
  }

  const host = 'generativelanguage.googleapis.com';
  const path = '/v1beta/models/gemini-2.5-flash:generateContent?key=';
  const url = 'https://' + host + path + apiKey;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ reply: 'Erreur Google : ' + (data.error?.message || response.status) });
    }

    const reply = data.candidates?.?.content?.parts?.?.text || 'Aucune reponse.';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ reply: 'Erreur serveur : ' + err.message });
  }
}
