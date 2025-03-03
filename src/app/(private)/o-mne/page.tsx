import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { fetchProfileByUserId } from '@/app/actions/profiles';
import ProfilePageClient from '../profil/[id]/ProfilePageClient';
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";

export const metadata: Metadata = {
  title: 'O mne | ZoškaSnap',
  description: 'Môj profil na ZoškaSnap'
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  console.log('Session:', session); // Debug log

  if (!session?.user?.id) {
    console.log('No user ID in session'); // Debug log
    redirect('/auth/prihlasenie');
  }

  try {
    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true }
    });

    console.log('Found user:', user); // Debug log

    if (!user) {
      // If user doesn't exist, create them
      const newUser = await prisma.user.create({
        data: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          profile: {
            create: {
              bio: null,
              location: null,
              website: null
            }
          }
        },
        include: { profile: true }
      });
      console.log('Created new user:', newUser); // Debug log
    }

    const profile = await fetchProfileByUserId(session.user.id);
    return <ProfilePageClient profile={profile} />;
  } catch (error) {
    console.error('Detailed error:', error); // Debug log
    redirect('/');
  }
} 