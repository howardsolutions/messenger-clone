'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { FullConversationType } from '@/types';
import { useOtherUser } from '@/hooks';
import { Message } from '@prisma/client';
import AvatarGroup from '../AvatarGroup';
import Avatar from '../Avatar';
import { format } from 'date-fns';
import { useMemo } from 'react';

interface ConversationBoxProps {
  conversation: FullConversationType;
  selected?: boolean;
}

function getLastMessageText(lastMessage: Message) {
  if (lastMessage?.image) {
    return 'Sent an Image';
  }

  if (lastMessage?.body) {
    return lastMessage.body;
  }

  return 'Started a Conversation';
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  conversation,
  selected,
}) => {
  const session = useSession();
  const router = useRouter();

  const otherUser = useOtherUser(conversation);

  const userEmail = session.data?.user?.email;

  const lastMessage =
    (conversation.messages &&
      conversation.messages[conversation.messages.length - 1]) ||
    [];

  const lastMessageText = getLastMessageText(lastMessage);

  const currentUserHasSeenLastMessage = useMemo(() => {
    const seenArr = lastMessage.seen || [];

    if (!userEmail) return false;

    return seenArr.findIndex((user) => user.email === userEmail) > -1;
  }, [userEmail, lastMessage.seen]);

  return (
    <div
      onClick={() => router.push(`/conversations/${conversation.id}`)}
      className={clsx(
        `
        w-full,
        relative
        flex
        items-center
        space-x-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        p-3
      `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {conversation.isGroup ? (
        <AvatarGroup users={conversation.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <div
            className='
              flex
              justify-between
              items-center
              mb-1
            '
          >
            <p
              className='
                text-md
                font-medium
                text-gray-900
              '
            >
              {conversation.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className='
                  text-xs
                  text-gray-400
                  font-light
                '
              >
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate
              text-sm
            `,
              currentUserHasSeenLastMessage
                ? 'text-gray-500'
                : 'text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
