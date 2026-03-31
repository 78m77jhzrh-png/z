export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { prompt } = req.body;
    const API_KEY = process.env.examen;

    // USAMOS EL MODELO CON EL NOMBRE "LATEST" Y LA VERSIÓN V1BETA QUE ES MÁS FLEXIBLE
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // Si la respuesta de Google tiene éxito
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return res.status(200).json(data);
    } else {
        // Si hay un error específico de Google, lo devolvemos para leerlo
        return res.status(400).json(data);
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
