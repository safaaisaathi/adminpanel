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
import {
  SEED_WARDS,
  SEED_DRIVERS,
  SEED_VANS,
  SEED_STAFF,
  SEED_COMPLAINTS,
  SEED_ATTENDANCE,
  SEED_ALERTS,
  SEED_AUDIT_LOGS,
  SEED_SETTINGS,
  SEED_ROUTES,
  SEED_TRIPS,
  SEED_RATINGS,
  SEED_NOTICES,
  SEED_REPORTS
} from './seedData';

const STORAGE_KEY_PREFIX = 'safai_v3_';

function getStoredOr<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

class DataService {
  private wards: Ward[] = getStoredOr('wards', SEED_WARDS);
  private drivers: Driver[] = getStoredOr('drivers', SEED_DRIVERS);
  private vans: Van[] = getStoredOr('vans', SEED_VANS);
  private routes: Route[] = getStoredOr('routes', SEED_ROUTES);
  private staff: Staff[] = getStoredOr('staff', SEED_STAFF);
  private complaints: Complaint[] = getStoredOr('complaints', SEED_COMPLAINTS);
  private attendance: AttendanceRecord[] = getStoredOr('attendance', SEED_ATTENDANCE);
  private alerts: AlertItem[] = getStoredOr('alerts', SEED_ALERTS);
  private auditLogs: AuditLogEntry[] = getStoredOr('auditLogs', SEED_AUDIT_LOGS);
  private settings: SettingsConfig = getStoredOr('settings', SEED_SETTINGS);
  private trips: Trip[] = getStoredOr('trips', SEED_TRIPS);
  private ratings: Rating[] = getStoredOr('ratings', SEED_RATINGS);
  private notices: Notice[] = getStoredOr('notices', SEED_NOTICES);
  private reports = getStoredOr('reports', SEED_REPORTS);

  private listeners: Set<() => void> = new Set();
  private simulationInterval: any = null;

  constructor() {
    if (this.complaints.length < 15) {
      this.complaints = SEED_COMPLAINTS;
      setStored('complaints', SEED_COMPLAINTS);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Getters
  public getWards(): Ward[] { return [...this.wards]; }
  public getDrivers(): Driver[] { return [...this.drivers]; }
  public getVans(): Van[] { return [...this.vans]; }
  public getRoutes(): Route[] { return [...this.routes]; }
  public getStaff(): Staff[] { return [...this.staff]; }
  public getComplaints(): Complaint[] { return [...this.complaints]; }
  public getAttendance(): AttendanceRecord[] { return [...this.attendance]; }
  public getAlerts(): AlertItem[] { return [...this.alerts]; }
  public getAuditLogs(): AuditLogEntry[] { return [...this.auditLogs]; }
  public getSettings(): SettingsConfig { return { ...this.settings }; }
  public getTrips(): Trip[] { return [...this.trips]; }
  public getRatings(): Rating[] { return [...this.ratings]; }
  public getNotices(): Notice[] { return [...this.notices]; }
  public getReports() { return [...this.reports]; }

  // Logging
  public logAction(action: string, target: string, role: Staff['role'] = 'inspector', user = 'Meena Parmar') {
    const initials = user.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';
    const newLog: AuditLogEntry = {
      id: 'aud_' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: { name: user, role, initials },
      role,
      action,
      target,
      device: 'Chrome, Godhra'
    };
    this.auditLogs = [newLog, ...this.auditLogs];
    setStored('auditLogs', this.auditLogs);
    this.notify();
  }

  // Driver Operations
  public enrollDriver(driverData: Omit<Driver, 'id' | 'driverId' | 'status' | 'shiftProgressPct' | 'joinedDate'> & { driverId?: string }) {
    const nextNum = Math.max(1, 48 + this.drivers.length - 6);
    const driverId = driverData.driverId || `GJ-${String(nextNum).padStart(4, '0')}`;
    const oneTimePin = `${Math.floor(1000 + Math.random() * 9000)}`;

    const newDriver: Driver = {
      ...driverData,
      id: 'drv_' + Date.now(),
      driverId,
      status: 'off_duty',
      shiftProgressPct: 0,
      joinedDate: 'Today',
      oneTimePin,
      recentShifts: []
    };

    this.drivers = [newDriver, ...this.drivers];
    setStored('drivers', this.drivers);

    // If van assigned, update fleet van
    if (newDriver.vanId) {
      this.vans = this.vans.map(v => v.id === newDriver.vanId ? { ...v, driverId: newDriver.id, driverName: newDriver.name } : v);
      setStored('vans', this.vans);
    }

    this.logAction('Enrolled driver', driverId, 'inspector');
    this.notify();
    return newDriver;
  }

  public resetDriverPin(driverId: string): string {
    const newPin = `${Math.floor(1000 + Math.random() * 9000)}`;
    let driverName = '';
    this.drivers = this.drivers.map(d => {
      if (d.id === driverId || d.driverId === driverId) {
        driverName = d.name;
        return { ...d, oneTimePin: newPin };
      }
      return d;
    });
    setStored('drivers', this.drivers);
    this.logAction('Reset PIN', driverName || driverId, 'inspector');
    this.notify();
    return newPin;
  }

  public toggleDriverSuspension(driverId: string): boolean {
    let nowSuspended = false;
    let driverName = '';
    this.drivers = this.drivers.map(d => {
      if (d.id === driverId || d.driverId === driverId) {
        nowSuspended = d.status !== 'suspended';
        driverName = d.name;
        return {
          ...d,
          status: nowSuspended ? 'suspended' : 'off_duty'
        };
      }
      return d;
    });
    setStored('drivers', this.drivers);
    this.logAction(nowSuspended ? 'Suspended driver' : 'Reinstated driver', driverName, 'inspector');
    this.notify();
    return nowSuspended;
  }

  // Allotment
  public saveAllotments(allotmentMap: Record<string, { driverIds: string[]; vanId?: string }>) {
    // Update each ward's drivers & vans
    this.drivers = this.drivers.map(d => {
      // Find which wards this driver is in
      const assignedWards = Object.keys(allotmentMap).filter(wId => allotmentMap[wId].driverIds.includes(d.id));
      const vanId = assignedWards.length > 0 ? allotmentMap[assignedWards[0]]?.vanId : d.vanId;
      const van = this.vans.find(v => v.id === vanId);

      return {
        ...d,
        wardIds: assignedWards,
        vanId,
        vanPlate: van?.plateNo || d.vanPlate
      };
    });
    setStored('drivers', this.drivers);
    this.logAction('Saved driver allotments', 'Godhra Wards', 'inspector');
    this.notify();
  }

  // Ward Operations
  public createWard(wardData: Partial<Ward>): Ward {
    const nextCode = `GDH-W-00${this.wards.length + 4}`;
    const newWard: Ward = {
      id: 'ward_' + Date.now(),
      name: wardData.name || `Ward ${this.wards.length + 4}`,
      nameGu: wardData.nameGu || `વૉર્ડ ${this.wards.length + 4}`,
      code: wardData.code || nextCode,
      type: wardData.type || 'urban',
      center: wardData.center || { lat: 22.784, lng: 73.605 },
      radiusM: wardData.radiusM || 750,
      routeId: wardData.routeId || 'route_east',
      inspectorId: wardData.inspectorId || 'staff_inspector_meena',
      escalationTo: 'staff_co_rakesh',
      areaKm2: wardData.areaKm2 || 1.84,
      pointsCount: wardData.pointsCount || (wardData.polygon?.length || 8),
      polygon: wardData.polygon || [
        [22.789, 73.601],
        [22.791, 73.611],
        [22.785, 73.614],
        [22.780, 73.610],
        [22.779, 73.603],
        [22.784, 73.599],
        [22.789, 73.601],
      ],
      createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdBy: 'R. Shah',
      history: [{ date: 'Today', action: 'Created by R. Shah' }]
    };

    this.wards = [...this.wards, newWard];
    setStored('wards', this.wards);
    this.logAction('Created ward', `${newWard.name} (${newWard.pointsCount} points)`, 'chief_officer', 'Rakesh Shah');
    this.notify();
    return newWard;
  }

  public updateWard(wardId: string, updates: Partial<Ward>): Ward | null {
    let updatedWard: Ward | null = null;
    this.wards = this.wards.map(w => {
      if (w.id === wardId) {
        updatedWard = {
          ...w,
          ...updates,
          history: [
            ...(w.history || []),
            { date: 'Today', action: 'Boundary / Details updated' }
          ]
        };
        return updatedWard;
      }
      return w;
    });
    setStored('wards', this.wards);
    if (updatedWard) {
      this.logAction('Updated ward boundary', (updatedWard as Ward).name, 'chief_officer', 'Rakesh Shah');
    }
    this.notify();
    return updatedWard;
  }

  public deleteWard(wardId: string): { success: boolean; reasons?: string[] } {
    const targetWard = this.wards.find(w => w.id === wardId);
    if (!targetWard) return { success: false, reasons: ['Ward not found'] };

    // Edge case 3: Check blockers
    const driversInWard = this.drivers.filter(d => d.wardIds.includes(wardId));
    const openComplaints = this.complaints.filter(c => c.wardId === wardId && c.status !== 'resolved');
    const onRoute = this.routes.find(r => r.wardIds.includes(wardId));

    const reasons: string[] = [];
    if (driversInWard.length > 0) {
      reasons.push(`${driversInWard.length} drivers allotted (${driversInWard.map(d => d.name).join(', ')})`);
    }
    if (openComplaints.length > 0) {
      reasons.push(`${openComplaints.length} open complaints`);
    }
    if (onRoute) {
      reasons.push(`On the ${onRoute.name}`);
    }

    if (reasons.length > 0) {
      return { success: false, reasons };
    }

    this.wards = this.wards.filter(w => w.id !== wardId);
    setStored('wards', this.wards);
    this.logAction('Deleted ward', targetWard.name, 'chief_officer', 'Rakesh Shah');
    this.notify();
    return { success: true };
  }

  // Fleet Operations
  public registerVan(vanData: Partial<Van>): Van {
    const newVan: Van = {
      id: 'van_' + Date.now(),
      plateNo: vanData.plateNo || `GJ-17-EF-${Math.floor(1000 + Math.random() * 9000)}`,
      routeId: vanData.routeId || 'route_east',
      status: 'idle',
      lastLocation: {
        lat: 22.7758,
        lng: 73.6149,
        updatedAt: new Date().toISOString(),
        speedKmph: 0
      },
      batteryPct: 100,
      type: vanData.type || 'Tata Ace',
      capacity: vanData.capacity || '750 kg',
      driverName: 'Unassigned',
      insuranceExpiry: vanData.insuranceExpiry || 'Mar 2028',
      pucExpiry: vanData.pucExpiry || 'Dec 2027'
    };
    this.vans = [...this.vans, newVan];
    setStored('vans', this.vans);
    this.logAction('Registered van', newVan.plateNo, 'chief_officer', 'Rakesh Shah');
    this.notify();
    return newVan;
  }

  // Route Operations
  public saveRoute(routeId: string, wardIds: string[], startTime: string, vanPlate?: string) {
    this.routes = this.routes.map(r => {
      if (r.id === routeId) {
        return {
          ...r,
          wardIds,
          scheduledStartTime: startTime,
          vanPlate: vanPlate || r.vanPlate
        };
      }
      return r;
    });
    setStored('routes', this.routes);
    this.logAction('Updated route sequence', routeId, 'chief_officer', 'Rakesh Shah');
    this.notify();
  }

  // Complaints
  public assignComplaint(complaintId: string, staffId: string) {
    const staffMember = this.staff.find(s => s.id === staffId);
    this.complaints = this.complaints.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          assignedTo: staffId,
          assignedToName: staffMember?.name || 'Assigned Officer',
          status: 'assigned',
          timeline: {
            ...c.timeline,
            receivedAt: c.timeline?.receivedAt || 'Today 08:00',
            assignedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          }
        };
      }
      return c;
    });
    setStored('complaints', this.complaints);
    this.logAction('Assigned complaint', complaintId, 'inspector');
    this.notify();
  }

  public resolveComplaint(complaintId: string, proofPhotoUrl: string, note?: string) {
    this.complaints = this.complaints.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'resolved',
          resolvedPhotoUrl: proofPhotoUrl,
          resolvedAt: new Date().toISOString(),
          note: note ? (c.note ? `${c.note} | ${note}` : note) : c.note,
          timeline: {
            ...c.timeline,
            receivedAt: c.timeline?.receivedAt || 'Yesterday 08:12',
            resolvedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          }
        };
      }
      return c;
    });
    setStored('complaints', this.complaints);
    this.logAction('Resolved complaint', complaintId, 'inspector');
    this.notify();
  }

  public escalateComplaint(complaintId: string, reason: string) {
    this.complaints = this.complaints.map(c => {
      if (c.id === complaintId) {
        const nextLevel = Math.min(2, c.escalationLevel + 1) as 0 | 1 | 2;
        return {
          ...c,
          status: 'escalated',
          escalationLevel: nextLevel,
          note: c.note ? `${c.note} | Escalation Reason: ${reason}` : `Escalation Reason: ${reason}`,
          timeline: {
            ...c.timeline,
            receivedAt: c.timeline?.receivedAt || 'Yesterday 08:12',
            escalatedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${reason})`
          }
        };
      }
      return c;
    });
    setStored('complaints', this.complaints);
    this.logAction('Escalated complaint', complaintId, 'chief_officer');
    this.notify();
  }

  // Alerts
  public acknowledgeAlert(alertId: string) {
    this.alerts = this.alerts.map(a => a.id === alertId ? { ...a, acknowledged: true } : a);
    setStored('alerts', this.alerts);
    this.notify();
  }

  // Settings
  public updateSettings(newSettings: SettingsConfig) {
    this.settings = newSettings;
    setStored('settings', this.settings);
    this.logAction('Updated SLA & Alert settings', 'District rules', 'ddo', 'Dr. A. Patel');
    this.notify();
  }

  // Notices
  public sendNotice(notice: Omit<Notice, 'id' | 'createdAt'>) {
    const newNotice: Notice = {
      ...notice,
      id: 'not_' + Date.now(),
      createdAt: 'Just now',
      deliveredCount: notice.targetType === 'all' ? 6 : 4,
      totalTarget: 6
    };
    this.notices = [newNotice, ...this.notices];
    setStored('notices', this.notices);
    this.logAction('Broadcasted notice', notice.title || 'Notice', 'chief_officer', 'Rakesh Shah');
    this.notify();
    return newNotice;
  }

  // Staff
  public addStaff(staffData: Omit<Staff, 'id'>) {
    const newStaff: Staff = {
      ...staffData,
      id: 'staff_' + Date.now(),
      lastActive: 'Invited just now',
      active: true
    };
    this.staff = [...this.staff, newStaff];
    setStored('staff', this.staff);
    this.logAction('Invited staff member', newStaff.name, 'ddo', 'Dr. A. Patel');
    this.notify();
    return newStaff;
  }

  public toggleStaffActive(staffId: string) {
    this.staff = this.staff.map(s => s.id === staffId ? { ...s, active: !s.active } : s);
    setStored('staff', this.staff);
    this.notify();
  }

  // Simulation
  public startSimulation() {
    if (this.simulationInterval) return;
    this.simulationInterval = setInterval(() => {
      this.vans = this.vans.map(van => {
        if (van.status !== 'on_shift') return van;
        const deltaLat = (Math.random() - 0.49) * 0.0007;
        const deltaLng = (Math.random() - 0.49) * 0.0007;
        return {
          ...van,
          lastLocation: {
            lat: van.lastLocation.lat + deltaLat,
            lng: van.lastLocation.lng + deltaLng,
            updatedAt: new Date().toISOString(),
            speedKmph: +(14 + Math.random() * 8).toFixed(1)
          }
        };
      });
      this.notify();
    }, 2500);
  }

  public stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  public isSimulating() {
    return this.simulationInterval !== null;
  }

  public resetToDefault() {
    this.stopSimulation();
    localStorage.clear();
    this.wards = SEED_WARDS;
    this.drivers = SEED_DRIVERS;
    this.vans = SEED_VANS;
    this.routes = SEED_ROUTES;
    this.staff = SEED_STAFF;
    this.complaints = SEED_COMPLAINTS;
    this.attendance = SEED_ATTENDANCE;
    this.alerts = SEED_ALERTS;
    this.auditLogs = SEED_AUDIT_LOGS;
    this.settings = SEED_SETTINGS;
    this.trips = SEED_TRIPS;
    this.ratings = SEED_RATINGS;
    this.notices = SEED_NOTICES;
    this.notify();
  }
}

export const dataService = new DataService();
