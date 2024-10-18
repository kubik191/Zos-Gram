// src/components/NavBar.tsx

"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSession, signIn, signOut } from 'next-auth/react'; // Import NextAuth hooks
import Image from 'next/image'; // For profile picture

export default function SimpleBottomNavigation() {
  const { data: session } = useSession(); // Get session data
  const [value, setValue] = React.useState('/');
  const router = useRouter();

  const handleNavigation = (newValue: string) => {
    setValue(newValue);
    router.push(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          handleNavigation(newValue);
        }}
      >
        {/* Show different nav items depending on session */}
        {session ? (
          <>
            <BottomNavigationAction label="Domov" value="/" icon={<HomeIcon />} />
            <BottomNavigationAction label="Hľadať" value="/hladanie" icon={<SearchIcon />} />
            <BottomNavigationAction label="Pridať" value="/pridat" icon={<AddCircleIcon />} />
            <BottomNavigationAction
              label="Profil"
              value="/profil"
              icon={
                session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={24}
                    height={24}
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  <PersonIcon />
                )
              }
            />
            <BottomNavigationAction
              label="Odhlásiť sa"
              value="/odhlasit"
              icon={<LogoutIcon />}
              onClick={() => signOut()} // Sign out action
            />
          </>
        ) : (
          <>
            <BottomNavigationAction label="Domov" value="/" icon={<HomeIcon />} />
            <BottomNavigationAction label="Príspevky" value="/prispevok" icon={<AddCircleIcon />} />
            <BottomNavigationAction label="Registrácia" value="/auth/registracia" icon={<HowToRegIcon />} />
            <BottomNavigationAction label="Prihlásenie" value="/auth/prihlasenie" icon={<LoginIcon />} />
          </>
        )}
      </BottomNavigation>
    </Box>
  );
}
