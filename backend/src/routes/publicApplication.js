const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Offer = require('../models/offer');
const PublicApplication = require('../models/publicApplication');

const router = express.Router();

// Storage configuration
const uploadDir = path.join(__dirname, '../../uploads/cvs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  }
});

// Accept PDFs and Word docs only (basic filter)
const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Type de fichier non autorisé. Autorisé: .pdf, .doc, .docx'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

// POST /api/public-applications/public-apply
// Fields expected: offerId, applicantName, applicantEmail, message (optional), cv (file optional)
router.post('/public-apply', upload.single('cv'), async (req, res) => {
  try {
    const { offerId, applicantName, applicantEmail, message } = req.body;

    // Basic validation
    if (!offerId || !mongoose.Types.ObjectId.isValid(offerId)) {
      // remove uploaded file if any
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'offerId manquant ou invalide' });
    }
    if (!applicantName || !applicantEmail) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'applicantName et applicantEmail sont requis' });
    }

    // Verify offer exists
    const offer = await Offer.findById(offerId).select('title');
    if (!offer) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    const applicationData = {
      offerId,
      applicantName,
      applicantEmail,
      message: message || '',
    };

    if (req.file) {
      // store relative path so we can build URLs later
      applicationData.cvPath = path.relative(path.join(__dirname, '../../'), req.file.path).replace(/\\/g, '/'); // e.g. uploads/cvs/123.pdf
      applicationData.cvOriginalName = req.file.originalname;
    }

    const appDoc = new PublicApplication(applicationData);
    await appDoc.save();

    // Optionally: notify the recruiter (email) here (not implemented)

    res.status(201).json({ message: 'Candidature reçue', applicationId: appDoc._id });
  } catch (err) {
    console.error('Error public-apply:', err);
    // If multer uploaded file and there was an error, try to clean it
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
    res.status(500).json({ message: 'Erreur lors de la soumission de la candidature', error: err.message || err });
  }
});

// (Optionnel) Endpoint for downloading CVs - PROTECT in production
router.get('/cv/:filename', (req, res) => {
  const filename = req.params.filename;
  const fullPath = path.join(uploadDir, filename);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ message: 'Fichier non trouvé' });
  res.download(fullPath);
});

module.exports = router;