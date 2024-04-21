import { Server } from "socket.io";
import axios from "axios";
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@shared/types/socket";
import { verifyRealmToken } from "./realm";
import  { MongoClient, BSON, ServerApiVersion } from "mongodb";
import type { IChatRoom } from "@shared/types/message";

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();
const realmApiKey = "KA6WGKQIFFoZFgKlyBbpdkw8NLgaA6V7bVvqSCLxMOKCaR5B2bQpAwvXArmtryED"
const mongoURI = "mongodb+srv://kuranasaki:eZVZ1iRkAzYJskMp@cluster0.dksupcd.mongodb.net/"
// io.attachApp(app);

const mongoClient = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
let whoIsTyping = new Map<string, Set<string>>()
let whoIsActive = new Map<string, Array<string>>()
 
io.on("connection", (socket) => {
  socket.join(socket.data.uid)
  socket.on("disconnect", () => {
    socket.data.room && socket.leave(socket.data.room);
    whoIsActive.set(socket.data.room, whoIsActive.get(socket.data.room)?.filter((uid) => uid !== socket.data.uid) || [])
    io.to(socket.data.room).emit("newActive", whoIsActive.get(socket.data.room) || [])
  })
  // whoIsActive.
  socket.on("joinChat", (chatId: string) => {
    socket.data.room && socket.leave(socket.data.room);
    socket.data.room = chatId
    socket.join(chatId)
    const activeUser = Array.from(io.sockets.adapter.rooms.get(chatId) ?? []).map((socketId) => io.sockets.sockets.get(socketId)?.data.uid).filter(Boolean) as string[]
    // activeUser.
    whoIsActive.set(chatId, activeUser)
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
    const nmsgPaylaod = {
      message,
      roomId: socket.data.room,
      timestamp: new Date(),
    }
    // io.to(socket.data.room).emit("newMessage", {
    //   message,
    //   roomId: socket.data.uid,
    //   timestamp: new Date()
    // })
    mongoClient.db("network-project").collection<IChatRoom>("chat").findOne({ _id: new BSON.ObjectId(socket.data.room)}).then((chat) => {
      if (!chat) return
      const members = chat.members
      // const room = socket.
      io.to(socket.data.room).emit("newMessage", nmsgPaylaod)
      members.filter(m => !(whoIsActive.get(socket.data.room)?.includes(m))).forEach((member) => {
        io.to(member).emit("newMessage", nmsgPaylaod)
      })
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

const start = async () => {
  await mongoClient.connect()
  io.listen(3005);
}
start()
