'use client';

import React from 'react';

interface StickerModalProps {
  onSelectSticker: (index: number) => void;
  isVisible: boolean;
}

const stickers = ['🌟', '💬', '🎉', '👍']; // Example stickers, can be images or other components

const StickerModal: React.FC<StickerModalProps> = ({ onSelectSticker, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-project_gray absolute bottom-0 right-0 mb-12 ml-2 grid w-[150px] grid-cols-2 rounded-lg p-4 shadow-lg">
      {stickers.map((sticker, index) => (
        <button
          key={index}
          onClick={() => onSelectSticker(index)}
          className="hover:bg-project_light_gray rounded-xl p-2">
          <span className="text-3xl">{sticker}</span>
        </button>
      ))}
    </div>
  );
};

export default StickerModal;
