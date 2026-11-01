import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import { Ward } from '../types';
import L from 'leaflet';
import {
  Building2,
  Plus,
  Trash2,
  Edit2,
  X,
  UserCheck,
  AlertTriangle,
  Upload,
  Copy,
  Pencil,
  Check,
  MapPin,
  Clock,
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  Move,
  MousePointer,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Binny } from '../components/Binny';

interface A05WardsProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A05_Wards: React.FC<A05WardsProps> = ({ onNavigateTo }) => {
  const { wards, drivers, complaints, routes, deleteWard, createWard, updateWard, availableStaff } = useApp();

  const [selectedWard, setSelectedWard] = useState<Ward | null>(wards[0] || null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'quick' | 'draw'>('quick');
  const [blockedDeleteReasons, setBlockedDeleteReasons] = useState<string[] | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // DRAG & EDIT AREA STATES (Option 2: Point dragging & area editing)
  const [isDragEditing, setIsDragEditing] = useState(false);
  const [dragPoints, setDragPoints] = useState<[number, number][]>([]);
  const [dragArea, setDragArea] = useState<string>('0.00');

  // Quick Add Form States
  const [quickName, setQuickName] = useState(`Ward ${wards.length + 4}`);
  const [quickNameGu, setQuickNameGu] = useState(`વૉર્ડ ${wards.length + 4}`);
  const [quickCode, setQuickCode] = useState(`GDH-W-00${wards.length + 4}`);
  const [quickType, setQuickType] = useState<'urban' | 'rural'>('urban');
  const [quickArea, setQuickArea] = useState('1.65');
  const [quickInspector, setQuickInspector] = useState('staff_inspector_meena');

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayersRef = useRef<L.LayerGroup | null>(null);
  const dragLayersRef = useRef<L.LayerGroup | null>(null);

  // Count wards without inspector
  const wardsWithoutInspector = wards.filter(w => !w.inspectorId).length;

  // Approximate area calculation in km²
  const calculatePolygonAreaKm2 = (pts: [number, number][]) => {
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

  const handleSelectWard = (w: Ward) => {
    setSelectedWard(w);
    if (!isDragEditing) {
      setIsDrawerOpen(true);
    }

    if (mapInstanceRef.current && w.center) {
      mapInstanceRef.current.flyTo([w.center.lat, w.center.lng], 15, { duration: 0.8 });
    }
  };

  const startDragEditing = (w: Ward) => {
    setSelectedWard(w);
    setIsDrawerOpen(false);
    const initialPts: [number, number][] = w.polygon && w.polygon.length > 0
      ? w.polygon.map((p) => [p[0], p[1]] as [number, number])
      : [
          [22.775, 73.604],
          [22.776, 73.612],
          [22.771, 73.614],
          [22.768, 73.607]
        ];
    setDragPoints(initialPts);
    setDragArea(w.areaKm2 ? w.areaKm2.toFixed(2) : calculatePolygonAreaKm2(initialPts));
    setIsDragEditing(true);

    if (mapInstanceRef.current && w.center) {
      mapInstanceRef.current.flyTo([w.center.lat, w.center.lng], 15, { duration: 0.6 });
    }
  };

  const handleSaveDragChanges = () => {
    if (!selectedWard) return;
    const centerLat = dragPoints.length > 0 ? dragPoints.reduce((acc, p) => acc + p[0], 0) / dragPoints.length : 22.7758;
    const centerLng = dragPoints.length > 0 ? dragPoints.reduce((acc, p) => acc + p[1], 0) / dragPoints.length : 73.6149;
    const newArea = parseFloat(dragArea) || selectedWard.areaKm2;

    updateWard(selectedWard.id, {
      polygon: dragPoints,
      areaKm2: newArea,
      pointsCount: dragPoints.length,
      center: { lat: centerLat, lng: centerLng }
    });

    setIsDragEditing(false);
    showToast(`✓ ${selectedWard.name} boundary & area updated to ${newArea} km²!`);
  };

  const handleCancelDrag = () => {
    setIsDragEditing(false);
  };

  const handleResetDragPoints = () => {
    if (!selectedWard || !selectedWard.polygon) return;
    const pts: [number, number][] = selectedWard.polygon.map((p) => [p[0], p[1]] as [number, number]);
    setDragPoints(pts);
    setDragArea(selectedWard.areaKm2.toFixed(2));
  };

  const handleDeleteClick = (ward: Ward) => {
    const res = deleteWard(ward.id);
    if (!res.success && res.reasons) {
      setBlockedDeleteReasons(res.reasons);
    } else {
      setIsDrawerOpen(false);
      setSelectedWard(wards.find(w => w.id !== ward.id) || null);
      showToast(`${ward.name} deleted successfully`);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Quick Ward Creation Submit
  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    // Generate real coordinates in Godhra area
    const offsetLat = 22.7758 + (Math.random() - 0.5) * 0.03;
    const offsetLng = 73.6149 + (Math.random() - 0.5) * 0.03;
    const size = 0.006;

    const newPolygon: [number, number][] = [
      [offsetLat + size, offsetLng - size],
      [offsetLat + size, offsetLng + size],
      [offsetLat - size, offsetLng + size],
      [offsetLat - size, offsetLng - size],
      [offsetLat + size, offsetLng - size],
    ];

    const created = createWard({
      name: quickName,
      nameGu: quickNameGu || quickName,
      code: quickCode,
      type: quickType,
      areaKm2: parseFloat(quickArea) || 1.5,
      inspectorId: quickInspector,
      center: { lat: offsetLat, lng: offsetLng },
      radiusM: 700,
      polygon: newPolygon,
      pointsCount: newPolygon.length
    });

    setShowAddModal(false);
    setSelectedWard(created);
    showToast(`✓ ${created.name} (${created.code}) created successfully!`);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([offsetLat, offsetLng], 15, { duration: 1 });
    }
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

    const polyGroup = L.layerGroup().addTo(map);
    polygonLayersRef.current = polyGroup;

    const dragGroup = L.layerGroup().addTo(map);
    dragLayersRef.current = dragGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render ward polygons on the map (Standard View / Select Mode)
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonLayersRef.current) return;
    const group = polygonLayersRef.current;
    group.clearLayers();

    // When in drag editing mode, we let the drag layer handle the selected ward
    const colors = ['#1B7A3F', '#2F6FDE', '#E87A17', '#9333EA', '#059669', '#D97706'];

    wards.forEach((ward, idx) => {
      if (!ward.polygon || ward.polygon.length === 0) return;

      const isSelected = selectedWard?.id === ward.id;
      if (isDragEditing && isSelected) return; // handled by drag editing effect

      const color = colors[idx % colors.length];

      // Draw real polygon
      const poly = L.polygon(ward.polygon as L.LatLngExpression[], {
        color: isSelected ? '#1B7A3F' : color,
        weight: isSelected ? 3.5 : 2,
        fillColor: isSelected ? '#22C55E' : color,
        fillOpacity: isSelected ? 0.35 : 0.2,
        dashArray: isSelected ? undefined : '4 4'
      });

      // Hover and Click events
      poly.on('click', () => {
        handleSelectWard(ward);
      });

      poly.bindTooltip(`<b>${ward.name}</b> (${ward.code})<br/>Area: ${ward.areaKm2} km²`, {
        permanent: false,
        direction: 'center',
        className: 'font-sans text-xs bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-neutral-200'
      });

      group.addLayer(poly);

      // Center marker with ward label
      if (ward.center) {
        const centerIcon = L.divIcon({
          className: 'custom-ward-label',
          html: `<div style="
            background: ${isSelected ? '#111A14' : 'rgba(255,255,255,0.95)'};
            color: ${isSelected ? '#FFF' : '#14201A'};
            border: 1.5px solid ${color};
            border-radius: 9999px;
            padding: 3px 8px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            transform: translate(-50%, -50%);
            display: inline-block;
            cursor: pointer;
          ">${ward.name}</div>`,
          iconSize: [0, 0]
        });

        const labelMarker = L.marker([ward.center.lat, ward.center.lng], { icon: centerIcon });
        labelMarker.on('click', () => handleSelectWard(ward));
        group.addLayer(labelMarker);
      }
    });
  }, [wards, selectedWard, isDragEditing]);

  // DRAG & RESIZE AREA INTERACTIVE EFFECT
  useEffect(() => {
    if (!dragLayersRef.current) return;
    const group = dragLayersRef.current;
    group.clearLayers();

    if (!isDragEditing || !selectedWard || dragPoints.length === 0) return;

    // Active editable polygon
    const activePoly = L.polygon(dragPoints as L.LatLngExpression[], {
      color: '#1B7A3F',
      weight: 3.5,
      fillColor: '#22C55E',
      fillOpacity: 0.3
    });
    group.addLayer(activePoly);

    // Draggable vertex handles at each point
    const currentPts = [...dragPoints];

    dragPoints.forEach((pt, idx) => {
      const handleIcon = L.divIcon({
        className: 'custom-drag-handle',
        html: `<div style="
          width: 26px;
          height: 26px;
          background: #111A14;
          color: #FFF;
          border: 2.5px solid #22C55E;
          border-radius: 9999px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          cursor: grab;
          transform: translate(-50%, -50%);
        ">${idx + 1}</div>`,
        iconSize: [0, 0]
      });

      const marker = L.marker(pt, { icon: handleIcon, draggable: true });
      marker.bindTooltip(`<b>Handle ${idx + 1}</b><br/>Drag to reshape area`, {
        direction: 'top'
      });

      // While dragging: live update polygon coordinates & live area without recreating marker
      marker.on('drag', (e: any) => {
        const latlng = e.target.getLatLng();
        currentPts[idx] = [latlng.lat, latlng.lng];
        activePoly.setLatLngs(currentPts as L.LatLngExpression[]);
        setDragArea(calculatePolygonAreaKm2(currentPts));
      });

      // On dragend: sync React state
      marker.on('dragend', (e: any) => {
        const latlng = e.target.getLatLng();
        setDragPoints((prev) => {
          const next = [...prev];
          next[idx] = [
            parseFloat(latlng.lat.toFixed(5)),
            parseFloat(latlng.lng.toFixed(5))
          ];
          return next;
        });
      });

      group.addLayer(marker);
    });
  }, [isDragEditing, selectedWard]);

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#111A14] text-white px-5 py-3 shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-slide-up border border-emerald-500/30">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#16221B] p-4 rounded-2xl border border-[#E5EAE3] dark:border-[#2A3B31] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#14201A] dark:text-[#EAF2E6] flex items-center gap-2">
            <span>Jurisdiction & Wards</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold">
              Godhra Nagarpalika
            </span>
          </h2>
          <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
            Real GPS ward boundaries · Click to view jurisdiction OR drag points to edit boundary area.
          </p>
        </div>

        {/* Dual Mode & Add Ward Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedWard && !isDragEditing && (
            <button
              onClick={() => startDragEditing(selectedWard)}
              className="rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#1B7A3F] dark:bg-emerald-950/40 dark:text-emerald-300 px-4 py-2 text-xs font-bold border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1.5 transition-all shadow-xs"
              title="Drag corner handles to adjust selected ward boundary and area"
            >
              <Move size={14} />
              <span>Drag & Edit Area ({selectedWard.name})</span>
            </button>
          )}

          <button
            onClick={() => {
              setQuickName(`Ward ${wards.length + 4}`);
              setQuickCode(`GDH-W-00${wards.length + 4}`);
              setShowAddModal(true);
            }}
            className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-5 py-2 text-xs font-bold shadow flex items-center gap-2 transition-transform active:scale-95 shrink-0"
          >
            <Plus size={16} className="text-emerald-400" />
            <span>Add New Ward</span>
          </button>
        </div>
      </div>

      {/* If No Wards */}
      {wards.length === 0 ? (
        <div className="rounded-[32px] bg-white dark:bg-[#16221B] p-12 text-center border border-[#E5EAE3] dark:border-[#2A3B31] shadow-sm flex flex-col items-center justify-center min-h-[500px]">
          <Binny state="wait" size={140} />
          <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6] mt-4">
            No wards yet
          </h2>
          <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1 max-w-sm">
            Draw the first ward on the map. Citizens, drivers and inspectors will use it.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow"
          >
            Create ward
          </button>
        </div>
      ) : (
        /* Wards List + Real Interactive Map Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px]">
          {/* Left Column: Wards List (5 cols) */}
          <div className="lg:col-span-5 rounded-[28px] bg-white dark:bg-[#16221B] p-5 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <div>
                  <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    Wards Directory
                  </h3>
                  <span className="text-xs text-[#566259] dark:text-[#9DB0A2]">
                    {wards.length} wards configured
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-3 py-1 text-[11px] font-bold hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>New Ward</span>
                  </button>
                </div>
              </div>

              {/* Ward list items */}
              <div className="mt-3 space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {wards.map((ward) => {
                  const isSelected = selectedWard?.id === ward.id;
                  const inspector = ward.inspectorId ? 'Meena Parmar' : 'not assigned';

                  return (
                    <div
                      key={ward.id}
                      onClick={() => handleSelectWard(ward)}
                      className={`cursor-pointer rounded-2xl p-4 transition-all relative ${
                        isSelected
                          ? 'bg-[#EBF3EB] dark:bg-[#1E2D24] border border-[#1B7A3F] shadow-sm'
                          : 'bg-[#F8FAF7] dark:bg-[#111A14] hover:bg-[#EAEFE9] dark:hover:bg-[#16221B] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6] flex items-center gap-2">
                          <span>{ward.name}</span>
                          <span className="text-[10px] text-[#566259] font-normal px-2 py-0.5 rounded-md bg-neutral-200/50 dark:bg-neutral-800">
                            {ward.code}
                          </span>
                          {isDragEditing && isSelected && (
                            <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                              Editing Area
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
                          {ward.areaKm2} km²
                        </span>
                      </div>
                      <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2] mt-1.5 flex items-center justify-between">
                        <span>
                          Inspector: <span className={ward.inspectorId ? 'font-medium text-[#14201A] dark:text-[#EAF2E6]' : 'text-amber-600 font-semibold'}>{inspector}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startDragEditing(ward);
                            }}
                            className="text-[10px] text-[#1B7A3F] hover:underline font-bold flex items-center gap-0.5"
                          >
                            <Move size={11} />
                            <span>Drag Area</span>
                          </button>
                          <span className="capitalize text-[10px] text-neutral-500 font-semibold">
                            {ward.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom summary pill */}
            <div className="pt-3 border-t border-[#E5EAE3] dark:border-[#2A3B31] flex items-center justify-between text-xs font-semibold">
              <span className="text-[#14201A] dark:text-[#EAF2E6]">{wards.length} wards total</span>
              {wardsWithoutInspector > 0 && (
                <span className="text-[#A66800] dark:text-[#F3BA54] flex items-center gap-1 font-bold">
                  ! {wardsWithoutInspector} without inspector
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Real Leaflet Map with Drag Area & Selection (7 cols) */}
          <div className="lg:col-span-7 rounded-[28px] bg-white dark:bg-[#16221B] p-5 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#1B7A3F]" />
                <span className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  {isDragEditing && selectedWard
                    ? `Dragging & Editing: ${selectedWard.name}`
                    : 'Godhra Interactive Map (22.7758° N, 73.6149° E)'}
                </span>
              </div>

              {/* Mode switch pills */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsDragEditing(false)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    !isDragEditing
                      ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-[#566259]'
                  }`}
                >
                  Click to Select
                </button>
                {selectedWard && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isDragEditing) startDragEditing(selectedWard);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                      isDragEditing
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-[#566259] hover:text-[#14201A]'
                    }`}
                  >
                    <Move size={12} />
                    <span>Drag Points to Edit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Real Map Canvas */}
            <div className="relative h-[480px] w-full bg-[#E5EBE3] dark:bg-[#111A14] rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31]">
              <div ref={mapContainerRef} className="w-full h-full z-0" />

              {/* Custom Map Controls */}
              <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                <button
                  onClick={() => mapInstanceRef.current?.zoomIn()}
                  className="h-9 w-9 rounded-xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md shadow-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100 transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  onClick={() => mapInstanceRef.current?.zoomOut()}
                  className="h-9 w-9 rounded-xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md shadow-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100 transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  onClick={() => mapInstanceRef.current?.setView([22.7758, 73.6149], 14)}
                  className="h-9 w-9 rounded-xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md shadow-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[#1B7A3F] hover:bg-neutral-100 transition-colors"
                  title="Recenter to Godhra"
                >
                  <Navigation size={17} />
                </button>
              </div>

              {/* DRAG EDITING FLOATING TOOLBAR (Option 2) */}
              {isDragEditing && selectedWard ? (
                <div className="absolute top-3 left-3 right-16 z-20 rounded-2xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md p-3 shadow-xl border border-emerald-500/40 flex items-center justify-between gap-3 animate-slide-down">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center font-bold">
                      <Move size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                        Dragging points for {selectedWard.name}
                      </div>
                      <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                        Drag numbered pins to reshape · Live Area: <span className="font-bold text-[#1B7A3F] dark:text-[#6DB36F]">{dragArea} km²</span> ({dragPoints.length} points)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetDragPoints}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-600 hover:bg-neutral-100 flex items-center gap-1"
                      title="Reset to original boundary"
                    >
                      <RotateCcw size={12} />
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={handleCancelDrag}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDragChanges}
                      className="px-4 py-1.5 rounded-xl bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] text-xs font-bold shadow flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Check size={13} />
                      <span>Save Area</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Bottom Instructions Badge (Option 1) */
                <div className="absolute bottom-3 left-3 z-10 rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-bold text-[#14201A] dark:text-[#EAF2E6] shadow border border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
                  <span>Click any ward to view details or click "Drag Area" to reshape boundary</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD WARD MODAL (Quick Add + Draw Option) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowAddModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-[#16221B] rounded-[32px] p-7 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] z-10 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <h2 className="text-lg font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Add New Ward
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <button
                type="button"
                onClick={() => setAddMode('quick')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  addMode === 'quick'
                    ? 'bg-white dark:bg-[#16221B] text-[#14201A] dark:text-[#EAF2E6] shadow-xs'
                    : 'text-[#566259] dark:text-[#9DB0A2]'
                }`}
              >
                ⚡ Quick Add (1-Click)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  onNavigateTo('wardEditor');
                }}
                className="py-2 text-xs font-bold rounded-xl text-[#566259] dark:text-[#9DB0A2] hover:text-[#14201A] flex items-center justify-center gap-1"
              >
                <Pencil size={13} />
                <span>Draw on Real Map</span>
              </button>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleQuickAddSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Ward Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="e.g. Ward 9"
                    className="w-full rounded-xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-2 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Name in Gujarati
                  </label>
                  <input
                    type="text"
                    value={quickNameGu}
                    onChange={(e) => setQuickNameGu(e.target.value)}
                    placeholder="e.g. વૉર્ડ ૯"
                    className="w-full rounded-xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-2 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Ward Code
                  </label>
                  <input
                    type="text"
                    value={quickCode}
                    onChange={(e) => setQuickCode(e.target.value)}
                    className="w-full rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-transparent px-3.5 py-2 text-xs font-mono text-[#566259]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Area (km²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={quickArea}
                    onChange={(e) => setQuickArea(e.target.value)}
                    className="w-full rounded-xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-2 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickType('urban')}
                    className={`rounded-xl py-2 text-xs font-bold transition-all ${
                      quickType === 'urban'
                        ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                        : 'bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259]'
                    }`}
                  >
                    Urban
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickType('rural')}
                    className={`rounded-xl py-2 text-xs font-bold transition-all ${
                      quickType === 'rural'
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
                  Sanitary Inspector
                </label>
                <select
                  value={quickInspector}
                  onChange={(e) => setQuickInspector(e.target.value)}
                  className="w-full rounded-xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-2 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                >
                  <option value="staff_inspector_meena">Meena Parmar (Sanitary Inspector)</option>
                  <option value="staff_inspector_kiran">Kiran Rathod (Sanitary Inspector)</option>
                  <option value="">Unassigned</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                ✓ Auto-generates real Godhra Nagarpalika polygon and adds to the live database immediately.
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E5EAE3] dark:border-[#2A3B31]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-full px-5 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Check size={14} />
                  <span>Create Ward Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ward Details Drawer */}
      {isDrawerOpen && selectedWard && !isDragEditing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-[#16221B] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto z-10 animate-slide-left">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    {selectedWard.name}
                  </h2>
                  <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-xs font-semibold">
                    {selectedWard.type === 'urban' ? 'Urban' : 'Rural'}
                  </span>
                  <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-xs font-mono font-semibold">
                    {selectedWard.code}
                  </span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-4 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31]">
                  <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                    Area
                  </div>
                  <div className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6] mt-0.5">
                    {selectedWard.areaKm2} km²
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31]">
                  <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                    Boundary Points
                  </div>
                  <div className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6] mt-0.5">
                    {selectedWard.pointsCount || selectedWard.polygon?.length || 6}
                  </div>
                </div>
              </div>

              {/* Quick Area Drag Button */}
              <button
                onClick={() => startDragEditing(selectedWard)}
                className="w-full mt-4 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-[#1B7A3F] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs font-bold transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Move size={16} />
                  <span>Drag points on map to edit {selectedWard.name} area</span>
                </div>
                <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full font-bold">
                  Interactive
                </span>
              </button>

              {/* Inspector Card */}
              <div className="mt-4 p-4 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                      MP
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                        {selectedWard.inspectorId ? 'Meena Parmar' : 'Unassigned'}
                      </div>
                      <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                        Sanitary Inspector · Godhra
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateTo('staff')}
                    className="text-xs font-bold text-[#1B7A3F] dark:text-[#6DB36F] hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Route */}
              <div className="mt-4 p-4 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">Collection Route</div>
                  <div className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6] mt-0.5">
                    East Morning Collection Route
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTo('routes')}
                  className="text-xs font-bold text-[#1B7A3F] dark:text-[#6DB36F] hover:underline"
                >
                  View Route
                </button>
              </div>

              {/* GPS Coordinates Details */}
              {selectedWard.center && (
                <div className="mt-4 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] text-[#566259] flex items-center justify-between">
                  <span>GPS Center:</span>
                  <span className="font-mono font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    {selectedWard.center.lat.toFixed(4)}° N, {selectedWard.center.lng.toFixed(4)}° E
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-[#E5EAE3] dark:border-[#2A3B31] flex items-center justify-between gap-3">
              <button
                onClick={() => handleDeleteClick(selectedWard)}
                className="rounded-full px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={15} />
                <span>Delete ward</span>
              </button>

              <button
                onClick={() => onNavigateTo('wardEditor', { editWard: selectedWard })}
                className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow flex items-center gap-1.5"
              >
                <Edit2 size={15} />
                <span>Boundary Wizard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Blocked Modal */}
      {blockedDeleteReasons && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setBlockedDeleteReasons(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#16221B] rounded-[32px] p-8 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] z-10">
            <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6]">
              Ward can't be deleted yet
            </h2>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1">
              Active resources are currently allotted to this ward.
            </p>

            <div className="mt-6 space-y-3">
              {blockedDeleteReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#FFF8E6] dark:bg-[#332611] text-[#A66800] dark:text-[#F3BA54] text-xs font-bold flex items-center gap-2.5"
                >
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => {
                  setBlockedDeleteReasons(null);
                  onNavigateTo('allotment');
                }}
                className="rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 px-5 py-2.5 text-xs font-bold text-neutral-800 dark:text-neutral-200"
              >
                Go to Allotment
              </button>
              <button
                onClick={() => setBlockedDeleteReasons(null)}
                className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
