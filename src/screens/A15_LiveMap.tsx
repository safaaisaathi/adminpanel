import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import { Van, Driver } from '../types';
import {
  Search,
  Phone,
  MessageSquare,
  Route as RouteIcon,
  ArrowRight,
  BatteryCharging,
  Gauge,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface A15LiveMapProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A15_LiveMap: React.FC<A15LiveMapProps> = ({ onNavigateTo }) => {
  const { vans, drivers, isSimulating, toggleSimulation } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'moving' | 'stopped' | 'offline'>('all');
  const [selectedRoute, setSelectedRoute] = useState('all');

  // Selected van for A16 Van Details Bubble
  const [selectedVan, setSelectedVan] = useState<Van | null>(vans[0] || null);

  const filteredVans = vans.filter((v) => {
    if (statusFilter === 'moving') return v.status === 'on_shift' && (v.lastLocation?.speedKmph || 0) > 0;
    if (statusFilter === 'stopped') return v.status === 'idle' || (v.status === 'on_shift' && (v.lastLocation?.speedKmph || 0) === 0);
    if (statusFilter === 'offline') return v.status === 'offline';
    return true;
  }).filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return v.plateNo.toLowerCase().includes(q) || (v.driverName && v.driverName.toLowerCase().includes(q));
  });

  const getDriver = (driverId?: string) => {
    return drivers.find(d => d.id === driverId || d.name === driverId) || drivers[0];
  };

  const selectedDriver = selectedVan ? getDriver(selectedVan.driverId) : drivers[0];

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[620px] rounded-[32px] overflow-hidden border border-[#E5EAE3] dark:border-[#2A3B31] shadow-sm bg-[#EBF3EB] dark:bg-[#111A14]">
      {/* Full SVG Map Background with Ward Polygons and Vans */}
      <div className="absolute inset-0 w-full h-full">
        <svg viewBox="0 0 1000 680" className="w-full h-full object-cover">
          {/* Main roads */}
          <path d="M 0 340 Q 500 280 1000 360" stroke="#FFF" strokeWidth="24" fill="none" opacity="0.85" />
          <path d="M 450 0 Q 420 340 480 680" stroke="#FFF" strokeWidth="18" fill="none" opacity="0.85" />
          <path d="M 720 0 Q 690 340 760 680" stroke="#FFF" strokeWidth="16" fill="none" opacity="0.85" />
          <path d="M 150 180 Q 450 220 850 160" stroke="#FFF" strokeWidth="14" fill="none" opacity="0.8" />

          {/* Ward Outlines (Godhra Nagarpalika Wards) */}
          <polygon points="120,80 320,60 340,260 140,280" fill="#C6E7C9" opacity="0.45" stroke="#1B7A3F" strokeWidth="2" />
          <text x="180" y="160" fontSize="14" fontWeight="bold" fill="#14201A">Ward 4</text>

          <polygon points="360,80 620,110 600,320 370,290" fill="#C6E7C9" opacity="0.45" stroke="#1B7A3F" strokeWidth="2" />
          <text x="440" y="180" fontSize="14" fontWeight="bold" fill="#14201A">Ward 5</text>

          <polygon points="180,310 400,300 380,520 160,500" fill="#FCE3C8" opacity="0.45" stroke="#E87A17" strokeWidth="2" />
          <text x="250" y="400" fontSize="14" fontWeight="bold" fill="#14201A">Ward 6</text>

          <polygon points="420,320 720,350 680,560 410,540" fill="#C6E7C9" opacity="0.45" stroke="#1B7A3F" strokeWidth="2" />
          <text x="520" y="420" fontSize="14" fontWeight="bold" fill="#14201A">Ward 7</text>

          <polygon points="650,110 920,130 890,340 640,330" fill="#D3E8D6" opacity="0.45" stroke="#1B7A3F" strokeWidth="2" />
          <text x="740" y="210" fontSize="14" fontWeight="bold" fill="#14201A">Ward 8</text>

          {/* Active Van Markers */}
          {vans.map((v, i) => {
            const isSelected = selectedVan?.id === v.id;
            const isMoving = v.status === 'on_shift';
            const isOffline = v.status === 'offline';

            // Coordinates for demo display
            const positions: Record<string, [number, number]> = {
              van_1: [470, 260],
              van_2: [240, 190],
              van_3: [290, 410],
              van_4: [780, 240],
              van_5: [560, 430]
            };

            const [cx, cy] = positions[v.id] || [500 + i * 40, 300 + i * 30];
            const color = isOffline ? '#D93025' : isMoving ? '#1B7A3F' : '#E8A317';

            return (
              <g
                key={v.id}
                onClick={() => setSelectedVan(v)}
                className="cursor-pointer group"
              >
                {/* Selected Black Ring (Canvas A16) */}
                {isSelected && (
                  <circle cx={cx} cy={cy} r="26" fill="none" stroke="#111A14" strokeWidth="3" />
                )}

                {/* Pulsing ring if moving */}
                {isMoving && !isOffline && (
                  <circle cx={cx} cy={cy} r="20" fill={color} opacity="0.3" className="animate-ping origin-center" />
                )}

                {/* Van Circle */}
                <circle cx={cx} cy={cy} r="15" fill={color} stroke="#FFF" strokeWidth="2" />

                {/* Van Mini Icon */}
                <text x={cx - 7} y={cy + 5} fontSize="12" fill="#FFF">🛺</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Left Floating Card: Vehicles Filter (Canvas A15) */}
      <div className="absolute top-5 left-5 z-20 w-80 rounded-3xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md p-5 shadow-xl border border-[#E5EAE3] dark:border-[#2A3B31]">
        <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-3">
          Vehicles
        </h3>

        {/* Search input */}
        <div className="flex items-center gap-2 rounded-full bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-1.5 text-xs text-[#566259] mb-3">
          <Search size={14} />
          <input
            type="text"
            placeholder="Plate or driver"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-xs text-[#14201A] dark:text-[#EAF2E6]"
          />
        </div>

        {/* Status Pills with Counts */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold mb-3">
          <button
            onClick={() => setStatusFilter(statusFilter === 'moving' ? 'all' : 'moving')}
            className={`rounded-full py-1.5 px-3 text-left transition-colors ${
              statusFilter === 'moving'
                ? 'bg-[#1B7A3F] text-white'
                : 'bg-[#EAF5EC] text-[#1B7A3F]'
            }`}
          >
            ✓ Moving 24
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'stopped' ? 'all' : 'stopped')}
            className={`rounded-full py-1.5 px-3 text-left transition-colors ${
              statusFilter === 'stopped'
                ? 'bg-[#E8A317] text-white'
                : 'bg-[#FFF8E6] text-[#A66800]'
            }`}
          >
            ! Stopped 8
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'offline' ? 'all' : 'offline')}
            className={`rounded-full py-1.5 px-3 text-left transition-colors ${
              statusFilter === 'offline'
                ? 'bg-[#D93025] text-white'
                : 'bg-red-50 text-red-700'
            }`}
          >
            ! Offline 2
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-full py-1.5 px-3 text-left transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#111A14] text-white'
                : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            All wards
          </button>
        </div>

        {/* Route Select */}
        <div>
          <label className="block text-[11px] font-semibold text-[#566259] mb-1">Route</label>
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-2 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] outline-none"
          >
            <option value="all">All routes</option>
            <option value="east">East route</option>
            <option value="west">West route</option>
            <option value="north">North route</option>
          </select>
        </div>
      </div>

      {/* Right Floating Card: Running Vans (34) or Selected Van Bubble A16 */}
      {selectedVan ? (
        /* Van Details Bubble (Canvas A16 `LiveBubble`) */
        <div className="absolute top-5 right-5 z-20 w-96 rounded-3xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md p-6 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] animate-slide-left">
          {/* Top Driver Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#1B7A3F] text-white font-bold text-base flex items-center justify-center">
                {selectedDriver?.name?.slice(0, 2).toUpperCase() || 'RB'}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#14201A] dark:text-[#EAF2E6]">
                  {selectedDriver?.name || 'Ramesh Bhai'}
                </h4>
                <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                  {selectedDriver?.driverId || 'GDH-D-0042'} · {selectedDriver?.phone || '+91 98xxxx42'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#EAF5EC] text-[#1B7A3F] px-2.5 py-0.5 text-[10px] font-bold">
                ✓ Moving {selectedVan.lastLocation?.speedKmph || 18} km/h
              </span>
              <button
                onClick={() => setSelectedVan(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Van Plate & Type */}
          <div className="mt-4 pb-3 border-b border-[#E5EAE3] dark:border-[#2A3B31] text-xs">
            <div className="font-mono font-bold text-[#14201A] dark:text-[#EAF2E6]">
              {selectedVan.plateNo} <span className="font-sans font-normal text-[#566259]">• {selectedVan.type || 'Tata Ace'}</span>
            </div>
            <div className="text-[11px] text-[#566259] mt-0.5">
              East route · started 07:28
            </div>
          </div>

          {/* Wards done progress */}
          <div className="mt-3 text-xs">
            <div className="flex justify-between font-bold text-[#14201A] dark:text-[#EAF2E6] mb-1">
              <span>Wards done: 4 of 9</span>
              <span>44%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] overflow-hidden mb-2">
              <div className="h-full bg-[#1B7A3F] rounded-full" style={{ width: '44%' }} />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                ✓ Ward 4
              </span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                ✓ Ward 5
              </span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                ✓ Ward 6
              </span>
            </div>
          </div>

          {/* 4 Stat Boxes (Canvas A16: Speed, Battery, Updated, GPS) */}
          <div className="grid grid-cols-4 gap-2 mt-4 text-center">
            <div className="rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] p-2 border">
              <div className="text-[9px] text-[#566259]">Speed</div>
              <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                {selectedVan.lastLocation?.speedKmph || 18} km/h
              </div>
            </div>
            <div className="rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] p-2 border">
              <div className="text-[9px] text-[#566259]">Battery</div>
              <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                {selectedVan.batteryPct}%
              </div>
            </div>
            <div className="rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] p-2 border">
              <div className="text-[9px] text-[#566259]">Updated</div>
              <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                8 s ago
              </div>
            </div>
            <div className="rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] p-2 border">
              <div className="text-[9px] text-[#566259]">GPS</div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                Good
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-[#566259] font-medium">
            Today: 4 wards, 28 km, 1 report revisited
          </div>

          {/* Action Buttons: Call, Message, Trail (Canvas A16) */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <a
              href={`tel:${selectedDriver?.phone || '+919800000000'}`}
              className="flex items-center justify-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111A14] py-2 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50"
            >
              <Phone size={13} />
              <span>Call</span>
            </a>
            <button
              onClick={() => onNavigateTo('notices')}
              className="flex items-center justify-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111A14] py-2 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50"
            >
              <MessageSquare size={13} />
              <span>Message</span>
            </button>
            <button
              onClick={() => onNavigateTo('tripReplay')}
              className="flex items-center justify-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111A14] py-2 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50"
            >
              <RouteIcon size={13} />
              <span>Trail</span>
            </button>
          </div>

          {/* Primary Details Button */}
          <button
            onClick={() => onNavigateTo('driverProfile', selectedDriver)}
            className="w-full mt-3 rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:text-[#0E1612] py-2.5 text-xs font-bold shadow flex items-center justify-center gap-1.5 active:scale-98"
          >
            <span>Open driver and van details</span>
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        /* Running Vans List Card (Canvas A15) */
        <div className="absolute top-5 right-5 z-20 w-80 rounded-3xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md p-5 shadow-xl border border-[#E5EAE3] dark:border-[#2A3B31]">
          <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-3">
            Running vans ({filteredVans.length})
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {filteredVans.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVan(v)}
                className="cursor-pointer p-3 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] hover:bg-[#EAEFE9] transition-colors"
              >
                <div className="flex justify-between items-center text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  <span>{v.plateNo}</span>
                  <span className="font-normal text-[#566259]">{v.driverName}</span>
                </div>
                <div className="text-[11px] text-[#566259] mt-0.5">
                  Ward 5 · 4 of 9 wards
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#E5EAE3] mt-2 overflow-hidden">
                  <div className="h-full bg-[#1B7A3F] rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Controls Bottom Right */}
      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
        <button
          onClick={toggleSimulation}
          className={`rounded-full px-4 py-2 text-xs font-bold shadow-md transition-colors ${
            isSimulating ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-[#16221B] text-[#14201A] dark:text-[#EAF2E6]'
          }`}
        >
          {isSimulating ? 'Simulating GPS' : 'Simulate GPS'}
        </button>
      </div>
    </div>
  );
};
