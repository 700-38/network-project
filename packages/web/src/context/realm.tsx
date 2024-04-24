'use client';

import {
  type ChatRoomDoc,
  type IMessageProp,
  type MessageDoc,
  type ObjectId,
  ObjectIdUtilities,
  type UserDoc,
} from '@shared/types/message';
import { get } from 'http';
import { createContext, useContext, useState } from 'react';
import type { Dispatch, FC, PropsWithChildren, ReactPortal, SetStateAction } from 'react';
import React from 'react';
import * as Realm from 'realm-web';

const atlasAppId = process.env.NEXT_PUBLIC_ATLAS_APP_ID || 'application-0-ahdtpog';
const apiKey =
  process.env.NEXT_PUBLIC_ATLAS_API_KEY ||
  'ewtZ3PaQTC1eyah0QfmIlGhZt5dwWQzbzPKEVMzJjbGOH6cLBIIjqLoCXQvYdIdH';
interface TRealmContext {
  db: globalThis.Realm.Services.MongoDBDatabase | null;
  realm: Realm.User | null;
  chatRooms: ChatRoomDoc[];
  registerUser: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  getChatList: () => Promise<ChatRoomDoc[]>;
  getNameFromId: (id: string) => Promise<string | null>;
  getMessageList: (chatRoomId: ObjectId) => Promise<IMessageProp[]>;
  createChatRoom: (name: string, members: string[]) => Promise<string | null>;
  joinChatRoom: (chatRoomId: ObjectId | null) => void;
  isRoomPrivate: (roomId: string) => Promise<boolean>;
  isRoomExist: (roomId: string) => Promise<boolean>;
  isUserExist: (username: string) => Promise<boolean>;
  isIdExist: (id: string) => Promise<boolean>;
  storeMessage: (message: IMessageProp) => void;
}

export const RealmContext = createContext<TRealmContext>({
  db: null,
  realm: null,
  chatRooms: [],
  registerUser: () => Promise.resolve(),
  login: () => Promise.resolve(),
  getChatList: () => Promise.resolve([]),
  getNameFromId: () => Promise.resolve(''),
  getMessageList: () => Promise.resolve([]),
  createChatRoom: () => Promise.resolve(''),
  joinChatRoom: () => null,
  isRoomPrivate: () => Promise.resolve(false),
  isRoomExist: () => Promise.resolve(false),
  isUserExist: () => Promise.resolve(true),
  isIdExist: () => Promise.resolve(true),
  storeMessage: () => null,
});
const publicAtlasApp = new Realm.App({ id: atlasAppId }).logIn(Realm.Credentials.apiKey(apiKey));

const RealmProvider: FC<PropsWithChildren> = ({ children }) => {
  // const { children } = props
  const [chatRooms, setChatRooms] = useState<ChatRoomDoc[]>([]);
  const [realm, setRealm] = useState<Realm.User | null>(null);
  const [db, setDB] = useState<globalThis.Realm.Services.MongoDBDatabase | null>(null);
  if (!atlasAppId) {
    throw new Error('Missing PUBLIC_ATLAS_APP_ID');
  }
  const atlasApp = new Realm.App({ id: atlasAppId });

  const isUserExist = async (username: string): Promise<boolean> => {
    const publicUser = await publicAtlasApp;
    const db = await publicUser.mongoClient('mongodb-atlas').db('network-project');
    const users = db.collection<UserDoc>('users');
    const result = await users.findOne({ name: { $regex: `^${username}$`, $options: 'i' } });
    return result !== null;
  };

  const isIdExist = async (id: string): Promise<boolean> => {
    const publicUser = await publicAtlasApp;
    const db = await publicUser.mongoClient('mongodb-atlas').db('network-project');
    const users = db.collection<UserDoc>('users');
    const result = await users.findOne({ uid: id });
    return result !== null;
  };

  const registerUser = async (username: string, password: string) => {
    const alreadyExist = await isUserExist(username);
    if (alreadyExist) throw new Error('Username already exist');
    const usernameParsed = `${username.toLowerCase()}@thegoose.work`;
    await atlasApp.emailPasswordAuth
      .registerUser({ email: usernameParsed, password })
      .catch((err) => {
        console.log(err);
      });
  };

  const login = async (username: string, password: string) => {
    // await atlasApp.emailPasswordAuth.registerUser({ email: username, password }).catch((err) => {
    // });
    const usernameParsed = `${username.toLowerCase()}@thegoose.work`;
    const credentials = Realm.Credentials.emailPassword(usernameParsed, password);
    const user = await atlasApp.logIn(credentials);
    await setRealm(user);
    await setDB(user.mongoClient('mongodb-atlas').db('network-project'));
    console.log(user.accessToken);

    const alreadyExist = await isUserExist(username);
    if (alreadyExist) return;

    const publicUser = await publicAtlasApp;
    const db = await publicUser.mongoClient('mongodb-atlas').db('network-project');
    // const db = await user.mongoClient('mongodb-atlas').db('network-project');

    const users = db.collection<UserDoc>('users');
    // console.log(await users.find());
    await users.findOneAndUpdate(
      { uid: user.id },
      {
        $set: { name: username },
      }
    );

    // getChatList();
  };

  const getChatList = async (): Promise<ChatRoomDoc[]> => {
    if (!realm || !db) {
      throw new Error('Realm or db is not initialized');
    }
    const chats = await db?.collection<ChatRoomDoc>('chat').find({ members: realm.id });
    setChatRooms(chats);
    return chats;
  };

  const getMessageList = async (chatRoomId: ObjectId): Promise<IMessageProp[]> => {
    if (!realm || !db) {
      throw new Error('Realm or db is not initialized');
    }
    // db.collection<ChatRoomDoc>("chat").findOne({_id: chatRoomId}).then((chatRoom) => {})
    return db
      .collection<MessageDoc>('messages')
      .find({ receiver: chatRoomId.toHexString() })
      .then((messages) => {
        return messages;
      });
  };

  const getNameFromId = async (id: string): Promise<string | null> => {
    const publicUser = await publicAtlasApp;
    const db = await publicUser.mongoClient('mongodb-atlas').db('network-project');

    console.log(id);

    return await db
      .collection<UserDoc>('users')
      .findOne({ uid: id })
      .then((user) => {
        return user ? user.name : null;
      });
  };

  const createChatRoom = async (name: string, members: string[]) => {
    if (!realm || !db) {
      return;
    }
    members.push(realm.id);
    const membersSet = new Set(members);
    const chatRoom = {
      name,
      members: Array.from(membersSet),
      lastMessage: null,
    };
    const newChat = await db
      .collection<ChatRoomDoc>('chat')
      .insertOne(chatRoom)
      .then((chatRoom) => {
        console.log(chatRoom);
        return chatRoom;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });

    return newChat ? newChat.insertedId.toString() : null;
  };

  const joinChatRoom = async (chatRoomId: ObjectId | null) => {
    if (!realm || !db) {
      return;
    }

    if (!chatRoomId) {
      return;
    }

    const chatRoom = await db.collection<ChatRoomDoc>('chat').findOne({ _id: chatRoomId });
    if (!chatRoom) {
      return;
    }
    const members = chatRoom.members;

    if (members.length == 2) {
      return;
    }

    members.push(realm.id);
    const membersSet = new Set(members);
    await db
      .collection<ChatRoomDoc>('chat')
      .updateOne({ _id: chatRoomId }, { $set: { members: Array.from(membersSet) } });
  };

  const isRoomPrivate = async (roomId: string): Promise<boolean> => {
    if (!realm || !db) {
      return false;
    }

    const chatRoom = await db
      .collection<ChatRoomDoc>('chat')
      .findOne({ _id: ObjectIdUtilities.createObjectIdFromString(roomId) });
    if (!chatRoom) {
      return false;
    }

    return chatRoom.members.length == 2;
  };

  const isRoomExist = async (roomId: string): Promise<boolean> => {
    if (!realm || !db) {
      return false;
    }

    const chatRoom = await db
      .collection<ChatRoomDoc>('chat')
      .findOne({ _id: ObjectIdUtilities.createObjectIdFromString(roomId) });
    if (!chatRoom) {
      return false;
    }

    return true;
  };

  const storeMessage = async (message: IMessageProp) => {
    if (!realm || !db) {
      return;
    }

    await db.collection<MessageDoc>('messages').insertOne(message);
    await db
      .collection<MessageDoc>('chat')
      .updateOne(
        { _id: ObjectIdUtilities.createObjectIdFromString(message.receiver) },
        { $set: { lastMessage: message } }
      );
  };

  return (
    <RealmContext.Provider
      value={{
        chatRooms,
        login,
        registerUser,
        realm,
        db,
        getChatList,
        getMessageList,
        getNameFromId,
        createChatRoom,
        joinChatRoom,
        isRoomPrivate,
        isRoomExist,
        isUserExist,
        isIdExist,
        storeMessage,
      }}>
      {children}
    </RealmContext.Provider>
  );
};

export default RealmProvider;
