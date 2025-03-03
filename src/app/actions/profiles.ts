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
    const profile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        posts: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            likes: true,
            comments: {
              include: {
                user: true
              }
            }
          }
        },
        followers: {
          include: {
            follower: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        following: {
          include: {
            following: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Transform the data to include counts
    const transformedProfile = {
      ...profile,
      _count: {
        posts: profile.posts.length,
        followers: profile.followers.length,
        following: profile.following.length
      }
    };

    return transformedProfile;
  } catch (error) {
    console.error("Error fetching profile by userId:", error);
    throw new Error("Could not fetch profile");
  }
};

export const toggleFollow = async (followerId: string, followingId: string) => {
  try {
    // Check if already following
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId
          }
        }
      });
      return false; // Not following anymore
    } else {
      // Follow
      await prisma.follows.create({
        data: {
          followerId,
          followingId
        }
      });
      return true; // Now following
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw new Error("Could not toggle follow status");
  }
};

export const checkIfFollowing = async (followerId: string, followingId: string) => {
  try {
    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
    return !!follow;
  } catch (error) {
    console.error("Error checking follow status:", error);
    throw new Error("Could not check follow status");
  }
};
