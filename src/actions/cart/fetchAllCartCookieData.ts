
"use server"
import { cookies } from 'next/headers';
import { getCartDataFromCookies } from './addCartDatatoCookies';
import { fetchMultipleProducts } from './fetchMultipleProducts';
import { revalidatePath } from 'next/cache';

export async function fetchAllCartCookieData() {
  
          const cookieData = await getCartDataFromCookies();

          const completedata = await fetchMultipleProducts(
            cookieData.map((product) => product.id)
          );

          // Merge cartQuantity from cookies into completedata
          const mergedData = completedata.map((product) => {
            const cookieProduct = cookieData.find((item) => item.id === product.id);
            if (cookieProduct) {
              return { ...product, cartQuantity: cookieProduct.cartQuantity, color:cookieProduct.color, size:cookieProduct.size, stock:cookieProduct.stock,productVarientID:cookieProduct.productVarientID};
            }
            return product;
          });
    
          // Calculate total amount and product count
          let total = 0;
          let count = 0;
    
          cookieData.forEach((product) => {
            const price = product.discountedPrice || 0;
            const quantity = product.cartQuantity || 0;
            total += price * quantity;
            count++;
          });
    
          // console.log("fetchAllCartCookieData is being called",count);

          revalidatePath("/");
        return  { mergedData, total, count };
        

}