'use client';

import { ChatRoomDoc, IMessageProp, ObjectId } from '@shared/types/message';
import Image from 'next/image';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

import UserProfileImage from './userPofileImage';

interface ChatRoom {
  id: ObjectId;
  name: string;
}

interface Props {
  rooms: ChatRoomDoc[];
  currentRoomId: ObjectId | null;
  onSelectRoom: (roomId: ObjectId) => void;
  lastMessage?: IMessageProp;
  openModal: () => void;
}

const Sidebar: React.FC<Props> = ({ rooms, currentRoomId, onSelectRoom, openModal }) => {
  return (
    <div className="w-64 border-r-2 border-solid border-project_gray bg-project_black p-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold text-project_white">Chats</h2>
        <div
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-project_gray"
          onClick={openModal}>
          <FaPlus className="text-project_white" />
        </div>
      </div>

      <div className="mt-2">
        {rooms.map((room) => (
          <div
            key={room._id.toHexString()}
            onClick={() => onSelectRoom(room._id)}
            className={`flex cursor-pointer flex-row items-center rounded-xl px-4 py-2 text-project_white transition-colors ${currentRoomId && currentRoomId.equals(room._id) ? 'bg-project_gray' : ''} hover:bg-project_gray`}>
            <div>
              <UserProfileImage name={room.name} size={50} />
            </div>
            <div className="flex flex-col justify-start px-4">
              <div className="cursor-pointer">{room.name}</div>
              <div className="text-project_light_gray">You: สวัสดีครับ</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
