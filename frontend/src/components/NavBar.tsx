import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Briefcase, Search, PlusCircle, Info, User, LogIn, UserPlus } from "lucide-react";
import MenuBurger from "./MenuBurger";

interface NavBarProps {
  isAuthenticated?: boolean;
  onSignOut?: () => void;
}

/**
 * NavBar : en-tête attractif et responsive.
 * - Desktop : liens horizontaux, bouton "Publier une offre" visible.
 * - Mobile : bouton menu (toggle) qui affiche les liens en colonne.
 * - Utilise NavLink pour style actif.
 */
const NavBar: React.FC<NavBarProps> = ({ isAuthenticated = false, onSignOut }) => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left : logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="hidden sm:inline-block text-lg font-bold text-gray-900">JobFinder Bénin</span>
            </Link>
          </div>

          {/* Middle / Desktop links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={linkClass}>Accueil</NavLink>
            <NavLink to="/offres" className={linkClass}><Briefcase className="h-4 w-4" /> Offres</NavLink>
            <NavLink to="/search-offer" className={linkClass}><Search className="h-4 w-4" /> Rechercher</NavLink>
            <NavLink to="/publish-offer" className={linkClass}><PlusCircle className="h-4 w-4" /> Publier</NavLink>
            <NavLink to="/about" className={linkClass}><Info className="h-4 w-4" /> À propos</NavLink>
          </nav>

          {/* Right : actions */}
          <div className="flex items-center gap-3">
            {/* Desktop auth / profile buttons */}
            <div className="hidden md:flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600 flex items-center gap-2">
                    <LogIn className="h-4 w-4" /> Se connecter
                  </Link>
                  <Link to="/register" className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-2">
                    <UserPlus className="h-4 w-4" /> S'inscrire
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="text-sm text-gray-700 hover:text-blue-600 flex items-center gap-2">
                    <User className="h-4 w-4" /> Profil
                  </Link>
                  <button
                    onClick={() => onSignOut?.()}
                    className="text-sm text-gray-700 border px-3 py-1 rounded hover:bg-gray-100"
                  >
                    Se déconnecter
                  </button>
                </>
              )}
            </div>

            {/* Small screens: keep existing MenuBurger (dropdown) */}
            <div className="md:hidden">
              <MenuBurger />
            </div>

            {/* Mobile hamburger to show nav links */}
            <button
              className="inline-flex items-center justify-center md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen((v) => !v)}
              aria-label="Ouvrir le menu principal"
              aria-expanded={open}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (collapsible) */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-1">
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Accueil</NavLink>
            <NavLink to="/offres" className={linkClass} onClick={() => setOpen(false)}><Briefcase className="h-4 w-4" /> Offres</NavLink>
            <NavLink to="/search-offer" className={linkClass} onClick={() => setOpen(false)}><Search className="h-4 w-4" /> Rechercher</NavLink>
            <NavLink to="/publish-offer" className={linkClass} onClick={() => setOpen(false)}><PlusCircle className="h-4 w-4" /> Publier</NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}><Info className="h-4 w-4" /> À propos</NavLink>

            <div className="mt-2 pt-2 border-t flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100" onClick={() => setOpen(false)}>
                    <LogIn className="h-4 w-4 inline-block mr-2" /> Se connecter
                  </Link>
                  <Link to="/register" className="px-3 py-2 rounded-md text-sm bg-blue-600 text-white text-center" onClick={() => setOpen(false)}>
                    <UserPlus className="h-4 w-4 inline-block mr-2" /> S'inscrire
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100" onClick={() => setOpen(false)}>
                    <User className="h-4 w-4 inline-block mr-2" /> Profil
                  </Link>
                  <button onClick={() => { onSignOut?.(); setOpen(false); }} className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                    Se déconnecter
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;