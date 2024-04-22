'use client';

import { RealmContext } from '@/context/realm';
import { ChatRoomDoc, IMessageProp, ObjectId } from '@shared/types/message';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
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
  activeRooms: string[];
}

interface ChatRoomDocWithRealName extends ChatRoomDoc {
  realName: string;
}

const Sidebar: React.FC<Props> = ({
  rooms,
  currentRoomId,
  onSelectRoom,
  openModal,
  activeRooms,
}) => {
  const Realm = useContext(RealmContext);

  const [roomsWithName, setRoomsWithName] = useState<ChatRoomDocWithRealName[]>([]);

  const getRoomName = async (room: ChatRoomDoc) => {
    if (room.members.length > 2) {
      return room.name;
    } else {
      const otherId = room.members.find((member) => member !== Realm.realm?.id) || '';
      return (await Realm.getNameFromId(otherId)) || 'Chat';
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const formatRooms = await Promise.all(
        rooms.map(async (room) => {
          return {
            ...room,
            realName: await getRoomName(room),
          };
        })
      );

      console.log(formatRooms);

      setRoomsWithName(formatRooms);
    };

    fetchRooms();
  }, [rooms]);

  useEffect(() => {
    console.log('Active Room', activeRooms);
  }, [activeRooms]);

  return (
    <div className="flex w-72 flex-col border-r-2 border-solid border-project_gray bg-project_black p-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold text-project_white">Chats</h2>
        <div
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-project_gray"
          onClick={openModal}>
          <FaPlus className="text-project_white" />
        </div>
      </div>

      <div className="mt-2">
        {roomsWithName.map((room) => (
          <div
            key={room._id.toHexString()}
            onClick={() => onSelectRoom(room._id)}
            className={`flex cursor-pointer flex-row items-center rounded-xl px-4 py-2 text-project_white transition-colors ${currentRoomId && currentRoomId.equals(room._id) ? 'bg-project_gray' : ''} hover:bg-project_gray`}>
            <div>
              <UserProfileImage name={room.realName} size={50} />
            </div>
            <div className="flex flex-col justify-start px-4">
              <div className="flex flex-row justify-between">
                <div className="cursor-pointer">{room.realName}</div>

                {activeRooms.includes(room._id.toString()) ? (
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                ) : (
                  <div className="h-2 w-2 rounded-full bg-project_light_gray"></div>
                )}
              </div>

              <div className="text-project_light_gray">
                {Realm.realm?.id == room.lastMessage?.sender && 'You:'}{' '}
                {room.lastMessage?.type == 'text'
                  ? room.lastMessage?.content
                  : Realm.realm?.id == room.lastMessage?.sender
                    ? 'Sent Emoji'
                    : 'Recieve Emoji'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-1"></div>
      <div className="text-project_light_gray">{Realm.realm ? Realm.realm?.id : ''}</div>
    </div>
  );
};

export default Sidebar;
