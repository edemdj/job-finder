import React, { useEffect } from 'react';
import MenuBurger from '@/components/MenuBurger';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

// Image distante par défaut — tu peux remplacer par: import hero from '@/assets/about-hero.jpg';
const imageUrl =
  'https://images.pexels.com/photos/3183172/pexels-photo-3183172.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600';

const About: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Hero */}
      <motion.div
        className="relative rounded-lg overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <img
          src={imageUrl}
          alt="Équipe JobFinder Bénin"
          className="w-full h-56 md:h-72 lg:h-96 object-cover object-center"
          loading="lazy"
        />

        {/* MenuBurger superposé */}
        <div className="absolute top-4 right-4 z-50">
          <MenuBurger />
        </div>

        {/* Texte hero */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
            <h1 className="text-2xl md:text-3xl font-bold">À propos de JobFinder Bénin</h1>
            <p className="mt-1 max-w-2xl">
              Nous aidons les talents béninois à trouver des opportunités locales et internationales,
              en rapprochant les entreprises des bons profils.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contenu */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div data-aos="fade-right" className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-2">Notre mission</h2>
          <p className="text-gray-700">
            Offrir une plateforme simple, gratuite et fiable pour que les chercheurs d’emploi et les
            recruteurs se rencontrent efficacement. Nous valorisons la transparence et la qualité des offres.
          </p>
        </div>

        <div data-aos="fade-left" className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-2">Nos valeurs</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Accessibilité — rendre l’emploi accessible à tous</li>
            <li>Confiance — offrir des offres vérifiées</li>
            <li>Communauté — soutenir l’écosystème local</li>
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <div data-aos="fade-up" className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">L’équipe</h2>
          <p className="text-gray-700 mb-4">
            Une petite équipe passionnée par la technologie et l’emploi au Bénin. Nous travaillons
            chaque jour pour améliorer la plateforme et ajouter des fonctionnalités utiles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gray-200 mb-3" />
              <p className="font-medium">Edem</p>
              <p className="text-sm text-gray-500">Product / Founder</p>
            </div>
            <div className="p-4 text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gray-200 mb-3" />
              <p className="font-medium">Dev</p>
              <p className="text-sm text-gray-500">Lead Dev</p>
            </div>
            <div className="p-4 text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gray-200 mb-3" />
              <p className="font-medium">Support</p>
              <p className="text-sm text-gray-500">Communauté</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 text-center">
        <div data-aos="zoom-in" className="inline-block bg-blue-600 text-white rounded-lg px-6 py-4 shadow-lg">
          <h3 className="text-lg font-semibold">Prêt à chercher votre prochaine opportunité ?</h3>
          <p className="mt-2 text-sm">
            Parcourez nos offres ou publiez une annonce si vous recrutez.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link to="/offres" className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium">
              Voir les offres
            </Link>
            <Link to="/publish-offer" className="border border-white text-white px-4 py-2 rounded-md font-medium">
              Publier une offre
            </Link>
          </div>
        </div>
      </section>

      {/* Pied de page simple */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JobFinder Bénin — Tous droits réservés
      </footer>
    </div>
  );
};

export default About;
