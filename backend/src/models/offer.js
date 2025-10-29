const mongoose = require('mongoose');

// Schéma de l'offre
const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    domain: { type: String, required: true },
    contractType: { type: String, enum: ['CDI', 'CDD'], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Exporter le modèle
const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
