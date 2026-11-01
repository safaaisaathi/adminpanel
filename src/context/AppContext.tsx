import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { dataService } from '../services/dataService';
import { en } from '../locales/en';
import { gu } from '../locales/gu';

type Language = 'en' | 'gu';
type ThemeMode = 'light' | 'dark';

interface AppContextType {
  // Locale & Theme
  lang: Language;
  t: typeof en;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  toggleTheme: () => void;

  // Current Staff User
  currentUser: Staff | null;
  setCurrentUser: (staff: Staff | null) => void;
  switchRole: (role: Staff['role']) => void;
  availableStaff: Staff[];
  isInScope: (wardId: string) => boolean;

  // Data Collections
  wards: Ward[];
  drivers: Driver[];
  vans: Van[];
  routes: Route[];
  complaints: Complaint[];
  attendance: AttendanceRecord[];
  alerts: AlertItem[];
  auditLogs: AuditLogEntry[];
  settings: SettingsConfig;
  trips: Trip[];
  ratings: Rating[];
  notices: Notice[];
  reports: any[];

  // Filtered by Scope
  scopedWards: Ward[];
  scopedDrivers: Driver[];
  scopedVans: Van[];
  scopedComplaints: Complaint[];
  unacknowledgedAlertsCount: number;

  // Live Simulation
  isSimulating: boolean;
  toggleSimulation: () => void;

  // Operations
  enrollDriver: (driverData: any) => Driver;
  resetDriverPin: (driverId: string) => string;
  toggleDriverSuspension: (driverId: string) => boolean;
  saveAllotments: (allotmentMap: Record<string, { driverIds: string[]; vanId?: string }>) => void;
  createWard: (wardData: Partial<Ward>) => Ward;
  updateWard: (wardId: string, updates: Partial<Ward>) => Ward | null;
  deleteWard: (wardId: string) => { success: boolean; reasons?: string[] };
  registerVan: (vanData: Partial<Van>) => Van;
  saveRoute: (routeId: string, wardIds: string[], startTime: string, vanPlate?: string) => void;
  assignComplaint: (complaintId: string, staffId: string) => void;
  resolveComplaint: (complaintId: string, resolvedPhotoUrl: string, note?: string) => void;
  escalateComplaint: (complaintId: string, reason: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  updateSettings: (newSettings: SettingsConfig) => void;
  sendNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  addStaff: (staff: Omit<Staff, 'id'>) => Staff;
  toggleStaffActive: (staffId: string) => void;
  logAction: (action: string, target: string, role?: Staff['role'], user?: string) => void;
  addVan: (van: any) => void;
  addRoute: (route: any) => void;
  setDriverPin: (vanId: string, pin: string) => boolean;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Locale
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('safai_lang') as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('safai_lang', newLang);
  };

  const t = lang === 'gu' ? gu : en;

  // Theme
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('safai_theme') as ThemeMode) || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('safai_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Data State
  const [wards, setWards] = useState<Ward[]>(dataService.getWards());
  const [drivers, setDrivers] = useState<Driver[]>(dataService.getDrivers());
  const [vans, setVans] = useState<Van[]>(dataService.getVans());
  const [routes, setRoutes] = useState<Route[]>(dataService.getRoutes());
  const [staff, setStaff] = useState<Staff[]>(dataService.getStaff());
  const [complaints, setComplaints] = useState<Complaint[]>(dataService.getComplaints());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(dataService.getAttendance());
  const [alerts, setAlerts] = useState<AlertItem[]>(dataService.getAlerts());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(dataService.getAuditLogs());
  const [settings, setSettings] = useState<SettingsConfig>(dataService.getSettings());
  const [trips, setTrips] = useState<Trip[]>(dataService.getTrips());
  const [ratings, setRatings] = useState<Rating[]>(dataService.getRatings());
  const [notices, setNotices] = useState<Notice[]>(dataService.getNotices());
  const [reports, setReports] = useState(dataService.getReports());

  // Current Staff User: Default to DDO or first staff
  const [currentUser, setCurrentUser] = useState<Staff | null>(() => {
    const all = dataService.getStaff();
    return all.find((s) => s.role === 'ddo') || all[0] || null;
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Subscribe to service updates
  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setWards(dataService.getWards());
      setDrivers(dataService.getDrivers());
      setVans(dataService.getVans());
      setRoutes(dataService.getRoutes());
      setStaff(dataService.getStaff());
      setComplaints(dataService.getComplaints());
      setAttendance(dataService.getAttendance());
      setAlerts(dataService.getAlerts());
      setAuditLogs(dataService.getAuditLogs());
      setSettings(dataService.getSettings());
      setTrips(dataService.getTrips());
      setRatings(dataService.getRatings());
      setNotices(dataService.getNotices());
      setReports(dataService.getReports());
      setIsSimulating(dataService.isSimulating());
    });
    return () => {
      unsub();
    };
  }, []);

  const switchRole = (role: Staff['role']) => {
    const target = staff.find((s) => s.role === role);
    if (target) {
      setCurrentUser(target);
    }
  };

  const toggleSimulation = () => {
    if (dataService.isSimulating()) {
      dataService.stopSimulation();
      setIsSimulating(false);
    } else {
      dataService.startSimulation();
      setIsSimulating(true);
    }
  };

  // Scope filter: Wireframe Section 2 Global Behaviours
  const isInScope = (wardId: string): boolean => {
    if (!currentUser) return true;
    if (currentUser.role === 'ddo') return true;

    const targetWard = wards.find((w) => w.id === wardId);
    if (!targetWard) return false;

    if (currentUser.role === 'inspector') {
      return currentUser.wardIds.includes(wardId);
    }
    if (currentUser.role === 'chief_officer') {
      return targetWard.type === 'urban';
    }
    if (currentUser.role === 'tdo') {
      return targetWard.type === 'rural';
    }
    return false;
  };

  // Filtered views by user scope
  const scopedWards = wards.filter((w) => isInScope(w.id));
  const scopedWardIds = new Set(scopedWards.map((w) => w.id));

  const scopedComplaints = complaints.filter((c) => scopedWardIds.has(c.wardId));

  const scopedDrivers = drivers.filter((d) => {
    if (!currentUser || currentUser.role === 'ddo' || currentUser.role === 'chief_officer') return true;
    if (d.wardIds.length === 0) return true; // Unassigned drivers are visible for allotment
    return d.wardIds.some((wid) => scopedWardIds.has(wid));
  });

  const scopedRoutes = routes.filter((r) => r.wardIds.some((wid) => scopedWardIds.has(wid)));
  const scopedRouteIds = new Set(scopedRoutes.map((r) => r.id));
  const scopedVans = vans.filter((v) => scopedRouteIds.has(v.routeId) || !v.routeId);

  const unacknowledgedAlertsCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <AppContext.Provider
      value={{
        lang,
        t,
        setLang,
        theme,
        toggleTheme,
        currentUser,
        setCurrentUser,
        switchRole,
        availableStaff: staff,
        isInScope,
        wards,
        drivers,
        vans,
        routes,
        complaints,
        attendance,
        alerts,
        auditLogs,
        settings,
        trips,
        ratings,
        notices,
        reports,
        scopedWards,
        scopedDrivers,
        scopedVans,
        scopedComplaints,
        unacknowledgedAlertsCount,
        isSimulating,
        toggleSimulation,
        enrollDriver: (d) => dataService.enrollDriver(d),
        resetDriverPin: (dId) => dataService.resetDriverPin(dId),
        toggleDriverSuspension: (dId) => dataService.toggleDriverSuspension(dId),
        saveAllotments: (map) => dataService.saveAllotments(map),
        createWard: (w) => dataService.createWard(w),
        updateWard: (id, w) => dataService.updateWard(id, w),
        deleteWard: (id) => dataService.deleteWard(id),
        registerVan: (v) => dataService.registerVan(v),
        saveRoute: (rId, wIds, st, vp) => dataService.saveRoute(rId, wIds, st, vp),
        assignComplaint: (cId, sId) => dataService.assignComplaint(cId, sId),
        resolveComplaint: (cId, photo, note) => dataService.resolveComplaint(cId, photo, note),
        escalateComplaint: (cId, reason) => dataService.escalateComplaint(cId, reason),
        acknowledgeAlert: (aId) => dataService.acknowledgeAlert(aId),
        updateSettings: (s) => dataService.updateSettings(s),
        sendNotice: (n) => dataService.sendNotice(n),
        addStaff: (s) => dataService.addStaff(s),
        toggleStaffActive: (sId) => dataService.toggleStaffActive(sId),
        logAction: (action, target, role, user) => dataService.logAction(action, target, role, user),
        addVan: (v) => dataService.registerVan(v),
        addRoute: (r) => dataService.saveRoute('route_new', r.wardIds || [], r.scheduledStartTime || '07:30 AM', r.vanPlate),
        setDriverPin: (vanId, pin) => { dataService.resetDriverPin(vanId); return true; },
        resetAllData: () => dataService.resetToDefault(),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
