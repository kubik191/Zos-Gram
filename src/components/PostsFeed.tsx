'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchPosts, toggleLike, addComment } from '@/app/actions/posts';
import CommentDialog from '@/components/CommentDialog';
import AddIcon from '@mui/icons-material/Add';
import AddPostDialog from './AddPostDialog';

interface Like {
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
}

interface Post {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  likes: Like[];
  comments: Comment[];
  _count: {
    likes: number;
    comments: number;
  };
}

export default function PostsFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState<string | null>(null);
  const [isAddPostDialogOpen, setIsAddPostDialogOpen] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      setError(null);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts. Please try again.');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadPosts();
      setLoading(false);
    };
    init();
  }, [loadPosts]);

  const handleLike = async (postId: string) => {
    if (!session?.user?.id) return;

    // Optimistic update
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes.some(like => like.userId === session.user?.id)
                ? post.likes.filter(like => like.userId !== session.user?.id)
                : [...post.likes, { userId: session.user.id, user: session.user }],
              _count: {
                ...post._count,
                likes: post.likes.some(like => like.userId === session.user?.id)
                  ? post._count.likes - 1
                  : post._count.likes + 1
              }
            }
          : post
      )
    );

    try {
      const updatedPost = await toggleLike(postId, session.user.id);
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.id === postId ? { ...post, ...updatedPost } : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      await loadPosts(); // Revert to server state on error
    }
  };

  const isPostLikedByUser = (post: Post, userId?: string) => {
    if (!userId) return false;
    return post.likes.some(like => like.userId === userId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Add Post Button */}
      {session && (
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddPostDialogOpen(true)}
          >
            Add Post
          </Button>
        </Box>
      )}

      {error && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 2, 
            bgcolor: 'error.light', 
            color: 'error.contrastText',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography>{error}</Typography>
          <Button color="inherit" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </Paper>
      )}

      {posts.map((post) => (
        <Paper
          key={post.id}
          elevation={0}
          sx={{
            mb: 6,
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Post Header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Link href={`/profil/${post.user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Avatar
                src={post.user.image || undefined}
                alt={post.user.name || ''}
                sx={{ width: 32, height: 32, cursor: 'pointer' }}
              />
            </Link>
            <Link href={`/profil/${post.user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ cursor: 'pointer' }}
              >
                {post.user.name}
              </Typography>
            </Link>
          </Box>

          {/* Post Image */}
          <Box sx={{ position: 'relative', pt: '100%', bgcolor: 'black' }}>
            <Image
              src={post.imageUrl}
              alt={post.caption || ''}
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>

          {/* Post Actions */}
          <Box sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <IconButton
                onClick={() => handleLike(post.id)}
                color={isPostLikedByUser(post, session?.user?.id) ? 'error' : 'default'}
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
                {isPostLikedByUser(post, session?.user?.id) ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <IconButton onClick={() => setSelectedPostForComments(post.id)}>
                <ChatBubbleOutlineIcon />
              </IconButton>
              <Box flexGrow={1} />
              <IconButton>
                <BookmarkBorderIcon />
              </IconButton>
            </Box>

            {/* Likes count */}
            <Typography fontWeight="bold" mb={1}>
              {post._count.likes} {post._count.likes === 1 ? 'like' : 'likes'}
            </Typography>

            {/* Caption */}
            {post.caption && (
              <Box mb={1}>
                <Typography component="span" fontWeight="bold" mr={1}>
                  {post.user.name}
                </Typography>
                <Typography component="span">{post.caption}</Typography>
              </Box>
            )}

            {/* First 3 Comments */}
            {post.comments.length > 0 && (
              <Box mb={1}>
                {post.comments.slice(0, 3).map((comment) => (
                  <Box key={comment.id} display="flex" gap={1}>
                    <Typography component="span" fontWeight="bold">
                      {comment.user.name}
                    </Typography>
                    <Typography component="span">{comment.content}</Typography>
                  </Box>
                ))}
                {post._count.comments > 3 && (
                  <Typography 
                    color="text.secondary" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setSelectedPostForComments(post.id)}
                  >
                    View all {post._count.comments} comments
                  </Typography>
                )}
              </Box>
            )}

            {/* Timestamp */}
            <Typography variant="caption" color="text.secondary" display="block">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>
      ))}

      {/* Comment Dialog */}
      {selectedPostForComments && (
        <CommentDialog
          open={true}
          onClose={() => setSelectedPostForComments(null)}
          postId={selectedPostForComments}
          comments={posts.find(p => p.id === selectedPostForComments)?.comments || []}
          onCommentAdded={loadPosts}
        />
      )}

      {/* Add Post Dialog */}
      <AddPostDialog
        open={isAddPostDialogOpen}
        onClose={() => setIsAddPostDialogOpen(false)}
        onPostAdded={loadPosts}
      />
    </Container>
  );
} 