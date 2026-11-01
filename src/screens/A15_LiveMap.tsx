import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import { Van, Driver } from '../types';
import {
  Search,
  Phone,
  MessageSquare,
  Route as RouteIcon,
  ArrowRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Navigation,
  Activity,
  Layers
} from 'lucide-react';

interface A15LiveMapProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A15_LiveMap: React.FC<A15LiveMapProps> = ({ onNavigateTo }) => {
  const { vans, drivers, isSimulating, toggleSimulation } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'moving' | 'stopped' | 'offline'>('all');
  const [selectedRoute, setSelectedRoute] = useState('all');

  // De-bloat: Vehicles list drawer starts collapsed by default or toggleable
  const [isVehiclesOpen, setIsVehiclesOpen] = useState(false);

  // Selected van for A16 Van Details Bubble - starts null to avoid covering map on initial load
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(z => Math.min(2.5, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom(z => Math.max(0.65, +(z - 0.25).toFixed(2)));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag when clicking the background/SVG, not buttons or cards
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

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

  const movingCount = vans.filter(v => v.status === 'on_shift' && (v.lastLocation?.speedKmph || 0) > 0).length;
  const stoppedCount = vans.filter(v => v.status === 'idle' || (v.status === 'on_shift' && (v.lastLocation?.speedKmph || 0) === 0)).length;
  const offlineCount = vans.filter(v => v.status === 'offline').length;

  return (
    <div
      ref={mapContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="relative w-full h-[calc(100vh-140px)] min-h-[620px] rounded-[32px] overflow-hidden border border-[#E5EAE3] dark:border-[#2A3B31] shadow-sm bg-[#E8F2E8] dark:bg-[#0D1510] select-none cursor-grab active:cursor-grabbing"
    >
      {/* Zoomable & Pannable SVG Map Container */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-75 origin-center"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`
        }}
      >
        <svg viewBox="0 0 1000 680" className="w-full h-full object-cover pointer-events-auto">
          {/* Subtle Grid / Ground pattern */}
          <defs>
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D3E2D3" strokeWidth="0.8" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="1000" height="680" fill="url(#mapGrid)" />

          {/* Main roads with double border */}
          <path d="M 0 340 Q 500 280 1000 360" stroke="#CADBC9" strokeWidth="32" fill="none" />
          <path d="M 0 340 Q 500 280 1000 360" stroke="#FFF" strokeWidth="22" fill="none" />

          <path d="M 450 0 Q 420 340 480 680" stroke="#CADBC9" strokeWidth="26" fill="none" />
          <path d="M 450 0 Q 420 340 480 680" stroke="#FFF" strokeWidth="18" fill="none" />

          <path d="M 720 0 Q 690 340 760 680" stroke="#CADBC9" strokeWidth="22" fill="none" />
          <path d="M 720 0 Q 690 340 760 680" stroke="#FFF" strokeWidth="14" fill="none" />

          <path d="M 150 180 Q 450 220 850 160" stroke="#CADBC9" strokeWidth="20" fill="none" />
          <path d="M 150 180 Q 450 220 850 160" stroke="#FFF" strokeWidth="14" fill="none" />

          {/* Ward Outlines (Godhra Nagarpalika Wards) */}
          <polygon
            points="120,80 320,60 340,260 140,280"
            fill="#B8E2BD"
            opacity="0.45"
            stroke="#1B7A3F"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <text x="180" y="160" fontSize="15" fontWeight="bold" fill="#14201A">Ward 4 (Polan Bazar)</text>

          <polygon
            points="360,80 620,110 600,320 370,290"
            fill="#C6E7C9"
            opacity="0.5"
            stroke="#1B7A3F"
            strokeWidth="2.5"
          />
          <text x="440" y="180" fontSize="15" fontWeight="bold" fill="#14201A">Ward 5 (Station Road)</text>

          <polygon
            points="180,310 400,300 380,520 160,500"
            fill="#FCE3C8"
            opacity="0.45"
            stroke="#E87A17"
            strokeWidth="2.5"
          />
          <text x="240" y="410" fontSize="15" fontWeight="bold" fill="#14201A">Ward 6 (Vavdi Buzarg)</text>

          <polygon
            points="420,320 720,350 680,560 410,540"
            fill="#C6E7C9"
            opacity="0.45"
            stroke="#1B7A3F"
            strokeWidth="2.5"
          />
          <text x="510" y="430" fontSize="15" fontWeight="bold" fill="#14201A">Ward 7 (Civil Lines)</text>

          <polygon
            points="650,110 920,130 890,340 640,330"
            fill="#D3E8D6"
            opacity="0.45"
            stroke="#1B7A3F"
            strokeWidth="2.5"
          />
          <text x="730" y="210" fontSize="15" fontWeight="bold" fill="#14201A">Ward 8 (Bhuravav)</text>

          {/* Active Van Markers */}
          {filteredVans.map((v, i) => {
            const isSelected = selectedVan?.id === v.id;
            const isMoving = v.status === 'on_shift';
            const isOffline = v.status === 'offline';

            const positions: Record<string, [number, number]> = {
              van_1: [470, 250],
              van_2: [230, 180],
              van_3: [290, 420],
              van_4: [780, 230],
              van_5: [550, 440]
            };

            const [cx, cy] = positions[v.id] || [500 + (i % 5) * 60, 300 + (i % 4) * 45];
            const color = isOffline ? '#D93025' : isMoving ? '#1B7A3F' : '#E8A317';

            return (
              <g
                key={v.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVan(v);
                }}
                className="cursor-pointer group"
              >
                {/* Highlight ring if selected */}
                {isSelected && (
                  <circle cx={cx} cy={cy} r="28" fill="none" stroke="#111A14" strokeWidth="4" className="animate-pulse" />
                )}

                {/* Pulsing ring if moving */}
                {isMoving && !isOffline && (
                  <circle cx={cx} cy={cy} r="22" fill={color} opacity="0.35" className="animate-ping origin-center" />
                )}

                {/* Van Circle Base */}
                <circle cx={cx} cy={cy} r="16" fill={color} stroke="#FFF" strokeWidth="2.5" className="shadow-md" />

                {/* Vehicle emoji / mini icon */}
                <text x={cx - 8} y={cy + 5} fontSize="13" fill="#FFF">🛺</text>

                {/* Label pill on hover / selection */}
                <g className={isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100 transition-opacity'}>
                  <rect
                    x={cx - 36}
                    y={cy + 20}
                    width="72"
                    height="18"
                    rx="9"
                    fill="#111A14"
                    opacity="0.88"
                  />
                  <text
                    x={cx}
                    y={cy + 32}
                    fontSize="9.5"
                    fontWeight="bold"
                    fill="#FFF"
                    textAnchor="middle"
                  >
                    {v.plateNo.slice(-7)}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* TOP FLOATING SLIM TOOLBAR (Non-intrusive, Leaves Map Open) */}
      <div className="interactive-control absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[calc(100%-140px)]">
        {/* Vehicles Drawer Toggle Button */}
        <button
          onClick={() => setIsVehiclesOpen(!isVehiclesOpen)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-lg backdrop-blur-md transition-all ${
            isVehiclesOpen
              ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
              : 'bg-white/95 dark:bg-[#16221B]/95 text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50 border border-[#E5EAE3] dark:border-[#2A3B31]'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Vehicles ({vans.length})</span>
          {isVehiclesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Compact Quick Filter Chips */}
        <div className="flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md p-1 shadow-lg border border-[#E5EAE3] dark:border-[#2A3B31] text-xs font-bold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-full px-3 py-1 transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#111A14] text-white dark:bg-white dark:text-[#111A14]'
                : 'text-[#566259] dark:text-[#9DB0A2] hover:text-black dark:hover:text-white'
            }`}
          >
            All {vans.length}
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'moving' ? 'all' : 'moving')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors ${
              statusFilter === 'moving'
                ? 'bg-[#1B7A3F] text-white'
                : 'text-[#1B7A3F] hover:bg-[#EAF5EC]'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Moving {movingCount}</span>
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'stopped' ? 'all' : 'stopped')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors ${
              statusFilter === 'stopped'
                ? 'bg-[#E8A317] text-white'
                : 'text-[#A66800] hover:bg-[#FFF8E6]'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            <span>Stopped {stoppedCount}</span>
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'offline' ? 'all' : 'offline')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors ${
              statusFilter === 'offline'
                ? 'bg-[#D93025] text-white'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span>Offline {offlineCount}</span>
          </button>
        </div>
      </div>

      {/* FLOATING ZOOM & VIEW CONTROLS (Top-Right) */}
      <div className="interactive-control absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md p-1 shadow-lg border border-[#E5EAE3] dark:border-[#2A3B31]">
        <button
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="p-2 rounded-full text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <ZoomIn size={16} />
        </button>

        <span className="text-[11px] font-mono font-bold px-1.5 text-[#566259] dark:text-[#9DB0A2] min-w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          className="p-2 rounded-full text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <ZoomOut size={16} />
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 mx-0.5" />

        <button
          onClick={handleResetZoom}
          title="Reset Zoom / Fit Map"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-[#566259] dark:text-[#9DB0A2] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      {/* SLIDE-OUT VEHICLES FILTER DRAWER (Collapsible, Doesn't Bloat Map) */}
      {isVehiclesOpen && (
        <div className="interactive-control absolute top-16 left-4 z-30 w-80 max-h-[calc(100%-80px)] rounded-3xl bg-white/98 dark:bg-[#16221B]/98 backdrop-blur-md p-5 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] flex items-center gap-2">
              <span>Filter & Search</span>
              <span className="text-xs font-normal text-[#566259]">({filteredVans.length} vans)</span>
            </h3>
            <button
              onClick={() => setIsVehiclesOpen(false)}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 rounded-full bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-2 text-xs text-[#566259] mb-3">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search plate or driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-xs text-[#14201A] dark:text-[#EAF2E6]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-neutral-400 hover:text-neutral-600">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Route Filter Dropdown */}
          <div className="mb-3">
            <label className="block text-[11px] font-semibold text-[#566259] mb-1">Route Sector</label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-2 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] outline-none"
            >
              <option value="all">All routes</option>
              <option value="east">East route (Ward 4, 5)</option>
              <option value="west">West route (Ward 6, 7)</option>
              <option value="north">North route (Ward 8)</option>
            </select>
          </div>

          {/* Scrollable List of Vans */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-72">
            {filteredVans.length === 0 ? (
              <div className="text-center py-6 text-xs text-neutral-400">
                No matching vans found
              </div>
            ) : (
              filteredVans.map((v) => {
                const isSelected = selectedVan?.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVan(v);
                      // Center map towards van position if desired
                    }}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-[#111A14] text-white border-[#111A14] dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                        : 'bg-[#F8FAF7] dark:bg-[#111A14] border-[#E5EAE3] dark:border-[#2A3B31] hover:bg-[#EAEFE9]'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>{v.plateNo}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        v.status === 'on_shift'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.status === 'offline'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {v.status === 'on_shift' ? 'Moving' : v.status === 'offline' ? 'Offline' : 'Stopped'}
                      </span>
                    </div>
                    <div className="text-[11px] opacity-80 mt-1 flex justify-between">
                      <span>{v.driverName}</span>
                      <span>{v.lastLocation?.speedKmph || 0} km/h</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SLIDE-OVER VAN & DRIVER DETAILS (Only Shown When A Van Is Clicked) */}
      {selectedVan && (
        <div className="interactive-control absolute top-16 right-4 z-30 w-84 sm:w-92 max-w-[calc(100vw-32px)] rounded-3xl bg-white/98 dark:bg-[#16221B]/98 backdrop-blur-md p-5 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] animate-slide-left">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-[#1B7A3F] text-white font-bold text-sm flex items-center justify-center shrink-0">
                {selectedDriver?.name?.slice(0, 2).toUpperCase() || 'RB'}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-[#14201A] dark:text-[#EAF2E6] truncate">
                  {selectedDriver?.name || 'Ramesh Bhai'}
                </h4>
                <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2] truncate">
                  {selectedDriver?.driverId || 'GDH-D-0042'} · {selectedDriver?.phone || '+91 98xxxx42'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="rounded-full bg-[#EAF5EC] text-[#1B7A3F] px-2 py-0.5 text-[10px] font-bold">
                ✓ {selectedVan.lastLocation?.speedKmph || 18} km/h
              </span>
              <button
                onClick={() => setSelectedVan(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                title="Close details (view full map)"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Van Plate & Route */}
          <div className="py-2.5 text-xs">
            <div className="font-mono font-bold text-[#14201A] dark:text-[#EAF2E6]">
              {selectedVan.plateNo} <span className="font-sans font-normal text-[#566259]">• {selectedVan.type || 'Tata Ace'}</span>
            </div>
            <div className="text-[11px] text-[#566259] mt-0.5">
              East route · started 07:28
            </div>
          </div>

          {/* Wards progress */}
          <div className="py-2 text-xs">
            <div className="flex justify-between font-bold text-[#14201A] dark:text-[#EAF2E6] mb-1">
              <span>Wards done: 4 of 9</span>
              <span>44%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] overflow-hidden mb-2">
              <div className="h-full bg-[#1B7A3F] rounded-full" style={{ width: '44%' }} />
            </div>

            <div className="flex flex-wrap gap-1">
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

          {/* 4 Stat Boxes (Speed, Battery, Updated, GPS) */}
          <div className="grid grid-cols-4 gap-1.5 py-2 text-center">
            <div className="rounded-xl bg-[#F8FAF7] dark:bg-[#111A14] p-1.5 border border-[#E5EAE3] dark:border-[#2A3B31]">
              <div className="text-[9px] text-[#566259]">Speed</div>
              <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                {selectedVan.lastLocation?.speedKmph || 18} km/h
              </div>
            </div>
            <div className="rounded-xl bg-[#F8FAF7] dark:bg-[#111A14] p-1.5 border border-[#E5EAE3] dark:border-[#2A3B31]">
              <div className="text-[9px] text-[#566259]">Battery</div>
              <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                {selectedVan.batteryPct}%
              </div>
            </div>
            <div className="rounded-xl bg-[#F8FAF7] dark:bg-[#111A14] p-1.5 border border-[#E5EAE3] dark:border-[#2A3B31]">
              <div className="text-[9px] text-[#566259]">Updated</div>
              <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                8s ago
              </div>
            </div>
            <div className="rounded-xl bg-[#F8FAF7] dark:bg-[#111A14] p-1.5 border border-[#E5EAE3] dark:border-[#2A3B31]">
              <div className="text-[9px] text-[#566259]">GPS</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Good
              </div>
            </div>
          </div>

          {/* Action Buttons: Call, Message, Trail */}
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            <a
              href={`tel:${selectedDriver?.phone || '+919800000000'}`}
              className="flex items-center justify-center gap-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111A14] py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50"
            >
              <Phone size={12} />
              <span>Call</span>
            </a>
            <button
              onClick={() => onNavigateTo('notices')}
              className="flex items-center justify-center gap-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111A14] py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50"
            >
              <MessageSquare size={12} />
              <span>Message</span>
            </button>
            <button
              onClick={() => onNavigateTo('tripReplay')}
              className="flex items-center justify-center gap-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111A14] py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50"
            >
              <RouteIcon size={12} />
              <span>Trail</span>
            </button>
          </div>

          {/* Full Driver & Van Details Button */}
          <button
            onClick={() => onNavigateTo('driverProfile', selectedDriver)}
            className="w-full mt-2.5 rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:text-[#0E1612] py-2 text-xs font-bold shadow flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <span>Open driver and van details</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* BOTTOM RIGHT: Simulation Pill */}
      <div className="interactive-control absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleSimulation}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold shadow-lg transition-all ${
            isSimulating
              ? 'bg-emerald-600 text-white'
              : 'bg-white/95 dark:bg-[#16221B]/95 text-[#14201A] dark:text-[#EAF2E6] border border-[#E5EAE3] dark:border-[#2A3B31]'
          }`}
        >
          <Activity size={13} className={isSimulating ? 'animate-pulse' : ''} />
          <span>{isSimulating ? 'Simulating GPS' : 'Simulate GPS'}</span>
        </button>
      </div>

      {/* MAP HINT PILL BOTTOM LEFT */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-[#566259] dark:text-[#9DB0A2] bg-white/70 dark:bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full pointer-events-none">
        <span>💡 Drag to pan · Scroll or use + / - to zoom · Click any van for details</span>
      </div>
    </div>
  );
};