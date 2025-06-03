const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('message');
const qrCodeImage = document.getElementById('qrcode');


function initializeWebSocket() {
    const socket = new WebSocket('wss://qrcode-tool-ws-ure6.onrender.com');

    socket.onopen = () => {
      console.log('Webpage Connected established');
       socket.send(JSON.stringify({ action: "connected" }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message from server:', data);

      if (data.image) {
        // Assuming the image data is Base64-encoded
        loadingElement.style.display = 'none';
        const imgElement = document.getElementById('qrcode');
        imgElement.src = data.image;
      }

      else if(data.action == 'stop')
      {
        loadingElement.style.display = 'block';
      }
    };

    window.addEventListener('beforeunload', () => {
      if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ action: "disconnected" }));
      }
    });

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      loadingElement.style.display = 'block';
      socket.send(JSON.stringify({ action: "disconnected" }));
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  document.addEventListener('DOMContentLoaded', (event) => {
    initializeWebSocket();
  });
