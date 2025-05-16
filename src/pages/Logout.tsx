import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase/firebase';

const Logout = () => {
  useEffect(() => {
    signOut(auth);
  }, []);

  return <div>
    <h1>Logging you out!</h1>
    <p>Goodbye!</p>
  </div>;
};
export default Logout;