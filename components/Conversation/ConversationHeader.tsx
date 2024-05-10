'use client';

import { Conversation, User } from '@prisma/client';

import { useState } from 'react';
import Link from 'next/link';
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2';
import { useOtherUser } from '@/hooks';
import AvatarGroup from '../AvatarGroup';
import Avatar from '../Avatar';
import ProfileDrawer from '../ProfileDrawer';
import { getStatusText } from '@/utils';
import useActiveList from '@/hooks/useActiveList';

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const ConversationHeader: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.includes(otherUser?.email!);

  const statusText = getStatusText(conversation, isActive);

  return (
    <>
      <ProfileDrawer
        conversation={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className='
          bg-white
          w-full
          flex
          border-b-[1px]
          sm:px-4
          py-3
          px-4
          lg:px-6
          justify-between
          items-center
          shadow-sm
        '
      >
        <div className='flex gap-3 items-center'>
          <Link
            className='
              lg:hidden
              block
              text-sky-500
              hover:text-sky-600
              transition
              cursor-pointer
            '
            href='/conversations'
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className='flex flex-col'>
            <div>{conversation.name || otherUser.name}</div>
            <div
              className='
                text-sm
                font-light
                text-neutral-500
              '
            >
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className='
            text-sky-500
            cursor-pointer
            hover:text-sky-600
            transition
          '
        />
      </div>
    </>
  );
};

export default ConversationHeader;
