
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { prompt } = req.body;
    const API_KEY = process.env.examen;

    // USAMOS EL MODELO GEMINI-PRO (EL MÁS COMPATIBLE)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // Si Google responde con éxito
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return res.status(200).json(data);
    } else {
        // Si hay error, lo devolvemos para ver qué dice ahora
        return res.status(400).json(data);
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
