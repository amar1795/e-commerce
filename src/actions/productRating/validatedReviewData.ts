"use server";

import * as z from "zod";

import { ReviewSchema } from "@/schemas";
import { createUserReview } from "./CreateProductReview";
import { updateUserReview } from "./editReviewData";


export const ValidatedReviewData = async (values: z.infer<typeof ReviewSchema>,ProductId,reviewId, isPaid) => {
  
  const validatedFields = ReviewSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Data please fill the data properly !" };
  }

  const { rating,images,title,review } = validatedFields.data;

const data={
    ispaid:isPaid,
    productId: ProductId, // Replace with an actual product ID
    rating: rating,
    reviewTitle: title,
    review: review,
    verifiedPurchase: isPaid ? true : false,
    imageUrls: images,
    
}

  // console.log("This is the review Id:", reviewId);
  // Conditionally add ratingId if reviewId is present
// Conditionally add ratingId if reviewId is not present (creating a new review)
if (!reviewId) {
  const validatedReviewData = await createUserReview({ ...data });
  // console.log("New User review created:", validatedReviewData);
  return { success: " New User review created:" ,data:validatedReviewData};
} else {
  // console.log("this contains the review id",reviewId)
  const validatedUpdatedReviewData = await updateUserReview({ ratingId: reviewId, ...data });
  // console.log(" Updated User Review Data:", validatedUpdatedReviewData);
  return { success: " Updated User Review Data:" ,data:validatedUpdatedReviewData};

}

  
}