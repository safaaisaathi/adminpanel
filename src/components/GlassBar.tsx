import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from './Sidebar';
import {
  Search,
  Bell,
  Plus,
  Radio,
  Check,
  User,
  Truck,
  Building2,
  FileText,
  AlertCircle,
  Menu,
  Moon,
  Sun,
  X
} from 'lucide-react';

interface GlassBarProps {
  currentScreen: ScreenId;
  onNavigateTo: (screen: ScreenId, param?: any) => void;
  onPageAction?: () => void;
  onToggleMobileMenu?: () => void;
}

export const GlassBar: React.FC<GlassBarProps> = ({
  currentScreen,
  onNavigateTo,
  onPageAction,
  onToggleMobileMenu,
}) => {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    currentUser,
    drivers,
    vans,
    complaints,
    wards,
    unacknowledgedAlertsCount,
    isSimulating,
    toggleSimulation,
    switchRole
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Title and Breadcrumb mappings from Wireframe Specifications
  const getBreadcrumb = () => {
    const isGu = lang === 'gu';
    const jurisdiction = currentUser?.role === 'ddo'
      ? (isGu ? 'પંચમહાલ જિલ્લો' : 'Panchmahal district')
      : currentUser?.role === 'inspector'
      ? (isGu ? 'મીના પરમાર (વોર્ડ ૫, ૬)' : 'Meena Parmar')
      : (isGu ? 'ગોધરા નગરપાલિકા' : 'Godhra Nagarpalika');

    switch (currentScreen) {
      case 'overview':
        return {
          title: currentUser?.role === 'inspector' ? 'Ward 5 and 6, today' : 'District overview',
          breadcrumb: jurisdiction
        };
      case 'liveMap':
        return { title: 'Live map', breadcrumb: 'All running vehicles in Godhra Nagarpalika' };
      case 'complaints':
        return { title: 'Complaints', breadcrumb: 'Godhra Nagarpalika' };
      case 'wards':
        return { title: 'Wards', breadcrumb: 'Godhra Nagarpalika' };
      case 'wardEditor':
        return { title: 'New ward', breadcrumb: 'Wards' };
      case 'routes':
        return { title: 'Routes', breadcrumb: 'Godhra Nagarpalika' };
      case 'fleet':
        return { title: 'Fleet and vans', breadcrumb: 'Godhra Nagarpalika' };
      case 'drivers':
        return { title: 'Drivers', breadcrumb: 'Ward 5 and 6' };
      case 'enrollDriver':
        return { title: 'Enroll driver', breadcrumb: 'Drivers' };
      case 'driverProfile':
        return { title: 'Driver profile', breadcrumb: 'Drivers' };
      case 'allotment':
        return { title: 'Allotment', breadcrumb: 'Wards created by your Chief Officer' };
      case 'attendance':
        return { title: 'Attendance', breadcrumb: 'Ward 5 and 6' };
      case 'tripReplay':
        return { title: 'Trip replay', breadcrumb: 'Ramesh Bhai, 28 Oct' };
      case 'notices':
        return { title: 'Notices', breadcrumb: 'Godhra Nagarpalika' };
      case 'alerts':
        return { title: 'Alerts', breadcrumb: 'Godhra Nagarpalika' };
      case 'reports':
        return { title: 'Reports', breadcrumb: 'Godhra Nagarpalika' };
      case 'analytics':
        return { title: 'Analytics', breadcrumb: 'Panchmahal district' };
      case 'auditLog':
        return { title: 'Audit log', breadcrumb: 'Every change is recorded and cannot be edited' };
      case 'settings':
        return { title: 'Settings', breadcrumb: 'District rules' };
      case 'staff':
        return { title: 'Staff', breadcrumb: 'Access' };
      default:
        return { title: 'Safai Sathi', breadcrumb: 'Panchmahal district' };
    }
  };

  const { title, breadcrumb } = getBreadcrumb();

  // Page Action Button configuration
  const getPageActionButton = () => {
    switch (currentScreen) {
      case 'wards':
        return currentUser?.role === 'inspector'
          ? null
          : { label: 'Create ward', action: () => onNavigateTo('wardEditor') };
      case 'routes':
        return { label: '+ New route', action: onPageAction || (() => {}) };
      case 'fleet':
        return { label: '+ Register van', action: onPageAction || (() => {}) };
      case 'drivers':
        return { label: '+ Enroll driver', action: () => onNavigateTo('enrollDriver') };
      case 'staff':
        return { label: 'Add staff', action: onPageAction || (() => {}) };
      case 'allotment':
        return { label: 'Save allotments', action: onPageAction || (() => {}) };
      default:
        return null;
    }
  };

  const pageAction = getPageActionButton();

  // Search Results filtering
  const q = searchQuery.toLowerCase().trim();
  const searchResults = q
    ? {
        drivers: drivers.filter(d => d.name.toLowerCase().includes(q) || d.driverId.toLowerCase().includes(q) || d.phone.includes(q)),
        vans: vans.filter(v => v.plateNo.toLowerCase().includes(q)),
        complaints: complaints.filter(c => c.ticketId.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)),
        wards: wards.filter(w => w.name.toLowerCase().includes(q) || w.code.toLowerCase().includes(q)),
      }
    : null;

  const totalResultsCount = searchResults
    ? searchResults.drivers.length + searchResults.vans.length + searchResults.complaints.length + searchResults.wards.length
    : 0;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-[#F8FAF7] dark:bg-[#0E1612] px-6 py-4">
      {/* Left: Mobile Menu + Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#14201A] dark:text-[#EAF2E6] leading-none">
            {title}
          </h1>
          <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1">
            {breadcrumb}
          </p>
        </div>
      </div>

      {/* Right Controls Area: Page Action + Search + Lang + Bell + Role Selector */}
      <div className="flex items-center gap-3">
        {/* Page Action Button (Section 1.2 Black Pill) */}
        {pageAction && (
          <button
            onClick={pageAction.action}
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-4 py-2 text-xs font-semibold shadow-sm transition-transform active:scale-95"
          >
            <span>{pageAction.label}</span>
          </button>
        )}

        {/* Global Search Pill & Dropdown */}
        <div ref={searchRef} className="relative">
          <div className="flex items-center gap-2 rounded-full bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-1.5 text-xs text-[#566259] dark:text-[#9DB0A2] w-48 sm:w-60 focus-within:w-72 focus-within:border-[#1B7A3F] transition-all">
            <Search size={15} />
            <input
              type="text"
              placeholder={lang === 'gu' ? 'શોધો (વાન, ડ્રાઇવર, ટિકિટ)...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-transparent outline-none text-xs text-[#14201A] dark:text-[#EAF2E6] placeholder:text-[#566259]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-neutral-400 hover:text-neutral-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Search Dropdown Popup */}
          {isSearchOpen && searchQuery && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#16221B] shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] p-2 z-50 max-h-96 overflow-y-auto">
              <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                {totalResultsCount} Results
              </div>

              {totalResultsCount === 0 ? (
                <div className="p-4 text-center text-xs text-neutral-500">
                  No matching driver, van, complaint or ward.
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Drivers */}
                  {searchResults?.drivers.map(d => (
                    <button
                      key={d.id}
                      onClick={() => {
                        onNavigateTo('driverProfile', d);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors"
                    >
                      <User size={15} className="text-[#1B7A3F]" />
                      <div className="text-xs">
                        <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{d.name}</div>
                        <div className="text-[10px] text-neutral-500">{d.driverId} • {d.phone}</div>
                      </div>
                    </button>
                  ))}

                  {/* Vans */}
                  {searchResults?.vans.map(v => (
                    <button
                      key={v.id}
                      onClick={() => {
                        onNavigateTo('liveMap');
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors"
                    >
                      <Truck size={15} className="text-blue-600" />
                      <div className="text-xs">
                        <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{v.plateNo}</div>
                        <div className="text-[10px] text-neutral-500">{v.type || 'Tata Ace'} • {v.driverName}</div>
                      </div>
                    </button>
                  ))}

                  {/* Complaints */}
                  {searchResults?.complaints.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onNavigateTo('complaints', c);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors"
                    >
                      <AlertCircle size={15} className="text-amber-600" />
                      <div className="text-xs">
                        <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{c.ticketId}</div>
                        <div className="text-[10px] text-neutral-500">{c.category.replace('_', ' ')} • {c.status}</div>
                      </div>
                    </button>
                  ))}

                  {/* Wards */}
                  {searchResults?.wards.map(w => (
                    <button
                      key={w.id}
                      onClick={() => {
                        onNavigateTo('wards', w);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors"
                    >
                      <Building2 size={15} className="text-purple-600" />
                      <div className="text-xs">
                        <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{w.name} ({w.nameGu})</div>
                        <div className="text-[10px] text-neutral-500">{w.code} • {w.areaKm2} km²</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Language Toggle: ગુ | EN */}
        <div className="flex items-center rounded-full bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] p-0.5 text-xs font-semibold">
          <button
            onClick={() => setLang('gu')}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              lang === 'gu'
                ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                : 'text-[#566259] dark:text-[#9DB0A2] hover:text-black dark:hover:text-white'
            }`}
          >
            ગુ
          </button>
          <button
            onClick={() => setLang('en')}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              lang === 'en'
                ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                : 'text-[#566259] dark:text-[#9DB0A2] hover:text-black dark:hover:text-white'
            }`}
          >
            EN
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] text-[#566259] dark:text-[#9DB0A2] hover:text-black dark:hover:text-white transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Live GPS Simulation Toggle (for live demoing) */}
        <button
          onClick={toggleSimulation}
          className={`hidden md:flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border transition-colors ${
            isSimulating
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 animate-pulse'
              : 'bg-white text-neutral-600 border-[#E5EAE3] dark:bg-[#16221B] dark:text-neutral-400'
          }`}
          title="Live GPS Fleet movement simulation"
        >
          <span className={`h-2 w-2 rounded-full ${isSimulating ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
          <span>{isSimulating ? 'Live' : 'Standby'}</span>
        </button>

        {/* Alerts Bell Notification Icon with Badge */}
        <button
          onClick={() => onNavigateTo('alerts')}
          className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] text-[#566259] dark:text-[#9DB0A2] hover:text-black dark:hover:text-white transition-colors"
          title="View system alerts"
        >
          <Bell size={16} />
          {unacknowledgedAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D93025] px-1 text-[10px] font-bold text-white shadow-sm">
              {unacknowledgedAlertsCount}
            </span>
          )}
        </button>

        {/* Quick Role Switcher Pill (Section 1 Wireframe) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 rounded-full bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] p-1 pr-3 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1B7A3F] text-[10px] font-bold text-white">
              {currentUser?.role === 'ddo' ? 'DA' : currentUser?.role === 'chief_officer' ? 'RS' : 'MP'}
            </div>
            <span className="hidden sm:inline">{currentUser?.name?.split(' ')[0]}</span>
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#16221B] shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] p-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Switch Role Scope
              </div>
              <button
                onClick={() => { switchRole('ddo'); setShowRoleDropdown(false); }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${currentUser?.role === 'ddo' ? 'bg-[#F3F6F2] dark:bg-[#1E2D24] font-bold' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
              >
                <div>
                  <div className="text-[#14201A] dark:text-[#EAF2E6]">Dr. A. Patel</div>
                  <div className="text-[10px] text-neutral-500">District Development Officer</div>
                </div>
                {currentUser?.role === 'ddo' && <Check size={14} className="text-[#1B7A3F]" />}
              </button>

              <button
                onClick={() => { switchRole('chief_officer'); setShowRoleDropdown(false); }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${currentUser?.role === 'chief_officer' ? 'bg-[#F3F6F2] dark:bg-[#1E2D24] font-bold' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
              >
                <div>
                  <div className="text-[#14201A] dark:text-[#EAF2E6]">Rakesh Shah</div>
                  <div className="text-[10px] text-neutral-500">Chief Officer (Godhra NP)</div>
                </div>
                {currentUser?.role === 'chief_officer' && <Check size={14} className="text-[#1B7A3F]" />}
              </button>

              <button
                onClick={() => { switchRole('inspector'); setShowRoleDropdown(false); }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${currentUser?.role === 'inspector' ? 'bg-[#F3F6F2] dark:bg-[#1E2D24] font-bold' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
              >
                <div>
                  <div className="text-[#14201A] dark:text-[#EAF2E6]">Meena Parmar</div>
                  <div className="text-[10px] text-neutral-500">Ward Inspector (Ward 5, 6)</div>
                </div>
                {currentUser?.role === 'inspector' && <Check size={14} className="text-[#1B7A3F]" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
