import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusChip } from '../components/StatusChip';
import { Truck, MapPin, KeyRound, Plus, Battery, Check, X, ShieldAlert } from 'lucide-react';
import { Van, Route } from '../types';

export const A6_VansRoutes: React.FC = () => {
  const { t, scopedVans, routes, scopedWards, addVan, addRoute, setDriverPin } = useApp();

  // Modals
  const [showAddVanModal, setShowAddVanModal] = useState(false);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedVanForPin, setSelectedVanForPin] = useState<Van | null>(null);

  // Form states
  const [newPlateNo, setNewPlateNo] = useState('');
  const [newVanRouteId, setNewVanRouteId] = useState('');
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteStartTime, setNewRouteStartTime] = useState('07:00');
  const [selectedWardIds, setSelectedWardIds] = useState<string[]>([]);
  const [pinValue, setPinValue] = useState('');
  const [pinSuccessNotice, setPinSuccessNotice] = useState('');

  const handleCreateVan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlateNo || !newVanRouteId) return;

    addVan({
      plateNo: newPlateNo.trim().toUpperCase(),
      routeId: newVanRouteId,
      status: 'idle',
      batteryPct: 100,
    });

    setNewPlateNo('');
    setNewVanRouteId('');
    setShowAddVanModal(false);
  };

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName || selectedWardIds.length === 0) return;

    addRoute({
      name: newRouteName.trim(),
      wardIds: selectedWardIds,
      scheduledStartTime: newRouteStartTime,
    });

    setNewRouteName('');
    setSelectedWardIds([]);
    setShowAddRouteModal(false);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVanForPin || pinValue.length < 4) return;

    setDriverPin(selectedVanForPin.id, pinValue);
    setPinSuccessNotice(`PIN securely updated for van ${selectedVanForPin.plateNo}`);
    setTimeout(() => {
      setPinSuccessNotice('');
      setShowPinModal(false);
      setPinValue('');
      setSelectedVanForPin(null);
    }, 1800);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#14201A] dark:text-[#EAF2E6]">
            {t.vansRoutesPage.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#566259] dark:text-[#9DB0A2] mt-0.5">
            Fleet dispatch, route sequences, and driver PIN authentication
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddVanModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#111A14] dark:bg-[#F2F7EE] px-3.5 py-2 text-xs font-semibold text-white dark:text-[#0E1612] hover:opacity-90"
          >
            <Plus size={14} />
            <span>{t.vansRoutesPage.addVan}</span>
          </button>
          <button
            onClick={() => setShowAddRouteModal(true)}
            className="flex items-center gap-1.5 rounded-full border border-[#DCE5D9] dark:border-[#2A3B31] bg-white dark:bg-[#16221B] px-3.5 py-2 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Plus size={14} />
            <span>{t.vansRoutesPage.addRoute}</span>
          </button>
        </div>
      </div>

      {/* Fleet Vehicles Grid */}
      <div className="rounded-[22px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-4 sm:p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
        <h2 className="text-base sm:text-lg font-bold text-[#14201A] dark:text-[#EAF2E6] mb-3">
          Active Sanitation Vans ({scopedVans.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {scopedVans.map((van) => {
            const assignedRoute = routes.find((r) => r.id === van.routeId);
            return (
              <div
                key={van.id}
                className="rounded-2xl border border-[#DCE5D9] dark:border-[#2A3B31] bg-[#F3F6F2] dark:bg-[#1E2D24] p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E4F1DF] dark:bg-[#1F3A2A] text-[#1B7A3F] dark:text-[#6DB36F]">
                        <Truck size={16} />
                      </div>
                      <span className="font-mono font-bold text-sm text-[#14201A] dark:text-[#EAF2E6]">
                        {van.plateNo}
                      </span>
                    </div>
                    <StatusChip status={van.status} size="sm" />
                  </div>

                  <div className="mt-3 text-xs space-y-1.5 text-[#566259] dark:text-[#9DB0A2]">
                    <div>
                      <span className="font-medium text-[#14201A] dark:text-[#EAF2E6]">Route: </span>
                      {assignedRoute?.name || 'Unassigned'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Battery size={14} className={van.batteryPct <= 20 ? 'text-[#D93025]' : 'text-[#1B7A3F]'} />
                      <span>Battery: {van.batteryPct}%</span>
                    </div>
                    <div>
                      Last GPS Speed: <span className="font-semibold text-[#14201A] dark:text-[#EAF2E6]">{van.lastLocation.speedKmph} km/h</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DCE5D9] dark:border-[#2A3B31] flex justify-between items-center">
                  <span className="text-[10px] text-neutral-400">
                    ID: {van.id}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedVanForPin(van);
                      setShowPinModal(true);
                    }}
                    className="flex items-center gap-1 rounded-full bg-white dark:bg-[#16221B] border border-[#DCE5D9] dark:border-[#2A3B31] px-3 py-1 text-xs font-semibold text-[#1B7A3F] dark:text-[#6DB36F] hover:bg-[#E4F1DF] transition-colors"
                  >
                    <KeyRound size={13} />
                    <span>Set PIN</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routes & Visiting Sequence */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
        <h2 className="text-lg font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
          Sanitation Routes & Ward Coverage Sequences
        </h2>

        <div className="space-y-4">
          {routes.map((route) => (
            <div
              key={route.id}
              className="rounded-2xl border border-[#DCE5D9] dark:border-[#2A3B31] bg-[#F3F6F2] dark:bg-[#1E2D24] p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE5D9] dark:border-[#2A3B31]">
                <div>
                  <h3 className="font-bold text-sm text-[#14201A] dark:text-[#EAF2E6]">
                    {route.name}
                  </h3>
                  <div className="text-xs text-[#566259] dark:text-[#9DB0A2]">
                    Route ID: {route.id}
                  </div>
                </div>
                <div className="text-xs font-semibold text-[#1B7A3F] dark:text-[#6DB36F] bg-[#E4F1DF] dark:bg-[#1F3A2A] px-3 py-1 rounded-full self-start">
                  Scheduled Start: {route.scheduledStartTime} AM
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2] mb-2">
                  Visiting Order ({route.wardIds.length} Stops):
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {route.wardIds.map((wid, idx) => {
                    const ward = scopedWards.find((w) => w.id === wid);
                    return (
                      <React.Fragment key={wid}>
                        <div className="flex items-center gap-1.5 rounded-full bg-white dark:bg-[#16221B] border border-[#DCE5D9] dark:border-[#2A3B31] px-3 py-1.5 text-xs font-medium text-[#14201A] dark:text-[#EAF2E6]">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#111A14] dark:bg-[#F2F7EE] text-[9px] font-bold text-white dark:text-[#0E1612]">
                            {idx + 1}
                          </span>
                          <span>{ward?.name || wid}</span>
                        </div>
                        {idx < route.wardIds.length - 1 && (
                          <span className="text-neutral-400 font-bold">→</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register Van Modal */}
      {showAddVanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-elev3 border border-[#DCE5D9] dark:border-[#2A3B31]">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-[#14201A] dark:text-[#EAF2E6]">
                {t.vansRoutesPage.addVan}
              </h3>
              <button onClick={() => setShowAddVanModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateVan} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  {t.vansRoutesPage.plateNo}
                </label>
                <input
                  type="text"
                  value={newPlateNo}
                  onChange={(e) => setNewPlateNo(e.target.value)}
                  placeholder="GJ-17-GD-8901"
                  required
                  className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Assign Route
                </label>
                <select
                  value={newVanRouteId}
                  onChange={(e) => setNewVanRouteId(e.target.value)}
                  required
                  className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs"
                >
                  <option value="">Select Route</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVanModal(false)}
                  className="flex-1 rounded-full border border-neutral-300 dark:border-neutral-700 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#111A14] dark:bg-[#F2F7EE] py-2 text-xs font-semibold text-white dark:text-[#0E1612]"
                >
                  Register Van
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Driver PIN Modal (F-A9 / PRD 0.7 Cloud Function Callable setDriverPin) */}
      {showPinModal && selectedVanForPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-elev3 border border-[#DCE5D9] dark:border-[#2A3B31]">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-[#14201A] dark:text-[#EAF2E6]">
                Set Driver PIN ({selectedVanForPin.plateNo})
              </h3>
              <button onClick={() => setShowPinModal(false)}>✕</button>
            </div>

            {pinSuccessNotice ? (
              <div className="my-6 flex items-center gap-2 rounded-2xl bg-[#DDF3E4] p-3 text-xs font-semibold text-[#146B3A]">
                <Check size={16} />
                <span>{pinSuccessNotice}</span>
              </div>
            ) : (
              <form onSubmit={handleSavePin} className="mt-4 space-y-4">
                <p className="text-xs text-[#566259] dark:text-[#9DB0A2]">
                  Sets the 4-digit PIN for driver authentication. Saved as SHA-256 hash in Firebase <code>vanSecrets</code> collection.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    4-Digit Driver PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinValue}
                    onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    required
                    className="w-full text-center tracking-widest text-lg font-bold rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className="flex-1 rounded-full border border-neutral-300 dark:border-neutral-700 py-2 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pinValue.length < 4}
                    className="flex-1 rounded-full bg-[#1B7A3F] py-2 text-xs font-semibold text-white disabled:opacity-40"
                  >
                    Save Secret PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
