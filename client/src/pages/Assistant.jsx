import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Assistant() {
  const [selectedCategory, setSelectedCategory] = useState('Personal & Civil Laws');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const categories = [
    { name: 'Personal & Civil Laws', icon: 'fa-user-group' },
    { name: 'Labor & Employment', icon: 'fa-briefcase' },
    { name: 'Company & Startup', icon: 'fa-building' },
    { name: 'Data Privacy & IT', icon: 'fa-lock' },
    { name: 'Consumer Protection', icon: 'fa-cart-shopping' }
  ];

  const categoryPlaceholders = {
    'Personal & Civil Laws': 'e.g. What are my statutory legal rights, spousal support entitlements, and property division rules during a divorce?',
    'Labor & Employment': 'e.g. What is the statutory notice period and severance requirement for unilateral termination under Indian Labor Law?',
    'Company & Startup': 'e.g. What are the mandatory compliance filings for a Private Limited Company under the Companies Act, 2013?',
    'Data Privacy & IT': 'e.g. What are the key compliance requirements and penalty structures under the Digital Personal Data Protection (DPDP) Act?',
    'Consumer Protection': 'e.g. What remedies exist under the Consumer Protection Act, 2019 and FSSAI for receiving expired or defective food products?'
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input requires Google Chrome or Microsoft Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQueryText = query;
    const currentCategory = selectedCategory;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', category: currentCategory, text: userQueryText }
    ]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: currentCategory,
          query: userQueryText
        }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', category: currentCategory, text: data.result || 'No response received from legal engine.' }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', category: currentCategory, text: 'Error connecting to backend AI assistant service.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4 min-vh-100" style={{ backgroundColor: '#f8fafc', color: '#1e293b' }}>
      
      {/* Top Dark Header Banner matching exact original layout with image */}
      <div 
        className="card border-0 rounded-4 p-4 mb-4 text-white shadow-sm position-relative overflow-hidden" 
        style={{ 
          backgroundColor: '#0d172a',
          backgroundImage: `linear-gradient(rgba(13, 23, 42, 0.88), rgba(13, 23, 42, 0.88)), url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="d-flex justify-content-between align-items-center position-relative z-1 py-1">
          <div>
            {/* Blue Pill Badge */}
            <div className="mb-3">
              <span 
                className="badge bg-primary text-white fw-bold px-3 py-2 rounded-pill small d-inline-flex align-items-center gap-2"
                style={{ backgroundColor: '#0066ff', fontSize: '11px', letterSpacing: '0.3px' }}
              >
                <i className="fa-solid fa-robot"></i> Statutory AI Intelligence
              </span>
            </div>

            {/* Main Title */}
            <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '1.8rem', letterSpacing: '-0.3px' }}>
              AI Legal Assistant & Statutory Counsel
            </h2>

            {/* Subtitle */}
            <p className="text-white-50 small mb-0" style={{ fontSize: '0.9rem' }}>
              Ask legal questions across civil, personal, labor, company, privacy, and consumer legal codes in real time.
            </p>
          </div>

          {/* Right Scale Icon Watermark */}
          <div className="d-none d-md-block opacity-25 pe-2">
            <i className="fa-solid fa-scale-balanced" style={{ fontSize: '64px', color: '#1d4ed8' }}></i>
          </div>
        </div>
      </div>

      {/* Category Selection Bar */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => setSelectedCategory(cat.name)}
            className={`btn fw-semibold px-3 py-2 rounded-3 small d-flex align-items-center gap-2 transition-all ${
              selectedCategory === cat.name
                ? 'btn-primary text-white shadow-sm'
                : 'btn-white bg-white text-secondary border border-slate-200'
            }`}
          >
            <i className={`fa-solid ${cat.icon}`}></i>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="text-primary fw-bold extra-small text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
          SELECTED SCOPE: {selectedCategory.toUpperCase()}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="position-relative mb-3">
            <textarea
              rows="4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={categoryPlaceholders[selectedCategory]}
              className="form-control border-0 bg-slate-50 p-3 text-dark small rounded-3"
              style={{ backgroundColor: '#f1f5f9', resize: 'none' }}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`btn ${isListening ? 'btn-danger' : 'btn-outline-secondary'} btn-sm fw-semibold rounded-3 px-3 py-2 d-flex align-items-center gap-2`}
              title="Voice Speech-to-Text Input"
            >
              <i className={`fa-solid ${isListening ? 'fa-microphone-slash fa-spin' : 'fa-microphone'}`}></i>
              {isListening ? 'Listening...' : 'Voice Query'}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary fw-bold px-4 py-2 rounded-3 small d-flex align-items-center gap-2"
            >
              {loading ? (
                <span><i className="fa-solid fa-spinner fa-spin me-2"></i>Analyzing Legal Codes...</span>
              ) : (
                <span><i className="fa-solid fa-paper-plane me-1.5"></i>Submit Query</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* AI Response Output */}
      {messages.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`card border-0 shadow-sm rounded-4 p-4 ${
                msg.sender === 'user' ? 'bg-primary text-white ms-auto' : 'bg-white text-dark'
              }`}
              style={{ maxWidth: msg.sender === 'user' ? '75%' : '100%' }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <span className={`fw-bold extra-small text-uppercase d-flex align-items-center gap-2 ${msg.sender === 'user' ? 'text-white-50' : 'text-primary'}`} style={{ fontSize: '11px' }}>
                  <i className={`fa-solid ${msg.sender === 'user' ? 'fa-user' : 'fa-scale-balanced'}`}></i>
                  {msg.sender === 'user' ? 'YOUR QUERY' : `LEXIAI COUNSEL (${msg.category.toUpperCase()})`}
                </span>
              </div>

              {msg.sender === 'user' ? (
                <div className="lh-base small">{msg.text}</div>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}