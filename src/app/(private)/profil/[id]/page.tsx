import { Metadata } from 'next';
import { fetchProfileByUserId } from '@/app/actions/profiles';
import ProfilePageClient from './ProfilePageClient';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const profile = await fetchProfileByUserId(params.id);
    return {
      title: `${profile.name || 'Profile'} | ZoškaSnap`,
      description: profile.profile?.bio || 'User profile on ZoškaSnap'
    };
  } catch (error) {
    return {
      title: 'Profile | ZoškaSnap'
    };
  }
}

export default async function ProfilePage({ params }: Props) {
  try {
    const profile = await fetchProfileByUserId(params.id);
    return <ProfilePageClient profile={profile} />;
  } catch (error) {
    notFound();
  }
} 