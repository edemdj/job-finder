import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Application = {
  _id: string;
  offerId: string;
  offerTitle?: string;
  applicantName: string;
  applicantEmail: string;
  message?: string;
  cvPath?: string;
  cvUrl?: string;
  recruiter?: { name?: string; email?: string } | null;
  createdAt?: string;
};

const API_BASE = (import.meta.env.VITE_API_BASE as string) ?? 'http://localhost:5000';

const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [offerFilter, setOfferFilter] = useState('');
  const [recruiterFilter, setRecruiterFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (offerFilter) params.append('offerId', offerFilter);
      if (recruiterFilter) params.append('recruiterId', recruiterFilter);
      const res = await fetch(`${API_BASE}/api/public-applications?${params.toString()}`);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = (await res.json()) as { applications?: Application[] };
      setApplications(data.applications ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erreur lors de la récupération');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApps();
  };

  // Handlers typés pour lever l'ambiguïté TS sur e.target.value
  const handleOfferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOfferFilter(e.currentTarget.value);
  };

  const handleRecruiterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecruiterFilter(e.currentTarget.value);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Candidatures</h1>

      <form onSubmit={onFilterSubmit} className="mb-4 flex gap-2">
        <input
          value={offerFilter}
          onChange={handleOfferChange}
          placeholder="Filtrer par offerId"
          className="px-3 py-2 border rounded flex-1"
        />
        <input
          value={recruiterFilter}
          onChange={handleRecruiterChange}
          placeholder="Filtrer par recruiterId"
          className="px-3 py-2 border rounded flex-1"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Filtrer</button>
      </form>

      {loading ? (
        <div>Chargement…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : applications.length === 0 ? (
        <div>Aucune candidature trouvée.</div>
      ) : (
        <div className="space-y-4">
          {applications.map((a) => (
            <div key={a._id} className="bg-white p-4 rounded shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">
                    {a.offerTitle ? (
                      <>
                        <strong>Offre:</strong> {a.offerTitle}
                      </>
                    ) : (
                      <>OfferId: {a.offerId}</>
                    )}
                  </div>
                  <div className="text-lg font-semibold">
                    {a.applicantName}{' '}
                    <span className="text-sm text-gray-500">({a.applicantEmail})</span>
                  </div>
                  {a.message && (
                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{a.message}</div>
                  )}
                </div>

                <div className="text-right text-sm text-gray-500">
                  <div>{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</div>
                  {a.recruiter && (
                    <div className="mt-2">
                      Recruteur: {a.recruiter.name ?? ''} {a.recruiter.email ? `• ${a.recruiter.email}` : ''}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex gap-2 items-center">
                {a.cvUrl ? (
                  <a href={a.cvUrl} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                    Télécharger le CV
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">Pas de CV</span>
                )}
                <Link to={`/offres/${a.offerId}`} className="text-sm text-blue-600 hover:underline ml-auto">
                  Voir l&apos;offre
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;