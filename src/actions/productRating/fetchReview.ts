"use server"

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";

interface ReviewData {
  productId: string;
}

export async function fetchReview({
  productId,
  
}: ReviewData) {
   
    const userSession = await auth();
    const user = userSession?.user?.id;

    if(!user){
        return  {error:"User not Signed in"}
    }

  try {

       // Check if the user has already reviewed the product
    const existingReview = await prismadb.rating.findFirst({
      where: {
        productId: productId,
        userId: user,
      },
    });

    // console.log("This is the Existing review:", existingReview);
    if (existingReview) {
      // User has already created a review for this product
      return {
        message: "This is the user review for this product",
        review: existingReview,
      };
    }
    
  } catch (error) {
    console.error("Something went wrong", error);
  }
}

