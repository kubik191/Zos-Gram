'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
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
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { toggleFollow, checkIfFollowing } from '@/app/actions/profiles';

interface Post {
  id: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date;
}

interface Profile {
  id: string;
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  interests: string[];
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  profile: Profile | null;
  posts: Post[];
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

interface Props {
  profile: User;
}

export default function ProfilePageClient({ profile }: Props) {
  const { data: session } = useSession();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState(0);
  const isOwnProfile = session?.user?.id === profile.id;

  const handleFollowToggle = async () => {
    if (!session?.user?.id) return;
    try {
      const newFollowStatus = await toggleFollow(session.user.id, profile.id);
      setIsFollowing(newFollowStatus);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
              {!isOwnProfile && (
                <Button
                  variant={isFollowing ? "outlined" : "contained"}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </Box>
            
            <Box display="flex" gap={4} mb={2}>
              <Typography>
                <strong>{profile._count.posts}</strong> posts
              </Typography>
              <Typography>
                <strong>{profile._count.followers}</strong> followers
              </Typography>
              <Typography>
                <strong>{profile._count.following}</strong> following
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
                onClick={() => setSelectedPost(post)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption || ''}
                  loading="lazy"
                  style={{ aspectRatio: '1', objectFit: 'cover' }}
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
                    color: 'white',
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                >
                  <Typography variant="h6">
                    {new Date(post.createdAt).toLocaleDateString()}
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
      </Paper>

      <Dialog
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedPost && (
          <Box position="relative">
            <IconButton
              onClick={() => setSelectedPost(null)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Grid container>
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%',
                  }}
                >
                  <Image
                    src={selectedPost.imageUrl}
                    alt={selectedPost.caption || ''}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box p={2}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar src={profile.image || undefined} alt={profile.name || ''} />
                    <Typography variant="subtitle1">{profile.name}</Typography>
                  </Box>
                  {selectedPost.caption && (
                    <Typography variant="body1" paragraph>
                      {selectedPost.caption}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Dialog>
    </Container>
  );
} 