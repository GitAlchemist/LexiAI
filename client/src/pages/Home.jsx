import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/* ------------------------------------------------------------------ */
/*  Legal background art (inline SVG, no image file needed).           */
/*  A court building: pediment, columns and steps, drawn in line art.  */
/*  To use your own photo instead, set COURT_BG = "url('/legal-bg.jpg')" */
/*  and put legal-bg.jpg inside your /public folder.                   */
/* ------------------------------------------------------------------ */
const courtSvg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 520' fill='none' stroke='white' stroke-width='3' stroke-linejoin='round'>
  <polygon points='60,170 400,40 740,170'/>
  <polygon points='140,160 400,62 660,160' stroke-width='1.5'/>
  <circle cx='400' cy='118' r='22' stroke-width='2'/>
  <rect x='60' y='170' width='680' height='28'/>
  <rect x='80' y='198' width='640' height='16' stroke-width='2'/>
  <g>
    <rect x='110' y='214' width='44' height='230'/><rect x='100' y='214' width='64' height='14'/><rect x='100' y='432' width='64' height='14'/>
    <rect x='214' y='214' width='44' height='230'/><rect x='204' y='214' width='64' height='14'/><rect x='204' y='432' width='64' height='14'/>
    <rect x='318' y='214' width='44' height='230'/><rect x='308' y='214' width='64' height='14'/><rect x='308' y='432' width='64' height='14'/>
    <rect x='438' y='214' width='44' height='230'/><rect x='428' y='214' width='64' height='14'/><rect x='428' y='432' width='64' height='14'/>
    <rect x='542' y='214' width='44' height='230'/><rect x='532' y='214' width='64' height='14'/><rect x='532' y='432' width='64' height='14'/>
    <rect x='646' y='214' width='44' height='230'/><rect x='636' y='214' width='64' height='14'/><rect x='636' y='432' width='64' height='14'/>
  </g>
  <rect x='80' y='446' width='640' height='18'/>
  <rect x='60' y='464' width='680' height='18'/>
  <rect x='40' y='482' width='720' height='18'/>
</svg>`;

const COURT_BG = `url("data:image/svg+xml;utf8,${encodeURIComponent(courtSvg)}")`;

/* Latin legal maxims: one is shown per day */
const MAXIMS = [
  { latin: 'Audi alteram partem', meaning: 'Hear the other side. No one should be condemned unheard.' },
  { latin: 'Pacta sunt servanda', meaning: 'Agreements must be kept. The foundation of contract law.' },
  { latin: 'Ubi jus ibi remedium', meaning: 'Where there is a right, there is a remedy.' },
  { latin: 'Nemo judex in causa sua', meaning: 'No one should be a judge in their own cause.' },
  { latin: 'Ignorantia juris non excusat', meaning: 'Ignorance of the law is not an excuse.' },
  { latin: 'Actus non facit reum nisi mens sit rea', meaning: 'An act alone does not make a person guilty without a guilty mind.' },
  { latin: 'Caveat emptor', meaning: 'Let the buyer beware. Review before you commit.' },
];

/* Practice areas (matches the 5 statutory frameworks) */
const PRACTICE_AREAS = [
  { icon: 'fa-people-roof', label: 'Personal & Family', note: 'Succession, marriage, property' },
  { icon: 'fa-helmet-safety', label: 'Labour & Employment', note: 'Contracts, disputes, termination' },
  { icon: 'fa-building-columns', label: 'Corporate & Startup', note: 'Liability, shareholders, IP' },
  { icon: 'fa-user-lock', label: 'Data Privacy', note: 'DPDP Act, consent, breach' },
  { icon: 'fa-cart-shopping', label: 'Consumer Protection', note: 'Rights, refunds, complaints' },
];

/* SAMPLE data: replace with real data from your API later */
const DEADLINES = [
  { title: 'Vendor Agreement: review pending', due: 'Due in 2 days', level: 'danger' },
  { title: 'Employment contract: clause check', due: 'Due in 5 days', level: 'warning' },
  { title: 'NDA renewal: signature stage', due: 'Due in 9 days', level: 'primary' },
];

const RECENT = [
  { icon: 'fa-file-contract', text: 'Lease Agreement analysed', meta: 'Risk score 72 / 100', color: 'primary' },
  { icon: 'fa-robot', text: 'Asked: notice period rules', meta: 'Labour Law', color: 'success' },
  { icon: 'fa-shield-halved', text: 'Indemnity clause template opened', meta: 'Compliance Engine', color: 'warning' },
];

export default function Home() {
  const { user } = useContext(AuthContext);

  const today = useMemo(() => new Date(), []);
  const dateLabel = today.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const maxim = MAXIMS[dayOfYear % MAXIMS.length];

  return (
    <div className="container-fluid p-4 position-relative" style={{ minHeight: '100%', overflow: 'hidden' }}>
      {/* Small hover/legal-accent styles (theme colours unchanged) */}
      <style>{`
        .lexi-card { transition: transform .2s ease, box-shadow .2s ease; }
        .lexi-card:hover { transform: translateY(-3px); box-shadow: 0 .75rem 1.5rem rgba(0,0,0,.25) !important; }
        .lexi-rule { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,193,7,.6), transparent); }
        .lexi-top-accent { border-top: 3px solid var(--accent, #0d6efd) !important; }
      `}</style>

      {/* Page watermark: translucent court building behind everything */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: COURT_BG,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center 62%',
          backgroundSize: 'min(1100px, 95%)',
          opacity: 0.07,
        }}
      />

      <div className="position-relative" style={{ zIndex: 1 }}>
        {/* ---------------- Welcome Hero Banner ---------------- */}
        <div
          className="card border-0 text-white rounded-4 p-4 p-md-5 mb-4 shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Hero watermark */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', right: '-40px', bottom: '-30px', width: '520px', height: '340px',
              backgroundImage: COURT_BG, backgroundRepeat: 'no-repeat', backgroundSize: 'contain',
              opacity: 0.1, pointerEvents: 'none',
            }}
          />
          <div className="row align-items-center position-relative">
            <div className="col-lg-8">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="badge bg-primary text-white px-3 py-2 rounded-pill">
                  <i className="fa-solid fa-sparkles me-2"></i>Legal Intelligence Operating System
                </span>
                <span className="badge border border-warning border-opacity-50 text-warning px-3 py-2 rounded-pill">
                  <i className="fa-solid fa-gavel me-2"></i>{dateLabel}
                </span>
              </div>
              <h1 className="fw-bold display-6 mb-2">
                Welcome back, Counsel <span className="text-primary">{user?.email?.split('@')[0]}</span>
              </h1>
              <div className="lexi-rule my-3" style={{ maxWidth: 420 }}></div>
              <p className="text-light opacity-75 fs-6 lh-lg mb-4">
                LexiAI equips your practice with real-time contract vulnerability scoring, multi-category statutory legal advisories, and an interactive compliance repository.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/analyzer" className="btn btn-primary px-4 py-2.5 fw-bold shadow-sm">
                  <i className="fa-solid fa-file-contract me-2"></i>Analyze Contract
                </Link>
                <Link to="/assistant" className="btn btn-outline-light px-4 py-2.5 fw-bold">
                  <i className="fa-solid fa-robot me-2"></i>Ask Legal AI
                </Link>
              </div>
              <div className="small text-light opacity-75">
                <i className="fa-solid fa-quote-left text-warning me-2"></i>
                <span className="fst-italic fw-semibold text-white">{maxim.latin}</span>
                <span className="mx-2">|</span>{maxim.meaning}
              </div>
            </div>
            <div className="col-lg-4 text-center d-none d-lg-block">
              <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block border border-primary border-opacity-25">
                <i className="fa-solid fa-scale-balanced text-primary display-1"></i>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Metric Cards Row (kept centred) ---------------- */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card lexi-card lexi-top-accent border-0 shadow-sm p-4 bg-white rounded-3 h-100" style={{ '--accent': '#0d6efd' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Contract Risk Gauge</span>
                <i className="fa-solid fa-shield-halved text-primary fs-4"></i>
              </div>
              <h3 className="fw-bold text-dark my-1">1,248</h3>
              <small className="text-success"><i className="fa-solid fa-arrow-up me-1"></i>Contracts Audited</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card lexi-card lexi-top-accent border-0 shadow-sm p-4 bg-white rounded-3 h-100" style={{ '--accent': '#198754' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Statutory Categories</span>
                <i className="fa-solid fa-layer-group text-success fs-4"></i>
              </div>
              <h3 className="fw-bold text-dark my-1">5 Frameworks</h3>
              <small className="text-muted">Personal, Labor, Corporate, Privacy & Consumer</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card lexi-card lexi-top-accent border-0 shadow-sm p-4 bg-white rounded-3 h-100" style={{ '--accent': '#ffc107' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Active Jurisdiction</span>
                <i className="fa-solid fa-location-dot text-warning fs-4"></i>
              </div>
              <h5 className="fw-bold text-dark my-1 text-truncate">{user?.jurisdiction || 'India'}</h5>
              <small className="text-success"><i className="fa-solid fa-check-circle me-1"></i>Models Sync Active</small>
            </div>
          </div>
        </div>

        {/* ---------------- Practice Areas ---------------- */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <h6 className="text-white fw-bold mb-0 text-uppercase">
            <i className="fa-solid fa-landmark text-warning me-2"></i>Practice Areas
          </h6>
          <div className="lexi-rule flex-grow-1"></div>
        </div>
        <div className="row g-3 mb-4">
          {PRACTICE_AREAS.map((a) => (
            <div className="col-6 col-lg" key={a.label}>
              <div className="card lexi-card border-0 shadow-sm bg-white rounded-3 h-100 p-3 text-center">
                <i className={`fa-solid ${a.icon} text-primary fs-3 mb-2`}></i>
                <div className="fw-bold text-dark small">{a.label}</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{a.note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- Direct Module Cards ---------------- */}
        <div className="row g-4 mb-4">
          <div className="col-md-6 col-xl-3">
            <div className="card lexi-card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
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

          <div className="col-md-6 col-xl-3">
            <div className="card lexi-card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
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

          <div className="col-md-6 col-xl-3">
            <div className="card lexi-card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
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

          {/* New: Complaint Tracker (already in your sidebar). Change the route if yours differs */}
          <div className="col-md-6 col-xl-3">
            <div className="card lexi-card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-3 d-inline-block mb-3">
                  <i className="fa-solid fa-list-check fs-3"></i>
                </div>
                <h5 className="fw-bold text-dark">Complaint Tracker</h5>
                <p className="text-muted small lh-base">
                  File complaints, follow case status, and escalate to the right forum with a clear record of every step.
                </p>
              </div>
              <Link to="/tracker" className="btn btn-outline-danger w-100 fw-bold mt-3">
                Open Tracker <i className="fa-solid fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* ---------------- Case Desk: deadlines + recent activity ---------------- */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-dark mb-0">
                  <i className="fa-solid fa-calendar-check text-primary me-2"></i>Deadlines & Reviews
                </h6>
                <span className="badge bg-light text-muted border">Sample data</span>
              </div>
              {DEADLINES.map((d) => (
                <div key={d.title} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <span className={`bg-${d.level} rounded-circle d-inline-block`} style={{ width: 10, height: 10 }}></span>
                    <span className="text-dark small fw-semibold">{d.title}</span>
                  </div>
                  <span className={`badge bg-${d.level} bg-opacity-10 text-${d.level === 'warning' ? 'dark' : d.level}`}>{d.due}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-dark mb-0">
                  <i className="fa-solid fa-clock-rotate-left text-success me-2"></i>Recent Activity
                </h6>
                <span className="badge bg-light text-muted border">Sample data</span>
              </div>
              {RECENT.map((r) => (
                <div key={r.text} className="d-flex align-items-center gap-3 py-2 border-bottom">
                  <div className={`bg-${r.color} bg-opacity-10 text-${r.color} rounded-3 d-flex align-items-center justify-content-center`} style={{ width: 38, height: 38 }}>
                    <i className={`fa-solid ${r.icon}`}></i>
                  </div>
                  <div>
                    <div className="text-dark small fw-semibold">{r.text}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{r.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- Legal disclaimer footer ---------------- */}
        <div className="lexi-rule mb-3"></div>
        <p className="text-center text-light opacity-50 small mb-0">
          <i className="fa-solid fa-scale-balanced me-2"></i>
          LexiAI provides AI-assisted legal information and is not a substitute for advice from a qualified advocate.
          All analyses should be verified before reliance.
        </p>
      </div>
    </div>
  );
}