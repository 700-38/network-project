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

// import { useState } from 'react';
const atlasAppId = 'application-0-phbwtop';
const apiKey = 'uqkKPevpKWLdgUxckOFdb1r2oYg5lAXAlLtcpbbiNxl0HVk1WWjO4LAk0m8ce3jC';
interface TRealmContext {
  db: globalThis.Realm.Services.MongoDBDatabase | null;
  realm: Realm.User | null;
  chatRooms: ChatRoomDoc[];
  registerUser: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  getChatList: () => Promise<ChatRoomDoc[]>;
  getNameFromId: (id: string) => Promise<string | null>;
  getMessageList: (chatRoomId: ObjectId) => Promise<IMessageProp[]>;
  createChatRoom: (name: string, members: string[]) => void;
  isUserExist: (username: string) => Promise<boolean>;
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
  createChatRoom: () => null,
  isUserExist: () => Promise.resolve(true),
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
    console.log(await users.find());
    await users.insertOne({
      _id: user.id,
      name: username,
    });

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
      .findOne({ _id: id })
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
    db.collection<ChatRoomDoc>('chat')
      .insertOne(chatRoom)
      .then((chatRoom) => {
        console.log(chatRoom);
      })
      .catch((err) => {
        console.error(err);
      });
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
        isUserExist,
      }}>
      {children}
    </RealmContext.Provider>
  );
};

export default RealmProvider;
