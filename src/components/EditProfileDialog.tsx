'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProfileFormData) => Promise<void>;
  initialData: {
    name: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
  };
}

export interface ProfileFormData {
  name: string;
  bio: string;
  location: string;
  website: string;
}

export default function EditProfileDialog({ open, onClose, onSave, initialData }: EditProfileDialogProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData.name || '',
    bio: initialData.bio || '',
    location: initialData.location || '',
    website: initialData.website || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            <TextField
              label="Location"
              fullWidth
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <TextField
              label="Website"
              fullWidth
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 