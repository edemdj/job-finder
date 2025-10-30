const mongoose = require('mongoose');

// Schéma de l'offre
const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    domain: { type: String, required: true },
    contractType: { type: String, enum: ['CDI', 'CDD'], required: true },
    // createdBy rendu optionnel pour permettre la création d'offres sans user lors du développement
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // marque pour reconnaitre les offres seed et pouvoir les purger plus tard
    isSeed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Exporter le modèle
const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;