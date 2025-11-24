import React, { useEffect, useState } from 'react';

type Application = {
  id: string;
  title: string;
  company?: string;
  status?: string;
};

// Lire la var Vite (peut être undefined)
// NOTE: import.meta.env est injecté au build time.
const VITE_API_BASE = (import.meta.env as any).VITE_API_BASE as string | undefined;
const IS_DEV = (import.meta.env as any).MODE === 'development';

// API_BASE final — en production on laisse '' si non défini (pour éviter d'injecter localhost dans le bundle)
const API_BASE = VITE_API_BASE ?? (IS_DEV ? 'http://localhost:5000' : '');

// helper
async function fetchJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[ApplicationsList] API_BASE =', API_BASE || '(empty - using relative path)');
        // Construire l'URL : si API_BASE est vide, on utilise une requête relative (même origine)
        const base = API_BASE.replace(/\/$/, '') || '';
        const url = base ? `${base}/api/applications` : `/api/applications`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await fetchJson<Application[]>(res);
        if (mounted) setApplications(data);
      } catch (err: any) {
        console.error('[ApplicationsList] fetch error', err);
        if (mounted) setError(err?.message ?? String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchApplications();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{ color: 'red' }}>Erreur : {error}</div>;
  if (applications.length === 0) return <div>Aucune candidature</div>;

  return (
    <div>
      <h2>Mes candidatures</h2>
      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            <strong>{app.title}</strong>{' '}
            {app.company && `— ${app.company}`} {app.status && `(${app.status})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationsList;