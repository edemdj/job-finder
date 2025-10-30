const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const Offer = require('../models/offer');
const PublicApplication = require('../models/publicApplication');

const router = express.Router();

// CONFIG: lire vars d'environnement
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:5000';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@example.test';

// si SMTP configuré, on initialise Nodemailer transporter
let mailer = null;
if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  mailer = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

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
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
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
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'offerId manquant ou invalide' });
    }
    if (!applicantName || !applicantEmail) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'applicantName et applicantEmail sont requis' });
    }

    // Verify offer exists and populate createdBy to get recruiter info
    const offer = await Offer.findById(offerId).populate('createdBy', 'name email');
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
      applicationData.cvPath = path.relative(path.join(__dirname, '../../'), req.file.path).replace(/\\/g, '/'); // e.g. uploads/cvs/123.pdf
      applicationData.cvOriginalName = req.file.originalname;
    }

    const appDoc = new PublicApplication(applicationData);
    await appDoc.save();

    // Send notification email to recruiter if email present (not blocking)
    (async () => {
      try {
        const recruiterEmail = offer.createdBy && offer.createdBy.email ? offer.createdBy.email : null;
        if (!mailer) {
          console.warn('Mailer not configured (SMTP vars missing) — skipping email notification');
          return;
        }

        // Build download link if CV was uploaded
        let cvLink = null;
        if (appDoc.cvPath) {
          const fname = path.basename(appDoc.cvPath);
          // use the router download endpoint
          cvLink = `${APP_BASE_URL}/api/public-applications/cv/${encodeURIComponent(fname)}`;
        }

        const mailTo = recruiterEmail || process.env.ADMIN_NOTIFICATION_EMAIL || EMAIL_FROM;
        const subject = `Nouvelle candidature pour "${offer.title}"`;
        const lines = [
          `Une nouvelle candidature a été reçue pour l'offre "${offer.title}".`,
          '',
          `Candidat: ${appDoc.applicantName} <${appDoc.applicantEmail}>`,
          `Message: ${appDoc.message || '(aucun)'}`,
          `Date: ${appDoc.createdAt || appDoc.appliedAt || new Date().toISOString()}`,
          '',
        ];
        if (cvLink) lines.push(`Télécharger le CV: ${cvLink}`);
        lines.push('');
        lines.push(`Accéder à l'administration: ${APP_BASE_URL}/admin/applications?offerId=${offer._id}`);

        const mailOptions = {
          from: EMAIL_FROM,
          to: mailTo,
          subject,
          text: lines.join('\n'),
          html: `<p>Une nouvelle candidature a été reçue pour l'offre "<strong>${offer.title}</strong>".</p>
                 <p><strong>Candidat:</strong> ${appDoc.applicantName} &lt;${appDoc.applicantEmail}&gt;</p>
                 <p><strong>Message:</strong><br/>${(appDoc.message || '(aucun)').replace(/\n/g, '<br/>')}</p>
                 ${cvLink ? `<p><a href="${cvLink}">Télécharger le CV</a></p>` : ''}
                 <p><a href="${APP_BASE_URL}/admin/applications?offerId=${offer._id}">Voir dans l'administration</a></p>`
        };

        await mailer.sendMail(mailOptions);
        console.log(`Notification email envoyée à ${mailTo} pour candidature ${appDoc._id}`);
      } catch (err) {
        console.error('Erreur lors de l\'envoi du mail de notification:', err);
      }
    })();

    res.status(201).json({ message: 'Candidature reçue', applicationId: appDoc._id });
  } catch (err) {
    console.error('Error public-apply:', err);
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
    res.status(500).json({ message: 'Erreur lors de la soumission de la candidature', error: err.message || err });
  }
});

// GET /api/public-applications
// List applications. Optional query: ?offerId=<id> or ?recruiterId=<userId> (to get apps for offers owned by recruiter)
router.get('/', async (req, res) => {
  try {
    const { offerId, recruiterId } = req.query;

    let filter = {};
    if (offerId) {
      if (!mongoose.Types.ObjectId.isValid(String(offerId))) return res.status(400).json({ message: 'offerId invalide' });
      filter = { offerId: String(offerId) };
    } else if (recruiterId) {
      if (!mongoose.Types.ObjectId.isValid(String(recruiterId))) return res.status(400).json({ message: 'recruiterId invalide' });
      // find offers created by recruiter
      const offers = await Offer.find({ createdBy: recruiterId }).select('_id');
      const offerIds = offers.map((o) => o._id);
      filter = { offerId: { $in: offerIds } };
    }

    const apps = await PublicApplication.find(filter).sort({ createdAt: -1 }).lean();

    // Enrich with offer title and cv download URL
    const enriched = await Promise.all(apps.map(async (a) => {
      const offer = await Offer.findById(a.offerId).select('title createdBy').populate('createdBy', 'name email');
      const cvUrl = a.cvPath ? `${APP_BASE_URL}/api/public-applications/cv/${encodeURIComponent(path.basename(a.cvPath))}` : null;
      return {
        ...a,
        offerTitle: offer ? offer.title : null,
        recruiter: offer && offer.createdBy ? offer.createdBy : null,
        cvUrl,
      };
    }));

    res.json({ applications: enriched });
  } catch (err) {
    console.error('Error listing public applications:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des candidatures', error: err.message || err });
  }
});

// (Optionnel) Endpoint to download CVs for testing. Protect in prod.
router.get('/cv/:filename', (req, res) => {
  const filename = req.params.filename;
  const fullPath = path.join(uploadDir, filename);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ message: 'Fichier non trouvé' });
  res.download(fullPath);
});

module.exports = router;