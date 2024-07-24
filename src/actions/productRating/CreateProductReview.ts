"use server"

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";

interface ReviewData {
  ispaid:boolean;
  productId: string;
  rating: number;
  reviewTitle?: string | null;
  review?: string | null;
  verifiedPurchase?: boolean;
  imageUrls?: string[];
}

export async function createUserReview({
  productId,
  rating,
  reviewTitle,
  review ,
  verifiedPurchase , // This will default to false if not provided
  imageUrls,
}: ReviewData) {
   
    const userSession = await auth();
    const user = userSession?.user?.id;

    if(!user){
        return  {error:"User not Signed in"}
    }

  //  if the user has already added the review he Cannot add another review and will the the his previous review instead to which he can edit or delete it 


  try {

       // Check if the user has already reviewed the product
    const existingReview = await prismadb.rating.findFirst({
      where: {
        productId: productId,
        userId: user,
      },
    });

    if (existingReview) {
      // User has already created a review for this product
      return {
        message: "You have already reviewed this product.",
        review: existingReview,
      };
    }
    
    // Create a new rating with associated images
    const newRating = await prismadb.rating.create({
      data: {
        productId: productId,
        rating: rating,
        reviewTitle: reviewTitle,
        review: review,
        verifiedPurchase:verifiedPurchase,
        userId:user as string,
        images: {
          create: imageUrls?.map((image) => ({ url: image })),
        },
      },
    });

    // console.log("User review created:", newRating);
  } catch (error) {
    console.error("Error creating user review:", error);
  }
}



// // Sample usage
// const sampleReviewData: ReviewData = {
//   productId: "60c72b2f9b1e8b5a6f8c978d", // Replace with an actual product ID
//   rating: 5,
//   reviewTitle: "Great product!",
//   review: "I love using this product every day.",
//   imageUrls: ["image1.jpg", "image2.jpg"],
// };

// createUserReview(sampleReviewData);
