import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from './ProductCard';
import type { Product } from '../../types/types';

//  Mock modules with inline component definitions
jest.mock('@smastrom/react-rating', () => ({
  Rating: ({ value, style, readOnly }: any) => (
    <div
      data-testid="mock-rating"
      data-value={value}
      data-style-maxwidth={style?.maxWidth}
      data-readonly={readOnly?.toString()}
    >
      Rating: {value}
    </div>
  ),
}));

jest.mock('../ui/button/CartButtons', () => ({
  AddToCart: ({ product }: any) => (
    <button data-testid="mock-add-to-cart">Add {product.title} to Cart</button>
  ),
}));

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '1',
    title: 'Test Product',
    description: 'A test product',
    image: 'test.jpg',
    price: 9.99,
    rating: { rate: 4.5, count: 10 },
    category: 'Test Category',
 brand: 'Test Brand',
  };

  it('renders product title and price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });
});
