'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Image from 'next/image';

interface AddPostDialogProps {
  open: boolean;
  onClose: () => void;
  onPostAdded: () => void;
}

export default function AddPostDialog({ open, onClose, onPostAdded }: AddPostDialogProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setUploading(true);
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('caption', caption);

      // Upload to server
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Clear form and close dialog
      setSelectedImage(null);
      setPreviewUrl(null);
      setCaption('');
      onPostAdded();
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Create New Post
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center',
            mt: 2,
          }}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          
          <Box
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              width: '100%',
              height: 300,
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <>
                <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography color="text.secondary" mt={1}>
                  Click to select or drag an image here
                </Typography>
              </>
            )}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={uploading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedImage || uploading}
        >
          {uploading ? <CircularProgress size={24} /> : 'Share'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 