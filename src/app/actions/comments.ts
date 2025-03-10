"use server";

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { revalidatePath } from 'next/cache';

export const deleteComment = async (commentId: string, userId: string) => {
  try {
    // First check if the comment belongs to the user
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, postId: true }
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new Error('Unauthorized to delete this comment');
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId }
    });

    // Revalidate the post page
    revalidatePath('/profil/[id]');
    revalidatePath('/');

    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}; 