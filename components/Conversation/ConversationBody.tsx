'use client';

import { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { FullMessageType } from '@/types';
import { useConversation } from '@/hooks';
import MessageBox from './MessageBox';
import { pusherClient } from '@/libs/pusher';
import { find } from 'lodash';

interface ConversationBodyProps {
  initialMessages: FullMessageType[];
}

const ConversationBody: React.FC<ConversationBodyProps> = ({
  initialMessages,
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  // mark last message in the current open conversation status to SEEN
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    // subscribe to the pusher channel
    pusherClient.subscribe(conversationId);

    // if receive new message in realtime, scroll to the bottom of the  current conversation
    bottomRef.current?.scrollIntoView();

    // listen to the event and get the data
    pusherClient.bind('message:new', newMessageHandler);

    // listen to message update status to seen
    pusherClient.bind('message:update', updateMessageHandler);

    function newMessageHandler(newMessage: FullMessageType) {
      // mark the new message (lastMessage) as seen
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((currentListOfMessage) => {
        if (find(currentListOfMessage, { id: newMessage.id })) {
          return currentListOfMessage;
        }

        return [...currentListOfMessage, newMessage];
      });

      bottomRef.current?.scrollIntoView();
    }

    function updateMessageHandler(updatedMessage: FullMessageType) {
      setMessages((currentListOfMessage) =>
        currentListOfMessage.map((currentMessage) => {
          if (currentMessage.id === updatedMessage.id) {
            return updatedMessage;
          }

          return currentMessage;
        })
      );
    }

    // unsubscribe when component unmount, otherwise it will create overflow
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('message:new', newMessageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className='flex-1 overflow-y-auto'>
      {messages.map((message, i) => (
        <MessageBox
          isLastMessage={i === messages.length - 1}
          key={message.id}
          message={message}
        />
      ))}
      <div ref={bottomRef} className='pt-24' />
    </div>
  );
};

export default ConversationBody;
