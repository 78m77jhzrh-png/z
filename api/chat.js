export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: "Método no permitido" } });
  }

  try {
    const { prompt } = req.body;
    // El .trim() elimina cualquier espacio accidental al principio o final de la clave
    const API_KEY = process.env.examen?.trim();

    // Probamos con la URL más estándar de 2026 y el modelo gemini-1.5-flash
    // Si v1 falla, Google suele preferir que uses v1beta para modelos "Flash"
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: { message: "Fallo en el servidor de Draco: " + error.message } });
  }
}
