import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import './register.css';

// Logout
const Logout = () => {
  const navigate = useNavigate();

  // useEffect for handling logout
  useEffect(() => {
    // handleLogout
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/');
      } catch (error) {
        console.error("Error during logout:", error);
        navigate('/login?error=logout_failed');
      }
    };
    // This asynchronous function attempts to sign out the current user from Firebase.
    // If successful, it navigates the user to the home page; otherwise, it logs an error and redirects to the login page with an error parameter.

    handleLogout();
  }, [navigate]);
  // This effect hook runs once when the component mounts. It immediately calls `handleLogout` to sign out the user and redirects them.
  // The `Maps` dependency ensures the effect reacts if the navigation function itself changes, though this is rare.

  return (
    <div className="Logout-message">
      <h1>Logging you out!</h1>
      <p>Goodbye!</p>
    </div>
  );
};

export default Logout;