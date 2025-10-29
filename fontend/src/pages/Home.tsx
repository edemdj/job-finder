import React, { useEffect } from 'react';
import MenuBurger from '@/components/MenuBurger';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Search, Briefcase, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

// Image distante (remplace par import local si tu as le fichier dans src/assets)
// import hero from '@/assets/home-hero.webp';
const imageUrl =
  'https://images.pexels.com/photos/3869651/pexels-photo-3869651.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

const featuredJobs = [
  { id: 1, title: 'Développeur Web', company: 'TechCorp', location: 'Cotonou' },
  { id: 2, title: 'Designer UI/UX', company: 'DesignPro', location: 'Porto-Novo' },
  { id: 3, title: 'Chef de projet', company: 'InnovateBenin', location: 'Abomey' },
];

const categories = [
  'Technologie',
  'Administration',
  'Vente',
  'Design',
  'Construction',
  'Restauration',
];

const Home: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HERO */}
      <section className="relative rounded-lg overflow-hidden shadow-lg">
        <img
          src={imageUrl}
          alt="Professionnels travaillant - JobFinder Bénin"
          className="w-full h-64 md:h-96 object-cover object-center"
          loading="lazy"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* MenuBurger top right (superposé) */}
        <div className="absolute top-4 right-4 z-50">
          <MenuBurger />
        </div>

        {/* Hero content */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-6 md:px-12 py-8 text-left w-full md:max-w-2xl">
            <motion.h1
              className="text-3xl md:text-5xl font-extrabold text-white leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Trouvez votre prochain emploi au Bénin
            </motion.h1>
            <motion.p
              className="mt-3 text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              Parcourez des milliers d’offres locales, postez une annonce et connectez-vous avec les recruteurs.
            </motion.p>

            {/* Search bar + CTA */}
            <motion.div
              className="mt-6 flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label htmlFor="hero-search" className="sr-only">Rechercher une offre</label>
              <div className="flex items-center bg-white rounded-full shadow-sm w-full sm:flex-1 px-3">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  id="hero-search"
                  type="search"
                  placeholder="Titre, entreprise ou lieu (ex: Développeur Cotonou)"
                  className="ml-3 flex-1 py-3 text-sm outline-none"
                  aria-label="Rechercher des offres d'emploi"
                />
                <button
                  className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
                  aria-label="Lancer la recherche"
                >
                  Rechercher
                </button>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/publish-offer"
                  className="inline-flex items-center bg-white/90 text-blue-600 px-4 py-2 rounded-full font-medium shadow hover:scale-105 transition"
                >
                  <Briefcase className="h-4 w-4 mr-2" /> Publier une offre
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick stats + categories */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div data-aos="fade-up" className="bg-white rounded-lg p-6 shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-50">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">12k+</div>
            <div className="text-sm text-gray-500">Offres publiées</div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="80" className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold mb-3">Catégories populaires</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c} className="text-sm bg-gray-100 px-3 py-1 rounded-full">{c}</span>
            ))}
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="160" className="bg-white rounded-lg p-6 shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-50">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">8k+</div>
            <div className="text-sm text-gray-500">Candidats inscrits</div>
          </div>
        </div>
      </section>

      {/* Featured jobs */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Offres en vedette</h2>
          <Link to="/offres" className="text-sm text-blue-600 hover:underline">Voir toutes</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <motion.article
              key={job.id}
              className="bg-white rounded-lg p-5 shadow hover:shadow-md transition"
              whileHover={{ translateY: -6 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company} — {job.location}</p>
                </div>
                <div className="text-sm text-gray-400">Temps plein</div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Link to={`/offres/${job.id}`} className="text-sm text-blue-600 hover:underline">
                  Voir l'offre
                </Link>
                <button className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Postuler</button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Testimonials (simple) */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Ce qu’on dit de nous</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow" data-aos="fade-right">
            <p className="text-gray-700">"Merci JobFinder, j'ai trouvé un poste en 2 semaines!"</p>
            <div className="mt-3 text-sm text-gray-500">— Fatou, Développeuse</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow" data-aos="fade-up">
            <p className="text-gray-700">"Simple à utiliser et beaucoup d'offres locales."</p>
            <div className="mt-3 text-sm text-gray-500">— Idriss, Recruteur</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow" data-aos="fade-left">
            <p className="text-gray-700">"Excellent support et bonnes opportunités."</p>
            <div className="mt-3 text-sm text-gray-500">— Aïcha, Designer</div>
          </div>
        </div>
      </section>

      <footer className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JobFinder Bénin — Tous droits réservés
      </footer>
    </div>
  );
};

export default Home;