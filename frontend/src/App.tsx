import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// Utiliser le composant qui fetch l'API (liste)
import Offers from './pages/Offers';
import OfferDetail from './pages/OfferDetail'; // <-- nouveau
import Profile from './pages/Profile';
import PublishOffer from './pages/PublishOffer';
import SearchOffer from './pages/SearchOffer';
import About from './pages/About';
import ApplicationsList from './pages/ApplicationsList';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar isAuthenticated={isAuthenticated} onSignOut={() => setIsAuthenticated(false)} />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/offres" element={<Offers />} />
          <Route path="/offres/:id" element={<OfferDetail />} /> {/* route détail */}
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/publish-offer" element={<PublishOffer />} />
          <Route path="/search-offer" element={<SearchOffer />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/applications" element={<ApplicationsList />} />
          <Route path="/recruiter/applications" element={<ApplicationsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;