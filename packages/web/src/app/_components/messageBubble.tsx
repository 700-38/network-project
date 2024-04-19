import React, { FC } from 'react';

import { IMessageProp } from '../../../../../shared/types/message';

interface Props {
  prevMessage?: IMessageProp;
  thisMessage: IMessageProp;
  nextMessage?: IMessageProp;
}

const MessageBubble: FC<Props> = ({ prevMessage, thisMessage, nextMessage }) => {
  if (thisMessage.sender === 'You')
    return (
      <div className="flex flex-col items-center">
        {prevMessage && thisMessage.timestamp - prevMessage.timestamp > 60000 && (
          <div className="mx-auto">{new Date(thisMessage.timestamp).toDateString()}</div>
        )}
        <div className={`flex w-full justify-end`}>
          <div
            className={`${
              (prevMessage && prevMessage.sender === 'You') ||
              !(prevMessage && thisMessage.timestamp - prevMessage.timestamp > 60000)
                ? 'rounded-tr-md'
                : 'rounded-tr-3xl'
            } 
             ${
               (nextMessage && nextMessage.sender === 'You') ||
               !(nextMessage && thisMessage.timestamp - nextMessage.timestamp > 60000)
                 ? 'rounded-br-md'
                 : 'rounded-br-3xl'
             } mb-1 rounded-l-3xl bg-green-400 px-3 py-2`}>
            {thisMessage.content}
          </div>
        </div>
      </div>
    );
  else
    return (
      <div className="flex flex-col items-center">
        {prevMessage && thisMessage.timestamp - prevMessage.timestamp > 60000 && (
          <div className="mx-auto">{new Date(thisMessage.timestamp).toDateString()}</div>
        )}
        <div className={`flex w-full justify-start`}>
          <div
            className={`${
              (prevMessage && prevMessage.sender !== 'You') ||
              !(prevMessage && thisMessage.timestamp - prevMessage.timestamp > 60000)
                ? 'rounded-tl-md'
                : 'rounded-tl-3xl'
            } 
            ${
              (nextMessage && nextMessage.sender !== 'You') ||
              !(nextMessage && thisMessage.timestamp - nextMessage.timestamp > 60000)
                ? 'rounded-bl-md'
                : 'rounded-bl-3xl'
            } 
            mb-1 rounded-r-3xl bg-green-400 px-3 py-2`}>
            {thisMessage.content}
          </div>
        </div>
      </div>
    );
};

export default MessageBubble;
