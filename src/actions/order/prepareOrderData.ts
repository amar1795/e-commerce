interface Product {
  id: string;
  cartQuantity: number;
  price: number;
}

interface OrderData {
  userId: string;
  addressID: string;
  paymentMode: string;
  cardId?: string;
  walletId?: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

// this function will sort and prepare the order data and take only the required fields

export function prepareOrderData(
  userId: string,
  products: Product[],
  addressID: string,
  paymentMode: string,
  cardId?: string,
  walletId?: string,
): OrderData {
  let totalAmount = 0;
  
  const orderItems = products.map((product) => {
    const price = product.discountedPrice ; // Use discounted price if available, otherwise regular price
    const quantity = product.cartQuantity;
    const productVarientID = product.productVarientID;
    const size = product.size;
    const color = product.color;
    totalAmount += price * quantity;
    
    return {
      productId: product.id,
      quantity: quantity,
      price: price,
      productVarientID: productVarientID,
      size: size,
      color: color,
    };
  });

  // console.log("this is the total amount", totalAmount);

//   console.log('Order data prepared successfully', orderItems);
  return {
    userId,
    products: orderItems,
    addressID,
    paymentMode,
    totalAmount,
    cardId,
    walletId,
  };
}
