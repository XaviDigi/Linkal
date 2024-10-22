import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, signOut } from '../firebase'; // Import signOut from firebase
import { User, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>; // Add the logout function type
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, logout: async () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth); // Use signOut to log the user out
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
