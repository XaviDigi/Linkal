import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

interface Startup {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  createdAt: Date; // Ensure you have createdAt in the type definition
}

const categoriesList = [
  'Technology',
  'Health',
  'Finance',
  'Education',
  'Social',
  'Travel',
  'E-commerce',
  'Real Estate',
  'Entertainment',
  'SaaS',
  'Website',
  'AI',
  'Others',
];

const StartupList: React.FC = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchStartups = async () => {
      const q = query(collection(db, 'startups'), orderBy('createdAt', 'desc')); // Order by createdAt
      const querySnapshot = await getDocs(q);
      const startupsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Startup[];

      setStartups(startupsData);
      setLoading(false);
    };

    fetchStartups();
  }, []);

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? startup.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Startups</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search startups..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Category List */}
      <div className="mb-4">
        <h3 className="text-xl text-blue-600 font-semibold">Categories</h3>
        
        <ul className="flex flex-wrap">
          
          {categoriesList.map((category) => (
            <li key={category} className="mr-4 mb-2">
              <button 
                onClick={() => setSelectedCategory(category)}
                className={`bg-indigo-200 text-indigo-800 rounded-full px-3 py-1 text-sm hover:bg-indigo-300 transition duration-200 ${selectedCategory === category ? 'font-bold' : ''}`}
              >
                {category}
              </button>
            </li>
          ))}
          {/* Clear Filter Button */}
          {selectedCategory && (
            <li className="mr-4 mb-2">
              <button 
                onClick={() => setSelectedCategory('')}
                className="bg-red-200 text-red-800 rounded-full px-3 py-1 text-sm hover:bg-red-300 transition duration-200"
              >
                Clear Filter
              </button>
            </li>
          )}
        </ul>
      </div>

      {loading ? (
        <div className="text-center text-lg text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => (
            <Link to={`/startups/${startup.id}`} key={startup.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
              {Array.isArray(startup.images) && startup.images.length > 0 && (
                <img src={startup.images[0]} alt={startup.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{startup.name}</h3>
                <p className="text-gray-700 mb-2">{startup.category}</p>
                <p className="text-sm text-gray-600">{startup.description.slice(0, 100)}...</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StartupList;
