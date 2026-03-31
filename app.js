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
            // Llamamos a la función de Netlify
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                body: JSON.stringify({ prompt: text })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                typingMsg.innerText = data.candidates[0].content.parts[0].text;
            } else {
                typingMsg.innerText = "Draco no recibió respuesta. Revisa tu clave en Netlify.";
            }

        } catch (error) {
            typingMsg.innerText = "Error: El túnel secreto falló.";
            console.error(error);
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