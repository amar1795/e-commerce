import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Sample data for images, sizes, colors, reviews, and ratings
  const images = [
    { url: 'http://example.com/image1.jpg' },
    { url: 'http://example.com/image2.jpg' },
    { url: 'http://example.com/image3.jpg' },
    { url: 'http://example.com/image4.jpg' },
    { url: 'http://example.com/image5.jpg' },
  ];

  const sizes = [
    { sizeId: 'size-object-id-1' }, // Replace with actual size ObjectId
    { sizeId: 'size-object-id-2' }, // Replace with actual size ObjectId
  ];

  const colors = [
    { colorId: 'color-object-id-1' }, // Replace with actual color ObjectId
    { colorId: 'color-object-id-2' }, // Replace with actual color ObjectId
  ];

  const reviews = [
    {
      rating: 5,
      comment: 'Great product!',
      userId: 'user-object-id-1', // Replace with actual user ObjectId
    },
    {
      rating: 4,
      comment: 'Very good!',
      userId: 'user-object-id-2', // Replace with actual user ObjectId
    },
    {
      rating: 3,
      comment: 'Average product.',
      userId: 'user-object-id-3', // Replace with actual user ObjectId
    },
    {
      rating: 2,
      comment: 'Not what I expected.',
      userId: 'user-object-id-4', // Replace with actual user ObjectId
    },
    {
      rating: 1,
      comment: 'Terrible product.',
      userId: 'user-object-id-5', // Replace with actual user ObjectId
    },
  ];

  const ratings = [
    {
      rating: 5,
      comment: 'Excellent!',
      userId: 'user-object-id-1', // Replace with actual user ObjectId
    },
    {
      rating: 4,
      comment: 'Very good!',
      userId: 'user-object-id-2', // Replace with actual user ObjectId
    },
    {
      rating: 3,
      comment: 'It\'s okay.',
      userId: 'user-object-id-3', // Replace with actual user ObjectId
    },
    {
      rating: 2,
      comment: 'Not great.',
      userId: 'user-object-id-4', // Replace with actual user ObjectId
    },
    {
      rating: 1,
      comment: 'Very bad.',
      userId: 'user-object-id-5', // Replace with actual user ObjectId
    },
  ];

  // Function to create a product
  const createProduct = async (index: number) => {
    return prisma.product.create({
      data: {
        categoryId: 'men-category-object-id', // Replace with actual category ObjectId
        brandId: 'brand-object-id', // Replace with actual brand ObjectId
        name: `Sample Product ${index}`,
        price: 99.99 + index, // Different price for each product
        discount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Images
        images: {
          createMany: {
            data: images,
          },
        },
        // Sizes
        size: {
          createMany: {
            data: sizes,
          },
        },
        // Colors
        productColors: {
          createMany: {
            data: colors,
          },
        },
        // Reviews
        reviews: {
          createMany: {
            data: reviews,
          },
        },
        // Ratings
        ratings: {
          createMany: {
            data: ratings,
          },
        },
      },
    });
  };

  // Create 10 products
  const productPromises = [];
  for (let i = 1; i <= 10; i++) {
    productPromises.push(createProduct(i));
  }
  
  // Wait for all products to be created
  const products = await Promise.all(productPromises);
  // console.log('Created products:', products);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
