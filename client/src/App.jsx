import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Assistant from './pages/Assistant';
import Analyzer from './pages/Analyzer';
import ComplianceEngine from './pages/ComplianceEngine';
import Tracker from './pages/Tracker';
import AuthPage from './pages/AuthPage';
import Sidebar from './components/Sidebar';

function AppRoutes() {
  const { user } = useContext(AuthContext);

  // If user is NOT logged in, show AuthPage
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If user IS logged in, render main layout with Sidebar
  return (
    <div className="d-flex" style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 overflow-auto" style={{ backgroundColor: '#0f172a' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/compliance" element={<ComplianceEngine />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}