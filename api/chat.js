export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: "Método no permitido" } });
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

    // Si Google nos da un error, lo imprimimos en los logs de Vercel para verlo
    if (data.error) {
      console.error("ERROR REAL DE GOOGLE:", data.error.message);
      return res.status(400).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("ERROR DE SERVIDOR:", error.message);
    return res.status(500).json({ error: { message: "Error en el servidor de Draco" } });
  }
}
