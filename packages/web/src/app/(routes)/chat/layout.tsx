'use client';

import CreateRoomDialog from '@/app/_components/createRoomDialog';
import InputBox from '@components/inputBox';
import MessageList from '@components/messageList';
import Sidebar from '@components/sideBar';
import { RealmContext } from '@context/realm';
import { ChatRoomDoc, IMessageProp, ObjectId, ObjectIdUtilities } from '@shared/types/message';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const Realm = useContext(RealmContext);
  let { id } = useParams<{ id: string }>();
  const router = useRouter();

  const modalRef = useRef<HTMLDialogElement | null>(null);

  const [currentRoom, setCurrentRoom] = useState<ObjectId | null>(null);

  useEffect(() => {
    const login = async () => {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');

      if (!username || !password) {
        console.log('no username or password');
        router.push('/login');
        return;
      }

      await Realm.login(username, password);
    };

    login();
  }, []);

  useEffect(() => {
    const initial = async () => {
      if (Realm.realm?.isLoggedIn) {
        console.log('login success', Realm.realm?.id);
        toast.info(`Welcome ${await Realm.getNameFromId(Realm.realm?.id || '')}`);

        await Realm.getChatList();
        console.log('get chat list success');
      }
    };

    initial();
  }, [Realm.realm?.isLoggedIn]);

  useEffect(() => {
    setCurrentRoom(ObjectIdUtilities.createObjectIdFromString(id));
  }, [id]);

  const handleSelectRoom = (roomId: ObjectId) => {
    if (currentRoom === roomId) return;
    console.log(`Navigation to /chat/${roomId.toString()}`);
    router.push(`/chat/${roomId.toString()}`);
  };

  const openModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <div className="flex h-screen max-h-screen w-screen flex-row bg-project_black">
      <CreateRoomDialog modalRef={modalRef} />

      <Sidebar
        rooms={Realm.chatRooms}
        onSelectRoom={handleSelectRoom}
        openModal={openModal}
        currentRoomId={currentRoom}
      />
      <>{children}</>
    </div>
  );
}
