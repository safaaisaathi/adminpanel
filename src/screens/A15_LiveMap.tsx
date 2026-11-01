import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import { Van, Driver, Ward } from '../types';
import {
  Search,
  Phone,
  MessageSquare,
  Route as RouteIcon,
  ArrowRight,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Activity,
  Layers,
  MapPin,
  Compass
} from 'lucide-react';

interface A15LiveMapProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A15_LiveMap: React.FC<A15LiveMapProps> = ({ onNavigateTo }) => {
  const { vans, drivers, wards, isSimulating, toggleSimulation } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'moving' | 'stopped' | 'offline'>('all');
  const [selectedRoute, setSelectedRoute] = useState('all');

  // De-bloated: Vehicles drawer starts collapsed by default
  const [isVehiclesOpen, setIsVehiclesOpen] = useState(false);

  // Selected van for A16 Van Details Bubble (null by default to avoid covering the map)
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);

  // Map Tile Style ('streets' | 'satellite')
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const wardsLayerRef = useRef<L.LayerGroup | null>(null);

  // Filtered vans based on search & status
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

  // Initialize Real Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double initialization

    // Godhra center coordinates: 22.7758° N, 73.6149° E
    const map = L.map(mapContainerRef.current, {
      center: [22.7758, 73.6149],
      zoom: 14,
      zoomControl: false // We will add custom styled zoom control
    });

    // Custom positioned zoom control on top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Standard OpenStreetMap Tile Layer
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Layer groups for wards and markers
    wardsLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Style (Streets vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const newUrl = mapStyle === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = mapStyle === 'satellite'
      ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      : '&copy; OpenStreetMap contributors';

    const newLayer = L.tileLayer(newUrl, { maxZoom: 19, attribution }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapStyle]);

  // Render Real Ward Boundaries (Polygons) on the Map
  useEffect(() => {
    if (!mapInstanceRef.current || !wardsLayerRef.current) return;
    wardsLayerRef.current.clearLayers();

    const colors = ['#1B7A3F', '#2F6FDE', '#E87A17', '#7C3AED', '#0D9488', '#D97706'];

    wards.forEach((ward, index) => {
      const color = colors[index % colors.length];
      const points = ward.polygon && ward.polygon.length > 2
        ? ward.polygon
        : [
            [ward.center.lat + 0.005, ward.center.lng - 0.005],
            [ward.center.lat + 0.005, ward.center.lng + 0.005],
            [ward.center.lat - 0.005, ward.center.lng + 0.006],
            [ward.center.lat - 0.006, ward.center.lng - 0.004]
          ];

      const polygon = L.polygon(points as [number, number][], {
        color: color,
        fillColor: color,
        fillOpacity: 0.18,
        weight: 2.5,
        dashArray: '3, 4'
      });

      polygon.bindTooltip(
        `<div style="font-weight: bold; font-size: 12px; color: #111A14;">${ward.name} (${ward.code})</div>
         <div style="font-size: 11px; color: #555;">Area: ${ward.areaKm2} km² · Inspector: ${ward.inspectorId ? 'Meena P.' : 'None'}</div>`,
        { permanent: false, direction: 'center' }
      );

      polygon.on('click', () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.fitBounds(polygon.getBounds(), { padding: [50, 50] });
        }
      });

      wardsLayerRef.current?.addLayer(polygon);
    });
  }, [wards]);

  // Render Real Van Markers on the Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    filteredVans.forEach((v) => {
      const isSelected = selectedVan?.id === v.id;
      const isMoving = v.status === 'on_shift' && (v.lastLocation?.speedKmph || 0) > 0;
      const isOffline = v.status === 'offline';
      const color = isOffline ? '#D93025' : isMoving ? '#1B7A3F' : '#E8A317';

      // Fallback coordinates in Godhra if lastLocation missing
      const lat = v.lastLocation?.lat || 22.7758;
      const lng = v.lastLocation?.lng || 73.6149;

      const customIcon = L.divIcon({
        className: 'custom-fleet-van-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            ${isSelected ? `<div style="position: absolute; width: 44px; height: 44px; border: 3px solid #111A14; border-radius: 50%; top: -6px; animation: pulse 1.5s infinite;"></div>` : ''}
            <div style="
              width: 34px;
              height: 34px;
              background-color: ${color};
              border: 3px solid #FFFFFF;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.35);
              font-size: 16px;
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              transition: transform 0.2s ease;
            ">
              🛺
            </div>
            <div style="
              background: #111A14;
              color: #FFF;
              font-size: 9.5px;
              font-weight: 700;
              padding: 1px 6px;
              border-radius: 12px;
              margin-top: 2px;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">
              ${v.plateNo.slice(-7)}
            </div>
          </div>
        `,
        iconSize: [40, 52],
        iconAnchor: [20, 26]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedVan(v);
        mapInstanceRef.current?.panTo([lat, lng], { animate: true });
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredVans, selectedVan]);

  const handleFitGodhra = () => {
    mapInstanceRef.current?.setView([22.7758, 73.6149], 14, { animate: true });
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[640px] rounded-[32px] overflow-hidden border border-[#E5EAE3] dark:border-[#2A3B31] shadow-sm bg-neutral-100">
      {/* Real Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* TOP FLOATING SLIM TOOLBAR (Non-intrusive) */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 max-w-[calc(100%-140px)]">
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

      {/* TOP RIGHT: Real Map View Options (Fit Godhra & Satellite Toggle) */}
      <div className="absolute top-4 right-16 z-10 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md p-1 shadow-lg border border-[#E5EAE3] dark:border-[#2A3B31]">
        <button
          onClick={handleFitGodhra}
          title="Center Godhra Map"
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Compass size={14} className="text-[#1B7A3F]" />
          <span>Godhra</span>
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

        <button
          onClick={() => setMapStyle(mapStyle === 'streets' ? 'satellite' : 'streets')}
          title="Toggle Street / Satellite Map"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
            mapStyle === 'satellite'
              ? 'bg-[#111A14] text-white dark:bg-white dark:text-[#111A14]'
              : 'text-[#566259] hover:text-black dark:hover:text-white'
          }`}
        >
          <Layers size={13} />
          <span>{mapStyle === 'satellite' ? 'Satellite' : 'Street'}</span>
        </button>
      </div>

      {/* SLIDE-OUT VEHICLES FILTER DRAWER */}
      {isVehiclesOpen && (
        <div className="absolute top-16 left-4 z-20 w-80 max-h-[calc(100%-80px)] rounded-3xl bg-white/98 dark:bg-[#16221B]/98 backdrop-blur-md p-5 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col animate-fade-in">
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
                      if (v.lastLocation?.lat && v.lastLocation?.lng) {
                        mapInstanceRef.current?.setView([v.lastLocation.lat, v.lastLocation.lng], 16, { animate: true });
                      }
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

      {/* SLIDE-OVER VAN & DRIVER DETAILS (Only Shown When A Van Is Selected) */}
      {selectedVan && (
        <div className="absolute top-16 right-4 z-20 w-84 sm:w-92 max-w-[calc(100vw-32px)] rounded-3xl bg-white/98 dark:bg-[#16221B]/98 backdrop-blur-md p-5 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] animate-slide-left">
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
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
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
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-[#566259] dark:text-[#9DB0A2] bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow pointer-events-none">
        <MapPin size={12} className="text-[#1B7A3F]" />
        <span>Real OpenStreetMap · Godhra Nagarpalika · Click van or ward polygon</span>
      </div>
    </div>
  );
};