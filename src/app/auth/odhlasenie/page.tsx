"use client"; // Keep this directive

import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { signOut } from 'next-auth/react';

export default function SignOut() {
  return (
    <>
      <Head>
        <title>Odhlasenie | JakubGram</title>  {/* Set the title here */}
      </Head>


      <Typography variant="h4" gutterBottom>
        Odhlásenie
      </Typography>


      <Button
      variant="contained" 
      color="primary" 
      onClick={() => signOut()}
      >
        Sign Out
      </Button>
    </>
  );
}