import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container-fluid p-4">
      {/* Welcome Hero Banner */}
      <div 
        className="card border-0 text-white rounded-4 p-4 p-md-5 mb-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-primary text-white px-3 py-2 rounded-pill mb-3">
              <i className="fa-solid fa-sparkles me-2"></i>Legal Intelligence Operating System
            </span>
            <h1 className="fw-bold display-6 mb-3">
              Welcome back, Counsel <span className="text-primary">{user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-light opacity-75 fs-6 lh-lg mb-4">
              LexiAI equips your practice with real-time contract vulnerability scoring, multi-category statutory legal advisories, and an interactive compliance repository.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/analyzer" className="btn btn-primary px-4 py-2.5 fw-bold shadow-sm">
                <i className="fa-solid fa-file-contract me-2"></i>Analyze Contract
              </Link>
              <Link to="/assistant" className="btn btn-outline-light px-4 py-2.5 fw-bold">
                <i className="fa-solid fa-robot me-2"></i>Ask Legal AI
              </Link>
            </div>
          </div>
          <div className="col-lg-4 text-center d-none d-lg-block">
            <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block border border-primary border-opacity-25">
              <i className="fa-solid fa-scale-balanced text-primary display-1"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-bold text-uppercase">Contract Risk Gauge</span>
              <i className="fa-solid fa-shield-halved text-primary fs-4"></i>
            </div>
            <h3 className="fw-bold text-dark my-1">1,248</h3>
            <small className="text-success"><i className="fa-solid fa-arrow-up me-1"></i>Contracts Audited</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-bold text-uppercase">Statutory Categories</span>
              <i className="fa-solid fa-layer-group text-success fs-4"></i>
            </div>
            <h3 className="fw-bold text-dark my-1">5 Frameworks</h3>
            <small className="text-muted">Personal, Labor, Corporate, Privacy & Consumer</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-bold text-uppercase">Active Jurisdiction</span>
              <i className="fa-solid fa-location-dot text-warning fs-4"></i>
            </div>
            <h5 className="fw-bold text-dark my-1 text-truncate">{user?.jurisdiction || 'India'}</h5>
            <small className="text-success"><i className="fa-solid fa-check-circle me-1"></i>Models Sync Active</small>
          </div>
        </div>
      </div>

      {/* Direct Module Cards */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 d-inline-block mb-3">
                <i className="fa-solid fa-file-contract fs-3"></i>
              </div>
              <h5 className="fw-bold text-dark">Contract Analyzer</h5>
              <p className="text-muted small lh-base">
                Upload PDF or TXT legal agreements to extract summaries, calculate risk scores, and highlight missing clauses.
              </p>
            </div>
            <Link to="/analyzer" className="btn btn-outline-primary w-100 fw-bold mt-3">
              Open Analyzer <i className="fa-solid fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-3 d-inline-block mb-3">
                <i className="fa-solid fa-robot fs-3"></i>
              </div>
              <h5 className="fw-bold text-dark">AI Legal Assistant</h5>
              <p className="text-muted small lh-base">
                Ask legal questions across civil succession, employment disputes, startup liabilities, and data protection rules.
              </p>
            </div>
            <Link to="/assistant" className="btn btn-outline-success w-100 fw-bold mt-3">
              Open Assistant <i className="fa-solid fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-3 d-inline-block mb-3">
                <i className="fa-solid fa-shield-halved fs-3"></i>
              </div>
              <h5 className="fw-bold text-dark">Compliance Engine</h5>
              <p className="text-muted small lh-base">
                Explore mandatory statutory clause templates, indemnification standards, and governing law repositories.
              </p>
            </div>
            <Link to="/compliance" className="btn btn-outline-warning text-dark w-100 fw-bold mt-3">
              Open Compliance <i className="fa-solid fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}