import { Box, Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
        gap={2}
      >
        <Typography variant="h4" gutterBottom>
          Profil nenájdený
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Ľutujeme, ale požadovaný profil neexistuje alebo bol odstránený.
        </Typography>
        <Button component={Link} href="/" variant="contained">
          Späť na hlavnú stránku
        </Button>
      </Box>
    </Container>
  );
} 