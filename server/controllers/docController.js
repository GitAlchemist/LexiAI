// In-memory fallback store if MongoDB is offline
const documentHistoryStore = [];

// Save Audited Document Analysis
exports.saveDocumentAnalysis = async (req, res) => {
  try {
    const { fileName, summary, riskScore, identifiedRisks, missingClauses } = req.body;

    const newRecord = {
      id: Date.now().toString(),
      fileName: fileName || 'Contract_Audit.pdf',
      summary,
      riskScore,
      identifiedRisks,
      missingClauses,
      createdAt: new Date().toISOString()
    };

    documentHistoryStore.unshift(newRecord);

    res.status(201).json({
      message: 'Analysis record saved successfully',
      data: newRecord
    });
  } catch (err) {
    console.error('Save Document Error:', err.message);
    res.status(500).json({ error: 'Failed to save document analysis' });
  }
};

// Get All Recent Document Audits
exports.getAuditHistory = async (req, res) => {
  try {
    res.json({
      total: documentHistoryStore.length,
      history: documentHistoryStore
    });
  } catch (err) {
    console.error('Get History Error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve audit history' });
  }
};