'use client';

import type { ChatRoomDoc, IMessageProp, MessageDoc, ObjectId } from '@shared/types/message';
import { get } from 'http';
import { createContext, useContext, useState } from 'react';
import type { Dispatch, FC, PropsWithChildren, ReactPortal, SetStateAction } from 'react';
import * as Realm from 'realm-web';
import React from 'react'
// import { useState } from 'react';
const apiKey = "ewtZ3PaQTC1eyah0QfmIlGhZt5dwWQzbzPKEVMzJjbGOH6cLBIIjqLoCXQvYdIdH"
interface TRealmContext {
  db: globalThis.Realm.Services.MongoDBDatabase | null;
  realm: Realm.User | null;
  chatRooms: ChatRoomDoc[];
  login: (user: string, password: string) => Promise<void>;
  getChatList: () => Promise<ChatRoomDoc[]>;
  getMessageList: (chatRoomId: ObjectId) => Promise<IMessageProp[]>;
  createChatRoom: (name: string, members: string[]) => void;
  isEmailExist: (email: string) => Promise<boolean>;
}
const atlasAppId = "application-0-ahdtpog"

export const RealmContext = createContext<TRealmContext>({
  db: null,
  realm: null,
  chatRooms: [],
  login: () => Promise.resolve(),
  getChatList: () => Promise.resolve([]),
  getMessageList: () => Promise.resolve([]),
  createChatRoom: () => null,
  isEmailExist: ()=> Promise.resolve(true)
});
const publicAtlasApp = (new Realm.App({ id: atlasAppId })).logIn(Realm.Credentials.apiKey(apiKey))

const RealmProvider: FC<PropsWithChildren> = ({ children }) => {
  // const { children } = props
  const [chatRooms, setChatRooms] = useState<ChatRoomDoc[]>([]);
  const [realm, setRealm] = useState<Realm.User | null>(null);
  const [db, setDB] = useState<globalThis.Realm.Services.MongoDBDatabase | null>(null);
  if (!atlasAppId) {
    throw new Error('Missing PUBLIC_ATLAS_APP_ID');
  }
  const atlasApp = new Realm.App({ id: atlasAppId });

  const isEmailExist = async (email: string): Promise<boolean> => {
    if (!realm || !db) {
      throw new Error('Realm is not initialized');
    }
    const publicUser = await publicAtlasApp
    const {result} = await publicUser.functions.checkUserExist(email)
    return result
  }

  const login = async (username: string, password: string) => {
    await atlasApp.emailPasswordAuth.registerUser({ email: username, password }).catch((err) => {
    });
    const credentials = Realm.Credentials.emailPassword(username, password);
    const user = await atlasApp.logIn(credentials);
    await setRealm(user);
    await setDB(user.mongoClient('mongodb-atlas').db('network-project'));
    console.log(user.accessToken)
    return
    // getChatList();
  };

  const getChatList = async (): Promise<ChatRoomDoc[]> => {
    if (!realm || !db) {
      throw new Error('Realm or db is not initialized');
    }
    const chats = await db
      ?.collection<ChatRoomDoc>('chat')
      .find({ members: realm.id })
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
      value={{ chatRooms, login, realm, db, getChatList, getMessageList, createChatRoom, isEmailExist }}>
      {children}
    </RealmContext.Provider>
  );
};

export default RealmProvider;
