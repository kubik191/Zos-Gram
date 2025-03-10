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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!user) {
      // Create new user with profile if doesn't exist
      await prisma.user.create({
        data: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          profile: {
            create: {
              bio: null,
              location: null,
              website: null,
              interests: []
            }
          }
        },
      });
    } else if (!user.profile) {
      // Create profile for existing user if doesn't exist
      await prisma.profile.create({
        data: {
          userId: user.id,
          bio: null,
          location: null,
          website: null,
          interests: []
        },
      });
    }

    const profile = await fetchProfileByUserId(session.user.id);
    return <ProfilePageClient profile={profile} />;
  } catch (error) {
    console.error('Error in ProfilePage:', error);
    throw error;
  }
} 