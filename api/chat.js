export default async function handler(req, res) {
  // 1. Forzar que la respuesta sea JSON siempre
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: "Método no permitido" } });
  }

  try {
    const { prompt } = req.body;
    const API_KEY = process.env.examen;

    // 2. Llamada a Google con el modelo 1.5 Flash estable
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // 3. ESTRUCTURA CRÍTICA: Si Google falla, devolvemos el error tal cual lo espera app.js
    if (data.error) {
      return res.status(response.status).json(data);
    }

    // 4. Si todo está bien, enviamos la respuesta exitosa
    return res.status(200).json(data);

  } catch (error) {
    // 5. Si el servidor falla, creamos el objeto error.message para evitar el "undefined"
    console.error("Error en el servidor:", error);
    return res.status(500).json({ 
      error: { 
        message: "Error de servidor en Vercel: " + error.message 
      } 
    });
  }
}
