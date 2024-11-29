// jakub-aplikacia-prax/src/app/(home)/page.tsx


"use client";

import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Welcome to Domov</h1>
      {!session ? (
        <p>You are not signed in. If you want to add posts, please sign up.</p>
      ) : (
        <p>Welcome, {session.user?.name}!</p>
      )}
    </div>
  );
}