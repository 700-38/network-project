'use client';

import { ChatRoomDoc, ObjectId } from '@shared/types/message';
import Image from 'next/image';
import React from 'react';

interface ChatRoom {
  id: ObjectId;
  name: string;
}

interface Props {
  rooms: ChatRoomDoc[];
  onSelectRoom: (roomId: ObjectId) => void;
}

const Sidebar: React.FC<Props> = ({ rooms, onSelectRoom }) => {
  return (
    <div className="bg-project_black border-project_gray w-64 border-r-2 border-solid p-4">
      <h2 className="text-project_white text-lg font-semibold">Chats</h2>
      <div className="mt-2">
        {rooms.map((room) => (
          <div
            key={room._id.toHexString()}
            onClick={() => onSelectRoom(room._id)}
            className="flex cursor-pointer flex-row items-center px-4 py-2 hover:bg-gray-300">
            <div>
              <Image
                src={`https://placehold.co/400x400.png?text=${room.name[0]}`}
                alt={room.name[0]}
                className="rounded-full"
                width={50}
                height={50}></Image>
            </div>
            <div className="flex flex-col justify-start px-4">
              <div className="text-project_white cursor-pointer">{room.name}</div>
              <div className="text-project_light_gray">You: สวัสดีครับ</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
