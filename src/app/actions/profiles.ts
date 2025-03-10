// src/app/actions/profiles.ts

"use server";

// Import Prisma client
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { revalidatePath } from "next/cache";

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

    // Fetch user with profile, posts, and related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        posts: {
          orderBy: {
            createdAt: 'desc'
          },
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
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        followers: true,
        following: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get follower and following counts
    const followerCount = await prisma.follows.count({
      where: { followingId: userId },
    });

    const followingCount = await prisma.follows.count({
      where: { followerId: userId },
    });

    // If profile doesn't exist, create it
    if (!user.profile) {
      await prisma.profile.create({
        data: {
          userId,
          bio: null,
          location: null,
          interests: [],
          avatarUrl: user.image || null,
          website: null,
        },
      });

      // Fetch the user again with the new profile
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          posts: {
            orderBy: {
              createdAt: 'desc'
            },
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
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          followers: true,
          following: true,
        },
      });

      if (!updatedUser) {
        throw new Error('User not found after profile creation');
      }

      return {
        ...updatedUser,
        _count: {
          posts: updatedUser.posts.length,
          followers: followerCount,
          following: followingCount,
        },
      };
    }

    // Return user with counts
    return {
      ...user,
      _count: {
        posts: user.posts.length,
        followers: followerCount,
        following: followingCount,
      },
    };
  } catch (error) {
    console.error("Error in fetchProfileByUserId:", error);
    throw error;
  }
};

// Implement follow functionality
export const toggleFollow = async (followerId: string, followingId: string) => {
  try {
    // Check if already following
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
      
      // Revalidate both profiles
      revalidatePath(`/profil/${followerId}`);
      revalidatePath(`/profil/${followingId}`);
      
      return false;
    } else {
      // Follow
      await prisma.follows.create({
        data: {
          followerId,
          followingId,
        },
      });
      
      // Revalidate both profiles
      revalidatePath(`/profil/${followerId}`);
      revalidatePath(`/profil/${followingId}`);
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    throw new Error('Could not toggle follow status');
  }
};

export const checkIfFollowing = async (followerId: string, followingId: string) => {
  try {
    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return !!follow;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};

export const updateProfile = async (
  userId: string,
  data: {
    name: string;
    bio: string;
    location: string;
    website: string;
  }
) => {
  try {
    // Update user name
    await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    });

    // Update or create profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        bio: data.bio,
        location: data.location,
        website: data.website,
      },
      update: {
        bio: data.bio,
        location: data.location,
        website: data.website,
      },
    });

    revalidatePath(`/profil/${userId}`);
    return profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Could not update profile');
  }
};
