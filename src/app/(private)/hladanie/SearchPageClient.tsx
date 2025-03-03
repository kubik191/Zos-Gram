'use client';

import { Container, Typography, Box } from '@mui/material';
import UserSearch from '@/components/UserSearch';

export default function SearchPageClient() {
  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Hľadať používateľov
        </Typography>
        <UserSearch />
      </Box>
    </Container>
  );
} 