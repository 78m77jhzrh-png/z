export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: "Método no permitido" } });
  }

  try {
    const { prompt } = req.body;
    const API_KEY = process.env.examen?.trim();

    // USAMOS EL MODELO QUE DICE TU DOCUMENTACIÓN: gemini-3-flash-preview
const response = await fetch('[https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=$](https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=$){API_KEY}', {      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // Si hay error, lo pasamos para que Draco nos lo diga
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: { message: "Error en el servidor de Draco: " + error.message } });
  }
}
