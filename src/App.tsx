import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, ScreenId } from './components/Sidebar';
import { GlassBar } from './components/GlassBar';

// 25 Screens from Wireframe Specifications
import { A01_Login } from './screens/A01_Login';
import { A02_DdoOverview } from './screens/A02_DdoOverview';
import { A09_InspectorOverview } from './screens/A09_InspectorOverview';
import { A03_Staff } from './screens/A03_Staff';
import { A04_Settings } from './screens/A04_Settings';
import { A05_Wards } from './screens/A05_Wards';
import { A06_WardEditor } from './screens/A06_WardEditor';
import { A07_Routes } from './screens/A07_Routes';
import { A08_Fleet } from './screens/A08_Fleet';
import { A10_Drivers } from './screens/A10_Drivers';
import { A11_EnrollDriver } from './screens/A11_EnrollDriver';
import { A12_IdIssuedModal } from './screens/A12_IdIssuedModal';
import { A13_DriverProfile } from './screens/A13_DriverProfile';
import { A14_Allotment } from './screens/A14_Allotment';
import { A15_LiveMap } from './screens/A15_LiveMap';
import { A17_Complaints } from './screens/A17_Complaints';
import { A19_Attendance } from './screens/A19_Attendance';
import { A20_TripReplay } from './screens/A20_TripReplay';
import { A21_Notices } from './screens/A21_Notices';
import { A22_Alerts } from './screens/A22_Alerts';
import { A23_Reports } from './screens/A23_Reports';
import { A24_Analytics } from './screens/A24_Analytics';
import { A25_AuditLog } from './screens/A25_AuditLog';
import { Driver } from './types';

const MainLayout: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('overview');
  const [screenParam, setScreenParam] = useState<any>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ID Issued Modal after Driver Enrollment (Canvas A12)
  const [newlyEnrolledDriver, setNewlyEnrolledDriver] = useState<Driver | null>(null);
  const [showIdIssuedModal, setShowIdIssuedModal] = useState(false);

  const { currentUser } = useApp();

  const handleNavigate = (screen: ScreenId, param?: any) => {
    setCurrentScreen(screen);
    setScreenParam(param || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDriverEnrolled = (driver: Driver) => {
    setNewlyEnrolledDriver(driver);
    setShowIdIssuedModal(true);
  };

  // If on login screen
  if (currentScreen === 'login') {
    return <A01_Login onLoginSuccess={(scr) => setCurrentScreen(scr)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7] dark:bg-[#0E1612] text-[#14201A] dark:text-[#EAF2E6] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentScreen={currentScreen}
        onSelectScreen={handleNavigate}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-20 lg:pb-10 w-full overflow-x-hidden">
        {/* Top Header Glass Bar with Title, Breadcrumb, Global Search, Page Action, Lang, Bell */}
        <GlassBar
          currentScreen={currentScreen}
          onNavigateTo={handleNavigate}
          onToggleMobileMenu={() => setIsMobileOpen(true)}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto animate-fade-in">
          {/* Overview: DDO vs Inspector Overview */}
          {currentScreen === 'overview' && (
            currentUser?.role === 'inspector' ? (
              <A09_InspectorOverview onNavigateTo={handleNavigate} />
            ) : (
              <A02_DdoOverview onNavigateTo={handleNavigate} />
            )
          )}

          {/* Live Fleet Map & Bubble */}
          {currentScreen === 'liveMap' && <A15_LiveMap onNavigateTo={handleNavigate} />}

          {/* Complaints & Drawer */}
          {currentScreen === 'complaints' && (
            <A17_Complaints initialComplaint={screenParam} />
          )}

          {/* Wards & Ward Drawer */}
          {currentScreen === 'wards' && <A05_Wards onNavigateTo={handleNavigate} />}

          {/* Ward Editor: 3-step wizard */}
          {currentScreen === 'wardEditor' && (
            <A06_WardEditor
              onNavigateTo={handleNavigate}
              editWard={screenParam?.editWard}
            />
          )}

          {/* Routes Management */}
          {currentScreen === 'routes' && <A07_Routes />}

          {/* Fleet Management */}
          {currentScreen === 'fleet' && <A08_Fleet />}

          {/* Drivers List */}
          {currentScreen === 'drivers' && <A10_Drivers onNavigateTo={handleNavigate} />}

          {/* Enroll Driver Form */}
          {currentScreen === 'enrollDriver' && (
            <A11_EnrollDriver
              onNavigateTo={handleNavigate}
              onDriverEnrolled={handleDriverEnrolled}
            />
          )}

          {/* Driver Profile */}
          {currentScreen === 'driverProfile' && (
            <A13_DriverProfile
              driver={screenParam}
              onNavigateTo={handleNavigate}
            />
          )}

          {/* Allotment Board */}
          {currentScreen === 'allotment' && <A14_Allotment />}

          {/* Attendance Log */}
          {currentScreen === 'attendance' && <A19_Attendance onNavigateTo={handleNavigate} />}

          {/* Trip Replay */}
          {currentScreen === 'tripReplay' && <A20_TripReplay onNavigateTo={handleNavigate} />}

          {/* Broadcast Notices */}
          {currentScreen === 'notices' && <A21_Notices />}

          {/* Alerts */}
          {currentScreen === 'alerts' && <A22_Alerts />}

          {/* Reports */}
          {currentScreen === 'reports' && <A23_Reports />}

          {/* Analytics */}
          {currentScreen === 'analytics' && <A24_Analytics />}

          {/* Audit Log */}
          {currentScreen === 'auditLog' && <A25_AuditLog />}

          {/* Settings / SLA */}
          {currentScreen === 'settings' && <A04_Settings />}

          {/* Staff Access & Drawer */}
          {currentScreen === 'staff' && <A03_Staff />}
        </main>
      </div>

      {/* ID Issued Modal (Canvas A12) */}
      {showIdIssuedModal && newlyEnrolledDriver && (
        <A12_IdIssuedModal
          driver={newlyEnrolledDriver}
          onClose={() => {
            setShowIdIssuedModal(false);
            setNewlyEnrolledDriver(null);
            handleNavigate('drivers');
          }}
        />
      )}
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
