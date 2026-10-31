import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GODHRA_CENTER, STALE_LOCATION_SEC } from '../constants';
import { Van, Complaint } from '../types';
import { StatusChip } from '../components/StatusChip';
import {
  Truck,
  BatteryCharging,
  Gauge,
  Clock,
  AlertTriangle,
  Play,
  Square,
  X,
  Layers,
  Plus,
  Minus,
  LocateFixed,
} from 'lucide-react';

// Controller to expose Leaflet map instance to parent controls
const MapInstanceCapture: React.FC<{ onMapReady: (map: L.Map) => void }> = ({ onMapReady }) => {
  const map = useMap();
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  return null;
};

const createVanIcon = (van: Van) => {
  const isStale = (Date.now() - new Date(van.lastLocation.updatedAt).getTime()) / 1000 > STALE_LOCATION_SEC;
  const isOffline = van.status === 'offline' || isStale;

  const bgColor = isOffline ? '#D93025' : van.status === 'on_shift' ? '#1B7A3F' : '#74897A';
  const pulseHtml = van.status === 'on_shift' && !isOffline
    ? `<span class="absolute -inset-1 rounded-full bg-[#1B7A3F] opacity-40 animate-ping"></span>`
    : '';

  const html = `
    <div class="relative flex items-center justify-center">
      ${pulseHtml}
      <div class="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-elev2 text-white font-bold" style="background-color: ${bgColor};">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
          <path d="M15 18H9"/>
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
          <circle cx="17" cy="18" r="2"/>
          <circle cx="7" cy="18" r="2"/>
        </svg>
      </div>
      <div class="absolute -top-5 whitespace-nowrap rounded bg-[#111A14] px-1 py-0.2 text-[9px] font-bold text-white shadow">
        ${van.plateNo.slice(-4)}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-van-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const createComplaintIcon = (complaint: Complaint) => {
  let color = '#B87800';
  if (complaint.status === 'assigned') color = '#2F6FDE';
  if (complaint.status === 'resolved') color = '#1E8E5A';
  if (complaint.status === 'escalated') color = '#D93025';

  const html = `
    <div class="relative flex items-center justify-center">
      <div class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-md text-white" style="background-color: ${color};">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-complaint-pin',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

export const A3_LiveMap: React.FC = () => {
  const {
    t,
    scopedWards,
    scopedVans,
    scopedComplaints,
    routes,
    isSimulating,
    toggleSimulation,
    theme,
  } = useApp();

  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showWardsOverlay, setShowWardsOverlay] = useState(true);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  return (
    <div className="relative h-[calc(100vh-140px)] sm:h-[calc(100vh-130px)] w-full rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-elev2 dark:shadow-elev2-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
      {/* Floating Top Map Controls */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between gap-2 rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md px-3 sm:px-4 py-2 shadow-elev2 border border-[#DCE5D9] dark:border-[#2A3B31]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs sm:text-sm text-[#14201A] dark:text-[#EAF2E6]">
            {t.map.title}
          </span>
          <span className="hidden sm:inline-block rounded-full bg-[#E4F1DF] dark:bg-[#1F3A2A] px-2 py-0.5 text-[10px] font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
            {scopedVans.filter((v) => v.status === 'on_shift').length} Active Vans
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Toggle Wards Layer */}
          <button
            onClick={() => setShowWardsOverlay(!showWardsOverlay)}
            className={`flex items-center gap-1 rounded-full px-2.5 sm:px-3 py-1 text-[11px] font-semibold transition-all ${
              showWardsOverlay
                ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Layers size={12} />
            <span>Wards</span>
          </button>

          {/* Simulation Toggle */}
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
              isSimulating
                ? 'bg-[#B34A0B] text-white animate-pulse'
                : 'bg-[#1B7A3F] text-white hover:bg-[#146B3A]'
            }`}
          >
            {isSimulating ? <Square size={11} fill="currentColor" /> : <Play size={11} fill="currentColor" />}
            <span>{isSimulating ? t.map.stopSimulation : t.map.simulateMovement}</span>
          </button>
        </div>
      </div>

      {/* Floating Map Navigation Controls (Zoom In, Zoom Out, Recenter) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-6 sm:right-6 z-[1000] flex flex-col items-center gap-1 bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md p-1.5 rounded-2xl shadow-elev3 border border-[#DCE5D9] dark:border-[#2A3B31]">
        <button
          type="button"
          onClick={() => mapInstance?.zoomIn()}
          title="Zoom In / बड़ा करें (+)"
          aria-label="Zoom In"
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-neutral-100 hover:bg-[#E4F1DF] dark:bg-neutral-800 dark:hover:bg-[#1F3A2A] text-[#14201A] dark:text-[#EAF2E6] hover:text-[#1B7A3F] dark:hover:text-[#6DB36F] transition-all active:scale-95 shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={() => mapInstance?.zoomOut()}
          title="Zoom Out / छोटा करें (-)"
          aria-label="Zoom Out"
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-neutral-100 hover:bg-[#E4F1DF] dark:bg-neutral-800 dark:hover:bg-[#1F3A2A] text-[#14201A] dark:text-[#EAF2E6] hover:text-[#1B7A3F] dark:hover:text-[#6DB36F] transition-all active:scale-95 shadow-sm"
        >
          <Minus size={18} strokeWidth={2.5} />
        </button>

        <div className="w-5 h-[1px] bg-neutral-200 dark:bg-neutral-700 my-0.5" />

        <button
          type="button"
          onClick={() => mapInstance?.setView([GODHRA_CENTER.lat, GODHRA_CENTER.lng], 14, { animate: true })}
          title="Recenter Map / गोधरा रीसेंटर"
          aria-label="Recenter Map"
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-neutral-100 hover:bg-[#E4F1DF] dark:bg-neutral-800 dark:hover:bg-[#1F3A2A] text-[#14201A] dark:text-[#EAF2E6] hover:text-[#1B7A3F] dark:hover:text-[#6DB36F] transition-all active:scale-95 shadow-sm"
        >
          <LocateFixed size={17} strokeWidth={2.2} />
        </button>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={[GODHRA_CENTER.lat, GODHRA_CENTER.lng]}
        zoom={14}
        zoomControl={false}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <MapInstanceCapture onMapReady={setMapInstance} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={
            theme === 'dark'
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />

        {/* Wards Boundary & Center Circles */}
        {showWardsOverlay &&
          scopedWards.map((ward) => (
            <Circle
              key={ward.id}
              center={[ward.center.lat, ward.center.lng]}
              radius={ward.radiusM}
              pathOptions={{
                color: '#1B7A3F',
                fillColor: '#6DB36F',
                fillOpacity: 0.12,
                weight: 1.5,
                dashArray: '4 4',
              }}
            >
              <Popup>
                <div className="text-xs">
                  <div className="font-bold text-sm text-[#1B7A3F]">{ward.name}</div>
                  <div>Code: {ward.code}</div>
                  <div>Type: {ward.type}</div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* Live Vans Markers */}
        {scopedVans.map((van) => (
          <Marker
            key={van.id}
            position={[van.lastLocation.lat, van.lastLocation.lng]}
            icon={createVanIcon(van)}
            eventHandlers={{
              click: () => {
                setSelectedVan(van);
                setSelectedComplaint(null);
              },
            }}
          />
        ))}

        {/* Grievance Complaint Pins */}
        {scopedComplaints.map((complaint) => (
          <Marker
            key={complaint.id}
            position={[complaint.location.lat, complaint.location.lng]}
            icon={createComplaintIcon(complaint)}
            eventHandlers={{
              click: () => {
                setSelectedComplaint(complaint);
                setSelectedVan(null);
              },
            }}
          />
        ))}
      </MapContainer>

      {/* Van Detail Responsive Card (Bottom sheet on mobile, floating card on desktop) */}
      {selectedVan && (
        <div className="absolute bottom-16 inset-x-3 sm:bottom-6 sm:left-6 sm:inset-x-auto sm:w-80 z-[1000] rounded-[24px] bg-white dark:bg-[#16221B] p-4 sm:p-5 shadow-elev3 dark:shadow-elev3-dark border border-[#DCE5D9] dark:border-[#2A3B31] animate-in fade-in">
          <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E4F1DF] dark:bg-[#1F3A2A] text-[#1B7A3F] dark:text-[#6DB36F]">
                <Truck size={16} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#14201A] dark:text-[#EAF2E6]">
                  {selectedVan.plateNo}
                </h4>
                <div className="text-[10px] text-[#566259] dark:text-[#9DB0A2] truncate max-w-[170px]">
                  {routes.find((r) => r.id === selectedVan.routeId)?.name || 'Unassigned'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedVan(null)}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#566259] dark:text-[#9DB0A2]">{t.complaints.status}:</span>
              <StatusChip status={selectedVan.status} size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#566259] dark:text-[#9DB0A2] flex items-center gap-1">
                <Gauge size={13} />
                <span>{t.map.speed}:</span>
              </span>
              <span className="font-semibold text-[#14201A] dark:text-[#EAF2E6]">
                {selectedVan.lastLocation.speedKmph} km/h
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#566259] dark:text-[#9DB0A2] flex items-center gap-1">
                <BatteryCharging size={13} />
                <span>{t.map.battery}:</span>
              </span>
              <span
                className={`font-semibold ${
                  selectedVan.batteryPct <= 20 ? 'text-[#D93025]' : 'text-[#1B7A3F]'
                }`}
              >
                {selectedVan.batteryPct}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#566259] dark:text-[#9DB0A2] flex items-center gap-1">
                <Clock size={13} />
                <span>Last Ping:</span>
              </span>
              <span className="text-neutral-600 dark:text-neutral-300">
                {new Date(selectedVan.lastLocation.updatedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Pin Detail Card */}
      {selectedComplaint && (
        <div className="absolute bottom-16 inset-x-3 sm:bottom-6 sm:left-6 sm:inset-x-auto sm:w-80 z-[1000] rounded-[24px] bg-white dark:bg-[#16221B] p-4 sm:p-5 shadow-elev3 dark:shadow-elev3-dark border border-[#DCE5D9] dark:border-[#2A3B31] animate-in fade-in">
          <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <div className="text-[10px] font-mono font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
                {selectedComplaint.ticketId}
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-[#14201A] dark:text-[#EAF2E6]">
                {t.categories[selectedComplaint.category]}
              </h4>
            </div>
            <button
              onClick={() => setSelectedComplaint(null)}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            {selectedComplaint.photoUrl && (
              <img
                src={selectedComplaint.photoUrl}
                alt="Citizen Evidence"
                className="h-28 w-full rounded-xl object-cover"
              />
            )}

            <div className="flex items-center justify-between">
              <span className="text-[#566259] dark:text-[#9DB0A2]">{t.complaints.status}:</span>
              <StatusChip status={selectedComplaint.status} size="sm" />
            </div>

            {selectedComplaint.note && (
              <p className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-2 text-[11px] text-[#566259] dark:text-[#9DB0A2] line-clamp-2">
                "{selectedComplaint.note}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
