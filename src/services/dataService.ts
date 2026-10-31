import { Ward, Van, Route, Trip, Complaint, Rating, Notice, Staff } from '../types';
import {
  SEED_WARDS,
  SEED_ROUTES,
  SEED_VANS,
  SEED_STAFF,
  SEED_COMPLAINTS,
  SEED_TRIPS,
  SEED_RATINGS,
  SEED_NOTICES
} from './seedData';
import { ESCALATION_L1_HOURS, ESCALATION_L2_HOURS } from '../constants';

const STORAGE_KEY_PREFIX = 'safai_sathi_';

function getStoredOr<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function getInitialComplaints(): Complaint[] {
  try {
    const ver = localStorage.getItem(STORAGE_KEY_PREFIX + 'seed_ver');
    if (ver !== '2.2_hd_photos') {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'seed_ver', '2.2_hd_photos');
      const existing = localStorage.getItem(STORAGE_KEY_PREFIX + 'complaints');
      if (existing) {
        const parsed: Complaint[] = JSON.parse(existing);
        const updated = parsed.map((c) => {
          const seedMatch = SEED_COMPLAINTS.find((s) => s.id === c.id);
          if (seedMatch) {
            return {
              ...c,
              photoUrl: seedMatch.photoUrl,
              resolvedPhotoUrl: seedMatch.resolvedPhotoUrl || c.resolvedPhotoUrl,
            };
          }
          return c;
        });
        localStorage.setItem(STORAGE_KEY_PREFIX + 'complaints', JSON.stringify(updated));
        return updated;
      }
      localStorage.setItem(STORAGE_KEY_PREFIX + 'complaints', JSON.stringify(SEED_COMPLAINTS));
      return SEED_COMPLAINTS;
    }
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + 'complaints');
    return raw ? JSON.parse(raw) : SEED_COMPLAINTS;
  } catch (e) {
    return SEED_COMPLAINTS;
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
  private routes: Route[] = getStoredOr('routes', SEED_ROUTES);
  private vans: Van[] = getStoredOr('vans', SEED_VANS);
  private staff: Staff[] = getStoredOr('staff', SEED_STAFF);
  private complaints: Complaint[] = getInitialComplaints();
  private trips: Trip[] = getStoredOr('trips', SEED_TRIPS);
  private ratings: Rating[] = getStoredOr('ratings', SEED_RATINGS);
  private notices: Notice[] = getStoredOr('notices', SEED_NOTICES);

  private listeners: Set<() => void> = new Set();
  private simulationInterval: any = null;

  constructor() {
    this.checkAndEscalateComplaints();
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
  public getRoutes(): Route[] { return [...this.routes]; }
  public getVans(): Van[] { return [...this.vans]; }
  public getStaff(): Staff[] { return [...this.staff]; }
  public getComplaints(): Complaint[] { return [...this.complaints]; }
  public getTrips(): Trip[] { return [...this.trips]; }
  public getRatings(): Rating[] { return [...this.ratings]; }
  public getNotices(): Notice[] { return [...this.notices]; }

  // Complaints operations
  public assignComplaint(complaintId: string, staffId: string) {
    this.complaints = this.complaints.map((c) => {
      if (c.id === complaintId) {
        return {
          ...c,
          assignedTo: staffId,
          status: 'assigned',
        };
      }
      return c;
    });
    setStored('complaints', this.complaints);
    this.notify();
  }

  public resolveComplaint(complaintId: string, resolvedPhotoUrl: string, note?: string) {
    this.complaints = this.complaints.map((c) => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'resolved',
          resolvedPhotoUrl,
          resolvedAt: new Date().toISOString(),
          note: note ? (c.note ? `${c.note} | Resolve Note: ${note}` : note) : c.note,
        };
      }
      return c;
    });
    setStored('complaints', this.complaints);
    this.notify();
  }

  public addComplaint(complaintData: Omit<Complaint, 'id' | 'ticketId' | 'createdAt' | 'status' | 'escalationLevel'>) {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `PMH-${todayStr}-${randNum}`;

    const newComplaint: Complaint = {
      ...complaintData,
      id: 'comp_' + Date.now(),
      ticketId,
      createdAt: new Date().toISOString(),
      status: 'received',
      escalationLevel: 0,
    };

    this.complaints = [newComplaint, ...this.complaints];
    setStored('complaints', this.complaints);
    this.notify();
    return newComplaint;
  }

  public checkAndEscalateComplaints() {
    const now = Date.now();
    let changed = false;

    this.complaints = this.complaints.map((c) => {
      if (c.status === 'resolved') return c;

      const createdTime = new Date(c.createdAt).getTime();
      const hoursAge = (now - createdTime) / (1000 * 60 * 60);

      if (hoursAge >= ESCALATION_L2_HOURS && c.escalationLevel < 2) {
        changed = true;
        return { ...c, status: 'escalated', escalationLevel: 2 };
      } else if (hoursAge >= ESCALATION_L1_HOURS && c.escalationLevel < 1) {
        changed = true;
        return { ...c, status: 'escalated', escalationLevel: 1 };
      }
      return c;
    });

    if (changed) {
      setStored('complaints', this.complaints);
      this.notify();
    }
  }

  // Notices operations
  public sendNotice(notice: Omit<Notice, 'id' | 'createdAt'>) {
    const newNotice: Notice = {
      ...notice,
      id: 'not_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.notices = [newNotice, ...this.notices];
    setStored('notices', this.notices);
    this.notify();
    return newNotice;
  }

  // Vans and Routes operations
  public addVan(vanData: Omit<Van, 'id' | 'lastLocation'>) {
    const newVan: Van = {
      ...vanData,
      id: 'van_' + Date.now(),
      lastLocation: {
        lat: 22.7758,
        lng: 73.6149,
        updatedAt: new Date().toISOString(),
        speedKmph: 0,
      },
    };
    this.vans = [...this.vans, newVan];
    setStored('vans', this.vans);
    this.notify();
    return newVan;
  }

  public updateVanStatus(vanId: string, status: Van['status']) {
    this.vans = this.vans.map((v) => (v.id === vanId ? { ...v, status } : v));
    setStored('vans', this.vans);
    this.notify();
  }

  public setDriverPin(vanId: string, pin: string) {
    // In actual Cloud Functions, writes hashed pin to vanSecrets
    console.log(`[Cloud Functions Call: setDriverPin] Hashing and saving PIN for ${vanId}`);
    return true;
  }

  public addRoute(routeData: Omit<Route, 'id'>) {
    const newRoute: Route = {
      ...routeData,
      id: 'route_' + Date.now(),
    };
    this.routes = [...this.routes, newRoute];
    setStored('routes', this.routes);
    this.notify();
    return newRoute;
  }

  public addStaff(staffData: Omit<Staff, 'id'>) {
    const newStaff: Staff = {
      ...staffData,
      id: 'staff_' + Date.now(),
    };
    this.staff = [...this.staff, newStaff];
    setStored('staff', this.staff);
    this.notify();
    return newStaff;
  }

  // GPS Simulation for Live Map Demo
  public startSimulation() {
    if (this.simulationInterval) return;

    this.simulationInterval = setInterval(() => {
      this.vans = this.vans.map((van) => {
        if (van.status !== 'on_shift') return van;

        // Small realistic movement delta
        const deltaLat = (Math.random() - 0.48) * 0.0006;
        const deltaLng = (Math.random() - 0.48) * 0.0006;
        const newLat = van.lastLocation.lat + deltaLat;
        const newLng = van.lastLocation.lng + deltaLng;
        const newSpeed = +(12 + Math.random() * 8).toFixed(1);

        return {
          ...van,
          lastLocation: {
            lat: newLat,
            lng: newLng,
            updatedAt: new Date().toISOString(),
            speedKmph: newSpeed,
          },
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
    this.routes = SEED_ROUTES;
    this.vans = SEED_VANS;
    this.staff = SEED_STAFF;
    this.complaints = SEED_COMPLAINTS;
    this.trips = SEED_TRIPS;
    this.ratings = SEED_RATINGS;
    this.notices = SEED_NOTICES;
    this.notify();
  }
}

export const dataService = new DataService();
