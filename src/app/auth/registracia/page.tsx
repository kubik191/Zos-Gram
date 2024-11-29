// jakub-aplikacia-prax/src/app/auth/registracia/page.tsx

'use client'; // This directive ensures the component is treated as a Client Component

import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const handleSignIn = () => {
    signIn('google');
  };

  return (
    <div>
      <h1>Registrácia</h1>
      <button onClick={handleSignIn}>Sign up with Google</button>
    </div>
  );
}
