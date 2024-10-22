import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-black shadow-lg mt-10 py-6">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/images/Linkal.png" // Update the path to your logo
            alt="Linkal Logo"
            className="h-10"
          />
        </Link>

      
        <p className="text-center text-gray-600">
          Made by{' '}
          <a 
            href="https://www.xavidigi.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 transition duration-300"
          >
            XaviDigital
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
