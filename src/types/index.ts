// Safai Sathi Admin Panel - Core Data Types & Enums
// Based on Shared Contract PRD-3 & Wireframe Specification

export type WardType = 'urban' | 'rural';
export type VanStatus = 'idle' | 'on_shift' | 'offline';
export type ComplaintCategory = 'garbage_dump' | 'open_gutter' | 'missed_collection' | 'other';
export type ComplaintStatus = 'received' | 'assigned' | 'resolved' | 'escalated';
export type EscalationLevel = 0 | 1 | 2; // 0 (inspector), 1 (chief officer / TDO), 2 (DDO)
export type NoticeTargetType = 'van' | 'ward' | 'all' | 'citizens';
export type StaffRole = 'inspector' | 'chief_officer' | 'tdo' | 'ddo';

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Ward {
  id: string;
  name: string;
  nameGu: string;
  code: string;
  type: WardType;
  center: GeoLocation;
  radiusM: number;
  routeId: string;
  inspectorId: string;
  escalationTo: string; // staffId
  areaKm2: number;
  pointsCount: number;
  polygon?: [number, number][]; // vertices [lat, lng]
  createdDate?: string;
  createdBy?: string;
  history?: { date: string; action: string; user?: string }[];
}

export interface VanLocation extends GeoLocation {
  updatedAt: string;
  speedKmph: number;
}

export interface Van {
  id: string;
  plateNo: string;
  routeId: string;
  status: VanStatus;
  lastLocation: VanLocation;
  currentTripId?: string;
  batteryPct: number;
  // Extended fleet specifications from Wireframe A08
  type?: string; // 'Tata Ace' | 'Mahindra Jeeto'
  capacity?: string; // '750 kg'
  driverId?: string;
  driverName?: string;
  insuranceExpiry?: string;
  pucExpiry?: string;
}

export interface Driver {
  id: string;
  driverId: string; // GDH-D-0042
  name: string;
  phone: string;
  dob: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  licenceNumber: string;
  licenceClass: string;
  licenceIssued: string;
  licenceValidUntil: string;
  vanId?: string;
  vanPlate?: string;
  wardIds: string[];
  shiftStart: string;
  shiftEnd: string;
  effectiveFrom?: string;
  status: 'on_shift' | 'late' | 'off_duty' | 'suspended';
  lateMinutes?: number;
  shiftProgressPct: number;
  photoUrl: string;
  joinedDate: string;
  oneTimePin?: string;
  licencePhotoUrl?: string;
  recentShifts?: {
    date: string;
    vanPlate: string;
    started: string;
    ended: string;
    wardsDone: string;
    status: 'on_time' | 'late';
    lateMinutes?: number;
  }[];
}

export interface AttendanceRecord {
  id: string;
  driverId: string;
  driverName: string;
  driverCode: string;
  vanPlate: string;
  scheduled: string;
  started: string;
  ended: string;
  wardsDone: string; // e.g. "5 of 9"
  status: 'on_time' | 'late' | 'absent' | 'off_duty';
  lateMinutes?: number;
  date: 'today' | 'yesterday' | 'week';
  tripId?: string;
}

export interface AlertItem {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  timeAgo: string;
  timestamp: string;
  driverPhone?: string;
  vanId?: string;
  wardId?: string;
  complaintId?: string;
  acknowledged: boolean;
}

export interface AuditLogEntry {
  id: string;
  time: string;
  user: {
    name: string;
    role: StaffRole;
    initials: string;
  };
  role: StaffRole;
  action: string;
  target: string;
  device: string;
}

export interface SettingsConfig {
  escalationL1Hours: number;
  escalationL2Hours: number;
  resolveTargetHours: number;
  categories: {
    garbageDump: { targetHours: number; notifyInspector: boolean };
    openGutter: { targetHours: number; notifyInspector: boolean };
    missedCollection: { targetHours: number; notifyInspector: boolean };
    other: { targetHours: number; notifyInspector: boolean };
  };
  alerts: {
    vanOffline10m: boolean;
    lateStart15m: boolean;
    vanLeavesArea: boolean;
    docExpiring30d: boolean;
    threeMissedReports: boolean;
  };
}

export interface Route {
  id: string;
  name: string;
  wardIds: string[]; // in visiting order
  scheduledStartTime: string; // "HH:mm"
  vanPlate?: string;
  totalDistanceKm?: number;
  estimatedDuration?: string;
}

export interface WardDoneItem {
  wardId: string;
  doneAt: string;
  flagged?: boolean;
}

export interface GpsTrailPoint extends GeoLocation {
  t: string;
  isStop?: boolean;
  stopDurationMin?: number;
  isFlagged?: boolean;
  flagReason?: string;
}

export interface Trip {
  id: string;
  vanId: string;
  routeId: string;
  driverId?: string;
  driverName?: string;
  date: string; // "YYYY-MM-DD"
  startedAt: string;
  endedAt?: string;
  wardsDone: WardDoneItem[];
  alertedWardIds: string[];
  gpsTrail: GpsTrailPoint[];
  mockLocationDetected?: boolean;
  distanceKm?: number;
  duration?: string;
  stopsCount?: number;
  flaggedCount?: number;
  flaggedReason?: string;
}

export interface Complaint {
  id: string;
  ticketId: string; // PMH-YYYYMMDD-NNNN
  deviceId: string;
  category: ComplaintCategory;
  photoUrl: string;
  location: GeoLocation;
  wardId: string;
  createdAt: string;
  status: ComplaintStatus;
  assignedTo?: string; // staffId
  assignedToName?: string;
  escalationLevel: EscalationLevel;
  resolvedPhotoUrl?: string;
  resolvedAt?: string;
  mergedInto?: string;
  note?: string;
  citizenDeviceId?: string;
  timeline?: {
    receivedAt: string;
    assignedAt?: string;
    escalatedAt?: string;
    resolvedAt?: string;
  };
}

export interface Rating {
  id: string;
  wardId: string;
  date: string;
  stars: number;
  deviceId: string;
}

export interface Notice {
  id: string;
  title?: string;
  targetType: NoticeTargetType;
  targetId?: string;
  wardIds?: string[];
  message: string;
  createdAt: string;
  createdBy: string;
  when?: string;
  language?: string;
  photoUrl?: string;
  deliveredCount?: number;
  totalTarget?: number;
}

export interface Staff {
  id: string;
  authUid: string;
  name: string;
  role: StaffRole;
  wardIds: string[];
  talukaId?: string;
  phone: string;
  email?: string;
  jurisdiction?: string;
  lastActive?: string;
  active?: boolean;
}
