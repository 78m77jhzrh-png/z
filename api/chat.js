export default async function (req, res) {
  // 1. Configurar cabeceras para evitar bloqueos
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permite POST' });
  }

  try {
    const { prompt } = req.body;
    const API_KEY = process.env.examen;

    // 2. Llamada ultra-directa a Google Gemini 1.5 Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // 3. Enviamos la respuesta tal cual llega de Google
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Fallo en el servidor de Draco', detalle: err.message });
  }
}
