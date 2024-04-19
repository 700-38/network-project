'use client';

import React, { useState } from 'react';

import { IMessageProp } from '../../../../../../shared/types/message';
import InputBox from '../../_components/inputBox';
import MessageList from '../../_components/messageList';
import Sidebar from '../../_components/sideBar';

// Ensure the correct path is used

const chatRooms = [
  { id: '1', name: 'General Room' },
  { id: '2', name: 'Tech Talk' },
  { id: '3', name: 'Random' },
];

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<IMessageProp[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>('1');

  const handleSendMessage = (messageText: string) => {
    const newMessage: IMessageProp = {
      id: (messages.length + 1).toString(),
      content: messageText,
      sender: Math.random() > 0.5 ? 'You' : 'Them',
      // sender: 'You',
      receiver: 'ME',
      timestamp: new Date().getTime(),
      // - 1000 * 60 * 60 * 24
      type: 'text',
    };
    setMessages([...messages, newMessage]);
  };

  const handleSelectRoom = (roomId: string) => {
    setCurrentRoom(roomId);
    // You might want to clear messages or load messages specific to the selected room
    setMessages([]);
  };

  return (
    <div className="flex h-screen max-h-screen w-screen flex-row">
      <Sidebar rooms={chatRooms} onSelectRoom={handleSelectRoom} />
      <div className="flex flex-1 flex-col pb-2 pt-4">
        <h1 className="mb-4 text-center text-3xl font-bold">
          Chat Room - {chatRooms.find((room) => room.id === currentRoom)?.name}
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
