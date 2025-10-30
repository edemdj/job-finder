const express = require('express');
const mongoose = require('mongoose'); // <-- ajouter si pas présent
const Offer = require('../models/offer');
const router = express.Router();

// GET /api/offers/:id - récupérer une offre par id (validation d'id)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // validation simple : check ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Identifiant invalide' });
    }

    const offer = await Offer.findById(id).populate('createdBy', 'name email');
    if (!offer) return res.status(404).json({ message: 'Offre non trouvée' });

    res.json(offer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'offre", error });
  }
});