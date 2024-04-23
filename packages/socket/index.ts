import { Server } from 'socket.io';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '@shared/types/socket';
import { verifyRealmToken } from './realm';
import { MongoClient, BSON, ServerApiVersion } from 'mongodb';
import type { IChatRoom } from '@shared/types/message';

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>({
  cors: { origin: '*' },
});
const realmApiKey = 'KA6WGKQIFFoZFgKlyBbpdkw8NLgaA6V7bVvqSCLxMOKCaR5B2bQpAwvXArmtryED';
const mongoURI = 'mongodb+srv://kuranasaki:eZVZ1iRkAzYJskMp@cluster0.dksupcd.mongodb.net/';
// io.attachApp(app);

const mongoClient = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let whoIsTyping = new Map<string, Set<string>>();
let whoIsActive = new Map<string, Array<string>>();

io.on('connection', (socket) => {
  console.log('Connection established', socket.data.uid);

  socket.join(socket.data.uid);
  socket.on('disconnect', () => {
    socket.data.room && socket.leave(socket.data.room);
    whoIsActive.set(
      socket.data.room,
      whoIsActive.get(socket.data.room)?.filter((uid) => uid !== socket.data.uid) || []
    );
    io.to(socket.data.room).emit('newActive', whoIsActive.get(socket.data.room) || []);

    if (whoIsActive.get(socket.data.room)?.length === 0) {
      io.emit('offline', socket.data.room);
    }
  });
  // whoIsActive.
  socket.on('joinChat', (chatId: string) => {
    socket.data.room && socket.leave(socket.data.room);
    socket.data.room = chatId;
    console.log('joining', socket.data.uid, socket.data.room);
    socket.join(chatId);
    const activeUser = Array.from(io.sockets.adapter.rooms.get(chatId) ?? [])
      .map((socketId) => io.sockets.sockets.get(socketId)?.data.uid)
      .filter(Boolean) as string[];
    // activeUser.
    whoIsActive.set(chatId, activeUser);
    io.to(chatId).emit('newActive', activeUser);
    io.emit('online', chatId);
  });
  socket.on('userTyping', (isTyping: boolean) => {
    // const roomData = io.sockets.adapter.rooms.get(socket.data.room)
    if (!whoIsTyping.has(socket.data.room)) {
      whoIsTyping.set(socket.data.room, new Set());
    }
    const who = whoIsTyping.get(socket.data.room);
    if (isTyping) {
      who?.add(socket.data.uid);
    } else {
      who?.delete(socket.data.uid);
    }
    io.to(socket.data.room).emit('otherTyping', Array.from(who || []));
  });

  socket.on('sendMessage', (message) => {
    // const nmsgPaylaod = {
    //   id: '99999999999999',
    //   type: 'text',
    //   content: message,
    //   sender: socket.data.uid,
    //   receiver: socket.data.room,
    //   timestamp: new Date().getTime(),
    // };
    // console.log('recv this msg', nmsgPaylaod);
    // io.to(socket.data.room).emit("newMessage", {
    //   message,
    //   roomId: socket.data.uid,
    //   timestamp: new Date()
    // })
    mongoClient
      .db('network-project')
      .collection<IChatRoom>('chat')
      .findOne({ _id: new BSON.ObjectId(socket.data.room) })
      .then((chat) => {
        console.log('chat', chat);
        if (!chat) return;
        const members = chat.members;
        // const room = socket.
        io.emit('notify', chat.members);
        io.to(socket.data.room).emit('newMessage', message);
        members
          .filter((m) => !whoIsActive.get(socket.data.room)?.includes(m))
          .forEach((member) => {
            io.to(member).emit('newMessage', message);
          });
      });
  });
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers?.token;
  console.log('TOKEN: ', token);
  if (token === 'nigga-admin') return next();
  if (!token) return next(new Error('unauthorized event'));
  const isValid = await verifyRealmToken(token);
  if (isValid) {
    socket.data.uid = isValid.uid;
    socket.data.email = isValid.email;
    return next();
  }
  return next(new Error('unauthorized event'));
});

const start = async () => {
  await mongoClient.connect();
  io.listen(3005);
};
start();
