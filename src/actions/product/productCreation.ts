import { createProduct, createProductReview } from "../createProduct";
import { prismadb } from "@/lib/db";

interface ProductParams {
    productName: string;
    productPrice: number;
    productDiscountPercentage: number;
    productDescription: string;
    productImages: string[];
    productCategoryId: string;
    productBrandId: string;
}
const productParams: ProductParams = {
    productName: "CloudBounce Kids' Ultra-Cushion Sport Shoes: Soar with Unmatched Comfort",
    productPrice: 7000.00,
    productBrandId: "665ac7545788e185779d7ccf",
    productCategoryId: "665df2e246b36eef0288e436",
    productDiscountPercentage: 45,
    productDescription: "Elevate your child's performance with our CloudBounce Kids' Ultra-Cushion Sport Shoes, designed to provide unparalleled comfort and support for their active lifestyle. These sporty shoes feature advanced cushioning technology that offers a plush and responsive feel with every stride. Whether they're running, jumping, or playing their favorite sport, these shoes ensure a soft landing and energy return to keep them going strong. Crafted from lightweight and breathable materials, they offer durability and ventilation to keep feet cool and comfortable during intense play. The reinforced toe cap and durable outsole provide stability and traction on various surfaces, ensuring confident movements on the field or court. With a cushioned insole for added comfort, these CloudBounce sport shoes are the perfect choice for kids who demand superior cushioning and performance in their footwear.",

    productImages: [
        "https://res.cloudinary.com/dfveswqdm/image/upload/v1717068180/Kids/Shoes/sports%20shoes/51Hw8kOYUJL._SY695__rxx8vs.jpg",
        "https://res.cloudinary.com/dfveswqdm/image/upload/v1717068177/Kids/Shoes/sports%20shoes/51a1aALntxL._SY695__paz4yi.jpg",
        "https://res.cloudinary.com/dfveswqdm/image/upload/v1717068192/Kids/Shoes/sports%20shoes/61L2yEhmNxL._SY695__apok8x.jpg",
        "https://res.cloudinary.com/dfveswqdm/image/upload/v1717068192/Kids/Shoes/sports%20shoes/61L2yEhmNxL._SY695__apok8x.jpg",

         ]
};

export async function productCreationNew() {
    createProduct(productParams);
}


// creating product reviews for all the items for a specfic category , need to optimse this function as well later 
export async function productReviewCreation() {
    try {
        const products = await prismadb.product.findMany({
            where: {
                category: {
                    // Filter by category name
                    name: "shoes",
                    // Filter by parent category name
                    parent: {
                        name: "men"
                    }
                }
            },
            include: {
                category: true
            }
        });
        
        // Loop over the products and extract their IDs
        for (const product of products) {
            const productId = product.id;
            // Perform any operations you need with the product ID
            // For example, pass it to createProductReview function
            await createProductReview(productId);
        }
        
        console.log("Product reviews created successfully!");
    } catch (error) {
        console.error("Error creating product reviews:", error);
    } finally {
        await prismadb.$disconnect();
    }
}

