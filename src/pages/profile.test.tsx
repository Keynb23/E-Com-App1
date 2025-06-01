import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Ensure this is imported for toBeInTheDocument()
import Profile from './Profile';
import { useAuth } from '../context/AuthContext';
import { updateProfile, deleteUser } from 'firebase/auth';

// Mock the OrderHistory component (since it's not under test here)
// FIX: Correct the import path and spelling to match the actual file name!
jest.mock('./OrderHistory', () => () => <div data-testid="order-history">Order History</div>);

// Mock firebase/auth functions
jest.mock('firebase/auth', () => ({
  updateProfile: jest.fn(),
  deleteUser: jest.fn(),
}));

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
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
  });

    // Test that the profile form renders with the correct user data and order history

  it('renders profile form with user data', () => {
    render(<Profile />);
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('order-history')).toBeInTheDocument();
  });

  // Test that updating the profile successfully shows a success message

  it('updates profile successfully', async () => {
    (updateProfile as jest.Mock).mockResolvedValueOnce(undefined);

    render(<Profile />);
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

    // Test that an error is shown if updating the profile fails

  it('shows error if update profile fails', async () => {
    (updateProfile as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

    render(<Profile />);
    fireEvent.click(screen.getByText('Update Profile'));

    expect(await screen.findByText('Update failed')).toBeInTheDocument();
  });

    // Test that deleting the account successfully shows a success message

  it('deletes account successfully', async () => {
    (deleteUser as jest.Mock).mockResolvedValueOnce(undefined);

    render(<Profile />);
    const deleteButton = screen.getByText('Delete Account');
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(deleteUser).toHaveBeenCalledWith(mockUser)
    );

    expect(await screen.findByText('Account deleted successfully')).toBeInTheDocument();
  });

    // Test that an error is shown if deleting the account fails

  it('shows error if delete account fails', async () => {
    (deleteUser as jest.Mock).mockRejectedValueOnce(new Error('Delete failed'));

    render(<Profile />);
    fireEvent.click(screen.getByText('Delete Account'));

    expect(await screen.findByText('Delete failed')).toBeInTheDocument();
  });

    // Test that an error is shown if no user exists when updating the profile

  it('shows error if no user on update', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    render(<Profile />);
    fireEvent.click(screen.getByText('Update Profile'));

    expect(await screen.findByText('User not found')).toBeInTheDocument();
  });

    // Test that an error is shown if no user exists when deleting the account

  it('shows error if no user on delete', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    render(<Profile />);
    fireEvent.click(screen.getByText('Delete Account'));

    expect(await screen.findByText('User not found')).toBeInTheDocument();
  });
});