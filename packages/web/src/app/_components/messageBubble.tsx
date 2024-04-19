'use client';
'use client';

import React, { FC, useState } from 'react';

import { IMessageProp } from '../../../../../shared/types/message';

interface Props {
  prevMessage?: IMessageProp;
  thisMessage: IMessageProp;
  nextMessage?: IMessageProp;
  isClicked: boolean;
  setIsClicked: (id: string) => void;
}

const MessageBubble: FC<Props> = ({
  prevMessage,
  thisMessage,
  nextMessage,
  isClicked,
  setIsClicked,
}) => {
  if (thisMessage.sender === 'You')
    return (
      <div
        className={`mb-1 flex flex-col items-center justify-center transition-[padding] duration-300 ${
          isClicked
            ? 'pb-4'
            : nextMessage &&
              nextMessage.sender === 'You' &&
              nextMessage.timestamp - thisMessage.timestamp > 1000 * 60 * 2 &&
              'pb-2'
        }`}>
        <div
          className={`mx-auto ${
            (prevMessage && thisMessage.timestamp - prevMessage.timestamp > 1000 * 60 * 15) ||
            (prevMessage &&
              new Date(prevMessage.timestamp).toLocaleDateString() !==
                new Date(thisMessage.timestamp).toLocaleDateString()) ||
            isClicked ||
            !prevMessage
              ? 'h-12'
              : 'h-0 opacity-0'
          }
           overflow-hidden transition-[height] duration-300`}>
          {new Date().toLocaleDateString() !== new Date(thisMessage.timestamp).toLocaleDateString()
            ? new Date(thisMessage.timestamp).getDate().toString().padStart(2, '0') +
              '/' +
              new Date(thisMessage.timestamp).getMonth().toString().padStart(2, '0') +
              `${new Date().getFullYear() !== new Date(thisMessage.timestamp).getFullYear() ? new Date(thisMessage.timestamp).getFullYear() : ''}` +
              ' ' +
              new Date(thisMessage.timestamp).getHours().toString().padStart(2, '0') +
              ':' +
              new Date(thisMessage.timestamp).getMinutes().toString().padStart(2, '0')
            : new Date(thisMessage.timestamp).getHours().toString().padStart(2, '0') +
              ':' +
              new Date(thisMessage.timestamp).getMinutes().toString().padStart(2, '0')}
        </div>
        <div className={`flex w-full justify-end`}>
          <div
            className={`transition-all duration-300 ${
              prevMessage &&
              prevMessage.sender === 'You' &&
              thisMessage.timestamp - prevMessage.timestamp <= 1000 * 60 * 15 && // 15 mins
              !isClicked
                ? 'rounded-tr-md'
                : 'rounded-tr-3xl'
            } 
             ${
               nextMessage &&
               nextMessage.sender === 'You' &&
               nextMessage.timestamp - thisMessage.timestamp <= 1000 * 60 * 15 && // 15 mins
               !isClicked
                 ? 'rounded-br-md'
                 : 'rounded-br-3xl'
             } min-w-[20px] rounded-l-3xl bg-green-400 px-3 py-2`}
            onClick={() => setIsClicked(isClicked ? '' : thisMessage.id)}>
            {thisMessage.content}
          </div>
        </div>
      </div>
    );
  else
    return (
      <div
        className={`mb-1 flex flex-col items-center justify-center transition-[padding] duration-300 ${
          isClicked
            ? 'pb-4'
            : nextMessage &&
              nextMessage.sender !== 'You' &&
              nextMessage.timestamp - thisMessage.timestamp > 1000 * 60 * 2 &&
              'pb-2'
        }`}>
        <div
          className={`mx-auto ${
            (prevMessage && thisMessage.timestamp - prevMessage.timestamp > 1000 * 60 * 15) ||
            (prevMessage &&
              new Date(prevMessage.timestamp).toLocaleDateString() !==
                new Date(thisMessage.timestamp).toLocaleDateString()) ||
            isClicked ||
            !prevMessage
              ? 'h-12'
              : 'h-0 opacity-0'
          }
           overflow-hidden transition-[height,opacity] duration-300`}>
          {new Date().toLocaleDateString() !== new Date(thisMessage.timestamp).toLocaleDateString()
            ? new Date(thisMessage.timestamp).getDate().toString().padStart(2, '0') +
              '/' +
              new Date(thisMessage.timestamp).getMonth().toString().padStart(2, '0') +
              `${new Date().getFullYear() !== new Date(thisMessage.timestamp).getFullYear() ? new Date(thisMessage.timestamp).getFullYear() : ''}` +
              ' ' +
              new Date(thisMessage.timestamp).getHours().toString().padStart(2, '0') +
              ':' +
              new Date(thisMessage.timestamp).getMinutes().toString().padStart(2, '0')
            : new Date(thisMessage.timestamp).getHours().toString().padStart(2, '0') +
              ':' +
              new Date(thisMessage.timestamp).getMinutes().toString().padStart(2, '0')}
        </div>
        <div className={`flex w-full justify-start`}>
          <div
            className={`transition-all duration-300 ${
              prevMessage &&
              prevMessage.sender !== 'You' &&
              thisMessage.timestamp - prevMessage.timestamp <= 1000 * 60 * 15 && // 15 mins
              !isClicked
                ? 'rounded-tl-md'
                : 'rounded-tl-3xl'
            } 
            ${
              nextMessage &&
              nextMessage.sender !== 'You' &&
              nextMessage.timestamp - thisMessage.timestamp <= 1000 * 60 * 15 && // 15 mins
              !isClicked
                ? 'rounded-bl-md'
                : 'rounded-bl-3xl'
            } 
            min-w-[20px] rounded-r-3xl bg-green-400 px-3 py-2`}
            onClick={() => setIsClicked(isClicked ? '' : thisMessage.id)}>
            {thisMessage.content}
          </div>
        </div>
      </div>
    );
};

export default MessageBubble;
