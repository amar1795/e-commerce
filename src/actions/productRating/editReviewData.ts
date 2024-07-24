"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";

interface ReviewData {
    productId: string;
    rating: number;
    reviewTitle?: string | null;
    review?: string | null;
    verifiedPurchase?: boolean;
    imageUrls?: string[];
  }


export const updateUserReview=async({
    ratingId,
    productId,
    rating,
    reviewTitle,
    review,
    verifiedPurchase,
    imageUrls,
  }: { ratingId: string }  & Partial<ReviewData>)=> {
  
    const userSession = await auth();
    const user = userSession?.user?.id;
  
    if (!user) {
      return { error: "User not Signed in" };
    }
  
    try {
  
      // Check if the review exists and belongs to the user
      const existingReview = await prismadb.rating.findFirst({
        where: {
          id: ratingId,
          userId: user,
        },
      });
  
      if (!existingReview) {
        return { error: "Review not found or you don't have permission to edit this review." };
      }
  
        // Merge the existing review data with the new data
    const updatedData = {
      
      productId: productId ?? existingReview.productId,
      rating: rating ?? existingReview.rating,
      reviewTitle: reviewTitle ?? existingReview.reviewTitle,
      review: review ?? existingReview.review,
      verifiedPurchase: verifiedPurchase ?? existingReview.verifiedPurchase,
    
    };


     // Handle image updates only if imageUrls are provided
     if (imageUrls) {
      updatedData.images = {
        deleteMany: {}, // Delete existing images
        create: imageUrls.map((image) => ({ url: image })), // Add new images
      };
    }
      // Update the review
      const updatedReview = await prismadb.rating.update({
        where: {
          id: ratingId,
          userId: user, // Ensure the userId matches for extra precaution
        },
        data: updatedData,
      });
  
      // console.log("User review updated:", updatedReview);

      return { message: "Review updated successfully", review: updatedReview };
    } catch (error) {
      console.error("Error updating user review:", error);
    }
  }
  
  // Sample usage
  const sampleReviewData: ReviewData = {
   
    productId: "60c72b2f9b1e8b5a6f8c978d", // Replace with an actual product ID
    rating: 5,
    reviewTitle: "Great product!",
    review: "I love using this product every day.",
    imageUrls: ["image1.jpg", "image2.jpg"],
  };
  
  // createUserReview(sampleReviewData);
  
  // Sample usage for updateUserReview
  const sampleUpdateData = {
    ratingId: "60c72b2f9b1e8b5a6f8c978d", // Replace with an actual rating ID
    ...sampleReviewData,
  };
  
  // updateUserReview(sampleUpdateData);