// jakub-aplikacia-prax/src/app/not-found.tsx

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { title } from 'process';

export const metadata = {title: 'NotFound | ZoškaSnap'};

export default function NotFound() {
  return (

    <Box>
      <Typography>Stránka nenájdená</Typography>
    </Box>
  );
}

