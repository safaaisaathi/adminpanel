export const en = {
  // Common & Branding
  appName: 'Safai Sathi',
  adminPortal: 'Panchmahal District Administration',
  projectCode: 'PS000051 • DDO Panchmahal Godhra',
  tagline: 'Citizen-Centric Garbage Collection & Sanitation Monitoring',
  loading: 'Loading system data...',
  refresh: 'Refresh',
  save: 'Save Changes',
  cancel: 'Cancel',
  close: 'Close',
  filter: 'Filter',
  all: 'All',
  search: 'Search...',
  actions: 'Actions',
  exportCsv: 'Export CSV',
  confirm: 'Confirm',
  viewDetails: 'View Details',
  language: 'Language',
  theme: 'Theme',
  light: 'Light',
  dark: 'Dark',

  // Navigation (A1-A9)
  nav: {
    overview: 'Overview',
    liveMap: 'Live Map',
    complaints: 'Complaints',
    wards: 'Wards & Talukas',
    vansRoutes: 'Vans & Routes',
    notices: 'Broadcast Notices',
    reports: 'Reports & Heatmap',
    staff: 'Staff Directory',
    login: 'Sign In',
    logout: 'Sign Out',
  },

  // Roles & Scopes
  roles: {
    inspector: 'Ward Inspector',
    chief_officer: 'Chief Officer (Nagarpalika)',
    tdo: 'Taluka Development Officer (TDO)',
    ddo: 'District Development Officer (DDO)',
    scope: 'Operational Scope',
    allWards: 'Full District (All Wards)',
  },

  // KPI Cards (A2 Overview)
  kpi: {
    vansOnShift: 'Vans On Shift',
    routeCompletion: 'Route Completion',
    openComplaints: 'Open Complaints',
    resolvedPct: 'Resolution Rate',
    escalatedTotal: 'Escalated Complaints',
    todayTrips: "Today's Active Trips",
    sevenDayTrend: '7-Day Complaints Inflow & Resolution',
    topProblemWards: 'Top 5 Problem Areas (Wards)',
    activeVansTitle: 'Live Fleet Tracking',
    systemHealth: 'Monitoring Engine Status',
  },

  // Live Map (A3)
  map: {
    title: 'Real-Time Fleet & Grievance Map',
    vanMarker: 'Van Marker',
    complaintPin: 'Complaint Pin',
    moving: 'Moving',
    idle: 'Idle',
    offline: 'Offline',
    lastSeen: 'Last seen {min}m ago',
    speed: 'Speed',
    battery: 'Battery',
    route: 'Assigned Route',
    simulateMovement: 'Simulate Live GPS Movement',
    stopSimulation: 'Pause Live Simulation',
    vanDetails: 'Van Details',
    wardCenter: 'Ward Center',
  },

  // Complaints (A4)
  complaints: {
    title: 'Grievance Management System',
    ticketId: 'Ticket ID',
    category: 'Category',
    ward: 'Ward',
    reportedAt: 'Reported At',
    status: 'Status',
    escalation: 'Escalation',
    assignedTo: 'Assigned Officer',
    proofPhoto: 'Citizen Proof',
    resolveComplaint: 'Mark Resolved',
    uploadProof: 'Upload Resolution Proof Photo',
    resolutionNotes: 'Resolution Notes',
    assignOfficer: 'Assign to Staff',
    mergedWarning: 'Merged into ticket {id} (Duplicate within 50m)',
    showMerged: 'Show Duplicates',
    hideMerged: 'Hide Duplicates',
    timeline: 'Resolution Timeline',
    statusTimeline: {
      received: 'Complaint logged by citizen',
      assigned: 'Assigned to ward inspector',
      escalated: 'Escalated to Level {lvl}',
      resolved: 'Sanitation completed with verified proof',
    },
  },

  // Categories
  categories: {
    garbage_dump: 'Garbage Dump',
    open_gutter: 'Open Gutter',
    missed_collection: 'Missed Collection',
    dead_animal: 'Dead Animal',
    public_toilet: 'Public Toilet',
    construction_debris: 'Construction Debris',
    hazardous_waste: 'Hazardous Waste',
    other: 'Other Sanitation Issue',
  },

  // Statuses
  status: {
    received: 'Received',
    assigned: 'Assigned',
    resolved: 'Resolved',
    escalated: 'Escalated',
    idle: 'Idle',
    on_shift: 'On Shift',
    offline: 'Offline',
  },

  // Wards (A5)
  wardsPage: {
    title: 'Ward Sanitation & Performance Index',
    wardName: 'Ward Name',
    type: 'Type',
    urban: 'Urban (Nagarpalika)',
    rural: 'Rural (Gram Panchayat)',
    avgRating: 'Public Rating',
    complaintStats: 'Complaints (Open / Total)',
    routeStatus: 'Daily Route Done',
    inspector: 'Assigned Inspector',
    escalationContact: 'Level 1 Escalation Officer',
  },

  // Vans and Routes (A6)
  vansRoutesPage: {
    title: 'Fleet & Route Operations',
    addVan: 'Register Van',
    addRoute: 'Add Sanitation Route',
    plateNo: 'Number Plate',
    driverPin: 'Driver PIN',
    setPin: 'Set / Update Driver PIN',
    scheduledStart: 'Scheduled Start',
    stopsSequence: 'Wards in Sequence',
    pinSetSuccess: 'Driver PIN updated securely (hashed in vanSecrets)',
  },

  // Notices (A7)
  noticesPage: {
    title: 'Broadcast Public & Driver Notices',
    createNotice: 'Compose Broadcast',
    target: 'Target Audience',
    targetAll: 'Broadcast to All Apps',
    targetWard: 'Specific Ward Residents',
    targetVan: 'Specific Van Driver',
    message: 'Notice Announcement',
    send: 'Dispatch via FCM',
    history: 'Broadcast History',
    sentBy: 'Dispatched By',
  },

  // Reports (A8)
  reportsPage: {
    title: 'Sanitation Analytics & Heatmap',
    heatmapTitle: 'Garbage Dump & Missed Collection Intensity',
    exportComplaints: 'Download Complaints CSV',
    exportTrips: 'Download Trips GPS Log CSV',
    trendAnalysis: 'Ward Breakdown Analysis',
  },

  // Staff (A9)
  staffPage: {
    title: 'Sanitation Staff & Authority Directory',
    addStaff: 'Add Staff Member',
    name: 'Officer Name',
    role: 'Jurisdiction Role',
    phone: 'Official Phone',
    assignedWards: 'Assigned Wards',
  },

  // Mascot Binny
  binny: {
    emptyTitle: 'All Clean & Clear!',
    emptySubtitle: 'No pending complaints or alerts in your jurisdictional area.',
    celebrateTitle: 'Action Resolved!',
    celebrateSubtitle: 'Ward cleaned and photographic verification archived successfully.',
  }
};
