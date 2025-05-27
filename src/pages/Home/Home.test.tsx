// src/pages/Home/Home.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react'; // Removed fireEvent as we won't interact much
import Home from './Home'; // Assuming Home.tsx is in the same directory
import '@testing-library/jest-dom';

// Mock react-router-dom hooks if Home component uses them (e.g., useNavigate, useLocation)
// This is a common pattern for pages that use routing.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep actual for other exports
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => <a href={to}>{children}</a>,
}));

// Mock any external hooks or components the Home page directly uses
// For example, if Home fetches products directly using useQuery, you'd mock that too:
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [], isLoading: false, error: null }), // Mock a successful empty product fetch
}));

describe('Home Page', () => {
  test('renders the main heading or a key piece of text', () => {
    render(<Home />);

    // Assuming your Home page has a prominent heading or specific text
    // Replace 'Welcome to Our E-Commerce Store' with actual text from your Home.tsx
    // For example, if you have an <h1>Welcome to Our Store!</h1>
    expect(screen.getByText(/Welcome to Our Store!/i)).toBeInTheDocument();
  });

  // You can add more simple rendering checks if needed
  test('renders navigation elements (if applicable)', () => {
    render(<Home />);
    // Example: if your Home page has a "Shop Now" button or link
    expect(screen.getByRole('link', { name: /shop now/i })).toBeInTheDocument();
  });
});