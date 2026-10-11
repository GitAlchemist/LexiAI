import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path ? 'active fw-bold border-bottom border-3 border-primary' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow py-3 sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold fs-4 text-white d-flex align-items-center">
          <i className="fa-solid fa-scale-balanced text-primary me-2 fs-3"></i>
          <span>Lexi<span className="text-primary">AI</span></span>
          <span className="badge bg-primary-subtle text-primary fs-6 ms-2 px-2 py-1 border border-primary">Enterprise</span>
        </Link>
        
        <div className="navbar-nav ms-auto gap-2 align-items-center">
          <Link to="/" className={`nav-link text-light px-3 ${isActive('/')}`}>
            <i className="fa-solid fa-file-contract me-2"></i>Contract Analyzer
          </Link>
          <Link to="/assistant" className={`nav-link text-light px-3 ${isActive('/assistant')}`}>
            <i className="fa-solid fa-robot me-2"></i>Legal Assistant
          </Link>
          <Link to="/compliance" className={`nav-link text-light px-3 ${isActive('/compliance')}`}>
            <i className="fa-solid fa-shield-halved me-2"></i>Compliance Engine
          </Link>

          {user ? (
            <div className="d-flex align-items-center gap-2 ms-3">
              <span className="badge bg-secondary px-3 py-2">
                <i className="fa-solid fa-user-shield me-1"></i> {user.email.split('@')[0]}
              </span>
              <button onClick={logout} className="btn btn-outline-light btn-sm">Sign Out</button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm ms-3 px-3">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}