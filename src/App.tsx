import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AddStartup from './pages/AddStartup';
import Footer from './components/Footer';
import StartupList from './pages/StartupList';
import Profile from './pages/Profile'; 
import { AuthProvider, useAuth } from './contexts/AuthContext';
import StartupProfile from './components/StartupProfile';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex flex-col">
       
    

        
          <Navbar />
          

          <div className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/add-startup" element={<PrivateRoute><AddStartup /></PrivateRoute>} />
              <Route path="/startups" element={<StartupList />} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/startups/:id" element={<StartupProfile />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
