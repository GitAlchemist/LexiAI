import React from 'react';

export default function LegalDisclaimer() {
  return (
    <div className="card border-0 bg-warning-subtle text-dark-emphasis rounded-3 p-3 my-4 shadow-sm border-start border-4 border-warning">
      <div className="d-flex align-items-start">
        <i className="fa-solid fa-triangle-exclamation text-warning me-3 fs-5 mt-1"></i>
        <div>
          <h6 className="fw-bold mb-1 text-dark">Enterprise Legal Intelligence Disclaimer</h6>
          <p className="small mb-0 opacity-85 lh-base">
            LexiAI is an automated AI-driven contract audit and statutory information assistant. Outputs are generated for informational and risk-identification purposes only and do not constitute formal attorney-client advice or a binding legal opinion. Always consult a licensed legal counsel in your jurisdiction before signing contracts or taking legal action.
          </p>
        </div>
      </div>
    </div>
  );
}