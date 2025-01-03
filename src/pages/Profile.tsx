import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';


type Startup = {
  id: string;
  name: string;
 
};

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error('Failed to log out');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this startup?');
    if (confirmDelete) {
      await deleteDoc(doc(db, 'startups', id));
      setStartups(startups.filter(startup => startup.id !== id));
    }
  };

  useEffect(() => {
    const fetchStartups = async () => {
      if (currentUser) {
        const q = query(
          collection(db, 'startups'),
          where('createdBy', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const startupsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name, 
        }));

        setStartups(startupsData);
      }
    };

    fetchStartups();
  }, [currentUser]);

  if (!currentUser) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Your Profile</h2>
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <p className="text-lg font-medium">
          <span className="text-gray-600">Email:</span> {currentUser.email}
        </p>
        <p className="text-lg font-medium">
          <span className="text-gray-600">Username:</span> {currentUser.displayName || 'N/A'}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Startups</h3>
        <ul className="space-y-2">
          {startups.length > 0 ? (
            startups.map(startup => (
              <li key={startup.id} className="bg-gray-100 p-3 rounded-md shadow-sm hover:bg-gray-200 transition flex justify-between items-center">
                <Link to={`/startups/${startup.id}`} className="text-blue-500 hover:underline text-lg">
                  {startup.name}
                </Link>
                <div className="flex space-x-2">
                  {/* <Link to={`/edit-startup/${startup.id}`} className="text-blue-500 hover:underline">
                    Edit
                  </Link> */}
                  <button
                    onClick={() => handleDelete(startup.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500">You haven't created any startups yet.</li>
          )}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-all duration-300 shadow-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
