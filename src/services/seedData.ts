import {
  Ward,
  Van,
  Driver,
  AttendanceRecord,
  AlertItem,
  AuditLogEntry,
  SettingsConfig,
  Route,
  Trip,
  Complaint,
  Rating,
  Notice,
  Staff
} from '../types';

export const SEED_WARDS: Ward[] = [
  {
    id: 'ward_4',
    name: 'Ward 4',
    nameGu: 'વૉર્ડ ૪',
    code: 'GDH-W-004',
    type: 'urban',
    center: { lat: 22.772, lng: 73.608 },
    radiusM: 650,
    routeId: 'route_east',
    inspectorId: 'staff_inspector_meena',
    escalationTo: 'staff_co_rakesh',
    areaKm2: 1.21,
    pointsCount: 7,
    polygon: [
      [22.775, 73.604],
      [22.776, 73.612],
      [22.771, 73.614],
      [22.768, 73.607],
      [22.770, 73.602],
      [22.775, 73.604],
    ],
    createdDate: '10 May 2026',
    createdBy: 'R. Shah',
    history: [
      { date: '10 May 2026', action: 'Created by R. Shah' },
      { date: '15 Jul 2026', action: 'Inspector assigned: M. Parmar' }
    ]
  },
  {
    id: 'ward_5',
    name: 'Ward 5',
    nameGu: 'વૉર્ડ ૫',
    code: 'GDH-W-005',
    type: 'urban',
    center: { lat: 22.778, lng: 73.618 },
    radiusM: 750,
    routeId: 'route_east',
    inspectorId: 'staff_inspector_meena',
    escalationTo: 'staff_co_rakesh',
    areaKm2: 1.84,
    pointsCount: 8,
    polygon: [
      [22.782, 73.614],
      [22.785, 73.623],
      [22.780, 73.627],
      [22.775, 73.624],
      [22.773, 73.617],
      [22.777, 73.613],
      [22.782, 73.614],
    ],
    createdDate: '12 Jun 2026',
    createdBy: 'R. Shah',
    history: [
      { date: '12 Jun 2026', action: 'Created by R. Shah' },
      { date: '02 Aug 2026', action: 'Boundary edited' },
      { date: '14 Sep 2026', action: 'Inspector changed to M. Parmar' }
    ]
  },
  {
    id: 'ward_6',
    name: 'Ward 6',
    nameGu: 'વૉર્ડ ૬',
    code: 'GDH-W-006',
    type: 'urban',
    center: { lat: 22.768, lng: 73.615 },
    radiusM: 700,
    routeId: 'route_east',
    inspectorId: 'staff_inspector_meena',
    escalationTo: 'staff_co_rakesh',
    areaKm2: 1.52,
    pointsCount: 6,
    polygon: [
      [22.771, 73.611],
      [22.773, 73.621],
      [22.766, 73.623],
      [22.763, 73.615],
      [22.767, 73.609],
      [22.771, 73.611],
    ],
    createdDate: '15 Jun 2026',
    createdBy: 'R. Shah',
    history: [{ date: '15 Jun 2026', action: 'Created by R. Shah' }]
  },
  {
    id: 'ward_7',
    name: 'Ward 7',
    nameGu: 'વૉર્ડ ૭',
    code: 'GDH-W-007',
    type: 'urban',
    center: { lat: 22.772, lng: 73.626 },
    radiusM: 850,
    routeId: 'route_east',
    inspectorId: 'staff_inspector_mahesh',
    escalationTo: 'staff_co_rakesh',
    areaKm2: 2.10,
    pointsCount: 8,
    polygon: [
      [22.777, 73.623],
      [22.779, 73.633],
      [22.771, 73.635],
      [22.766, 73.628],
      [22.769, 73.621],
      [22.777, 73.623],
    ],
    createdDate: '20 Jun 2026',
    createdBy: 'R. Shah',
    history: [
      { date: '20 Jun 2026', action: 'Created by R. Shah' },
      { date: '25 Aug 2026', action: 'Added to East Route' }
    ]
  },
  {
    id: 'ward_8',
    name: 'Ward 8',
    nameGu: 'વૉર્ડ ૮',
    code: 'GDH-W-008',
    type: 'urban',
    center: { lat: 22.758, lng: 73.616 },
    radiusM: 600,
    routeId: 'route_west',
    inspectorId: '',
    escalationTo: 'staff_co_rakesh',
    areaKm2: 0.96,
    pointsCount: 6,
    polygon: [
      [22.762, 73.612],
      [22.763, 73.621],
      [22.756, 73.622],
      [22.754, 73.614],
      [22.762, 73.612],
    ],
    createdDate: '01 Jul 2026',
    createdBy: 'R. Shah',
    history: [{ date: '01 Jul 2026', action: 'Created by R. Shah' }]
  },
  {
    id: 'ward_9',
    name: 'Ward 9',
    nameGu: 'વૉર્ડ ૯',
    code: 'GDH-W-009',
    type: 'urban',
    center: { lat: 22.784, lng: 73.605 },
    radiusM: 750,
    routeId: 'route_east',
    inspectorId: 'staff_inspector_meena',
    escalationTo: 'staff_co_rakesh',
    areaKm2: 1.84,
    pointsCount: 9,
    polygon: [
      [22.789, 73.601],
      [22.791, 73.611],
      [22.785, 73.614],
      [22.780, 73.610],
      [22.779, 73.603],
      [22.784, 73.599],
      [22.789, 73.601],
    ],
    createdDate: '28 Oct 2026',
    createdBy: 'R. Shah',
    history: [{ date: '28 Oct 2026', action: 'Created by R. Shah' }]
  }
];

export const SEED_DRIVERS: Driver[] = [
  {
    id: 'drv_ramesh',
    driverId: 'GDH-D-0042',
    name: 'Ramesh Bhai',
    phone: '+91 98xxxx42',
    dob: '14 Mar 1989',
    address: 'Panam Road, Godhra',
    emergencyContact: {
      name: 'Kanta Ben',
      phone: '+91 98xxxx88'
    },
    licenceNumber: 'GJ17 2019 0045123',
    licenceClass: 'LMV (Transport)',
    licenceIssued: '10 Jan 2019',
    licenceValidUntil: 'Dec 2028',
    vanId: 'van_1',
    vanPlate: 'GJ-17-AB-1234',
    wardIds: ['ward_4', 'ward_5', 'ward_6'],
    shiftStart: '07:30 AM',
    shiftEnd: '02:30 PM',
    status: 'on_shift',
    shiftProgressPct: 78,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '12 Jun 2024',
    oneTimePin: '4827',
    recentShifts: [
      { date: 'Today', vanPlate: 'GJ-17-AB-1234', started: '07:28', ended: 'In progress', wardsDone: '5 of 9', status: 'on_time' },
      { date: 'Yesterday', vanPlate: 'GJ-17-AB-1234', started: '07:31', ended: '14:12', wardsDone: '9 of 9', status: 'on_time' },
      { date: '27 Oct', vanPlate: 'GJ-17-AB-1234', started: '07:55', ended: '14:20', wardsDone: '9 of 9', status: 'late', lateMinutes: 25 },
      { date: '26 Oct', vanPlate: 'GJ-17-AB-1234', started: '07:29', ended: '14:02', wardsDone: '8 of 9', status: 'on_time' },
    ]
  },
  {
    id: 'drv_suresh',
    driverId: 'GDH-D-0043',
    name: 'Suresh Vaja',
    phone: '+91 98xxxx43',
    dob: '22 Aug 1991',
    address: 'Vavdi Road, Godhra',
    emergencyContact: {
      name: 'Bhavna Vaja',
      phone: '+91 98xxxx77'
    },
    licenceNumber: 'GJ17 2020 0055214',
    licenceClass: 'LMV (Transport)',
    licenceIssued: '15 Feb 2020',
    licenceValidUntil: 'Jun 2027',
    vanId: 'van_2',
    vanPlate: 'GJ-17-AB-1301',
    wardIds: ['ward_5'],
    shiftStart: '07:30 AM',
    shiftEnd: '02:30 PM',
    status: 'late',
    lateMinutes: 12,
    shiftProgressPct: 33,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '15 Jan 2025',
    recentShifts: [
      { date: 'Today', vanPlate: 'GJ-17-AB-1301', started: '07:42', ended: 'In progress', wardsDone: '3 of 9', status: 'late', lateMinutes: 12 },
      { date: 'Yesterday', vanPlate: 'GJ-17-AB-1301', started: '07:29', ended: '14:10', wardsDone: '9 of 9', status: 'on_time' }
    ]
  },
  {
    id: 'drv_dilip',
    driverId: 'GDH-D-0044',
    name: 'Dilip Rana',
    phone: '+91 98xxxx44',
    dob: '05 Nov 1988',
    address: 'Near Civil Station, Godhra',
    emergencyContact: {
      name: 'Geeta Rana',
      phone: '+91 98xxxx66'
    },
    licenceNumber: 'GJ17 2019 0045123',
    licenceClass: 'LMV (Transport)',
    licenceIssued: '02 Nov 2019',
    licenceValidUntil: 'Nov 2026', // expires in 21 days
    vanId: 'van_3',
    vanPlate: 'GJ-17-CD-2210',
    wardIds: ['ward_6'],
    shiftStart: '07:30 AM',
    shiftEnd: '02:30 PM',
    status: 'on_shift',
    shiftProgressPct: 56,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '10 Aug 2023',
    recentShifts: [
      { date: 'Today', vanPlate: 'GJ-17-CD-2210', started: '07:33', ended: 'In progress', wardsDone: '6 of 9', status: 'on_time' },
    ]
  },
  {
    id: 'drv_anil',
    driverId: 'GDH-D-0045',
    name: 'Anil Chauhan',
    phone: '+91 98xxxx45',
    dob: '18 Jul 1993',
    address: 'Station Colony, Godhra',
    emergencyContact: {
      name: 'Sunil Chauhan',
      phone: '+91 98xxxx55'
    },
    licenceNumber: 'GJ17 2021 0078129',
    licenceClass: 'LMV (Transport)',
    licenceIssued: '12 Aug 2021',
    licenceValidUntil: 'Aug 2029',
    vanId: 'van_5',
    vanPlate: 'GJ-17-EF-3001',
    wardIds: ['ward_7'],
    shiftStart: '07:30 AM',
    shiftEnd: '02:30 PM',
    status: 'on_shift',
    shiftProgressPct: 89,
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    joinedDate: '01 Mar 2024',
    recentShifts: [
      { date: 'Today', vanPlate: 'GJ-17-EF-3001', started: '07:25', ended: 'In progress', wardsDone: '8 of 9', status: 'on_time' }
    ]
  },
  {
    id: 'drv_kiran',
    driverId: 'GDH-D-0046',
    name: 'Kiran Solanki',
    phone: '+91 98xxxx46',
    dob: '30 Sep 1995',
    address: 'Bhamaiya, Godhra',
    emergencyContact: {
      name: 'Pravin Solanki',
      phone: '+91 98xxxx44'
    },
    licenceNumber: 'GJ17 2022 0098432',
    licenceClass: 'LMV (Transport)',
    licenceIssued: '10 Mar 2022',
    licenceValidUntil: 'Mar 2028',
    wardIds: [],
    shiftStart: '07:30 AM',
    shiftEnd: '02:30 PM',
    status: 'off_duty',
    shiftProgressPct: 0,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '10 Oct 2025',
  },
  {
    id: 'drv_bharat',
    driverId: 'GDH-D-0047',
    name: 'Bharat Patel',
    phone: '+91 98xxxx47',
    dob: '12 Jan 1987',
    address: 'Bamroli Road, Godhra',
    emergencyContact: {
      name: 'Mina Patel',
      phone: '+91 98xxxx33'
    },
    licenceNumber: 'GJ17 2018 0032910',
    licenceClass: 'LMV (Transport)',
    licenceIssued: '05 Feb 2018',
    licenceValidUntil: 'Feb 2027',
    vanId: 'van_4',
    vanPlate: 'GJ-17-CD-2255',
    wardIds: ['ward_8'],
    shiftStart: '07:30 AM',
    shiftEnd: '02:30 PM',
    status: 'suspended',
    shiftProgressPct: 22,
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    joinedDate: '05 Jan 2024'
  },
  {
    id: 'drv_hitesh',
    driverId: 'GDH-D-0049',
    name: 'Hitesh Rana',
    phone: '+91 98xxxx49',
    dob: '02 Feb 1994',
    address: 'Lalbagh, Godhra',
    emergencyContact: { name: 'Raju Rana', phone: '+91 98xxxx22' },
    licenceNumber: 'GJ17 2023 0089123',
    licenceClass: 'LMV (Transport)',
    licenceIssued: '15 Jan 2023',
    licenceValidUntil: 'Jan 2030',
    wardIds: [],
    shiftStart: '07:30 AM',
    shiftEnd: '02:30 PM',
    status: 'off_duty',
    shiftProgressPct: 0,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: '01 Jun 2025'
  },
  {
    id: 'drv_naresh',
    driverId: 'GDH-D-0050',
    name: 'Naresh Vaja',
    phone: '+91 98xxxx50',
    dob: '19 Dec 1992',
    address: 'Chikli, Godhra',
    emergencyContact: { name: 'Kailash Vaja', phone: '+91 98xxxx11' },
    licenceNumber: 'GJ17 2022 0076543',
    licenceClass: 'LMV (Transport)',
    licenceIssued: '10 Nov 2022',
    licenceValidUntil: 'Nov 2029',
    wardIds: [],
    shiftStart: '07:30 AM',
    shiftEnd: '02:30 PM',
    status: 'off_duty',
    shiftProgressPct: 0,
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    joinedDate: '15 Aug 2025'
  }
];

export const SEED_ROUTES: Route[] = [
  {
    id: 'route_east',
    name: 'East route',
    wardIds: ['ward_4', 'ward_5', 'ward_6', 'ward_7'],
    scheduledStartTime: '07:30 AM',
    vanPlate: 'GJ-17-AB-1234',
    totalDistanceKm: 6.6,
    estimatedDuration: 'About 3 h 20 min'
  },
  {
    id: 'route_west',
    name: 'West route',
    wardIds: ['ward_8', 'ward_6'],
    scheduledStartTime: '08:00 AM',
    vanPlate: 'GJ-17-CD-2210',
    totalDistanceKm: 5.2,
    estimatedDuration: 'About 2 h 45 min'
  },
  {
    id: 'route_north',
    name: 'North route',
    wardIds: ['ward_9', 'ward_4'],
    scheduledStartTime: '07:00 AM',
    vanPlate: 'GJ-17-EF-3001',
    totalDistanceKm: 7.1,
    estimatedDuration: 'About 3 h 40 min'
  }
];

export const SEED_VANS: Van[] = [
  {
    id: 'van_1',
    plateNo: 'GJ-17-AB-1234',
    routeId: 'route_east',
    status: 'on_shift',
    lastLocation: {
      lat: 22.7785,
      lng: 73.6182,
      updatedAt: new Date(Date.now() - 8000).toISOString(),
      speedKmph: 18.0
    },
    batteryPct: 76,
    type: 'Tata Ace',
    capacity: '750 kg',
    driverId: 'drv_ramesh',
    driverName: 'Ramesh Bhai',
    insuranceExpiry: 'Mar 2027',
    pucExpiry: 'Jan 2027'
  },
  {
    id: 'van_2',
    plateNo: 'GJ-17-AB-1301',
    routeId: 'route_east',
    status: 'on_shift',
    lastLocation: {
      lat: 22.7760,
      lng: 73.6150,
      updatedAt: new Date(Date.now() - 15000).toISOString(),
      speedKmph: 14.2
    },
    batteryPct: 82,
    type: 'Tata Ace',
    capacity: '750 kg',
    driverId: 'drv_suresh',
    driverName: 'Suresh Vaja',
    insuranceExpiry: 'Dec 2026',
    pucExpiry: 'Feb 2027'
  },
  {
    id: 'van_3',
    plateNo: 'GJ-17-CD-2210',
    routeId: 'route_west',
    status: 'offline', // GPS offline 11 min
    lastLocation: {
      lat: 22.7665,
      lng: 73.6190,
      updatedAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
      speedKmph: 0
    },
    batteryPct: 45,
    type: 'Mahindra Jeeto',
    capacity: '700 kg',
    driverId: 'drv_dilip',
    driverName: 'Dilip Rana',
    insuranceExpiry: 'Aug 2027',
    pucExpiry: 'Nov 2026' // Expiring soon
  },
  {
    id: 'van_4',
    plateNo: 'GJ-17-CD-2255',
    routeId: 'route_west',
    status: 'idle',
    lastLocation: {
      lat: 22.7590,
      lng: 73.6160,
      updatedAt: new Date(Date.now() - 45000).toISOString(),
      speedKmph: 0
    },
    batteryPct: 91,
    type: 'Tata Ace',
    capacity: '750 kg',
    driverId: undefined,
    driverName: 'Unassigned',
    insuranceExpiry: 'Jun 2027',
    pucExpiry: 'Oct 2027'
  },
  {
    id: 'van_5',
    plateNo: 'GJ-17-EF-3001',
    routeId: 'route_north',
    status: 'on_shift',
    lastLocation: {
      lat: 22.7725,
      lng: 73.6265,
      updatedAt: new Date(Date.now() - 12000).toISOString(),
      speedKmph: 22.4
    },
    batteryPct: 68,
    type: 'Tata Ace',
    capacity: '750 kg',
    driverId: 'drv_anil',
    driverName: 'Anil Chauhan',
    insuranceExpiry: 'May 2027',
    pucExpiry: 'Sep 2027'
  }
];

export const SEED_STAFF: Staff[] = [
  {
    id: 'staff_ddo',
    authUid: 'uid_ddo_patel',
    name: 'Dr. A. Patel',
    role: 'ddo',
    wardIds: [],
    talukaId: 'all',
    phone: '+91 98xxxx00',
    email: 'ddo.panchmahal@gujarat.gov.in',
    jurisdiction: 'Panchmahal District',
    lastActive: 'Today, 09:45',
    active: true
  },
  {
    id: 'staff_co_rakesh',
    authUid: 'uid_co_rakesh',
    name: 'Rakesh Shah',
    role: 'chief_officer',
    wardIds: ['ward_4', 'ward_5', 'ward_6', 'ward_7', 'ward_8', 'ward_9'],
    talukaId: 'godhra_urban',
    phone: '+91 98xxxx01',
    email: 'co.godhra@gujarat.gov.in',
    jurisdiction: 'Godhra Nagarpalika (14 wards)',
    lastActive: 'Today, 09:10',
    active: true
  },
  {
    id: 'staff_inspector_meena',
    authUid: 'uid_insp_meena',
    name: 'Meena Parmar',
    role: 'inspector',
    wardIds: ['ward_5', 'ward_6'],
    talukaId: 'godhra_urban',
    phone: '+91 98xxxx02',
    email: 'meena.parmar@gujarat.gov.in',
    jurisdiction: 'Godhra NP (Ward 5, 6)',
    lastActive: 'Today, 08:42',
    active: true
  },
  {
    id: 'staff_inspector_jayesh',
    authUid: 'uid_insp_jayesh',
    name: 'Jayesh Solanki',
    role: 'inspector',
    wardIds: [],
    talukaId: 'halol',
    phone: '+91 98xxxx03',
    email: 'jayesh.solanki@gujarat.gov.in',
    jurisdiction: 'Halol NP (Ward 2, 3)',
    lastActive: 'Yesterday',
    active: true
  },
  {
    id: 'staff_tdo_kiran',
    authUid: 'uid_tdo_kiran',
    name: 'Kiran Patel',
    role: 'tdo',
    wardIds: [],
    talukaId: 'shehera',
    phone: '+91 98xxxx04',
    email: 'tdo.shehera@gujarat.gov.in',
    jurisdiction: 'Shehera Taluka (22 villages)',
    lastActive: 'Today, 07:55',
    active: true
  },
  {
    id: 'staff_inspector_hetal',
    authUid: 'uid_insp_hetal',
    name: 'Hetal Desai',
    role: 'inspector',
    wardIds: [],
    talukaId: 'kalol',
    phone: '+91 98xxxx05',
    email: 'hetal.desai@gujarat.gov.in',
    jurisdiction: 'Kalol NP (Ward 8)',
    lastActive: '3 days ago',
    active: true
  },
  {
    id: 'staff_inspector_mahesh',
    authUid: 'uid_insp_mahesh',
    name: 'Mahesh Rana',
    role: 'inspector',
    wardIds: ['ward_7'],
    talukaId: 'godhra_urban',
    phone: '+91 98xxxx06',
    email: 'mahesh.rana@gujarat.gov.in',
    jurisdiction: 'Godhra NP (Ward 7)',
    lastActive: 'Today, 09:30',
    active: true
  }
];

export const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'comp_0412',
    ticketId: 'PMH-20261031-0412',
    deviceId: 'dev_4f2a',
    category: 'garbage_dump',
    photoUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7780, lng: 73.6185 },
    wardId: 'ward_5',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 min ago
    status: 'received',
    escalationLevel: 0,
    citizenDeviceId: '4F2A'
  },
  {
    id: 'comp_0398',
    ticketId: 'PMH-20261031-0398',
    deviceId: 'dev_9c8b',
    category: 'open_gutter',
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7792, lng: 73.6190 },
    wardId: 'ward_5',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 h ago
    status: 'assigned',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    escalationLevel: 0,
    citizenDeviceId: '9C8B',
    timeline: {
      receivedAt: 'Today 08:30',
      assignedAt: 'Today 09:15'
    }
  },
  {
    id: 'comp_0377',
    ticketId: 'PMH-20261031-0377',
    deviceId: 'dev_3b1a',
    category: 'missed_collection',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7685, lng: 73.6155 },
    wardId: 'ward_6',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 h ago
    status: 'assigned',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    escalationLevel: 0,
    citizenDeviceId: '3B1A'
  },
  {
    id: 'comp_0341',
    ticketId: 'PMH-20261029-0341',
    deviceId: 'dev_4f2a',
    category: 'garbage_dump',
    photoUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7720, lng: 73.6260 },
    wardId: 'ward_7',
    createdAt: new Date(Date.now() - 27 * 60 * 60 * 1000).toISOString(), // 27 h ago
    status: 'escalated',
    assignedTo: 'staff_inspector_mahesh',
    assignedToName: 'Mahesh Rana',
    escalationLevel: 1, // Escalated L1 to Chief Officer
    citizenDeviceId: '4F2A',
    timeline: {
      receivedAt: 'Yesterday 08:12',
      assignedAt: 'Yesterday 09:30',
      escalatedAt: 'Today 09:30, no action in 24 h'
    }
  },
  {
    id: 'comp_0320',
    ticketId: 'PMH-20261028-0320',
    deviceId: 'dev_81ca',
    category: 'open_gutter',
    photoUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600&auto=format&fit=crop&q=80',
    resolvedPhotoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7725, lng: 73.6080 },
    wardId: 'ward_4',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'resolved',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    resolvedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    escalationLevel: 0
  },
  {
    id: 'comp_0301',
    ticketId: 'PMH-20261026-0301',
    deviceId: 'dev_77bc',
    category: 'garbage_dump',
    photoUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    resolvedPhotoUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7690, lng: 73.6160 },
    wardId: 'ward_6',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: 'resolved',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    escalationLevel: 0
  },
  {
    id: 'comp_0289',
    ticketId: 'PMH-20261025-0289',
    deviceId: 'dev_11aa',
    category: 'open_gutter',
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7745, lng: 73.6110 },
    wardId: 'ward_4',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'received',
    escalationLevel: 0,
    citizenDeviceId: '11AA'
  },
  {
    id: 'comp_0275',
    ticketId: 'PMH-20261024-0275',
    deviceId: 'dev_22bb',
    category: 'missed_collection',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7815, lng: 73.6195 },
    wardId: 'ward_5',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'assigned',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    escalationLevel: 0
  },
  {
    id: 'comp_0260',
    ticketId: 'PMH-20261023-0260',
    deviceId: 'dev_33cc',
    category: 'garbage_dump',
    photoUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7660, lng: 73.6130 },
    wardId: 'ward_6',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'escalated',
    assignedTo: 'staff_inspector_mahesh',
    assignedToName: 'Mahesh Rana',
    escalationLevel: 2
  },
  {
    id: 'comp_0245',
    ticketId: 'PMH-20261021-0245',
    deviceId: 'dev_44dd',
    category: 'garbage_dump',
    photoUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7730, lng: 73.6270 },
    wardId: 'ward_7',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved',
    resolvedPhotoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    assignedTo: 'staff_inspector_kiran',
    assignedToName: 'Kiran Rathod',
    escalationLevel: 0
  },
  {
    id: 'comp_0230',
    ticketId: 'PMH-20261019-0230',
    deviceId: 'dev_55ee',
    category: 'open_gutter',
    photoUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7785, lng: 73.6175 },
    wardId: 'ward_5',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'received',
    escalationLevel: 0
  },
  {
    id: 'comp_0215',
    ticketId: 'PMH-20261017-0215',
    deviceId: 'dev_66ff',
    category: 'missed_collection',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7710, lng: 73.6060 },
    wardId: 'ward_4',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'assigned',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    escalationLevel: 0
  },
  {
    id: 'comp_0202',
    ticketId: 'PMH-20261015-0202',
    deviceId: 'dev_77gg',
    category: 'garbage_dump',
    photoUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7675, lng: 73.6145 },
    wardId: 'ward_6',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved',
    resolvedPhotoUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    escalationLevel: 0
  },
  {
    id: 'comp_0190',
    ticketId: 'PMH-20261013-0190',
    deviceId: 'dev_88hh',
    category: 'open_gutter',
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7750, lng: 73.6210 },
    wardId: 'ward_7',
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'escalated',
    assignedTo: 'staff_inspector_mahesh',
    assignedToName: 'Mahesh Rana',
    escalationLevel: 1
  },
  {
    id: 'comp_0178',
    ticketId: 'PMH-20261011-0178',
    deviceId: 'dev_99ii',
    category: 'garbage_dump',
    photoUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7800, lng: 73.6160 },
    wardId: 'ward_5',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved',
    resolvedPhotoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    escalationLevel: 0
  },
  {
    id: 'comp_0165',
    ticketId: 'PMH-20261009-0165',
    deviceId: 'dev_00jj',
    category: 'missed_collection',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7735, lng: 73.6095 },
    wardId: 'ward_4',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'received',
    escalationLevel: 0
  },
  {
    id: 'comp_0150',
    ticketId: 'PMH-20261007-0150',
    deviceId: 'dev_12kk',
    category: 'garbage_dump',
    photoUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7695, lng: 73.6180 },
    wardId: 'ward_6',
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved',
    resolvedPhotoUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    escalationLevel: 0
  },
  {
    id: 'comp_0135',
    ticketId: 'PMH-20261005-0135',
    deviceId: 'dev_34ll',
    category: 'open_gutter',
    photoUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7765, lng: 73.6245 },
    wardId: 'ward_7',
    createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved',
    resolvedPhotoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    assignedTo: 'staff_inspector_kiran',
    assignedToName: 'Kiran Rathod',
    escalationLevel: 0
  },
  {
    id: 'comp_0120',
    ticketId: 'PMH-20261003-0120',
    deviceId: 'dev_56mm',
    category: 'garbage_dump',
    photoUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7820, lng: 73.6200 },
    wardId: 'ward_5',
    createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved',
    resolvedPhotoUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    escalationLevel: 0
  },
  {
    id: 'comp_0105',
    ticketId: 'PMH-20261001-0105',
    deviceId: 'dev_78nn',
    category: 'missed_collection',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7705, lng: 73.6070 },
    wardId: 'ward_4',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved',
    resolvedPhotoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    escalationLevel: 0
  },
  {
    id: 'comp_0090',
    ticketId: 'PMH-20260929-0090',
    deviceId: 'dev_90oo',
    category: 'garbage_dump',
    photoUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7680, lng: 73.6150 },
    wardId: 'ward_6',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved',
    resolvedPhotoUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    escalationLevel: 0
  },
  {
    id: 'comp_0075',
    ticketId: 'PMH-20260928-0075',
    deviceId: 'dev_75pp',
    category: 'open_gutter',
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    location: { lat: 22.7715, lng: 73.6120 },
    wardId: 'ward_4',
    createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved',
    resolvedPhotoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    assignedTo: 'staff_inspector_meena',
    assignedToName: 'Meena Parmar',
    escalationLevel: 0
  }
];

export const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_1',
    driverId: 'drv_ramesh',
    driverName: 'Ramesh Bhai',
    driverCode: 'GDH-D-0042',
    vanPlate: 'GJ-17-AB-1234',
    scheduled: '07:30',
    started: '07:28',
    ended: 'In progress',
    wardsDone: '5 of 9',
    status: 'on_time',
    date: 'today',
    tripId: 'trip_ramesh_today'
  },
  {
    id: 'att_2',
    driverId: 'drv_suresh',
    driverName: 'Suresh Vaja',
    driverCode: 'GDH-D-0043',
    vanPlate: 'GJ-17-AB-1301',
    scheduled: '07:30',
    started: 'Not started',
    ended: '-',
    wardsDone: '0 of 9',
    status: 'late',
    lateMinutes: 12,
    date: 'today'
  },
  {
    id: 'att_3',
    driverId: 'drv_dilip',
    driverName: 'Dilip Rana',
    driverCode: 'GDH-D-0044',
    vanPlate: 'GJ-17-CD-2210',
    scheduled: '07:30',
    started: '07:33',
    ended: 'In progress',
    wardsDone: '6 of 9',
    status: 'on_time',
    date: 'today',
    tripId: 'trip_dilip_today'
  },
  {
    id: 'att_4',
    driverId: 'drv_anil',
    driverName: 'Anil Chauhan',
    driverCode: 'GDH-D-0045',
    vanPlate: 'GJ-17-EF-3001',
    scheduled: '07:30',
    started: '07:25',
    ended: 'In progress',
    wardsDone: '8 of 9',
    status: 'on_time',
    date: 'today',
    tripId: 'trip_anil_today'
  },
  {
    id: 'att_5',
    driverId: 'drv_kiran',
    driverName: 'Kiran Solanki',
    driverCode: 'GDH-D-0046',
    vanPlate: 'Not allotted',
    scheduled: '07:30',
    started: '-',
    ended: '-',
    wardsDone: '-',
    status: 'off_duty',
    date: 'today'
  },
  {
    id: 'att_6',
    driverId: 'drv_bharat',
    driverName: 'Bharat Patel',
    driverCode: 'GDH-D-0047',
    vanPlate: 'GJ-17-CD-2255',
    scheduled: '07:30',
    started: '-',
    ended: '-',
    wardsDone: '-',
    status: 'absent',
    date: 'today'
  }
];

export const SEED_ALERTS: AlertItem[] = [
  {
    id: 'alt_1',
    severity: 'critical',
    title: 'Van GJ-17-CD-2210 offline',
    detail: 'No signal for 11 min. Driver: Dilip Rana',
    timeAgo: '9 min ago',
    timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    driverPhone: '+91 98xxxx44',
    vanId: 'van_3',
    acknowledged: false
  },
  {
    id: 'alt_2',
    severity: 'warning',
    title: 'Suresh Vaja has not started',
    detail: 'Scheduled 07:30. 12 min late',
    timeAgo: '12 min ago',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    driverPhone: '+91 98xxxx43',
    acknowledged: false
  },
  {
    id: 'alt_3',
    severity: 'warning',
    title: 'Licence expires in 21 days',
    detail: 'Dilip Rana, GJ17 2019 0045123',
    timeAgo: 'Today',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    driverPhone: '+91 98xxxx44',
    acknowledged: false
  },
  {
    id: 'alt_4',
    severity: 'critical',
    title: 'Complaint past 48 h',
    detail: 'PMH-...0341, Ward 7, now level 2',
    timeAgo: '1 h ago',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    complaintId: 'comp_0341',
    acknowledged: false
  },
  {
    id: 'alt_5',
    severity: 'info',
    title: 'Van left its area',
    detail: 'GJ-17-AB-1301 outside Ward 5 for 6 min',
    timeAgo: '2 h ago',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    driverPhone: '+91 98xxxx43',
    vanId: 'van_2',
    acknowledged: true
  },
  {
    id: 'alt_6',
    severity: 'warning',
    title: '3 missed-collection reports',
    detail: 'Ward 6 today. Inspector notified',
    timeAgo: '3 h ago',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    wardId: 'ward_6',
    acknowledged: true
  },
  {
    id: 'alt_7',
    severity: 'info',
    title: 'Insurance expires in 30 days',
    detail: 'GJ-17-AB-1301',
    timeAgo: 'Yesterday',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    vanId: 'van_2',
    acknowledged: true
  }
];

export const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_1',
    time: '09:42',
    user: { name: 'Meena Parmar', role: 'inspector', initials: 'MP' },
    role: 'inspector',
    action: 'Enrolled driver',
    target: 'GDH-D-0048',
    device: 'Chrome, Godhra'
  },
  {
    id: 'aud_2',
    time: '09:30',
    user: { name: 'System', role: 'inspector', initials: 'SY' },
    role: 'inspector',
    action: 'Escalated complaint',
    target: 'PMH-...0341',
    device: 'Automatic'
  },
  {
    id: 'aud_3',
    time: '09:12',
    user: { name: 'Rakesh Shah', role: 'chief_officer', initials: 'RS' },
    role: 'chief_officer',
    action: 'Created ward',
    target: 'Ward 9 (9 points)',
    device: 'Chrome, Godhra'
  },
  {
    id: 'aud_4',
    time: '08:50',
    user: { name: 'Meena Parmar', role: 'inspector', initials: 'MP' },
    role: 'inspector',
    action: 'Allotted driver',
    target: 'Ramesh Bhai to Ward 5',
    device: 'Chrome, Godhra'
  },
  {
    id: 'aud_5',
    time: '08:31',
    user: { name: 'Rakesh Shah', role: 'chief_officer', initials: 'RS' },
    role: 'chief_officer',
    action: 'Registered van',
    target: 'GJ-17-EF-3001',
    device: 'Chrome, Godhra'
  },
  {
    id: 'aud_6',
    time: '08:05',
    user: { name: 'Dr. A. Patel', role: 'ddo', initials: 'AP' },
    role: 'ddo',
    action: 'Changed escalation time',
    target: 'Level 2: 48 h',
    device: 'Firefox, Godhra'
  },
  {
    id: 'aud_7',
    time: 'Yesterday',
    user: { name: 'Meena Parmar', role: 'inspector', initials: 'MP' },
    role: 'inspector',
    action: 'Reset PIN',
    target: 'Suresh Vaja',
    device: 'Chrome, Godhra'
  }
];

export const SEED_SETTINGS: SettingsConfig = {
  escalationL1Hours: 24,
  escalationL2Hours: 48,
  resolveTargetHours: 72,
  categories: {
    garbageDump: { targetHours: 48, notifyInspector: true },
    openGutter: { targetHours: 72, notifyInspector: true },
    missedCollection: { targetHours: 24, notifyInspector: true },
    other: { targetHours: 72, notifyInspector: true },
  },
  alerts: {
    vanOffline10m: true,
    lateStart15m: true,
    vanLeavesArea: true,
    docExpiring30d: true,
    threeMissedReports: false,
  }
};

export const SEED_TRIPS: Trip[] = [
  {
    id: 'trip_ramesh_today',
    vanId: 'van_1',
    routeId: 'route_east',
    driverId: 'drv_ramesh',
    driverName: 'Ramesh Bhai',
    date: '2026-10-31',
    startedAt: '07:28',
    wardsDone: [
      { wardId: 'ward_4', doneAt: '08:15' },
      { wardId: 'ward_5', doneAt: '09:00' },
      { wardId: 'ward_6', doneAt: '09:40', flagged: true }
    ],
    alertedWardIds: ['ward_4', 'ward_5', 'ward_6'],
    distanceKm: 42,
    duration: '5 h 12 min',
    stopsCount: 11,
    flaggedCount: 1,
    flaggedReason: 'Ward 6 marked done 220 m outside the boundary',
    gpsTrail: [
      { lat: 22.7750, lng: 73.6050, t: '07:30' },
      { lat: 22.7758, lng: 73.6090, t: '07:45', isStop: true, stopDurationMin: 6 },
      { lat: 22.7780, lng: 73.6120, t: '08:10' },
      { lat: 22.7810, lng: 73.6160, t: '08:40', isStop: true, stopDurationMin: 12 },
      { lat: 22.7830, lng: 73.6210, t: '09:15', isFlagged: true, flagReason: 'Ward 6 marked done 220 m outside boundary' },
      { lat: 22.7790, lng: 73.6240, t: '10:00', isStop: true, stopDurationMin: 8 },
      { lat: 22.7740, lng: 73.6210, t: '11:15' },
      { lat: 22.7710, lng: 73.6160, t: '12:00', isStop: true, stopDurationMin: 15 },
      { lat: 22.7680, lng: 73.6140, t: '12:42' }
    ]
  }
];

export const SEED_NOTICES: Notice[] = [
  {
    id: 'not_1',
    title: 'Route change tomorrow',
    targetType: 'all',
    message: 'Ward 7 is added to the East route from Monday. Please start with Ward 5 as usual.',
    createdAt: 'Yesterday, 14:00',
    createdBy: 'R. Shah',
    when: 'Send now',
    language: 'Gujarati and English',
    deliveredCount: 5,
    totalTarget: 5
  },
  {
    id: 'not_2',
    title: 'Holiday on Diwali',
    targetType: 'all',
    message: 'No collection on 12 Nov due to Diwali festival holiday.',
    createdAt: '2 days ago',
    createdBy: 'R. Shah',
    when: 'Send now',
    language: 'Gujarati and English',
    deliveredCount: 6,
    totalTarget: 6
  },
  {
    id: 'not_3',
    title: 'Extra pickup near the market',
    targetType: 'ward',
    wardIds: ['ward_5'],
    message: 'Extra pickup near Godhra market before 11:00 today.',
    createdAt: 'Today, 06:30',
    createdBy: 'Meena Parmar',
    when: 'Send now',
    language: 'Gujarati and English',
    deliveredCount: 4,
    totalTarget: 5
  },
  {
    id: 'not_4',
    title: 'Please start shift on time',
    targetType: 'all',
    message: 'Late starts will be reported automatically to district officers.',
    createdAt: '3 days ago',
    createdBy: 'Dr. A. Patel',
    when: 'Send now',
    language: 'English',
    deliveredCount: 5,
    totalTarget: 5
  }
];

export const SEED_RATINGS: Rating[] = [
  { id: 'rat_1', wardId: 'ward_5', date: '2026-10-30', stars: 5, deviceId: 'dev_4f2a' },
  { id: 'rat_2', wardId: 'ward_4', date: '2026-10-30', stars: 4, deviceId: 'dev_81ca' },
  { id: 'rat_3', wardId: 'ward_6', date: '2026-10-29', stars: 4, deviceId: 'dev_3b1a' },
  { id: 'rat_4', wardId: 'ward_7', date: '2026-10-29', stars: 3, deviceId: 'dev_77bc' }
];

export const SEED_REPORTS = [
  { id: 'rep_1', name: 'Daily collection', range: '28 Oct', format: 'PDF', createdBy: 'M. Parmar' },
  { id: 'rep_2', name: 'Complaint resolution', range: '1 to 28 Oct', format: 'CSV', createdBy: 'R. Shah' },
  { id: 'rep_3', name: 'Driver performance', range: 'Week 43', format: 'PDF', createdBy: 'R. Shah' },
  { id: 'rep_4', name: 'Contractor scorecard', range: 'Sep 2026', format: 'PDF', createdBy: 'Dr. A. Patel' }
];
