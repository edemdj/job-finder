import React, { useState } from "react";

const PublishOffer = () => {
  const [title, setTitle] = useState("");
  const [contractType, setContractType] = useState("CDI");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Exemple de requête POST pour soumettre les données
    const offerData = { title, contractType, domain, description };
    try {
      const response = await fetch("http://localhost:5000/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        throw new Error("Échec de la publication de l'offre.");
      }

      // Affichage du succès si la requête est réussie
      setSuccess(true);

      // Réinitialisation du formulaire
      setTitle("");
      setContractType("CDI");
      setDomain("");
      setDescription("");
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Publier une offre</h1>

        {success && (
          <p className="mb-4 text-green-600 font-medium">
            Offre publiée avec succès !
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Titre */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titre de l'offre
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Type de contrat */}
          <div className="mb-4">
            <label htmlFor="contractType" className="block text-sm font-medium text-gray-700">
              Type de contrat
            </label>
            <select
              id="contractType"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
            </select>
          </div>

          {/* Domaine */}
          <div className="mb-4">
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
              Domaine
            </label>
            <input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Développement, Design, Gestion de projet"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description du poste
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Décrivez le poste, les responsabilités et les exigences."
              required
            />
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Publier l'offre
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublishOffer;
