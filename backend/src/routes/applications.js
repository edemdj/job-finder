const express = require('express');
const Application = require('../models/application');
const Offer = require('../models/offer');
const User = require('../models/user');
const router = express.Router();

// 1. Récupérer toutes les candidatures d'un utilisateur
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const applications = await Application.find({ userId }).populate('offerId', 'title description');
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des candidatures', error });
  }
});

// 2. Récupérer toutes les candidatures pour une offre
router.get('/offer/:offerId', async (req, res) => {
  const { offerId } = req.params;

  try {
    const applications = await Application.find({ offerId }).populate('userId', 'name email');
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des candidatures pour l\'offre', error });
  }
});

// 3. Soumettre une candidature pour une offre
router.post('/apply', async (req, res) => {
  const { offerId, userId } = req.body;

  try {
    // Vérifier si l'offre existe
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Créer une nouvelle candidature
    const application = new Application({
      offerId,
      userId,
      status: 'en attente',
    });

    await application.save();
    res.status(201).json({ message: 'Candidature soumise avec succès', application });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la soumission de la candidature', error });
  }
});

// 4. Mettre à jour le statut d'une candidature (par exemple, acceptée ou rejetée)
router.put('/update-status/:applicationId', async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  try {
    // Vérifier si le statut est valide
    if (!['en attente', 'acceptée', 'rejetée'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    // Mettre à jour la candidature
    const application = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });

    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    res.json({ message: 'Statut de la candidature mis à jour', application });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error });
  }
});

module.exports = router;
