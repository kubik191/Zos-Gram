// src/app/actions/posts.ts

"use server";

// Import Prisma client
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { revalidatePath } from "next/cache";

// Fetch all posts
export const fetchPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts");
  }
};

// Fetch posts by a specific user ID
export const fetchPostsByUserId = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts by userId:", error);
    throw new Error("Could not fetch posts");
  }
};

// Create a new post
export const createPost = async (userId: string, imageUrl: string, caption?: string) => {
  try {
    const newPost = await prisma.post.create({
      data: {
        userId,
        imageUrl,
        caption,
      },
    });

    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Could not create post");
  }
};

// Toggle like on a post
export const toggleLike = async (postId: string, userId: string) => {
  if (!postId || !userId) {
    throw new Error('Missing required parameters');
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    } else {
      // Like
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }

    // Get updated post data
    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    revalidatePath('/prispevky');
    return JSON.parse(JSON.stringify(updatedPost));
  } catch (error) {
    console.error('Error toggling like:', error);
    throw new Error('Could not toggle like');
  }
};

// Add a comment to a post
export const addComment = async (postId: string, userId: string, content: string) => {
  try {
    await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });

    revalidatePath('/profil/[id]');
    revalidatePath('/');
    return true;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const fetchPostDetails = async (postId: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error('Error fetching post details:', error);
    throw error;
  }
};