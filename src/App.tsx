import React from 'react';
import { BriefcaseSearch } from 'lucide-react';
import Button from './components/ui/Button';
import SearchInput from './components/ui/SearchInput';
import JobCategories from './components/JobCategories';
import FeaturedJobs from './components/FeaturedJobs';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BriefcaseSearch className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">JobFinder Bénin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Se connecter</Button>
              <Button>S'inscrire</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Trouvez votre prochain emploi au Bénin
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Des milliers d'opportunités professionnelles vous attendent
          </p>
          <div className="mt-8">
            <SearchInput
              className="mx-auto max-w-2xl"
              placeholder="Rechercher un poste, une entreprise ou un lieu..."
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Catégories populaires</h2>
          <JobCategories />
        </section>

        {/* Featured Jobs Section */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Offres d'emploi en vedette</h2>
          <FeaturedJobs />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold text-white">À propos</h3>
              <ul className="mt-4 space-y-2">
                <li>Qui sommes-nous</li>
                <li>Comment ça marche</li>
                <li>Témoignages</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Employeurs</h3>
              <ul className="mt-4 space-y-2">
                <li>Publier une offre</li>
                <li>Rechercher des CV</li>
                <li>Tarifs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Candidats</h3>
              <ul className="mt-4 space-y-2">
                <li>Rechercher un emploi</li>
                <li>Créer un CV</li>
                <li>Conseils carrière</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li>Support</li>
                <li>FAQ</li>
                <li>Nous contacter</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center">
            <p>© 2024 JobFinder Bénin. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;