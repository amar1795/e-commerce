"use server"

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function productLike(reviewId: string) {
  const userSession = await auth();
  const user = userSession?.user?.id;

  if (!user) {
    return { error: "User not signed in" };
  }

  try {
    // Check if the user has already disliked the review
    const existingDislike = await prismadb.dislike.findFirst({
      where: {
        ratingId: reviewId,
        userId: user,
      },
    });

    if (existingDislike) {
      // Remove the dislike
      await prismadb.dislike.delete({
        where: { id: existingDislike.id },
      });
    }

    // Check if the user has already liked the review
    const existingLike = await prismadb.like.findFirst({
      where: {
        ratingId: reviewId,
        userId: user,
      },
    });

    if (existingLike) {
      // Remove the like
      await prismadb.like.delete({
        where: { id: existingLike.id },
      });

      return { message: "Like removed", like: null };
    }
    // Create a new like
    const newLike = await prismadb.like.create({
      data: {
        ratingId: reviewId,
        userId: user,
      },
    });

    revalidatePath("/")

    return { message: "Review liked", like: newLike };
  } catch (error) {
    console.error("Error liking review:", error);
    return { error: "Error liking review" };
  }
}
