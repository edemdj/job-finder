const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Créer le dossier d'upload s'il n'existe pas
const UPLOADS_DIR = path.join(__dirname, "uploads", "cv");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Utilisez l'identifiant unique de l'utilisateur (par exemple : req.user.id)
    // Ici, on suppose que le middleware d'authentification ajoute req.user
    const userId = req.user ? req.user.id : "anonymous";
    const ext = path.extname(file.originalname);
    cb(null, `${userId}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
});

// Middleware d’auth exemple
function authMiddleware(req, res, next) {
  // À remplacer par votre vraie logique d’authentification
  // Par exemple, décoder le JWT et mettre req.user
  req.user = { id: "user123" }; // À remplacer !
  next();
}

// Route d'upload du CV
router.post(
  "/api/profile/upload-cv",
  authMiddleware,
  upload.single("cv"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier envoyé." });
    }
    // Ici, on pourrait mettre à jour la base de données utilisateur avec le chemin du fichier
    // Exemple : await User.findByIdAndUpdate(req.user.id, { cv: req.file.filename });

    res.json({
      message: "CV chargé avec succès !",
      file: req.file.filename,
      path: `/uploads/cv/${req.file.filename}`,
    });
  }
);

module.exports = router;