import React, { useEffect, useState } from 'react';

type Application = {
  id: string;
  title: string;
  company?: string;
  status?: string;
};

const API_BASE = (import.meta.env.VITE_API_BASE as string) ?? 'http://localhost:5000';

// small helper to tell TS the shape we expect from res.json()
async function fetchJson<T>(res: Response): Promise<T> {
  // cast here is safe if you trust the API; otherwise validate before casting
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
        console.log('[ApplicationsList] fetching from', API_BASE);
        const res = await fetch(`${API_BASE}/applications`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // use the generic helper so TypeScript knows the expected type
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