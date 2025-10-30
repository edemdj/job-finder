// Ajouter en haut du fichier
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // <--- UNE seule déclaration de `path`
const offerRoutes = require('./routes/offers');
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/publicApplications');
const authRoutes = require('./routes/auth');
const publicApplicationsRoutes = require('./routes/publicApplications'); // route des candidatures publiques (upload CV)
const cors = require('cors');

const app = express();

// CORS (ex : frontend en dev sur 5173)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(bodyParser.json());

// Connexion à MongoDB via variable d'environnement
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/jobfinder_benin';
mongoose.connect(mongoUri, {
  // Les options useNewUrlParser et useUnifiedTopology sont dépréciées pour les versions récentes de Mongoose/driver,
  // Mongoose les gère lui-même ; les garder ne pose pas d'erreur mais tu peux les enlever si tu veux.
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error) => console.error('Erreur de connexion à MongoDB:', error));

// servir les fichiers uploadés (uploads/) en statique pour tests (ex: CVs)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

// Route publique pour postuler (upload CV)
app.use('/api/public-applications', publicApplicationsRoutes);

app.get('/', (req, res) => res.send('API JobFinder Benin'));

// Port depuis .env si présent
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));