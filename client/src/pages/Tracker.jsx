import React, { useState, useEffect } from 'react';

export default function Tracker() {
  const [complaints, setComplaints] = useState([]);
  const [category, setCategory] = useState('Contract & Document Analysis');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tracker/all`);
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return alert('Please enter grievance details.');

    setLoading(true);
    try {
      const res = await fetch('https://lexiai-backend.onrender.com/api/tracker/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, description, priority }),
      });
      const data = await res.json();

      if (data.success) {
        alert(`Grievance Registered Successfully!\n\nTicket ID: ${data.ticket.ticket_id}\nAssigned Dept: ${data.ticket.department}`);
        setDescription('');
        fetchComplaints();
      }
    } catch (err) {
      alert('Failed to connect to tracker backend.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Registered': return 'bg-secondary text-white';
      case 'Under Review': return 'bg-warning text-dark';
      case 'In Progress': return 'bg-info text-dark';
      case 'Resolved': return 'bg-success text-white';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="container-fluid p-4 min-vh-100" style={{ backgroundColor: '#0b1329', color: '#e2e8f0' }}>
      
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-white mb-1 d-flex align-items-center">
          <i className="fa-solid fa-list-check text-primary me-3 fs-3"></i>
          Complaint Tracking & Automated Escalation
        </h2>
        <p className="text-secondary small mb-0">
          Submit legal grievances, auto-route cases to department wings, and track resolution through 4 status stages.
        </p>
      </div>

      <div className="row g-4">
        {/* Registration Form */}
        <div className="col-lg-4">
          <div className="card bg-dark text-white border-secondary shadow-sm p-4 rounded-4" style={{ backgroundColor: '#131f3d' }}>
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center">
              <i className="fa-solid fa-file-circle-plus text-primary me-2"></i>Register New Ticket
            </h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small text-secondary fw-bold text-uppercase">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-select bg-black text-white border-secondary">
                  <option value="Contract & Document Analysis">Contract & Document Analysis</option>
                  <option value="Labor & Employment">Labor & Employment</option>
                  <option value="Property & Succession">Property & Succession</option>
                  <option value="Consumer Protection">Consumer Protection</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary fw-bold text-uppercase">Priority Level</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="form-select bg-black text-white border-secondary">
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary fw-bold text-uppercase">Grievance Description</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your legal query or contract complaint..."
                  className="form-control bg-black text-white border-secondary small"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-100 fw-bold py-2.5 rounded-3">
                {loading ? 'Registering Ticket...' : 'Submit & Route Ticket'}
              </button>
            </form>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="col-lg-8">
          <div className="card bg-dark text-white border-secondary shadow-sm p-4 rounded-4" style={{ backgroundColor: '#131f3d' }}>
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center">
              <i className="fa-solid fa-clipboard-list text-success me-2"></i>Active Case Tracker
            </h5>

            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle border-secondary mb-0">
                <thead>
                  <tr className="text-secondary small text-uppercase">
                    <th>Ticket ID</th>
                    <th>Category</th>
                    <th>Assigned Dept</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((item) => (
                    <tr key={item.ticket_id}>
                      <td className="fw-bold text-primary font-monospace">{item.ticket_id}</td>
                      <td className="small">{item.category}</td>
                      <td className="small text-secondary">{item.department}</td>
                      <td>
                        <span className={`badge px-2.5 py-1.5 fw-bold ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-transparent border border-danger text-danger px-2 py-1">
                          {item.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}