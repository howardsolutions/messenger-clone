import { DesktopSidebar, MobileFooter } from '@/components/Layout';
import { getCurrentUser, getUsers } from '../actions';
import { UserList } from '@/components/User';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const users = await getUsers();

  return (
    <div className='h-full'>
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className='lg:pl-20 h-full'>
        <UserList users={users} />
        {children}
      </main>
    </div>
  );
}
