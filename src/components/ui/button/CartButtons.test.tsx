import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../../../store/cartSlice'; 
import { AddToCart } from './CartButtons';
import type { Product } from '../../../types/types';

const mockProduct: Product = {
  id: '101',
  title: 'Test Product for Cart',
  price: 19.99,
  description: 'A product to test the add to cart button.',
  category: 'Testing Category',
  image: 'test-product.jpg',
  rating: {
    rate: 4.0,
    count: 50,
  },
  brand: ''
};

describe('AddToCart Integration', () => {
  it('adds the product to the cart state when button is clicked', () => {
    // Create a real Redux store
    const store = configureStore({ reducer: { cart: cartReducer } });

    render(
      <Provider store={store}>
        <AddToCart product={mockProduct} />
      </Provider>
    );

    const buttonElement = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(buttonElement);

    // Assert that the store state has the added product
    const state = store.getState();
    expect(state.cart.items.some((item: any) => item.id === mockProduct.id)).toBe(true);
  });
});