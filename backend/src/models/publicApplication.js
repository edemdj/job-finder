const mongoose = require('mongoose');

const publicApplicationSchema = new mongoose.Schema(
  {
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    message: { type: String },
    cvPath: { type: String }, // chemin relatif sur le disque, par ex. uploads/cvs/...
    cvOriginalName: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PublicApplication', publicApplicationSchema);