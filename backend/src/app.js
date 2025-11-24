// backend/src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const offerRoutes = require('./routes/offers');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const publicApplicationsRoutes = require('./routes/publicApplications');

const app = express();

// --- CORS ---
// FRONTEND_URLS peut contenir plusieurs origines séparées par des virgules.
// Exemple .env (local) : FRONTEND_URLS=https://beninwork.netlify.app,http://localhost:5173
const envOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Toujours autoriser le dev local Vite pendant le développement
if (process.env.NODE_ENV !== 'production' && !envOrigins.includes('http://localhost:5173')) {
  envOrigins.push('http://localhost:5173');
}

app.use(cors({
  origin: (origin, callback) => {
    // origin peut être undefined (ex: requêtes via curl/postman) => autoriser
    if (!origin) return callback(null, true);
    if (envOrigins.includes(origin)) return callback(null, true);
    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Origin non autorisée par CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());

// --- MongoDB ---
// En production, exiger MONGO_URI pour éviter d'essayer de se connecter à localhost dans le conteneur
let mongoUri = process.env.MONGO_URI && process.env.MONGO_URI.trim();
if (!mongoUri && process.env.NODE_ENV === 'production') {
  console.error('MONGO_URI non défini en production. Ajoute la variable d\'environnement MONGO_URI.');
  process.exit(1);
}
// fallback en dev
mongoUri = mongoUri || 'mongodb://localhost:27017/jobfinder_benin';

mongoose.connect(mongoUri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Erreur de connexion à MongoDB:', error));

// servir les fichiers uploadés (vérifie le chemin selon ta structure)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', publicApplicationsRoutes);
app.use('/api/public-applications', publicApplicationsRoutes);

app.get('/', (req, res) => res.send('API JobFinder Benin'));

// Port depuis .env si présent (Railway fournit process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));