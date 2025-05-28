
{/*
// render, screen, fireEvent:
// render: Renders React components.
// screen: Provides queries to find elements.
// fireEvent: Simulates user interactions (e.g., clicks, changes).
import { render, screen, fireEvent } from '@testing-library/react';
// Provider: React Redux component to make the Redux store available to connected components.
import { Provider } from 'react-redux';
// configureStore: Utility from Redux Toolkit to create a Redux store.
import { configureStore } from '@reduxjs/toolkit';
// ProductCard: The component being tested.
import ProductCard from './ProductCard';
// Product: Type definition for product data.
// Product: Type definition for product data.
import type { Product } from '../../types/types';
// cartReducer: The Redux reducer for the cart slice.
import cartReducer from '../../store/cartSlice';
import type { ReactNode } from 'react'; 



// --- Mocking External Dependencies ---

// Mock the @smastrom/react-rating component:
// Replaces the actual rating component with a simple div, preventing it from rendering complex UI
// or requiring its own dependencies.
vi.mock('@smastrom/react-rating', () => ({
  // Rating: This mock creates a simple `div` that displays the rating value and
  // includes a `data-testid` and `aria-label` for testability.
  Rating: (props: any) => <div data-testid="mock-rating" aria-label={`Rating: ${props.value}`}>{props.value} stars</div>,
}));

// Mock the AddToCart component:
// Replaces the actual AddToCart button with a simplified mock to isolate the ProductCard's behavior.
vi.mock('../ui/button/CartButtons', () => ({
  // AddToCart: This mock renders a simple `<button>` element with a `data-testid`
  // and a click handler (`onClick={() => vi.fn()}`) that does nothing,
  // ensuring the button is rendered and clickable without affecting the actual cart logic (which is tested elsewhere).
  AddToCart: vi.fn(({ children }: { children?: ReactNode }) => (
    <button data-testid="add-to-cart-button" onClick={() => { }}>{children || 'Add to Cart Mock'}</button>
  )),
}));

// describe('Name of Component/Feature', callback): Groups related tests for the `ProductCard` component.
describe('ProductCard Component', () => {
  // mockProduct: Defines a fake product object to be used consistently across tests in this block.
  const mockProduct: Product = {
    id: '123',
    title: 'Test Product',
    price: 99.99,
    brand: 'TestBrand',
    description: 'This is a description for a test product.',
    category: 'Electronics',
    image: 'test-image.jpg',
    rating: {
      rate: 4.2,
      count: 120,
    },
  };

  // store: Declares a variable to hold the Redux store instance.
  let store: ReturnType<typeof configureStore>;

  // beforeEach(callback): Runs before each test in this `describe` block.
  beforeEach(() => {
    // store = configureStore(): Initializes a fresh Redux store before each test.
    // This ensures tests are isolated and don't share state from previous tests.
    store = configureStore({
      reducer: {
        cart: cartReducer, // Includes the cart reducer in the store.
      },
    });
  });

  // test('description of test', callback): Defines an individual test case.
  test('renders product details correctly', () => {
    // render(): Renders the ProductCard component wrapped in the Redux `Provider`,
    // passing the mock store and product data as props.
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    // expect().toBeInTheDocument(): These assertions check if various pieces of product information
    // (title, category, price, rating label, image alt text) are present in the rendered output.
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByLabelText('Rating: 4.2')).toBeInTheDocument(); // Checks the `aria-label` from the mocked Rating component.
    expect(screen.getByAltText('Test Product')).toBeInTheDocument(); // Checks the image's alt text.
  });

  test('toggles description visibility on click', async () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    // expect(screen.queryByText()).not.toBeInTheDocument():
    // screen.queryByText(): Attempts to find an element by text, but returns `null` if not found (doesn't throw an error).
    // This initial assertion checks that the description is NOT visible initially.
    expect(screen.queryByText(mockProduct.description)).not.toBeInTheDocument();

    // fireEvent.click(): Simulates a user clicking on the "Test Product" title.
    // This action is expected to toggle the description's visibility in the component.
    fireEvent.click(screen.getByText('Test Product'));

    // expect().toBeInTheDocument(): Asserts that the description is now visible after the click.
    expect(screen.getByText(/This is a description for a test product\./i)).toBeInTheDocument();

    // fireEvent.click() again: Simulates clicking the title again to toggle the description off.
    fireEvent.click(screen.getByText('Test Product'));

    // expect().not.toBeInTheDocument(): Asserts that the description is no longer visible.
    expect(screen.queryByText(mockProduct.description)).not.toBeInTheDocument();
  });

  test('renders AddToCart button', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    // expect(screen.getByTestId('add-to-cart-button')).toBeInTheDocument():
    // screen.getByTestId(): Finds an element using its `data-testid` attribute.
    // This assertion checks if our mocked "Add to Cart" button is rendered.
    expect(screen.getByTestId('add-to-cart-button')).toBeInTheDocument();
    // expect(screen.getByText('Add to Cart Mock')).toBeInTheDocument():
    // Asserts that the button displays the correct mock text.
    expect(screen.getByText('Add to Cart Mock')).toBeInTheDocument();
  });
});

*/}