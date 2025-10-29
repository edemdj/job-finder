const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assurez-vous que le modèle User existe
const router = express.Router();

// Clé secrète pour JWT
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete';

// 1. Inscription
router.post('/register', async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userType, // Par exemple : "employer" ou "seeker"
    });

    // Sauvegarder dans la base de données
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error });
  }
});

// 2. Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Connexion réussie', token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
});

// 3. Obtenir les informations de l'utilisateur connecté
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token invalide ou expiré', error });
  }
});

// 4. Mettre à jour les informations de l'utilisateur
router.put('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, email, userType } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mettre à jour les informations
    user.name = name || user.name;
    user.email = email || user.email;
    user.userType = userType || user.userType;

    await user.save();

    res.json({ message: 'Profil mis à jour avec succès', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error });
  }
});

module.exports = router;
