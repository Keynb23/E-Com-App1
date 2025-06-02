import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  it('navigates between sections and renders profile form', () => {
    render(<Profile />);
    fireEvent.click(screen.getByText('Profile'));
    expect(screen.getByRole('heading', { name: /Edit Profile/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
  });

  it('shows welcome message in home section', () => {
    render(<Profile />);
    fireEvent.click(screen.getByText('Home'));
    expect(screen.getByText('Welcome, Test User!')).toBeInTheDocument();
  });

  it('renders settings section', () => {
    render(<Profile />);
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByRole('heading', { name: /Settings/i })).toBeInTheDocument();
    // Instead of getByText, use getAllByText to handle multiples
    const profileLinks = screen.getAllByText('Profile');
    expect(profileLinks.length).toBeGreaterThan(1); // nav and tab
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('updates profile successfully', async () => {
    (updateProfile as jest.Mock).mockResolvedValueOnce(undefined);

    render(<Profile />);
    fireEvent.click(screen.getByText('Profile'));
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    const updateButton = screen.getByText('Update Profile');
    fireEvent.click(updateButton);

    await waitFor(() =>
      expect(updateProfile).toHaveBeenCalledWith(
        mockUser,
        expect.objectContaining({ displayName: 'New Name' })
      )
    );

    expect(await screen.findByText('Profile updated successfully')).toBeInTheDocument();
  });

  it('shows error if update profile fails', async () => {
    (updateProfile as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

    render(<Profile />);
    fireEvent.click(screen.getByText('Profile'));
    fireEvent.click(screen.getByText('Update Profile'));

    expect(await screen.findByText('Update failed')).toBeInTheDocument();
  });

  it('deletes account successfully and navigates', async () => {
    (deleteUser as jest.Mock).mockResolvedValueOnce(undefined);

    render(<Profile />);
    fireEvent.click(screen.getByText('Profile'));
    const deleteButton = screen.getByText('Delete Account');
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(deleteUser).toHaveBeenCalledWith(mockUser)
    );

    expect(await screen.findByText('Account deleted successfully')).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/goodbye');
  });

  it('shows error if delete account fails', async () => {
    (deleteUser as jest.Mock).mockRejectedValueOnce(new Error('Delete failed'));

    render(<Profile />);
    fireEvent.click(screen.getByText('Profile'));
    fireEvent.click(screen.getByText('Delete Account'));

    expect(await screen.findByText('Delete failed')).toBeInTheDocument();
  });

  it('shows error if no user on update', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    render(<Profile />);
    fireEvent.click(screen.getByText('Profile'));
    fireEvent.click(screen.getByText('Update Profile'));

    expect(await screen.findByText('User not found')).toBeInTheDocument();
  });

  it('shows error if no user on delete', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    render(<Profile />);
    fireEvent.click(screen.getByText('Profile'));
    fireEvent.click(screen.getByText('Delete Account'));

    expect(await screen.findByText('User not found')).toBeInTheDocument();
  });
});