const express = require('express');
const mongoose = require('mongoose');
const Offer = require('../models/offer');
const router = express.Router();

// GET all
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json({ offers });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des offres', error });
  }
});

// GET by id (validate id to avoid CastError)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Identifiant invalide' });
    }
    const offer = await Offer.findById(id).populate('createdBy', 'name email');
    if (!offer) return res.status(404).json({ message: 'Offre non trouvée' });
    res.json(offer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'offre', error });
  }
});

// POST create (existing code)
router.post('/', async (req, res) => {
  try {
    const { title, description, domain, contractType, createdBy } = req.body;
    const newOffer = new Offer({ title, description, domain, contractType, createdBy });
    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de l'offre" });
  }
});

module.exports = router;