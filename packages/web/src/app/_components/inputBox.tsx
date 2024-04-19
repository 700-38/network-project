'use client';

import React, { useState } from 'react';
import { BiSticker } from 'react-icons/bi';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerFill } from 'react-icons/ri';

interface Props {
  onSendMessage: (message: string) => void;
}

const InputBox: React.FC<Props> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const [isHovering, setIsHovering] = useState(false); // State to track hovering

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleOpenStickerModal = () => {
    // Function to handle opening the sticker modal
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="flex pt-2">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        className="flex-grow rounded-full border bg-gray-200 p-2 outline-none"
      />
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleOpenStickerModal}
        className={`ml-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100`}>
        <RiEmojiStickerFill
          className={`absolute ${isHovering ? 'opacity-100' : 'opacity-0'} h-6 w-6 text-blue-500 transition-opacity`}
        />
        <BiSticker
          className={`h-6 w-6 ${isHovering ? 'opacity-0' : 'opacity-1000'} text-blue-500 transition-opacity`}
        />
      </div>
      <div
        onClick={handleSend}
        className={`ml-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${input !== '' && 'hover:bg-gray-100'}`}>
        <IoSend
          className={`h-6 w-6 transition-colors ${input === '' ? 'text-zinc-300' : 'text-blue-500'} `}
        />
      </div>
    </div>
  );
};

export default InputBox;
