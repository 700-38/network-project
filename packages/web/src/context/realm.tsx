import { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactPortal, SetStateAction, PropsWithChildren,FC } from 'react';
import * as Realm from 'realm-web';
// import { useState } from 'react';
interface TRealmContext {
  db: globalThis.Realm.Services.MongoDBDatabase | null;
  realm: Realm.User | null
  login: (user: string, password: string) => void;

}
const atlasAppId = process.env.PUBLIC_ATLAS_APP_ID;


const RealmContext = createContext<TRealmContext>({
  db: null,
  realm: null,
  login: () => null,
})


const RealmProvider: FC<PropsWithChildren> = ({children} )=> {
  // const { children } = props
  const [realm, setRealm] = useState<Realm.User | null>(null)
  const [db, setDB] = useState<globalThis.Realm.Services.MongoDBDatabase | null>(null)
  if (!atlasAppId) {
    throw new Error("Missing PUBLIC_ATLAS_APP_ID");
  }
  const atlasApp = new Realm.App({ id: atlasAppId });
  const login = async (username: string, password: string) => {
    const credentials = Realm.Credentials.emailPassword(username, password);
    const user = await atlasApp.logIn(credentials)
    setRealm(user);
    setDB(user.mongoClient("mongodb-atlas").db("chat"));
  }

  const getChatList = async () => {
  }

  return (
    <RealmContext.Provider value={{ login, realm, db}}>
      {children}
    </RealmContext.Provider>
  )
}

export default RealmProvider;