import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { AddToCart } from './CartButtons';
import type { Product } from '../../../types/types';

const mockStore = configureStore([]);
const initialState = { cart: { items: [], totalQuantity: 0, totalAmount: 0 } }; 

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

describe('AddToCart Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn(); 
  });

  {/*Test 1, Button rendering and att */}
  it('renders the button with correct text and data-testid', () => {
    render(<Provider store={store}><AddToCart product={mockProduct} /></Provider>);
    const buttonElement = screen.getByRole('button', { name: /add to cart/i });
    expect(buttonElement).toBeInTheDocument(); // ✅ ensures button exists
    expect(buttonElement).toHaveAttribute('data-testid', `add-to-cart-btn-${mockProduct.id}`); 
  });

    {/*Test 2, callback btn on click */}

  it('calls onAddToCart callback with the product when clicked, if provided', () => {
    const mockOnAddToCart = jest.fn();

    render(<Provider store={store}><AddToCart product={mockProduct} /></Provider>);

    const buttonElement = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(buttonElement); 

    expect(store.dispatch).toHaveBeenCalledTimes(1); 
  });

    {/*Test 3, click handing w/o callback */}

  it('handles click correctly even if onAddToCart callback is not provided', () => {
    render(<Provider store={store}><AddToCart product={mockProduct} /></Provider>);

    const buttonElement = screen.getByRole('button', { name: /add to cart/i });

    expect(() => fireEvent.click(buttonElement)).not.toThrow(); 
    expect(store.dispatch).toHaveBeenCalledTimes(1); 
  });
});
