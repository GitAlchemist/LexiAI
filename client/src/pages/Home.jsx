import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/* ------------------------------------------------------------------
   Transparent legal backdrop (courthouse pillars).
   Drawn as inline SVG so no extra image file is needed.
   To use a real photo instead, set:
   const BACKDROP = "url('/images/courthouse.jpg')";
   (put the file in /public/images/) and tune BACKDROP_OPACITY below.
------------------------------------------------------------------- */
const pillars = [190, 320, 450, 580, 710, 840, 966]
  .map(
    (x) =>
      `<rect x="${x}" y="246" width="44" height="300"/><rect x="${x - 12}" y="546" width="68" height="18"/><rect x="${x - 12}" y="228" width="68" height="18"/>`
  )
  .join('');

const courthouseSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" fill="none" stroke="#ffffff" stroke-width="3" stroke-linejoin="round">
  <polygon points="150,200 600,60 1050,200"/>
  <polygon points="230,190 600,85 970,190" stroke-width="1.5"/>
  <circle cx="600" cy="150" r="26"/>
  <rect x="140" y="200" width="920" height="30"/>
  ${pillars}
  <rect x="150" y="564" width="900" height="22"/>
  <rect x="120" y="586" width="960" height="22"/>
  <rect x="90" y="608" width="1020" height="24"/>
</svg>`;

const BACKDROP = `url("data:image/svg+xml,${encodeURIComponent(courthouseSvg)}")`;
const BACKDROP_OPACITY = 0.07; // 0 = invisible, 1 = solid

const practiceAreas = [
  { icon: 'fa-user-shield', title: 'Personal & Family Law', text: 'Succession, wills, marriage, maintenance and property rights.', tone: 'primary' },
  { icon: 'fa-briefcase', title: 'Labour & Employment', text: 'Termination, wages, notice periods and workplace disputes.', tone: 'success' },
  { icon: 'fa-building', title: 'Corporate & Startups', text: 'Incorporation, shareholder terms, liabilities and compliance.', tone: 'warning' },
  { icon: 'fa-user-lock', title: 'Data Privacy', text: 'Consent, data fiduciary duties and breach obligations.', tone: 'info' },
  { icon: 'fa-cart-shopping', title: 'Consumer Protection', text: 'Defective goods, deficient services and refund remedies.', tone: 'danger' },
];

const workflow = [
  { icon: 'fa-cloud-arrow-up', title: 'Upload agreement', text: 'Add a PDF or TXT contract to the analyzer.' },
  { icon: 'fa-magnifying-glass-chart', title: 'Review risk report', text: 'See the risk score, summary and missing clauses.' },
  { icon: 'fa-scale-balanced', title: 'Check statutes', text: 'Match clauses against the compliance library.' },
  { icon: 'fa-gavel', title: 'Act with confidence', text: 'Ask the Legal AI or log a complaint to escalate.' },
];

const keyClauses = [
  'Governing Law & Jurisdiction',
  'Indemnification',
  'Limitation of Liability',
  'Confidentiality / NDA',
  'Termination & Notice',
  'Dispute Resolution & Arbitration',
  'Force Majeure',
  'Intellectual Property',
];

const recentActivity = [
  { icon: 'fa-file-contract', color: 'primary', title: 'Service Agreement reviewed', meta: 'Risk score 72 / 100 · 3 clauses missing' },
  { icon: 'fa-robot', color: 'success', title: 'Legal Assistant query', meta: 'Notice period under employment contract' },
  { icon: 'fa-shield-halved', color: 'warning', title: 'Compliance search', meta: 'Indemnification clause templates' },
  { icon: 'fa-list-check', color: 'danger', title: 'Complaint escalated', meta: 'Consumer dispute · awaiting response' },
];

const quickQuestions = [
  'What is a valid notice period for termination?',
  'Who inherits without a will?',
  'What must a startup disclose to investors?',
  'How do I file a consumer complaint?',
];

export default function Home() {
  const { user } = useContext(AuthContext);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="position-relative" style={{ minHeight: '100%', overflow: 'hidden' }}>
      {/* Transparent legal backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: BACKDROP,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center bottom',
          backgroundSize: 'min(1200px, 100%) auto',
          opacity: BACKDROP_OPACITY,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container-fluid p-4 position-relative" style={{ zIndex: 1 }}>
        {/* Welcome Hero Banner */}
        <div
          className="card border-0 text-white rounded-4 p-4 p-md-5 mb-4 shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: BACKDROP,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right -120px bottom -40px',
              backgroundSize: '760px auto',
              opacity: 0.06,
              pointerEvents: 'none',
            }}
          />
          <div className="row align-items-center position-relative">
            <div className="col-lg-8">
              <span className="badge bg-primary text-white px-3 py-2 rounded-pill mb-3">
                <i className="fa-solid fa-scale-balanced me-2"></i>Legal Intelligence Operating System
              </span>
              <h1 className="fw-bold display-6 mb-2">
                {greeting}, Counsel <span className="text-primary">{user?.email?.split('@')[0]}</span>
              </h1>
              <p className="text-light opacity-50 small mb-3">
                <i className="fa-regular fa-calendar me-2"></i>{today}
              </p>
              <p className="text-light opacity-75 fs-6 lh-lg mb-4">
                LexiAI equips your practice with real-time contract vulnerability scoring, multi-category
                statutory legal advisories, and an interactive compliance repository.
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
              <p className="text-light opacity-50 small fst-italic mt-3 mb-0">
                “Justice delayed is justice denied.”
              </p>
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
                  Log disputes, follow each case through its stages, and see when escalation is the next step.
                </p>
              </div>
              {/* Change "/tracker" if your route for this page is different */}
              <Link to="/tracker" className="btn btn-outline-danger w-100 fw-bold mt-3">
                Open Tracker <i className="fa-solid fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Practice Areas */}
        <div className="card border-0 shadow-sm bg-white rounded-4 p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-dark mb-0">
              <i className="fa-solid fa-landmark text-primary me-2"></i>Practice Areas Covered
            </h5>
            <Link to="/assistant" className="small fw-bold text-decoration-none">
              Ask about any area <i className="fa-solid fa-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="row g-3">
            {practiceAreas.map((area) => (
              <div className="col-md-6 col-xl" key={area.title}>
                <div className="border rounded-3 p-3 h-100">
                  <div
                    className={`bg-${area.tone} bg-opacity-10 text-${area.tone} rounded-3 d-inline-flex align-items-center justify-content-center mb-2`}
                    style={{ width: 42, height: 42 }}
                  >
                    <i className={`fa-solid ${area.icon}`}></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-1">{area.title}</h6>
                  <p className="text-muted small mb-0 lh-base">{area.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow + Recent Activity */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
              <h5 className="fw-bold text-dark mb-3">
                <i className="fa-solid fa-gavel text-primary me-2"></i>How a Contract Review Works
              </h5>
              <div className="row g-3">
                {workflow.map((step, i) => (
                  <div className="col-sm-6" key={step.title}>
                    <div className="d-flex gap-3">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                        style={{ width: 38, height: 38 }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">
                          <i className={`fa-solid ${step.icon} text-primary me-2`}></i>{step.title}
                        </h6>
                        <p className="text-muted small mb-0 lh-base">{step.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
              <h5 className="fw-bold text-dark mb-3">
                <i className="fa-solid fa-clock-rotate-left text-primary me-2"></i>Recent Activity
              </h5>
              <ul className="list-unstyled mb-0">
                {recentActivity.map((item, i) => (
                  <li
                    key={item.title}
                    className={`d-flex align-items-start gap-3 py-2 ${i < recentActivity.length - 1 ? 'border-bottom' : ''}`}
                  >
                    <div
                      className={`bg-${item.color} bg-opacity-10 text-${item.color} rounded-3 d-flex align-items-center justify-content-center flex-shrink-0`}
                      style={{ width: 36, height: 36 }}
                    >
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark small">{item.title}</div>
                      <div className="text-muted small">{item.meta}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Clause checklist + Quick questions */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm bg-white rounded-4 p-4 h-100">
              <h5 className="fw-bold text-dark mb-1">
                <i className="fa-solid fa-list-check text-primary me-2"></i>Clauses Every Contract Should Address
              </h5>
              <p className="text-muted small mb-3">The analyzer checks for these and flags what is missing.</p>
              <div className="row g-2">
                {keyClauses.map((clause) => (
                  <div className="col-sm-6" key={clause}>
                    <div className="d-flex align-items-center small text-dark">
                      <i className="fa-solid fa-check-circle text-success me-2"></i>{clause}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <Link to="/compliance" className="btn btn-outline-primary fw-bold mt-4">
                  Browse clause library <i className="fa-solid fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div
              className="card border-0 text-white rounded-4 p-4 h-100 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
            >
              <h5 className="fw-bold mb-3">
                <i className="fa-solid fa-comments text-primary me-2"></i>Quick Legal Questions
              </h5>
              <div className="d-flex flex-column gap-2">
                {quickQuestions.map((q) => (
                  <Link
                    key={q}
                    to="/assistant"
                    state={{ prompt: q }}
                    className="btn btn-outline-light text-start small"
                  >
                    <i className="fa-solid fa-quote-left me-2 opacity-50"></i>{q}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="card border-0 rounded-4 p-3 mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <p className="small text-light opacity-75 mb-0 lh-base">
            <i className="fa-solid fa-circle-info me-2"></i>
            LexiAI provides legal information and AI-assisted analysis for research and drafting support.
            It is not a substitute for advice from a qualified advocate. Verify every statutory reference
            before relying on it in a filing or agreement.
          </p>
        </div>
      </div>
    </div>
  );
}