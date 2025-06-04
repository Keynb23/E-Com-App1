import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // <--- IMPORTANT
import '@testing-library/jest-dom';
import Profile from './Profile';
import { useAuth } from '../context/AuthContext';
import { updateProfile, deleteUser } from 'firebase/auth';

// Mock the OrderHistory component
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

  it('shows the user displayName and email in Profile section', async () => {
    render(<Profile />);
    const user = userEvent.setup();

    // Simulate clicking the "Profile" nav link
    const profileNavLink = screen.getByRole('link', { name: /profile/i });
    await user.click(profileNavLink);

    // The displayName should be the value of the input
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    // The email should be in a paragraph
    expect(screen.getByText(/email:/i)).toHaveTextContent('Email: test@example.com');
  });
});