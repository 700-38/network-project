'use client';

import React from 'react';

interface EmojiModalProps {
  onSelectSticker: (index: number) => void;
  isVisible: boolean;
}

export const emojis = ['🌟', '💬', '☠️', '🗿', '☕️']; // Example stickers, can be images or other components

const EmojiModal: React.FC<EmojiModalProps> = ({ onSelectSticker, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-0 right-0 mb-12 ml-2 grid w-[150px] grid-cols-2 gap-2 rounded-lg bg-project_gray p-4 shadow-lg">
      {emojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onSelectSticker(index)}
          className="cursor-pointer rounded-xl p-2 transition-colors hover:bg-project_light_gray">
          <span className="text-3xl">{emoji}</span>
        </button>
      ))}
    </div>
  );
};

export default EmojiModal;
