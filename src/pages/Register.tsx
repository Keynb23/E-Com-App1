import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase/firebase'; 
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'; 
import './register.css'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const db = getFirestore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); 

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user; 

      await updateProfile(user, {
        displayName: displayName,
      });


      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: Timestamp.now(), 

      });

      navigate('/profile');
    } catch (error: any) {
      console.error("Error during registration:", error);
      setError(error.message);
    }
  };

  return (
    <div className='form-container'>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className='error'>{error}</p>}
        <fieldset>
          <legend>Register</legend>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='text'
            placeholder='Name'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6} 
          />
          <button type='submit'>Register</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Register;