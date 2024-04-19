export interface ServerToClientEvents {
  newMessage: (data: ChatData) => void;
  otherTyping: (whoIsTyping: []) => void;
}

export interface ClientToServerEvents {
  userTyping: (isTyping: boolean) => void;
  sendMessage: (message: string) => void;
}



interface ChatData {
  message: string;
  user: string;
  timestamp: Date;

}

export interface InterServerEvents {
  
}

export interface SocketData {
  uid: string;
  username: string;
}
