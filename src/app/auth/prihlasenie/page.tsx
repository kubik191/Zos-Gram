// jakub-aplikacia-prax/src/app/auth/prihlasenie/page.tsx

"use client";

import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <div>
      <h1>Prihlásenie</h1>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  );
}
