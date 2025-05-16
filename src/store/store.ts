import { configureStore } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const sessionStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);

  if (
    typeof action === 'object' &&
    action !== null &&
    'type' in action && typeof action.type === 'string' && action.type.startsWith('cart/')
  ) {
    try {
      const cartItems = store.getState().cart.items;
      sessionStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Could not save cart state to session storage", e);
    }
  }
  return result;
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sessionStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;