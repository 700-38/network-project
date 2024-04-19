import  *  as Realm from "realm-web";
export type ObjectId = Realm.BSON.ObjectId;
type Document = globalThis.Realm.Services.MongoDB.Document;
export interface IMessageProp {
  id: string;
  type: string;
  content: string;
  timestamp: number;
  sender: string;
  receiver: string;
}

export interface MessageDoc extends Document, IMessageProp {}

export interface IChatRoom {
  // _id: ObjectId;
  name: string;
  members: string[];
  lastMessage: IMessageProp | null;
}

export interface ChatRoomDoc extends Document, IChatRoom {}