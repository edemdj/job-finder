// Ajouter en haut du fichier
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const offerRoutes = require('./routes/offers');
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/applications');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const path = require('path'); // si jamais utilisé pour static files

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
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error) => console.error('Erreur de connexion à MongoDB:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => res.send('API JobFinder Benin'));

// Port depuis .env si présent
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));