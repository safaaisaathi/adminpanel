// Contract from PRD 3 of 3 (Shared Contract 0.1, 0.2, 0.3)
// DO NOT ADD, RENAME OR REMOVE FIELDS OR ENUMS WITHOUT ASKING.

export type WardType = 'urban' | 'rural';
export type VanStatus = 'idle' | 'on_shift' | 'offline';
export type ComplaintCategory = 'garbage_dump' | 'open_gutter' | 'missed_collection' | 'other';
export type ComplaintStatus = 'received' | 'assigned' | 'resolved' | 'escalated';
export type EscalationLevel = 0 | 1 | 2; // 0 (inspector), 1 (chief officer / TDO), 2 (DDO)
export type NoticeTargetType = 'van' | 'ward' | 'all';
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
}

export interface VanLocation extends GeoLocation {
  updatedAt: string; // ISO timestamp or Firestore Timestamp
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
}

export interface VanSecret {
  id: string; // same as vanId
  driverPinHash: string;
}

export interface Route {
  id: string;
  name: string;
  wardIds: string[]; // in visiting order
  scheduledStartTime: string; // "HH:mm"
}

export interface WardDoneItem {
  wardId: string;
  doneAt: string;
  flagged?: boolean;
}

export interface GpsTrailPoint extends GeoLocation {
  t: string;
}

export interface Trip {
  id: string;
  vanId: string;
  routeId: string;
  date: string; // "YYYY-MM-DD"
  startedAt: string;
  endedAt?: string;
  wardsDone: WardDoneItem[];
  alertedWardIds: string[];
  gpsTrail: GpsTrailPoint[];
  mockLocationDetected?: boolean;
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
  escalationLevel: EscalationLevel;
  resolvedPhotoUrl?: string;
  resolvedAt?: string;
  mergedInto?: string;
  note?: string;
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
  targetType: NoticeTargetType;
  targetId?: string; // vanId or wardId, or undefined for 'all'
  message: string;
  createdAt: string;
  createdBy: string;
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
}
