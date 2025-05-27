// components/ProductCard/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
import '@testing-library/jest-dom'; // For extended matchers like .toBeInTheDocument()

// Mock the AddToCart component to simplify testing ProductCard
jest.mock('../ui/button/CartButtons', () => ({
  AddToCart: jest.fn(({ product }) => (
    <button data-testid="mock-add-to-cart-button">Add {product.title} to Cart</button>
  )),
}));

const mockProduct = {
  id: '1',
  title: 'Test Product Title',
  category: 'Electronics',
  price: 99.99,
  image: 'https://placehold.co/150x150',
  description: 'This is a very long description for the test product that should be truncated initially.',
  rating: { rate: 4.5, count: 120 },
  brand: 'TestBrand',
};

describe('ProductCard', () => {
  test('renders product details correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product T...')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product Title')).toBeInTheDocument();
    expect(screen.getByTestId('mock-add-to-cart-button')).toBeInTheDocument(); // Check for the mocked button
  });

  test('truncates long title and description initially', () => {
    render(<ProductCard product={mockProduct} />);

    // Title truncation (based on your code: title.length > 15)
    expect(screen.getByText('Test Product T...')).toBeInTheDocument();

    // Description should NOT be visible initially
    expect(screen.queryByText(/This is a very long description/i)).not.toBeInTheDocument();
  });

  test('toggles description visibility on click', () => {
    render(<ProductCard product={mockProduct} />);

    const productCardElement = screen.getByText('Test Product T...').closest('.product-card');
    expect(productCardElement).toBeInTheDocument();

    // Click to show description
    fireEvent.click(productCardElement!);
    expect(screen.getByText('This is a very long description for the test product that should be truncated initially.')).toBeInTheDocument();

    // Click again to hide description
    fireEvent.click(productCardElement!);
    expect(screen.queryByText(/This is a very long description/i)).not.toBeInTheDocument();
  });
});