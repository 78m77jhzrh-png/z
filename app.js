document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatFlow = document.getElementById('chat-flow');

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

        document.getElementById('welcome')?.remove();
        addMessage(text, 'user');
        input.value = '';
        input.style.height = 'auto';
        sendBtn.disabled = true;

        const typingMsg = addMessage("Draco está pensando...", 'bot');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                typingMsg.innerText = data.candidates[0].content.parts[0].text;
            } else {
                // Si llegamos aquí, mostramos el error real que viene de Google
                const errorMsg = data.error?.message || "Error desconocido en la API";
                typingMsg.innerText = "Draco dice: " + errorMsg;
            }

        } catch (error) {
            typingMsg.innerText = "Error: El túnel hacia Vercel falló.";
            console.error(error);
        } finally {
            sendBtn.disabled = false;
        }
    };

    sendBtn.onclick = sendMessage;
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
