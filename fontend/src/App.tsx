import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Offres from './pages/Offres';
import Profile from './pages/Profile';
import PublishOffer from './pages/PublishOffer';
import SearchOffer from './pages/SearchOffer';
import About from './pages/About';
import './index.css';

function App() {
  // État simulé de l'utilisateur connecté (passé au NavBar)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar isAuthenticated={isAuthenticated} onSignOut={() => setIsAuthenticated(false)} />

        {/* Routes de l'application */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/offres" element={<Offres />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/publish-offer" element={<PublishOffer />} />
          <Route path="/search-offer" element={<SearchOffer />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;