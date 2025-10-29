import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Briefcase, PlusCircle, LogIn, Edit } from 'lucide-react';
import { createPortal } from 'react-dom';

/**
 * MenuBurger - affichage du bouton + dropdown.
 * Le dropdown est rendu via un portail (createPortal) dans document.body.
 * Avantage: il ne sera pas masqué par overflow:hidden ou par des stacking contexts
 * créés par des parents (comme le conteneur image avec overflow-hidden).
 */
const MenuBurger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Calcule la position du dropdown en fonction du bouton
  const updateCoords = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 8, // petit offset sous le bouton
      left: rect.right + window.scrollX - 192, // 192 = largeur du dropdown (w-48)
    });
  };

  // Mettre à jour quand on ouvre et au redimensionnement / scroll
  useEffect(() => {
    if (isOpen) updateCoords();
    const onResize = () => isOpen && updateCoords();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [isOpen]);

  // Fermer au clic à l'extérieur (simplifié)
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!btnRef.current) return;
      const target = e.target as Node;
      if (btnRef.current.contains(target)) return;
      setIsOpen(false);
    };
    if (isOpen) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [isOpen]);

  // Dropdown rendu dans body pour éviter d'être coupé / masqué
  const dropdown = (
    <div
      style={{ position: 'absolute', top: coords.top, left: coords.left, width: 192 }}
      className="z-60 bg-white rounded-lg shadow-lg ring-1 ring-black/5"
      role="menu"
    >
      <Link to="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
        <Briefcase className="h-5 w-5 mr-2" />
        Accueil   
      </Link>
      <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
        <User className="h-5 w-5 mr-2" />
        Profil
      </Link>
      <Link to="/publish-offer" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
        <PlusCircle className="h-5 w-5 mr-2" />
        Publier une offre
      </Link>
      <Link to="/search-offer" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
        <Edit className="h-5 w-5 mr-2" />
        Rechercher des offres
      </Link>
      <Link to="/login" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
        <LogIn className="h-5 w-5 mr-2" />
        Se connecter
      </Link>
    </div>
  );

  return (
    <div className="relative">
      {/* Bouton visible dans le flux (peut être positionné par le parent) */}
      <button
        ref={btnRef}
        onClick={() => {
          setIsOpen((v) => !v);
        }}
        className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full z-50"
        aria-expanded={isOpen}
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Si document non défini (SSR) on évite createPortal */}
      {typeof document !== 'undefined' && isOpen && createPortal(dropdown, document.body)}
    </div>
  );
};

export default MenuBurger;