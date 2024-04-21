export interface ServerToClientEvents {
  newMessage: (data: ChatData) => void;
  otherTyping: (whoIsTyping: string[]) => void;
  newActive: (whoIsActive: string[]) => void;
}

export interface ClientToServerEvents {
  userTyping: (isTyping: boolean) => void;
  sendMessage: (message: string) => void;
  joinChat: (chatId: string) => void;
}



interface ChatData {
  message: string;
  user: string;
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
