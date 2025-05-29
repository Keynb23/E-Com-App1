import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../components/Cart/Cart';
import configureStore from 'redux-mock-store';
import AuthContext from '../context/AuthContext';

const mockStore = configureStore([]);
const mockDispatch = vi.fn();

// Mock child components and hooks for isolation
vi.mock('../components/ui/button/CartButtons', () => ({
  IncrementButton: () => <button>Increment</button>,
  ClearCart: () => <button>Clear Cart</button>,
  AddToCart: () => <buttton>Add To Cart</buttton>,
}));
vi.mock('@smastrom/react-rating', () => ({
  Rating: () => <div data-testid="rating" />,
}));
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [{ id: 99, title: 'Recommended Product', price: 50, category: 'electronics', image: 'img', rating: { rate: 4.5, count: 20 } }], isLoading: false }),
}));
vi.mock('react-redux', async () => {
  const actual = await vi.importActual<typeof import('react-redux')>('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch as any, // Cast to any to satisfy type checking
    useSelector: vi.fn((fn) => fn({ cart: { items: mockCartItems, totalItems: mockCartItems.length, totalPrice: mockCartItems.reduce((sum, i) => sum + i.price * i.quantity, 0) } })),
  };
});

// Shared mock data
const mockCartItems = [
  { id: 1, title: 'Test Product', price: 10, image: 'test.jpg', quantity: 2, category: 'electronics' },
];

// Helper to render with providers
function renderWithProviders(ui: React.ReactElement, { cartItems = mockCartItems, user = { uid: 'abc123' } }: { cartItems?: any; user?: any } = {}) {
  const store = mockStore({
    cart: {
      items: cartItems,
      totalItems: cartItems.length,
      totalPrice: cartItems.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0),
    },
  });
  return render(
    <Provider store={store}>
      <AuthContext.Provider value={{ user }}>
        {ui}
      </AuthContext.Provider>
    </Provider>
  );
}

// ========================
// UNIT TEST 1: Empty Cart
// ========================
it('renders empty cart message when cart is empty', () => {
  renderWithProviders(<Cart />, { cartItems: [], user: { uid: 'abc123' } });

  expect(screen.getByText(/your cart is currently empty/i)).toBeInTheDocument();
});

// ========================
// UNIT TEST 2: Remove Item
// ========================
it('dispatches removeItemFromCart when "Remove" is clicked', () => {
  renderWithProviders(<Cart />);
  const removeButton = screen.getByText(/remove/i);

  fireEvent.click(removeButton);

  // Should call dispatch with an action containing type 'cart/removeItemFromCart'
  expect(mockDispatch).toHaveBeenCalled();
  const dispatchedAction = mockDispatch.mock.calls[0][0];
  expect(dispatchedAction.type).toMatch(/removeItemFromCart/);
});

// ========================
// INTEGRATION TEST: Checkout
// ========================
it('shows error if checkout is clicked while not logged in', () => {
  renderWithProviders(<Cart />, { user: null }); // Not logged in

  const checkoutBtn = screen.getByRole('button', { name: /checkout/i });
  fireEvent.click(checkoutBtn);

  expect(screen.getByText(/you must be logged in/i)).toBeInTheDocument();
});