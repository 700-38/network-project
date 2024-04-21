export interface ServerToClientEvents {
  newMessage: (data: NewMessageData) => void;
  otherTyping: (whoIsTyping: string[]) => void;
  newActive: (whoIsActive: string[]) => void;
}

export interface ClientToServerEvents {
  userTyping: (isTyping: boolean) => void;
  sendMessage: (message: string) => void;
  joinChat: (chatId: string) => void;
}



interface NewMessageData {
  message: string;
  roomId: string;
  timestamp: Date;

}

export interface InterServerEvents {
  
}

export interface RoomData {
  whoIsTyping: []
}

export interface SocketData {
  uid: string;
  email: string;
  room: string;
}
