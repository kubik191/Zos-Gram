// src/app/layout.tsx
"use client";
import Navbar from "@/components/NavBar";
import PublicLayout from './(public)/layout';
import PrivateLayout from './(private)/layout';
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useMemo } from 'react';
import { PaletteMode } from '@mui/material';
import { getDesignTokens } from '../app/theme/themeConfig'
import AuthProvider from "../components/AuthProvider";

interface RootLayoutProps {
  children: React.ReactNode;
}



export default function RootLayout({ children }: RootLayoutProps) {
  const [mode, setMode] = useState<PaletteMode>('light');

  const theme = useMemo(() => 
  createTheme(getDesignTokens(mode)), [mode]);
  const isPrivateRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/private');

  const Layout = isPrivateRoute ? PrivateLayout : PublicLayout;

  return (
    
      <html lang="sk">
        <body>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <main style={{ flexGrow: 1 }}>
                  <Layout>{children}</Layout>
                </main>
              </div>
              <Navbar  mode={mode} setMode={setMode} /> 
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    
  );
}

