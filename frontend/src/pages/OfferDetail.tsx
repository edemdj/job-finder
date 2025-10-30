import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import OfferCard, { Offer as OfferType } from "@/components/OfferCard";

const OfferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<OfferType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/offers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Offre introuvable");
        return res.json();
      })
      .then((data) => {
        // backend renvoie l'objet offer directement
        setOffer({
          id: (data._id || data.id),
          title: data.title,
          company: data.company || (data.createdBy?.name),
          location: data.location || "",
          contractType: data.contractType,
          domaine: data.domain,
          tags: data.tags,
          logoUrl: data.logoUrl,
          createdAt: data.createdAt,
          description: data.description
        } as OfferType);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Erreur lors du chargement");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-600">Erreur: {error}</div>;
  if (!offer) return <div className="p-6">Offre introuvable.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/offres" className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Retour aux offres</Link>
      <article className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">{offer.title}</h1>
        {offer.company && <div className="text-sm text-gray-600 mb-2">{offer.company}</div>}
        <div className="text-sm text-gray-500 mb-4">{offer.domaine} • {offer.contractType}</div>
        <p className="text-gray-700 whitespace-pre-line">{(offer as any).description}</p>
        <div className="mt-6 text-sm text-gray-500">Publié le: {offer.createdAt ? new Date(offer.createdAt).toLocaleString() : "—"}</div>
      </article>
    </div>
  );
};

export default OfferDetail;