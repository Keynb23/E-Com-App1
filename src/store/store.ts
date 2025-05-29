import { configureStore } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// sessionStorageMiddleware
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
// This middleware intercepts Redux actions. If an action's type starts with 'cart/', it saves the current state of the cart to session storage. 
// This ensures that the cart's contents are preserved across browser sessions.

// store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sessionStorageMiddleware),
});
// This function configures the Redux store. It combines the `cartReducer` and applies the `sessionStorageMiddleware` to handle the persistence of cart data.

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;