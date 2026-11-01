import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import { Driver } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Ban,
  Edit2,
  Calendar,
  Check,
  FileText,
  Truck,
  ArrowLeft
} from 'lucide-react';

interface A13DriverProfileProps {
  driver?: Driver;
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A13_DriverProfile: React.FC<A13DriverProfileProps> = ({
  driver: propDriver,
  onNavigateTo,
}) => {
  const { drivers, resetDriverPin, toggleDriverSuspension } = useApp();

  // Selected driver
  const driver = propDriver || drivers[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'allotment' | 'attendance' | 'performance'>('overview');
  const [issuedPinModal, setIssuedPinModal] = useState<string | null>(null);

  if (!driver) {
    return <div className="p-8 text-center text-xs">No driver selected.</div>;
  }

  const initials = driver.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const isSuspended = driver.status === 'suspended';

  const handleResetPin = () => {
    const pin = resetDriverPin(driver.id);
    setIssuedPinModal(pin);
  };

  const handleToggleSuspend = () => {
    if (confirm(`${isSuspended ? 'Reinstate' : 'Suspend'} ${driver.name}?`)) {
      toggleDriverSuspension(driver.id);
    }
  };

  return (
    <div className="space-y-6 pb-16 relative">
      {/* Back button */}
      <button
        onClick={() => onNavigateTo('drivers')}
        className="flex items-center gap-1.5 text-xs font-bold text-[#566259] hover:text-[#14201A] transition-colors"
      >
        <ArrowLeft size={15} />
        <span>Back to Drivers</span>
      </button>

      {/* Reset PIN Modal */}
      {issuedPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIssuedPinModal(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-[#16221B] rounded-[32px] p-6 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] z-10 text-center animate-scale-up">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-[#1B7A3F] flex items-center justify-center mx-auto mb-3">
              <KeyRound size={22} />
            </div>
            <h3 className="text-base font-bold text-[#14201A] dark:text-[#EAF2E6]">
              New PIN for {driver.name}
            </h3>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1">
              Shown only once. Share with driver immediately.
            </p>

            <div className="my-6 flex justify-center gap-3">
              {issuedPinModal.split('').map((digit, i) => (
                <div
                  key={i}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border-2 border-[#1B7A3F] text-xl font-bold font-mono text-[#14201A] dark:text-[#EAF2E6]"
                >
                  {digit}
                </div>
              ))}
            </div>

            <button
              onClick={() => setIssuedPinModal(null)}
              className="w-full rounded-full bg-[#111A14] text-white py-2.5 text-xs font-bold shadow"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Header Profile Card (Canvas A13) */}
      <div className="rounded-[32px] bg-white dark:bg-[#16221B] p-6 sm:p-8 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Driver identity */}
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-[#E5EAE3] dark:bg-[#2A3B31] text-[#14201A] dark:text-[#EAF2E6] flex items-center justify-center font-bold text-2xl overflow-hidden shrink-0 border-2 border-[#1B7A3F]">
              {driver.photoUrl ? (
                <img src={driver.photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
                  {driver.name}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    isSuspended
                      ? 'bg-red-50 text-red-700'
                      : 'bg-[#EAF5EC] text-[#1B7A3F]'
                  }`}
                >
                  {isSuspended ? '! Suspended' : '✓ On shift'}
                </span>
                <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-xs font-mono font-bold text-[#566259]">
                  {driver.driverId}
                </span>
              </div>

              <div className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1.5 font-medium">
                {driver.phone} · Van {driver.vanPlate || 'GJ-17-AB-1234'} · Ward {driver.wardIds.length > 0 ? driver.wardIds.map(w => w.replace('ward_', '')).join(', ') : '5, 6'}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => alert(`Edit driver details for ${driver.name}`)}
              className="rounded-full bg-white dark:bg-[#16221B] border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 px-4 py-2 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]"
            >
              Edit
            </button>
            <button
              onClick={handleResetPin}
              className="rounded-full bg-white dark:bg-[#16221B] border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 px-4 py-2 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]"
            >
              Reset PIN
            </button>
            <button
              onClick={handleToggleSuspend}
              className="rounded-full border border-red-300 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 px-4 py-2 text-xs font-bold text-red-700 dark:text-red-400"
            >
              {isSuspended ? 'Reinstate' : 'Suspend'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Chips (Canvas A13) */}
      <div className="flex flex-wrap items-center gap-2">
        {(['overview', 'documents', 'allotment', 'attendance', 'performance'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeTab === tab && '✓ '}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Overview (Canvas A13) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 3 Detail Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Card */}
            <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
              <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
                Personal
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-[11px] text-[#566259]">Date of birth</div>
                  <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{driver.dob || '14 Mar 1989'}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#566259]">Address</div>
                  <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{driver.address || 'Panam Road, Godhra'}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#566259]">Emergency contact</div>
                  <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    {driver.emergencyContact?.name || 'Kanta Ben'}, {driver.emergencyContact?.phone || '+91 98xxxx88'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#566259]">Joined</div>
                  <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{driver.joinedDate || '12 Jun 2024'}</div>
                </div>
              </div>
            </div>

            {/* Licence Card */}
            <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
              <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
                Licence
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-[11px] text-[#566259]">Number</div>
                  <div className="font-mono font-bold text-[#14201A] dark:text-[#EAF2E6]">{driver.licenceNumber}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#566259]">Class</div>
                  <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{driver.licenceClass}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#566259]">Valid until</div>
                  <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{driver.licenceValidUntil}</div>
                </div>
                <div className="pt-1">
                  <span className="rounded-full bg-[#EAF5EC] text-[#1B7A3F] dark:bg-[#163321] dark:text-[#6DB36F] px-3 py-1 text-[11px] font-bold">
                    ✓ Valid, 26 months
                  </span>
                </div>
              </div>
            </div>

            {/* This Month Performance Card */}
            <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
              <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
                This month
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    <span>On-time start</span>
                    <span>94%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] overflow-hidden">
                    <div className="h-full bg-[#1B7A3F] rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    <span>Wards completed</span>
                    <span>91%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] overflow-hidden">
                    <div className="h-full bg-[#1B7A3F] rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    <span>Missed-collection reports</span>
                    <span>2</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] overflow-hidden">
                    <div className="h-full bg-[#1B7A3F] rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Shifts Table (Canvas A13) */}
          <div className="rounded-[28px] bg-white dark:bg-[#16221B] shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] overflow-hidden">
            <div className="p-5 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                Recent shifts
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] dark:text-[#9DB0A2] border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                  <tr>
                    <th className="py-3 px-6 font-bold">Date</th>
                    <th className="py-3 px-6 font-bold">Van</th>
                    <th className="py-3 px-6 font-bold">Started</th>
                    <th className="py-3 px-6 font-bold">Ended</th>
                    <th className="py-3 px-6 font-bold">Wards done</th>
                    <th className="py-3 px-6 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAE3] dark:divide-[#2A3B31]">
                  {(driver.recentShifts && driver.recentShifts.length > 0 ? driver.recentShifts : [
                    { date: 'Today', vanPlate: driver.vanPlate || 'GJ-17-AB-1234', started: '07:28', ended: 'In progress', wardsDone: '5 of 9', status: 'on_time' },
                    { date: 'Yesterday', vanPlate: driver.vanPlate || 'GJ-17-AB-1234', started: '07:31', ended: '14:12', wardsDone: '9 of 9', status: 'on_time' },
                    { date: '27 Oct', vanPlate: driver.vanPlate || 'GJ-17-AB-1234', started: '07:55', ended: '14:20', wardsDone: '9 of 9', status: 'late', lateMinutes: 25 },
                    { date: '26 Oct', vanPlate: driver.vanPlate || 'GJ-17-AB-1234', started: '07:29', ended: '14:02', wardsDone: '8 of 9', status: 'on_time' },
                  ]).map((shift, i) => (
                    <tr
                      key={i}
                      onClick={() => onNavigateTo('tripReplay')}
                      className="hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-6 font-bold text-[#14201A] dark:text-[#EAF2E6]">{shift.date}</td>
                      <td className="py-3.5 px-6 font-mono font-medium">{shift.vanPlate}</td>
                      <td className="py-3.5 px-6 font-medium">{shift.started}</td>
                      <td className="py-3.5 px-6 text-[#566259]">{shift.ended}</td>
                      <td className="py-3.5 px-6 font-medium">{shift.wardsDone}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            shift.status === 'late'
                              ? 'bg-[#FFF8E6] text-[#A66800]'
                              : 'bg-[#EAF5EC] text-[#1B7A3F]'
                          }`}
                        >
                          {shift.status === 'late' ? `! Late ${shift.lateMinutes || 25} min` : '✓ On time'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs placeholder content */}
      {activeTab !== 'overview' && (
        <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-8 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] text-center text-xs text-[#566259]">
          <p className="font-bold text-[#14201A] dark:text-[#EAF2E6] mb-1 capitalize">
            {activeTab} records for {driver.name}
          </p>
          <p>Verified under Godhra Nagarpalika sanitation fleet.</p>
        </div>
      )}
    </div>
  );
};
