const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true }, // Nouveau champ obligatoire
  userType: { 
    type: String, 
    required: true, 
    enum: ['employer', 'job-seeker'] // Exemple : employer ou chercheur d'emploi
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
