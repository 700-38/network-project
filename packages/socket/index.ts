import { Server } from "socket.io";
import { App } from "uWebSockets.js";
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@shared/socket";

const app = App();
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

io.attachApp(app);
 
io.on("connection", (socket) => {
  socket.on("userTyping", (isTyping: boolean) => {
    console.log(isTyping);
  })
});

app.listen(3000, (token) => {
  if (!token) {
    console.warn("port already in use");
  }
});