'use client';

import { RealmContext } from '@context/realm';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';

const ChatLandingPage = () => {
  const Realm = useContext(RealmContext);
  const router = useRouter();

  useEffect(() => {
    if (Realm.realm?.isLoggedIn)
      Realm.getChatList().then((rooms) => {
        if (rooms.length > 0) {
          router.push(`/chat/${rooms[0]._id}`);
        }
      });
  }, [Realm.realm?.isLoggedIn]);

  return <></>;
};

export default ChatLandingPage;
