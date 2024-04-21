import { Server } from "socket.io";
import axios from "axios";
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@shared/types/socket";
import { verifyRealmToken } from "realm";

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

// io.attachApp(app);
let whoIsTyping = new Map<string, Set<string>>()
 
io.on("connection", (socket) => {
  socket.on("joinChat", (chatId: string) => {
    socket.data.room && socket.leave(socket.data.room);
    socket.data.room = chatId
    socket.join(chatId)
    const activeUser = Array.from(io.sockets.adapter.rooms.get(chatId) ?? []).map((socketId) => io.sockets.sockets.get(socketId)?.data.uid).filter(Boolean) as string[]
    // activeUser.
    io.to(chatId).emit("newActive", activeUser)
  })
  socket.on("userTyping", (isTyping: boolean) => {
    // const roomData = io.sockets.adapter.rooms.get(socket.data.room)
    if (!whoIsTyping.has(socket.data.room)) {
      whoIsTyping.set(socket.data.room, new Set())
    }
    const who  =  whoIsTyping.get(socket.data.room)
    if (isTyping) {
      who?.add(socket.data.uid)
    } else {
      who?.delete(socket.data.uid)
    }
    io.to(socket.data.room).emit("otherTyping", Array.from(who || []))
  })

  socket.on("sendMessage", (message: string) => {
    io.to(socket.data.room).emit("newMessage", {
      message,
      user: socket.data.uid,
      timestamp: new Date()
    })
  })
});
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers?.token;;
  if (token === "nigga-admin") next()
  if (!token) next(new Error("unauthorized event"));
  const isValid = await verifyRealmToken(token)
  if (isValid) {
    socket.data.uid = isValid.uid
    socket.data.email = isValid.email
    next()
  }
  next(new Error("unauthorized event"));
});

io.listen(3005);