import React from 'react';

export default function DocumentViewer({ text, fileName, onClear }) {
  if (!text) {
    return (
      <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-3">
        <i className="fa-solid fa-file-lines text-muted display-4 mb-3"></i>
        <h5 className="fw-bold text-dark">No Document Loaded</h5>
        <p className="text-muted small mb-0">Upload a PDF or TXT contract to view its raw contents and risk highlights here.</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3 px-4">
        <div className="d-flex align-items-center">
          <i className="fa-solid fa-file-contract text-primary me-2 fs-5"></i>
          <span className="fw-bold text-truncate" style={{ maxWidth: '300px' }}>{fileName || 'Contract_Document.txt'}</span>
        </div>
        {onClear && (
          <button onClick={onClear} className="btn btn-sm btn-outline-light">
            <i className="fa-solid fa-xmark me-1"></i> Clear Document
          </button>
        )}
      </div>
      <div className="card-body p-4 bg-light" style={{ maxHeight: '450px', overflowY: 'auto' }}>
        <pre className="text-dark font-monospace mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: '1.6' }}>
          {text}
        </pre>
      </div>
      <div className="card-footer bg-white border-top p-3 d-flex justify-content-between align-items-center small text-muted">
        <span><i className="fa-solid fa-align-left me-1"></i> {text.length} characters loaded</span>
        <span className="badge bg-success-subtle text-success border border-success px-2 py-1">Buffer Ready for AI Extraction</span>
      </div>
    </div>
  );
}