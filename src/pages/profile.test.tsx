import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import { useAuth } from '../context/AuthContext';
import { updateProfile, deleteUser } from 'firebase/auth';

// Mock the OrderHistory component (match the import in Profile)
jest.mock('./OrderHIstory', () => () => <div data-testid="order-history">Order History</div>);

// Mock firebase/auth functions
jest.mock('firebase/auth', () => ({
  updateProfile: jest.fn(),
  deleteUser: jest.fn(),
}));

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Profile component', () => {
  const mockUser = {
    displayName: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (updateProfile as jest.Mock).mockClear();
    (deleteUser as jest.Mock).mockClear();
    mockNavigate.mockClear();
  });

  it('renders order history by default', () => {
    render(<Profile />);
    // Checks for the mocked OrderHistory component
    expect(screen.getByTestId('order-history')).toBeInTheDocument();
    // Checks for the section heading
    expect(screen.getByRole('heading', { name: /order history/i })).toBeInTheDocument();
    // Checks for the nav link (optional)
    expect(screen.getByRole('link', { name: /order history/i })).toHaveClass('active');
  });
});