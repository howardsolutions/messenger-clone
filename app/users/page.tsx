'use client';
import { signOut } from 'next-auth/react';

function UserPage() {
  return (
    <div>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}

export default UserPage;
