import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  ClipboardList,
  Building2,
  Route as RouteIcon,
  Truck,
  Users,
  Grid3X3,
  CalendarCheck,
  Radio,
  FileBarChart,
  Bell,
  LineChart,
  ShieldCheck,
  Settings,
  Users2,
  Leaf,
  X,
  ChevronRight
} from 'lucide-react';
import { StaffRole } from '../types';

export type ScreenId =
  | 'overview'
  | 'liveMap'
  | 'complaints'
  | 'wards'
  | 'routes'
  | 'fleet'
  | 'drivers'
  | 'allotment'
  | 'attendance'
  | 'notices'
  | 'reports'
  | 'alerts'
  | 'analytics'
  | 'auditLog'
  | 'settings'
  | 'staff'
  | 'login'
  | 'enrollDriver'
  | 'driverProfile'
  | 'wardEditor'
  | 'tripReplay';

interface SidebarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { currentUser, switchRole, unacknowledgedAlertsCount } = useApp();

  const userRole: StaffRole = currentUser?.role || 'ddo';

  // Section 1: Navigation per Role Specification
  const getNavItems = () => {
    if (userRole === 'ddo') {
      return [
        { id: 'overview' as ScreenId, label: 'Overview', icon: LayoutDashboard },
        { id: 'liveMap' as ScreenId, label: 'Live map', icon: MapPin },
        { id: 'complaints' as ScreenId, label: 'Complaints', icon: ClipboardList },
        { id: 'wards' as ScreenId, label: 'Wards', icon: Building2 },
        { id: 'staff' as ScreenId, label: 'Staff', icon: Users2 },
        { id: 'reports' as ScreenId, label: 'Reports', icon: FileBarChart },
        { id: 'alerts' as ScreenId, label: 'Alerts', icon: Bell, badge: unacknowledgedAlertsCount || 3 },
        { id: 'analytics' as ScreenId, label: 'Analytics', icon: LineChart },
        { id: 'auditLog' as ScreenId, label: 'Audit log', icon: ShieldCheck },
        { id: 'settings' as ScreenId, label: 'Settings', icon: Settings },
      ];
    }

    if (userRole === 'chief_officer' || userRole === 'tdo') {
      return [
        { id: 'overview' as ScreenId, label: 'Overview', icon: LayoutDashboard },
        { id: 'liveMap' as ScreenId, label: 'Live map', icon: MapPin },
        { id: 'wards' as ScreenId, label: 'Wards', icon: Building2 },
        { id: 'routes' as ScreenId, label: 'Routes', icon: RouteIcon },
        { id: 'fleet' as ScreenId, label: 'Fleet', icon: Truck },
        { id: 'complaints' as ScreenId, label: 'Complaints', icon: ClipboardList },
        { id: 'notices' as ScreenId, label: 'Notices', icon: Radio },
        { id: 'reports' as ScreenId, label: 'Reports', icon: FileBarChart },
        { id: 'alerts' as ScreenId, label: 'Alerts', icon: Bell, badge: unacknowledgedAlertsCount || 3 },
        { id: 'analytics' as ScreenId, label: 'Analytics', icon: LineChart },
      ];
    }

    // Ward Inspector (`inspector`)
    return [
      { id: 'overview' as ScreenId, label: 'Overview', icon: LayoutDashboard },
      { id: 'liveMap' as ScreenId, label: 'Live map', icon: MapPin },
      { id: 'drivers' as ScreenId, label: 'Drivers', icon: Users },
      { id: 'allotment' as ScreenId, label: 'Allotment', icon: Grid3X3 },
      { id: 'complaints' as ScreenId, label: 'Complaints', icon: ClipboardList },
      { id: 'attendance' as ScreenId, label: 'Attendance', icon: CalendarCheck },
      { id: 'notices' as ScreenId, label: 'Notices', icon: Radio },
      { id: 'alerts' as ScreenId, label: 'Alerts', icon: Bell, badge: unacknowledgedAlertsCount || 3 },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (id: ScreenId) => {
    onSelectScreen(id);
    setIsMobileOpen(false);
  };

  // User avatar abbreviation
  const getInitials = (name?: string) => {
    if (!name) return 'SA';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Next role cycle for quick role preview
  const cycleRole = () => {
    if (userRole === 'ddo') switchRole('chief_officer');
    else if (userRole === 'chief_officer') switchRole('inspector');
    else switchRole('ddo');
  };

  const roleTitle = {
    ddo: 'District Development Officer',
    chief_officer: 'Chief Officer',
    tdo: 'Taluka Development Officer',
    inspector: 'Ward Inspector'
  }[userRole];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Responsive Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col justify-between bg-white dark:bg-[#16221B] border-r border-[#E5EAE3] dark:border-[#2A3B31] p-4 transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Brand Header */}
          <div className="flex items-center justify-between pb-3 px-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1B7A3F] text-white">
                <Leaf size={18} className="text-[#B5CF8A]" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-[#14201A] dark:text-[#EAF2E6] leading-none">
                  Safai Sathi
                </h1>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 rounded-full text-neutral-400 hover:text-neutral-700"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612] shadow-sm'
                      : 'text-[#566259] dark:text-[#9DB0A2] hover:bg-[#F3F6F2] dark:hover:bg-[#1E2D24] hover:text-[#14201A] dark:hover:text-[#EAF2E6]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                        isActive
                          ? 'bg-[#D93025] text-white'
                          : 'bg-[#D93025] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Identity: Matching Canvas Wireframe Row 1-2 & Bottom Card */}
        <div className="pt-3 border-t border-[#E5EAE3] dark:border-[#2A3B31]">
          <button
            onClick={cycleRole}
            title="Click to switch role preview"
            className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#F3F6F2] dark:hover:bg-[#1E2D24] transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5EAE3] dark:bg-[#2A3B31] font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                {getInitials(currentUser?.name)}
              </div>
              <div className="leading-tight">
                <div className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                  {currentUser?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-[#566259] dark:text-[#9DB0A2] mt-0.5">
                  {roleTitle}
                </div>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#566259] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (<1024px) */}
      <nav className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center gap-1 rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md px-3 py-1.5 shadow-xl border border-[#DCE5D9] dark:border-[#2A3B31]">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                  : 'text-[#566259] dark:text-[#9DB0A2]'
              }`}
            >
              <Icon size={16} />
              {isActive && <span className="text-[11px] font-bold">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </>
  );
};
