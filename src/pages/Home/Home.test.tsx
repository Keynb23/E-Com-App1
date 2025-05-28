import React from 'react';
// render: A function from @testing-library/react to render React components into a virtual DOM.
// screen: An object from @testing-library/react that provides queries to find elements rendered by `render`.
// waitFor: A utility from @testing-library/react to wait for asynchronous operations (like data fetching) to complete and UI to update.
import { render, screen, waitFor } from '@testing-library/react';
// QueryClient: The client that manages caching and fetching for React Query.
// QueryClientProvider: A context provider that makes the QueryClient available to all child components.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// ProductProvider: A context provider for your product-related state.
// useProductContext: A custom hook to access the product context.
import { ProductProvider, useProductContext } from '../../context/ProductContext';
// Home: The component being tested.
import Home from './Home';
// getFirestore, collection, getDocs: Functions from Firebase Firestore for database interaction.
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// Product: A type definition for your product data structure.
// Product: A type definition for your product data structure.
import type { Product } from '../../types/types';

// --- Mocking External Dependencies ---

// vi.mock('module-path', callback): This is Vitest's way of replacing a real module with a mock (fake) version.
// When 'firebase/firestore' is imported in `Home.tsx`, it will get these mocked functions instead of the real ones.
vi.mock('firebase/firestore', () => ({
  // getFirestore: vi.fn() creates a mock function. This means we can track if it was called, with what arguments,
  // and control its return value or throw errors during tests.
  getFirestore: vi.fn(),
  // collection: Mocked function for Firebase's collection reference.
  collection: vi.fn(),
  // getDocs: Mocked function for fetching documents from a collection.
  getDocs: vi.fn(),
}));

// Mock the ProductCard component: This replaces the actual ProductCard component
// with a simplified mock version to prevent rendering its full complexity and potential sub-dependencies,
// focusing the test on the Home component's behavior.
vi.mock('../../components/ProductCard/ProductCard', () => ({
  // default: Since ProductCard is likely exported as `export default ProductCard`,
  // we mock its default export. The mock just renders a simple div with the product title
  // and a `data-testid` for easy selection in tests.
  default: (props: { product: Product }) => (
    <div data-testid="mock-product-card">{props.product.title}</div>
  ),
}));

// Mock ProductContext: This is a more advanced mock for a context provider.
// It uses an async function to potentially import parts of the original module if needed.
vi.mock('../../context/ProductContext', async (importOriginal) => {
  // importOriginal: A Vitest utility function that allows us to import the actual, unmocked module.
  // This is useful if we want to mock only specific parts of a module.
  const actual = await importOriginal<typeof import('../../context/ProductContext')>();
  return {
    ...actual, // ...actual spreads all original exports from ProductContext,
               // ensuring any non-mocked exports still function as normal if Home component needs them.
    // useProductContext: We replace the real `useProductContext` hook with a mock function
    // that returns a predefined state. This isolates the `Home` component from the actual context logic.
    useProductContext: vi.fn(() => ({
      products: [], // Mock products state
      selectedCategory: '', // Mock selected category state
      dispatch: vi.fn(), // Mock the dispatch function for context actions
    })),
    // ProductProvider: We replace the real `ProductProvider` with a simple mock that just renders its children.
    // This allows the `Home` component to render inside the context without needing the actual context logic.
    ProductProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

// describe('Name of Component/Feature', callback): Groups related tests together.
// This block describes tests for the `Home` component.
describe('Home Component', () => {
  // queryClient: Declares a variable to hold an instance of QueryClient for React Query.
  let queryClient: QueryClient;

  // beforeEach(callback): This function runs before each `test` in this `describe` block.
  beforeEach(() => {
    // queryClient = new QueryClient(): Initializes a new QueryClient before each test.
    // This ensures tests are isolated and don't affect each other's cache.
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Prevents React Query from retrying failed queries during tests, speeding them up.
          staleTime: Infinity, // Prevents queries from becoming stale, avoiding re-fetches within a test.
        },
      },
    });

    // mockClear(): Resets all mock functions (`vi.fn()`) to their initial state,
    // clearing any call history (`.toHaveBeenCalled()`) or return values (`.mockReturnValue()`).
    // This is crucial for test isolation.
    (getFirestore as ReturnType<typeof vi.fn>).mockClear();
    (collection as ReturnType<typeof vi.fn>).mockClear();
    (getDocs as ReturnType<typeof vi.fn>).mockClear();
    (useProductContext as ReturnType<typeof vi.fn>).mockClear();
  });

  // afterEach(callback): This function runs after each `test` in this `describe` block.
  afterEach(() => {
    // queryClient.clear(): Clears the React Query cache after each test,
    // ensuring a clean state for subsequent tests.
    queryClient.clear();
  });

  // test('description of test', callback): Defines an individual test case.
  test('renders loading message initially', () => {
    // Mock getDocs to return a pending promise: This simulates a scenario where
    // data is still being fetched (promise hasn't resolved yet).
    (getDocs as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    // render(): Renders the Home component wrapped in necessary providers (QueryClientProvider, ProductProvider).
    // This sets up the component in a virtual DOM environment for testing.
    render(
      <QueryClientProvider client={queryClient}>
        <ProductProvider>
          <Home />
        </ProductProvider>
      </QueryClientProvider>
    );

    // expect(screen.getByText(/loading products and categories/i)).toBeInTheDocument():
    // screen.getByText(): Finds an element by its text content. The `/i` makes the search case-insensitive.
    // .toBeInTheDocument(): An `@testing-library/jest-dom` matcher that asserts the element is present in the DOM.
    // This checks if the loading state message is displayed when data is still loading.
    expect(screen.getByText(/loading products and categories/i)).toBeInTheDocument();
  });

  test('displays products after successful data fetch', async () => {
    // mockProducts: Defines an array of fake product data to be used in the test.
    const mockProducts = [
      { id: '1', title: 'Product A', price: 10, category: 'Electronics', image: 'a.jpg', brand: 'Brand A', description: 'Desc A', rating: { rate: 4.5, count: 100 } },
      { id: '2', title: 'Product B', price: 20, category: 'Clothing', image: 'b.jpg', brand: 'Brand B', description: 'Desc B', rating: { rate: 3.8, count: 50 } },
    ] as Product[];

    // mockResolvedValueOnce(): This is a mock function method that makes the mocked function
    // (getDocs in this case) return a resolved promise with the specified value, but only for the next call.
    // We call it twice because the `Home` component likely makes two `getDocs` calls: one for products and one for categories.
    (getDocs as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        docs: mockProducts.map(product => ({
          id: product.id,
          data: () => product, // Simulates Firebase document's `data()` method
        })),
      } as any)
      .mockResolvedValueOnce({
        docs: [
          { id: 'cat1', data: () => ({ category: 'Electronics' }) },
          { id: 'cat2', data: () => ({ category: 'Clothing' }) },
        ],
      } as any);

    // mockDispatch: Creates a mock function for the `dispatch` method of the product context.
    const mockDispatch = vi.fn();
    // mockReturnValue(): Makes the `useProductContext` hook return specific mock values for this test.
    (useProductContext as ReturnType<typeof vi.fn>).mockReturnValue({
      products: mockProducts, // The mock products should now be available in the context
      selectedCategory: '',
      dispatch: mockDispatch, // Our mock dispatch function
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProductProvider>
          <Home />
        </ProductProvider>
      </QueryClientProvider>
    );

    // await waitFor(): Waits for the DOM to update after asynchronous operations.
    // React Query and Context updates are asynchronous, so we wait for them to finish.
    await waitFor(() => {
      // expect(screen.getByText('Product A')).toBeInTheDocument():
      // Asserts that the product titles are displayed, indicating successful data fetching and rendering.
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
    });

    await waitFor(() => {
      // expect(mockDispatch).toHaveBeenCalledWith(): Asserts that the `dispatch` function
      // (from our mocked ProductContext) was called with the correct action and payload.
      // This confirms the `Home` component correctly updates the context with fetched products.
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PRODUCTS', payload: mockProducts });
    });
  });
});