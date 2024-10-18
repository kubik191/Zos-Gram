// jakub-aplikacia-prax/src/app/auth/registracia/page.tsx

import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  return (
    <div>
      <h1>Registrácia</h1>
      <button onClick={() => signIn('google')}>Sign up with Google</button>
    </div>
  );
}
