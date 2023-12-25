const socketClient = io();
//    Mensajes 

document.addEventListener('DOMContentLoaded', () => {

 const messageForm = document.getElementById('message-form');


    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('messageInput');
      const email = emailInput.value;
      const message = messageInput.value;

      
      socketClient.emit('addMessage', { email, message });
      messageInput.value = '';
    });

    // Alctualizar
    socketClient.on('actualizarMensajes', (messages) => {

        const chat = document.getElementById('chat');

        //   crear div de mensaje
      chat.innerHTML = '';
      if (messages.length > 0) {
        messages.forEach((message) => {
          const messageDiv = document.createElement('div');
          messageDiv.classList.add('message');
          messageDiv.innerHTML = `
            <p class="user">${message.email} :</p>
            <p class="text">${message.message}</p>
          `;
          chat.appendChild(messageDiv);
        });
      } else {
        chat.innerHTML = '<h1 class="message">No se encontraron Mensajes</h1>';
      }
    });
  });