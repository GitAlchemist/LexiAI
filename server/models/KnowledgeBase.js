const mongoose = require('mongoose');

const KnowledgeBaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Personal & Civil Laws (Marriage, Property, Succession)',
      'Labor & Employment Laws',
      'Company & Startup Laws',
      'Data Privacy & IT Laws',
      'Consumer Protection & Disputes'
    ]
  },
  jurisdiction: {
    type: String,
    default: 'India (Personal, Civil & Labor Laws)'
  },
  statuteReference: {
    type: String,
    required: true
  },
  standardClauseText: {
    type: String,
    required: true
  },
  riskSeverity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  tags: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);