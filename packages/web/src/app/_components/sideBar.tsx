'use client';

import { ChatRoomDoc, ObjectId } from '@shared/types/message';
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
    <div className="w-64 bg-gray-200 p-4">
      <h2 className="text-lg font-semibold">Chat Rooms</h2>
      <ul className="mt-2">
        {rooms.map((room) => (
          <li
            key={room._id.toHexString()}
            className="cursor-pointer px-4 py-2 hover:bg-gray-300"
            onClick={() => onSelectRoom(room._id)}>
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
