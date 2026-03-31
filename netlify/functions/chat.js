const fetch = require('node-fetch'); // Añade esta línea al principio si no la tienes

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const API_KEY = process.env.examen; 

    // Cambiamos v1beta por v1 (más estable)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Si Google nos da un error, lo veremos aquí
    if (data.error) {
       console.error("Error de Google:", data.error);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" }, // Añadimos esta cabecera
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Error en la función:", error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Error en el servidor", details: error.message }) 
    };
  }
};
