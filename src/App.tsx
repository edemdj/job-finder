import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Button from './components/ui/Button';
import { UserIcon, UserPlusIcon } from 'lucide-react'; 
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
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
                {/* Boutons de connexion et inscription avec redirection */}
                <Button variant="outline" className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" /> 
                  <Link to="/login">Se connecter</Link>
                </Button>
                <Button className="flex items-center">
                  <UserPlusIcon className="h-5 w-5 mr-2" /> 
                  <Link to="/register">S'inscrire</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Routes de l'application */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} /> {/* Page d'accueil ou autre */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
