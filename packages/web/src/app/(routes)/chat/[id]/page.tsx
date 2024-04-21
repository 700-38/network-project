'use client';

import InputBox from '@components/inputBox';
import MessageList from '@components/messageList';
import { RealmContext } from '@context/realm';
import { IMessageProp, ObjectIdUtilities } from '@shared/types/message';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const ChatPage: React.FC = () => {
  const Realm = useContext(RealmContext);
  let { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [roomName, setRoomName] = useState<string>('Chat');
  const [roomMembers, setRoomMembers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Array<IMessageProp>>([]);
  const [fisrtAccess, setFirstAccess] = useState(0);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  const currentRoom = ObjectIdUtilities.createObjectIdFromString(id);
  if (currentRoom == null) {
    router.push('/chat');
  }

  useEffect(() => {
    if (Realm.realm?.isLoggedIn && currentRoom != null) {
      setLoading(true);
      console.log('fetching messages');

      Realm.getChatList().then((rooms) => {
        if (
          !rooms
            .find((room) => currentRoom.equals(room._id))
            ?.members.includes(Realm.realm?.id || '')
        ) {
          router.push('/chat');
        }
      });

      Realm.getMessageList(currentRoom)
        .then((messages) => {
          console.log('done fetching messages');
          setMessages(messages);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [Realm.realm?.isLoggedIn]);

  useEffect(() => {
    const initial = async () => {
      setLoading(true);
      if (Realm.realm?.isLoggedIn && currentRoom != null) {
        await Realm.getChatList().then((rooms) => {
          const matchRoom = rooms.find((room) => currentRoom.equals(room._id));
          if (matchRoom != null) {
            if (matchRoom.members.length > 2) {
              setRoomName(matchRoom.name);
            } else {
              const otherId = matchRoom.members.find((member) => member !== Realm.realm?.id) || '';
              Realm.getNameFromId(otherId).then((name) => {
                setRoomName(name || 'Chat');
              });
            }
          }
          setRoomMembers(rooms.find((room) => currentRoom.equals(room._id))?.members || []);
        });
        setLoading(false);
      }
    };

    initial();
  }, [Realm.realm?.isLoggedIn]);

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

      socketRef.current.on('newMessage', (msg) => {
        addMessageToArray(msg);
        // console.log('newMessage', msg);
        // console.log('previousMessage', messages);
        // console.log([...messages, msg]);
        // setMessages(() => [...messages, msg]);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [Realm.realm?.isLoggedIn]);

  const addMessageToArray = (msg: IMessageProp) => {
    console.log('New message', msg);
    if (msg.receiver !== currentRoom?.toHexString()) return;
    setMessages((messages) => [...messages, msg]);
  };

  const handleSendMessage = async (messageText: string, type: string) => {
    const newMessage: IMessageProp = {
      id: (messages.length + 1).toString(),
      content: messageText,
      sender: Realm.realm?.id as string,
      receiver: currentRoom?.toHexString() as string,
      timestamp: new Date().getTime(),
      // - 1000 * 60 * 60 * 24
      type,
    };
    [...messages, newMessage];
    console.log('send message\ncontent:', newMessage);

    await Realm.storeMessage(newMessage);
    // Realm.db?.collection('messages').insertOne(newMessage);

    socketRef.current?.emit('sendMessage', newMessage);
  };

  return (
    <div className="flex flex-1 flex-col pb-2 pt-4">
      <h1 className="mb-4 text-center text-3xl font-bold text-project_white">{roomName}</h1>
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <MessageList
          messages={messages}
          fisrtAccess={fisrtAccess}
          setFirstAccess={setFirstAccess}
          loading={loading}
        />
      </div>
      <div className="justify-self-end px-4">
        <InputBox onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;
