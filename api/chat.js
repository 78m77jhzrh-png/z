export default async function handler(req, res) {
  // Solo permitir peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { prompt } = req.body;
    const API_KEY = process.env.examen;

    // Usamos el fetch nativo de Vercel (Node 18+)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // Enviamos la respuesta de vuelta al chat
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error en Draco:", error);
    return res.status(500).json({ error: error.message });
  }
}
