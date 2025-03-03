'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { debounce } from 'lodash';
import { searchUsers } from '@/app/actions/users';
import Link from 'next/link';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  profile?: {
    bio: string | null;
  };
}

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch users
  const fetchUsers = async (term: string) => {
    try {
      setLoading(true);
      const results = await searchUsers(term);
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search for when user types
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      fetchUsers(term);
    }, 300),
    []
  );

  // Initial load of all users
  useEffect(() => {
    fetchUsers('');
  }, []);

  // Handle search input changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Vyhľadať používateľov..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!loading && users.length > 0 && (
        <Paper elevation={2}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {users.map((user) => (
              <ListItem
                key={user.id}
                component={Link}
                href={`/profil/${user.id}`}
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.image || undefined} alt={user.name || ''}>
                    {user.name?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      noWrap
                      sx={{
                        width: '100%',
                        display: 'block',
                      }}
                    >
                      {user.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{
                        width: '100%',
                        display: 'block',
                      }}
                    >
                      {user.profile?.bio || user.email}
                    </Typography>
                  }
                  sx={{
                    overflow: 'hidden',
                    '& .MuiListItemText-primary, & .MuiListItemText-secondary': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {!loading && users.length === 0 && (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Žiadni používatelia nenájdení
        </Typography>
      )}
    </Box>
  );
} 