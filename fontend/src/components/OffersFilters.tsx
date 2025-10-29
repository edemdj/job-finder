import React from 'react';
import { categories } from '../data/categories'; // fichier categories central

interface Props {
  domain: string;
  setDomain: (v: string) => void;
  commune: string;
  setCommune: (v: string) => void;
  contract: string;
  setContract: (v: string) => void;
  onClear?: () => void;
}

const OffersFilters: React.FC<Props> = ({ domain, setDomain, commune, setCommune, contract, setContract, onClear }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Recherche</label>
        <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Mots-clés, poste, entreprise" className="mt-1 w-full px-3 py-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Catégories</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} type="button" onClick={() => setDomain(c)}
              className={`text-sm px-3 py-1 rounded-full ${domain === c ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Commune</label>
        <input value={commune} onChange={(e) => setCommune(e.target.value)} placeholder="Ex: Cotonou" className="mt-1 w-full px-3 py-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type de contrat</label>
        <select value={contract} onChange={(e) => setContract(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded">
          <option value="">Tous</option>
          <option>CDI</option>
          <option>CDD</option>
          <option>Stage</option>
          <option>Freelance</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onClear?.()} className="px-3 py-2 border rounded">Réinitialiser</button>
      </div>
    </div>
  );
};

export default OffersFilters;