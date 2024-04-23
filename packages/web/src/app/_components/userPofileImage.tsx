import { ChatRoomDoc } from '@shared/types/message';
import { seededHexColor } from '@shared/utils/index';
import Image from 'next/image';
import { FC } from 'react';

interface UserProfileImageProps {
  name: string;
  size: number;
}

const UserProfileImage: FC<UserProfileImageProps> = ({ name, size }) => {
  return (
    <>
      <Image
        src={`https://placehold.co/400x400/${seededHexColor(name)}/FFF.png?text=${name[0]?.toUpperCase() || ''}`}
        alt={name[0] || 'profile image'}
        className="rounded-full"
        width={size}
        height={size}
      />
    </>
  );
};

export default UserProfileImage;
