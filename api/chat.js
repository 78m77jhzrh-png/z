export default async function handler(req, res) {
  // Aseguramos que Vercel no bloquee la respuesta
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permite el método POST' });
  }

  try {
    const { prompt } = req.body;
    const API_KEY = process.env.examen;

    // Ruta 100% oficial y estable de Google (v1 + gemini-1.5-flash)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Si la nueva llave rechaza la conexión, lo atrapamos aquí
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    // Respuesta exitosa enviada a tu Mini Chat Pro Ultra
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
  }
}
