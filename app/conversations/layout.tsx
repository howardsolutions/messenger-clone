import { DesktopSidebar, MobileFooter } from '@/components/Layout';
import { getCurrentUser, getUsers } from '@/app/actions';
import getConversations from '../actions/getConversations';
import ConversationList from '@/components/Conversation/ConversationList';

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <div className='h-full'>
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className='lg:pl-20 h-full'>
        <ConversationList initialItems={conversations} users={users} />
        {children}
      </main>
    </div>
  );
}
