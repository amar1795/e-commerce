"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { cache } from "react";


export const getNestedParentCategories=cache(async(categoryId: string)=> {
    let categories = [];
    let currentCategory = await prismadb.category.findUnique({
        where: { id: categoryId },
        include: { parent: true },
    });

    while (currentCategory && currentCategory.parentId) {
        categories.push(currentCategory);
        currentCategory = await prismadb.category.findUnique({
            where: { id: currentCategory.parentId },
            include: { parent: true },
        });
    }

    if (currentCategory) {
        categories.push(currentCategory);  // Add the topmost category
    }

    return categories.reverse();  // To get the order from topmost to the given category
})

// export const getProductsByCategoryFiltered = cache(
export const  fetchAllOrders = cache( async ({page = 1, limit = 5, sortOrder = 'desc'})=> {
    const userSession = await auth();
    const user = userSession?.user?.id;
    const offset = (page - 1) * limit;  // Calculate offset

    try {
        // Fetch the total number of orders for the given userId
        const totalOrdersCount = await prismadb.order.count({
            where: {
                userId: user,
            },
        });

        // Calculate total number of pages
        const totalPages = Math.ceil(totalOrdersCount / limit);


        // Fetch all orders for the given userId
        const orders = await prismadb.order.findMany({
            where: {
                userId: user,
            },
            skip: offset,
            take: limit,
            orderBy: {
                createdAt: sortOrder as Prisma.SortOrder,  // Sort by createdAt field
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                brand: true,
                                images: {
                                    take: 1,  // Limit to only the first image
                                },
                                ratings: true, // Include the ratings to calculate the average

                            },
                        },
                    },
                },
                address: true,
                card: true,
                wallet: true,
            },
        });


        // Fetch and attach the nested parent categories
        for (const order of orders) {
            for (const orderItem of order.orderItems) {
                const product = orderItem.product;
                if (product && product.categoryId) {
                    const parentCategories = await getNestedParentCategories(product.categoryId);
                    product['parentCategories'] = parentCategories;
                }
            }
        }


        // Ensure orderTotal is not null
        const sanitizedOrders = orders.map(order => ({
            ...order,
            orderTotal: order.orderTotal ?? 0,  // Defaulting to 0 if orderTotal is null
            totalPages,
            totalOrdersCount
        }));

        // console.log('Orders fetched successfully', sanitizedOrders);

        return sanitizedOrders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
    } finally {
        await prismadb.$disconnect(); // Disconnect Prisma client
    }
})
