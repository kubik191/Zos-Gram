// jakub-aplikacia-prax/src/app/prispevky/page.tsx

import Typography from '@mui/material/Typography';

export const metadata = { title: 'Detail prispevku | RobertWeb'};

export default function PostDetail({ 
  params,

}: {
  params: {
    prispevokId : "string"
  };
}) {
  return (

      <Typography> Detail prispevku: {params.prispevokId}</Typography>

  );
}