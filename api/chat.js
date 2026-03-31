export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Solo se permite el método POST' } });
  }

  try {
    const { prompt } = req.body;
    const API_KEY = process.env.examen;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Enviamos la respuesta CRUDA. Si hay éxito, app.js lee los "candidates".
    // Si hay error, app.js leerá "data.error.message" correctamente.
    return res.status(response.status).json(data);

  } catch (err) {
    // Simulamos la estructura de Google para que tu app.js no se rompa
    return res.status(500).json({ error: { message: err.message } });
  }
}
