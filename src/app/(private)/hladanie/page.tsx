// jakub-aplikacia-prax/src/app/hladanie/page.tsx

import Typography from '@mui/material/Typography';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"

export const metadata = {title: 'Hladanie | ZoškaSnap'};

export default async function Search() {

  const session = await getServerSession(authOptions)
  if (!session){
    redirect("/auth/prihlasenie")
  }

  return (
    <Typography>Tu vyhladavas</Typography>
  );
}
