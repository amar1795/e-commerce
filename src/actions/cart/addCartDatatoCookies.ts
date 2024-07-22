"use server"
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { fetchAllCartCookieData } from './fetchAllCartCookieData';

export async function addCartDatatoCookies(updatedProducts) {
  const cookieStore = cookies();
  
  // Retrieve existing data from cookies
  const existingDataCookie = cookieStore.get('cartProducts');
  const existingData = existingDataCookie ? JSON.parse(existingDataCookie.value) : [];

  // Filter the updated products to store only those with cartQuantity > 0
  const productsToStore = updatedProducts
    .filter(product => product?.cartQuantity > 0)
    .map(product => ({
      id: product.id,
      cartQuantity: product?.cartQuantity,
      discountedPrice: product.discountedPrice,
      color:product?.color,
      size:product?.size,
      stock:product?.stock,
      productVarientID:product?.productVarientID
    }));

  // Merge new data with existing data, ensuring no duplicates
  const mergedData = [...existingData];
  
  productsToStore.forEach(productToStore => {
    const index = mergedData.findIndex(item => item.id === productToStore.id);
    if (index !== -1) {
      // Update existing product
      mergedData[index] = productToStore;
    } else {
      // Add new product
      mergedData.push(productToStore);
    }
  });


  // Save the merged data back to cookies
  cookieStore.set({
    name: 'cartProducts',
    value: JSON.stringify(mergedData),
    httpOnly: true,
    path: '/',
  });
  fetchAllCartCookieData();

  return  { success: true, cookieValue: productsToStore };
  
}

export async function getCartDataFromCookies() {
  const cookieStore = cookies();
  const existingDataCookie = cookieStore.get('cartProducts');
  const existingData = existingDataCookie ? JSON.parse(existingDataCookie.value) : [];
  // console.log("this is the existing data cookie", existingData);
  return existingData;

}

// Function to remove product from cookies
export async function removeProductFromCookies(productId) {
  
  const cookieData = await getCartDataFromCookies(); // Load existing cart data from cookies
  const updatedCookieData = cookieData.filter((item) => item.id !== productId);

  // Save updated cookie data back to cookies
  await cookies().set({
    name: 'cartProducts',
    value: JSON.stringify(updatedCookieData),
    httpOnly: true,
    path: '/',
  });
}


export async function clearCartCookies() {
  const cookieStore = cookies();

  // Clear the 'cartProducts' cookie by setting it to an empty array
  cookieStore.set({
    name: 'cartProducts',
    value: JSON.stringify([]),
    httpOnly: true,
    path: '/',
  });

  return { success: true, message: 'Cart cleared successfully' };
}
