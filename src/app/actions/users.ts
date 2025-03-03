'use server';

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";

export const searchUsers = async (searchTerm: string) => {
  try {
    const users = await prisma.user.findMany({
      where: searchTerm ? {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      } : {},
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        profile: {
          select: {
            bio: true,
          },
        },
      },
      take: 20, // Increased limit for when showing all users
      orderBy: {
        name: 'asc', // Sort alphabetically
      },
    });

    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Could not search users');
  }
}; 