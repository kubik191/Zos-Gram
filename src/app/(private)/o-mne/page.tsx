'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { fetchProfileByUserId } from '@/app/actions/profiles';

interface Profile {
  bio?: string;
  location?: string;
  website?: string;
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    website: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user?.id) {
        try {
          const userProfile = await fetchProfileByUserId(session.user.id);
          setProfile(userProfile);
          setEditForm({
            bio: userProfile?.bio || '',
            location: userProfile?.location || '',
            website: userProfile?.website || '',
          });
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadProfile();
  }, [session]);

  if (status === 'loading' || !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar
            src={profile.user.image || ''}
            alt={profile.user.name || ''}
            sx={{ width: 150, height: 150, mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            {profile.user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {profile.user.email}
          </Typography>
          <Button
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(!isEditing)}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {isEditing ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Bio
              </Typography>
              <Typography variant="body1" paragraph>
                {profile.bio || 'No bio added yet'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              <Typography variant="body1">
                {profile.location || 'No location added'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Website
              </Typography>
              <Typography variant="body1">
                {profile.website ? (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    {profile.website}
                  </a>
                ) : (
                  'No website added'
                )}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
} 