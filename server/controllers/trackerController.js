// In-Memory Database Store for Complaints & Tickets
let complaints = [
  {
    ticket_id: 'LX-2026-8812',
    category: 'Contract & Document Analysis',
    description: 'Vendor agreement contains uncapped indemnification risks and missing dispute clauses.',
    priority: 'HIGH',
    status: 'In Progress',
    department: 'Corporate Contract Wing',
    created_at: new Date('2026-10-01')
  },
  {
    ticket_id: 'LX-2026-4019',
    category: 'Labor & Employment',
    description: 'Unilateral termination without 30-day statutory notice pay or severance.',
    priority: 'CRITICAL',
    status: 'Under Review',
    department: 'Labor Relations Board',
    created_at: new Date('2026-10-03')
  },
  {
    ticket_id: 'LX-2026-1102',
    category: 'Property & Succession',
    description: 'Ancestral land partition dispute involving Class-I legal heirs.',
    priority: 'MEDIUM',
    status: 'Registered',
    department: 'Civil & Property Cell',
    created_at: new Date('2026-10-05')
  }
];

// @route POST /api/tracker/submit
exports.submitComplaint = (req, res) => {
  try {
    const { category, description, priority } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Auto-generate ticket ID (e.g., LX-2026-5931)
    const ticket_id = `LX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const status = 'Registered';

    // Auto-route department based on category
    let department = 'General Legal Advisory';
    if (category.includes('Contract')) department = 'Corporate Contract Wing';
    else if (category.includes('Labor')) department = 'Labor Relations Board';
    else if (category.includes('Property')) department = 'Civil & Property Cell';
    else if (category.includes('Consumer')) department = 'Consumer Protection Cell';

    const newTicket = {
      ticket_id,
      category: category || 'General Legal Query',
      description,
      priority: priority || 'MEDIUM',
      status,
      department,
      created_at: new Date()
    };

    complaints.unshift(newTicket);

    console.log(`✅ Ticket Registered: ${ticket_id} routed to ${department}`);
    return res.json({ success: true, ticket: newTicket });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit complaint ticket' });
  }
};

// @route GET /api/tracker/all
exports.getComplaints = (req, res) => {
  return res.json(complaints);
};