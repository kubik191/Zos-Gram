// jakub-aplikacia-prax/src/app/prispevky/page.tsx
// Custom imports
import { useState, useEffect } from 'react';
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
import { Metadata } from 'next';
import PostsFeed from '@/components/PostsFeed';

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
  likes: any[];
  comments: Comment[];
}

export const metadata: Metadata = {
  title: "Príspevky | ZoškaSnap",
  description: "Prezeraj si príspevky od ostatných používateľov"
};

export default function PostsPage() {
  return <PostsFeed />;
}