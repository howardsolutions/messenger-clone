'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { FullConversationType } from '@/types';

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const session = useSession();
  const router = useRouter();

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = session.data?.user?.email;

  return (
    <div
      onClick={() => router.push(`/conversations/${data.id}`)}
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
      {/* {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )} */}
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
              {/* {data.name || otherUser.name} */}
            </p>
            {lastMessage?.createdAt && (
              <p
                className='
                  text-xs
                  text-gray-400
                  font-light
                '
              >
                {/* {format(new Date(lastMessage.createdAt), 'p')} */}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate
              text-sm
            `
              //   hasSeen ? 'text-gray-500' : 'text-black font-medium'
            )}
          >
            {/* {lastMessageText} */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
