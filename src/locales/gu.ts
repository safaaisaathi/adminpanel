export const gu = {
  // Common & Branding
  appName: 'સફાઈ સાથી',
  adminPortal: 'પંચમહાલ જિલ્લા વહીવટી તંત્ર',
  projectCode: 'PS000051 • ડીડીઓ પંચમહાલ ગોધરા',
  tagline: 'નાગરિક-કેન્દ્રિત કચરો સંગ્રહ અને સ્વચ્છતા મોનિટરિંગ સિસ્ટમ',
  loading: 'સિસ્ટમ ડેટા લોડ થઈ રહ્યો છે...',
  refresh: 'રીફ્રેશ',
  save: 'ફેરફારો સાચવો',
  cancel: 'રદ કરો',
  close: 'બંધ કરો',
  filter: 'ફિલ્ટર',
  all: 'બધા',
  search: 'શોધો...',
  actions: 'ક્રિયાઓ',
  exportCsv: 'CSV ડાઉનલોડ કરો',
  confirm: 'ખાતરી કરો',
  viewDetails: 'વિગતો જુઓ',
  language: 'ભાષા',
  theme: 'થીમ',
  light: 'લાઇટ',
  dark: 'ડાર્ક',

  // Navigation (A1-A9)
  nav: {
    overview: 'ડેશબોર્ડ ઝાંખી',
    liveMap: 'લાઇવ વાન નકશો',
    complaints: 'ફરિયાદ નિવારણ',
    wards: 'વોર્ડ અને તાલુકા',
    vansRoutes: 'વાન અને રૂટ્સ',
    notices: 'જાહેર સૂચનાઓ',
    reports: 'રિપોર્ટ્સ અને હીટમેપ',
    staff: 'સ્ટાફ ડિરેક્ટરી',
    login: 'સાઇન ઇન',
    logout: 'સાઇન આઉટ',
  },

  // Roles & Scopes
  roles: {
    inspector: 'વોર્ડ ઇન્સ્પેક્ટર',
    chief_officer: 'ચીફ ઓફિસર (નગરપાલિકા)',
    tdo: 'તાલુકા વિકાસ અધિકારી (TDO)',
    ddo: 'જિલ્લા વિકાસ અધિકારી (DDO)',
    scope: 'કાર્યક્ષેત્ર અધિકાર',
    allWards: 'સમગ્ર જિલ્લો (બધા વોર્ડ)',
  },

  // KPI Cards (A2 Overview)
  kpi: {
    vansOnShift: 'રૂટ પર વાન',
    routeCompletion: 'રૂટ પૂર્ણતા દર',
    openComplaints: 'બાકી ફરિયાદો',
    resolvedPct: 'નિવારણ દર',
    escalatedTotal: 'ઉચ્ચ સ્તરે ગયેલ (એસ્કેલેટેડ)',
    todayTrips: 'આજની સક્રિય ટ્રીપ્સ',
    sevenDayTrend: '૭ દિવસની ફરિયાદ સ્થિતિ',
    topProblemWards: 'મુખ્ય સમસ્યાગ્રસ્ત વિસ્તારો',
    activeVansTitle: 'વાહનોનું લાઇવ ટ્રેકિંગ',
    systemHealth: 'મોનિટરિંગ એન્જિન સ્થિતિ',
  },

  // Live Map (A3)
  map: {
    title: 'રીઅલ-ટાઇમ વાહન અને ફરિયાદ નકશો',
    vanMarker: 'કચરા વાન',
    complaintPin: 'ફરિયાદ પોઇન્ટ',
    moving: 'ચાલુ છે',
    idle: 'સ્થિર',
    offline: 'ઓફલાઇન',
    lastSeen: '{min} મિનિટ પહેલાં છેલ્લે જોવાયેલ',
    speed: 'ઝડપ',
    battery: 'બેટરી',
    route: 'નિયુક્ત રૂટ',
    simulateMovement: 'લાઇવ GPS સિમ્યુલેશન શરૂ કરો',
    stopSimulation: 'સિમ્યુલેશન થોભાવો',
    vanDetails: 'વાન વિગત',
    wardCenter: 'વોર્ડ કેન્દ્ર',
  },

  // Complaints (A4)
  complaints: {
    title: 'નાગરિક ફરિયાદ વ્યવસ્થાપન',
    ticketId: 'ટિકિટ આઈડી',
    category: 'પ્રકાર',
    ward: 'વોર્ડ',
    reportedAt: 'દાખલ કરેલ તારીખ',
    status: 'સ્થિતિ',
    escalation: 'સ્તર',
    assignedTo: 'નિયુક્ત અધિકારી',
    proofPhoto: 'નાગરિક ફોટો પુરાવો',
    resolveComplaint: 'ઉકેલાયેલ માર્ક કરો',
    uploadProof: 'નિવારણનો પુરાવો ફોટો અપલોડ કરો',
    resolutionNotes: 'નિવારણ નોંધ',
    assignOfficer: 'અધિકારીને સોંપો',
    mergedWarning: 'ટિકિટ {id} સાથે મર્જ થયેલ (૫૦ મીટરમાં પુનરાવર્તિત)',
    showMerged: 'મર્જ થયેલી બતાવો',
    hideMerged: 'મર્જ થયેલી છુપાવો',
    timeline: 'નિવારણ ટાઇમલાઇન',
    statusTimeline: {
      received: 'નાગરિક દ્વારા ફરિયાદ નોંધાઈ',
      assigned: 'વોર્ડ ઇન્સ્પેક્ટરને સોંપાઈ',
      escalated: 'સ્તર {lvl} પર મોકલાઈ',
      resolved: 'સફાઈ પૂર્ણ અને ફોટો દ્વારા ચકાસાઈ',
    },
  },

  // Categories
  categories: {
    garbage_dump: 'કચરાનો ઢગલો',
    open_gutter: 'ખુલ્લી ગટર',
    missed_collection: 'કચરો લેવા ન આવ્યા',
    dead_animal: 'મૃત પ્રાણી',
    public_toilet: 'જાહેર શૌચાલય',
    construction_debris: 'બાંધકામનો કચરો (કાટમાળ)',
    hazardous_waste: 'જોખમી કચરો',
    other: 'અન્ય સફાઈ પ્રશ્ન',
  },

  // Statuses
  status: {
    received: 'પ્રાપ્ત થયેલ',
    assigned: 'સોંપાયેલ',
    resolved: 'ઉકેલાયેલ',
    escalated: 'એસ્કેલેટેડ',
    idle: 'સ્થિર',
    on_shift: 'રૂટ પર',
    offline: 'ઓફલાઇન',
  },

  // Wards (A5)
  wardsPage: {
    title: 'વોર્ડ સફાઈ અને પ્રદર્શન ઇન્ડેક્સ',
    wardName: 'વોર્ડનું નામ',
    type: 'પ્રકાર',
    urban: 'શહેરી (નગરપાલિકા)',
    rural: 'ગ્રામ્ય (ગ્રામ પંચાયત)',
    avgRating: 'લોક રેટિંગ',
    complaintStats: 'ફરિયાદો (બાકી / કુલ)',
    routeStatus: 'દૈનિક રૂટ સ્થિતિ',
    inspector: 'નિયુક્ત ઇન્સ્પેક્ટર',
    escalationContact: 'લેવલ ૧ જવાબદાર અધિકારી',
  },

  // Vans and Routes (A6)
  vansRoutesPage: {
    title: 'વાહન અને રૂટ સંચાલન',
    addVan: 'નવું વાહન નોંધો',
    addRoute: 'નવો રૂટ ઉમેરો',
    plateNo: 'વાહન નંબર',
    driverPin: 'ડ્રાઇવર પિન',
    setPin: 'ડ્રાઇવર પિન સેટ કરો',
    scheduledStart: 'નિયમિત શરૂઆત સમય',
    stopsSequence: 'વોર્ડ ક્રમ',
    pinSetSuccess: 'ડ્રાઇવર પિન સફળતાપૂર્વક અપડેટ થયો',
  },

  // Notices (A7)
  noticesPage: {
    title: 'જાહેર અને ડ્રાઇવર સૂચનાઓ પ્રસારણ',
    createNotice: 'નવો સંદેશ લખો',
    target: 'લક્ષ્ય શ્રોતા',
    targetAll: 'બધા વપરાશકર્તાઓ માટે',
    targetWard: 'વિશિષ્ટ વોર્ડના નાગરિકો',
    targetVan: 'વિશિષ્ટ વાન ડ્રાઇવર',
    message: 'સૂચના લખાણ',
    send: 'FCM દ્વારા મોકલો',
    history: 'મોકલેલી સૂચનાઓ',
    sentBy: 'દ્વારા મોકલાયેલ',
  },

  // Reports (A8)
  reportsPage: {
    title: 'સફાઈ વિશ્લેષણ અને હીટમેપ',
    heatmapTitle: 'કચરા ઢગલા અને સમસ્યાઓની તીવ્રતા',
    exportComplaints: 'ફરિયાદોનું CSV ડાઉનલોડ કરો',
    exportTrips: 'ટ્રીપ્સનું GPS લોગ CSV ડાઉનલોડ કરો',
    trendAnalysis: 'વોર્ડ વિશ્લેષણ',
  },

  // Staff (A9)
  staffPage: {
    title: 'સફાઈ સ્ટાફ અને વહીવટી ડિરેક્ટરી',
    addStaff: 'નવા સ્ટાફ ઉમેરો',
    name: 'અધિકારીનું નામ',
    role: 'હોદ્દો / ભૂમિકા',
    phone: 'અધિકૃત ફોન',
    assignedWards: 'સોંપાયેલા વોર્ડ',
  },

  // Mascot Binny
  binny: {
    emptyTitle: 'બધું સ્વચ્છ અને વ્યવસ્થિત!',
    emptySubtitle: 'તમારા કાર્યક્ષેત્રમાં કોઈ બાકી ફરિયાદ કે ચેતવણી નથી.',
    celebrateTitle: 'પ્રશ્ન ઉકેલાઈ ગયો!',
    celebrateSubtitle: 'વોર્ડમાં સફાઈ પૂર્ણ થઈ અને ફોટો ચકાસણી સાચવી લેવાઈ છે.',
  }
};
