import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './register.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const {user} = useAuth()

  const navigate = useNavigate();

  useEffect(()=>{
    if(user) {
      navigate('/profile')
    }
  },[user, navigate])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigate('/profile');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className='form-container'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className='error'>{error}</p>}
        <fieldset>
          <legend>Login</legend>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" type='submit'>Login</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;