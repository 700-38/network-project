import type { IMessageProp } from './message';
export interface ServerToClientEvents {
  newMessage: (data: IMessageProp) => void;
  otherTyping: (whoIsTyping: string[]) => void;
  newActive: (whoIsActive: string[]) => void;
}

export interface ClientToServerEvents {
  userTyping: (isTyping: boolean) => void;
  sendMessage: (message: IMessageProp) => void;
  joinChat: (chatId: string) => void;
}

// export interface IMessageProp {
//   message: string;
//   roomId: string;
//   timestamp: Date;
// }

export interface InterServerEvents {}

export interface RoomData {
  whoIsTyping: [];
}

export interface SocketData {
  uid: string;
  email: string;
  room: string;
}
