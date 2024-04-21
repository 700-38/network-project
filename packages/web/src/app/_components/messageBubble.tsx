'use client';
'use client';

import { RealmContext } from '@/context/realm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { FC, useContext, useState } from 'react';

import { IMessageProp } from '../../../../../shared/types/message';
import { stickers } from './stickerModal';
import UserProfileImage from './userPofileImage';

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

  const Realm = useContext(RealmContext);
  const yourId = Realm.realm?.id || '';
  if (yourId === '') {
    router.push('/login');
  }
  const formatDaysAgo = (daysAgo: number, date: number): string => {
    if (daysAgo <= 0) {
      return 'Invalid input, daysAgo should be a positive integer';
    } else if (daysAgo === 1) {
      return 'Yesterday';
    } else if (daysAgo <= 14) {
      return `${daysAgo} days ago`;
    } else {
      return 'More than 14 days ago';
    }
  };

  const getDayAndShortMonth = (timestampInMilliseconds: number): string => {
    // Ensure the timestamp is in milliseconds, convert if necessary

    // Create a Date object from the timestamp
    const date = new Date(timestampInMilliseconds);

    // Get the day of the month
    const day = date.getDate();

    // Get the abbreviated month (3-letter)
    const month = date.toLocaleString('en', { month: 'short' });

    // Return the formatted string
    return `${day} ${month.toUpperCase()}`;
  };

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
           flex items-center justify-center overflow-hidden text-project_light_gray transition-[height,opacity] duration-300`}>
          {new Date().toLocaleDateString() !== new Date(thisMessage.timestamp).toLocaleDateString()
            ? //   new Date(thisMessage.timestamp).getDate().toString().padStart(2, '0') +
              //   '/' +
              //   new Date(thisMessage.timestamp).getMonth().toString().padStart(2, '0')
              getDayAndShortMonth(thisMessage.timestamp) +
              `${new Date().getFullYear() !== new Date(thisMessage.timestamp).getFullYear() ? new Date(thisMessage.timestamp).getFullYear() : ''} at ` +
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
                thisMessage.timestamp - prevMessage.timestamp <= 1000 * 60 * 2 && // 15 mins
                !(isClicked === thisMessage.id) &&
                prevMessage.type === 'text' &&
                isClicked !== prevMessage.id
                  ? 'rounded-tr-md'
                  : 'rounded-tr-3xl'
              } 
             ${
               nextMessage &&
               nextMessage.sender === yourId &&
               nextMessage.timestamp - thisMessage.timestamp <= 1000 * 60 * 2 && // 15 mins
               !(isClicked === thisMessage.id) &&
               nextMessage.type === 'text' &&
               isClicked !== nextMessage.id
                 ? 'rounded-br-md'
                 : 'rounded-br-3xl'
             } min-w-[30px] max-w-[400px] whitespace-pre-wrap break-words rounded-l-3xl text-project_white ${isClicked === thisMessage.id ? 'bg-project_dark_blue' : 'bg-project_blue'} px-3.5 py-2 text-start`}
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
            : ((nextMessage && nextMessage.sender !== thisMessage.sender) ||
                (nextMessage && nextMessage.timestamp - thisMessage.timestamp > 1000 * 60 * 2)) &&
              'pb-2'
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
          flex items-center justify-center overflow-hidden text-project_light_gray transition-[height,opacity] duration-300`}>
          {new Date().toLocaleDateString() !== new Date(thisMessage.timestamp).toLocaleDateString()
            ? //   new Date(thisMessage.timestamp).getDate().toString().padStart(2, '0') +
              //   '/' +
              //   new Date(thisMessage.timestamp).getMonth().toString().padStart(2, '0')
              getDayAndShortMonth(thisMessage.timestamp) +
              `${new Date().getFullYear() !== new Date(thisMessage.timestamp).getFullYear() ? new Date(thisMessage.timestamp).getFullYear() : ''} at ` +
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
                nextMessage.timestamp - thisMessage.timestamp > 1000 * 60 * 2 ||
                thisMessage.type !== 'text') &&
              'opacity-100'
            } rounded-full bg-gray-400 opacity-0 transition-opacity`}>
            <UserProfileImage name={'A'} size={50} />
            {/* <Image
              src={`https://placehold.co/400x400.png?text=${'A'}`}
              alt={'A'}
              className="rounded-full"
              width={50}
              height={50}></Image> */}
          </div>

          {thisMessage.type === 'text' ? (
            <div
              className={`transition-all duration-300 ${
                prevMessage &&
                prevMessage.sender === thisMessage.sender &&
                thisMessage.timestamp - prevMessage.timestamp <= 1000 * 60 * 2 && // 15 mins
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
            min-w-[30px] ${isClicked === thisMessage.id ? 'bg-project_dark_purple' : 'bg-project_purple'} max-w-[400px] whitespace-pre-wrap break-words rounded-r-3xl px-3.5 py-2 text-start text-project_white`}
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
