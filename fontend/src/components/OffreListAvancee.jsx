import React, { useState } from "react";

// Exemple d'offres (à remplacer par un fetch si tu as une API)
const offres = [
  {
    id: 1,
    titre: "Développeur React",
    description: "Développement d'une application web en React.",
    domaine: "Informatique",
    lieu: "Paris",
    type: "CDI"
  },
  {
    id: 2,
    titre: "Assistant Marketing",
    description: "Participation à la stratégie marketing digital.",
    domaine: "Marketing",
    lieu: "Lyon",
    type: "Stage"
  },
  {
    id: 3,
    titre: "Technicien Réseau",
    description: "Maintenance des infrastructures réseau.",
    domaine: "Informatique",
    lieu: "Marseille",
    type: "CDD"
  },
  {
    id: 4,
    titre: "Product Owner",
    description: "Gestion de produits digitaux",
    domaine: "Informatique",
    lieu: "Paris",
    type: "CDI"
  }
];

const lieuxDisponibles = [...new Set(offres.map(o => o.lieu))];
const domainesDisponibles = [...new Set(offres.map(o => o.domaine))];
const typesDisponibles = [...new Set(offres.map(o => o.type))];

const OffreListAvancee = () => {
  const [search, setSearch] = useState("");
  const [domaine, setDomaine] = useState("");
  const [lieu, setLieu] = useState("");
  const [type, setType] = useState("");

  const offresFiltrees = offres.filter(
    (offre) =>
      (offre.titre.toLowerCase().includes(search.toLowerCase()) ||
        offre.description.toLowerCase().includes(search.toLowerCase())) &&
      (domaine === "" || offre.domaine === domaine) &&
      (lieu === "" || offre.lieu === lieu) &&
      (type === "" || offre.type === type)
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Recherche avancée d'offres</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Mot-clé..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select value={domaine} onChange={(e) => setDomaine(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">Tous domaines</option>
          {domainesDisponibles.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select value={lieu} onChange={(e) => setLieu(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">Tous lieux</option>
          {lieuxDisponibles.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">Tous types</option>
          {typesDisponibles.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <ul>
        {offresFiltrees.length === 0 && <li>Aucune offre ne correspond à votre recherche.</li>}
        {offresFiltrees.map((offre) => (
          <li key={offre.id} className="mb-6 border-b pb-3">
            <strong>{offre.titre}</strong> <span className="text-gray-500">({offre.type} - {offre.lieu})</span><br />
            <em>{offre.domaine}</em><br />
            <span>{offre.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OffreListAvancee;
