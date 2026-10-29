import React, { useState, useMemo } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://lexiai-aqpa.onrender.com';

const RISK = {
  'CRITICAL':    { level: 4, color: '#ef4444', label: 'Critical risk' },
  'HIGH RISK':   { level: 3, color: '#f59e0b', label: 'High risk' },
  'MEDIUM RISK': { level: 2, color: '#22d3ee', label: 'Medium risk' },
  'LOW RISK':    { level: 1, color: '#34d399', label: 'Low risk' },
};

const CLAUSES = [
  { id: 'termination', icon: 'fa-door-open', category: 'Commercial provisions', risk: 'HIGH RISK', title: 'Termination for convenience',
    description: 'Lets one party exit without cause. Make sure a 30 to 90 day written notice is required.',
    statute: 'Indian Contract Act, 1872 / common law commercial standards',
    template: `Either Party may terminate this Agreement for convenience, without cause, upon at least thirty (30) calendar days' prior written notice to the other Party. During the notice period, both Parties shall continue to perform their obligations without interruption.`,
    guidance: 'Check that the notice period gives your team enough time to transition services without business disruption.' },
  { id: 'indemnity', icon: 'fa-shield-halved', category: 'Liability control', risk: 'CRITICAL', title: 'Indemnification and hold harmless',
    description: 'Protects against third-party claims. Uncapped indemnity exposes a company to unlimited financial risk.',
    statute: 'Indian Contract Act, 1872 (Sections 124 and 125)',
    template: `Each Party ("Indemnifying Party") shall defend, indemnify, and hold harmless the other Party from third-party claims, damages, liabilities, and reasonable legal expenses arising directly out of gross negligence, fraud, or willful misconduct. Aggregate indemnity liability shall not exceed the total fees paid under this Agreement in the preceding twelve (12) months.`,
    guidance: 'Avoid uncapped indemnities. Tie the cap to annual contract value and exclude consequential damages.' },
  { id: 'liability-cap', icon: 'fa-scale-unbalanced', category: 'Liability control', risk: 'CRITICAL', title: 'Limitation of liability',
    description: 'Sets a ceiling on damages one party can claim. Missing caps are the most common source of ruinous exposure.',
    statute: 'Indian Contract Act, 1872 (Section 73, compensation for breach)',
    template: `Neither Party shall be liable for indirect, incidental, special, or consequential damages. Each Party's total aggregate liability under this Agreement shall not exceed the fees paid or payable in the twelve (12) months preceding the event giving rise to the claim, except for liability arising from fraud or willful misconduct.`,
    guidance: 'Carve out fraud, willful misconduct, and confidentiality breaches so the cap stays enforceable and fair.' },
  { id: 'data-protection', icon: 'fa-user-lock', category: 'Data and privacy', risk: 'CRITICAL', title: 'Data protection and privacy',
    description: 'Sets how personal data is collected, used, stored, and reported if breached.',
    statute: 'Digital Personal Data Protection Act, 2023 / IT Act, 2000 (Section 43A)',
    template: `The Data Processor shall process personal data only on documented instructions from the Data Fiduciary, implement reasonable security safeguards, and notify the Data Fiduciary without undue delay upon becoming aware of a personal data breach. Upon termination, the Processor shall delete or return all personal data.`,
    guidance: 'Name a breach-notification window, list the safeguards, and require deletion or return of data at exit.' },
  { id: 'confidentiality', icon: 'fa-eye-slash', category: 'Data and privacy', risk: 'HIGH RISK', title: 'Confidentiality and non-disclosure',
    description: 'Protects trade secrets and business information shared during the relationship.',
    statute: 'Indian Contract Act, 1872 / Information Technology Act, 2000',
    template: `The Receiving Party shall hold all Confidential Information in strict confidence, use it solely for the purpose of this Agreement, and not disclose it to any third party without prior written consent. These obligations survive for three (3) years after termination, and indefinitely for trade secrets.`,
    guidance: 'Define what counts as confidential, list standard exclusions (public, independently developed), and set a survival period.' },
  { id: 'payment', icon: 'fa-indian-rupee-sign', category: 'Financial terms', risk: 'MEDIUM RISK', title: 'Payment terms and late fees',
    description: 'Defines invoicing cycles, due dates, and interest on delayed payments.',
    statute: 'MSMED Act, 2006 (Section 15, payment within 45 days) / Indian Contract Act, 1872',
    template: `Invoices shall be paid within thirty (30) days of receipt. Undisputed amounts unpaid after the due date shall accrue interest at 1% per month until paid in full. The paying Party must raise any invoice dispute in writing within ten (10) days of receipt.`,
    guidance: 'Small suppliers get statutory protection on payment timelines. Check the MSME rules before agreeing longer terms.' },
  { id: 'ip', icon: 'fa-lightbulb', category: 'Intellectual property', risk: 'HIGH RISK', title: 'Intellectual property ownership',
    description: 'Decides who owns work product created under the contract.',
    statute: 'Copyright Act, 1957 (Sections 17 and 19, ownership and assignment)',
    template: `All work product created by the Service Provider specifically for the Client under this Agreement shall be owned by the Client upon full payment. The Service Provider retains ownership of pre-existing materials and grants the Client a perpetual, non-exclusive licence to use them as part of the deliverables.`,
    guidance: 'Under the Copyright Act, an assignment must be in writing and specify scope, duration, and territory. Silence defaults to five years.' },
  { id: 'noncompete', icon: 'fa-user-slash', category: 'Labor and employment', risk: 'MEDIUM RISK', title: 'Non-compete and restrictive covenants',
    description: 'Restricts employment after the contract ends. Must be reasonable in scope and duration.',
    statute: 'Indian Contract Act, 1872 (Section 27, agreements in restraint of trade)',
    template: `During employment and for six (6) months thereafter, Employee shall not solicit the Employer's clients or employees, or misuse the Employer's trade secrets, within the operating jurisdiction.`,
    guidance: 'Post-employment non-competes are largely unenforceable in India. Draft around trade secrets and non-solicitation instead.' },
  { id: 'force-majeure', icon: 'fa-cloud-bolt', category: 'Commercial provisions', risk: 'MEDIUM RISK', title: 'Force majeure',
    description: 'Excuses performance during events outside either party\'s control, such as floods or government orders.',
    statute: 'Indian Contract Act, 1872 (Section 56, impossibility of performance)',
    template: `Neither Party shall be liable for failure or delay in performance caused by events beyond its reasonable control, including natural disasters, war, epidemic, or government action, provided it notifies the other Party within seven (7) days. If the event continues beyond sixty (60) days, either Party may terminate this Agreement.`,
    guidance: 'List events explicitly and add a notice duty and a termination right. Courts read force majeure narrowly.' },
  { id: 'jurisdiction', icon: 'fa-gavel', category: 'Litigation standards', risk: 'LOW RISK', title: 'Governing law and jurisdiction',
    description: 'Defines which court or arbitration forum handles disputes.',
    statute: 'Arbitration and Conciliation Act, 1996',
    template: `This Agreement is governed by the laws of India. Any dispute arising out of or relating to this Agreement shall be resolved by binding arbitration before a sole arbitrator appointed under the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be New Delhi.`,
    guidance: 'Arbitration avoids multi-year civil trials and gives enforceable, confidential awards. Name the seat clearly.' },
];

const CLAUSE_TYPES = [...new Set(CLAUSES.map(c => c.title)), 'Personal and matrimonial laws'];
const JURISDICTIONS = ['India', 'United States', 'United Kingdom', 'European Union', 'Singapore', 'UAE'];
const PERSPECTIVES = ['Balanced', 'Protect the service provider', 'Protect the client', 'Protect the employee', 'Protect the employer'];
const EXAMPLES = [
  'Cap liability at 12 months of fees, excluding fraud',
  '60-day termination notice with a 15-day cure period',
  'Mutual NDA for 3 years, trade secrets forever',
  'Late payment interest of 1.5% per month after 30 days',
];

const css = `
.lx-input::placeholder { color: #8b9bb8 !important; opacity: 1; }
.lx-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 .2rem rgba(59,130,246,.2) !important; }
.lx-card { background: #111c36; border: 1px solid #1f2d4f; }
.lx-chip { border: 1px solid #25355c; background: transparent; color: #a9b8d6; border-radius: 999px; padding: 4px 14px; font-size: 13px; cursor: pointer; }
.lx-chip.active { background: #2563eb; border-color: #2563eb; color: #fff; }
.lx-chip:hover:not(.active) { border-color: #3b82f6; color: #fff; }
.lx-gauge { display: flex; gap: 3px; }
.lx-gauge span { width: 18px; height: 6px; border-radius: 3px; background: #243456; }
.lx-hero { background: linear-gradient(135deg, #12224a 0%, #0b1329 70%); border: 1px solid #1f2d4f; }
.lx-serif { font-family: Georgia, 'Times New Roman', serif; line-height: 1.7; }
`;

function Gauge({ risk }) {
  const r = RISK[risk];
  return (
    <div className="d-flex align-items-center gap-2" title={r.label}>
      <div className="lx-gauge">
        {[1, 2, 3, 4].map(i => (
          <span key={i} style={i <= r.level ? { background: r.color } : undefined} />
        ))}
      </div>
      <small style={{ color: r.color, fontWeight: 600 }}>{r.label}</small>
    </div>
  );
}

export default function ComplianceEngine() {
  const [activeTab, setActiveTab] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selectedClause, setSelectedClause] = useState(null);
  const [copiedKey, setCopiedKey] = useState('');

  const [aiClauseType, setAiClauseType] = useState(CLAUSE_TYPES[1]);
  const [aiJurisdiction, setAiJurisdiction] = useState('India');
  const [aiPerspective, setAiPerspective] = useState('Balanced');
  const [aiRequirements, setAiRequirements] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiError, setAiError] = useState('');
  const [history, setHistory] = useState([]);

  const categories = ['All', ...new Set(CLAUSES.map(c => c.category))];
  const criticalCount = CLAUSES.filter(c => c.risk === 'CRITICAL').length;

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return CLAUSES.filter(c =>
      (category === 'All' || c.category === category) &&
      (riskFilter === 'All' || c.risk === riskFilter) &&
      (c.title + c.category + c.description + c.statute).toLowerCase().includes(q)
    );
  }, [searchTerm, category, riskFilter]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([`${aiClauseType}\n\n${aiResult}\n\nDraft for review by a qualified lawyer. Not legal advice.`], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${aiClauseType.replace(/\s+/g, '-').toLowerCase()}-draft.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const openInGenerator = (clause) => {
    setAiClauseType(clause.title);
    setSelectedClause(null);
    setActiveTab('ai-generator');
  };

  const handleGenerateAiClause = async (e) => {
    e.preventDefault();
    if (!aiRequirements.trim()) { setAiError('Describe what the clause must say before generating.'); return; }
    setAiLoading(true); setAiResult(''); setAiError('');
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate-clause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clauseType: aiClauseType,
          customRequirements: `${aiRequirements}\nJurisdiction: ${aiJurisdiction}\nDrafting perspective: ${aiPerspective}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Server returned ${res.status}`);
      const text = data.result || data.analysis || data.clause;
      if (!text) throw new Error('The AI returned an empty draft. Try again.');
      setAiResult(text);
      setHistory(h => [{ type: aiClauseType, text, at: new Date().toLocaleTimeString() }, ...h].slice(0, 5));
    } catch (err) {
      setAiError(`${err.message}. If the server was idle, wait 30 seconds and retry.`);
    } finally {
      setAiLoading(false);
    }
  };

  const field = { background: '#0b1329', border: '1px solid #25355c' };

  return (
    <div className="container-fluid p-4 min-vh-100" style={{ backgroundColor: '#0b1329', color: '#e2e8f0' }}>
      <style>{css}</style>

      {/* Header */}
      <div className="lx-hero rounded-4 p-4 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">
            <i className="fa-solid fa-shield-halved text-primary me-3"></i>Clause compliance engine
          </h2>
          <p className="mb-0" style={{ color: '#9fb0cf' }}>
            Check clauses against Indian statutes, or draft a custom one with AI.
          </p>
        </div>
        <div className="d-flex gap-4">
          <div><div className="fs-3 fw-bold text-white">{CLAUSES.length}</div><small className="text-secondary">Statutory templates</small></div>
          <div><div className="fs-3 fw-bold" style={{ color: '#ef4444' }}>{criticalCount}</div><small className="text-secondary">Critical-risk clauses</small></div>
          <div><div className="fs-3 fw-bold" style={{ color: '#34d399' }}>{history.length}</div><small className="text-secondary">Drafted this session</small></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="btn-group p-1 rounded-3 mb-4" style={{ background: '#111c36', border: '1px solid #1f2d4f' }}>
        {[['library', 'fa-book', 'Standard repository'], ['ai-generator', 'fa-wand-magic-sparkles', 'AI clause generator']].map(([id, icon, label]) => (
          <button key={id} type="button" onClick={() => setActiveTab(id)}
            className={`btn btn-sm fw-semibold px-3 py-2 ${activeTab === id ? 'btn-primary' : 'text-secondary'}`}>
            <i className={`fa-solid ${icon} me-2`}></i>{label}
          </button>
        ))}
      </div>

      {/* LIBRARY */}
      {activeTab === 'library' && (
        <>
          <div className="row g-3 mb-3">
            <div className="col-lg-9 position-relative">
              <i className="fa-solid fa-magnifying-glass position-absolute top-50 translate-middle-y ms-4 text-secondary"></i>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by clause, topic, or statute (for example: indemnity, DPDP, Section 27)"
                className="lx-input form-control text-white ps-5 py-2 rounded-3" style={{ background: '#111c36', border: '1px solid #25355c' }} />
            </div>
            <div className="col-lg-3">
              <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
                className="lx-input form-select text-white py-2 rounded-3" style={{ background: '#111c36', border: '1px solid #25355c' }}>
                <option value="All">All risk levels</option>
                {Object.entries(RISK).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-4">
            {categories.map(c => (
              <button key={c} type="button" className={`lx-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          <p className="text-secondary small mb-3">Showing {filtered.length} of {CLAUSES.length} clauses</p>

          <div className="row g-4">
            {filtered.map(item => (
              <div key={item.id} className="col-md-6 col-xl-4">
                <div className="lx-card h-100 rounded-4 p-4 d-flex flex-column" style={{ borderLeft: `4px solid ${RISK[item.risk].color}` }}>
                  <span className="small mb-3" style={{ color: '#7fa6f5' }}>
                    <i className={`fa-solid ${item.icon} me-2`}></i>{item.category}
                  </span>
                  <h5 className="fw-bold text-white mb-2">{item.title}</h5>
                  <p className="small mb-3" style={{ color: '#9fb0cf' }}>{item.description}</p>
                  <p className="small mb-3" style={{ color: '#6f82a8' }}><i className="fa-solid fa-landmark me-2"></i>{item.statute}</p>
                  <div className="mt-auto">
                    <div className="mb-3"><Gauge risk={item.risk} /></div>
                    <button type="button" onClick={() => setSelectedClause(item)} className="btn btn-outline-primary btn-sm w-100 fw-semibold py-2">
                      <i className="fa-solid fa-book-open me-2"></i>Open clause template
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-5 text-secondary">
                <i className="fa-solid fa-magnifying-glass display-5 mb-3 opacity-50"></i>
                <p className="mb-2">No clauses match these filters.</p>
                <button className="btn btn-sm btn-outline-light" onClick={() => { setSearchTerm(''); setCategory('All'); setRiskFilter('All'); }}>Clear filters</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* AI GENERATOR */}
      {activeTab === 'ai-generator' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="lx-card rounded-4 p-4">
              <h5 className="fw-bold text-white mb-3"><i className="fa-solid fa-pen-nib text-primary me-2"></i>Draft a custom clause</h5>
              <form onSubmit={handleGenerateAiClause}>
                <label className="form-label small text-secondary fw-semibold">Clause type</label>
                <select value={aiClauseType} onChange={e => setAiClauseType(e.target.value)} className="lx-input form-select text-white mb-3" style={field}>
                  {CLAUSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small text-secondary fw-semibold">Jurisdiction</label>
                    <select value={aiJurisdiction} onChange={e => setAiJurisdiction(e.target.value)} className="lx-input form-select text-white" style={field}>
                      {JURISDICTIONS.map(j => <option key={j}>{j}</option>)}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-secondary fw-semibold">Drafting perspective</label>
                    <select value={aiPerspective} onChange={e => setAiPerspective(e.target.value)} className="lx-input form-select text-white" style={field}>
                      {PERSPECTIVES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <label className="form-label small text-secondary fw-semibold">What should the clause say?</label>
                <textarea rows="5" maxLength={800} value={aiRequirements} onChange={e => setAiRequirements(e.target.value)}
                  placeholder="For example: cap liability at 12 months of fees and exclude indirect damages"
                  className="lx-input form-control text-white p-3 mb-2" style={field} />
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {EXAMPLES.map(x => <button key={x} type="button" className="lx-chip" onClick={() => setAiRequirements(x)}>{x}</button>)}
                </div>
                <div className="text-end small text-secondary mb-3">{aiRequirements.length}/800</div>

                {aiError && <div className="alert alert-danger py-2 small"><i className="fa-solid fa-circle-exclamation me-2"></i>{aiError}</div>}

                <button type="submit" disabled={aiLoading} className="btn btn-primary w-100 fw-bold py-2">
                  {aiLoading
                    ? <span><i className="fa-solid fa-spinner fa-spin me-2"></i>Drafting clause...</span>
                    : <span><i className="fa-solid fa-wand-magic-sparkles me-2"></i>Generate clause</span>}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="lx-card rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h5 className="fw-bold text-white m-0"><i className="fa-solid fa-file-contract text-success me-2"></i>Generated draft</h5>
                {aiResult && (
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => handleCopy(aiResult, 'ai')}>
                      <i className="fa-solid fa-copy me-2"></i>{copiedKey === 'ai' ? 'Copied' : 'Copy'}
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={handleDownload}>
                      <i className="fa-solid fa-download me-2"></i>Download
                    </button>
                  </div>
                )}
              </div>

              {aiLoading ? (
                <div className="text-center text-secondary py-5"><i className="fa-solid fa-spinner fa-spin display-5 mb-3"></i><p className="m-0">The AI is drafting your clause.</p></div>
              ) : aiResult ? (
                <>
                  <div className="p-3 rounded-3 text-light lx-serif" style={{ whiteSpace: 'pre-wrap', ...field }}>{aiResult}</div>
                  <div className="small mt-3 p-2 rounded-3" style={{ background: 'rgba(245,158,11,.1)', color: '#fbbf24' }}>
                    <i className="fa-solid fa-triangle-exclamation me-2"></i>This is a draft for review by a qualified lawyer. It is legal information, not legal advice.
                  </div>
                </>
              ) : (
                <div className="text-center text-secondary py-5">
                  <i className="fa-solid fa-wand-magic-sparkles display-4 mb-3 opacity-50"></i>
                  <p className="m-0">Pick a clause type, add your requirements, and generate a draft.</p>
                </div>
              )}

              {history.length > 0 && (
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid #1f2d4f' }}>
                  <div className="small text-secondary fw-semibold mb-2">Recent drafts</div>
                  {history.map((h, i) => (
                    <button key={i} type="button" onClick={() => { setAiResult(h.text); setAiClauseType(h.type); }}
                      className="btn btn-sm w-100 text-start text-secondary d-flex justify-content-between">
                      <span><i className="fa-regular fa-file-lines me-2"></i>{h.type}</span><span>{h.at}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {selectedClause && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }} onClick={() => setSelectedClause(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content text-white rounded-4" style={{ background: '#111c36', border: '1px solid #25355c' }}>
              <div className="modal-header p-4" style={{ borderColor: '#1f2d4f' }}>
                <div>
                  <small style={{ color: '#7fa6f5' }}><i className={`fa-solid ${selectedClause.icon} me-2`}></i>{selectedClause.category}</small>
                  <h4 className="modal-title fw-bold text-white my-1">{selectedClause.title}</h4>
                  <Gauge risk={selectedClause.risk} />
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedClause(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <div className="small text-secondary fw-semibold mb-1">Statutory benchmark</div>
                  <div className="text-info fw-semibold">{selectedClause.statute}</div>
                </div>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-secondary fw-semibold">Standard draft template</span>
                    <button type="button" className="btn btn-sm btn-outline-light py-1 px-3" onClick={() => handleCopy(selectedClause.template, 'tpl')}>
                      <i className="fa-solid fa-copy me-2"></i>{copiedKey === 'tpl' ? 'Copied' : 'Copy clause'}
                    </button>
                  </div>
                  <div className="p-3 rounded-3 text-light lx-serif" style={field}>{selectedClause.template}</div>
                </div>
                <div className="p-3 rounded-3 small" style={{ background: 'rgba(59,130,246,.1)', border: '1px solid #2b4a8a' }}>
                  <i className="fa-solid fa-lightbulb text-warning me-2"></i><strong>What to check:</strong> {selectedClause.guidance}
                </div>
              </div>
              <div className="modal-footer p-3" style={{ borderColor: '#1f2d4f' }}>
                <button type="button" className="btn btn-primary fw-semibold" onClick={() => openInGenerator(selectedClause)}>
                  <i className="fa-solid fa-wand-magic-sparkles me-2"></i>Customize with AI
                </button>
                <button type="button" className="btn btn-outline-secondary fw-semibold" onClick={() => setSelectedClause(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}