import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Button from './components/ui/Button';
import { UserIcon, UserPlusIcon } from 'lucide-react';
import MenuBurger from './components/MenuBurger';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Offres from './pages/Offres';
import Profile from './pages/Profile';
import PublishOffer from './pages/PublishOffer';
import SearchOffer from './pages/SearchOffer';

function App() {
  // État simulé de l'utilisateur connecté
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">JobFinder Bénin</span>
              </div>
              <div className="flex items-center space-x-4">
                <MenuBurger />
                {!isAuthenticated ? (
                  <>
                    {/* Boutons de connexion et d'inscription si non connecté */}
                    <Button variant="outline" className="flex items-center">
                      <UserIcon className="h-5 w-5 mr-2" />
                      <Link to="/login">Se connecter</Link>
                    </Button>
                    <Button className="flex items-center">
                      <UserPlusIcon className="h-5 w-5 mr-2" />
                      <Link to="/register">S'inscrire</Link>
                    </Button>
                  </>
                ) : (
                  // Ici, tu peux afficher des liens supplémentaires pour les utilisateurs connectés si nécessaire
                  <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
                    Se déconnecter
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Routes de l'application */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/offres" element={<Offres />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} /> {/* Page d'accueil ou autre */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/publish-offer" element={<PublishOffer />} />
          <Route path="/search-offer" element={<SearchOffer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
