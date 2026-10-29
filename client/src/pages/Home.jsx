import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/* ------------------------------------------------------------------
   BACKGROUND IMAGE
   Default: inline SVG courthouse + scales of justice (no files needed).
   To use your own photo: put it in /public (e.g. /public/legal-bg.jpg)
   and set  const CUSTOM_BG = '/legal-bg.jpg';
------------------------------------------------------------------- */
const CUSTOM_BG = '';

const columns = [190, 330, 470, 610, 750, 890]
  .map(
    (x) => `<rect x="${x}" y="360" width="80" height="330"/>
<line x1="${x + 20}" y1="360" x2="${x + 20}" y2="690" stroke-width="1.5"/>
<line x1="${x + 40}" y1="360" x2="${x + 40}" y2="690" stroke-width="1.5"/>
<line x1="${x + 60}" y1="360" x2="${x + 60}" y2="690" stroke-width="1.5"/>
<rect x="${x - 12}" y="345" width="104" height="15"/>
<rect x="${x - 12}" y="690" width="104" height="15"/>`
  )
  .join('');

const courthouseSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" fill="none" stroke="#94a3b8" stroke-width="3">
  <polygon points="150,300 600,90 1050,300"/>
  <polygon points="230,290 600,125 970,290" stroke-width="1.5"/>
  <circle cx="600" cy="215" r="34"/>
  <line x1="120" y1="320" x2="1080" y2="320"/>
  <line x1="120" y1="345" x2="1080" y2="345"/>
  ${columns}
  <rect x="100" y="705" width="1000" height="22"/>
  <rect x="70" y="727" width="1060" height="22"/>
  <rect x="40" y="749" width="1120" height="22"/>
</svg>`);

const scalesSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round">
  <line x1="200" y1="40" x2="200" y2="340"/>
  <line x1="80" y1="90" x2="320" y2="90"/>
  <circle cx="200" cy="40" r="14"/>
  <line x1="80" y1="90" x2="40" y2="210"/><line x1="80" y1="90" x2="120" y2="210"/>
  <path d="M30 210 H130 A50 40 0 0 1 30 210Z"/>
  <line x1="320" y1="90" x2="280" y2="210"/><line x1="320" y1="90" x2="360" y2="210"/>
  <path d="M270 210 H370 A50 40 0 0 1 270 210Z"/>
  <path d="M140 340 H260"/><path d="M160 320 H240"/>
</svg>`);

const MAXIMS = [
  { latin: 'Audi alteram partem', meaning: 'Hear the other side — no one should be condemned unheard.' },
  { latin: 'Ubi jus ibi remedium', meaning: 'Where there is a right, there is a remedy.' },
  { latin: 'Pacta sunt servanda', meaning: 'Agreements must be kept.' },
  { latin: 'Nemo judex in causa sua', meaning: 'No one should be a judge in their own cause.' },
  { latin: 'Ignorantia juris non excusat', meaning: 'Ignorance of the law is no excuse.' },
  { latin: 'Actus non facit reum nisi mens sit rea', meaning: 'An act is not guilty unless the mind is guilty.' },
  { latin: 'Lex non cogit ad impossibilia', meaning: 'The law does not compel the impossible.' },
];

const PRACTICE_AREAS = [
  { icon: 'fa-people-roof', title: 'Personal & Family', act: 'Hindu Succession Act, Special Marriage Act', color: 'primary' },
  { icon: 'fa-helmet-safety', title: 'Labour & Employment', act: 'Industrial Disputes Act, Code on Wages, POSH Act', color: 'success' },
  { icon: 'fa-building-columns', title: 'Corporate & Startup', act: 'Companies Act 2013, LLP Act, Contract Act 1872', color: 'warning' },
  { icon: 'fa-user-shield', title: 'Data Privacy', act: 'DPDP Act 2023, IT Act 2000', color: 'info' },
  { icon: 'fa-cart-shopping', title: 'Consumer Protection', act: 'Consumer Protection Act 2019, E-Commerce Rules', color: 'danger' },
];

const WORKFLOW = [
  { icon: 'fa-cloud-arrow-up', title: 'Upload', text: 'Add a PDF or TXT agreement.' },
  { icon: 'fa-magnifying-glass-chart', title: 'Analyze', text: 'AI scores risk and flags weak clauses.' },
  { icon: 'fa-scale-balanced', title: 'Review', text: 'Compare against statutory requirements.' },
  { icon: 'fa-gavel', title: 'Act', text: 'Fix clauses, escalate or track a complaint.' },
];

const ACTIVITY = [
  { icon: 'fa-file-contract', color: 'primary', text: 'Employment Agreement analyzed', meta: 'Risk score 62 · High' },
  { icon: 'fa-robot', color: 'success', text: 'Asked: notice period for resignation', meta: 'Labour & Employment' },
  { icon: 'fa-shield-halved', color: 'warning', text: 'Indemnity clause template viewed', meta: 'Compliance Engine' },
  { icon: 'fa-list-check', color: 'danger', text: 'Complaint escalated to consumer forum', meta: 'Complaint Tracker' },
];

const QUICK_CHECKS = [
  'Governing law & jurisdiction clause',
  'Termination & notice period',
  'Indemnification & liability cap',
  'Confidentiality / NDA terms',
  'Dispute resolution & arbitration',
  'Data protection obligations',
];

const GOLD = '#c9a45c';

function SectionTitle({ icon, children }) {
  return (
    <div className="d-flex align-items-center gap-3 mb-3">
      <h5 className="fw-bold text-white mb-0">
        <i className={`fa-solid ${icon} me-2`} style={{ color: GOLD }}></i>
        {children}
      </h5>
      <div className="flex-grow-1" style={{ height: 1, background: 'rgba(201,164,92,0.4)' }}></div>
    </div>
  );
}

export default function Home() {
  const { user } = useContext(AuthContext);

  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const maxim = useMemo(() => {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    return MAXIMS[dayOfYear % MAXIMS.length];
  }, []);

  return (
    <div className="position-relative" style={{ minHeight: '100%' }}>
      {/* Transparent legal background image (sits behind all content) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: CUSTOM_BG
            ? `url(${CUSTOM_BG})`
            : `url("data:image/svg+xml,${courthouseSvg}"), url("data:image/svg+xml,${scalesSvg}")`,
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundPosition: CUSTOM_BG ? 'center' : 'center 70%, 96% 8%',
          backgroundSize: CUSTOM_BG ? 'cover' : 'min(1100px, 90%), 320px',
          opacity: CUSTOM_BG ? 0.12 : 0.1,
        }}
      />

      <div className="container-fluid p-4 position-relative" style={{ zIndex: 1 }}>
        {/* Hero */}
        <div
          className="card border-0 text-white rounded-4 p-4 p-md-5 mb-4 shadow-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)',
            position: 'relative',
            overflow: 'hidden',
            borderTop: `3px solid ${GOLD}`,
          }}
        >
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="badge bg-primary text-white px-3 py-2 rounded-pill">
                  <i className="fa-solid fa-sparkles me-2"></i>Legal Intelligence Operating System
                </span>
                <span className="badge bg-transparent border border-secondary text-light px-3 py-2 rounded-pill">
                  <i className="fa-regular fa-calendar me-2"></i>{dateLabel}
                </span>
              </div>

              <h1 className="fw-bold display-6 mb-3">
                Welcome back, Counsel <span className="text-primary">{user?.email?.split('@')[0]}</span>
              </h1>

              <p className="text-light opacity-75 fs-6 lh-lg mb-3">
                LexiAI equips your practice with real-time contract vulnerability scoring, multi-category statutory
                legal advisories, and an interactive compliance repository.
              </p>

              {/* Legal maxim of the day */}
              <div className="mb-4 py-2 ps-3" style={{ borderLeft: `3px solid ${GOLD}` }}>
                <div className="fw-semibold fst-italic" style={{ color: GOLD }}>“{maxim.latin}”</div>
                <small className="text-light opacity-75">{maxim.meaning}</small>
              </div>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/analyzer" className="btn btn-primary px-4 py-2.5 fw-bold shadow-sm">
                  <i className="fa-solid fa-file-contract me-2"></i>Analyze Contract
                </Link>
                <Link to="/assistant" className="btn btn-outline-light px-4 py-2.5 fw-bold">
                  <i className="fa-solid fa-robot me-2"></i>Ask Legal AI
                </Link>
                <Link to="/compliance" className="btn btn-outline-light px-4 py-2.5 fw-bold">
                  <i className="fa-solid fa-gavel me-2"></i>Search Statutes
                </Link>
              </div>

              <div className="d-flex flex-wrap gap-4 small text-light opacity-75">
                <span><i className="fa-solid fa-lock me-2" style={{ color: GOLD }}></i>Attorney-client confidential</span>
                <span><i className="fa-solid fa-shield-halved me-2" style={{ color: GOLD }}></i>Encrypted session</span>
                <span><i className="fa-solid fa-landmark me-2" style={{ color: GOLD }}></i>Indian law frameworks</span>
              </div>
            </div>

            <div className="col-lg-4 text-center d-none d-lg-block">
              <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block border border-primary border-opacity-25">
                <i className="fa-solid fa-scale-balanced text-primary display-1"></i>
              </div>
              <div className="mt-3 small text-uppercase" style={{ color: GOLD, letterSpacing: '0.2em' }}>
                Justice · Integrity · Counsel
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100" style={{ borderLeft: '4px solid #0d6efd' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Contract Risk Gauge</span>
                <i className="fa-solid fa-shield-halved text-primary fs-4"></i>
              </div>
              <h3 className="fw-bold text-dark my-1">1,248</h3>
              <small className="text-success"><i className="fa-solid fa-arrow-up me-1"></i>Contracts Audited</small>
              <div className="progress mt-3" style={{ height: 6 }}>
                <div className="progress-bar bg-success" style={{ width: '58%' }} title="Low risk"></div>
                <div className="progress-bar bg-warning" style={{ width: '27%' }} title="Medium risk"></div>
                <div className="progress-bar bg-danger" style={{ width: '15%' }} title="High risk"></div>
              </div>
              <small className="text-muted mt-1">Low 58% · Medium 27% · High 15%</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100" style={{ borderLeft: '4px solid #198754' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Statutory Categories</span>
                <i className="fa-solid fa-layer-group text-success fs-4"></i>
              </div>
              <h3 className="fw-bold text-dark my-1">5 Frameworks</h3>
              <small className="text-muted">Personal, Labor, Corporate, Privacy & Consumer</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100" style={{ borderLeft: '4px solid #ffc107' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Active Jurisdiction</span>
                <i className="fa-solid fa-location-dot text-warning fs-4"></i>
              </div>
              <h5 className="fw-bold text-dark my-1 text-truncate">{user?.jurisdiction || 'India'}</h5>
              <small className="text-success"><i className="fa-solid fa-check-circle me-1"></i>Models Sync Active</small>
            </div>
          </div>
        </div>

        {/* Practice areas */}
        <SectionTitle icon="fa-landmark">Practice Areas</SectionTitle>
        <div className="row g-3 mb-4">
          {PRACTICE_AREAS.map((p) => (
            <div className="col-md-6 col-lg" key={p.title}>
              <Link to="/assistant" className="text-decoration-none">
                <div className="card border-0 shadow-sm bg-white rounded-3 p-3 h-100">
                  <div
                    className={`bg-${p.color} bg-opacity-10 text-${p.color} rounded-3 d-inline-flex align-items-center justify-content-center mb-2`}
                    style={{ width: 44, height: 44 }}
                  >
                    <i className={`fa-solid ${p.icon} fs-5`}></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-1">{p.title}</h6>
                  <small className="text-muted lh-sm d-block">{p.act}</small>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Module cards */}
        <SectionTitle icon="fa-briefcase">Legal Workspace</SectionTitle>
        <div className="row g-4 mb-4">
          <div className="col-md-6 col-xl-3">
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

          <div className="col-md-6 col-xl-3">
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

          <div className="col-md-6 col-xl-3">
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

          <div className="col-md-6 col-xl-3">
            <div className="card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-3 d-inline-block mb-3">
                  <i className="fa-solid fa-list-check fs-3"></i>
                </div>
                <h5 className="fw-bold text-dark">Complaint Tracker</h5>
                <p className="text-muted small lh-base">
                  File complaints, follow case status, and escalate to the right forum when a dispute stays unresolved.
                </p>
              </div>
              {/* Change "/complaints" to match your Complaint Tracker route */}
              <Link to="/complaints" className="btn btn-outline-danger w-100 fw-bold mt-3">
                Open Tracker <i className="fa-solid fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Workflow + checklist + activity */}
        <div className="row g-4 mb-4">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
              <h6 className="fw-bold text-dark mb-3">
                <i className="fa-solid fa-route me-2 text-primary"></i>How a matter moves through LexiAI
              </h6>
              {WORKFLOW.map((s, i) => (
                <div className="d-flex gap-3 mb-3" key={s.title}>
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 38, height: 38 }}
                    >
                      <i className={`fa-solid ${s.icon}`}></i>
                    </div>
                    {i < WORKFLOW.length - 1 && (
                      <div className="flex-grow-1 bg-primary bg-opacity-25" style={{ width: 2, minHeight: 20 }}></div>
                    )}
                  </div>
                  <div>
                    <div className="fw-bold text-dark">{s.title}</div>
                    <small className="text-muted">{s.text}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
              <h6 className="fw-bold text-dark mb-3">
                <i className="fa-solid fa-clipboard-check me-2 text-success"></i>Clauses every contract needs
              </h6>
              <ul className="list-unstyled mb-3">
                {QUICK_CHECKS.map((c) => (
                  <li className="d-flex gap-2 mb-2 small text-dark" key={c}>
                    <i className="fa-solid fa-circle-check text-success mt-1"></i>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <Link to="/analyzer" className="btn btn-sm btn-outline-primary fw-bold w-100 mt-auto">
                Check my contract
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
              <h6 className="fw-bold text-dark mb-3">
                <i className="fa-solid fa-clock-rotate-left me-2 text-warning"></i>Recent activity
              </h6>
              {ACTIVITY.map((a) => (
                <div className="d-flex gap-3 align-items-center mb-3" key={a.text}>
                  <div
                    className={`bg-${a.color} bg-opacity-10 text-${a.color} rounded-3 d-flex align-items-center justify-content-center flex-shrink-0`}
                    style={{ width: 40, height: 40 }}
                  >
                    <i className={`fa-solid ${a.icon}`}></i>
                  </div>
                  <div className="lh-sm">
                    <div className="small fw-bold text-dark">{a.text}</div>
                    <small className="text-muted">{a.meta}</small>
                  </div>
                </div>
              ))}
              <small className="text-muted fst-italic">Sample data — connect to your history API later.</small>
            </div>
          </div>
        </div>

        {/* Legal notice */}
        <div
          className="rounded-4 p-3 d-flex gap-3 align-items-start text-light"
          style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(201,164,92,0.4)' }}
        >
          <i className="fa-solid fa-scale-unbalanced-flip mt-1" style={{ color: GOLD }}></i>
          <small className="opacity-75 lh-base">
            <strong style={{ color: GOLD }}>Legal notice:</strong> LexiAI provides AI-assisted information and risk
            indicators for research and drafting support. It is not a substitute for advice from a qualified advocate.
            Verify statutes and case law before relying on any output.
          </small>
        </div>
      </div>
    </div>
  );
}