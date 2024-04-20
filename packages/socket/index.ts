import { Server } from "socket.io";
import { App } from "uWebSockets.js";
import Realm from "realm";
import axios from "axios";
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@shared/types/socket";

const app = App();
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

io.attachApp(app);
 
io.on("connection", (socket) => {
  socket.on("userTyping", (isTyping: boolean) => {
    
  })
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  axios.post("https://services.cloud.mongodb.com/api/admin/v3.0/groups/6329618cfe18f60df52316d9/apps/{appId}/users/verify_token", { token }).then((res) => {
  });
  next();
});
app.listen(3000, (token) => {
  if (!token) {
    console.warn("port already in use");
  }
});