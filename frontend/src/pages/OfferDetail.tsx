import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

/**
 * Page de détail d'une offre avec formulaire de candidature direct :
 * - GET /api/offers/:id pour afficher l'offre
 * - POST multipart/form-data -> /api/public-applications/public-apply (offerId, applicantName, applicantEmail, message, cv)
 * - Affiche une barre de progression lors de l'upload
 */

type OfferFromApi = {
  _id?: string;
  title?: string;
  description?: string;
  domain?: string;
  contractType?: string;
  createdBy?: { _id?: string; name?: string; email?: string } | string | null;
  tags?: string[];
  createdAt?: string;
};

const OfferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<OfferFromApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // candidature state
  const [applyOpen, setApplyOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    fetch(`http://localhost:5000/api/offers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Impossible de récupérer l'offre (${res.status})`);
        return res.json();
      })
      .then((data) => setOffer(data))
      .catch((err) => {
        console.error(err);
        setError(err.message || "Erreur lors du chargement");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const recruiter = typeof offer?.createdBy === "object" ? (offer?.createdBy as any) : undefined;
  const recruiterEmail = recruiter?.email ?? "";

  const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "—");

  const openApply = () => {
    setApplyOpen(true);
    setSuccessMsg(null);
    setSubmitError(null);
    setProgress(0);
  };
  const closeApply = () => {
    if (uploading) return; // éviter de fermer pendant upload
    setApplyOpen(false);
    setFile(null);
    setName("");
    setEmail("");
    setMessage("");
    setUploading(false);
    setProgress(0);
    setSubmitError(null);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setFile(f ?? null);
  };

  const submitApplication = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitError(null);
    setSuccessMsg(null);

    // validation basique
    if (!name.trim() || !email.trim()) {
      setSubmitError("Nom et email sont requis.");
      return;
    }

    if (!id) {
      setSubmitError("Offre inconnue.");
      return;
    }

    const form = new FormData();
    form.append("offerId", id);
    form.append("applicantName", name.trim());
    form.append("applicantEmail", email.trim());
    form.append("message", message.trim());
    if (file) form.append("cv", file);

    // Utiliser XMLHttpRequest pour pouvoir suivre la progression d'upload
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/api/public-applications/public-apply", true);

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        const pct = Math.round((ev.loaded / ev.total) * 100);
        setProgress(pct);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          setSuccessMsg(`Candidature envoyée (id: ${res.applicationId}). Merci !`);
          // reset form fields while keeping modal open to show message
          setName("");
          setEmail("");
          setMessage("");
          setFile(null);
          setProgress(100);
        } catch (err) {
          setSubmitError("Réponse inattendue du serveur.");
        }
      } else {
        // tenter de lire message d'erreur renvoyé par le backend
        try {
          const res = JSON.parse(xhr.responseText);
          setSubmitError(res.message || `Erreur serveur (${xhr.status})`);
        } catch {
          setSubmitError(`Erreur lors de l'envoi (${xhr.status})`);
        }
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setSubmitError("Erreur réseau lors de l'envoi.");
    };

    setUploading(true);
    setProgress(0);
    xhr.send(form);
  };

  if (loading) return <div className="p-6">Chargement de l'offre…</div>;
  if (error) return <div className="p-6 text-red-600">Erreur: {error}</div>;
  if (!offer) return <div className="p-6">Offre introuvable.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/offres" className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Retour aux offres</Link>

      <article className="bg-white rounded-lg shadow p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-bold mb-1">{offer.title}</h1>
          <div className="text-sm text-gray-600">
            {offer.domain} • {offer.contractType ?? "Type non précisé"} • Publié le {formatDate(offer.createdAt)}
          </div>
          {recruiter?.name && <div className="text-sm text-gray-500 mt-1">Recruteur : {recruiter.name}</div>}
          {recruiter?.email && <div className="text-sm text-gray-500">Email recruteur : {recruiter.email}</div>}
        </header>

        <section className="prose max-w-none text-gray-800 mb-6">
          <p style={{ whiteSpace: "pre-wrap" }}>{offer.description}</p>
        </section>

        {offer.tags && offer.tags.length > 0 && (
          <div className="mb-4 flex gap-2 flex-wrap">
            {offer.tags.map((t) => (
              <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={openApply} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Postuler</button>
          <Link to="/publish-offer" state={{ prefill: { title: offer.title, company: recruiter?.name, domain: offer.domain, description: offer.description } }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Publier similaire</Link>
        </div>
      </article>

      {/* Apply modal */}
      {applyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeApply} />
          <div className="relative bg-white rounded shadow-lg w-full max-w-xl p-6 z-10">
            <h2 className="text-xl font-semibold mb-2">Postuler à l'offre</h2>
            <p className="text-sm text-gray-600 mb-4">Remplissez le formulaire ci‑dessous et joignez votre CV. Le serveur acceptera .pdf, .doc, .docx (max 5MB).</p>

            <form onSubmit={(e) => { e.preventDefault(); submitApplication(); }} className="grid gap-3">
              <label className="block">
                <div className="text-sm text-gray-700">Nom *</div>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" placeholder="Ton nom complet" disabled={uploading} />
              </label>

              <label className="block">
                <div className="text-sm text-gray-700">Email *</div>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" placeholder="ton@exemple.com" disabled={uploading} />
              </label>

              <label className="block">
                <div className="text-sm text-gray-700">Message</div>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" rows={4} placeholder="Pourquoi vous postulez…" disabled={uploading} />
              </label>

              <label className="block">
                <div className="text-sm text-gray-700">CV (optionnel)</div>
                <input type="file" accept=".pdf,.doc,.docx" onChange={onFileChange} className="mt-2" disabled={uploading} />
                {file && <div className="text-xs text-gray-500 mt-1">Fichier sélectionné : {file.name}</div>}
              </label>

              {uploading && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded overflow-hidden">
                    <div style={{ width: `${progress}%` }} className="h-full bg-green-600 transition-all" />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{progress}%</div>
                </div>
              )}

              {submitError && <div className="text-red-600 text-sm">{submitError}</div>}
              {successMsg && <div className="text-green-600 text-sm">{successMsg}</div>}

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={closeApply} className="px-4 py-2 border rounded" disabled={uploading}>Annuler</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" disabled={uploading}>
                  {uploading ? "Envoi..." : "Envoyer ma candidature"}
                </button>
              </div>
            </form>

            {/* mailto fallback if you want */}
            <div className="mt-4 text-xs text-gray-500">
              Si vous préférez, vous pouvez aussi envoyer un email directement à {recruiterEmail || "l'adresse du recruteur"}.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferDetail;