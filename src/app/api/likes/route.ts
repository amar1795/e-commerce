import { prismadb } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { ratingId, userId } = req.body;

  try {
    // Check if the user has already liked the review
    const existingLike = await prismadb.like.findFirst({
      where: {
        ratingId,
        userId,
      },
    });

    // If the user has already liked the review, return an error
    if (existingLike) {
      return res.status(400).json({ error: 'User has already liked this review' });
    }

    // Otherwise, create a new like for the review
    await prismadb.like.create({
      data: {
        ratingId,
        userId,
      },
    });

    // Update the likes count in the Rating model
    await prismadb.rating.update({
      where: {
        id: ratingId,
      },
      data: {
        likes: {
          increment: 1,
        } as  any,
      },
    });

    res.status(200).json({ message: 'Review liked successfully' });
  } catch (error) {
    console.error('Error liking review:', error);
    res.status(500).json({ error: 'Internal server error' });
  } 
}
