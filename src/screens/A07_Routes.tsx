import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GripVertical,
  Plus,
  Clock,
  Truck,
  Check,
  ArrowUpDown,
  X
} from 'lucide-react';

export const A07_Routes: React.FC = () => {
  const { routes, wards, vans, saveRoute } = useApp();

  const [selectedRoute, setSelectedRoute] = useState(routes[0] || null);

  // Wards sequence in visiting order
  const [orderedWardIds, setOrderedWardIds] = useState<string[]>(
    selectedRoute?.wardIds || ['ward_4', 'ward_5', 'ward_6', 'ward_7']
  );
  const [startTime, setStartTime] = useState(selectedRoute?.scheduledStartTime || '07:30 AM');
  const [selectedVanPlate, setSelectedVanPlate] = useState(selectedRoute?.vanPlate || 'GJ-17-AB-1234');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Distances per ward mock
  const distances: Record<string, number> = {
    ward_4: 1.2,
    ward_5: 1.8,
    ward_6: 1.5,
    ward_7: 2.1,
    ward_8: 1.6,
    ward_9: 2.4,
  };

  const totalDistance = orderedWardIds.reduce((acc, id) => acc + (distances[id] || 1.5), 0).toFixed(1);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...orderedWardIds];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setOrderedWardIds(next);
  };

  const moveDown = (index: number) => {
    if (index === orderedWardIds.length - 1) return;
    const next = [...orderedWardIds];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setOrderedWardIds(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoute) return;
    saveRoute(selectedRoute.id, orderedWardIds, startTime, selectedVanPlate);
    setToastMessage('Route saved successfully');
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

      {/* Main Grid: Left Route Order Form, Right Path Map (Canvas A07) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Column: Route Order Card (Canvas A07) */}
        <div className="lg:col-span-6 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6]">
              {selectedRoute?.name || 'East route'}
            </h2>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
              Ward order (drag or use arrows to change sequence)
            </p>

            {/* Ward sequence list */}
            <div className="mt-5 space-y-2.5">
              {orderedWardIds.map((wardId, index) => {
                const ward = wards.find((w) => w.id === wardId);
                const km = distances[wardId] || 1.5;

                return (
                  <div
                    key={wardId}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] text-xs transition-colors hover:bg-[#EAEFE9]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="text-[#566259] hover:text-[#14201A] disabled:opacity-20 text-[9px]"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDown(index)}
                          disabled={index === orderedWardIds.length - 1}
                          className="text-[#566259] hover:text-[#14201A] disabled:opacity-20 text-[9px]"
                        >
                          ▼
                        </button>
                      </div>

                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111A14] text-white text-[11px] font-bold">
                        {index + 1}
                      </div>

                      <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">
                        {ward?.name || `Ward ${index + 4}`}
                      </span>
                    </div>

                    <span className="text-[#566259] font-medium">{km} km</span>
                  </div>
                );
              })}
            </div>

            {/* Add Ward Button */}
            <button
              type="button"
              onClick={() => {
                const unrouted = wards.find((w) => !orderedWardIds.includes(w.id));
                if (unrouted) {
                  setOrderedWardIds([...orderedWardIds, unrouted.id]);
                } else {
                  alert('All wards are currently included in this route');
                }
              }}
              className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#E5EAE3] dark:border-[#2A3B31] py-3 text-xs font-bold text-[#1B7A3F] hover:bg-[#F3FAF4] transition-colors"
            >
              <Plus size={15} />
              <span>Add ward</span>
            </button>

            {/* Timing & Van Selection Form */}
            <div className="mt-6 space-y-4 pt-4 border-t border-[#E5EAE3] dark:border-[#2A3B31]">
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Start time
                </label>
                <div className="flex items-center rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs">
                  <Clock size={16} className="text-[#566259] mr-2.5" />
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-transparent outline-none font-medium text-[#14201A] dark:text-[#EAF2E6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Van
                </label>
                <div className="flex items-center rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs">
                  <Truck size={16} className="text-[#566259] mr-2.5" />
                  <select
                    value={selectedVanPlate}
                    onChange={(e) => setSelectedVanPlate(e.target.value)}
                    className="w-full bg-transparent outline-none font-medium text-[#14201A] dark:text-[#EAF2E6]"
                  >
                    {vans.map((v) => (
                      <option key={v.id} value={v.plateNo}>
                        {v.plateNo} · {v.type || 'Tata Ace'} ({v.driverName || 'Ramesh Bhai'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="flex items-center gap-3 pt-2">
                <span className="rounded-xl bg-[#F3F6F2] dark:bg-[#1E2D24] px-3 py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  {totalDistance} km
                </span>
                <span className="rounded-xl bg-[#F3F6F2] dark:bg-[#1E2D24] px-3 py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  About 3 h 20 min
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-[#E5EAE3] dark:border-[#2A3B31] flex justify-end">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-8 py-3 text-xs font-bold shadow flex items-center justify-center gap-2 active:scale-95"
            >
              <Check size={15} />
              <span>Save route</span>
            </button>
          </div>
        </div>

        {/* Right Column: Numbered Route Path Map (Canvas A07) */}
        <div className="lg:col-span-6 rounded-[28px] bg-white dark:bg-[#16221B] p-5 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
              Visiting Order: 1 → 2 → 3 → 4
            </div>
            <span className="text-xs text-[#1B7A3F] font-bold">
              Active sequence
            </span>
          </div>

          {/* SVG Map of Polygons & Numbered Trail */}
          <div className="relative h-[480px] w-full bg-[#F3F7F2] dark:bg-[#111A14] rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31]">
            <svg viewBox="0 0 500 480" className="w-full h-full">
              {/* Roads */}
              <path d="M 0 240 Q 250 200 500 240" stroke="#FFF" strokeWidth="14" fill="none" opacity="0.9" />

              {/* Ward 4 Polygon */}
              <polygon points="60,80 180,60 190,180 80,190" fill="#C6E7C9" opacity="0.6" stroke="#1B7A3F" strokeWidth="2" />
              {/* Ward 5 Polygon */}
              <polygon points="220,90 380,110 370,220 230,200" fill="#C6E7C9" opacity="0.6" stroke="#1B7A3F" strokeWidth="2" />
              {/* Ward 6 Polygon */}
              <polygon points="100,230 220,220 210,340 90,330" fill="#C6E7C9" opacity="0.6" stroke="#1B7A3F" strokeWidth="2" />
              {/* Ward 7 Polygon */}
              <polygon points="250,230 420,240 400,360 240,350" fill="#C6E7C9" opacity="0.6" stroke="#1B7A3F" strokeWidth="2" />

              {/* Dotted Route Connecting Line */}
              <path
                d="M 130 130 L 300 150 L 150 280 L 330 290"
                stroke="#1B7A3F"
                strokeWidth="3.5"
                strokeDasharray="6 6"
                fill="none"
              />

              {/* Numbered Stops: 1, 2, 3, 4 */}
              <circle cx="130" cy="130" r="14" fill="#111A14" />
              <text x="126" y="135" fontSize="13" fontWeight="bold" fill="#FFF">1</text>

              <circle cx="300" cy="150" r="14" fill="#111A14" />
              <text x="296" y="155" fontSize="13" fontWeight="bold" fill="#FFF">2</text>

              <circle cx="150" cy="280" r="14" fill="#111A14" />
              <text x="146" y="285" fontSize="13" fontWeight="bold" fill="#FFF">3</text>

              <circle cx="330" cy="290" r="14" fill="#111A14" />
              <text x="326" y="295" fontSize="13" fontWeight="bold" fill="#FFF">4</text>
            </svg>

            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 dark:bg-[#16221B]/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-[#14201A] dark:text-[#EAF2E6] shadow">
              East route: 4 wards · {totalDistance} km
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
