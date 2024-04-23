'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Suspense } from 'react'
interface StickerModalProps {
  onSelectSticker: (str: string) => void;
  isVisible: boolean;
}
const iniStickers = [['Cute Axolotl', 'hug.png'],
['Cute Redpanda', 'no.png'],
['Cute Tiger', 'eat.png'],
['Tomomi The Cat', 'cute.png']]; // Example stickers, can be images or other components

const stickers = [
  ['angry.png', 'boring.png', 'confused.png', 'eat.png', 'full.png', 'happy more.png', 'happy.png', 'hi.png', 'hug.png', 'laugh.png', 'love.png', 'mocking.png', 'no.png', 'ok.png', 'read.png', 'sad.png', 'shocked.png', 'sick.png', 'sleep.png', 'tired.png'],
  ['angry.png', 'birthday.png', 'eat.png', 'fever.png', 'full.png', 'happy.png', 'hi.png', 'love.png', 'mocking.png', 'no.png', 'peace.png', 'proud.png', 'relaxed.png', 'run.png', 'sad.png', 'shocked.png', 'sing.png', 'yawn.png', 'yes.png', 'yoga.png'],
  ['angry.png', 'birthday.png', 'eat.png', 'fever.png', 'full.png', 'happy.png', 'hi.png', 'love.png', 'mocking.png', 'no.png', 'peace.png', 'proud.png', 'relaxed.png', 'run.png', 'sad.png', 'shocked.png', 'sing.png', 'yawn.png', 'yes.png', 'yoga.png'],
  ['angel.png', 'angry little.png', 'angry.png', 'cry.png', 'cute.png', 'dead.png', 'expressionless.png', 'kiss.png', 'sad.png', 'screaming.png', 'surprised.png', 'sweat.png', 'tears-of-joy.png', 'thoughtful.png', 'tongue-out.png', 'upset.png', 'wink.png', 'worried.png', 'wow.png']
]; // Example stickers, can be images or other components
const stickerPath = '/sticker'


const StickerModal: React.FC<StickerModalProps> = ({ onSelectSticker, isVisible }) => {
  const [onSelectOpenSticker, setonSelectOpenSticker] = useState(0);


  if (!isVisible) return null;

  return (
    <div className="absolute bottom-0 right-0 mb-12 ml-2 w-[312px] divide-y divide-gray-600  rounded-lg bg-project_gray  shadow-lg pb-2">
      <div>
        {iniStickers.map((sticker, index) => (
          <button className={`hover:bg-zinc-500 p-1 ${index === 0 ? 'rounded-tl-lg' : ''} ${onSelectOpenSticker === index ? 'bg-zinc-500' : ''} `} onClick={() => setonSelectOpenSticker(index)}>
            <Image src={`${stickerPath}/${sticker[0]}/${sticker[1]}`} alt="" width={46} height={46} />
          </button>
        ))}
      </div>
      <Suspense >
        <div className='grid grid-cols-4'>
          {iniStickers.map((stickerName, outerIndex) => (

            (onSelectOpenSticker === outerIndex) && stickers[outerIndex].map((sticker, innerIndex) => (
              <div className="flex justify-center">
                <button onClick={() => onSelectSticker(`${stickerName[0]}/${sticker}`)} className="hover:bg-zinc-500 rounded-lg p-1">

                  <Image src={`${stickerPath}/${stickerName[0]}/${sticker}`} alt="" width={70} height={70} />
                </button>
              </div>

            ))
          ))}
        </div>
      </Suspense>
    </div>
  );
};

export default StickerModal;
