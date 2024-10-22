import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const categories = [
  'Technology', 'Health', 'Finance', 'Education', 'Social', 'Travel', 
  'E-commerce', 'Real Estate', 'Entertainment', 'SaaS', 'Website', 
  'AI', 'Others'
];

const AddStartup: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to add a startup.');
      return;
    }
    if (images.length > 3) {
      setError('You can only upload up to 3 images.');
      return;
    }

    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, `startups/${currentUser.uid}/${image.name}`);
          await uploadBytes(imageRef, image);
          return getDownloadURL(imageRef);
        })
      );

      await addDoc(collection(db, 'startups'), {
        name, description, category, website, location, teamSize, images: imageUrls,
        createdBy: currentUser.uid, creatorDisplayName: currentUser.displayName || '',
        createdAt: new Date(),
      });

      navigate('/startups');
    } catch (error) {
      setError('Failed to add startup. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-cyan-600 text-center mb-6">Add Your Startup</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-blue-700 mb-1">Startup Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your startup name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-medium text-blue-700 mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="Enter a brief description of your startup..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="category" className="block text-lg font-medium text-blue-700 mb-1">Category</label>
          <div className="overflow-y-auto max-h-40 border border-gray-300 rounded-lg shadow-sm p-2">
            {categories.map((cat) => (
              <div
                key={cat}
                className={`p-2 cursor-pointer rounded-md ${category === cat ? 'bg-indigo-200' : 'hover:bg-gray-100'}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-lg font-medium text-blue-700 mb-1">Website</label>
          <input
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-lg font-medium text-blue-700 mb-1">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label htmlFor="teamSize" className="block text-lg font-medium text-blue-700 mb-1">Team Size</label>
          <input
            type="number"
            id="teamSize"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter team size"
          />
        </div>

        <div>
          <label htmlFor="images" className="block text-lg font-medium text-blue-700 mb-1">Images</label>
          <input
            type="file"
            id="images"
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            multiple
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button 
  type="submit" 
  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg relative overflow-hidden transition duration-300 group"
>
  <span className="absolute inset-0 bg-yellow-300 rounded-lg opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out transform -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent to-red-600 mix-blend-overlay"></span>
  <span className="relative z-10">Add Startup</span>
</button>

      </form>
    </div>
  );
};

export default AddStartup;
