// backend/seed.js
// Usage: cd backend && node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./src/models/user');
const Offer = require('./src/models/offer');

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/jobfinder';
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB for seeding');

  // Créer (ou récupérer) un user de seed
  const email = 'seed@example.test';
  let user = await User.findOne({ email });
  if (!user) {
    const hashed = await bcrypt.hash('password123', 10);
    user = new User({
      name: 'Seed User',
      email,
      password: hashed,
      phoneNumber: '0000000000',
      userType: 'employer' // <-- usage d'une valeur valide pour l'enum
    });
    await user.save();
    console.log('Utilisateur seed créé:', user._id.toString());
  } else {
    console.log('Utilisateur seed existant:', user._id.toString());
  }

  // Offres fictives
  const sampleOffers = [
    {
      title: 'Développeur React',
      description: "Développement d'interfaces modernes en React + TypeScript. Connaissance de Vite et Tailwind appréciée.",
      domain: 'Technologie',
      contractType: 'CDI',
    },
    {
      title: 'Designer UX/UI',
      description: "Conception d'interfaces, prototypage et tests utilisateurs. Portfolio requis.",
      domain: 'Design',
      contractType: 'CDD',
    },
    {
      title: 'Responsable Marketing Digital',
      description: "Planification et exécution des campagnes digitales, SEO/SEA, gestion d'équipe.",
      domain: 'Marketing',
      contractType: 'CDI',
    },
    {
      title: 'Support IT - Niveau 1',
      description: "Assistance aux utilisateurs, tickets et maintenance de premier niveau.",
      domain: 'Support',
      contractType: 'CDD',
    },
    {
      title: 'Chef de projet IT',
      description: "Coordination d'équipes techniques et suivi delivery.",
      domain: 'Management',
      contractType: 'CDI',
    }
  ];

  // Insérer les offres (éviter doublons en matchant title + createdBy)
  for (const o of sampleOffers) {
    const exists = await Offer.findOne({ title: o.title, createdBy: user._id });
    if (!exists) {
      const newOffer = new Offer({ ...o, createdBy: user._id, isSeed: true });
      await newOffer.save();
      console.log('Offre créée:', newOffer.title);
    } else {
      console.log('Offre existante, skip:', o.title);
    }
  }

  console.log('Seeding terminé.');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Erreur during seed:', err);
  process.exit(1);
});