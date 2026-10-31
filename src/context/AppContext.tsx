import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ward, Van, Route, Trip, Complaint, Rating, Notice, Staff } from '../types';
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
  availableStaff: Staff[];
  isInScope: (wardId: string) => boolean;

  // Data Collections
  wards: Ward[];
  routes: Route[];
  vans: Van[];
  complaints: Complaint[];
  trips: Trip[];
  ratings: Rating[];
  notices: Notice[];

  // Filtered by Scope
  scopedWards: Ward[];
  scopedVans: Van[];
  scopedComplaints: Complaint[];

  // Live Simulation
  isSimulating: boolean;
  toggleSimulation: () => void;

  // Operations
  assignComplaint: (complaintId: string, staffId: string) => void;
  resolveComplaint: (complaintId: string, resolvedPhotoUrl: string, note?: string) => void;
  sendNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  addVan: (van: Omit<Van, 'id' | 'lastLocation'>) => void;
  addRoute: (route: Omit<Route, 'id'>) => void;
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
  const [routes, setRoutes] = useState<Route[]>(dataService.getRoutes());
  const [vans, setVans] = useState<Van[]>(dataService.getVans());
  const [complaints, setComplaints] = useState<Complaint[]>(dataService.getComplaints());
  const [trips, setTrips] = useState<Trip[]>(dataService.getTrips());
  const [ratings, setRatings] = useState<Rating[]>(dataService.getRatings());
  const [notices, setNotices] = useState<Notice[]>(dataService.getNotices());
  const [availableStaff, setAvailableStaff] = useState<Staff[]>(dataService.getStaff());

  // Current Staff Role
  const [currentUser, setCurrentUser] = useState<Staff | null>(() => {
    const all = dataService.getStaff();
    // Default to DDO for full visibility on first load
    return all.find((s) => s.role === 'ddo') || all[0] || null;
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Subscribe to service updates
  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setWards(dataService.getWards());
      setRoutes(dataService.getRoutes());
      setVans(dataService.getVans());
      setComplaints(dataService.getComplaints());
      setTrips(dataService.getTrips());
      setRatings(dataService.getRatings());
      setNotices(dataService.getNotices());
      setAvailableStaff(dataService.getStaff());
      setIsSimulating(dataService.isSimulating());
    });
    return () => {
      unsub();
    };
  }, []);

  const toggleSimulation = () => {
    if (dataService.isSimulating()) {
      dataService.stopSimulation();
      setIsSimulating(false);
    } else {
      dataService.startSimulation();
      setIsSimulating(true);
    }
  };

  // Scope filter: PRD Section 1 Role Access
  // inspector: sees wards in their wardIds
  // chief_officer: sees urban wards
  // tdo: sees rural wards in their taluka
  // ddo: sees everything
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

  // A van is in scope if its route contains any ward in scope
  const scopedRoutes = routes.filter((r) => r.wardIds.some((wid) => scopedWardIds.has(wid)));
  const scopedRouteIds = new Set(scopedRoutes.map((r) => r.id));
  const scopedVans = vans.filter((v) => scopedRouteIds.has(v.routeId));

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
        availableStaff,
        isInScope,
        wards,
        routes,
        vans,
        complaints,
        trips,
        ratings,
        notices,
        scopedWards,
        scopedVans,
        scopedComplaints,
        isSimulating,
        toggleSimulation,
        assignComplaint: (id, staffId) => dataService.assignComplaint(id, staffId),
        resolveComplaint: (id, photoUrl, note) => dataService.resolveComplaint(id, photoUrl, note),
        sendNotice: (notice) => dataService.sendNotice(notice),
        addVan: (van) => dataService.addVan(van),
        addRoute: (route) => dataService.addRoute(route),
        setDriverPin: (vanId, pin) => dataService.setDriverPin(vanId, pin),
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
