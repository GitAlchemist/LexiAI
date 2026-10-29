import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/* ---- Change these if your routes are named differently ---- */
const ROUTES = {
  analyzer: '/analyzer',
  assistant: '/assistant',
  compliance: '/compliance',
  tracker: '/tracker',
};

const MODULES = [
  { to: ROUTES.analyzer, icon: 'fa-file-contract', title: 'Contract Analyzer', text: 'Upload a PDF or TXT agreement to get a summary, a risk score and a list of missing clauses.', cta: 'Review a contract' },
  { to: ROUTES.assistant, icon: 'fa-comments', title: 'Legal Assistant', text: 'Ask about succession, employment disputes, startup liability or data protection.', cta: 'Ask a question' },
  { to: ROUTES.compliance, icon: 'fa-book-open', title: 'Compliance Engine', text: 'Search statutory clause templates, indemnity standards and governing-law references.', cta: 'Search statutes' },
  { to: ROUTES.tracker, icon: 'fa-list-check', title: 'Complaint Tracker', text: 'Follow each case from filing to escalation, with deadlines and next steps in one place.', cta: 'Open my cases' },
];

const STATUTES = [
  { act: 'Indian Contract Act, 1872', area: 'Corporate', q: 'contract act' },
  { act: 'Companies Act, 2013', area: 'Corporate', q: 'companies act' },
  { act: 'Industrial Disputes Act, 1947', area: 'Labour', q: 'industrial disputes' },
  { act: 'Digital Personal Data Protection Act, 2023', area: 'Privacy', q: 'dpdp' },
  { act: 'Consumer Protection Act, 2019', area: 'Consumer', q: 'consumer protection' },
  { act: 'Hindu Succession Act, 1956', area: 'Personal', q: 'succession' },
];

const TIPS = [
  'An indemnity clause should name the exact losses covered. Vague wording is a common reason it fails in court.',
  'A contract with no governing-law and jurisdiction clause can leave you arguing about where to sue before you argue the case.',
  'Check the limitation period first. A strong claim filed late is still a lost claim.',
  'A termination clause with no notice period invites a dispute. State the number of days and the form of notice.',
  'If a contract collects personal data, confirm it records the purpose and consent under the DPDP Act, 2023.',
];

const RISK_MIX = [
  { label: 'Low risk', value: 58, color: '#4f9d7a' },
  { label: 'Medium risk', value: 29, color: '#c9a24a' },
  { label: 'High risk', value: 13, color: '#a63d40' },
];

const RECENT = [
  { name: 'Vendor Services Agreement', note: 'Missing limitation of liability', score: 72, level: 'high' },
  { name: 'Employment Offer Template', note: 'Notice period unclear', score: 48, level: 'medium' },
  { name: 'NDA - Series A Investors', note: 'No issues flagged', score: 18, level: 'low' },
];

const SCORE_COLOR = { high: '#a63d40', medium: '#b58a2c', low: '#4f9d7a' };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [tip, setTip] = useState(0);

  const name = user?.email?.split('@')[0] || '';
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  useEffect(() => {
    const id = setInterval(() => setTip((t) => (t + 1) % TIPS.length), 9000);
    return () => clearInterval(id);
  }, []);

  const search = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`${ROUTES.compliance}?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="lx container-fluid p-3 p-md-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .lx{--ink:#0e1626;--ink2:#162238;--brass:#c9a24a;--brass-soft:#e3c987;--paper:#f6f1e6;--paper2:#ece4d2;--wine:#7a2b34;--text:#1d2433;--muted:#6a6f7c;font-family:'Inter',sans-serif;}
        .lx .serif{font-family:'Cormorant Garamond',Georgia,serif;}
        .lx-hero{background:var(--ink);border:1px solid #26334d;border-radius:14px;position:relative;overflow:hidden;color:#fff;}
        .lx-hero::before{content:"";position:absolute;inset:10px;border:1px solid rgba(201,162,74,.35);border-radius:8px;pointer-events:none;}
        .lx-hero::after{content:"\\00A7";position:absolute;right:3%;top:-8%;font-family:'Cormorant Garamond',serif;font-size:26rem;line-height:1;color:rgba(201,162,74,.07);pointer-events:none;}
        .lx-hero h1{font-size:clamp(2.1rem,4.4vw,3.4rem);font-weight:600;line-height:1.1;letter-spacing:-.01em;}
        .lx-date{color:var(--brass-soft);font-size:.85rem;}
        .lx-search{display:flex;background:#fff;border-radius:8px;overflow:hidden;max-width:560px;border:2px solid transparent;}
        .lx-search:focus-within{border-color:var(--brass);}
        .lx-search input{flex:1;border:0;padding:.8rem 1rem;font-size:.95rem;outline:none;color:var(--text);min-width:0;}
        .lx-search button{border:0;background:var(--brass);color:var(--ink);font-weight:600;padding:0 1.3rem;}
        .lx-search button:hover{background:var(--brass-soft);}
        .lx-chip{display:inline-block;border:1px solid rgba(255,255,255,.25);color:#d9deea;border-radius:99px;padding:.2rem .75rem;font-size:.8rem;text-decoration:none;margin:0 .4rem .4rem 0;}
        .lx-chip:hover{border-color:var(--brass);color:var(--brass-soft);}
        .lx-btn{background:var(--brass);color:var(--ink);font-weight:600;border:0;padding:.7rem 1.3rem;border-radius:8px;text-decoration:none;display:inline-block;}
        .lx-btn:hover{background:var(--brass-soft);color:var(--ink);}
        .lx-btn-o{border:1px solid rgba(255,255,255,.4);color:#fff;font-weight:500;padding:.7rem 1.3rem;border-radius:8px;text-decoration:none;display:inline-block;}
        .lx-btn-o:hover{border-color:var(--brass);color:var(--brass-soft);}
        .lx-panel{background:var(--paper);border-radius:12px;padding:1.4rem;height:100%;color:var(--text);border:1px solid var(--paper2);}
        .lx-panel h2{font-size:1.5rem;font-weight:700;margin:0 0 .9rem;color:var(--ink);}
        .lx-stat{background:var(--paper);border-radius:12px;border-left:4px solid var(--brass);padding:1.1rem 1.3rem;height:100%;}
        .lx-stat b{font-size:1.9rem;color:var(--ink);display:block;line-height:1.1;}
        .lx-stat span{color:var(--muted);font-size:.85rem;}
        .lx-mod{background:var(--paper);border-radius:12px;padding:1.4rem;height:100%;display:flex;flex-direction:column;border:1px solid var(--paper2);text-decoration:none;color:var(--text);transition:border-color .15s,transform .15s;}
        .lx-mod:hover{border-color:var(--brass);transform:translateY(-2px);color:var(--text);}
        .lx-mod i.ic{width:44px;height:44px;border-radius:50%;background:var(--ink);color:var(--brass);display:grid;place-items:center;font-size:1.05rem;margin-bottom:.9rem;}
        .lx-mod h3{font-size:1.45rem;font-weight:700;color:var(--ink);margin-bottom:.4rem;}
        .lx-mod p{color:var(--muted);font-size:.9rem;flex:1;}
        .lx-mod .go{color:var(--wine);font-weight:600;font-size:.9rem;}
        .lx-bar{display:flex;height:12px;border-radius:99px;overflow:hidden;background:var(--paper2);}
        .lx-row{display:flex;justify-content:space-between;align-items:center;padding:.7rem 0;border-bottom:1px solid var(--paper2);gap:1rem;}
        .lx-row:last-of-type{border-bottom:0;}
        .lx-score{min-width:48px;text-align:center;border-radius:6px;padding:.2rem .5rem;font-weight:600;font-size:.85rem;color:#fff;}
        .lx-act{display:flex;justify-content:space-between;align-items:center;padding:.65rem 0;border-bottom:1px solid var(--paper2);text-decoration:none;color:var(--text);gap:1rem;}
        .lx-act:last-child{border-bottom:0;}
        .lx-act:hover .t{color:var(--wine);}
        .lx-act small{color:var(--muted);white-space:nowrap;}
        .lx-tip{background:var(--ink2);border:1px solid #26334d;border-radius:12px;color:#e8ebf3;padding:1.4rem;height:100%;}
        .lx-tip .quote{font-size:1.35rem;line-height:1.45;min-height:7.5rem;}
        .lx-dots button{width:8px;height:8px;border-radius:50%;border:0;background:#4a5873;margin-right:6px;padding:0;}
        .lx-dots button.on{background:var(--brass);}
        .lx-note{color:#8a93a8;font-size:.8rem;}
        .lx a:focus-visible,.lx button:focus-visible,.lx input:focus-visible{outline:2px solid var(--brass);outline-offset:2px;}
        @media (prefers-reduced-motion:reduce){.lx-mod{transition:none;}.lx-mod:hover{transform:none;}}
      `}</style>

      {/* Hero */}
      <section className="lx-hero p-4 p-md-5 mb-4">
        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="lx-date mb-2">{today}</div>
          <h1 className="serif mb-3">
            {greeting()}, Counsel{name ? ` ${name}` : ''}
          </h1>
          <p className="mb-4" style={{ color: '#c4cad8', maxWidth: 620, lineHeight: 1.7 }}>
            Review contracts, research statutes and track cases from one workspace. Start with a statute search or open a tool below.
          </p>

          <form className="lx-search mb-3" onSubmit={search} role="search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search an Act, section or clause, e.g. indemnity"
              aria-label="Search statutes and clauses"
            />
            <button type="submit"><i className="fa-solid fa-magnifying-glass me-2"></i>Search</button>
          </form>

          <div className="mb-4">
            {['Indemnity', 'Termination notice', 'Non-compete', 'Data consent'].map((c) => (
              <Link key={c} className="lx-chip" to={`${ROUTES.compliance}?q=${encodeURIComponent(c)}`}>{c}</Link>
            ))}
          </div>

          <div className="d-flex flex-wrap gap-3">
            <Link to={ROUTES.analyzer} className="lx-btn"><i className="fa-solid fa-file-contract me-2"></i>Analyze a contract</Link>
            <Link to={ROUTES.assistant} className="lx-btn-o"><i className="fa-solid fa-comments me-2"></i>Ask the legal assistant</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          ['1,248', 'Contracts audited'],
          ['5', 'Legal areas covered'],
          ['3', 'Open cases'],
          [user?.jurisdiction || 'India', 'Active jurisdiction'],
        ].map(([v, l]) => (
          <div className="col-6 col-lg-3" key={l}>
            <div className="lx-stat"><b className="serif">{v}</b><span>{l}</span></div>
          </div>
        ))}
      </div>

      {/* Tools */}
      <div className="row g-3 mb-4">
        {MODULES.map((m) => (
          <div className="col-md-6 col-xl-3" key={m.title}>
            <Link to={m.to} className="lx-mod">
              <i className={`ic fa-solid ${m.icon}`}></i>
              <h3 className="serif">{m.title}</h3>
              <p>{m.text}</p>
              <span className="go">{m.cta} <i className="fa-solid fa-arrow-right ms-1"></i></span>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent reviews + risk mix */}
      <div className="row g-3 mb-4">
        <div className="col-lg-7">
          <div className="lx-panel">
            <h2 className="serif">Recent contract reviews</h2>
            {RECENT.map((r) => (
              <div className="lx-row" key={r.name}>
                <div>
                  <div className="fw-semibold">{r.name}</div>
                  <small style={{ color: 'var(--muted)' }}>{r.note}</small>
                </div>
                <span className="lx-score" style={{ background: SCORE_COLOR[r.level] }} title={`${r.level} risk`}>
                  {r.score}
                </span>
              </div>
            ))}
            <Link to={ROUTES.analyzer} className="d-inline-block mt-3 fw-semibold" style={{ color: 'var(--wine)', textDecoration: 'none' }}>
              Review a new contract <i className="fa-solid fa-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="lx-panel">
            <h2 className="serif">Risk across your contracts</h2>
            <div className="lx-bar mb-3" role="img" aria-label="Risk distribution">
              {RISK_MIX.map((r) => <div key={r.label} style={{ width: `${r.value}%`, background: r.color }} />)}
            </div>
            {RISK_MIX.map((r) => (
              <div className="d-flex justify-content-between py-1" key={r.label}>
                <span><i className="fa-solid fa-circle me-2" style={{ color: r.color, fontSize: '.6rem' }}></i>{r.label}</span>
                <b>{r.value}%</b>
              </div>
            ))}
            <p className="mt-3 mb-0" style={{ color: 'var(--muted)', fontSize: '.85rem' }}>
              Most flagged issues come from missing liability caps and unclear termination terms.
            </p>
          </div>
        </div>
      </div>

      {/* Statutes + tip */}
      <div className="row g-3 mb-4">
        <div className="col-lg-7">
          <div className="lx-panel">
            <h2 className="serif">Statute quick reference</h2>
            {STATUTES.map((s) => (
              <Link key={s.act} className="lx-act" to={`${ROUTES.compliance}?q=${encodeURIComponent(s.q)}`}>
                <span className="t fw-medium">{s.act}</span>
                <small>{s.area}</small>
              </Link>
            ))}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="lx-tip">
            <h2 className="serif" style={{ color: 'var(--brass-soft)', fontSize: '1.5rem', fontWeight: 700 }}>Drafting tip</h2>
            <p className="quote serif">{TIPS[tip]}</p>
            <div className="lx-dots">
              {TIPS.map((_, i) => (
                <button key={i} className={i === tip ? 'on' : ''} onClick={() => setTip(i)} aria-label={`Show tip ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="lx-note text-center mb-0">
        LexiAI provides legal information and analysis to support your work. It does not replace professional legal advice.
      </p>
    </div>
  );
}