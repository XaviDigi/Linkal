import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ScrollingLogos from '../components/ScrollingLogos';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import GoogleLogo from '/images/google-logo.svg'; // Ensure this path is correct

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Google provider setup
  const provider = new GoogleAuthProvider();

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(getAuth(), provider);
      // You might want to navigate to a different page after login
    } catch (error) {
      console.error('Failed to log in with Google:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 flex flex-col">
      <h1 className="text-4xl md:text-5xl text-blue-600 font-extrabold mb-6 text-center">
        Welcome to{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-yellow-500 to-red-500">
          Linkal
        </span>
      </h1>

      <p className="text-lg md:text-xl font-semibold text-gray-800 mb-10 text-center">
        Ignite your startup's potential and forge valuable connections within the vibrant entrepreneurial community!
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-12">
        <Link
          to="/startups"
          className="explore-startups bg-blue-600 text-white font-medium px-6 py-3 md:px-8 md:py-4 rounded-lg shadow-lg hover:bg-red-500 transition-transform transform hover:scale-105"
        >
          Explore Startups
        </Link>
        {!isLoggedIn && (
          <>
            <Link
              to="/signup"
              className="join-now bg-white text-blue-600 font-medium px-6 py-3 md:px-8 md:py-4 rounded-lg border border-blue-600 shadow-lg hover:bg-yellow-50 transition-transform transform hover:scale-105"
            >
              Join Now
            </Link>
            <button
              onClick={handleGoogleLogin}
              className=" flex items-center justify-center bg-white text-blue-600 ont-medium px-6 py-3 md:px-8 md:py-4 rounded-lg border border-blue-600 shadow-lg hover:bg-blue-100 transition duration-300"
            >
              <img src={GoogleLogo} alt="Google Logo" className="w-7 h-7 mr-2" /> {/* Google logo */}
              Sign in
            </button>
          </>
        )}
      </div>

      {/* Grid of services */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 mt-12">
        <div className="service-item bg-white p-6 md:p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <Rocket className="mx-auto mb-4 text-yellow-500" size={48} />
          <h2 className="text-xl md:text-2xl font-semibold mb-2 text-red-600">Launch Your Idea</h2>
          <p className="text-gray-600">Share your startup with a community of entrepreneurs and investors.</p>
        </div>

        <div className="service-item bg-white p-6 md:p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <Rocket className="mx-auto mb-4 text-yellow-500" size={48} />
          <h2 className="text-xl md:text-2xl font-semibold mb-2 text-red-600">Connect</h2>
          <p className="text-gray-600">Network with like-minded individuals and potential collaborators.</p>
        </div>

        <div className="service-item bg-white p-6 md:p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <Rocket className="mx-auto mb-4 text-yellow-500" size={48} />
          <h2 className="text-xl md:text-2xl font-semibold mb-2 text-red-600">Grow</h2>
          <p className="text-gray-600">Get feedback, find resources, and accelerate your startup's growth.</p>
        </div>
      </div>

      <div className="mt-10">
        <ScrollingLogos />
      </div>
    </div>
  );
};

export default Home;
