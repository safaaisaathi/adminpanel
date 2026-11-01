import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Driver, Ward, Van } from '../types';
import {
  GripVertical,
  Check,
  AlertTriangle,
  Truck,
  Plus,
  X,
  User,
  ArrowRight
} from 'lucide-react';

export const A14_Allotment: React.FC = () => {
  const { wards, drivers, vans, saveAllotments } = useApp();

  // Initial state for ward allotments: map wardId to { driverIds, vanPlate }
  const [allotmentState, setAllotmentState] = useState<Record<string, { driverIds: string[]; vanPlate: string }>>({
    ward_4: { driverIds: ['drv_ramesh'], vanPlate: 'GJ-17-AB-1234' },
    ward_5: { driverIds: ['drv_suresh'], vanPlate: 'GJ-17-AB-1301' },
    ward_6: { driverIds: ['drv_dilip'], vanPlate: 'GJ-17-CD-2210' },
    ward_7: { driverIds: ['drv_anil'], vanPlate: 'GJ-17-EF-3001' },
    ward_8: { driverIds: [], vanPlate: 'GJ-17-CD-2255' },
    ward_9: { driverIds: [], vanPlate: 'Choose a van' },
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedDriverForMove, setSelectedDriverForMove] = useState<string | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(
    'Kiran Solanki is already allotted to Ward 7 for the same shift'
  );

  // Compute unassigned drivers
  const assignedDriverIdSet = new Set(
    Object.values(allotmentState).flatMap(a => a.driverIds)
  );

  const unassignedDrivers = drivers.filter(d => !assignedDriverIdSet.has(d.id));

  const handleAssignDriverToWard = (driverId: string, wardId: string) => {
    // Check conflict
    const driver = drivers.find(d => d.id === driverId);
    if (driverId === 'drv_kiran') {
      setConflictWarning('Kiran Solanki is already allotted to Ward 7 for the same shift');
    } else {
      setConflictWarning(null);
    }

    setAllotmentState(prev => ({
      ...prev,
      [wardId]: {
        ...prev[wardId],
        driverIds: [...(prev[wardId]?.driverIds || []).filter(id => id !== driverId), driverId]
      }
    }));
    setSelectedDriverForMove(null);
  };

  const handleRemoveDriverFromWard = (driverId: string, wardId: string) => {
    setAllotmentState(prev => ({
      ...prev,
      [wardId]: {
        ...prev[wardId],
        driverIds: (prev[wardId]?.driverIds || []).filter(id => id !== driverId)
      }
    }));
  };

  const handleCycleVan = (wardId: string) => {
    const availablePlates = vans.map(v => v.plateNo);
    const current = allotmentState[wardId]?.vanPlate;
    const currentIndex = availablePlates.indexOf(current);
    const nextPlate = availablePlates[(currentIndex + 1) % availablePlates.length];

    setAllotmentState(prev => ({
      ...prev,
      [wardId]: {
        ...prev[wardId],
        vanPlate: nextPlate
      }
    }));
  };

  const handleSave = () => {
    saveAllotments(allotmentState as any);
    setToastMessage('Allotments saved and sent to driver apps');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 pb-16 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#111A14] text-white px-5 py-3 shadow-2xl flex items-center gap-2 text-xs font-bold animate-slide-up">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Conflict Banner (Canvas A14) */}
      {conflictWarning && (
        <div className="flex items-center justify-between rounded-2xl bg-[#FFF8E6] dark:bg-[#332611] text-[#A66800] dark:text-[#F3BA54] px-5 py-3 text-xs font-bold border border-[#E8A317]">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={16} className="shrink-0" />
            <span>! {conflictWarning}</span>
          </div>
          <button
            onClick={() => setConflictWarning(null)}
            className="p-1 hover:opacity-75"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Save Button Header */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow flex items-center gap-2 transition-transform active:scale-95"
        >
          <Check size={15} />
          <span>Save allotments</span>
        </button>
      </div>

      {/* Main Grid: Left Unassigned Drivers + Right Ward Cards Grid (Canvas A14) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Unassigned Drivers Card (Canvas A14) */}
        <div className="lg:col-span-4 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
          <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
            Unassigned drivers
          </h3>
          <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5 mb-4">
            Click a driver, then click a ward card to allot
          </p>

          <div className="space-y-3">
            {unassignedDrivers.map((driver) => {
              const isSelected = selectedDriverForMove === driver.id;
              const initials = driver.name.split(' ').map(n => n[0]).join('').slice(0, 2);

              return (
                <div
                  key={driver.id}
                  onClick={() => setSelectedDriverForMove(isSelected ? null : driver.id)}
                  className={`cursor-pointer flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-[#EBF3EB] border-[#1B7A3F] shadow-sm'
                      : 'bg-[#F8FAF7] dark:bg-[#111A14] border-[#E5EAE3] dark:border-[#2A3B31] hover:bg-[#EAEFE9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-[#566259]" />
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5EAE3] dark:bg-[#2A3B31] font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                      {initials}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                        {driver.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#566259]">
                        {driver.driverId}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-bold text-[#1B7A3F] uppercase">
                      Select ward
                    </span>
                  )}
                </div>
              );
            })}

            {unassignedDrivers.length === 0 && (
              <div className="p-6 text-center text-xs text-[#566259]">
                All drivers are currently allotted.
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Grid of Ward Cards (Canvas A14) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wards.map((ward) => {
            const allotment = allotmentState[ward.id] || { driverIds: [], vanPlate: 'Choose a van' };
            const assignedDrivers = drivers.filter(d => allotment.driverIds.includes(d.id));

            return (
              <div
                key={ward.id}
                onClick={() => {
                  if (selectedDriverForMove) {
                    handleAssignDriverToWard(selectedDriverForMove, ward.id);
                  }
                }}
                className={`rounded-[26px] bg-white dark:bg-[#16221B] p-5 shadow-sm border flex flex-col justify-between min-h-[220px] transition-all ${
                  selectedDriverForMove
                    ? 'border-dashed border-[#1B7A3F] bg-[#F8FAF7] cursor-pointer hover:bg-[#EAF5EC]'
                    : 'border-[#E5EAE3] dark:border-[#2A3B31]'
                }`}
              >
                <div>
                  {/* Ward Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                        {ward.name}
                      </h4>
                      <div className="text-[10px] font-mono text-[#566259]">
                        {ward.code}
                      </div>
                    </div>
                  </div>

                  {/* Assigned Drivers Chips */}
                  <div className="mt-4 space-y-2">
                    {assignedDrivers.map(d => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between rounded-xl bg-[#EAF5EC] dark:bg-[#163321] text-[#1B7A3F] dark:text-[#6DB36F] px-3 py-1.5 text-xs font-bold"
                      >
                        <div className="flex items-center gap-1.5">
                          <User size={13} />
                          <span>{d.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveDriverFromWard(d.id, ward.id);
                          }}
                          className="hover:opacity-75"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}

                    {/* Drop target dashed slot (Canvas A14) */}
                    <div className="rounded-xl border-2 border-dashed border-[#DCE5D9] dark:border-[#2A3B31] py-2.5 text-center text-xs font-medium text-[#566259] hover:bg-neutral-50 dark:hover:bg-[#111A14]">
                      {selectedDriverForMove ? 'Click to assign driver' : 'Drop driver here'}
                    </div>
                  </div>
                </div>

                {/* Bottom Van Pill (Canvas A14) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCycleVan(ward.id);
                  }}
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] hover:bg-[#EAEFE9] text-[#14201A] dark:text-[#EAF2E6] py-2 text-xs font-mono font-bold transition-colors"
                  title="Click to cycle assigned van"
                >
                  <Truck size={14} className="text-[#1B7A3F]" />
                  <span>{allotment.vanPlate}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
