import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_URL = 'https://lexiai-aqpa.onrender.com/api/ai/chat';
const STORAGE_KEY = 'lexiai_assistant_chat_v1';

const CATEGORIES = [
  { name: 'Personal & Civil Laws', icon: 'fa-user-group' },
  { name: 'Labor & Employment', icon: 'fa-briefcase' },
  { name: 'Company & Startup', icon: 'fa-building' },
  { name: 'Data Privacy & IT', icon: 'fa-lock' },
  { name: 'Consumer Protection', icon: 'fa-cart-shopping' },
];

const PLACEHOLDERS = {
  'Personal & Civil Laws': 'e.g. What are my rights over ancestral property if my father passes away without a will?',
  'Labor & Employment': 'e.g. What notice period and severance am I entitled to if my employer terminates me?',
  'Company & Startup': 'e.g. What compliance filings does a Private Limited Company need every year?',
  'Data Privacy & IT': 'e.g. What are a company\'s duties and penalties under the DPDP Act, 2023?',
  'Consumer Protection': 'e.g. How do I file a complaint for a defective product under the Consumer Protection Act, 2019?',
};

const STARTERS = {
  'Personal & Civil Laws': ['How is property divided among legal heirs without a will?', 'What are the grounds for divorce under the Hindu Marriage Act?', 'Who can adopt a child in India and how?'],
  'Labor & Employment': ['Can my employer terminate me without notice?', 'How is gratuity calculated and when is it payable?', 'What can I do about workplace harassment under the POSH Act?'],
  'Company & Startup': ['Private Limited vs LLP: which is better for a startup?', 'What annual filings are mandatory for a company?', 'How do I protect founder equity with a shareholders agreement?'],
  'Data Privacy & IT': ['What rights do I have over my personal data under the DPDP Act?', 'What must a company do after a data breach?', 'What counts as a cyber offence under the IT Act?'],
  'Consumer Protection': ['How do I file a consumer complaint online?', 'What are my rights when an e-commerce seller refuses a refund?', 'What can I claim for unsafe or expired food products?'],
};

const KEY_LAWS = {
  'Personal & Civil Laws': [['Hindu Succession Act, 1956', 'Inheritance among Hindus, amended 2005'], ['Hindu Marriage Act, 1955', 'Marriage, divorce, maintenance'], ['Special Marriage Act, 1954', 'Civil marriage across religions'], ['Transfer of Property Act, 1882', 'Sale, lease, gift of property']],
  'Labor & Employment': [['Code on Wages, 2019', 'Minimum wages and timely payment'], ['Industrial Relations Code, 2020', 'Layoff, retrenchment, disputes'], ['Code on Social Security, 2020', 'PF, ESI, gratuity'], ['POSH Act, 2013', 'Sexual harassment at the workplace']],
  'Company & Startup': [['Companies Act, 2013', 'Incorporation and annual compliance'], ['LLP Act, 2008', 'Limited liability partnerships'], ['Indian Contract Act, 1872', 'Agreements and enforceability'], ['CGST Act, 2017', 'GST registration and returns']],
  'Data Privacy & IT': [['DPDP Act, 2023', 'Personal data rights and duties'], ['Information Technology Act, 2000', 'Cyber offences, e-contracts'], ['IT Rules, 2011 (SPDI)', 'Reasonable security practices'], ['CERT-In Directions, 2022', 'Incident reporting within 6 hours']],
  'Consumer Protection': [['Consumer Protection Act, 2019', 'Rights, remedies, consumer forums'], ['E-Commerce Rules, 2020', 'Seller and platform duties'], ['Food Safety and Standards Act, 2006', 'Food quality and penalties'], ['Legal Metrology Act, 2009', 'Packaged goods and labelling']],
};

const LANGS = {
  English: { voice: 'en-IN', speak: 'en-IN' },
  Tamil: { voice: 'ta-IN', speak: 'ta-IN' },
  Hindi: { voice: 'hi-IN', speak: 'hi-IN' },
};

const FOLLOW_UPS = ['Explain in simpler words', 'What documents do I need?', 'What are the penalties?', 'What are my next steps?'];

const css = `
.lx-md h1, .lx-md h2, .lx-md h3 { font-size: 1.05rem; font-weight: 700; margin-top: 1rem; color: #0f172a; }
.lx-md p, .lx-md li { line-height: 1.7; font-size: .95rem; }
.lx-md table { width: 100%; border-collapse: collapse; margin: .75rem 0; font-size: .88rem; }
.lx-md th, .lx-md td { border: 1px solid #e2e8f0; padding: 6px 10px; text-align: left; }
.lx-md th { background: #f1f5f9; }
.lx-md blockquote { border-left: 3px solid #2563eb; padding-left: 12px; color: #475569; }
.lx-chat { max-height: 62vh; overflow-y: auto; scroll-behavior: smooth; }
.lx-pill { border: 1px solid #dbe3ef; background: #fff; color: #334155; border-radius: 999px; padding: 6px 14px; font-size: 13px; cursor: pointer; }
.lx-pill:hover { border-color: #2563eb; color: #2563eb; }
.lx-dot { width: 8px; height: 8px; border-radius: 50%; background: #94a3b8; display: inline-block; margin: 0 2px; animation: lxb 1.1s infinite ease-in-out; }
.lx-dot:nth-child(2) { animation-delay: .15s; } .lx-dot:nth-child(3) { animation-delay: .3s; }
@keyframes lxb { 0%, 80%, 100% { opacity: .3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-4px); } }
@media (prefers-reduced-motion: reduce) { .lx-dot { animation: none; } .lx-chat { scroll-behavior: auto; } }
`;

const loadMessages = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
};
const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Assistant() {
  const [selectedCategory, setSelectedCategory] = useState('Personal & Civil Laws');
  const [language, setLanguage] = useState('English');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState(loadMessages);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40))); } catch { /* storage unavailable */ }
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, loading]);

  const handleVoiceInput = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input needs Google Chrome or Microsoft Edge.'); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.lang = LANGS[language].voice;
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setQuery((prev) => (prev ? `${prev} ${t}` : t));
    };
    rec.start();
  };

  const ask = async (text, category = selectedCategory, { skipUserMessage = false } = {}) => {
    if (!text.trim() || loading) return;
    const history = messages.slice(-4).map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text.slice(0, 500)}`).join('\n');
    const prompt =
      `${history ? `Previous conversation:\n${history}\n\n` : ''}` +
      `Answer in ${language}. Use markdown with short headings and bullets. Cite the relevant Acts and sections. ` +
      `End with "Next steps" and a one-line reminder that this is legal information, not legal advice.\n\nQuestion: ${text}`;

    if (!skipUserMessage) setMessages(p => [...p, { sender: 'user', category, text, at: now() }]);
    setQuery('');
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, scope: category, query: prompt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Server returned ${res.status}`);
      const answer = data.result || data.reply || data.answer;
      if (!answer) throw new Error('The legal engine returned an empty answer');
      setMessages(p => [...p, { sender: 'bot', category, text: answer, at: now(), question: text }]);
    } catch (err) {
      setMessages(p => [...p, { sender: 'bot', category, error: true, question: text, at: now(),
        text: `${err.message}. If the server was idle it may need 30 to 60 seconds to wake up. Use Retry.` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); ask(query); };
  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(query); } };

  const copyAnswer = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1600);
  };

  const speak = (text, idx) => {
    if (!('speechSynthesis' in window)) { alert('Text to speech is not supported in this browser.'); return; }
    if (speakingIdx === idx) { window.speechSynthesis.cancel(); setSpeakingIdx(null); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[#*_`>|-]/g, ' '));
    u.lang = LANGS[language].speak;
    u.onend = () => setSpeakingIdx(null);
    window.speechSynthesis.speak(u);
    setSpeakingIdx(idx);
  };

  const exportChat = () => {
    const body = messages.map(m => `[${m.at || ''}] ${m.sender === 'user' ? 'YOU' : 'LEXIAI'} (${m.category})\n${m.text}\n`).join('\n');
    const blob = new Blob([`LexiAI conversation\n\n${body}\nLegal information, not legal advice.`], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lexiai-conversation.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const clearChat = () => {
    if (messages.length && window.confirm('Clear this conversation?')) { window.speechSynthesis?.cancel(); setMessages([]); }
  };

  const lastIsBot = messages.length > 0 && messages[messages.length - 1].sender === 'bot' && !messages[messages.length - 1].error;

  return (
    <div className="container-fluid p-4 min-vh-100" style={{ backgroundColor: '#f8fafc', color: '#1e293b' }}>
      <style>{css}</style>

      {/* Hero */}
      <div className="card border-0 rounded-4 p-4 mb-4 text-white shadow-sm position-relative overflow-hidden"
        style={{ backgroundColor: '#0d172a',
          backgroundImage: `linear-gradient(rgba(13,23,42,0.88), rgba(13,23,42,0.88)), url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop')`,
          backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge rounded-pill px-3 py-2 mb-3 d-inline-flex align-items-center gap-2" style={{ backgroundColor: '#0066ff', fontSize: '11px' }}>
              <i className="fa-solid fa-robot"></i> Statutory AI intelligence
            </span>
            <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '1.8rem' }}>AI legal assistant and statutory counsel</h2>
            <p className="text-white-50 mb-0">Ask about civil, labor, company, privacy, and consumer law in plain English, Tamil, or Hindi.</p>
          </div>
          <div className="d-flex gap-4 text-center">
            <div><div className="fs-3 fw-bold text-white">{CATEGORIES.length}</div><small className="text-white-50">Legal domains</small></div>
            <div><div className="fs-3 fw-bold text-white">3</div><small className="text-white-50">Languages</small></div>
            <div><div className="fs-3 fw-bold text-white">{messages.filter(m => m.sender === 'user').length}</div><small className="text-white-50">Questions asked</small></div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button key={cat.name} type="button" onClick={() => setSelectedCategory(cat.name)}
            className={`btn fw-semibold px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${selectedCategory === cat.name ? 'btn-primary text-white shadow-sm' : 'bg-white text-secondary border'}`}>
            <i className={`fa-solid ${cat.icon}`}></i>{cat.name}
          </button>
        ))}
      </div>

      <div className="row g-4">
        {/* Chat column */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 bg-white">
            <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
              <div className="fw-semibold"><i className="fa-solid fa-comments text-primary me-2"></i>Conversation <span className="text-secondary fw-normal">in {selectedCategory}</span></div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={exportChat} disabled={!messages.length}><i className="fa-solid fa-download me-1"></i>Export</button>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={clearChat} disabled={!messages.length}><i className="fa-solid fa-trash me-1"></i>Clear</button>
              </div>
            </div>

            <div className="lx-chat p-4">
              {messages.length === 0 && !loading && (
                <div className="text-center py-4">
                  <i className="fa-solid fa-scale-balanced display-5 text-primary opacity-50 mb-3"></i>
                  <h5 className="fw-bold">What would you like to understand?</h5>
                  <p className="text-secondary mb-4">Pick a topic above, then try a question or type your own.</p>
                  <div className="d-flex flex-column gap-2 align-items-center">
                    {STARTERS[selectedCategory].map(s => (
                      <button key={s} type="button" className="lx-pill" onClick={() => ask(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex flex-column gap-3">
                {messages.map((msg, idx) => (
                  msg.sender === 'user' ? (
                    <div key={idx} className="ms-auto" style={{ maxWidth: '78%' }}>
                      <div className="rounded-4 px-3 py-2 text-white" style={{ backgroundColor: '#1d4ed8' }}>{msg.text}</div>
                      <div className="text-end small text-secondary mt-1">{msg.at}</div>
                    </div>
                  ) : (
                    <div key={idx} className="d-flex gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 36, height: 36, background: msg.error ? '#fee2e2' : '#dbeafe', color: msg.error ? '#dc2626' : '#1d4ed8' }}>
                        <i className={`fa-solid ${msg.error ? 'fa-triangle-exclamation' : 'fa-scale-balanced'}`}></i>
                      </div>
                      <div className="flex-grow-1 rounded-4 p-3 border" style={{ background: msg.error ? '#fef2f2' : '#fff', minWidth: 0 }}>
                        <div className="small text-primary fw-semibold mb-1">LexiAI counsel <span className="text-secondary fw-normal">· {msg.category} · {msg.at}</span></div>
                        <div className="lx-md"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown></div>
                        <div className="d-flex gap-2 mt-3 pt-2 border-top flex-wrap">
                          {!msg.error && <>
                            <button type="button" className="btn btn-sm btn-light" onClick={() => copyAnswer(msg.text, idx)}><i className="fa-solid fa-copy me-1"></i>{copiedIdx === idx ? 'Copied' : 'Copy'}</button>
                            <button type="button" className="btn btn-sm btn-light" onClick={() => speak(msg.text, idx)}><i className={`fa-solid ${speakingIdx === idx ? 'fa-stop' : 'fa-volume-high'} me-1`}></i>{speakingIdx === idx ? 'Stop' : 'Listen'}</button>
                          </>}
                          <button type="button" className="btn btn-sm btn-light" disabled={loading} onClick={() => ask(msg.question, msg.category, { skipUserMessage: true })}><i className="fa-solid fa-rotate me-1"></i>Retry</button>
                        </div>
                      </div>
                    </div>
                  )
                ))}

                {loading && (
                  <div className="d-flex gap-3 align-items-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, background: '#dbeafe', color: '#1d4ed8' }}><i className="fa-solid fa-scale-balanced"></i></div>
                    <div className="rounded-4 px-3 py-2 border bg-white"><span className="lx-dot"></span><span className="lx-dot"></span><span className="lx-dot"></span></div>
                    <small className="text-secondary">Reading the statutes...</small>
                  </div>
                )}

                {lastIsBot && !loading && (
                  <div className="d-flex flex-wrap gap-2 ps-5">
                    {FOLLOW_UPS.map(f => <button key={f} type="button" className="lx-pill" onClick={() => ask(f)}>{f}</button>)}
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </div>

            {/* Composer */}
            <form onSubmit={handleSubmit} className="p-3 border-top">
              <textarea rows="3" maxLength={1000} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKey}
                placeholder={PLACEHOLDERS[selectedCategory]} className="form-control border-0 p-3 rounded-3"
                style={{ backgroundColor: '#f1f5f9', resize: 'none' }} />
              <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                <div className="d-flex gap-2 align-items-center">
                  <button type="button" onClick={handleVoiceInput} className={`btn btn-sm ${isListening ? 'btn-danger' : 'btn-outline-secondary'} fw-semibold px-3 py-2`}>
                    <i className={`fa-solid ${isListening ? 'fa-microphone-slash fa-beat' : 'fa-microphone'} me-2`}></i>{isListening ? 'Listening...' : 'Voice'}
                  </button>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="form-select form-select-sm w-auto" aria-label="Answer language">
                    {Object.keys(LANGS).map(l => <option key={l}>{l}</option>)}
                  </select>
                  <small className="text-secondary d-none d-md-inline">{query.length}/1000 · Enter to send</small>
                </div>
                <button type="submit" disabled={loading || !query.trim()} className="btn btn-primary fw-bold px-4 py-2 rounded-3">
                  {loading ? <span><i className="fa-solid fa-spinner fa-spin me-2"></i>Analyzing...</span> : <span><i className="fa-solid fa-paper-plane me-2"></i>Ask LexiAI</span>}
                </button>
              </div>
            </form>
          </div>
          <div className="small text-secondary mt-3 px-1"><i className="fa-solid fa-circle-info me-2"></i>LexiAI gives legal information, not legal advice. Consult a qualified lawyer before acting.</div>
        </div>

        {/* Side panel */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <h6 className="fw-bold mb-3"><i className="fa-solid fa-landmark text-primary me-2"></i>Key laws in this scope</h6>
            {KEY_LAWS[selectedCategory].map(([law, note]) => (
              <button key={law} type="button" className="btn text-start p-2 mb-1 w-100 border-0 rounded-3" style={{ background: 'transparent' }}
                onClick={() => ask(`Explain the ${law} in simple terms with its key sections`)}>
                <div className="fw-semibold small">{law}</div>
                <div className="small text-secondary">{note}</div>
              </button>
            ))}
            <div className="small text-secondary mt-2">Click a law to get a plain-language explanation. Verify details on official sources.</div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h6 className="fw-bold mb-3"><i className="fa-solid fa-lightbulb text-warning me-2"></i>Get better answers</h6>
            <ul className="small text-secondary ps-3 mb-0" style={{ lineHeight: 1.8 }}>
              <li>Mention who is involved (employee, tenant, founder).</li>
              <li>Add dates, amounts, and the state if it matters.</li>
              <li>Ask for next steps, penalties, or documents needed.</li>
              <li>Switch the language to hear the answer in Tamil or Hindi.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}