import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/* ------------------------------------------------------------------
   LEGAL BACKGROUND IMAGE (transparent watermark behind the page)
   - Default: built-in SVG courthouse + scales (no download needed).
   - To use a real photo instead: put it at  public/legal-bg.jpg
     and set  USE_PHOTO = true  below.
------------------------------------------------------------------- */
const USE_PHOTO = false;
const PHOTO_URL = '/legal-bg.jpg';

const courthouseSvg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800' fill='none' stroke='#60a5fa' stroke-width='3' stroke-linejoin='round'>
  <path d='M200 260 L600 90 L1000 260 Z'/>
  <path d='M240 250 L600 110 L960 250'/>
  <circle cx='600' cy='190' r='26'/>
  <rect x='200' y='260' width='800' height='34'/>
  <rect x='180' y='294' width='840' height='20'/>
  <g>
    <rect x='230' y='314' width='60' height='320'/><rect x='215' y='634' width='90' height='22'/>
    <rect x='380' y='314' width='60' height='320'/><rect x='365' y='634' width='90' height='22'/>
    <rect x='530' y='314' width='60' height='320'/><rect x='515' y='634' width='90' height='22'/>
    <rect x='680' y='314' width='60' height='320'/><rect x='665' y='634' width='90' height='22'/>
    <rect x='830' y='314' width='60' height='320'/><rect x='815' y='634' width='90' height='22'/>
  </g>
  <rect x='170' y='656' width='860' height='24'/>
  <rect x='140' y='680' width='920' height='24'/>
  <rect x='110' y='704' width='980' height='24'/>
  <g transform='translate(600 470)'>
    <line x1='0' y1='-90' x2='0' y2='90'/>
    <line x1='-120' y1='-60' x2='120' y2='-60'/>
    <path d='M-120 -60 L-155 10 L-85 10 Z'/><path d='M120 -60 L85 10 L155 10 Z'/>
    <path d='M-160 10 Q-120 40 -80 10'/><path d='M80 10 Q120 40 160 10'/>
    <rect x='-35' y='90' width='70' height='14'/>
  </g>
</svg>`;

const BG_IMAGE = USE_PHOTO
  ? `url(${PHOTO_URL})`
  : `url("data:image/svg+xml,${encodeURIComponent(courthouseSvg)}")`;

/* ------------------------------------------------------------------
   Sample data (replace with real API data later)
------------------------------------------------------------------- */
const keyActs = [
  { name: 'Indian Contract Act, 1872', tag: 'Corporate' },
  { name: 'Digital Personal Data Protection Act, 2023', tag: 'Privacy' },
  { name: 'Consumer Protection Act, 2019', tag: 'Consumer' },
  { name: 'Code on Wages, 2019', tag: 'Labor' },
  { name: 'Hindu Succession Act, 1956', tag: 'Personal' },
];

const recentMatters = [
  { title: 'Vendor Service Agreement', type: 'Contract Audit', risk: 'High', score: 78, date: 'Today' },
  { title: 'Employment Offer – Senior Developer', type: 'Contract Audit', risk: 'Low', score: 24, date: 'Yesterday' },
  { title: 'Startup Shareholder Agreement', type: 'Contract Audit', risk: 'Medium', score: 52, date: '2 days ago' },
  { title: 'Rental Lease – Commercial Unit', type: 'Contract Audit', risk: 'Medium', score: 46, date: '4 days ago' },
];

const riskBadge = { High: 'bg-danger', Medium: 'bg-warning text-dark', Low: 'bg-success' };
const riskBar = { High: 'bg-danger', Medium: 'bg-warning', Low: 'bg-success' };

const glass = { background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(4px)' };

export default function Home() {
  const { user } = useContext(AuthContext);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="position-relative" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Transparent legal image behind the whole page */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: BG_IMAGE,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center 140px',
          backgroundSize: 'min(1200px, 100%) auto',
          opacity: USE_PHOTO ? 0.12 : 0.14,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container-fluid p-4 position-relative" style={{ zIndex: 1 }}>
        {/* ---------- Welcome Hero Banner ---------- */}
        <div
          className="card border-0 text-white rounded-4 p-4 p-md-5 mb-4 shadow-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.92) 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <i
            className="fa-solid fa-scale-balanced"
            aria-hidden="true"
            style={{
              position: 'absolute', right: '-30px', bottom: '-50px',
              fontSize: '18rem', color: '#3b82f6', opacity: 0.06, transform: 'rotate(-8deg)',
            }}
          ></i>

          <div className="row align-items-center position-relative">
            <div className="col-lg-8">
              <span className="badge bg-primary text-white px-3 py-2 rounded-pill mb-3">
                <i className="fa-solid fa-gavel me-2"></i>Legal Intelligence Operating System
              </span>
              <h1 className="fw-bold display-6 mb-2">
                Welcome back, Counsel <span className="text-primary">{user?.email?.split('@')[0]}</span>
              </h1>
              <p className="text-primary fst-italic small mb-3">
                <i className="fa-solid fa-landmark me-2"></i>“Fiat justitia” — let justice be done
              </p>
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
                <Link to="/tracker" className="btn btn-outline-light px-4 py-2.5 fw-bold">
                  <i className="fa-solid fa-list-check me-2"></i>Track Complaint
                </Link>
              </div>
              <div className="d-flex flex-wrap gap-4 small text-light opacity-75">
                <span><i className="fa-regular fa-calendar me-2 text-primary"></i>{today}</span>
                <span><i className="fa-solid fa-lock me-2 text-primary"></i>Confidential &amp; encrypted workspace</span>
                <span><i className="fa-solid fa-user-shield me-2 text-primary"></i>Privilege-safe handling</span>
              </div>
            </div>
            <div className="col-lg-4 text-center d-none d-lg-block">
              <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block border border-primary border-opacity-25">
                <i className="fa-solid fa-scale-balanced text-primary display-1"></i>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Key statutes strip ---------- */}
        <div
          className="rounded-3 px-3 py-2 mb-4 d-flex align-items-center gap-4 overflow-auto"
          style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(96,165,250,0.25)' }}
        >
          <span className="badge bg-warning text-dark flex-shrink-0">
            <i className="fa-solid fa-book-bookmark me-1"></i>Key Statutes
          </span>
          {keyActs.map((a) => (
            <span key={a.name} className="text-light small text-nowrap opacity-75">
              <i className="fa-solid fa-gavel text-primary me-2"></i>
              {a.name} <span className="text-primary">({a.tag})</span>
            </span>
          ))}
        </div>

        {/* ---------- Metric Cards Row ---------- */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 rounded-3 h-100 border-start border-primary border-4" style={glass}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Contract Risk Gauge</span>
                <i className="fa-solid fa-shield-halved text-primary fs-4"></i>
              </div>
              <h3 className="fw-bold text-dark my-1">1,248</h3>
              <small className="text-success"><i className="fa-solid fa-arrow-up me-1"></i>Contracts Audited</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 rounded-3 h-100 border-start border-success border-4" style={glass}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Statutory Categories</span>
                <i className="fa-solid fa-layer-group text-success fs-4"></i>
              </div>
              <h3 className="fw-bold text-dark my-1">5 Frameworks</h3>
              <small className="text-muted">Personal, Labor, Corporate, Privacy &amp; Consumer</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 rounded-3 h-100 border-start border-warning border-4" style={glass}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Active Jurisdiction</span>
                <i className="fa-solid fa-location-dot text-warning fs-4"></i>
              </div>
              <h5 className="fw-bold text-dark my-1 text-truncate">{user?.jurisdiction || 'India'}</h5>
              <small className="text-success"><i className="fa-solid fa-check-circle me-1"></i>Models Sync Active</small>
            </div>
          </div>
        </div>

        {/* ---------- Direct Module Cards ---------- */}
        <div className="row g-4 mb-4">
          {[
            {
              icon: 'fa-file-contract', color: 'primary', title: 'Contract Analyzer', to: '/analyzer',
              btn: 'Open Analyzer', btnClass: 'btn-outline-primary',
              text: 'Upload PDF or TXT legal agreements to extract summaries, calculate risk scores, and highlight missing clauses.',
            },
            {
              icon: 'fa-robot', color: 'success', title: 'AI Legal Assistant', to: '/assistant',
              btn: 'Open Assistant', btnClass: 'btn-outline-success',
              text: 'Ask legal questions across civil succession, employment disputes, startup liabilities, and data protection rules.',
            },
            {
              icon: 'fa-shield-halved', color: 'warning', title: 'Compliance Engine', to: '/compliance',
              btn: 'Open Compliance', btnClass: 'btn-outline-warning text-dark',
              text: 'Explore mandatory statutory clause templates, indemnification standards, and governing law repositories.',
            },
          ].map((m) => (
            <div className="col-md-4" key={m.title}>
              <div className="card border-0 shadow-sm p-4 rounded-4 h-100 d-flex flex-column justify-content-between" style={glass}>
                <div>
                  <div className={`bg-${m.color} bg-opacity-10 text-${m.color} p-3 rounded-3 d-inline-block mb-3`}>
                    <i className={`fa-solid ${m.icon} fs-3`}></i>
                  </div>
                  <h5 className="fw-bold text-dark">{m.title}</h5>
                  <p className="text-muted small lh-base">{m.text}</p>
                </div>
                <Link to={m.to} className={`btn ${m.btnClass} w-100 fw-bold mt-3`}>
                  {m.btn} <i className="fa-solid fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- Recent Matters + Legal Toolkit ---------- */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 h-100" style={glass}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">
                    <i className="fa-solid fa-folder-open text-primary me-2"></i>Recent Matters
                  </h5>
                  <Link to="/analyzer" className="small fw-bold text-decoration-none">New audit</Link>
                </div>
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr className="text-muted small text-uppercase">
                        <th className="fw-bold border-0">Matter</th>
                        <th className="fw-bold border-0">Risk</th>
                        <th className="fw-bold border-0" style={{ minWidth: 140 }}>Score</th>
                        <th className="fw-bold border-0">When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMatters.map((m) => (
                        <tr key={m.title}>
                          <td>
                            <div className="fw-semibold text-dark">{m.title}</div>
                            <small className="text-muted">{m.type}</small>
                          </td>
                          <td><span className={`badge ${riskBadge[m.risk]}`}>{m.risk}</span></td>
                          <td>
                            <div className="progress" style={{ height: 6 }}>
                              <div className={`progress-bar ${riskBar[m.risk]}`} style={{ width: `${m.score}%` }}></div>
                            </div>
                            <small className="text-muted">{m.score}/100</small>
                          </td>
                          <td className="text-muted small">{m.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100" style={glass}>
              <div className="card-body p-4">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="fa-solid fa-briefcase text-warning me-2"></i>Legal Toolkit
                </h5>
                <div className="d-grid gap-2">
                  {[
                    { icon: 'fa-file-signature', label: 'Draft NDA / agreement', to: '/assistant' },
                    { icon: 'fa-scale-unbalanced', label: 'Check clause fairness', to: '/analyzer' },
                    { icon: 'fa-clock', label: 'Limitation period lookup', to: '/compliance' },
                    { icon: 'fa-bullhorn', label: 'File a consumer complaint', to: '/tracker' },
                    { icon: 'fa-user-lock', label: 'DPDP data-privacy check', to: '/compliance' },
                  ].map((t) => (
                    <Link
                      key={t.label}
                      to={t.to}
                      className="d-flex align-items-center gap-3 p-2 rounded-3 text-decoration-none text-dark bg-light"
                    >
                      <span
                        className="bg-primary bg-opacity-10 text-primary rounded-3 d-inline-flex align-items-center justify-content-center"
                        style={{ width: 36, height: 36 }}
                      >
                        <i className={`fa-solid ${t.icon}`}></i>
                      </span>
                      <span className="small fw-semibold">{t.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Disclaimer ---------- */}
        <div
          className="rounded-3 p-3 text-light small opacity-75 d-flex align-items-start gap-3"
          style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(96,165,250,0.2)' }}
        >
          <i className="fa-solid fa-circle-info text-primary mt-1"></i>
          <span>
            LexiAI provides AI-assisted legal information for research and review. It is not a substitute for advice from a qualified advocate. Verify statutes and case law before relying on any output.
          </span>
        </div>
      </div>
    </div>
  );
}