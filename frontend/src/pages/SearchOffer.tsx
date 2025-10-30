import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { communes } from "../data/communes";
import { categories } from "../data/categories";
import CategoryList from "../components/CategoryList";

interface Offer {
  id: string | number;
  title: string;
  description: string;
  contractType?: string;
  domaine?: string;
  location?: string;
  company?: string;
  tags?: string[];
}

const HIGHLIGHT = (text: string, query: string) => {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
};

const SearchOffer: React.FC = () => {
  const [domain, setDomain] = useState("");
  const [commune, setCommune] = useState("");
  const [contract, setContract] = useState("");
  const [results, setResults] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [queryHint, setQueryHint] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("search-hints") || "[]");
    } catch {
      return [];
    }
  });

  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const domainInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // reset pagination when filters change
    setResults([]);
    setPage(1);
    setHasMore(true);
    debouncedFetch(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, commune, contract]);

  useEffect(() => {
    if (page > 1) debouncedFetch(page, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const debouncedFetch = (pageToLoad: number, replace: boolean) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => doFetch(pageToLoad, replace), 300);
  };

  const doFetch = async (pageToLoad = 1, replace = true) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (domain.trim()) params.append("domain", domain.trim());
    if (commune) params.append("commune", commune);
    if (contract) params.append("contract", contract);
    params.append("page", String(pageToLoad));
    params.append("limit", "10");

    try {
      const res = await fetch(`http://localhost:5000/api/offers?${params.toString()}`, {
        method: "GET",
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error("Erreur serveur lors de la recherche");

      // NORMALISATION: map backend _id -> id so Links are built correctly
      const data = await res.json();
      const offersRaw: any[] = data.offers ?? data;
      const mappedOffers: Offer[] = offersRaw.map((o: any) => ({
        ...o,
        id: o.id ?? o._id ?? (o._id ? String(o._id) : undefined),
      }));

      const more = typeof data.hasMore === "boolean" ? data.hasMore : mappedOffers.length === 10;

      setResults((prev) => (replace ? mappedOffers : [...prev, ...mappedOffers]));
      setHasMore(more);
      setLoading(false);

      if (domain.trim()) {
        setQueryHint((prev) => {
          const next = [domain.trim(), ...prev.filter((h) => h !== domain.trim())].slice(0, 6);
          localStorage.setItem("search-hints", JSON.stringify(next));
          return next;
        });
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error(err);
      setError(err.message || "Impossible de récupérer les résultats.");
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim() && !queryHint.includes(domain.trim())) {
      const next = [domain.trim(), ...queryHint].slice(0, 6);
      setQueryHint(next);
      localStorage.setItem("search-hints", JSON.stringify(next));
    }
    setPage(1);
    debouncedFetch(1, true);
    setTimeout(() => listRef.current?.focus(), 350);
  };

  const clearFilters = () => {
    setDomain("");
    setCommune("");
    setContract("");
    setResults([]);
    setError("");
    setHasMore(true);
  };

  const loadMore = () => {
    if (!hasMore || loading) return;
    setPage((p) => p + 1);
  };

  // When clicking a category chip: set domain and run search
  const onCategorySelect = (cat: string) => {
    setDomain(cat);
    setPage(1);
    debouncedFetch(1, true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Rechercher des offres</h1>
          <p className="text-sm text-gray-600">Cliquez sur une catégorie pour filtrer rapidement.</p>
        </header>

        {/* Category chips */}
        <div className="mb-4">
          <CategoryList categories={categories} active={domain} onSelect={onCategorySelect} />
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 grid gap-3 md:grid-cols-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Domaine / mot-clé</label>
            <input
              id="domain"
              ref={domainInputRef}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Développeur React, Marketing..."
              list="domain-hints"
              aria-label="Rechercher par domaine ou mot clé"
            />
            <datalist id="domain-hints">
              {queryHint.map((h) => <option key={h} value={h} />)}
              {categories.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>

          <div>
            <label htmlFor="commune" className="block text-sm font-medium text-gray-700">Commune</label>
            <select
              id="commune"
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filtrer par commune"
            >
              <option value="">Toutes les communes</option>
              {communes.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="contract" className="block text-sm font-medium text-gray-700">Type de contrat</label>
            <select
              id="contract"
              value={contract}
              onChange={(e) => setContract(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filtrer par type de contrat"
            >
              <option value="">Tous</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={loading}
              aria-label="Rechercher"
            >
              {loading ? "Recherche..." : "Rechercher"}
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="border px-4 py-2 rounded hover:bg-gray-100 text-sm"
            >
              Réinitialiser
            </button>
          </div>
        </form>

        {/* Quick chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {queryHint.map((h) => (
            <button
              key={h}
              onClick={() => { setDomain(h); debouncedFetch(1, true); }}
              className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
            >
              {h}
            </button>
          ))}
        </div>

        {/* Results */}
        <section className="mt-6">
          {error && <div className="text-red-600 mb-4">{error}</div>}

          <div tabIndex={-1} aria-live="polite" ref={listRef} className="space-y-3">
            {loading && results.length === 0 ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white p-4 rounded shadow animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : results.length > 0 ? (
              <>
                <ul role="list" className="space-y-3">
                  {results.map((offer) => (
                    <li key={offer.id} className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-600">
                          <Link to={`/offres/${offer.id}`} className="hover:underline">
                            {HIGHLIGHT(offer.title || "Titre manquant", domain)}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{HIGHLIGHT((offer.company ? `${offer.company} — ` : "") + (offer.location ?? ""), domain)}</p>
                        <p className="mt-2 text-gray-700 line-clamp-3">{HIGHLIGHT(offer.description || "", domain)}</p>
                        {/* tags cliquables */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(offer.tags || []).map((t) => (
                            <button key={t} className="text-xs bg-gray-100 px-2 py-1 rounded" onClick={() => { setDomain(t); debouncedFetch(1, true); }}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 md:mt-0 md:ml-4 flex flex-col items-start gap-2">
                        <span className="text-sm text-gray-500">{offer.contractType ?? "Type non précisé"}</span>
                        <span className="text-sm text-gray-500">{offer.domaine ?? ""}</span>
                        <div className="flex gap-2">
                          <Link to={`/offres/${offer.id}`} className="text-sm text-blue-600 hover:underline">Voir</Link>
                          <button className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">Postuler</button>
                          <Link to="/publish-offer" state={{ prefill: { title: offer.title, company: offer.company, domain: offer.domaine, location: offer.location, description: offer.description, tags: offer.tags } }} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">Publier similaire</Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex justify-center">
                  {hasMore ? (
                    <button onClick={loadMore} disabled={loading} className="px-4 py-2 bg-white border rounded hover:bg-gray-50">
                      {loading ? "Chargement..." : "Voir plus"}
                    </button>
                  ) : (
                    <div className="text-sm text-gray-500">Fin des résultats</div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white p-6 rounded shadow text-center">
                <p className="text-gray-700 mb-3">Aucun résultat trouvé.</p>
                <div className="flex justify-center gap-3">
                  <Link to="/publish-offer" className="bg-blue-600 text-white px-4 py-2 rounded">Publier une offre</Link>
                  <button onClick={() => { setDomain(""); setCommune(""); domainInputRef.current?.focus(); }} className="px-4 py-2 border rounded">Réessayer</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SearchOffer;