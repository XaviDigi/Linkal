import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaRegEnvelope, FaGlobe, FaUsers, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Messaging from './Messaging';

interface Startup {
  id: string;
  name: string;
  description: string;
  category: string;
  website: string;
  location: string;
  teamSize: string;
  images: string[];
}

const StartupProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // State for image modal
  const [isImageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMessagingOpen, setMessagingOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchStartup = async () => {
      const startupDoc = doc(db, 'startups', id);
      const startupSnap = await getDoc(startupDoc);
      if (startupSnap.exists()) {
        setStartup({ id: startupSnap.id, ...startupSnap.data() } as Startup);
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };

    fetchStartup();
  }, [id]);

  const handleMessageButtonClick = () => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setMessagingOpen(true);
    }
  };

  const openImageModal = (image: string) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  const closeMessaging = () => {
    setMessagingOpen(false);
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-500">Loading...</div>;
  }

  if (!startup) {
    return <div className="text-center text-xl text-red-500">Startup not found!</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">{startup.name}</h2>
      
      {startup.images && startup.images.length > 0 && (
        <img 
          src={startup.images[0]} 
          alt={startup.name} 
          className="w-full h-64 object-cover rounded-lg mb-4 cursor-pointer shadow transition-transform transform hover:scale-105"
          onClick={() => openImageModal(startup.images[0])}
        />
      )}

      <div className="px-4 mb-4 space-y-3">
        <div className="flex items-center mb-2">
          <FaClipboardList className="text-blue-500 mr-2" />
          <p className="text-gray-700"><strong>Category:</strong> {startup.category}</p>
        </div>
        <div className="flex items-center mb-2">
          <FaRegEnvelope className="text-blue-500 mr-2" />
          <p className="text-gray-700"><strong>Description:</strong> {startup.description}</p>
        </div>
        <div className="flex items-center mb-2">
          <FaGlobe className="text-blue-500 mr-2" />
          <p className="text-gray-700"><strong>Website:</strong> 
            <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">{startup.website}</a>
          </p>
        </div>
        <div className="flex items-center mb-2">
          <FaMapMarkerAlt className="text-blue-500 mr-2" />
          <p className="text-gray-700"><strong>Location:</strong> {startup.location}</p>
        </div>
        <div className="flex items-center mb-4">
          <FaUsers className="text-blue-500 mr-2" />
          <p className="text-gray-700"><strong>Team Size:</strong> {startup.teamSize}</p>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={handleMessageButtonClick}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-200 flex items-center transform hover:scale-105"
        >
          <FaRegEnvelope className="mr-2" /> Message
        </button>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={closeImageModal}>
          <img 
            src={selectedImage || ''} 
            alt="Full View" 
            className="max-w-full max-h-full cursor-auto shadow-lg"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* Messaging Window */}
      {isMessagingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition" onClick={closeMessaging}>
              &times;
            </button>
            <h4 className="text-xl font-bold mb-4 text-gray-800">Chat with {startup.name}</h4>
            <Messaging userId={startup.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StartupProfile;
