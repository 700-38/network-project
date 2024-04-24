import { ChatRoomDoc } from '@shared/types/message';
import { seededHexColor } from '@shared/utils/index';
import Image from 'next/image';
import { FC } from 'react';
import { HiUserGroup } from 'react-icons/hi2';

interface UserProfileImageProps {
  name: string;
  size: number;
  group?: boolean;
}

const UserProfileImage: FC<UserProfileImageProps> = ({ name, size, group = false }) => {
  return (
    <>
      {group ? (
        <>
          <div
            style={{
              width: `${size - 10}px`,
              height: `${size - 10}px`,
              backgroundColor: `#${seededHexColor(name)}`,
            }}
            className="flex items-center justify-center rounded-full">
            <HiUserGroup size={size - 25} />
          </div>
        </>
      ) : (
        <Image
          src={`https://placehold.co/400x400/${seededHexColor(name)}/FFF.png?text=${name[0]?.toUpperCase() || ''}`}
          alt={name[0] || 'profile image'}
          className="rounded-full"
          width={size}
          height={size}
        />
      )}
    </>
  );
};

export default UserProfileImage;
