import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, deleteUser } from 'firebase/auth';
import './profile.css';
import OrderHistory from './OrderHIstory';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('orderHistory');

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('User not found');
      return;
    }

    try {
      await updateProfile(user, { displayName });
      setSuccess('Profile updated successfully');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    setSuccess('');

    if (!user) {
      setError('User not found');
      return;
    }

    try {
      await deleteUser(user);
      setSuccess('Account deleted successfully');
      navigate('/goodbye'); // Redirect after deletion
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="Profile-Container">
      <nav className="Profile-Nav">
        <ul>
          <li>
            <a
              className={`profile-nav-link ${activeSection === 'home' ? 'active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('home');
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              className={`profile-nav-link ${activeSection === 'profile' ? 'active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('profile');
              }}
            >
              Profile
            </a>
          </li>
          <li>
            <a
              className={`profile-nav-link ${activeSection === 'orderHistory' ? 'active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('orderHistory');
              }}
            >
              Order History
            </a>
          </li>
          <li>
            <a
              className={`profile-nav-link ${activeSection === 'settings' ? 'active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('settings');
              }}
            >
              Settings
            </a>
          </li>
          <li>
            <a className="profile-nav-link" href="/logout">
              Logout
            </a>
          </li>
        </ul>
      </nav>

      {activeSection === 'home' && (
        <div className="profile-home">
          <h1>Welcome, {user?.displayName}!</h1>
        </div>
      )}

      {activeSection === 'profile' && (
        <div className="profile-form-container">
          <h1>Edit Profile</h1>
          <form onSubmit={handleUpdateProfile}>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Name"
            />
            <p>Email: {email}</p>

            <button className="update-btn" type="submit">Update Profile</button>

            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}

            <div>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="profile-deleteAccountButton"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      )}

      {activeSection === 'orderHistory' && (
        <div className="OH-container">
          <h1>Order History</h1>
          <OrderHistory />
        </div>
      )}

      {activeSection === 'settings' && (
        <div className="settings-container">
          <h1>Settings</h1>
          <a className="settings-tabs" href="/profile">Profile</a>
          <a className="settings-tabs" href="/theme">Theme</a>
          <a className="settings-tabs" href="/payment">Payment</a>
          <a className="settings-tabs" href="/general">General</a>
        </div>
      )}
    </div>
  );
};

export default Profile;
