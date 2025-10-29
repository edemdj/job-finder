const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const offerRoutes = require('./src/routes/offers');
const userRoutes = require('./src/routes/users');
const applicationRoutes = require('./src/routes/applications');
const connectDB = require('./config/db');

const app = express();
const profileCvUpload = require('./routes/profileCvUpload');

// Middleware pour parser le corps des requêtes
app.use(bodyParser.json());
app.use(profileCvUpload);

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/jobfinder_benin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error) => console.error('Erreur de connexion à MongoDB:', error));

// Connexion à MongoDB avec Mongoose
connectDB();
// Routes
app.use('/api', offerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/uploads/cv', express.static(path.join(__dirname, 'routes', 'uploads', 'cv')));

app.get('/', (req, res) => {
    res.send('API JobFinder Benin');
    });

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
