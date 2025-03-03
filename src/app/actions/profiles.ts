// src/app/actions/profiles.ts

"use server";

// Import Prisma client
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";

// Fetch profiles based on search term
export const fetchProfiles = async (searchTerm: string) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        OR: [
          { user: { name: { contains: searchTerm, mode: "insensitive" } } },
          { interests: { has: searchTerm } },
        ],
      },
      include: { user: true }, // Include user data
    });

    return profiles;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw new Error("Could not fetch profiles");
  }
};

// Fetch a single profile by user ID
export const fetchProfileByUserId = async (userId: string) => {
  try {
    console.log('Fetching profile for user ID:', userId);

    // Fetch user with profile and posts
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        posts: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // If profile doesn't exist, create it
    if (!user.profile) {
      await prisma.profile.create({
        data: {
          userId,
          bio: null,
          location: null,
          interests: [],
          avatarUrl: user.image || null
        }
      });

      // Fetch the user again with the new profile
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          posts: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });

      if (!updatedUser) {
        throw new Error('User not found after profile creation');
      }

      return {
        ...updatedUser,
        _count: {
          posts: updatedUser.posts.length,
          followers: 0,
          following: 0
        }
      };
    }

    // Return user with counts
    return {
      ...user,
      _count: {
        posts: user.posts.length,
        followers: 0,
        following: 0
      }
    };
  } catch (error) {
    console.error("Error in fetchProfileByUserId:", error);
    throw error;
  }
};

// Note: These functions won't work until you add the Follows model to your schema
export const toggleFollow = async (followerId: string, followingId: string) => {
  throw new Error("Follow functionality not implemented yet");
};

export const checkIfFollowing = async (followerId: string, followingId: string) => {
  return false;
};
