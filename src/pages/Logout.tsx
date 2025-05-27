import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import './register.css';

const Logout = () => {
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/'); 
      } catch (error) {
        console.error("Error during logout:", error);
        navigate('/login?error=logout_failed'); 
      }
    };

    handleLogout();
  }, [navigate]); 

  return (
    <div className="Logout-message">
      <h1>Logging you out!</h1>
      <p>Goodbye!</p>
    </div>
  );
};

export default Logout;