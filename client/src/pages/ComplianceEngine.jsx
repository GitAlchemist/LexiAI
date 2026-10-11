import React, { useState } from 'react';

export default function ComplianceEngine() {
  const [activeTab, setActiveTab] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClause, setSelectedClause] = useState(null);
  const [copied, setCopied] = useState(false);

  // AI Generator state
  const [aiClauseType, setAiClauseType] = useState('Indemnification & Hold Harmless');
  const [aiRequirements, setAiRequirements] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const clauses = [
    {
      id: 'termination',
      category: 'COMMERCIAL PROVISIONS',
      risk: 'HIGH RISK',
      riskBadgeClass: 'bg-warning text-dark',
      borderClass: 'border-warning',
      title: 'Termination for Convenience',
      description: 'Allows one party to exit without cause. Ensure mandatory 30–90 day written notice is required.',
      statute: 'Indian Contract Act, 1872 / Common Law Commercial Standards',
      template: `Either Party may terminate this Agreement for convenience, without cause, upon providing at least thirty (30) calendar days' prior written notice to the other Party. During the notice period, both Parties shall continue fulfilling their respective obligations hereunder without interruption.`,
      guidance: 'Always ensure the notice period gives your team enough time to transition services or offboard without business disruption.'
    },
    {
      id: 'indemnity',
      category: 'LIABILITY CONTROL',
      risk: 'CRITICAL',
      riskBadgeClass: 'bg-danger text-white',
      borderClass: 'border-danger',
      title: 'Indemnification & Hold Harmless',
      description: 'Protects against third-party claims. Uncapped indemnity exposes companies to unlimited financial risk.',
      statute: 'Indian Contract Act, 1872 (Section 124 & 125)',
      template: `Each Party ("Indemnifying Party") agrees to defend, indemnify, and hold harmless the other Party from and against any third-party claims, damages, liabilities, and reasonable legal expenses arising directly out of gross negligence, fraud, or willful misconduct. In no event shall aggregate indemnity liability exceed 1x the total fees paid under this Agreement in the preceding twelve (12) months.`,
      guidance: 'Never accept uncapped indemnities. Always insert a monetary cap tied to 1x annual contract value and exclude consequential damages.'
    },
    {
      id: 'noncompete',
      category: 'LABOR & EMPLOYMENT',
      risk: 'MEDIUM RISK',
      riskBadgeClass: 'bg-info text-dark',
      borderClass: 'border-info',
      title: 'Non-Compete & Restrictive Covenants',
      description: 'Restricts employment post-contract. Must be reasonable in geographic scope and limited in duration.',
      statute: 'Indian Contract Act, 1872 (Section 27 - Agreements in restraint of trade)',
      template: `During the Term of employment and for a period of six (6) months thereafter, Employee agrees not to directly engage in, manage, or advise any enterprise that directly competes with Employer's core proprietary software offerings within the specified operating jurisdiction.`,
      guidance: 'Under Indian law (Section 27), post-employment non-competes are largely unenforceable unless limited strictly to trade secrets and non-solicitation.'
    },
    {
      id: 'jurisdiction',
      category: 'LITIGATION STANDARDS',
      risk: 'LOW RISK',
      riskBadgeClass: 'bg-success text-white',
      borderClass: 'border-success',
      title: 'Governing Law & Jurisdiction',
      description: 'Defines which court handles disputes. Ensure local courts or recognized arbitration hubs are specified.',
      statute: 'Arbitration and Conciliation Act, 1996',
      template: `This Agreement shall be governed by and construed in accordance with the laws of India. Any dispute, controversy, or claim arising out of or relating to this contract shall be submitted to binding arbitration before a Sole Arbitrator appointed in accordance with the Arbitration and Conciliation Act. The seat of arbitration shall be New Delhi.`,
      guidance: 'Designating arbitration avoids multi-year trial delays in civil courts and provides enforceable, confidential awards.'
    }
  ];

  const filteredClauses = clauses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateAiClause = async (e) => {
    e.preventDefault();
    if (!aiRequirements) return alert('Please describe your clause requirements');

    setAiLoading(true);
    setAiResult('');
    try {
      const res = await fetch('https://lexiai-backend.onrender.com/api/ai/generate-clause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clauseType: aiClauseType,
          customRequirements: aiRequirements
        }),
      });
      const data = await res.json();
      setAiResult(data.result);
    } catch (err) {
      alert('Failed to connect to backend AI generator');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4 min-vh-100" style={{ backgroundColor: '#0b1329', color: '#e2e8f0' }}>
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1 d-flex align-items-center">
            <i className="fa-solid fa-shield-halved text-primary me-3 fs-3"></i>
            Clause Compliance Engine
          </h2>
          <p className="text-secondary small mb-0">
            Standard statutory repositories & live AI custom clause generator.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="btn-group p-1 bg-dark rounded-3 border border-secondary">
          <button
            type="button"
            className={`btn btn-sm fw-bold px-3 py-2 ${activeTab === 'library' ? 'btn-primary text-white' : 'btn-dark text-secondary'}`}
            onClick={() => setActiveTab('library')}
          >
            <i className="fa-solid fa-book me-2"></i>Standard Repository
          </button>
          <button
            type="button"
            className={`btn btn-sm fw-bold px-3 py-2 ${activeTab === 'ai-generator' ? 'btn-primary text-white' : 'btn-dark text-secondary'}`}
            onClick={() => setActiveTab('ai-generator')}
          >
            <i className="fa-solid fa-wand-magic-sparkles me-2"></i>AI Clause Generator
          </button>
        </div>
      </div>

      {/* TAB 1: STANDARD REPOSITORY */}
      {activeTab === 'library' && (
        <>
          <div className="position-relative mb-4">
            <i className="fa-solid fa-magnifying-glass position-absolute top-50 translate-middle-y ms-3 text-secondary"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clauses by keyword (e.g., Indemnity, Termination, Jurisdiction)..."
              className="form-control bg-dark text-white border-secondary ps-5 py-2.5 rounded-3"
              style={{ backgroundColor: '#131f3d' }}
            />
          </div>

          <div className="row g-4">
            {filteredClauses.map((item) => (
              <div key={item.id} className="col-md-6">
                <div 
                  className={`card bg-dark text-white border-0 shadow-sm h-100 rounded-3 border-start border-4 ${item.borderClass}`}
                  style={{ backgroundColor: '#131f3d' }}
                >
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-primary fw-bold small text-uppercase">{item.category}</span>
                        <span className={`badge px-2.5 py-1 fw-bold ${item.riskBadgeClass}`} style={{ fontSize: '11px' }}>
                          {item.risk}
                        </span>
                      </div>
                      <h5 className="fw-bold text-white mb-2">{item.title}</h5>
                      <p className="text-secondary small mb-4 lh-base">{item.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedClause(item)}
                      className="btn btn-outline-primary btn-sm w-100 fw-semibold rounded-2 py-2 d-flex align-items-center justify-content-center gap-2"
                    >
                      <i className="fa-solid fa-book-open"></i>Inspect Standard Clause Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* TAB 2: AI CUSTOM CLAUSE GENERATOR */}
      {activeTab === 'ai-generator' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card bg-dark text-white border-secondary shadow-sm rounded-4 p-4" style={{ backgroundColor: '#131f3d' }}>
              <h5 className="fw-bold text-white mb-3 d-flex align-items-center">
                <i className="fa-solid fa-robot text-primary me-2"></i>Draft Custom Clause
              </h5>

              <form onSubmit={handleGenerateAiClause}>
                <div className="mb-3">
                  <label className="form-label small text-secondary fw-bold text-uppercase">Clause Category</label>
                  <select 
                    value={aiClauseType} 
                    onChange={(e) => setAiClauseType(e.target.value)}
                    className="form-select bg-black text-white border-secondary"
                  >
                    <option value="Indemnification & Hold Harmless">Indemnification & Hold Harmless</option>
                    <option value="Limitation of Liability">Limitation of Liability</option>
                    <option value="Termination & Notice Period">Termination & Notice Period</option>
                    <option value="Non-Solicitation & Restrictive Covenants">Non-Solicitation & Restrictive Covenants</option>
                    <option value="Governing Law & Dispute Resolution">Governing Law & Dispute Resolution</option>
                    <option value="Personal & Matrimonial Laws">Personal & Matrimonial Laws</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary fw-bold text-uppercase">Custom Requirements</label>
                  <textarea
                    rows="5"
                    value={aiRequirements}
                    onChange={(e) => setAiRequirements(e.target.value)}
                    placeholder="Describe your custom clause requirements..."
                    className="form-control bg-black text-white border-secondary p-3 small"
                  />
                </div>

                <button type="submit" disabled={aiLoading} className="btn btn-primary w-100 fw-bold py-2.5 rounded-3">
                  {aiLoading ? (
                    <span><i className="fa-solid fa-spinner fa-spin me-2"></i>Generating Clause...</span>
                  ) : (
                    <span><i className="fa-solid fa-wand-magic-sparkles me-2"></i>Generate AI Clause</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card bg-dark text-white border-secondary shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: '#131f3d' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-white m-0 d-flex align-items-center">
                  <i className="fa-solid fa-file-contract text-success me-2"></i>Generated AI Output
                </h5>
                {aiResult && (
                  <button type="button" className="btn btn-sm btn-outline-light" onClick={() => handleCopy(aiResult)}>
                    <i className="fa-solid fa-copy me-2"></i>{copied ? 'Copied!' : 'Copy Draft'}
                  </button>
                )}
              </div>

              {aiResult ? (
                <div className="p-3 bg-black rounded-3 text-light font-monospace small lh-base border border-secondary" style={{ whiteSpace: 'pre-wrap' }}>
                  {aiResult}
                </div>
              ) : (
                <div className="text-center text-secondary py-5">
                  <i className="fa-solid fa-wand-magic-sparkles display-4 mb-3 opacity-50"></i>
                  <p className="m-0">Enter your custom requirements on the left to generate an AI-backed legal clause draft.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Standard Repository Inspection */}
      {selectedClause && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-secondary shadow-lg rounded-4">
              <div className="modal-header border-secondary p-4">
                <div>
                  <span className="badge bg-primary text-white mb-2 px-2.5 py-1 small">{selectedClause.category}</span>
                  <h4 className="modal-title fw-bold text-white mb-0">{selectedClause.title}</h4>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedClause(null)}></button>
              </div>

              <div className="modal-body p-4">
                <div className="mb-4">
                  <label className="text-secondary small fw-bold text-uppercase mb-1">Statutory Benchmark</label>
                  <div className="text-info fw-semibold">{selectedClause.statute}</div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="text-secondary small fw-bold text-uppercase">Standard Draft Template</label>
                    <button type="button" className="btn btn-sm btn-outline-light py-1 px-3" onClick={() => handleCopy(selectedClause.template)}>
                      <i className="fa-solid fa-copy me-2"></i>{copied ? 'Copied!' : 'Copy Clause'}
                    </button>
                  </div>
                  <div className="p-3 bg-black rounded-3 text-light font-monospace small lh-base border border-secondary">
                    {selectedClause.template}
                  </div>
                </div>

                <div className="p-3 bg-primary bg-opacity-10 border border-primary rounded-3 text-light small">
                  <i className="fa-solid fa-lightbulb text-warning me-2 fs-6"></i>
                  <strong>Legal Counsel Guidance:</strong> {selectedClause.guidance}
                </div>
              </div>

              <div className="modal-footer border-secondary p-3">
                <button type="button" className="btn btn-secondary px-4 fw-semibold" onClick={() => setSelectedClause(null)}>
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}