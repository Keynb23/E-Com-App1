import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase/firebase';
import "../styles/auth-styles.css"
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      // Create user with email and password using firebase auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Update user profile with displayName after user is created
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });
      navigate('/profile');
    } catch (error: any) {
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
          />
          <input
            type='text'
            placeholder='Name'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit'>Register</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Register;