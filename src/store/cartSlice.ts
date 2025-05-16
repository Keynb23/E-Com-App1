import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const loadInitialState = (): CartState => {
  try {
    const serializedState = sessionStorage.getItem('cart');
    if (serializedState === null) {
      return { items: [] };
    }
    const items = JSON.parse(serializedState);
    if (Array.isArray(items)) {
      return { items };
    }
    console.warn('Cart data in session storage was not an array, resetting cart.');
    return { items: [] };
  } catch (err) {
    console.error("Could not load cart state from session storage, using default.", err);
    return { items: [] };
  }
};

const initialState: CartState = loadInitialState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<Product & { quantity?: number }>) => {
      const newItem = { ...action.payload, quantity: action.payload.quantity ?? 1 };
      const existingItem = state.items.find(item => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectTotalItems = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectTotalPrice = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export default cartSlice.reducer;
