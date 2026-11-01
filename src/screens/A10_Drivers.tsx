import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import { Driver } from '../types';
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  KeyRound,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Check
} from 'lucide-react';

interface A10DriversProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A10_Drivers: React.FC<A10DriversProps> = ({ onNavigateTo }) => {
  const { drivers, resetDriverPin, toggleDriverSuspension } = useApp();

  const [filter, setFilter] = useState<'all' | 'on_shift' | 'off_duty' | 'suspended'>('all');
  const [searchQ, setSearchQ] = useState('');
  const [selectedDriverMenu, setSelectedDriverMenu] = useState<string | null>(null);
  const [issuedPinModal, setIssuedPinModal] = useState<{ driverName: string; pin: string } | null>(null);

  const filteredDrivers = drivers.filter((d) => {
    if (filter === 'on_shift') return d.status === 'on_shift' || d.status === 'late';
    if (filter === 'off_duty') return d.status === 'off_duty';
    if (filter === 'suspended') return d.status === 'suspended';
    return true;
  }).filter((d) => {
    if (!searchQ.trim()) return true;
    const q = searchQ.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.driverId.toLowerCase().includes(q) || d.phone.includes(q);
  });

  const handleResetPin = (d: Driver) => {
    const pin = resetDriverPin(d.id);
    setSelectedDriverMenu(null);
    setIssuedPinModal({ driverName: d.name, pin });
  };

  const handleToggleSuspend = (d: Driver) => {
    const isNowSuspended = toggleDriverSuspension(d.id);
    setSelectedDriverMenu(null);
  };

  return (
    <div className="space-y-6 pb-12 relative">
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
              New PIN for {issuedPinModal.driverName}
            </h3>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1">
              Shown only once. Share with driver immediately.
            </p>

            <div className="my-6 flex justify-center gap-3">
              {issuedPinModal.pin.split('').map((digit, i) => (
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
              className="w-full rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:text-[#0E1612] py-2.5 text-xs font-bold shadow"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Top Filter Chips & Search & Enroll Driver Button (Canvas A10) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] dark:text-[#9DB0A2] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {filter === 'all' && '✓ '}All 12
          </button>
          <button
            onClick={() => setFilter('on_shift')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              filter === 'on_shift'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] dark:text-[#9DB0A2] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {filter === 'on_shift' && '✓ '}On shift 5
          </button>
          <button
            onClick={() => setFilter('off_duty')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              filter === 'off_duty'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] dark:text-[#9DB0A2] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {filter === 'off_duty' && '✓ '}Off duty 6
          </button>
          <button
            onClick={() => setFilter('suspended')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              filter === 'suspended'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] dark:text-[#9DB0A2] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {filter === 'suspended' && '✓ '}Suspended 1
          </button>
        </div>

        {/* Right Search & Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-1.5 text-xs text-[#566259] w-52 sm:w-60">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search name, ID or phone"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full bg-transparent outline-none text-xs text-[#14201A] dark:text-[#EAF2E6]"
            />
          </div>

          <button
            onClick={() => onNavigateTo('enrollDriver')}
            className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-5 py-2 text-xs font-bold shadow flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Enroll driver</span>
          </button>
        </div>
      </div>

      {/* Drivers Table (Canvas A10) */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] dark:text-[#9DB0A2] border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <tr>
                <th className="py-3.5 px-6 font-bold">Driver</th>
                <th className="py-3.5 px-6 font-bold">Driver ID</th>
                <th className="py-3.5 px-6 font-bold">Phone</th>
                <th className="py-3.5 px-6 font-bold">Van</th>
                <th className="py-3.5 px-6 font-bold">Wards</th>
                <th className="py-3.5 px-6 font-bold">Licence valid until</th>
                <th className="py-3.5 px-6 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE3] dark:divide-[#2A3B31]">
              {filteredDrivers.map((driver) => {
                const initials = driver.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                const isLate = driver.status === 'late';
                const isSuspended = driver.status === 'suspended';
                const isOffDuty = driver.status === 'off_duty';
                const isNearExpiry = driver.licenceValidUntil.includes('2026');

                return (
                  <tr
                    key={driver.id}
                    className="hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] transition-colors group cursor-pointer"
                    onClick={() => onNavigateTo('driverProfile', driver)}
                  >
                    {/* Photo + Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5EAE3] dark:bg-[#2A3B31] font-bold text-xs text-[#14201A] dark:text-[#EAF2E6] overflow-hidden">
                          {driver.photoUrl ? (
                            <img src={driver.photoUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            initials
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{driver.name}</div>
                          <div className="text-[10px] text-[#566259]">Driver</div>
                        </div>
                      </div>
                    </td>

                    {/* Driver ID */}
                    <td className="py-4 px-6 font-mono font-bold text-[#14201A] dark:text-[#EAF2E6]">
                      {driver.driverId}
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-6 text-[#566259] dark:text-[#9DB0A2]">
                      {driver.phone}
                    </td>

                    {/* Van */}
                    <td className="py-4 px-6 font-medium text-[#14201A] dark:text-[#EAF2E6]">
                      {driver.vanPlate || (
                        <span className="text-[#566259]">Not allotted</span>
                      )}
                    </td>

                    {/* Wards */}
                    <td className="py-4 px-6 text-[#566259] dark:text-[#9DB0A2]">
                      {driver.wardIds.length > 0 ? driver.wardIds.map(w => w.replace('ward_', '')).join(', ') : 'Not allotted'}
                    </td>

                    {/* Licence valid until pill */}
                    <td className="py-4 px-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isNearExpiry
                            ? 'bg-[#FFF8E6] text-[#A66800] dark:bg-[#332611] dark:text-[#F3BA54]'
                            : 'bg-[#EAF5EC] text-[#1B7A3F] dark:bg-[#163321] dark:text-[#6DB36F]'
                        }`}
                      >
                        {isNearExpiry ? '! ' : '✓ '}
                        {driver.licenceValidUntil}
                      </span>
                    </td>

                    {/* Status pill */}
                    <td className="py-4 px-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isSuspended
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                            : isLate
                            ? 'bg-[#FFF8E6] text-[#A66800] dark:bg-[#332611] dark:text-[#F3BA54]'
                            : isOffDuty
                            ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                            : 'bg-[#EAF5EC] text-[#1B7A3F] dark:bg-[#163321] dark:text-[#6DB36F]'
                        }`}
                      >
                        {isSuspended
                          ? '! Suspended'
                          : isLate
                          ? `! Late ${driver.lateMinutes || 12} min`
                          : isOffDuty
                          ? 'Off duty'
                          : '✓ On shift'}
                      </span>
                    </td>

                    {/* Row Menu Actions */}
                    <td
                      className="py-4 px-4 text-right relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setSelectedDriverMenu(selectedDriverMenu === driver.id ? null : driver.id)}
                        className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {selectedDriverMenu === driver.id && (
                        <div className="absolute right-4 mt-1 w-40 rounded-2xl bg-white dark:bg-[#16221B] shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] p-1.5 z-30 text-left">
                          <button
                            onClick={() => {
                              setSelectedDriverMenu(null);
                              onNavigateTo('driverProfile', driver);
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-xl text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#14201A] dark:text-[#EAF2E6]"
                          >
                            <Eye size={14} />
                            <span>View profile</span>
                          </button>
                          <button
                            onClick={() => handleResetPin(driver)}
                            className="w-full flex items-center gap-2 p-2 rounded-xl text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#14201A] dark:text-[#EAF2E6]"
                          >
                            <KeyRound size={14} />
                            <span>Reset PIN</span>
                          </button>
                          <button
                            onClick={() => handleToggleSuspend(driver)}
                            className="w-full flex items-center gap-2 p-2 rounded-xl text-xs hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 font-semibold"
                          >
                            <Ban size={14} />
                            <span>{isSuspended ? 'Reinstate' : 'Suspend'}</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
