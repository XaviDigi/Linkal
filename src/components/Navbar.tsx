import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Rocket } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white text-black shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Rocket size={30} color="#6b5c4a" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-yellow-500 to-red-500 text-3xl font-bold">
            Linkal
          </span>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            to="/startups"
            className="text-indigo-600 relative hover:text-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 before:content-[''] before:absolute before:h-[2px] before:w-0 before:left-0 before:bottom-0 hover:before:w-full before:bg-gradient-to-r before:from-blue-600 before:via-yellow-500 before:to-red-500 before:transition-all before:duration-300"
          >
            Startups
          </Link>
          <Link
            to="/profile"
            className="text-indigo-600 relative hover:text-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 before:content-[''] before:absolute before:h-[2px] before:w-0 before:left-0 before:bottom-0 hover:before:w-full before:bg-gradient-to-r before:from-blue-600 before:via-yellow-500 before:to-red-500 before:transition-all before:duration-300"
          >
            Profile
          </Link>
          {currentUser ? (
            <Link
              to="/add-startup"
              className="text-indigo-600 relative hover:text-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 before:content-[''] before:absolute before:h-[2px] before:w-0 before:left-0 before:bottom-0 hover:before:w-full before:bg-gradient-to-r before:from-blue-600 before:via-yellow-500 before:to-red-500 before:transition-all before:duration-300"
            >
              Add Startup
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-indigo-600 relative hover:text-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 before:content-[''] before:absolute before:h-[2px] before:w-0 before:left-0 before:bottom-0 hover:before:w-full before:bg-gradient-to-r before:from-blue-600 before:via-yellow-500 before:to-red-500 before:transition-all before:duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-indigo-600 relative hover:text-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 before:content-[''] before:absolute before:h-[2px] before:w-0 before:left-0 before:bottom-0 hover:before:w-full before:bg-gradient-to-r before:from-blue-600 before:via-yellow-500 before:to-red-500 before:transition-all before:duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col space-y-2 px-6 py-4">
            <Link
              to="/startups"
              className="text-indigo-600 relative hover:text-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 before:content-[''] before:absolute before:h-[2px] before:w-0 before:left-0 before:bottom-0 hover:before:w-full before:bg-gradient-to-r before:from-blue-600 before:via-yellow-500 before:to-red-500 before:transition-all before:duration-300"
              onClick={toggleMenu} // Close menu on item click
            >
              Startups
            </Link>
            <Link
              to="/profile"
              className="text-indigo-600 relative hover:text-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 before:content-[''] before:absolute before:h-[2px] before:w-0 before:left-0 before:bottom-0 hover:before:w-full before:bg-gradient-to-r before:from-blue-600 before:via-yellow-500 before:to-red-500 before:transition-all before:duration-300"
              onClick={toggleMenu} // Close menu on item click
            >
              Profile
            </Link>
            {currentUser ? (
              <Link
                to="/add-startup"
                className="text-indigo-600 relative hover:text-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 before:content-[''] before:absolute before:h-[2px] before:w-0 before:left-0 before:bottom-0 hover:before:w-full before:bg-gradient-to-r before:from-blue-600 before:via-yellow-500 before:to-red-500 before:transition-all before:duration-300"
                onClick={toggleMenu} // Close menu on item click
              >
                Add Startup
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-indigo-600 relative hover:text-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 before:content-[''] before:absolute before:h-[2px] before:w-0 before:left-0 before:bottom-0 hover:before:w-full before:bg-gradient-to-r before:from-blue-600 before:via-yellow-500 before:to-red-500 before:transition-all before:duration-300"
                  onClick={toggleMenu} // Close menu on item click
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-indigo-600 relative hover:text-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 before:content-[''] before:absolute before:h-[2px] before:w-0 before:left-0 before:bottom-0 hover:before:w-full before:bg-gradient-to-r before:from-blue-600 before:via-yellow-500 before:to-red-500 before:transition-all before:duration-300"
                  onClick={toggleMenu} // Close menu on item click
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
