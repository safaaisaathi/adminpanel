import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  GripVertical,
  Plus,
  Clock,
  Truck,
  Check,
  ArrowUpDown,
  X,
  MapPin,
  ZoomIn,
  ZoomOut,
  Navigation
} from 'lucide-react';
import L from 'leaflet';

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

  // Map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

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
    setToastMessage('✓ Collection route updated successfully');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initialize Real Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [22.7758, 73.6149],
      zoom: 14,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    routeLayerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Route Polygons & Connecting Polyline
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerGroupRef.current) return;
    const group = routeLayerGroupRef.current;
    group.clearLayers();

    const pathCoordinates: [number, number][] = [];

    orderedWardIds.forEach((wid, idx) => {
      const ward = wards.find((w) => w.id === wid);
      if (!ward) return;

      // Draw Ward Polygon
      if (ward.polygon && ward.polygon.length > 0) {
        const poly = L.polygon(ward.polygon as L.LatLngExpression[], {
          color: '#1B7A3F',
          weight: 2,
          fillColor: '#22C55E',
          fillOpacity: 0.18
        });
        poly.bindTooltip(`Stop ${idx + 1}: ${ward.name}`, { direction: 'center' });
        group.addLayer(poly);
      }

      // Add Stop Center Point
      if (ward.center) {
        pathCoordinates.push([ward.center.lat, ward.center.lng]);

        const badgeIcon = L.divIcon({
          className: 'route-stop-icon',
          html: `<div style="
            background: #111A14;
            color: #FFF;
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            border: 2px solid #22C55E;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 800;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transform: translate(-50%, -50%);
          ">${idx + 1}</div>`,
          iconSize: [0, 0]
        });

        const stopMarker = L.marker([ward.center.lat, ward.center.lng], { icon: badgeIcon });
        stopMarker.bindTooltip(`<b>Stop ${idx + 1}</b>: ${ward.name}<br/>Code: ${ward.code}`, {
          direction: 'top'
        });
        group.addLayer(stopMarker);
      }
    });

    // Draw connecting path polyline
    if (pathCoordinates.length > 1) {
      const polyline = L.polyline(pathCoordinates, {
        color: '#1B7A3F',
        weight: 3.5,
        dashArray: '8 8',
        opacity: 0.9
      });
      group.addLayer(polyline);
    }
  }, [orderedWardIds, wards]);

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#111A14] text-white px-5 py-3 shadow-2xl flex items-center gap-2 text-xs font-bold animate-slide-up border border-emerald-500/30">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid: Left Route Order Form, Right Path Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Column: Route Order Card */}
        <div className="lg:col-span-6 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  {selectedRoute?.name || 'East route'}
                </h2>
                <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
                  Visiting sequence order · Reorder stops with ▲ and ▼ buttons
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                {orderedWardIds.length} stops
              </span>
            </div>

            {/* Ward sequence list */}
            <div className="mt-5 space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
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
                          className="text-[#566259] hover:text-[#14201A] disabled:opacity-20 text-[10px] font-bold p-0.5"
                          title="Move earlier in route"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDown(index)}
                          disabled={index === orderedWardIds.length - 1}
                          className="text-[#566259] hover:text-[#14201A] disabled:opacity-20 text-[10px] font-bold p-0.5"
                          title="Move later in route"
                        >
                          ▼
                        </button>
                      </div>

                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#111A14] text-white text-xs font-bold shadow-xs">
                        {index + 1}
                      </div>

                      <div>
                        <span className="font-bold text-[#14201A] dark:text-[#EAF2E6] block">
                          {ward?.name || `Ward ${index + 4}`}
                        </span>
                        <span className="text-[10px] text-[#566259] dark:text-[#9DB0A2]">
                          {ward?.code || 'GDH-W'} · {ward?.type || 'urban'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[#566259] font-medium">{km} km</span>
                      <button
                        type="button"
                        onClick={() => setOrderedWardIds(orderedWardIds.filter((id) => id !== wardId))}
                        className="text-neutral-400 hover:text-red-600 text-xs"
                        title="Remove from this route"
                      >
                        <X size={14} />
                      </button>
                    </div>
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
                  alert('All configured wards are already assigned to this route.');
                }
              }}
              className="mt-3 w-full py-2.5 rounded-2xl border border-dashed border-[#DCE5D9] dark:border-[#2A3B31] text-xs font-bold text-[#1B7A3F] dark:text-[#6DB36F] hover:bg-[#F3FAF4] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus size={14} />
              <span>Add another ward to sequence</span>
            </button>

            {/* Route Schedule & Van Details */}
            <div className="mt-6 space-y-4 pt-4 border-t border-[#E5EAE3] dark:border-[#2A3B31]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Scheduled Start Time
                  </label>
                  <div className="flex items-center rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-2 text-xs">
                    <Clock size={15} className="text-[#566259] mr-2" />
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
                    Assigned Fleet Van
                  </label>
                  <div className="flex items-center rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-2 text-xs">
                    <Truck size={15} className="text-[#566259] mr-2" />
                    <select
                      value={selectedVanPlate}
                      onChange={(e) => setSelectedVanPlate(e.target.value)}
                      className="w-full bg-transparent outline-none font-medium text-[#14201A] dark:text-[#EAF2E6]"
                    >
                      {vans.map((v) => (
                        <option key={v.id} value={v.plateNo}>
                          {v.plateNo} · {v.driverName || 'Ramesh Bhai'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="flex items-center gap-3 pt-1">
                <span className="rounded-xl bg-[#F3F6F2] dark:bg-[#1E2D24] px-3 py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Total: {totalDistance} km
                </span>
                <span className="rounded-xl bg-[#F3F6F2] dark:bg-[#1E2D24] px-3 py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Estimated Duration: 3 h 20 min
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-5 border-t border-[#E5EAE3] dark:border-[#2A3B31] flex justify-end">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-8 py-3 text-xs font-bold shadow flex items-center justify-center gap-2 active:scale-95"
            >
              <Check size={15} />
              <span>Save Route Order</span>
            </button>
          </div>
        </div>

        {/* Right Column: Real Leaflet Map of Route Sequence */}
        <div className="lg:col-span-6 rounded-[28px] bg-white dark:bg-[#16221B] p-5 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] flex items-center gap-1.5">
              <MapPin size={15} className="text-[#1B7A3F]" />
              <span>Real Route Path: {orderedWardIds.map((_, i) => i + 1).join(' → ')}</span>
            </div>
            <span className="text-xs text-[#1B7A3F] font-bold">
              Godhra GPS OpenStreetMap
            </span>
          </div>

          {/* Real Leaflet Map */}
          <div className="relative h-[480px] w-full bg-[#E5EBE3] dark:bg-[#111A14] rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31]">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Custom Map Controls */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
              <button
                onClick={() => mapInstanceRef.current?.zoomIn()}
                className="h-9 w-9 rounded-xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md shadow-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100"
                title="Zoom in"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => mapInstanceRef.current?.zoomOut()}
                className="h-9 w-9 rounded-xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md shadow-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100"
                title="Zoom out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={() => mapInstanceRef.current?.setView([22.7758, 73.6149], 14)}
                className="h-9 w-9 rounded-xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md shadow-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[#1B7A3F] hover:bg-neutral-100"
                title="Recenter to Godhra"
              >
                <Navigation size={17} />
              </button>
            </div>

            {/* Bottom Info Pill */}
            <div className="absolute bottom-3 left-3 z-10 rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-bold text-[#14201A] dark:text-[#EAF2E6] shadow border border-neutral-200 dark:border-neutral-700">
              {selectedRoute?.name || 'East route'}: {orderedWardIds.length} wards · {totalDistance} km
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
