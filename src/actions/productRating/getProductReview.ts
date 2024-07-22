"use server"

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";


export async function getProductReviews({
    productId,
    fetchLimit,
    page,
    starRating,
    sortDirection = 'desc',
}: {
    productId: string;
    fetchLimit?: number;
    page?: number;
    starRating?: number;
    sortDirection?: 'asc' | 'desc';
}) {
    console.log("this is the curretn page:", page)

    const userSession = await auth();
    const user = userSession?.user?.id;


    try {

      let pageSize = fetchLimit || 10; // Default page size if fetchLimit is not provided

    
        // Calculate number of reviews to skip based on page number
        let skip = fetchLimit ? ((page && page > 1 ? page - 1 : 0) * pageSize) : 0;

      
      let baseWhere: any = {
        productId: productId,
        review: {
            not: null, // Include only reviews where 'review' is not null
        },
    };

      // Apply star rating filter if provided
      if (starRating && starRating >= 1 && starRating <= 5) {
        baseWhere.rating = starRating;
    }

      // Count the total number of reviews for the product (including star rating filter)
      const totalReviewsCount = await prismadb.rating.count({
        where: baseWhere,
    });

    // Ensure skip value does not exceed total number of reviews
    if (skip >= totalReviewsCount) {
        skip = totalReviewsCount > 0 ? totalReviewsCount - pageSize : 0;
    }


     // Fetch reviews based on constructed query
     const reviews = await prismadb.rating.findMany({
        where: baseWhere,
        include: {
            images: true,
            user: {
                select: {
                    name: true,
                },
            },
            likes: true,
            dislikes: true,
        },
        take: fetchLimit || pageSize,
        skip: skip,
        orderBy: sortDirection === 'asc' ? { createdAt: 'asc' } : { createdAt: 'desc' },
    });

       // Calculate total number of pages based on totalReviewsCount and pageSize
       const totalPages = Math.ceil(totalReviewsCount / pageSize);


         // Process reviews to include total likes, dislikes, and user-specific like/dislike status
    const processedReviews = reviews.map(review => {
      const totalLikes = review.likes.length;
      const totalDislikes = review.dislikes.length;
      const likedByUser = user ? review.likes.some(like => like.userId === user) : false;
      const dislikedByUser = user ? review.dislikes.some(dislike => dislike.userId === user) : false;

      return {
        ...review,
        totalLikes,
        totalDislikes,
        likedByUser,
        dislikedByUser,
      };
    });


      // Count the verified purchases
      const verifiedPurchaseCount = await prismadb.rating.count({
        where: {
            productId: productId,
            verifiedPurchase: true,
            
        },
    });

  
    return {
      reviews: processedReviews,
      verifiedPurchaseCount,
      totalPages,
  };
      
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      return { error: "Error fetching product reviews" };
    }


  }