const express = require('express');
const Offer = require('../models/offer');
const router = express.Router();

// Récupérer toutes les offres
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json({ offers });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des offres', error });
  }
});

// Route pour créer une offre
router.post('/', async (req, res) => {
  try {
    const { title, description, domain, contractType, createdBy } = req.body;

    // Création de l'offre
    const newOffer = new Offer({
      title,
      description,
      domain,
      contractType,
      createdBy
    });

    // Sauvegarde dans la base de données
    await newOffer.save();

    res.status(201).json(newOffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de l'offre" });
  }
});

module.exports = router;