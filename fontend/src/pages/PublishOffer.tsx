import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { categories } from "../data/categories";

const LOCAL_STORAGE_KEY = "publish-offer-draft-v1";

const PublishOffer: React.FC = () => {
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [contractType, setContractType] = useState("CDI");
  const [domain, setDomain] = useState("");
  const [locationField, setLocationField] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Préremplissage si on vient de SearchOffer (navigate state)
    const state: any = (location.state as any) ?? {};
    if (state?.prefill) {
      const p = state.prefill;
      if (p.title) setTitle(p.title);
      if (p.company) setCompany(p.company);
      if (p.domain) setDomain(p.domain);
      if (p.location) setLocationField(p.location);
      if (p.description) setDescription(p.description);
      if (p.tags) setTags(Array.isArray(p.tags) ? p.tags : []);
    }

    // charger draft local si présent
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setTitle(d.title || "");
        setCompany(d.company || "");
        setContractType(d.contractType || "CDI");
        setDomain(d.domain || "");
        setLocationField(d.location || "");
        setDescription(d.description || "");
        setTags(d.tags || []);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const draft = { title, company, contractType, domain, location: locationField, description, tags };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
    }, 700);
    return () => clearTimeout(t);
  }, [title, company, contractType, domain, locationField, description, tags]);

  const addTag = (t?: string) => {
    const newTag = (t ?? tagInput).trim();
    if (!newTag) return;
    if (!tags.includes(newTag)) setTags((s) => [...s, newTag]);
    setTagInput("");
    tagInputRef.current?.focus();
  };
  const removeTag = (t: string) => setTags((s) => s.filter((x) => x !== t));
  const onTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!title.trim() || !domain.trim() || !locationField.trim() || !description.trim()) {
      alert("Remplissez les champs obligatoires.");
      return;
    }

    // Préparer payload (ici JSON simple)
    const payload = { title, company, contractType, domain, location: locationField, description, tags };
    try {
      const res = await fetch("http://localhost:5000/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      alert("Offre publiée avec succès !");
      // nettoyage
      setTitle(""); setCompany(""); setContractType("CDI"); setDomain(""); setLocationField(""); setDescription(""); setTags([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la publication.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Publier une offre</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Entreprise (optionnel)</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded" />
          </div>

          {/* Domaine : select + datalist + chips */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Domaine *</label>

            {/* chips de catégories rapides */}
            <div className="mb-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setDomain(c)}
                  className={`mr-2 mb-2 text-sm px-3 py-1 rounded-full ${domain === c ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <select value={domain} onChange={(e) => setDomain(e.target.value)} className="flex-1 px-3 py-2 border rounded">
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="_other">Autre (saisir manuellement)</option>
              </select>

              <input
                id="domain-input"
                value={domain === "_other" ? "" : domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Ou tapez votre domaine"
                className="flex-1 px-3 py-2 border rounded"
                aria-label="Domaine personnalisé"
                list="domain-list"
              />
              <datalist id="domain-list">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lieu (commune) *</label>
            <input value={locationField} onChange={(e) => setLocationField(e.target.value)} placeholder="Ex: Cotonou" className="mt-1 block w-full px-3 py-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="mt-1 block w-full px-3 py-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags / Compétences</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="text-xs text-gray-500">×</button>
                </span>
              ))}
              <input ref={tagInputRef} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={onTagKeyDown} placeholder="Ajouter un tag et Entrée" className="px-3 py-1 border rounded" />
              <button type="button" onClick={() => addTag()} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">Ajouter</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Publier l'offre</button>
            <button type="button" onClick={() => { localStorage.removeItem(LOCAL_STORAGE_KEY); alert('Brouillon supprimé'); }} className="text-sm text-gray-500">Supprimer le brouillon</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishOffer;