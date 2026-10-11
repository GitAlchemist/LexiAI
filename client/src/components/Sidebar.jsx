import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => 
    location.pathname === path || (path === '/' && location.pathname === '/')
      ? 'btn-primary text-white' 
      : 'btn-dark text-secondary';

  return (
    <div 
      className="d-flex flex-column justify-content-between p-3 bg-dark border-end border-secondary min-vh-100" 
      style={{ width: '260px', backgroundColor: '#0b1329', flexShrink: 0 }}
    >
      <div>
        {/* Brand Logo */}
        <div className="d-flex align-items-center mb-4 px-2 py-1">
          <i className="fa-solid fa-scale-balanced text-primary fs-3 me-2"></i>
          <h4 className="fw-bold text-white m-0">Lexi<span className="text-primary">AI</span></h4>
        </div>

        {/* Navigation Links */}
        <div className="nav nav-pills flex-column gap-2">
          {/* Dashboard Home Link */}
          <Link to="/" className={`btn text-start d-flex align-items-center gap-3 p-2.5 rounded-3 ${isActive('/')}`}>
            <i className="fa-solid fa-house fs-5"></i>
            <div>
              <div className="fw-bold small">Dashboard Home</div>
              <div className="text-secondary extra-small" style={{ fontSize: '10px' }}>Workspace Overview</div>
            </div>
          </Link>

          {/* Contract Analyzer */}
          <Link to="/analyzer" className={`btn text-start d-flex align-items-center gap-3 p-2.5 rounded-3 ${isActive('/analyzer')}`}>
            <i className="fa-solid fa-file-contract fs-5"></i>
            <div>
              <div className="fw-bold small">Contract Analyzer</div>
              <div className="text-secondary extra-small" style={{ fontSize: '10px' }}>Risk Assessment & Audit</div>
            </div>
          </Link>

          {/* Legal Assistant */}
          <Link to="/assistant" className={`btn text-start d-flex align-items-center gap-3 p-2.5 rounded-3 ${isActive('/assistant')}`}>
            <i className="fa-solid fa-robot fs-5"></i>
            <div>
              <div className="fw-bold small">Legal Assistant</div>
              <div className="text-secondary extra-small" style={{ fontSize: '10px' }}>Multi-Category Legal Chat</div>
            </div>
          </Link>

          {/* Compliance Engine */}
          <Link to="/compliance" className={`btn text-start d-flex align-items-center gap-3 p-2.5 rounded-3 ${isActive('/compliance')}`}>
            <i className="fa-solid fa-shield-halved fs-5"></i>
            <div>
              <div className="fw-bold small">Compliance Engine</div>
              <div className="text-secondary extra-small" style={{ fontSize: '10px' }}>Clause & Statute Search</div>
            </div>
          </Link>

          {/* Complaint Tracker */}
          <Link to="/tracker" className={`btn text-start d-flex align-items-center gap-3 p-2.5 rounded-3 ${isActive('/tracker')}`}>
            <i className="fa-solid fa-list-check fs-5"></i>
            <div>
              <div className="fw-bold small">Complaint Tracker</div>
              <div className="text-secondary extra-small" style={{ fontSize: '10px' }}>Cases & Escalation</div>
            </div>
          </Link>
        </div>
      </div>

      {/* User Profile & Sign Out Footer */}
      <div className="pt-3 border-top border-secondary">
        <div className="d-flex align-items-center gap-2 mb-2 px-1">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <i className="fa-solid fa-user small"></i>
          </div>
          <div className="overflow-hidden">
            <div className="fw-bold text-white extra-small text-truncate" style={{ fontSize: '12px' }}>
              {user?.email || 'counsel@lexiai.com'}
            </div>
            <div className="text-success extra-small d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
              <i className="fa-solid fa-circle" style={{ fontSize: '6px' }}></i> Active Session
            </div>
          </div>
        </div>

        {logout && (
          <button 
            type="button" 
            onClick={logout} 
            className="btn btn-outline-danger btn-sm w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-1.5"
            style={{ fontSize: '11px' }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        )}
      </div>
    </div>
  );
}