import React, { useState } from "react";

// Définir le type pour une offre
interface Offer {
  title: string;
  description: string;
  contractType: string;
  domaine: string;
}

const SearchOffer = () => {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<Offer[]>([]); // Spécifier que 'results' est un tableau d'objets de type 'Offer'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) {
      setError("Veuillez entrer un domaine de recherche.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Requête GET avec le domaine comme paramètre
      const response = await fetch(`http://localhost:5000/api/offers?domain=${domain}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.offers); // Adapter selon le format des données de l'API
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      setError("Impossible de récupérer les résultats.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Rechercher une Offre par Domaine</h1>
        <form onSubmit={handleSearch}>
          {/* Champ de recherche par domaine */}
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Chargement..." : "Rechercher"}
          </button>
        </form>

        {/* Résultats de la recherche */}
        <div className="mt-6">
          {results.length > 0 ? (
            <ul>
              {results.map((offer, index) => (
                <li key={index} className="border-b py-2">
                  <h2 className="font-bold text-blue-600">{offer.title}</h2>
                  <p>{offer.description}</p>
                  <p className="text-gray-500">{offer.contractType}</p>
                  <p className="text-gray-700">{offer.domaine}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun résultat trouvé pour le domaine sélectionné.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOffer;
