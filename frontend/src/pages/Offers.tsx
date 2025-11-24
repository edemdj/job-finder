import React, { useEffect, useRef, useState } from "react";
import OffersFilters from "@/components/OffersFilters";
import OfferList from "@/components/OfferList";
import { Offer } from "@/components/OfferCard";
import { Link } from "react-router-dom";

/**
 * Page d'affichage des offres avec :
 * - toggle List / Grid
 * - option Infinite Scroll ON/OFF
 * - pagination interne (page state) + loadMore
 *
 * Adapte l'URL de l'API (ici via VITE_API_BASE).
 */

type ViewMode = "grid" | "list";

const OffersPage: React.FC = () => {
  const [domain, setDomain] = useState("");
  const [commune, setCommune] = useState("");
  const [contract, setContract] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [infiniteEnabled, setInfiniteEnabled] = useState(true);

  const abortRef = useRef<AbortController | null>(null);

  // Définir la base API en utilisant la variable Vite au build time.
  // En dev, si VITE_API_BASE n'est pas défini, on retombe sur localhost.
  const API_BASE =
    (import.meta as any).env.VITE_API_BASE ??
    ((import.meta as any).env.MODE === "development" ? "http://localhost:5000" : "");

  // When filters change, reset page/offers and fetch page 1
  useEffect(() => {
    setPage(1);
    setOffers([]);
    setHasMore(true);
    fetchOffers(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, commune, contract]);

  // Fetch on page change (page > 1)
  useEffect(() => {
    if (page === 1) return;
    fetchOffers(page, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchOffers = async (pageToLoad = 1, replace = false) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);

    const params = new URLSearchParams();
    if (domain) params.append("domain", domain);
    if (commune) params.append("commune", commune);
    if (contract) params.append("contract", contract);
    params.append("page", String(pageToLoad));
    params.append("limit", "12");

    try {
      // Utiliser API_BASE ici (ne pas hardcoder localhost)
      const base = API_BASE.replace(/\/$/, ""); // enlever slash final si présent
      const res = await fetch(`${base}/api/offers?${params.toString()}`, {
        signal: abortRef.current!.signal,
      });
      if (!res.ok) throw new Error("Erreur serveur");

      // Normalize incoming data: ensure each offer has an `id` field (fallback to _id)
      const data = await res.json();
      const incomingRaw: any[] = data.offers ?? data;
      const incoming: Offer[] = incomingRaw.map((o: any) => ({
        ...o,
        id: o.id ?? o._id ?? (o._id ? String(o._id) : undefined),
      }));

      const more = typeof data.hasMore === "boolean" ? data.hasMore : incoming.length === 12;

      setOffers((prev) => (replace ? incoming : [...prev, ...incoming]));
      setHasMore(more);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (loading || !hasMore) return;
    // if infinite enabled, increment page to trigger fetch
    setPage((p) => p + 1);
  };

  const handleLoadMoreClick = () => {
    // When user clicks "Voir plus", fetch next page immediately
    if (loading || !hasMore) return;
    setPage((p) => p + 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filters column */}
      <aside className="lg:col-span-1">
        <OffersFilters
          domain={domain}
          setDomain={setDomain}
          commune={commune}
          setCommune={setCommune}
          contract={contract}
          setContract={setContract}
          onClear={() => {
            setDomain("");
            setCommune("");
            setContract("");
          }}
        />
      </aside>

      {/* Main results */}
      <main className="lg:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Offres</h1>

          <div className="flex items-center gap-3">
            {/* Infinite toggle */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={infiniteEnabled}
                onChange={(e) => setInfiniteEnabled(e.target.checked)}
                className="h-4 w-4"
              />
              Défilement infini
            </label>

            {/* View toggle */}
            <div className="inline-flex rounded border overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 ${viewMode === "list" ? "bg-gray-800 text-white" : "bg-white text-gray-700"}`}
                aria-pressed={viewMode === "list"}
                title="Vue liste"
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 ${viewMode === "grid" ? "bg-gray-800 text-white" : "bg-white text-gray-700"}`}
                aria-pressed={viewMode === "grid"}
                title="Vue grille"
              >
                Grille
              </button>
            </div>

            <Link to="/publish-offer" className="px-4 py-2 bg-blue-600 text-white rounded">
              Publier une offre
            </Link>
          </div>
        </div>

        {/* Offer list:
            - If infiniteEnabled: OfferList uses sentinel + IntersectionObserver to loadMore via page state
            - If infiniteEnabled false: we still render OfferList but hide sentinel behavior (it remains, but you control load by button)
        */}
        <OfferList offers={offers} loading={loading} hasMore={hasMore} loadMore={() => infiniteEnabled && loadMore()} viewMode={viewMode} />

        {/* If user disabled infinite scroll, show explicit "Voir plus" button */}
        {!infiniteEnabled && hasMore && (
          <div className="mt-6 flex justify-center">
            <button onClick={handleLoadMoreClick} className="px-4 py-2 border rounded" disabled={loading}>
              {loading ? "Chargement..." : "Voir plus"}
            </button>
          </div>
        )}

        {/* If infinite enabled but browser doesn't support IntersectionObserver, show fallback button */}
        {infiniteEnabled && typeof IntersectionObserver === "undefined" && hasMore && (
          <div className="mt-6 flex justify-center">
            <button onClick={handleLoadMoreClick} className="px-4 py-2 border rounded">
              {loading ? "Chargement..." : "Voir plus"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default OffersPage;