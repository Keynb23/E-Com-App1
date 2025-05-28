import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';


import type { Product, CartItem } from '../types/types';

interface CartState {
  items: CartItem[];
}

// loadInitialState
const loadInitialState = (): CartState => {
  try {
    const serializedState = sessionStorage.getItem('cart');
    if (serializedState === null) {
      return { items: [] };
    }
    const items = JSON.parse(serializedState);
    if (Array.isArray(items)) {

      return { items: items.map((item: any) => ({ ...item, id: String(item.id) })) };
    }
    console.warn('Cart data in session storage was not an array, resetting cart.');
    return { items: [] };
  } catch (err) {
    console.error("Could not load cart state from session storage, using default.", err);
    return { items: [] };
  }
};
// This function attempts to load the initial cart state from `sessionStorage`. 
// If valid cart data is found, it's parsed and returned; otherwise, an empty cart is returned.

const initialState: CartState = loadInitialState();

// cartSlice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

    // addItemToCart
    addItemToCart: (state, action: PayloadAction<Product & { quantity?: number }>) => {
      const newItemId = String(action.payload.id);
      const newItem = { ...action.payload, id: newItemId, quantity: action.payload.quantity ?? 1 };

      const existingItem = state.items.find(item => item.id === newItemId); 
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {

        state.items.push(newItem as CartItem); 
      }
    },
    // This reducer handles adding a product to the cart. 
    // If the product already exists in the cart, its quantity is increased; otherwise, the new product is added as a `CartItem`.

    // removeItemFromCart
    removeItemFromCart: (state, action: PayloadAction<string>) => { 
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // This reducer removes an item from the cart based on its unique ID.

    // incrementQuantity
    incrementQuantity: (state, action: PayloadAction<string>) => { 
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    // This reducer increases the quantity of a specific item in the cart by one.

    // decrementQuantity
    decrementQuantity: (state, action: PayloadAction<string>) => { 
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
      }
    },
    // This reducer decreases the quantity of a specific item in the cart by one. 
    // If the quantity drops to zero or below, the item is removed from the cart entirely.

    // clearCart
    clearCart: (state) => {
      state.items = [];
    },
    // This reducer resets the cart, removing all items.
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

// selectCartItems
export const selectCartItems = (state: RootState) => state.cart.items;
// This selector returns the array of all items currently in the cart.

// selectTotalItems
export const selectTotalItems = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
// This selector calculates the total number of individual items in the cart by summing up the quantities of all products.

// selectTotalPrice
export const selectTotalPrice = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
// This selector calculates the total monetary value of all items in the cart by summing the price times quantity for each product.

export default cartSlice.reducer;