// jakub-aplikacia-prax/src/app/(home)/page.tsx


"use client";

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function HomePage() {
  const { data: session } = useSession();
  if ( session ) {
    redirect('/prispevky')
  }

  return (
    <div>
      <h1>Welcome to Domov</h1>
      <p>Please log in</p>
      
    </div>
  );
}