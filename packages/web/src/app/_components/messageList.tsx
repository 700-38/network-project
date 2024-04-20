'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';

import { IMessageProp } from '../../../../../shared/types/message';
import MessageBubble from './messageBubble';

interface Props {
  messages: IMessageProp[];
  fisrtAccess: number;
  setFirstAccess: (value: number) => void;
}

const MessageList: React.FC<Props> = ({ messages, fisrtAccess, setFirstAccess }) => {
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

  const [clicked, setClicked] = useState('');

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {}, []);

  useEffect(() => {
    console.log('fisrtAccess', fisrtAccess);
    if (fisrtAccess > 1) scrollToBottom();
    else {
      endOfMessagesRef.current?.scrollIntoView();
      setFirstAccess(fisrtAccess + 1);
    }
  }, [messages]); // Dependency on messages means this effect runs every time messages update.

  return (
    <div className="mb-4 flex-1 px-4">
      {messages.length > 0 ? (
        messages.map((message, idx) => {
          let nextMessage: IMessageProp | undefined = undefined;
          let prevMessage: IMessageProp | undefined = undefined;
          if (idx !== messages.length - 1) nextMessage = messages[idx + 1];
          if (idx !== 0) prevMessage = messages[idx - 1];
          return (
            <MessageBubble
              key={message.id}
              prevMessage={prevMessage}
              thisMessage={message}
              nextMessage={nextMessage}
              isClicked={clicked}
              setIsClicked={setClicked}
            />
          );
        })
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <HiChatBubbleLeftRight className="mb-4 h-40 w-40 text-gray-200" />
          <div className="select-none text-gray-400">Type somethings to start the conversation</div>
        </div>
      )}
      <div ref={endOfMessagesRef} /> {/* Invisible div at the end of the list */}
    </div>
  );
};

export default MessageList;
