import React, { useState, useEffect } from "react";

const Profile = () => {
  const [userType, setUserType] = useState<"entreprise" | "particulier" | null>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "", // Numéro de téléphone pour particulier et entreprise
    domaine: "", // Domaine d'activité pour entreprise
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTypeChange = (type: "entreprise" | "particulier") => {
    setUserType(type);
    // Réinitialiser les champs spécifiques lors du changement de type
    setProfileData({
      name: "",
      email: "",
      phone: "",
      domaine: "",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...profileData, userType }),
      });

      if (response.ok) {
        setMessage("Profil mis à jour avec succès !");
      } else {
        throw new Error("Échec de la mise à jour.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la mise à jour. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Gérer votre profil</h1>
        {message && <p className="mb-4 text-center text-blue-600">{message}</p>}

        {/* Choix du type d'utilisateur */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Type de profil</label>
          <div className="mt-2 flex gap-4">
            <button
              onClick={() => handleTypeChange("particulier")}
              className={`px-4 py-2 rounded ${
                userType === "particulier" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Particulier
            </button>
            <button
              onClick={() => handleTypeChange("entreprise")}
              className={`px-4 py-2 rounded ${
                userType === "entreprise" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Entreprise
            </button>
          </div>
        </div>

        {userType && (
          <form onSubmit={handleUpdate}>
            {/* Champs communs */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {userType === "entreprise" ? "Nom de l'entreprise" : "Nom"}
              </label>
              <input
                id="name"
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Numéro de téléphone
              </label>
              <input
                id="phone"
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Champs spécifiques à l'entreprise */}
            {userType === "entreprise" && (
              <div className="mb-4">
                <label htmlFor="domaine" className="block text-sm font-medium text-gray-700">
                  Domaine d'activité
                </label>
                <input
                  id="domaine"
                  type="text"
                  value={profileData.domaine}
                  onChange={(e) => setProfileData({ ...profileData, domaine: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
              disabled={loading}
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
