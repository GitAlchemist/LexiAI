import React, { useState } from 'react';

export default function Analyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://lexiai-aqpa.onrender.com';

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload a contract document (.pdf or .txt)');

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/ai/analyze-contract`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      // Fix: Safely parse response if returned as raw string or wrapped JSON
      let parsed = data;
      if (typeof data.analysis === 'string') {
        const cleanJson = data.analysis.replace(/```json|```/g, '').trim();
        parsed = JSON.parse(cleanJson);
      } else if (typeof data === 'string') {
        const cleanJson = data.replace(/```json|```/g, '').trim();
        parsed = JSON.parse(cleanJson);
      }

      setResult(parsed);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error parsing contract document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="p-4 p-md-5 min-vh-100 w-100 position-relative"
      style={{
        background: `linear-gradient(135deg, rgba(248, 250, 252, 0.92) 0%, rgba(241, 245, 249, 0.94) 100%), 
                    url('https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1800&q=80') center/cover no-repeat fixed`,
      }}
    >
      {/* Top White Canvas Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3.5 rounded-4 bg-white d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">Documents Scanned</span>
              <h3 className="fw-bold text-dark m-0">1,248</h3>
              <small className="text-success"><i className="fa-solid fa-arrow-up me-1"></i>+12% verified</small>
            </div>
            <div className="p-3 bg-primary bg-opacity-10 rounded-circle text-primary">
              <i className="fa-solid fa-file-contract fs-3"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3.5 rounded-4 bg-white d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">Avg Risk Index</span>
              <h3 className="fw-bold text-warning m-0">68 / 100</h3>
              <small className="text-muted"><i className="fa-solid fa-circle-exclamation me-1"></i>Moderate Vulnerability</small>
            </div>
            <div className="p-3 bg-warning bg-opacity-10 rounded-circle text-warning">
              <i className="fa-solid fa-triangle-exclamation fs-3"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3.5 rounded-4 bg-white d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">AI Engine Status</span>
              <h3 className="fw-bold text-success m-0"><i className="fa-solid fa-circle text-success fs-6 me-2"></i>Active</h3>
              <small className="text-muted">3.8 Flash Engine</small>
            </div>
            <div className="p-3 bg-success bg-opacity-10 rounded-circle text-success">
              <i className="fa-solid fa-microchip fs-3"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main White Upload Box */}
      <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="fw-bold text-dark m-0 d-flex align-items-center">
              <i className="fa-solid fa-file-shield text-primary me-2"></i>AI Document & Contract Analyzer
            </h4>
            <p className="text-muted small m-0 mt-1">
              Upload commercial agreements or employment contracts to calculate risk score, extract summary, and identify missing legal provisions.
            </p>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-2 fw-semibold">
            PDF & TXT ENCRYPTED
          </span>
        </div>

        <form onSubmit={handleUpload}>
          <div className="p-5 border-2 border-dashed border-primary border-opacity-25 rounded-4 text-center bg-light my-3">
            <i className="fa-solid fa-cloud-arrow-up text-primary display-4 mb-3 d-block"></i>
            <h5 className="fw-bold text-dark">Select Contract File (.pdf, .txt)</h5>
            <p className="text-muted small mb-3">Upload agreements for automated clause extraction and vulnerability audit</p>

            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files[0])}
              className="form-control bg-white border text-dark w-50 mx-auto fw-medium"
            />
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" disabled={loading} className="btn btn-primary px-4 py-2.5 fw-bold rounded-3 shadow-sm">
              {loading ? (
                <span><i className="fa-solid fa-spinner fa-spin me-2"></i>Auditing Document Buffer...</span>
              ) : (
                <span><i className="fa-solid fa-magnifying-glass-chart me-2"></i>Analyze Document</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Audit Output Section */}
      {result && (
        <div className="row g-4 mt-1">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
              <span className="text-muted small fw-bold text-uppercase">Vulnerability Score</span>
              <div className="display-2 fw-bold text-danger my-3">{result.riskScore}%</div>
              <div className="progress bg-light mb-3" style={{ height: '10px' }}>
                <div className="progress-bar bg-danger" style={{ width: `${result.riskScore}%` }}></div>
              </div>
              <p className="text-dark small m-0">{result.summary}</p>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
              <h5 className="fw-bold text-dark mb-3"><i className="fa-solid fa-triangle-exclamation text-danger me-2"></i>Identified Contract Risks</h5>
              <div className="d-flex flex-column gap-3">
                {result.identifiedRisks?.map((risk, idx) => (
                  <div key={idx} className="p-3 rounded-3 bg-light border-start border-4 border-danger">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-dark">{risk.type}</strong>
                      <span className="badge bg-danger text-white">{risk.severity}</span>
                    </div>
                    <p className="text-secondary small m-0">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}