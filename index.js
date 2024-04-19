import { Server } from 'socket.io';
import { WebsocketPair } from 'bun';
Bun.serve({
  fetch(req) {
    // Check if it's a WebSocket upgrade request
    if (req.headers.get('upgrade') === 'websocket') {
      const pair = new WebsocketPair();

      // Handle incoming WebSocket connections
      pair[1].accept();
      handleSocketConnection(pair[1]);

      return new Response(null, { status: 101, webSocket: pair[0] });
    } else {
      // Handle regular HTTP requests (optional - for serving HTML)
      return new Response('Your Bun + Socket.IO Server!');
    }
  },

  websocket: {
    message(socket, message) {
      console.log(`Received: ${message}`);
      socket.send(`You said: ${message}`);
      // console.log("message", message)
      // io.attachApp(socket);
    
  }},
  port: 3000 // Or any desired port
});

function handleSocketConnection(socket) {
  const io = new Server(socket.server); // Create the Socket.IO server

  io.on('connection', (client) => {
    console.log('Client connected:', client.id);

    client.on('message', (data) => {
      console.log('Received message:', data);
      io.emit('message', data); // Broadcast to all clients
    });

    client.on('disconnect', () => {
      console.log('Client disconnected:', client.id);
    });
  });
}
