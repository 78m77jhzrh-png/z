document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatFlow = document.getElementById('chat-flow');

    // Ajustar altura del input automáticamente
    input.addEventListener('input', () => {
        sendBtn.disabled = !input.value.trim();
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    });

    const addMessage = (text, type) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${type}`;
        msgDiv.innerText = text;
        chatFlow.appendChild(msgDiv);
        chatFlow.scrollTop = chatFlow.scrollHeight;
        return msgDiv;
    };

    const sendMessage = async () => {
        const text = input.value.trim();
        if (!text) return;

        // Quitar mensaje de bienvenida si existe
        document.getElementById('welcome')?.remove();

        addMessage(text, 'user');
        input.value = '';
        input.style.height = 'auto';
        sendBtn.disabled = true;

        const typingMsg = addMessage("Draco está pensando...", 'bot');

        try {
            // Llamada al túnel de Vercel
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });

            const data = await response.json();
            
            // 1. Si Google responde con éxito
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                typingMsg.innerText = data.candidates[0].content.parts[0].text;
            } 
            // 2. Si hay un error (usamos el sistema "anti-undefined")
            else {
                const errorTexto = data.error?.message || data.error || data.detalle || "Respuesta vacía de Draco";
                typingMsg.innerText = "Nota de Draco: " + errorTexto;
                console.error("Detalle del error:", data);
            }

        } catch (error) {
            typingMsg.innerText = "Error: El túnel hacia Vercel falló.";
            console.error("Error de conexión:", error);
        } finally {
            // Reactivamos el botón pase lo que pase
            sendBtn.disabled = false;
        }
    };

    sendBtn.onclick = sendMessage;

    // Enviar con Enter
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
