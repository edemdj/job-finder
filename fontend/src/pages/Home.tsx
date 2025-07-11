import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="text-center p-8 bg-brown-50 min-h-screen">
      {/* Animation du titre à l'arrivée */}
      <motion.h1
        className="text-4xl font-bold text-brown-700"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        Bienvenue sur JobFinder Bénin
      </motion.h1>
      {/* Animation du texte à l'arrivée */}
      <motion.p
        className="mt-4 text-brown-600 text-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        Explorez les offres d&apos;emploi et les opportunités professionnelles au Bénin.
      </motion.p>

      {/* Exemple d'élément animé au scroll */}
      <div data-aos="fade-up" className="mt-10 bg-brown-300 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-2 text-brown-800">Des milliers d'opportunités !</h2>
        <p className="text-brown-700">
          Trouvez l'emploi de vos rêves grâce à notre plateforme dédiée au marché béninois.
        </p>
      </div>

      {/* Un autre exemple d'animation au scroll */}
      <div data-aos="fade-right" className="mt-10 bg-brown-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-brown-800">Pourquoi choisir JobFinder Bénin ?</h2>
        <ul className="list-disc mx-auto text-left w-fit text-brown-700">
          <li>Interface simple et intuitive</li>
          <li>Offres actualisées chaque jour</li>
          <li>Completement gratuit</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;