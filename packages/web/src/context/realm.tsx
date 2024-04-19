import type { ChatRoomDoc, IMessageProp, MessageDoc, ObjectId } from '@shared/types/message';
import { get } from 'http';
import { createContext, useContext, useState } from 'react';
import type { Dispatch, FC, PropsWithChildren, ReactPortal, SetStateAction } from 'react';
import * as Realm from 'realm-web';

// import { useState } from 'react';
interface TRealmContext {
  db: globalThis.Realm.Services.MongoDBDatabase | null;
  realm: Realm.User | null;
  login: (user: string, password: string) => void;
  getChatList: () => Promise<ChatRoomDoc[]>;
  getMessageList: (chatRoomId: ObjectId) => Promise<IMessageProp[]>;
  createChatRoom: (name: string, members: string[]) => void;
}
const atlasAppId = process.env.PUBLIC_ATLAS_APP_ID;

const RealmContext = createContext<TRealmContext>({
  db: null,
  realm: null,
  login: () => null,
  getChatList: () => Promise.resolve([]),
  getMessageList: () => Promise.resolve([]),
  createChatRoom: () => null,
});

const RealmProvider: FC<PropsWithChildren> = ({ children }) => {
  // const { children } = props
  const [realm, setRealm] = useState<Realm.User | null>(null);
  const [db, setDB] = useState<globalThis.Realm.Services.MongoDBDatabase | null>(null);
  if (!atlasAppId) {
    throw new Error('Missing PUBLIC_ATLAS_APP_ID');
  }
  const atlasApp = new Realm.App({ id: atlasAppId });
  const login = async (username: string, password: string) => {
    const credentials = Realm.Credentials.emailPassword(username, password);
    const user = await atlasApp.logIn(credentials);
    setRealm(user);
    setDB(user.mongoClient('mongodb-atlas').db('network-project'));
    getChatList();
  };

  const getChatList = async (): Promise<ChatRoomDoc[]> => {
    if (!realm || !db) {
      throw new Error('Realm or db is not initialized');
    }
    return db
      ?.collection<ChatRoomDoc>('chat')
      .find({ members: realm.id })
  };

  const getMessageList = async (chatRoomId: ObjectId): Promise<IMessageProp[]> => {
    if (!realm || !db) {
      throw new Error('Realm or db is not initialized');
    }
    // db.collection<ChatRoomDoc>("chat").findOne({_id: chatRoomId}).then((chatRoom) => {})
    return db
      .collection<MessageDoc>('message')
      .find({ receiver: chatRoomId })
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
      value={{ login, realm, db, getChatList, getMessageList, createChatRoom }}>
      {children}
    </RealmContext.Provider>
  );
};

export default RealmProvider;
