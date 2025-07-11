import React from "react";
import { useNavigate } from "react-router-dom";

const Offres = () => {
  const navigate = useNavigate();

  // Exemple de données statiques pour les offres (vous remplacerez par une API ou des données réelles)
  const offres = [
    { id: 1, titre: "Développeur Web", description: "CDI, à Cotonou", entreprise: "TechCorp" },
    { id: 2, titre: "Designer UX/UI", description: "Freelance, remote", entreprise: "DesignPro" },
    { id: 3, titre: "Chef de projet IT", description: "CDD, à Abomey", entreprise: "InnovateBenin" },
  ];

  // Handlers pour les boutons
  const handlePublishOffer = () => navigate("/publish-offer"); // Redirige vers la page de publication
  const handleSearchOffer = () => navigate("/search-offer"); // Redirige vers la page de recherche

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Découvrez les offres d'emploi</h1>

      {/* Section des boutons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={handlePublishOffer}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Publier une offre
        </button>
        <button
          onClick={handleSearchOffer}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Rechercher une offre
        </button>
      </div>

      {/* Section des offres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offres.map((offre) => (
          <div key={offre.id} className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold text-blue-600">{offre.titre}</h2>
            <p className="text-gray-700">{offre.description}</p>
            <p className="text-gray-500 mt-2">{offre.entreprise}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offres;
