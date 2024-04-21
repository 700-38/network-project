import * as Realm from 'realm-web';
export type ObjectId = Realm.BSON.ObjectId;

export class ObjectIdUtilities {
  // Generate a new ObjectId
  static generateNewObjectId(): ObjectId {
    return new Realm.BSON.ObjectId();
  }

  // Check if a given string is a valid ObjectId
  static isValidObjectId(id: string): boolean {
    return Realm.BSON.ObjectId.isValid(id);
  }

  // Create an ObjectId from a string
  static createObjectIdFromString(idString: string): ObjectId | null {
    if (this.isValidObjectId(idString)) {
      return new Realm.BSON.ObjectId(idString);
    }
    return null; // or throw an error depending on how you want to handle this case
  }
}

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
