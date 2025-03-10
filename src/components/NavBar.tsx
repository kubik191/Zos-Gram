"use client";

import * as React from "react";
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Box, 
  Avatar,
  IconButton,
  Divider
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LoginIcon from "@mui/icons-material/Login";
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const [value, setValue] = React.useState<string>("/");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { mode, toggleTheme } = useTheme();

  const handleNavigation = (event: React.SyntheticEvent, newValue: string) => {
    console.log("Navigating to:", newValue);
    setValue(newValue);
    
    // Special handling for profile navigation
    if (newValue === "/profil" && session?.user?.id) {
      router.push(`/profil/${session.user.id}`);
      return;
    }

    // Special handling for logout
    if (newValue === "logout") {
      signOut({ callbackUrl: "/" });
      return;
    }

    if (!session && newValue !== "/auth/registracia" && newValue !== "/auth/prihlasenie" && newValue !== "/" && newValue !== "/o-mne" && newValue !== "/gdpr") {
      router.push("/auth/registracia");
    } else {
      router.push(newValue);
    }
  };

  const nonAuthPaths = [
    { label: "Domov", value: "/", icon: <HomeIcon /> },
    { label: "O mne", value: "/o-mne", icon: <AccessibilityIcon /> },
    { label: "Registrácia", value: "/auth/registracia", icon: <AppRegistrationIcon /> },
    { label: "Prihlásenie", value: "/auth/prihlasenie", icon: <LoginIcon /> },
  ];

  const authPaths = [
    { label: "Domov", value: "/prispevky", icon: <HomeIcon /> },
    { label: "Hľadať", value: "/hladanie", icon: <SearchIcon /> },
    { label: "Pridať", value: "/pridat", icon: <AddCircleIcon /> },
    {
      label: "Profil",
      value: "/profil",
      icon: session?.user?.image ? (
        <Avatar 
          alt={session?.user?.name || "User"} 
          src={session?.user?.image || undefined}
          sx={{ width: 24, height: 24 }}
        />
      ) : (
        <Avatar sx={{ width: 24, height: 24 }}>
          {session?.user?.name?.charAt(0) || "U"}
        </Avatar>
      ),
    },
  ];

  const navigationPaths = status === "authenticated" ? authPaths : nonAuthPaths;

  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: 0, zIndex: 1000 }}>
      <BottomNavigation 
        showLabels 
        value={value} 
        onChange={handleNavigation}
        sx={{ 
          borderTop: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'relative'
        }}
      >
        {navigationPaths.map((path) => (
          <BottomNavigationAction
            key={path.value}
            label={path.label}
            value={path.value}
            icon={path.icon}
          />
        ))}
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <IconButton 
          onClick={toggleTheme}
          color="inherit"
          sx={{ 
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </BottomNavigation>
    </Box>
  );
}