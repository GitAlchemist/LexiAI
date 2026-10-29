import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/* ---------- Static content (replace with API data later) ---------- */
const PRACTICE_AREAS = [
  { icon: 'fa-user-shield', title: 'Personal & Civil', law: 'Succession, family, property', color: 'primary' },
  { icon: 'fa-briefcase', title: 'Labor & Employment', law: 'Wages, termination, disputes', color: 'success' },
  { icon: 'fa-building', title: 'Corporate & Startup', law: 'Contracts, liability, IP', color: 'info' },
  { icon: 'fa-lock', title: 'Data Privacy', law: 'DPDP Act 2023, IT Act 2000', color: 'warning' },
  { icon: 'fa-cart-shopping', title: 'Consumer Rights', law: 'Consumer Protection Act 2019', color: 'danger' },
];

const STATUTES = [
  { act: 'Indian Contract Act, 1872', note: 'Offer, acceptance, consideration, breach' },
  { act: 'Information Technology Act, 2000', note: 'Electronic records and cyber liability' },
  { act: 'Digital Personal Data Protection Act, 2023', note: 'Consent, data fiduciary duties' },
  { act: 'Consumer Protection Act, 2019', note: 'Defects, unfair trade practices' },
];

const CLAUSE_CHECKLIST = [
  'Governing law & jurisdiction',
  'Indemnification',
  'Termination & notice period',
  'Confidentiality / NDA',
  'Limitation of liability',
  'Dispute resolution (arbitration)',
];

const ACTIVITY = [
  { icon: 'fa-file-contract', text: 'Contract audited', meta: 'Service Agreement – risk 72/100', tone: 'danger' },
  { icon: 'fa-comments', text: 'Legal AI query answered', meta: 'Notice period under labor law', tone: 'success' },
  { icon: 'fa-shield-halved', text: 'Compliance check completed', meta: 'Data processing clause', tone: 'primary' },
];

const RISK_BANDS = [
  { label: 'Low risk', value: 46, cls: 'bg-success' },
  { label: 'Medium risk', value: 38, cls: 'bg-warning' },
  { label: 'High risk', value: 16, cls: 'bg-danger' },
];

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');

  const name = user?.email?.split('@')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const askAI = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    navigate('/assistant', { state: { prefill: question.trim() } });
  };

  return (
    <div className="container-fluid p-4 lexi-home">
      {/* Fonts + scoped styles (theme colors unchanged) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap');
        .lexi-home .serif { font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; letter-spacing: .2px; }
        .lexi-home .gold { color: #c9a24b; }
        .lexi-home .gold-rule { height: 2px; width: 64px; background: linear-gradient(90deg, #c9a24b, transparent); border: 0; opacity: 1; margin: 0 0 1.25rem; }
        .lexi-home .hero-pillars { position: absolute; right: -20px; bottom: -30px; font-size: 14rem; color: rgba(201,162,75,.07); pointer-events: none; }
        .lexi-home .seal { width: 150px; height: 150px; border-radius: 50%; border: 1px solid rgba(201,162,75,.55); display: inline-flex; align-items: center; justify-content: center; position: relative; }
        .lexi-home .seal::before { content: ''; position: absolute; inset: 8px; border-radius: 50%; border: 1px dashed rgba(201,162,75,.4); }
        .lexi-home .ask-box { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.18); border-radius: .75rem; }
        .lexi-home .ask-box input { background: transparent; border: 0; color: #fff; box-shadow: none; }
        .lexi-home .ask-box input::placeholder { color: rgba(255,255,255,.55); }
        .lexi-home .ask-box input:focus { outline: none; box-shadow: none; }
        .lexi-home .ask-box:focus-within { border-color: #0d6efd; }
        .lexi-home .area-card { border-left: 3px solid var(--bs-primary) !important; }
        .lexi-home .section-title { font-size: 1.5rem; }
        .lexi-home a:focus-visible { outline: 2px solid #c9a24b; outline-offset: 2px; }
      `}</style>

      {/* ===== Hero ===== */}
      <div
        className="card border-0 text-white rounded-4 p-4 p-md-5 mb-4 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <i className="fa-solid fa-landmark hero-pillars" aria-hidden="true"></i>
        <div className="row align-items-center position-relative">
          <div className="col-lg-8">
            <span className="badge bg-primary text-white px-3 py-2 rounded-pill mb-3">
              <i className="fa-solid fa-gavel me-2"></i>Legal Intelligence Operating System
            </span>
            <p className="small mb-1 gold fw-semibold">{today}</p>
            <h1 className="serif fw-bold display-5 mb-2">
              {greeting}, Counsel <span className="text-primary">{name}</span>
            </h1>
            <hr className="gold-rule" />
            <p className="text-light opacity-75 fs-6 lh-lg mb-4" style={{ maxWidth: 640 }}>
              LexiAI equips your practice with real-time contract vulnerability scoring,
              multi-category statutory advisories, and an interactive compliance repository.
            </p>

            {/* Quick legal question */}
            <form onSubmit={askAI} className="ask-box d-flex align-items-center p-1 mb-4" style={{ maxWidth: 640 }}>
              <i className="fa-solid fa-magnifying-glass ms-3 text-light opacity-50"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Ask a legal question, e.g. “Is a 30-day notice period enforceable?”"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                aria-label="Ask a legal question"
              />
              <button type="submit" className="btn btn-primary fw-bold px-3">Ask</button>
            </form>

            <div className="d-flex flex-wrap gap-3">
              <Link to="/analyzer" className="btn btn-primary px-4 py-2 fw-bold shadow-sm">
                <i className="fa-solid fa-file-contract me-2"></i>Analyze Contract
              </Link>
              <Link to="/assistant" className="btn btn-outline-light px-4 py-2 fw-bold">
                <i className="fa-solid fa-robot me-2"></i>Ask Legal AI
              </Link>
            </div>
          </div>

          <div className="col-lg-4 text-center d-none d-lg-block">
            <div className="seal">
              <i className="fa-solid fa-scale-balanced text-primary" style={{ fontSize: '4.5rem' }}></i>
            </div>
            <p className="serif gold fs-5 mt-3 mb-0 fst-italic">Fiat justitia</p>
            <small className="text-light opacity-50">Precision. Compliance. Counsel.</small>
          </div>
        </div>
      </div>

      {/* ===== Metrics ===== */}
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
            <small className="text-muted">Personal, Labor, Corporate, Privacy &amp; Consumer</small>
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

      {/* ===== Practice areas ===== */}
      <div className="d-flex align-items-baseline justify-content-between mb-3">
        <h2 className="serif section-title fw-bold text-white mb-0">Practice areas</h2>
        <Link to="/assistant" className="small text-decoration-none gold">Start a consultation</Link>
      </div>
      <div className="row g-3 mb-4">
        {PRACTICE_AREAS.map((a) => (
          <div className="col-6 col-lg" key={a.title}>
            <Link
              to="/assistant"
              state={{ prefill: `I have a question about ${a.title}` }}
              className="text-decoration-none"
            >
              <div
                className="card area-card border-0 shadow-sm bg-white rounded-3 p-3 h-100"
                style={{ borderLeftColor: `var(--bs-${a.color})` }}
              >
                <i className={`fa-solid ${a.icon} text-${a.color} fs-4 mb-2`}></i>
                <h6 className="fw-bold text-dark mb-1">{a.title}</h6>
                <small className="text-muted">{a.law}</small>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ===== Module cards ===== */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 d-inline-block mb-3">
                <i className="fa-solid fa-file-contract fs-3"></i>
              </div>
              <h5 className="serif fs-4 fw-bold text-dark">Contract Analyzer</h5>
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
              <h5 className="serif fs-4 fw-bold text-dark">AI Legal Assistant</h5>
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
              <h5 className="serif fs-4 fw-bold text-dark">Compliance Engine</h5>
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

      {/* ===== Insights row ===== */}
      <div className="row g-4 mb-4">
        {/* Risk distribution */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
            <h5 className="serif fs-4 fw-bold text-dark mb-1">Portfolio risk profile</h5>
            <p className="text-muted small mb-3">Share of audited contracts by risk band</p>
            <div className="progress mb-3" style={{ height: 14 }} role="img" aria-label="Risk distribution">
              {RISK_BANDS.map((r) => (
                <div key={r.label} className={`progress-bar ${r.cls}`} style={{ width: `${r.value}%` }}></div>
              ))}
            </div>
            {RISK_BANDS.map((r) => (
              <div key={r.label} className="d-flex justify-content-between small mb-2">
                <span className="text-dark"><span className={`badge ${r.cls} me-2`}>&nbsp;</span>{r.label}</span>
                <strong className="text-dark">{r.value}%</strong>
              </div>
            ))}
            <p className="text-muted small mt-3 mb-0">Sample figures. Connect your analyzer history to show live data.</p>
          </div>
        </div>

        {/* Clause checklist */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
            <h5 className="serif fs-4 fw-bold text-dark mb-1">Essential clause checklist</h5>
            <p className="text-muted small mb-3">What every agreement should address</p>
            <ul className="list-unstyled mb-3">
              {CLAUSE_CHECKLIST.map((c) => (
                <li key={c} className="d-flex align-items-start mb-2 text-dark small">
                  <i className="fa-solid fa-circle-check text-success me-2 mt-1"></i>{c}
                </li>
              ))}
            </ul>
            <Link to="/compliance" className="btn btn-sm btn-outline-dark fw-bold">Browse clause templates</Link>
          </div>
        </div>

        {/* Recent activity */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
            <h5 className="serif fs-4 fw-bold text-dark mb-1">Recent activity</h5>
            <p className="text-muted small mb-3">Latest work in your workspace</p>
            {ACTIVITY.map((a) => (
              <div key={a.text} className="d-flex align-items-start mb-3">
                <div
                  className={`bg-${a.tone} bg-opacity-10 text-${a.tone} rounded-3 d-flex align-items-center justify-content-center me-3`}
                  style={{ width: 40, height: 40, flexShrink: 0 }}
                >
                  <i className={`fa-solid ${a.icon}`}></i>
                </div>
                <div>
                  <div className="fw-semibold text-dark small">{a.text}</div>
                  <div className="text-muted small">{a.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Statute library + tracker ===== */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
            <div className="d-flex align-items-center mb-3">
              <i className="fa-solid fa-book-open text-primary fs-4 me-3"></i>
              <div>
                <h5 className="serif fs-4 fw-bold text-dark mb-0">Statute quick reference</h5>
                <small className="text-muted">Key Indian laws behind your analysis</small>
              </div>
            </div>
            <div className="row g-3">
              {STATUTES.map((s) => (
                <div className="col-md-6" key={s.act}>
                  <Link to="/compliance" className="text-decoration-none">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="fw-semibold text-dark small mb-1">
                        <i className="fa-solid fa-scroll gold me-2"></i>{s.act}
                      </div>
                      <small className="text-muted">{s.note}</small>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div
            className="card border-0 shadow-sm text-white rounded-4 p-4 h-100 d-flex flex-column justify-content-between"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
          >
            <div>
              <div className="bg-primary bg-opacity-25 text-primary p-3 rounded-3 d-inline-block mb-3">
                <i className="fa-solid fa-list-check fs-3"></i>
              </div>
              <h5 className="serif fs-4 fw-bold">Complaint Tracker</h5>
              <p className="small opacity-75 lh-base mb-0">
                Log grievances, follow case status, and escalate to the right forum with a clear record of every step.
              </p>
            </div>
            {/* Change "/tracker" to the exact route used in your App.jsx */}
            <Link to="/tracker" className="btn btn-primary fw-bold mt-3">
              Track a complaint <i className="fa-solid fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Disclaimer ===== */}
      <div
        className="rounded-3 p-3 d-flex align-items-start"
        style={{ background: 'rgba(201,162,75,.1)', border: '1px solid rgba(201,162,75,.35)' }}
      >
        <i className="fa-solid fa-triangle-exclamation gold me-3 mt-1"></i>
        <small className="text-light opacity-75">
          <strong className="gold">Legal notice:</strong> LexiAI provides informational analysis and does not
          replace advice from a qualified advocate. Review all outputs before relying on them in any legal matter.
        </small>
      </div>
    </div>
  );
}