const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');

// Configure multer for memory buffer storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Groq SDK safely
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// Document Analyzer Route
router.post('/analyze-contract', upload.single('file'), async (req, res) => {
  try {
    let documentText = '';

    // Handle PDF file buffer or raw text body
    if (req.file) {
      if (req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf')) {
        const parsedPdf = await pdfParse(req.file.buffer);
        documentText = parsedPdf.text;
      } else {
        documentText = req.file.buffer.toString('utf-8');
      }
    } else if (req.body && req.body.text) {
      documentText = req.body.text;
    }

    if (!documentText || !documentText.trim()) {
      return res.status(400).json({ error: 'No readable text extracted from document' });
    }

    // Fallback if GROQ_API_KEY is not available
    if (!groq) {
      return res.status(500).json({ error: 'Groq API Key is not configured on Render server.' });
    }

    // Query Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert legal document auditor. Analyze the contract text and return a JSON summary with riskScore, keyClauses, and summary.'
        },
        {
          role: 'user',
          content: `Analyze this document:\n\n${documentText.slice(0, 12000)}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const analysis = completion.choices[0]?.message?.content || 'Analysis completed.';
    return res.json({ success: true, analysis });

  } catch (err) {
    console.error('Analyzer Route Error:', err);
    return res.status(500).json({ 
      error: 'Failed to parse document', 
      details: err.message 
    });
  }
});

module.exports = router;