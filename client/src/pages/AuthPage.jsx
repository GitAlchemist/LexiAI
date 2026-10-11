import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [jurisdiction, setJurisdiction] = useState('India (Personal, Civil & Labor Laws)');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, 'demo_jwt_token_2026', jurisdiction);
    navigate('/');
  };

  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-3">
      <style>{`
        @keyframes floatLogo {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .floating-logo {
          animation: floatLogo 3s ease-in-out infinite;
          filter: drop-shadow(0px 6px 12px rgba(13, 110, 253, 0.4));
        }
        .auth-card-hero {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 41, 59, 0.92) 100%),
                      url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
        }
      `}</style>

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden w-100" style={{ maxWidth: '950px' }}>
        <div className="row g-0">
          
          {/* Left Hero */}
          <div className="col-lg-5 auth-card-hero text-white p-5 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-25 p-3 rounded-circle me-3 floating-logo border border-primary border-opacity-50">
                  <i className="fa-solid fa-scale-balanced text-primary fs-3"></i>
                </div>
                <div>
                  <h3 className="fw-bold m-0 text-white">Lexi<span className="text-primary">AI</span></h3>
                  <small className="text-light opacity-75">Legal Intelligence for All</small>
                </div>
              </div>

              <h3 className="fw-bold text-white mb-3 lh-sm">
                AI Legal Intelligence & Contract Assistant
              </h3>

              <div className="d-flex align-items-center gap-2 mt-4 text-light opacity-75 small">
                <i className="fa-solid fa-circle-check text-success fs-6"></i>
                <span>Easy Plain-English Statutory Chat</span>
              </div>
              <div className="d-flex align-items-center gap-2 mt-2 text-light opacity-75 small">
                <i className="fa-solid fa-circle-check text-success fs-6"></i>
                <span>Instant Contract & Document Risk Audit</span>
              </div>
              <div className="d-flex align-items-center gap-2 mt-2 text-light opacity-75 small">
                <i className="fa-solid fa-circle-check text-success fs-6"></i>
                <span>Personal, Civil, Labor & Consumer Guidance</span>
              </div>
            </div>

            <div className="pt-3 border-top border-secondary border-opacity-50 text-light opacity-75 small d-flex align-items-center justify-content-between">
              <span><i className="fa-solid fa-shield-halved text-success me-1"></i> Secure & Private</span>
              <span>256-Bit SSL</span>
            </div>
          </div>

          {/* Right Form */}
          <div className="col-lg-7 p-4 p-md-5 bg-white d-flex flex-column justify-content-center">
            <div className="mb-4">
              <h3 className="fw-bold text-dark">{isLogin ? 'Welcome Back' : 'Create Free Account'}</h3>
              <p className="text-muted small">Access legal answers and contract analysis tools instantly.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control py-2.5" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address</label>
                <input 
                  type="email" 
                  className="form-control py-2.5" 
                  placeholder="your.email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Primary Jurisdiction</label>
                <select 
                  className="form-select py-2.5"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                >
                  <option>India (Personal, Civil & Labor Laws)</option>
                  <option>United States (Federal & State Laws)</option>
                  <option>United Kingdom (Common Law)</option>
                  <option>International / Cross-Border Trade</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Password</label>
                <input 
                  type="password" 
                  className="form-control py-2.5" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2.5 fw-bold mb-3 shadow-sm">
                {isLogin ? 'Sign In' : 'Get Started'}
              </button>
            </form>

            <div className="text-center border-top pt-3">
              <button 
                type="button"
                className="btn btn-link text-decoration-none text-muted small" 
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Don't have an account? Create One" : "Already registered? Sign In"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}