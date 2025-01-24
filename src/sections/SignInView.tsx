'use client';

import { signIn } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { useState } from 'react';

export default function SignInView() {
  const [gdprChecked, setGdprChecked] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGdprChecked(event.target.checked);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        textAlign: 'center', 
        padding: 2 
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'background.default',
          boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 3px 5px 2px rgba(255, 255, 255, .1)' : 3,
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom>
          Prihlásenie
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
          Nemáte účet?{' '}
          <Link href="/auth/registracia" passHref>
            <Typography
              component="span"
              sx={{
                color: 'primary.main',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Zaregistrujte sa
            </Typography>
          </Link>
        </Typography>
        <Box sx={{ marginY: 2 }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={gdprChecked} 
                onChange={handleCheckboxChange} 
                sx={{ color: 'inherit' }}
              />
            }
            label={
              <Typography>
                I accept the {' '}
                <Link href="/gdpr" passHref>
                  <Typography
                    component="span"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    GDPR
                  </Typography>
                </Link>
                {' '} terms and conditions.
              </Typography>
            }
          />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => signIn('google')} 
            sx={{ 
              backgroundColor: gdprChecked ? undefined : 'lightgrey', 
              color: gdprChecked ? undefined : 'white', 
              pointerEvents: gdprChecked ? 'auto' : 'none' 
            }}
          >
            Sign in with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

