
// /src/components/Navbar.tsx

"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';  // Icons for the actions
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg'; // Icon for Sign In

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState('/');
  const router = useRouter(); // Next.js router for navigation

  const handleNavigation = (newValue: "string") => {
    setValue(newValue);
    router.push(newValue);
  };


  return (
    <Box sx={{ width: '100%' }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          handleNavigation(newValue); // Handle navigation on change
        }}
      >
        <BottomNavigationAction label="Domov" value={'/'} icon={<HomeIcon />} />
        <BottomNavigationAction label="Profil" value={'/profil'} icon={<PersonIcon />} />
        <BottomNavigationAction label="Prispevky" value={'/prispevok'} icon={<AddCircleIcon />} />
        <BottomNavigationAction label="prihlasenie" value={'/auth/prihlasenie'} icon={<LoginIcon />} />
        <BottomNavigationAction label="Registracia" value={'/auth/registracia'} icon={<HowToRegIcon />} />
      </BottomNavigation>
    </Box>
  );
}