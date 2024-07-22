"use server";

import { prismadb } from "@/lib/db";

// Function to recursively find all parent categories
export async function findAllParentCategories(
  categoryId: string
): Promise<string[]> {
  const parentCategories: string[] = [];
  let parentCategory: string | null = null;

  let topmostParentCategory: string | null = null;

  async function findParent(categoryId: string) {
    if (!categoryId) return;
    const category = await prismadb.category.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true, parentId: true },
    });

    if (category?.id) {
      parentCategories.push(category.name);
      if (!parentCategory && category.parentId) {
        parentCategory = category.name; // Set the direct parent category
      }
      if (!category.parentId) {
        topmostParentCategory = category.name; // Set the topmost parent category
      }
      await findParent(category?.parentId);
    }
  }

  await findParent(categoryId);

  return { parentCategories, parentCategory, topmostParentCategory };
}

// Function to get product details by name including all parent categories
export async function getProductDetailsByID(ProductId) {
  if (ProductId === undefined || ProductId === null || ProductId === "") {
    return { error: "Product id is required" };
  }

  // Find the product
  const product = await prismadb.product.findUnique({
    where: { id: ProductId },
    select: { id: true, categoryId: true },
  });

  if (!product) {
    throw new Error(`Product with id '${ProductId}' not found.`);
  }

  // Find the category of the product
  const category = await prismadb.category.findUnique({
    where: { id: product.categoryId },
    select: { id: true, parentId: true },
  });

  if (!category) {
    throw new Error(`Category for product '${ProductId}' not found.`);
  }

  const parentId = category.parentId || null;

  // Find all parent categories recursively
  const parentCategoryIds = await findAllParentCategories(product.categoryId);

  // // Find all children categories of the parent category
  // const childrenCategories = await prismadb.category.findMany({
  //   where: { parentId },
  //   select: { id: true }
  // });

  // const childCategoryIds = childrenCategories.map(cat => cat.id);

  return {
    productId: product.id,
    parentCategoryId: parentId,
    parentCategoryIds: parentCategoryIds,
    //   childrenCategoryIds: childCategoryIds
  };
}
