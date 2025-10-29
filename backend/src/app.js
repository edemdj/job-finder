const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const offerRoutes = require('./routes/offers');
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/applications');
const authRoutes = require('./routes/auth');
const cors = require('cors');




const app = express();

// Middleware pour autoriser les requêtes de n'importe quelle origine
// Permettre les requêtes de votre frontend
app.use(cors({
    origin: 'http://localhost:5173', // Remplacez par l'URL de votre frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  }));

// Middleware pour parser le corps des requêtes
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/jobfinder_benin', {
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

app.get('/', (req, res) => {
  res.send('API JobFinder Benin');
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
