exports.handler = async (event) => {
  // Solo permitimos peticiones POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    
    // IMPORTANTE: Aquí usamos "examen" que es el nombre que pusiste en Netlify
    const API_KEY = process.env.examen; 

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Error en el servidor", details: error.message }) 
    };
  }
};