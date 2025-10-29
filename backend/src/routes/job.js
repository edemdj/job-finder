// backend/src/routes/job.js
const express = require('express');
const router = express.Router();

// Exemple de route pour obtenir les offres d'emploi
router.get('/', (req, res) => {
  res.send('Liste des offres d\'emploi');
});

// Exemple de route pour ajouter une offre d'emploi
router.post('/', (req, res) => {
  // Logic pour ajouter une offre d'emploi
  res.send('Offre d\'emploi ajoutée');
});

module.exports = router;
