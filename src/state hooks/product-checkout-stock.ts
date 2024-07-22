import { create } from "zustand";

export const useCheckoutStock = create((set) => ({
  cartProductQuantity: 1,
  cartStockQuantity: 0,
  setQuantities: (cartQuantity, stockQuantity) =>
    set({
      cartProductQuantity: cartQuantity,
      cartStockQuantity: stockQuantity,
    }),
    increaseQuantity: () => set((state) => ({
        cartProductQuantity: state.cartProductQuantity < state.cartStockQuantity ? state.cartProductQuantity + 1 : state.cartProductQuantity
      })),
  decreaseQuantity: () =>
    set((state) => ({
      cartProductQuantity:
        state.cartProductQuantity > 1 ? state.cartProductQuantity - 1 : 1,
    })),
}));
