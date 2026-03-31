export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  // PRUEBA DE CONEXIÓN: Draco responderá esto automáticamente
  const respuestaDePrueba = {
    candidates: [{
      content: {
        parts: [{ text: "¡Hola! Soy Draco y estoy funcionando en Vercel sin Google por ahora. Si lees esto, el código está perfecto y el problema es tu API KEY de Google." }]
      }
    }]
  };

  return res.status(200).json(respuestaDePrueba);
}
