export interface Like {
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface Post {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  likes: Like[];
  comments: Comment[];
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface Profile {
  id: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatarUrl: string | null;
  interests: string[];
}

export interface User {
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