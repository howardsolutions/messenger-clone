import getConversationById from '@/app/actions/getConversationById';
import getMessages from '@/app/actions/getMessages';
import ConversationBody from '@/components/Conversation/ConversationBody';
import ConversationForm from '@/components/Conversation/ConversationForm';
import ConversationHeader from '@/components/Conversation/ConversationHeader';
import EmptyState from '@/components/EmptyState';

interface ConversationPageProps {
  conversationId: string;
}

const ConversationId = async ({
  params,
}: {
  params: ConversationPageProps;
}) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);

  if (!conversation) {
    return (
      <div className='lg:pl-80 h-full'>
        <div className='h-full flex flex-col'>
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className='lg:pl-80 h-full'>
      <div className='h-full flex flex-col'>
        <ConversationHeader conversation={conversation} />
        <ConversationBody />
        <ConversationForm />
      </div>
    </div>
  );
};

export default ConversationId;
