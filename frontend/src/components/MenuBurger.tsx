import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Briefcase, PlusCircle, LogIn, Edit } from 'lucide-react';

const MenuBurger = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Bouton pour ouvrir/fermer le menu */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <User className="h-5 w-5 mr-2" />
            Profil
          </Link>
          <Link
            to="/publish-offer"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Publier une offre
          </Link>
          <Link
            to="/search-offer"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <Edit className="h-5 w-5 mr-2" />
            Rechercher des offres
          </Link>
          <Link
            to="/login"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Se connecter
          </Link>
          <Link
            to="/register"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <User className="h-5 w-5 mr-2" />
            S'inscrire
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuBurger;
