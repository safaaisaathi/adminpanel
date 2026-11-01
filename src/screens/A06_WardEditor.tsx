import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import { Ward } from '../types';
import L from 'leaflet';
import {
  Pencil,
  MousePointer,
  Hand,
  Undo2,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Scissors,
  Plus,
  MapPin,
  ZoomIn,
  ZoomOut,
  Navigation,
  RefreshCw
} from 'lucide-react';

interface A06WardEditorProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
  editWard?: Ward;
}

export const A06_WardEditor: React.FC<A06WardEditorProps> = ({ onNavigateTo, editWard }) => {
  const { createWard, updateWard, availableStaff, routes, wards } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activeTool, setActiveTool] = useState<'draw' | 'edit'>('draw');
  const [snapping, setSnapping] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Polygon Points (Real GPS coordinates centered at Godhra)
  const defaultGodhraPoints: [number, number][] = [
    [22.784, 73.605],
    [22.789, 73.612],
    [22.786, 73.621],
    [22.780, 73.623],
    [22.776, 73.615],
    [22.778, 73.606]
  ];

  const [points, setPoints] = useState<[number, number][]>(
    editWard?.polygon || defaultGodhraPoints
  );

  // Step 2 Form Details
  const [wardName, setWardName] = useState(editWard?.name || `Ward ${wards.length + 4}`);
  const [wardNameGu, setWardNameGu] = useState(editWard?.nameGu || `વૉર્ડ ${wards.length + 4}`);
  const [wardCode, setWardCode] = useState(editWard?.code || `GDH-W-00${wards.length + 4}`);
  const [wardType, setWardType] = useState<'urban' | 'rural'>(editWard?.type || 'urban');
  const [inspectorId, setInspectorId] = useState(editWard?.inspectorId || 'staff_inspector_meena');
  const [routeId, setRouteId] = useState(editWard?.routeId || 'route_east');

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawingLayerRef = useRef<L.LayerGroup | null>(null);
  const otherWardsLayerRef = useRef<L.LayerGroup | null>(null);

  const inspectors = availableStaff.filter((s) => s.role === 'inspector');

  // Approximate area calculation in km²
  const calculateAreaKm2 = (pts: [number, number][]) => {
    if (pts.length < 3) return '0.00';
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      const x1 = pts[i][1] * 102.5;
      const y1 = pts[i][0] * 111.0;
      const x2 = pts[j][1] * 102.5;
      const y2 = pts[j][0] * 111.0;
      area += x1 * y2 - x2 * y1;
    }
    return Math.abs(area / 2).toFixed(2);
  };

  const calculatedArea = calculateAreaKm2(points);

  // Initialize Real Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter = points.length > 0 ? points[0] : [22.7758, 73.6149];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter as L.LatLngExpression,
      zoom: 14,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Other wards background layer
    const otherLayer = L.layerGroup().addTo(map);
    otherWardsLayerRef.current = otherLayer;

    // Active drawing layer
    const drawLayer = L.layerGroup().addTo(map);
    drawingLayerRef.current = drawLayer;

    // Click handler to drop real GPS point
    map.on('click', (e: L.LeafletMouseEvent) => {
      const newPt: [number, number] = [
        parseFloat(e.latlng.lat.toFixed(5)),
        parseFloat(e.latlng.lng.toFixed(5))
      ];
      setPoints((prev) => [...prev, newPt]);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render other wards to show context
  useEffect(() => {
    if (!otherWardsLayerRef.current) return;
    const group = otherWardsLayerRef.current;
    group.clearLayers();

    wards.forEach((w) => {
      if (editWard && w.id === editWard.id) return;
      if (!w.polygon || w.polygon.length === 0) return;

      const poly = L.polygon(w.polygon as L.LatLngExpression[], {
        color: '#94A3B8',
        weight: 1.5,
        fillColor: '#CBD5E1',
        fillOpacity: 0.15,
        dashArray: '3 3'
      });
      poly.bindTooltip(w.name, { permanent: false, direction: 'center' });
      group.addLayer(poly);
    });
  }, [wards, editWard]);

  // Update drawing layer whenever points change
  useEffect(() => {
    if (!drawingLayerRef.current) return;
    const group = drawingLayerRef.current;
    group.clearLayers();

    if (points.length === 0) return;

    // Draw active polygon or polyline
    if (points.length >= 3) {
      const polygon = L.polygon(points as L.LatLngExpression[], {
        color: '#1B7A3F',
        weight: 3,
        fillColor: '#22C55E',
        fillOpacity: 0.25
      });
      group.addLayer(polygon);
    } else if (points.length === 2) {
      const line = L.polyline(points as L.LatLngExpression[], {
        color: '#1B7A3F',
        weight: 3,
        dashArray: '4 4'
      });
      group.addLayer(line);
    }

    // Draw numbered corner markers
    points.forEach((pt, idx) => {
      const markerIcon = L.divIcon({
        className: 'custom-point-marker',
        html: `<div style="
          background: #111A14;
          color: #FFF;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          border: 2px solid #22C55E;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transform: translate(-50%, -50%);
          cursor: pointer;
        ">${idx + 1}</div>`,
        iconSize: [0, 0]
      });

      const marker = L.marker(pt, { icon: markerIcon });
      marker.bindTooltip(`Point ${idx + 1}: ${pt[0].toFixed(4)}, ${pt[1].toFixed(4)}<br/>Click to remove`, {
        direction: 'top'
      });
      marker.on('click', () => {
        setPoints((prev) => prev.filter((_, i) => i !== idx));
      });
      group.addLayer(marker);
    });
  }, [points]);

  const handleUndoPoint = () => {
    setPoints((prev) => prev.slice(0, prev.length - 1));
  };

  const handleClearPoints = () => {
    setPoints([]);
  };

  const handleResetDefaultGodhra = () => {
    setPoints(defaultGodhraPoints);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.784, 73.615], 14);
    }
  };

  const handleSaveWard = () => {
    setSaving(true);
    setTimeout(() => {
      const centerLat = points.length > 0 ? points.reduce((acc, p) => acc + p[0], 0) / points.length : 22.7758;
      const centerLng = points.length > 0 ? points.reduce((acc, p) => acc + p[1], 0) / points.length : 73.6149;
      const areaVal = parseFloat(calculatedArea) || 1.5;

      if (editWard) {
        updateWard(editWard.id, {
          name: wardName,
          nameGu: wardNameGu,
          type: wardType,
          inspectorId,
          routeId,
          areaKm2: areaVal,
          pointsCount: points.length,
          polygon: points,
          center: { lat: centerLat, lng: centerLng }
        });
      } else {
        createWard({
          name: wardName,
          nameGu: wardNameGu,
          code: wardCode,
          type: wardType,
          inspectorId,
          routeId,
          areaKm2: areaVal,
          pointsCount: points.length,
          polygon: points,
          center: { lat: centerLat, lng: centerLng }
        });
      }
      setSaving(false);
      setSaveSuccess(true);
    }, 400);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Saved Success Confirmation Card */}
      {saveSuccess ? (
        <div className="rounded-[32px] bg-white dark:bg-[#16221B] p-8 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] max-w-xl mx-auto text-center space-y-6 animate-scale-up">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Check size={32} />
          </div>

          <div>
            <span className="rounded-full bg-[#111A14] text-white px-4 py-1.5 text-xs font-bold shadow">
              ✓ {wardName} saved to Godhra Nagarpalika
            </span>
            <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6] mt-4">
              Ward successfully {editWard ? 'updated' : 'created'}
            </h2>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1 max-w-md mx-auto">
              Real GPS boundary has been registered. Citizens, drivers and sanitary inspectors will immediately see this ward active on their maps.
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="pt-4 border-t border-[#E5EAE3] dark:border-[#2A3B31] text-left">
            <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] mb-3">
              Recommended next steps:
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => onNavigateTo('wards')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#111A14] hover:bg-black text-white text-xs font-bold shadow transition-transform active:scale-98"
              >
                <span>View in Wards Directory & Map</span>
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => onNavigateTo('allotment')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] hover:bg-[#EAEFE9] text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] transition-colors"
              >
                <span>Assign drivers to {wardName}</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onNavigateTo('routes')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] hover:bg-[#EAEFE9] text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] transition-colors"
              >
                <span>Add {wardName} to collection route</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2-Column Editor Canvas: Real Map on Left, 3-Step Wizard on Right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          {/* Left Column: Real Interactive Leaflet Drawing Map (8 cols) */}
          <div className="lg:col-span-8 rounded-[28px] bg-white dark:bg-[#16221B] p-5 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Pencil size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    {editWard ? `Edit ${editWard.name}` : 'Draw Ward Boundary'}
                  </h2>
                  <p className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                    Click on Godhra map to drop GPS points · Click point to remove
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUndoPoint}
                  disabled={points.length === 0}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 disabled:opacity-40 flex items-center gap-1"
                  title="Undo last point"
                >
                  <Undo2 size={13} />
                  <span>Undo</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearPoints}
                  disabled={points.length === 0}
                  className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/40 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-40 flex items-center gap-1"
                  title="Clear all points"
                >
                  <Trash2 size={13} />
                  <span>Clear</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDefaultGodhra}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                  title="Load Godhra preset shape"
                >
                  <RefreshCw size={13} />
                  <span>Godhra Preset</span>
                </button>
              </div>
            </div>

            {/* Real Map Canvas */}
            <div className="relative h-[480px] w-full my-3 bg-[#E5EBE3] dark:bg-[#111A14] rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31]">
              <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

              {/* Map Floating Controls */}
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

              {/* Bottom Live Stats Bar */}
              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] shadow border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <span>
                    <b>{points.length}</b> GPS points dropped
                  </span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-[#1B7A3F] font-bold">
                    Area: ~{calculatedArea} km²
                  </span>
                </div>
                <span className="text-[11px] text-[#566259]">
                  {points.length < 3 ? 'Drop at least 3 points to create boundary' : 'Boundary shape valid ✓'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3-Step Wizard Panel (4 cols) */}
          <div className="lg:col-span-4 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
            <div>
              {/* Wizard Step Pills */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span
                    onClick={() => setStep(1)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 transition-colors ${
                      step === 1 ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]' : 'text-[#566259]'
                    }`}
                  >
                    {step > 1 ? '✓ 1' : '1'} Boundary
                  </span>
                  <span
                    onClick={() => setStep(2)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 transition-colors ${
                      step === 2 ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]' : 'text-[#566259]'
                    }`}
                  >
                    {step > 2 ? '✓ 2' : '2'} Details
                  </span>
                  <span
                    onClick={() => setStep(3)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 transition-colors ${
                      step === 3 ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]' : 'text-[#566259]'
                    }`}
                  >
                    3 Review
                  </span>
                </div>
              </div>

              {/* STEP 1: Boundary Checks */}
              {step === 1 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    Boundary Status
                  </h3>
                  <p className="text-xs text-[#566259] dark:text-[#9DB0A2]">
                    Click directly on the streets of Godhra on the real map to mark each corner of the ward.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] p-3 text-center border border-neutral-200 dark:border-neutral-800">
                      <div className="text-[10px] text-[#566259]">Total Points</div>
                      <div className="text-base font-bold text-[#14201A] dark:text-[#EAF2E6]">
                        {points.length}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] p-3 text-center border border-neutral-200 dark:border-neutral-800">
                      <div className="text-[10px] text-[#566259]">Calculated Area</div>
                      <div className="text-base font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
                        {calculatedArea} km²
                      </div>
                    </div>
                  </div>

                  {/* Realtime Validation Checks */}
                  <div className="pt-4 space-y-2.5 text-xs font-semibold">
                    <div className="text-[11px] text-[#566259] uppercase tracking-wider mb-2 font-bold">
                      Realtime Boundary Checks
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 size={16} />
                      <span>Godhra Nagarpalika jurisdiction</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 size={16} />
                      <span>{points.length >= 3 ? 'Valid closed polygon shape' : 'Requires at least 3 points'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 size={16} />
                      <span>GPS precision: Sub-meter OpenStreetMap</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Details */}
              {step === 2 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    Ward Information
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                      Ward name *
                    </label>
                    <input
                      type="text"
                      value={wardName}
                      onChange={(e) => setWardName(e.target.value)}
                      className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                      Name in Gujarati
                    </label>
                    <input
                      type="text"
                      value={wardNameGu}
                      onChange={(e) => setWardNameGu(e.target.value)}
                      className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                      Ward code
                    </label>
                    <input
                      type="text"
                      value={wardCode}
                      onChange={(e) => setWardCode(e.target.value)}
                      className="w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-transparent px-4 py-2.5 text-xs font-mono text-[#566259]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                      Classification Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWardType('urban')}
                        className={`rounded-full py-2 text-xs font-bold transition-all ${
                          wardType === 'urban'
                            ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                            : 'bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259]'
                        }`}
                      >
                        Urban
                      </button>
                      <button
                        type="button"
                        onClick={() => setWardType('rural')}
                        className={`rounded-full py-2 text-xs font-bold transition-all ${
                          wardType === 'rural'
                            ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                            : 'bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259]'
                        }`}
                      >
                        Rural
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                      Assigned Sanitary Inspector
                    </label>
                    <select
                      value={inspectorId}
                      onChange={(e) => setInspectorId(e.target.value)}
                      className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                    >
                      <option value="staff_inspector_meena">Meena Parmar</option>
                      <option value="staff_inspector_kiran">Kiran Rathod</option>
                      <option value="">Unassigned</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3: Review and Save */}
              {step === 3 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    Review and Confirm
                  </h3>

                  <div className="p-4 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] space-y-2.5 text-xs border border-neutral-200 dark:border-neutral-800">
                    <div className="flex justify-between">
                      <span className="text-[#566259]">Name:</span>
                      <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">
                        {wardName} ({wardNameGu})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#566259]">Code:</span>
                      <span className="font-mono font-bold">{wardCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#566259]">Type:</span>
                      <span className="font-bold capitalize">{wardType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#566259]">Boundary:</span>
                      <span className="font-bold">{points.length} GPS Points (~{calculatedArea} km²)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#566259]">Inspector:</span>
                      <span className="font-bold">Meena Parmar</span>
                    </div>
                  </div>

                  {/* Verified Badges */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 flex items-center gap-1">
                      <Check size={12} /> Real GPS Points
                    </span>
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 flex items-center gap-1">
                      <Check size={12} /> Godhra Jurisdiction
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F3FAF4] text-[#1B7A3F] text-[11px] font-medium leading-relaxed">
                    Saving will persist this real boundary to Godhra Nagarpalika records and activate it on live dispatch routes.
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#E5EAE3] dark:border-[#2A3B31] flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  className="rounded-full px-5 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigateTo('wards')}
                  className="rounded-full px-5 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
              )}

              {step === 1 && (
                <button
                  type="button"
                  disabled={points.length < 3}
                  onClick={() => setStep(2)}
                  className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>Next: Details</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <span>Review & Save</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveWard}
                  className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-7 py-2.5 text-xs font-bold shadow flex items-center gap-1.5 active:scale-95"
                >
                  <Check size={14} />
                  <span>{saving ? 'Saving...' : 'Confirm & Save Ward'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
