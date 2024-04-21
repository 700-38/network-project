'use client';

import CreateRoomDialog from '@/app/_components/createRoomDialog';
import { ChatRoomDoc, IMessageProp, ObjectId } from '@shared/types/message';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { RealmContext } from '../../../context/realm';
import InputBox from '../../_components/inputBox';
import MessageList from '../../_components/messageList';
import Sidebar from '../../_components/sideBar';

// Ensure the correct path is used

// const chatRooms: ChatRoomDoc[] = [
// ];

const ChatPage: React.FC = () => {
  // const cha
  const Realm = useContext(RealmContext);
  const [messages, setMessages] = useState<IMessageProp[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ObjectId | null>(null);
  const [fisrtAccess, setFirstAccess] = useState(0);
  const [loading, setLoading] = useState(false);

  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    Realm.isEmailExist('ironpan21@gmail.com').then((res) => {console.log(res)})
    Realm.login('ironpan21@gmail.com', '123456');
  }, []);

  useEffect(() => {
    if (Realm.realm?.isLoggedIn)
      Realm.getChatList().then((rooms) => {
        // Realm.chatRooms = rooms;
        console.log(rooms);
        setCurrentRoom(rooms[0]._id);
      });
  }, [Realm.realm?.isLoggedIn]);

  useEffect(() => {
    if (Realm.realm?.isLoggedIn && currentRoom != null) {
      setLoading(true);
      console.log('fetching messages');
      Realm.getMessageList(currentRoom)
        .then((messages) => {
          // console.log([
          //   ...messages,
          //   {
          //     content: 'hello',
          //     id: '43',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '6622b4616e49de6aci07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          //   {
          //     content: 'hello',
          //     id: '44',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '6622b46aimciwmcc9b07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          //   {
          //     content: 'hello',
          //     id: '45',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '6622basomoacmsc9b07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          //   {
          //     content: 'hello',
          //     id: '46',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '6622basomoacmsc9b07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          //   {
          //     content: 'hello',
          //     id: '47',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '6622basomoacmsc9b07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          //   {
          //     content: 'hello',
          //     id: '48',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '662askmocwmacmsc9b07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          // ]);
          // setMessages([
          //   ...messages,
          //   {
          //     content: 'hello',
          //     id: '43',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '6622b4616e49de6aci07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          //   {
          //     content: 'hello',
          //     id: '44',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '6622b46aimciwmcc9b07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          //   {
          //     content: 'hello',
          //     id: '45',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '6622basomoacmsc9b07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          //   {
          //     content: 'hello',
          //     id: '46',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '6622basomoacmsc9b07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          //   {
          //     content: 'hello',
          //     id: '47',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '6622basomoacmsc9b07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          //   {
          //     content: 'hello',
          //     id: '48',
          //     receiver: '6622d5b9b523e8c7d0773b96',
          //     sender: '662askmocwmacmsc9b07b',
          //     timestamp: 1713600899414,
          //     type: 'text',
          //   },
          // ]);
          setMessages(messages);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentRoom]);

  const handleSendMessage = (messageText: string, type: string) => {
    const newMessage: IMessageProp = {
      id: (messages.length + 1).toString(),
      content: messageText,
      sender: Realm.realm?.id as string,
      receiver: currentRoom?.toHexString() as string,
      timestamp: new Date().getTime(),
      // - 1000 * 60 * 60 * 24
      type,
    };
    setMessages([...messages, newMessage]);
    console.log('send message\ncontent:', newMessage);
    Realm.db?.collection('messages').insertOne(newMessage);
  };

  const handleSelectRoom = (roomId: ObjectId) => {
    if (currentRoom === roomId) return;
    setFirstAccess(0);
    setCurrentRoom(null);
    // You might want to clear messages or load messages specific to the selected room
    console.log('select room and need to fetch chat history');
    setMessages([]);

    Realm.getMessageList(roomId).then((messages) => {
      setMessages(messages);
    });
    setCurrentRoom(roomId);
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
      <div className="flex flex-1 flex-col pb-2 pt-4">
        <h1 className="mb-4 text-center text-3xl font-bold text-project_white">
          {Realm.chatRooms.find((room) => room._id === currentRoom)?.name}
        </h1>
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
    </div>
  );
};

export default ChatPage;
