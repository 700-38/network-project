'use client';
'use client';

import { RealmContext } from '@/context/realm';
import { useRouter } from 'next/navigation';
import React, { FC, useContext, useEffect, useState } from 'react';

import BouncingDotsLoader from './bouncingDotsLoader';
import UserProfileImage from './userPofileImage';

interface Props {
  userTyping: string[];
  roomMembers: string[];
}

const MessageTyping: FC<Props> = ({ userTyping, roomMembers }) => {
  const router = useRouter();

  const [profileName, setProfileName] = useState('');
  const [typingNames, setTypingNames] = useState<{ id: string; name: string }[]>([]);
  const [allNames, setAllNames] = useState<{ id: string; name: string }[]>([]);

  const Realm = useContext(RealmContext);
  const yourId = Realm.realm?.id || '';
  if (yourId === '') {
    router.push('/login');
  }

  useEffect(() => {
    const cb = async () => {
      let tempTyping = [];
      const temp = userTyping.filter((user) => user !== yourId);

      // Use Promise.all to handle all promises from getNameFromId simultaneously
      const names = await Promise.all(
        temp.map(async (user) => {
          try {
            const name = await Realm.getNameFromId(user);
            return { id: user, name: name || 'non' };
          } catch (error) {
            console.error('Error fetching name for user:', user, error);
            return { id: user, name: 'non' }; // Fallback if error occurs
          }
        })
      );

      tempTyping = names; // Update tempTyping with resolved names
      setTypingNames(tempTyping);
      console.log('Updated names:', tempTyping);
      console.log('All names:', allNames);
    };

    cb();
  }, [userTyping, yourId]); // Add yourId if it's reactive

  useEffect(() => {
    const cb = async () => {
      const filteredMembers = roomMembers.filter((user) => user !== yourId);
      const promises = filteredMembers.map(async (user) => {
        try {
          const name = await Realm.getNameFromId(user);
          return { id: user, name: name || 'Non' };
        } catch (error) {
          console.error(`Failed to get name for user ${user}:`, error);
          return { id: user, name: 'Non' }; // Provide a default value in case of an error
        }
      });

      // Await all the promises before setting state
      const resolvedNames = await Promise.all(promises);
      setAllNames(resolvedNames);
    };

    cb();
  }, [roomMembers, yourId]); // Ensure to include all dependencies that affect the effect

  // useEffect(() => {
  //   if (Realm.realm?.isLoggedIn) {
  // Realm.getNameFromId(thisMessage.sender).then((name) => {
  //       setProfileName(name || '404');
  //     });
  //   }
  // }, [Realm.realm?.isLoggedIn]);

  return (
    <>
      {allNames.map((user) => {
        return (
          <div
            key={user.id}
            className={`flex ${userTyping.includes(user.id) ? 'my-1 h-[40px] pb-2' : 'h-0 opacity-0'} flex-col items-center justify-center transition-[height,opacity,padding,margin] duration-300`}>
            <div
              className={`flex w-full items-end justify-start ${userTyping.includes(user.id) ? 'h-[40px]' : 'h-0 opacity-0'} transition-[height,opacity]`}>
              <div
                className={`mr-2 flex h-9 w-9 items-center justify-center ${userTyping.includes(user.id) ? 'h-[36px]' : 'h-0 opacity-0'} rounded-full bg-gray-400 transition-[height,opacity]`}>
                <UserProfileImage name={user.name} size={50} />
              </div>
              <div>
                <div
                  className={`text-project_light_gray ${userTyping.includes(user.id) ? 'h-[40px]' : 'h-0 opacity-0'} transition-[opacity,height]`}>
                  {profileName}
                </div>
                <div
                  className={`flex w-fit min-w-[30px] ${userTyping.includes(user.id) ? 'h-[40px] py-2' : 'h-0 opacity-0'} max-w-[400px] items-center whitespace-pre-wrap break-words rounded-3xl bg-project_purple px-3.5 text-start text-project_white transition-all duration-300`}>
                  <BouncingDotsLoader />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MessageTyping;
