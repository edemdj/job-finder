import React from 'react';
import { Link } from 'react-router-dom';

export interface Offer {
  id: string | number;
  title: string;
  company?: string;
  location?: string;
  contractType?: string;
  domaine?: string;
  tags?: string[];
  logoUrl?: string;
  createdAt?: string;
}

const OfferCard: React.FC<{ offer: Offer; onPublishSimilar?: (o: Offer) => void }> = ({ offer, onPublishSimilar }) => {
  return (
    <article className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
        {offer.logoUrl ? (
          <img src={offer.logoUrl} alt={`${offer.company} logo`} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400">Logo</span>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-600">
              <Link to={`/offres/${offer.id}`} className="hover:underline">{offer.title}</Link>
            </h3>
            <p className="text-sm text-gray-500">{offer.company} • {offer.location}</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div>{offer.contractType}</div>
            <div className="text-xs text-gray-400">{offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : ''}</div>
          </div>
        </div>

        <p className="mt-3 text-gray-700 line-clamp-3">{offer.domaine}</p>

        <div className="mt-3 flex flex-wrap gap-2 items-center">
          {(offer.tags || []).slice(0, 6).map((t) => (
            <button key={t} className="text-xs bg-gray-100 px-2 py-1 rounded" aria-label={`Filtrer par ${t}`}>
              {t}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <Link to={`/offres/${offer.id}`} className="text-sm text-blue-600 hover:underline">Voir</Link>
            <button className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">Postuler</button>
            {onPublishSimilar && (
              <button onClick={() => onPublishSimilar(offer)} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">
                Publier similaire
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default OfferCard;