const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// Document Analyzer Route
router.post('/analyze-contract', upload.single('file'), async (req, res) => {
  try {
    let documentText = '';

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

    if (!groq) {
      return res.status(500).json({ error: 'Groq API Key is missing on Render.' });
    }

    let completion;
    const systemPrompt = 'You are an expert legal document auditor. Analyze the contract text and return ONLY a valid JSON object in this format: {"riskScore": 65, "summary": "Summary text", "identifiedRisks": [{"type": "Uncapped Liability", "severity": "HIGH", "description": "Details"}]}';

    try {
      completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this document:\n\n${documentText.slice(0, 10000)}` }
        ],
        model: 'openai/gpt-oss-120b',
        response_format: { type: "json_object" }
      });
    } catch (modelErr) {
      completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this document:\n\n${documentText.slice(0, 10000)}` }
        ],
        model: 'openai/gpt-oss-20b',
        response_format: { type: "json_object" }
      });
    }

    const rawContent = completion.choices[0]?.message?.content || '{}';
    const parsedData = JSON.parse(rawContent);

    return res.json(parsedData);

  } catch (err) {
    console.error('Analyzer Route Error:', err);
    return res.status(500).json({ 
      error: 'Failed to parse document', 
      details: err.message 
    });
  }
});

// AI Chat Legal Assistant Route
router.post('/chat', async (req, res) => {
  try {
    const { prompt, scope, message, query, userMessage, text } = req.body;
    const finalPrompt = query || prompt || message || userMessage || text || '';

    if (!finalPrompt || !finalPrompt.trim()) {
      return res.status(400).json({ error: 'Message or query text is required.' });
    }

    if (!groq) {
      return res.status(500).json({ error: 'Groq API Key is not configured on Render server.' });
    }

    const systemPrompt = `You are LexiAI, an expert legal consultant specializing in ${scope || 'general legal inquiries'}. Provide clear, accurate legal guidance.`;

    let completion;
    try {
      completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: finalPrompt }
        ],
        model: 'llama-3.1-8b-instant'
      });
    } catch (modelErr) {
      completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: finalPrompt }
        ],
        model: 'llama3-8b-8192'
      });
    }

    const reply = completion.choices[0]?.message?.content || 'No response generated.';

    // Return all common property keys so frontend component parses the response cleanly
    return res.json({ 
      reply: reply, 
      response: reply, 
      result: reply,
      answer: reply
    });

  } catch (err) {
    console.error('Chat Route Error:', err);
    return res.status(500).json({ error: 'Failed to generate chat response', details: err.message });
  }
});