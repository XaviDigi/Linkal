import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase'; 
import { doc, setDoc, getDoc } from 'firebase/firestore';
import GoogleLogo from '/images/google-logo.svg';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); 
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const provider = new GoogleAuthProvider();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if the username already exists
      const userDoc = doc(db, 'users', username);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        setError('Username already exists. Please choose another one.');
        return; 
      }

      // Create user with email and password
      await createUserWithEmailAndPassword(auth, email, password);

      // Use the username as the document ID in Firestore
      await setDoc(userDoc, {
        username,
        email,
        createdAt: new Date(),
      });

      navigate('/'); // Navigate after successful signup
    } catch (error: unknown) {
      console.error("Error creating account:", error);
      setError('Failed to create an account. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error: unknown) { 
      console.error("Google login failed:", error instanceof Error ? error.message : error);
      setError('Failed to log in with Google.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
          Sign Up
        </button>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-white text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition duration-300"
          >
            <img src={GoogleLogo} alt="Google Logo" className="w-5 h-5 mr-2" /> {/* Google logo */}
            Sign in with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
