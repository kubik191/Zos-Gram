'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  Container,
  Box,
  Avatar,
  Typography,
  Grid,
  Button,
  Paper,
  ImageList,
  ImageListItem,
  Dialog,
  IconButton,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import GridViewIcon from '@mui/icons-material/GridView';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import { toggleFollow, checkIfFollowing } from '@/app/actions/profiles';
import PostDialog from '@/components/PostDialog';
import { fetchPostDetails } from '@/app/actions/posts';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import EditProfileDialog, { ProfileFormData } from '@/components/EditProfileDialog';
import { updateProfile } from '@/app/actions/profiles';
import { Post, User } from '@/types/post';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

interface Props {
  profile: User;
}

export default function ProfilePageClient({ profile: initialProfile }: Props) {
  const { data: session } = useSession();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState(0);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [profile, setProfile] = useState<User>(initialProfile);
  const isOwnProfile = session?.user?.id === profile.id;

  // Check initial follow status
  useEffect(() => {
    const checkFollow = async () => {
      if (session?.user?.id && !isOwnProfile) {
        const following = await checkIfFollowing(session.user.id, profile.id);
        setIsFollowing(following);
      }
    };
    checkFollow();
  }, [session?.user?.id, profile.id, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Optimistic updates
      setIsFollowing(prev => !prev);
      const newFollowerCount = profile._count.followers + (isFollowing ? -1 : 1);
      
      setProfile(prev => ({
        ...prev,
        _count: {
          ...prev._count,
          followers: newFollowerCount
        }
      }));

      // Make the API call
      const isNowFollowing = await toggleFollow(session.user.id, profile.id);
      
      // If the API call fails, the catch block will revert the optimistic updates
    } catch (error) {
      console.error('Error toggling follow:', error);
      // Revert optimistic updates
      setIsFollowing(prev => !prev);
      setProfile(prev => ({
        ...prev,
        _count: {
          ...prev._count,
          followers: prev._count.followers + (isFollowing ? 1 : -1)
        }
      }));
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePostClick = async (post: Post) => {
    setIsLoadingPost(true);
    try {
      const postDetails = await fetchPostDetails(post.id);
      setSelectedPost(postDetails);
    } catch (error) {
      console.error('Error fetching post details:', error);
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handlePostUpdate = async () => {
    if (selectedPost) {
      const updatedPost = await fetchPostDetails(selectedPost.id);
      setSelectedPost(updatedPost);
    }
  };

  const handleEditProfile = async (data: ProfileFormData) => {
    if (!session?.user?.id) return;
    try {
      await updateProfile(session.user.id, data);
      // The page will automatically revalidate due to the revalidatePath in the server action
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="start" gap={4} mb={4}>
          <Avatar
            src={profile.image || undefined}
            alt={profile.name || ''}
            sx={{ width: 150, height: 150 }}
          />
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h4">{profile.name}</Typography>
              {isOwnProfile ? (
                <Box display="flex" gap={1}>
                  <IconButton 
                    onClick={() => setIsEditDialogOpen(true)}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleSignOut}
                  >
                    Odhlásiť
                  </Button>
                </Box>
              ) : (
                <Button
                  variant={isFollowing ? "outlined" : "contained"}
                  onClick={handleFollowToggle}
                  startIcon={isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
                  sx={{ mb: 2 }}
                >
                  {isFollowing ? 'Nesledovať' : 'Sledovať'}
                </Button>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Typography variant="body2">
                <strong>{profile._count.posts}</strong> príspevkov
              </Typography>
              <Typography variant="body2">
                <strong>{profile._count.followers}</strong> sledovateľov
              </Typography>
              <Typography variant="body2">
                <strong>{profile._count.following}</strong> sledovaní
              </Typography>
            </Box>

            {profile.profile?.bio && (
              <Typography variant="body1" paragraph>
                {profile.profile.bio}
              </Typography>
            )}
            {profile.profile?.location && (
              <Typography variant="body2" color="primary">
                {profile.profile.location}
              </Typography>
            )}
            {profile.profile?.website && (
              <Typography 
                variant="body2" 
                color="primary" 
                component="a" 
                href={profile.profile.website}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'block' }}
              >
                {profile.profile.website}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
          <Tab icon={<GridViewIcon />} label="POSTS" />
          <Tab icon={<BookmarkIcon />} label="SAVED" />
        </Tabs>

        {tabValue === 0 && (
          <ImageList cols={3} gap={8}>
            {profile.posts.map((post) => (
              <ImageListItem
                key={post.id}
                onClick={() => handlePostClick(post)}
                sx={{ 
                  cursor: 'pointer',
                  aspectRatio: '1',
                  position: 'relative',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Image
                  src={post.imageUrl}
                  alt={post.caption || ''}
                  fill
                  sizes="(max-width: 768px) 33vw, 300px"
                  style={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    opacity: 0,
                    transition: '0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    color: 'white',
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                >
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FavoriteIcon fontSize="small" /> {post.likes?.length || 0}
                  </Typography>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ChatBubbleOutlineIcon fontSize="small" /> {post.comments?.length || 0}
                  </Typography>
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
        )}

        {tabValue === 1 && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography color="text.secondary">No saved posts yet</Typography>
          </Box>
        )}

        {isOwnProfile && (
          <EditProfileDialog
            open={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSave={handleEditProfile}
            initialData={{
              name: profile.name,
              bio: profile.profile?.bio || '',
              location: profile.profile?.location || '',
              website: profile.profile?.website || '',
            }}
          />
        )}
      </Paper>

      {selectedPost && (
        <PostDialog
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onUpdate={handlePostUpdate}
        />
      )}
    </Container>
  );
} 