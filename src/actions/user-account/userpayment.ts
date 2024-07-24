"use server";
import { z } from "zod";
import { PaymentSchema } from "@/schemas"; // Adjust the import path accordingly

import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { handlePaymentInfo } from "../payments/handlePayment";

export async function userCheckoutPayment(userId: string, paymentDetails: z.infer<typeof PaymentSchema>) {
  try {
    // Validate userId and paymentDetails
    if (!userId) {
      return { error: "User ID is required" };
    }
    const validatedPayment = PaymentSchema.safeParse(paymentDetails);
    if (!validatedPayment.success) {
      return { error: "Invalid payment fields" };
    }

  //   interface HandlePaymentInfoInput {
  //     userId: string;
  //     paymentMode: PaymentMode; // Assuming this is the selected payment mode (PaymentMode.CARD or PaymentMode.WALLET)
  //     cardDetails?: {
  //         cardNumber: string;
  //         cardExpiry: string;
  //         cardCvc: string;
  //         cardHolderName: string;
  //     }; // Card details provided by user if creating a new card
  // }
    // Find the user to ensure they exist
    const user = await prismadb.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const UserCardDetails = {
      cardNumber: validatedPayment.data.cardNumber,
      cardExpiry: validatedPayment.data.expirationDate,
      cardCvc: validatedPayment.data.cvv,
      cardHolderName: validatedPayment.data.nameOnCard,
    }
// this function create card or wallet based on the payment mode
   const paymentRecord= await handlePaymentInfo({ userId, paymentMode: "CARD", cardDetails: {...UserCardDetails} });
    

    // console.log('Payment processed successfully', paymentRecord);

    return {paymentRecord, success: "Payment processed successfully" };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while processing the payment" };
  }
}
