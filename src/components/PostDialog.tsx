'use client';

import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Avatar,
  Divider,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toggleLike, addComment } from '@/app/actions/posts';
import { deleteComment } from '@/app/actions/comments';
import { Post } from '@/types/post';

interface Props {
  post: Post;
  onClose: () => void;
  onUpdate: () => void;
}

export default function PostDialog({ post, onClose, onUpdate }: Props) {
  const { data: session } = useSession();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLike = async () => {
    if (!session?.user?.id) return;
    try {
      await toggleLike(post.id, session.user.id);
      onUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !comment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(post.id, session.user.id, comment.trim());
      setComment('');
      onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isLikedByUser = session?.user?.id && post.likes.some(like => like.userId === session.user.id);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'white',
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, display: 'flex', height: '90vh' }}>
        {/* Left side - Image */}
        <Box sx={{ flex: '1 1 60%', bgcolor: 'black', position: 'relative' }}>
          <Image
            src={post.imageUrl}
            alt={post.caption || ''}
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        {/* Right side - Comments */}
        <Box sx={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
          {/* Header */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Link href={`/profil/${post.user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Avatar
                src={post.user.image || undefined}
                alt={post.user.name || ''}
                sx={{ width: 32, height: 32, cursor: 'pointer' }}
              />
            </Link>
            <Link href={`/profil/${post.user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ cursor: 'pointer' }}>
                {post.user.name}
              </Typography>
            </Link>
          </Box>
          <Divider />

          {/* Comments section */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            {/* Caption */}
            {post.caption && (
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Avatar
                  src={post.user.image || undefined}
                  alt={post.user.name || ''}
                  sx={{ width: 32, height: 32 }}
                />
                <Box>
                  <Typography component="span" fontWeight="bold" mr={1}>
                    {post.user.name}
                  </Typography>
                  <Typography component="span">
                    {post.caption}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Comments */}
            {post.comments?.map((comment) => {
              const isCommentOwner = session?.user?.id === comment.userId;
              console.log('Comment:', {
                commentId: comment.id,
                commentUserId: comment.userId,
                sessionUserId: session?.user?.id,
                isCommentOwner
              });
              
              return (
                <Box key={comment.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Avatar
                    src={comment.user.image || undefined}
                    alt={comment.user.name || ''}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">
                      <strong>{comment.user.name}</strong> {comment.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {isCommentOwner && (
                    <IconButton
                      size="small"
                      onClick={async () => {
                        if (!session?.user?.id) return;
                        try {
                          await deleteComment(comment.id, session.user.id);
                          onUpdate();
                        } catch (error) {
                          console.error('Error deleting comment:', error);
                        }
                      }}
                      sx={{ 
                        opacity: 0.6,
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Actions */}
          <Box sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <IconButton
                onClick={handleLike}
                color={isLikedByUser ? 'error' : 'default'}
                disabled={!session}
                sx={{
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                {isLikedByUser ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton>
                <ChatBubbleOutlineIcon />
              </IconButton>
              <Box flexGrow={1} />
              <IconButton>
                <BookmarkBorderIcon />
              </IconButton>
            </Box>

            <Typography fontWeight="bold" mb={1}>
              {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
            </Typography>

            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Divider />

          {/* Comment input */}
          <Box
            component="form"
            onSubmit={handleComment}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder={session ? "Add a comment..." : "Sign in to comment"}
              variant="standard"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!session || submitting}
              sx={{ '& .MuiInput-underline:before': { borderBottom: 'none' } }}
            />
            <Button
              type="submit"
              disabled={!session || !comment.trim() || submitting}
              sx={{ minWidth: 'auto' }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Post'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
} 