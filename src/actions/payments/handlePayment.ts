"use server";

import { prismadb } from "@/lib/db";

import { PrismaClient, Card, Wallet, PaymentMode } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { revalidatePath } from "next/cache";
import { fetchUserCards } from "./fetchAllCards";


interface HandlePaymentInfoInput {
    userId: string;
    paymentMode: PaymentMode; // Assuming this is the selected payment mode (PaymentMode.CARD or PaymentMode.WALLET)
    cardDetails?: {
        cardNumber: string;
        cardExpiry: string;
        cardCvc: string;
        cardHolderName: string;
    }; // Card details provided by user if creating a new card
}

export async function handlePaymentInfo(paymentInfo: HandlePaymentInfoInput): Promise<{ card?: Card, wallet?: Wallet }> {
    try {
        let card: Card | undefined;
        let wallet: Wallet | undefined;

        if (paymentInfo.paymentMode === "CARD") {
            // Fetch existing card if available
            // const existingCard = await prismadb.card.findFirst({
            //     where: {
            //         userId: paymentInfo.userId
            //     }
            // });

            // if (existingCard) {
            //     card = existingCard;
            // } else 
            
            if (paymentInfo.cardDetails) {
                // Create a new card securely
                const newCard = await createSecureCard(paymentInfo.userId, paymentInfo.cardDetails);
                card = newCard;
            }
        } else if (paymentInfo.paymentMode === "WALLET") {
            // Fetch existing wallet if available
            const existingWallet = await prismadb.wallet.findFirst({
                where: {
                    userId: paymentInfo.userId
                }
            });

            if (existingWallet) {
                wallet = existingWallet;
            } else {
                // Create a new wallet with initial balance
                const newWallet = await prismadb.wallet.create({
                    data: {
                        userId: paymentInfo.userId,
                        balance: 100000 // Initial balance for new wallet
                    }
                });
                wallet = newWallet;
            }
        } else {
            throw new Error('Invalid payment mode');
        }

        return { card, wallet };
    } catch (error) {
        console.error('Error handling payment info:', error);
        throw new Error('Failed to handle payment info');
    } finally {
        await prismadb.$disconnect(); // Disconnect Prisma client
    }
}

async function createSecureCard(userId: string, cardDetails: HandlePaymentInfoInput['cardDetails']): Promise<Card> {
    try {
        // Encrypt sensitive card details
        const encryptedCardNumber = await bcrypt.hash(cardDetails.cardNumber, 10); // Hash card number
        const encryptedCardCvc = await bcrypt.hash(cardDetails.cardCvc, 10); // Hash CVC
        const lastFourDigits = cardDetails.cardNumber.slice(-4);

        // Create the card entity with encrypted details
        const newCard = await prismadb.card.create({
            data: {
                userId: userId,
                cardNumber: encryptedCardNumber,
                cardExpiry: cardDetails.cardExpiry,
                cardCvc: encryptedCardCvc,
                cardHolderName: cardDetails.cardHolderName,
                lastFourDigits: lastFourDigits // Store last 4 digits separately

            }
        });

        // card ID :666b163bd4a3961818aeb7a7
        // console.log('Secure card created:', newCard);
        return newCard;
    } catch (error) {
        console.error('Error creating secure card:', error);
        throw new Error('Failed to create secure card');
    }
}

export async function deleteSecureCard(cardId: string) {
    try {
        // Delete the card entity
        await prismadb.card.delete({
            where: {
                id: cardId,
            },
        });
        
        console.log('Secure card deleted:', cardId);
    } catch (error) {
        console.error('Error deleting secure card:', error);
        throw new Error('Failed to delete secure card');
    }
}