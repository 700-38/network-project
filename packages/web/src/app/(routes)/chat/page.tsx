'use client';

import React, { useContext, useEffect, useState } from 'react';

import { ChatRoomDoc, IMessageProp, ObjectId } from '@shared/types/message';
import InputBox from '../../_components/inputBox';
import MessageList from '../../_components/messageList';
import Sidebar from '../../_components/sideBar';
import { RealmContext } from '../../../context/realm';

// Ensure the correct path is used

// const chatRooms: ChatRoomDoc[] = [
// ];

const ChatPage: React.FC = () => {
  // const cha
  const Realm = useContext(RealmContext);
  const [messages, setMessages] = useState<IMessageProp[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ObjectId|null>(null);
  useEffect(() => {
    Realm.login('ironpan21@gmail.com','123456')
  },[])

  useEffect(() => {
    if (Realm.realm?.isLoggedIn)
      Realm.getChatList().then((rooms) => {
        // Realm.chatRooms = rooms;
        console.log(rooms)
        setCurrentRoom(rooms[0]._id);
      });
  },[Realm.realm?.isLoggedIn])

  useEffect(() => {
    if (Realm.realm?.isLoggedIn && currentRoom != null){
      console.log("fetching messages")
      Realm.getMessageList(currentRoom).then((messages) => {
        console.log(messages)
        setMessages(messages);
      })}
  }, [currentRoom])

  const handleSendMessage = (messageText: string) => {
    const newMessage: IMessageProp = {
      id: (messages.length + 1).toString(),
      content: messageText,
      sender: Realm.realm?.id as string,
      receiver: currentRoom?.toHexString() as string,
      timestamp: new Date().getTime(),
      type: 'text',
    };
    setMessages([...messages, newMessage]);
    Realm.db?.collection('messages').insertOne(newMessage);
  };

  const handleSelectRoom = (roomId: ObjectId) => {
    setCurrentRoom(null);
    // You might want to clear messages or load messages specific to the selected room
    setMessages([]);

    Realm.getMessageList(roomId).then((messages) => {
      setMessages(messages);
  
    })
    setCurrentRoom(roomId);
  };

  return (
    <div className="flex h-screen max-h-screen w-screen flex-row">
    <Sidebar rooms={Realm.chatRooms} onSelectRoom={handleSelectRoom} />
      <div className="flex flex-1 flex-col pb-2 pt-4">
        <h1 className="mb-4 text-center text-3xl font-bold">
          Chat Room - {Realm.chatRooms.find((room) => room._id === currentRoom)?.name}
        </h1>
        <div className="flex flex-1 flex-col overflow-scroll">
          <MessageList messages={messages} />
        </div>
        <div className="justify-self-end px-4">
          <InputBox onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
