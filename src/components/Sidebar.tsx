import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  ClipboardList,
  Building2,
  Truck,
  Radio,
  FileBarChart,
  Users2,
  Leaf,
  X
} from 'lucide-react';

export type ScreenId =
  | 'overview'
  | 'liveMap'
  | 'complaints'
  | 'wards'
  | 'vansRoutes'
  | 'notices'
  | 'reports'
  | 'staff'
  | 'login';

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
  const { t, currentUser } = useApp();

  const navItems: { id: ScreenId; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: t.nav.overview, icon: LayoutDashboard },
    { id: 'liveMap', label: t.nav.liveMap, icon: MapPin },
    { id: 'complaints', label: t.nav.complaints, icon: ClipboardList },
    { id: 'wards', label: t.nav.wards, icon: Building2 },
    { id: 'vansRoutes', label: t.nav.vansRoutes, icon: Truck },
    { id: 'notices', label: t.nav.notices, icon: Radio },
    { id: 'reports', label: t.nav.reports, icon: FileBarChart },
    { id: 'staff', label: t.nav.staff, icon: Users2 },
  ];

  const handleNavClick = (id: ScreenId) => {
    onSelectScreen(id);
    setIsMobileOpen(false);
  };

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
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between bg-white dark:bg-[#16221B] border-r border-[#DCE5D9] dark:border-[#2A3B31] p-5 transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-elev3' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Brand Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE5D9] dark:border-[#2A3B31]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1B7A3F] text-white shadow-sm">
                <Leaf size={22} className="text-[#B5CF8A]" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-[#14201A] dark:text-[#EAF2E6] leading-none">
                  {t.appName}
                </h1>
                <p className="text-[10px] font-medium text-[#566259] dark:text-[#9DB0A2] mt-0.5">
                  Panchmahal Godhra
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center gap-3 rounded-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612] shadow-elev1'
                      : 'text-[#566259] dark:text-[#9DB0A2] hover:bg-[#F3F6F2] dark:hover:bg-[#1E2D24] hover:text-[#14201A] dark:hover:text-[#EAF2E6]'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-[#B5CF8A] dark:text-[#1B7A3F]' : ''} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Identity */}
        <div className="pt-3 border-t border-[#DCE5D9] dark:border-[#2A3B31] text-[11px] text-[#566259] dark:text-[#9DB0A2]">
          <div className="font-semibold text-[#14201A] dark:text-[#EAF2E6] truncate">
            {currentUser?.name}
          </div>
          <div className="text-[10px]">
            {currentUser?.role ? t.roles[currentUser.role] : 'Administrator'}
          </div>
        </div>
      </aside>

      {/* Floating Bottom Pill Navigation for Mobile (<1024px) - DESIGN.md Section 3.3 & 15.6 */}
      <nav className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center gap-1 rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md px-3 py-1.5 shadow-elev3 dark:shadow-elev3-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
        {[
          { id: 'overview' as ScreenId, icon: LayoutDashboard, label: t.nav.overview },
          { id: 'liveMap' as ScreenId, icon: MapPin, label: t.nav.liveMap },
          { id: 'complaints' as ScreenId, icon: ClipboardList, label: t.nav.complaints },
          { id: 'wards' as ScreenId, icon: Building2, label: t.nav.wards },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all ${
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
