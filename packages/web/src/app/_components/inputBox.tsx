'use client';

import { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket';
import React, { useEffect, useRef, useState } from 'react';
import { BiSticker } from 'react-icons/bi';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerFill } from 'react-icons/ri';
import { Socket } from 'socket.io-client';

import StickerModal from './stickerModal';

interface Props {
  onSendMessage: (message: string, type: string) => void;
  socketTyping: (bool: boolean) => void;
}

const InputBox: React.FC<Props> = ({ onSendMessage, socketTyping }) => {
  const [input, setInput] = useState('');
  const [isHovering, setIsHovering] = useState(false); // State to track hovering
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim(), 'text');
      setInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSend();
    }
  };

  const handleOpenStickerModal = () => {
    // Function to handle opening the sticker modal
    setIsStickerModalOpen(!isStickerModalOpen);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  const handleSelectSticker = (index: number) => {
    onSendMessage(index.toString(), 'sticker');
    setIsStickerModalOpen(false);
  };

  useEffect(() => {
    if (input.trim().length > 0 && isTyping === false) {
      setIsTyping(true);
      socketTyping(true);
    } else if (input.trim().length === 0 && isTyping === true) {
      setIsTyping(false);
      socketTyping(false);
    }
  }, [input, isTyping]);

  return (
    <div className="flex pt-2">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        onClick={() => setIsStickerModalOpen(false)}
        placeholder="Type a message..."
        className="flex-grow cursor-text rounded-full bg-project_gray px-3 py-2 text-project_white outline-none placeholder:text-project_light_gray focus:outline-none"
      />
      <div className="relative flex flex-row items-center justify-center">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleOpenStickerModal}
          className={`ml-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-project_gray`}>
          <RiEmojiStickerFill
            className={`absolute ${isHovering || isStickerModalOpen ? 'opacity-100' : 'opacity-0'} h-6 w-6 text-blue-500 transition-opacity`}
          />
          <BiSticker
            className={`h-6 w-6 ${isHovering || isStickerModalOpen ? 'opacity-0' : 'opacity-1000'} text-blue-500 transition-opacity`}
          />
        </div>
        <StickerModal onSelectSticker={handleSelectSticker} isVisible={isStickerModalOpen} />
      </div>
      <div
        onClick={handleSend}
        className={`ml-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${input !== '' ? 'cursor-pointer hover:bg-project_gray' : 'cursor-default'}`}>
        <IoSend
          className={`h-6 w-6 transition-colors ${input === '' ? 'text-zinc-300' : 'text-blue-500'} `}
        />
      </div>
    </div>
  );
};

export default InputBox;
