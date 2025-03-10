import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { addComment } from '@/app/actions/posts';
import { deleteComment } from '@/app/actions/comments';

interface Comment {
  id: string;
  content: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
}

interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

export default function CommentDialog({ open, onClose, postId, comments, onCommentAdded }: CommentDialogProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !newComment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(postId, session.user.id, newComment.trim());
      setNewComment('');
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session?.user?.id) return;
    try {
      await deleteComment(commentId, session.user.id);
      onCommentAdded();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Comments
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
      <Divider />
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ mb: 2, maxHeight: '50vh', overflowY: 'auto' }}>
          {comments.map((comment) => {
            const isCommentOwner = session?.user?.id === comment.userId;
            
            return (
              <Box key={comment.id} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'start' }}>
                <Link href={`/profil/${comment.user.id}`} style={{ textDecoration: 'none' }}>
                  <Avatar
                    src={comment.user.image || undefined}
                    alt={comment.user.name || ''}
                    sx={{ width: 32, height: 32 }}
                  />
                </Link>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Link href={`/profil/${comment.user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography component="span" fontWeight="bold">
                        {comment.user.name}
                      </Typography>
                    </Link>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography>{comment.content}</Typography>
                </Box>
                {isCommentOwner && (
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteComment(comment.id)}
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
        
        <Divider sx={{ my: 2 }} />
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={session ? "Add a comment..." : "Sign in to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!session || submitting}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!session || !newComment.trim() || submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Post'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
} 