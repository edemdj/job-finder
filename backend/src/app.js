// backend/src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const offerRoutes = require('./routes/offers');
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/publicApplications');
const authRoutes = require('./routes/auth');
const publicApplicationsRoutes = require('./routes/publicApplications');

const app = express();

// --- CORS ---
// Autorisations d'origines (FRONTEND_URL à définir dans Railway pour la prod)
const allowedOrigins = [
  (process.env.FRONTEND_URL || '').trim(), // ex: https://beninwork.netlify.app (défini en prod)
  'http://localhost:5173'                  // dev local Vite
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // origin peut être undefined (ex: requêtes via curl/postman) => autoriser
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Origin non autorisée par CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());

// --- MongoDB ---
// En prod, FORCE la présence de MONGO_URI pour éviter de tenter localhost dans le conteneur
let mongoUri = process.env.MONGO_URI && process.env.MONGO_URI.trim();
if (!mongoUri && process.env.NODE_ENV === 'production') {
  console.error('MONGO_URI non défini en production. Ajoute la variable d\'environnement MONGO_URI.');
  process.exit(1);
}
// En dev, fallback local pratique
mongoUri = mongoUri || 'mongodb://localhost:27017/jobfinder_benin';

mongoose.connect(mongoUri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Erreur de connexion à MongoDB:', error));

// servir les fichiers uploadés (vérifie le bon chemin selon ta structure)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/public-applications', publicApplicationsRoutes);

app.get('/', (req, res) => res.send('API JobFinder Benin'));

// Port depuis .env si présent (Railway fournit process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));