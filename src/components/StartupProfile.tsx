import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Facebook, Twitter, Linkedin, Instagram, Github, Youtube, FileText, MapPin, Users } from 'lucide-react';
import { FaTiktok, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Messaging from './Messaging';
import { X } from 'lucide-react'; // Added for close button

interface Startup {
  id: string;
  name: string;
  description: string;
  category: string;
  website: string;
  location: string;
  teamSize: string;
  images: string[];
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    github: string;
    youtube: string;
    tiktok: string;
    website: string;
    location: string;
  };
}

const StartupProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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
    <div className="container mx-auto p-6">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative h-64">
          <img
            src={startup.images[0] || '/placeholder.svg?height=256&width=768'}
            alt={startup.name}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openImageModal(startup.images[0])}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-center justify-center">
            <h2 className="text-4xl font-bold text-white text-center">{startup.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6 bg-gray-50">
          <div className="space-y-4 bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-gray-700">{startup.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="text-blue-500" />
                <span className="font-semibold">Category:</span>
                <span>{startup.category}</span>
              </div>

              {/* Social Links Section */}
              {startup.socialLinks && (
                <div className="space-y-4 flex flex-col items-start">
                  <h3 className="font-semibold text-lg"></h3>
                  <div className="flex flex-col space-y-2">
                    {Object.entries(startup.socialLinks).map(([platform, url]) =>
                      url ? (
                        <div key={platform} className="flex items-center space-x-2 p-2 border rounded-lg shadow hover:bg-gray-100 transition w-64">
                          {platform === 'facebook' && <Facebook className="w-6 h-6 text-blue-600" />}
                          {platform === 'twitter' && <Twitter className="w-6 h-6 text-blue-400" />}
                          {platform === 'linkedin' && <Linkedin className="w-6 h-6 text-blue-700" />}
                          {platform === 'instagram' && <Instagram className="w-6 h-6 text-pink-600" />}
                          {platform === 'github' && <Github className="w-6 h-6" />}
                          {platform === 'youtube' && <Youtube className="w-6 h-6 text-red-600" />}
                          {platform === 'tiktok' && <FaTiktok className="w-6 h-6 text-black" />}
                          {platform === 'website' && <FaGlobe className="w-6 h-6 text-green-600" />}
                          {platform === 'location' && <FaMapMarkerAlt className="w-6 h-6 text-red-600" />}
                          <span className="text-blue-500 hover:text-blue-700 text-center flex-1">
                            <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize">
                              {platform}
                            </a>
                          </span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
          
              </div>
            </div>

            <div className="space-y-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Additional Images</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {startup.images.slice(1, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Additional Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow cursor-pointer"
                      onClick={() => openImageModal(image)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={closeImageModal}>
          <img
            src={selectedImage || ''}
            alt="Full View"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition" onClick={closeImageModal}>
            <X size={24} />
          </button>
        </div>
      )}

      {isMessagingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition" onClick={closeMessaging}>
              <X size={24} />
            </button>
            
            <Messaging userId={startup.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StartupProfile;
