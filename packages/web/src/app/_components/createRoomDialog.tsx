import { RealmContext } from '@/context/realm';
import { ObjectIdUtilities } from '@shared/types/message';
import { useRouter } from 'next/navigation';
import { FC, useContext, useState } from 'react';

import NameChipsInput from './nameChipsInput';

interface CreateRoomDialogProps {
  modalRef: React.MutableRefObject<HTMLDialogElement | null>;
}

const CreateRoomDialog: FC<CreateRoomDialogProps> = ({ modalRef }) => {
  const Realm = useContext(RealmContext);
  const router = useRouter();

  const [names, setNames] = useState<string[]>([]); // State to hold the list of names
  const [currentName, setCurrentName] = useState<string>(''); // State to hold the current input

  const [groupName, setGroupName] = useState<string>('');
  const [groupId, setGroupId] = useState<string>('');

  const createChat = async () => {
    setNames([]);
    setCurrentName('');
    setGroupName('');
    setGroupId('');

    if (names.length == 1) {
      const newChatId = await Realm.createChatRoom(
        (await Realm.getNameFromId(names[0])) || 'Chat',
        names
      );
      // console.log(newChat);
      router.push(`/chat/${newChatId}`);
      modalRef.current?.close();
    } else {
      const newChatId = await Realm.createChatRoom(groupName, names);
      // console.log(newChat);
      router.push(`/chat/${newChatId}`);
      modalRef.current?.close();
    }
  };

  const joinChat = async () => {
    setNames([]);
    setCurrentName('');
    setGroupName('');
    setGroupId('');

    if (!(await Realm.isRoomPrivate(groupId)) && (await Realm.isRoomExist(groupId))) {
      await Realm.joinChatRoom(ObjectIdUtilities.createObjectIdFromString(groupId));
      router.push(`/chat/${groupId}`);
      modalRef.current?.close();
      return;
    }
  };

  return (
    <>
      <dialog
        className="modal items-center p-4 backdrop:bg-project_black backdrop:opacity-80 backdrop:blur-md"
        ref={modalRef}>
        <div className="modal-box flex w-full flex-col rounded-xl border-[1px] border-project_white bg-project_black">
          <form method="dialog" className="w-4">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
          </form>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-project_white">Create new chat</h3>

            <div className="flex flex-col gap-2">
              {names.length > 1 && (
                <>
                  <div className="text-project_white">Enter the group chat name:</div>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter the group chat name"
                    className="flex-grow cursor-text rounded-xl bg-project_gray px-3 py-2 text-project_white outline-none placeholder:text-project_light_gray focus:outline-none"
                  />
                </>
              )}

              <div className="text-project_white">
                Enter the ids of the people you want to chat with:
              </div>
              <NameChipsInput
                names={names}
                setNames={setNames}
                currentName={currentName}
                setCurrentName={setCurrentName}
              />

              {(names.length == 1 || (names.length > 1 && groupName)) && (
                <div className="flex w-full items-center justify-center">
                  <div
                    className="rounded-full bg-project_dark_blue px-16 py-2 text-project_white"
                    onClick={createChat}>
                    {names.length == 1 && 'Create Private Chat'}
                    {names.length > 1 && 'Create Chat Group'}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="divider">OR</div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-project_white">Join Group Chat</h3>
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="Enter the group chat ID"
              className="flex-grow cursor-text rounded-xl bg-project_gray px-3 py-2 text-project_white outline-none placeholder:text-project_light_gray focus:outline-none"
            />
            {groupId && (
              <div className="flex w-full items-center justify-center">
                <div
                  className="rounded-full bg-project_dark_blue px-16 py-2 text-project_white"
                  onClick={joinChat}>
                  Join Chat Group
                </div>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CreateRoomDialog;
