const mongoose = require('mongoose');

const DocumentAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileName: String,
  summary: String,
  riskScore: Number,
  identifiedRisks: Array,
  missingClauses: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DocumentAnalysis', DocumentAnalysisSchema);