'use client';

import CreateRoomDialog from '@/app/_components/createRoomDialog';
import InputBox from '@components/inputBox';
import MessageList from '@components/messageList';
import Sidebar from '@components/sideBar';
import { RealmContext } from '@context/realm';
import { ChatRoomDoc, IMessageProp, ObjectId, ObjectIdUtilities } from '@shared/types/message';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Socket, io } from 'socket.io-client';

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
  const [rooms, setRooms] = useState<ChatRoomDoc[]>([]);

  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

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

        await Realm.getChatList().then((rooms) => {
          setRooms(rooms);
        });

        console.log('get chat list success');
      }
    };

    initial();
  }, [Realm.realm?.isLoggedIn]);

  useEffect(() => {
    setCurrentRoom(ObjectIdUtilities.createObjectIdFromString(id));
  }, [id]);

  useEffect(() => {
    if (Realm.realm?.isLoggedIn) {
      socketRef.current = io('http://localhost:3005', {
        reconnectionDelayMax: 10000,
        auth: (cb) => {
          const getAccessToken = () => {
            console.log('Socket Token:', Realm.realm?.accessToken);
            return Realm.realm?.accessToken;
          };

          cb({
            token: getAccessToken(),
          });
        },
      });

      socketRef.current?.emit('joinChat', currentRoom?.toString() || '');

      socketRef.current.on('newMessage', async (msg) => {
        await Realm.getChatList().then((rooms) => {
          setRooms(rooms);
        });

        console.log('get chat list success');
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [Realm.realm?.isLoggedIn]);

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
        rooms={rooms}
        onSelectRoom={handleSelectRoom}
        openModal={openModal}
        currentRoomId={currentRoom}
      />
      <>{children}</>
    </div>
  );
}
