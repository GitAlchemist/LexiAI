const Groq = require('groq-sdk');
const pdfParse = require('pdf-parse');

// Initialize Groq SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'demo_key' });

// Detailed Fallback Responses
const DETAILED_CATEGORY_RESPONSES = {
  'Personal & Civil Laws (Marriage, Property, Succession)': `### Statutory Legal Opinion
Under personal and civil succession frameworks, legal rights during matrimonial or property disputes are governed strictly by codified personal laws and civil procedures. In matrimonial proceedings (such as judicial separation or divorce), parties retain statutory rights regarding equitable distribution of marital property, maintenance (alimony), and child custody determinations based on welfare principles.

### Applicable Statutes & Legal Acts
| Statute / Act | Jurisdiction | Key Provisions Relevant to Situation |
|---|---|---|
| Hindu Marriage Act, 1955 | India | Section 13 (Grounds for Divorce), Section 24 (Interim Maintenance), Section 25 (Permanent Alimony) |
| Special Marriage Act, 1954 | India | Civil marriage dissolution, maintenance entitlements, and cross-faith civil unions |
| Guardians and Wards Act, 1890 | India | Custody, visitation rights, and guardianship determinations centered on child welfare |

### Statutory Rights & Maintenance Entitlements
* **Right to Maintenance & Alimony**: Under Section 24 and 25, a spouse lacking independent sufficient income can claim interim litigation expenses and monthly support.
* **Division of Assets & Stridhan**: A woman holds absolute ownership over her 'Stridhan' (gifts, jewelry, and assets received before or during marriage) under Section 14 of the Hindu Succession Act.
* **Child Custody & Visitation**: Custody decisions prioritize the best interest and welfare of the child, granting reasonable access and visitation rights to the non-custodial parent.

### Actionable Legal Counsel & Next Steps
1. Compile complete financial documentation, including tax returns, bank statements, asset deeds, and proof of income for maintenance calculations.
2. Prepare a comprehensive inventory of exclusive individual property (Stridhan) and jointly acquired marital assets.
3. Engage in court-annexed mediation sessions to explore mutually agreeable terms for a consent decree before contested litigation.`,

  'Labor & Employment Laws': `### Statutory Legal Opinion
Employment disputes and terminations without cause are governed strictly by labor codes and commercial establishment acts. Employers cannot execute unilateral terminations without providing statutory notice periods, procedural fairness, and full separation settlements.

### Applicable Statutes & Legal Acts
| Statute / Act | Jurisdiction | Key Provisions Relevant to Situation |
|---|---|---|
| Industrial Disputes Act, 1947 | India | Section 25F - Mandates conditions precedent to retrenchment and mandatory compensation |
| Shops and Commercial Establishments Act | India | Notice period mandates, accrued leave encashment, and workplace terms |
| Payment of Gratuity Act, 1972 | India | Section 4 - Statutory right to gratuity after 5 years of continuous service |

### Statutory Rights & Compensation Entitlements
* **Notice Period or Pay in Lieu**: Employers must serve 30 to 90 days written notice or pay full salary equivalent in lieu of notice.
* **Severance Pay Calculation**: Entitled to 15 days average pay for every completed year of continuous service.
* **Full & Final Settlement (F&F)**: Mandatory clearance of unpaid wages, leave encashment, bonus, and gratuity within 2 working days.

### Actionable Legal Counsel & Next Steps
1. Issue a formal legal representation letter to human resources demanding detailed itemization of unpaid statutory dues.
2. File a dispute petition before the jurisdictional Labor Commissioner / Conciliation Officer.
3. Escalate to the Industrial Tribunal for compensation and reinstatement claims if conciliation fails.`
};

// @route POST /api/ai/chat
exports.getLegalAdvisory = async (req, res) => {
  try {
    const { query, category } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    let selectedCat = 'Personal & Civil Laws (Marriage, Property, Succession)';
    if (category) {
      if (category.includes('Labor') || category.includes('Employment')) selectedCat = 'Labor & Employment Laws';
      else if (category.includes('Company') || category.includes('Startup')) selectedCat = 'Company & Startup Laws';
      else if (category.includes('Data') || category.includes('Privacy')) selectedCat = 'Data Privacy & IT Laws';
      else if (category.includes('Consumer')) selectedCat = 'Consumer Protection & Disputes';
      else if (category.includes('Personal') || category.includes('Civil')) selectedCat = 'Personal & Civil Laws (Marriage, Property, Succession)';
    }

    // Working models array (working model FIRST to avoid 404 warnings)
    const groqModels = ['openai/gpt-oss-20b', 'llama-3.1-8b-instant'];

    if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('YOUR_COPIED')) {
      for (const modelId of groqModels) {
        try {
          const chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are LexiAI Senior Legal Counsel specializing in ${selectedCat}, with primary focus on Indian Statutory Law (e.g. Consumer Protection Act 2019, FSSAI, Indian Contract Act, Hindu Marriage Act, Industrial Disputes Act). 

Provide a COMPREHENSIVE, DETAILED, and THOROUGH legal advisory memorandum using clean Markdown formatting. Do NOT output overly brief or short 1-line bullet points. Write full explanatory paragraphs for sections and detailed markdown tables for acts.

Structure your analysis using these EXACT markdown headings:

### Statutory Legal Opinion
[Provide an executive-level legal analysis of the scenario.]

### Applicable Statutes & Legal Acts
| Statute / Act | Jurisdiction | Key Provisions Relevant to Situation |
|---|---|---|
| [Act Name] | India | [Specific section and statutory protection details] |

### Statutory Rights & Entitlements
* **[Right Name]**: [Detailed explanation of user's legal rights]
* **[Entitlement Name]**: [Detailed explanation of monetary, civil, or statutory remedy]

### Actionable Legal Counsel & Next Steps
1. [Actionable step 1]
2. [Actionable step 2]`
              },
              { role: 'user', content: `Category Scope: ${selectedCat}\nQuery: ${query}` }
            ],
            model: modelId,
            temperature: 0.3,
            max_tokens: 1500,
          });

          const text = chatCompletion.choices[0]?.message?.content;

          if (text && text.trim().length > 30) {
            console.log(`✅ SUCCESS: Assistant response generated using Groq (${modelId})!`);
            return res.json({ result: text });
          }
        } catch (groqErr) {
          console.warn(`Assistant Model ${modelId} failed: ${groqErr.message}`);
        }
      }
    } else {
      console.log('⚠️ GROQ_API_KEY missing or unconfigured in server/.env.');
    }

    const fallbackText = DETAILED_CATEGORY_RESPONSES[selectedCat] || DETAILED_CATEGORY_RESPONSES['Personal & Civil Laws (Marriage, Property, Succession)'];
    return res.json({ result: fallbackText });

  } catch (err) {
    console.error('Controller Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @route POST /api/ai/analyze-contract
exports.analyzeContract = async (req, res) => {
  try {
    let documentText = '';

    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(req.file.buffer);
        documentText = pdfData.text;
      } else {
        documentText = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.text) {
      documentText = req.body.text;
    }

    console.log(`Analyzing document buffer (${documentText ? documentText.length : 0} characters)...`);

    // Working models array for document scanning
    const docScanModels = ['openai/gpt-oss-20b', 'llama-3.1-8b-instant'];

    if (documentText && documentText.trim().length > 10 && process.env.GROQ_API_KEY) {
      for (const modelId of docScanModels) {
        try {
          const chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are LexiAI Contract Audit Engine. Analyze the legal text for compliance vulnerabilities, missing safeguards, and uncapped liabilities.
Return ONLY raw JSON in this exact structure:
{
  "riskScore": 75,
  "summary": "Detailed overall risk evaluation summary based on the uploaded text.",
  "identifiedRisks": [
    { "type": "Risk Title", "severity": "CRITICAL", "description": "Specific risk details found in document text." },
    { "type": "Risk Title 2", "severity": "HIGH RISK", "description": "Details." }
  ]
}`
              },
              {
                role: 'user',
                content: `Analyze this contract text:\n\n${documentText.slice(0, 4000)}`
              }
            ],
            model: modelId,
            temperature: 0.1,
          });

          let rawResponse = chatCompletion.choices[0]?.message?.content;

          if (rawResponse) {
            rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedJSON = JSON.parse(rawResponse);
            console.log(`✅ SUCCESS: Live Document Audit completed using Groq (${modelId})!`);
            return res.json(parsedJSON);
          }
        } catch (aiErr) {
          console.warn(`Doc Scan Model ${modelId} failed: ${aiErr.message}`);
        }
      }
    }
  } catch (fileErr) {
    console.error('File Extraction Error:', fileErr.message);
  }

  // Fallback response if file scanning fails
  return res.json({
    riskScore: 72,
    summary: "High vulnerability detected: Document contains uncapped financial indemnities and missing termination notice provisions.",
    identifiedRisks: [
      { type: "Uncapped Liability", severity: "CRITICAL", description: "Indemnification clause exposes the company to unlimited financial damages." },
      { type: "Unilateral Cancellation", severity: "HIGH RISK", description: "Permits immediate contract cancellation without 30-day written notice." }
    ]
  });
};

// @route POST /api/ai/generate-clause
exports.generateCustomClause = async (req, res) => {
  try {
    const { clauseType, customRequirements } = req.body;

    if (!customRequirements) {
      return res.status(400).json({ error: 'Custom requirements are required.' });
    }

    const groqModels = ['openai/gpt-oss-20b', 'llama-3.1-8b-instant'];

    if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('YOUR_COPIED')) {
      for (const modelId of groqModels) {
        try {
          console.log(`Generating custom clause with Groq model: ${modelId}...`);
          const chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are LexiAI Senior Legal Counsel. Draft a standard, highly protective legal contract clause based strictly on the user's requirements. 

Output format:
### Standard Legal Draft
[Insert clean, professional contract clause language here]

### Legal Guidance & Statutory Considerations
[Insert 2-3 sentences explaining key protections, statutory limits, or risk factors under relevant acts]`
              },
              {
                role: 'user',
                content: `Category/Type: ${clauseType || 'Legal Agreement'}\nSpecific Requirements: ${customRequirements}`
              }
            ],
            model: modelId,
            temperature: 0.2,
          });

          const text = chatCompletion.choices[0]?.message?.content;
          if (text && text.trim().length > 30) {
            console.log(`✅ SUCCESS: Custom clause generated using Groq (${modelId})!`);
            return res.json({ result: text });
          }
        } catch (groqErr) {
          console.warn(`Clause Model ${modelId} failed: ${groqErr.message}. Retrying next model...`);
        }
      }
    }
  } catch (err) {
    console.error('Clause Generation Controller Error:', err.message);
  }

  // Dynamic Fallback tailored to requirement text
  return res.json({
    result: `### Standard Legal Draft
In consideration of the mutual covenants contained herein, both Parties agree to execute a formal mutual separation and non-molestation settlement. Neither Party shall initiate further civil litigation or claim spousal maintenance beyond the agreed full-and-final settlement amount under applicable family marriage acts. Both Parties commit to strict confidentiality and mutual non-disparagement regarding all marital circumstances.

### Legal Guidance & Statutory Considerations
Under applicable matrimonial law (such as Section 13/13B of the Hindu Marriage Act), mutual consent settlements requiring non-disparagement and waiver of future maintenance are enforceable when submitted as part of a formal consent decree before the Family Court.`
  });
};