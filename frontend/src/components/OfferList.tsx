import React, { useEffect, useRef } from "react";
import OfferCard, { Offer } from "./OfferCard";

type ViewMode = "grid" | "list";

interface Props {
  offers: Offer[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  viewMode: ViewMode;
  // sentinel is used for infinite scroll observer; internal handling done here
}

const OfferList: React.FC<Props> = ({ offers, loading, hasMore, loadMore, viewMode }) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // If IntersectionObserver not available (old browsers), don't setup infinite here.
    if (!("IntersectionObserver" in window)) return;

    const el = sentinelRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // when sentinel is visible, request more
            if (hasMore && !loading) loadMore();
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div>
      {offers.length === 0 && !loading ? (
        <div className="bg-white p-6 rounded text-center">Aucune offre trouvée.</div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {offers.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          )}

          {/* Loading indicator for appended pages */}
          {loading && offers.length > 0 && (
            <div className="mt-4 flex justify-center text-gray-600">Chargement...</div>
          )}

          {/* sentinel used by IntersectionObserver for infinite scroll */}
          <div ref={sentinelRef} aria-hidden className="h-1" />

          {/* If no more items */}
          {!hasMore && offers.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">Fin des résultats</div>
          )}
        </>
      )}

      {/* Show skeletons when initial loading */}
      {loading && offers.length === 0 && (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferList;