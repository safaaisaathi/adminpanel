import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Van } from '../types';
import {
  Truck,
  Plus,
  AlertTriangle,
  CheckCircle2,
  X,
  FileCheck,
  ShieldCheck,
  Check
} from 'lucide-react';

export const A08_Fleet: React.FC = () => {
  const { vans, registerVan } = useApp();

  const [isRegisterDrawerOpen, setIsRegisterDrawerOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'expiring' | 'offline'>('all');

  // Register Van Form States
  const [plateNo, setPlateNo] = useState('');
  const [vanType, setVanType] = useState('Tata Ace');
  const [capacity, setCapacity] = useState('750 kg');
  const [insuranceExpiry, setInsuranceExpiry] = useState('Mar 2028');
  const [pucExpiry, setPucExpiry] = useState('Dec 2027');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredVans = vans.filter((v) => {
    if (filterType === 'offline') return v.status === 'offline';
    if (filterType === 'expiring') return v.pucExpiry?.includes('2026') || v.insuranceExpiry?.includes('2026');
    return true;
  });

  const handleRegisterVan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNo.trim()) return;

    registerVan({
      plateNo: plateNo.trim().toUpperCase(),
      type: vanType,
      capacity,
      insuranceExpiry,
      pucExpiry,
      routeId: 'route_east'
    });

    setIsRegisterDrawerOpen(false);
    setPlateNo('');
    setToastMessage(`Van ${plateNo.trim().toUpperCase()} registered successfully`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#111A14] text-white px-5 py-3 shadow-2xl flex items-center gap-2 text-xs font-bold animate-slide-up">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4 KPI Cards (Canvas A08) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total vans */}
        <div
          onClick={() => setFilterType('all')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            Total vans
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            52
          </div>
          <div className="mt-2 text-xs font-bold text-[#566259] dark:text-[#9DB0A2]">
            12 in Godhra
          </div>
        </div>

        {/* On shift now */}
        <div
          onClick={() => setFilterType('all')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            On shift now
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            38
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
            <CheckCircle2 size={14} />
            <span>73%</span>
          </div>
        </div>

        {/* Documents expiring */}
        <div
          onClick={() => setFilterType('expiring')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            Documents expiring
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            4
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#E8A317]">
            <AlertTriangle size={14} />
            <span>Next 30 days</span>
          </div>
        </div>

        {/* GPS offline */}
        <div
          onClick={() => setFilterType('offline')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            GPS offline
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            2
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#D93025]">
            <AlertTriangle size={14} />
            <span>Check phones</span>
          </div>
        </div>
      </div>

      {/* Fleet & Vans Table (Canvas A08) */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
              All Fleet Vans
            </span>
            {filterType !== 'all' && (
              <button
                onClick={() => setFilterType('all')}
                className="text-[11px] text-[#1B7A3F] font-semibold underline"
              >
                Clear filter
              </button>
            )}
          </div>

          <button
            onClick={() => setIsRegisterDrawerOpen(true)}
            className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-4 py-2 text-xs font-bold shadow flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Register van</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] dark:text-[#9DB0A2] border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <tr>
                <th className="py-3.5 px-6 font-bold">Plate</th>
                <th className="py-3.5 px-6 font-bold">Type</th>
                <th className="py-3.5 px-6 font-bold">Capacity</th>
                <th className="py-3.5 px-6 font-bold">Driver</th>
                <th className="py-3.5 px-6 font-bold">Route</th>
                <th className="py-3.5 px-6 font-bold">Insurance</th>
                <th className="py-3.5 px-6 font-bold">PUC</th>
                <th className="py-3.5 px-6 font-bold">GPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE3] dark:divide-[#2A3B31]">
              {filteredVans.map((van) => {
                const isOnline = van.status === 'on_shift';
                const isOffline = van.status === 'offline';
                const isUnassigned = !van.driverName || van.driverName === 'Unassigned';

                return (
                  <tr key={van.id} className="hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] transition-colors">
                    {/* Plate */}
                    <td className="py-4 px-6 font-mono font-bold text-[#14201A] dark:text-[#EAF2E6]">
                      {van.plateNo}
                    </td>

                    {/* Type */}
                    <td className="py-4 px-6 font-medium text-[#14201A] dark:text-[#EAF2E6]">
                      {van.type || 'Tata Ace'}
                    </td>

                    {/* Capacity */}
                    <td className="py-4 px-6 font-medium text-[#566259] dark:text-[#9DB0A2]">
                      {van.capacity || '750 kg'}
                    </td>

                    {/* Driver */}
                    <td className="py-4 px-6">
                      {isUnassigned ? (
                        <span className="rounded-full bg-[#FFF8E6] text-[#A66800] dark:bg-[#332611] dark:text-[#F3BA54] px-2.5 py-0.5 text-[11px] font-bold">
                          ! Unassigned
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-[#E5EAE3] dark:bg-[#2A3B31] font-bold text-[10px] flex items-center justify-center">
                            {van.driverName?.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{van.driverName}</div>
                            <div className="text-[10px] text-[#566259]">Driver</div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Route */}
                    <td className="py-4 px-6 font-medium text-[#14201A] dark:text-[#EAF2E6]">
                      {van.routeId === 'route_east' ? 'East' : van.routeId === 'route_west' ? 'West' : 'North'}
                    </td>

                    {/* Insurance */}
                    <td className="py-4 px-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          van.insuranceExpiry?.includes('2026')
                            ? 'bg-[#FFF8E6] text-[#A66800] dark:bg-[#332611] dark:text-[#F3BA54]'
                            : 'bg-[#EAF5EC] text-[#1B7A3F] dark:bg-[#163321] dark:text-[#6DB36F]'
                        }`}
                      >
                        {van.insuranceExpiry?.includes('2026') ? '! ' : '✓ '}
                        {van.insuranceExpiry || 'Mar 2027'}
                      </span>
                    </td>

                    {/* PUC */}
                    <td className="py-4 px-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          van.pucExpiry?.includes('2026')
                            ? 'bg-[#FFF8E6] text-[#A66800] dark:bg-[#332611] dark:text-[#F3BA54]'
                            : 'bg-[#EAF5EC] text-[#1B7A3F] dark:bg-[#163321] dark:text-[#6DB36F]'
                        }`}
                      >
                        {van.pucExpiry?.includes('2026') ? '! ' : '✓ '}
                        {van.pucExpiry || 'Jan 2027'}
                      </span>
                    </td>

                    {/* GPS Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isOffline
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                            : 'bg-[#EAF5EC] text-[#1B7A3F] dark:bg-[#163321] dark:text-[#6DB36F]'
                        }`}
                      >
                        {isOffline ? '! Offline' : '✓ Online'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Van Drawer (Canvas A08) */}
      {isRegisterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsRegisterDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-[#16221B] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto z-10 animate-slide-left">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Register van
                </h2>
                <button
                  onClick={() => setIsRegisterDrawerOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleRegisterVan} id="register-van-form" className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Plate number
                  </label>
                  <input
                    type="text"
                    required
                    value={plateNo}
                    onChange={(e) => setPlateNo(e.target.value)}
                    placeholder="GJ-17-AB-XXXX"
                    className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs font-mono font-bold text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={vanType}
                    onChange={(e) => setVanType(e.target.value)}
                    className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                  >
                    <option value="Tata Ace">Tata Ace</option>
                    <option value="Mahindra Jeeto">Mahindra Jeeto</option>
                    <option value="Electric Mini Tipper">Electric Mini Tipper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Payload Capacity
                  </label>
                  <input
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Insurance valid until
                  </label>
                  <input
                    type="text"
                    value={insuranceExpiry}
                    onChange={(e) => setInsuranceExpiry(e.target.value)}
                    className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    PUC certificate valid until
                  </label>
                  <input
                    type="text"
                    value={pucExpiry}
                    onChange={(e) => setPucExpiry(e.target.value)}
                    className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                  />
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-[#E5EAE3] dark:border-[#2A3B31] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRegisterDrawerOpen(false)}
                className="rounded-full px-5 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="register-van-form"
                className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
