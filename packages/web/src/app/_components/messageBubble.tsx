'use client';
'use client';

import { RealmContext } from '@/context/realm';
import { useRouter } from 'next/navigation';
import React, { FC, useContext, useState } from 'react';

import { IMessageProp } from '../../../../../shared/types/message';

interface Props {
  prevMessage?: IMessageProp;
  thisMessage: IMessageProp;
  nextMessage?: IMessageProp;
  isClicked: string;
  setIsClicked: (id: string) => void;
}

const MessageBubble: FC<Props> = ({
  prevMessage,
  thisMessage,
  nextMessage,
  isClicked,
  setIsClicked,
}) => {
  const router = useRouter();

  const stickers = ['🌟', '💬', '🎉', '👍'];
  const Realm = useContext(RealmContext);
  const yourId = Realm.realm?.id || '';
  if (yourId === '') {
    router.push('/login');
  }

  if (thisMessage.sender === yourId)
    return (
      <div
        className={`mb-1 flex flex-col items-center justify-center transition-[padding] duration-300 ${
          isClicked === thisMessage.id
            ? 'pb-4'
            : nextMessage &&
              nextMessage.sender === yourId &&
              nextMessage.timestamp - thisMessage.timestamp > 1000 * 60 * 2 &&
              'pb-2'
        }`}>
        {/* Date time */}
        <div
          className={`mx-auto ${
            (prevMessage && thisMessage.timestamp - prevMessage.timestamp > 1000 * 60 * 15) ||
            (prevMessage &&
              new Date(prevMessage.timestamp).toLocaleDateString() !==
                new Date(thisMessage.timestamp).toLocaleDateString()) ||
            isClicked === thisMessage.id ||
            !prevMessage
              ? 'h-10'
              : 'h-0 opacity-0'
          }
           text-project_light_gray flex items-center justify-center overflow-hidden transition-[height,opacity] duration-300`}>
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

        {/* Message */}
        <div className={`flex w-full justify-end`}>
          {thisMessage.type === 'text' ? (
            <div
              className={`transition-all duration-300 ${
                prevMessage &&
                prevMessage.sender === yourId &&
                thisMessage.timestamp - prevMessage.timestamp <= 1000 * 60 * 15 && // 15 mins
                !(isClicked === thisMessage.id) &&
                prevMessage.type === 'text' &&
                isClicked !== prevMessage.id
                  ? 'rounded-tr-md'
                  : 'rounded-tr-3xl'
              } 
             ${
               nextMessage &&
               nextMessage.sender === yourId &&
               nextMessage.timestamp - thisMessage.timestamp <= 1000 * 60 * 15 && // 15 mins
               !(isClicked === thisMessage.id) &&
               nextMessage.type === 'text' &&
               isClicked !== nextMessage.id
                 ? 'rounded-br-md'
                 : 'rounded-br-3xl'
             } text-project_white min-w-[40px] max-w-[400px] whitespace-pre-wrap break-words rounded-l-3xl ${isClicked === thisMessage.id ? 'bg-project_dark_blue' : 'bg-project_blue'} px-3 py-2 text-center`}
              onClick={() => {
                setIsClicked(isClicked === thisMessage.id ? '' : thisMessage.id);
                console.log(thisMessage, prevMessage, nextMessage);
              }}>
              {thisMessage.content}
            </div>
          ) : (
            <div className={`flex w-full justify-end text-6xl`}>
              <div
                className="my-2"
                onClick={() => {
                  setIsClicked(isClicked === thisMessage.id ? '' : thisMessage.id);
                  console.log(thisMessage, prevMessage, nextMessage);
                }}>
                {stickers[parseInt(thisMessage.content)]}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  else
    return (
      <div
        className={`mb-1 flex flex-col items-center justify-center transition-[padding] duration-300 ${
          isClicked === thisMessage.id
            ? 'pb-4'
            : (nextMessage &&
                nextMessage.sender !== thisMessage.sender &&
                nextMessage.timestamp - thisMessage.timestamp > 1000 * 60 * 2) ||
              (nextMessage && nextMessage.sender !== thisMessage.sender && 'pb-2')
        }`}>
        <div
          className={`mx-auto ${
            (prevMessage && thisMessage.timestamp - prevMessage.timestamp > 1000 * 60 * 15) ||
            (prevMessage &&
              new Date(prevMessage.timestamp).toLocaleDateString() !==
                new Date(thisMessage.timestamp).toLocaleDateString()) ||
            isClicked === thisMessage.id ||
            !prevMessage
              ? 'h-10'
              : 'h-0 opacity-0'
          }
          text-project_light_gray flex items-center justify-center overflow-hidden transition-[height,opacity] duration-300`}>
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
        <div className={`flex w-full items-end justify-start`}>
          <div
            className={`mr-2 flex h-9 w-9 items-center justify-center ${
              (!nextMessage ||
                nextMessage.sender !== thisMessage.sender ||
                isClicked === thisMessage.id ||
                nextMessage.timestamp - thisMessage.timestamp > 1000 * 60 * 15 ||
                thisMessage.type !== 'text') &&
              'opacity-100'
            } rounded-full bg-gray-400 opacity-0 transition-opacity`}>
            <p className="font-bold text-white">J</p>
          </div>

          {thisMessage.type === 'text' ? (
            <div
              className={`transition-all duration-300 ${
                prevMessage &&
                prevMessage.sender === thisMessage.sender &&
                thisMessage.timestamp - prevMessage.timestamp <= 1000 * 60 * 15 && // 15 mins
                isClicked !== thisMessage.id &&
                prevMessage.type === 'text' &&
                isClicked !== prevMessage.id
                  ? 'rounded-tl-md'
                  : 'rounded-tl-3xl'
              } 
            ${
              nextMessage &&
              nextMessage.sender === thisMessage.sender &&
              nextMessage.timestamp - thisMessage.timestamp <= 1000 * 60 * 15 && // 15 mins
              isClicked !== thisMessage.id &&
              nextMessage.type === 'text' &&
              isClicked !== nextMessage.id
                ? 'rounded-bl-md'
                : 'rounded-bl-3xl'
            } 
            min-w-[40px] max-w-[400px] whitespace-pre-wrap break-words rounded-r-3xl bg-green-400 px-3 py-2 text-center`}
              onClick={() => {
                setIsClicked(isClicked === thisMessage.id ? '' : thisMessage.id);
                console.log(thisMessage, prevMessage, nextMessage);
                // console.log(
                //   prevMessage && 'prevMessage\n',
                //   prevMessage &&
                //     prevMessage.sender !== thisMessage.sender &&
                //     'prevMessage.sender !== thisMessage.sender\n',
                //   prevMessage &&
                //     thisMessage.timestamp - prevMessage.timestamp <= 1000 * 60 * 15 &&
                //     'thisMessage.timestamp - prevMessage.timestamp <= 1000 * 60 * 15 \n', // 15 mins
                //   isClicked !== thisMessage.id && 'isClicked !== thisMessage.id\n',
                //   prevMessage && prevMessage.type === 'text' && 'prevMessage.type === "text"\n',
                //   prevMessage && isClicked !== prevMessage.id && 'isClicked !== prevMessage.id\n'
                // );
                console.log(prevMessage && prevMessage.sender !== thisMessage.sender);
              }}>
              {thisMessage.content}
              {prevMessage &&
                prevMessage.sender !== thisMessage.sender &&
                thisMessage.timestamp - prevMessage.timestamp <= 1000 * 60 * 15 && // 15 mins
                isClicked !== thisMessage.id &&
                prevMessage.type === 'text' &&
                isClicked !== prevMessage.id &&
                'top not round'}
            </div>
          ) : (
            <div className={`flex w-full justify-start text-6xl`}>
              <div
                className="my-2"
                onClick={() => {
                  setIsClicked(isClicked === thisMessage.id ? '' : thisMessage.id);
                  console.log(thisMessage, prevMessage, nextMessage);
                }}>
                {stickers[parseInt(thisMessage.content)]}
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default MessageBubble;
