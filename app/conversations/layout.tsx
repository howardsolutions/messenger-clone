import { DesktopSidebar, MobileFooter } from '@/components/Layout';
import { getCurrentUser } from '@/app/actions';

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <div className='h-full'>
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className='lg:pl-20 h-full'>
        {/* <UserList users={users} /> */}
        {children}
      </main>
    </div>
  );
}
