import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, ScreenId } from './components/Sidebar';
import { GlassBar } from './components/GlassBar';

// Screens A1 - A9
import { A1_Login } from './screens/A1_Login';
import { A2_Overview } from './screens/A2_Overview';
import { A3_LiveMap } from './screens/A3_LiveMap';
import { A4_Complaints } from './screens/A4_Complaints';
import { A5_Wards } from './screens/A5_Wards';
import { A6_VansRoutes } from './screens/A6_VansRoutes';
import { A7_Notices } from './screens/A7_Notices';
import { A8_Reports } from './screens/A8_Reports';
import { A9_Staff } from './screens/A9_Staff';

const MainLayout: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useApp();

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'overview': return t.nav.overview;
      case 'liveMap': return t.nav.liveMap;
      case 'complaints': return t.nav.complaints;
      case 'wards': return t.nav.wards;
      case 'vansRoutes': return t.nav.vansRoutes;
      case 'notices': return t.nav.notices;
      case 'reports': return t.nav.reports;
      case 'staff': return t.nav.staff;
      case 'login': return t.nav.login;
      default: return t.appName;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6F2] dark:bg-[#0E1612] text-[#14201A] dark:text-[#EAF2E6] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen pb-20 lg:pb-10 w-full overflow-x-hidden">
        {/* Top Header Glass Bar */}
        <GlassBar
          title={getScreenTitle()}
          onToggleMobileMenu={() => setIsMobileOpen(true)}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 px-3 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {currentScreen === 'overview' && <A2_Overview onNavigateTo={setCurrentScreen} />}
          {currentScreen === 'liveMap' && <A3_LiveMap />}
          {currentScreen === 'complaints' && <A4_Complaints />}
          {currentScreen === 'wards' && <A5_Wards />}
          {currentScreen === 'vansRoutes' && <A6_VansRoutes />}
          {currentScreen === 'notices' && <A7_Notices />}
          {currentScreen === 'reports' && <A8_Reports />}
          {currentScreen === 'staff' && <A9_Staff />}
          {currentScreen === 'login' && <A1_Login />}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
