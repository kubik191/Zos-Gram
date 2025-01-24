// src/app/layout.tsx
"use client";
import Navbar from "@/components/NavBar";
import PublicLayout from './(public)/layout';
import PrivateLayout from './(private)/layout';
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import CssBaseline from '@mui/material/CssBaseline';
import AuthProvider from "../components/AuthProvider";

interface RootLayoutProps {
  children: React.ReactNode;
}



export default function RootLayout({ children }: RootLayoutProps) {

  

  const isPrivateRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/private');

  const Layout = isPrivateRoute ? PrivateLayout : PublicLayout;

  return (
    
      <html lang="sk">
        <body>
          <ThemeProvider>
            <CssBaseline />
            <AuthProvider>
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <main style={{ flexGrow: 1 }}>
                  <Layout>{children}</Layout>
                </main>
              </div>
              <Navbar/> 
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    
  );
}

