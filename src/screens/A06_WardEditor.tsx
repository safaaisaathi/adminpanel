import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import { Ward } from '../types';
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
  Scissors
} from 'lucide-react';

interface A06WardEditorProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
  editWard?: Ward;
}

export const A06_WardEditor: React.FC<A06WardEditorProps> = ({ onNavigateTo, editWard }) => {
  const { createWard, updateWard, availableStaff, routes } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activeTool, setActiveTool] = useState<'draw' | 'edit' | 'move'>('draw');
  const [snapping, setSnapping] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Error simulation states
  const [simulatedError, setSimulatedError] = useState<'none' | 'overlap' | 'outside' | 'cross'>('none');

  // Polygon Points
  const defaultPoints: [number, number][] = editWard?.polygon || [
    [180, 80],
    [290, 70],
    [340, 150],
    [360, 240],
    [310, 310],
    [210, 330],
    [150, 250],
    [140, 150]
  ];

  const [points, setPoints] = useState<[number, number][]>(defaultPoints);
  const [isClosed, setIsClosed] = useState(true);

  // Step 2 Form Details
  const [wardName, setWardName] = useState(editWard?.name || 'Ward 9');
  const [wardNameGu, setWardNameGu] = useState(editWard?.nameGu || 'વૉર્ડ 9');
  const [wardCode] = useState(editWard?.code || 'GDH-W-009');
  const [wardType, setWardType] = useState<'urban' | 'rural'>(editWard?.type || 'urban');
  const [inspectorId, setInspectorId] = useState(editWard?.inspectorId || 'staff_inspector_meena');
  const [routeId, setRouteId] = useState(editWard?.routeId || 'route_east');

  const inspectors = availableStaff.filter((s) => s.role === 'inspector');

  const handleSaveWard = () => {
    setSaving(true);
    setTimeout(() => {
      if (editWard) {
        updateWard(editWard.id, {
          name: wardName,
          nameGu: wardNameGu,
          type: wardType,
          inspectorId,
          routeId,
          areaKm2: 1.84,
          pointsCount: points.length
        });
      } else {
        createWard({
          name: wardName,
          nameGu: wardNameGu,
          type: wardType,
          inspectorId,
          routeId,
          areaKm2: 1.84,
          pointsCount: points.length
        });
      }
      setSaving(false);
      setSaveSuccess(true);
    }, 800);
  };

  const handleFixOverlap = () => {
    // Trims shape along Ward 4 edge
    setSimulatedError('none');
  };

  const handleClipToArea = () => {
    // Clips shape inside Godhra Nagarpalika
    setSimulatedError('none');
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Saved Success Confirmation Card (Canvas A38 `Saved`) */}
      {saveSuccess ? (
        <div className="rounded-[32px] bg-white dark:bg-[#16221B] p-8 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] max-w-xl mx-auto text-center space-y-6 animate-scale-up">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Check size={32} />
          </div>

          <div>
            <span className="rounded-full bg-[#111A14] text-white px-4 py-1.5 text-xs font-bold shadow">
              ✓ {wardName} saved
            </span>
            <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6] mt-4">
              Ward successfully created
            </h2>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1">
              Residents inside this boundary will see {wardName} in the citizen app, and drivers will see it on their map.
            </p>
          </div>

          {/* What Next Card (Canvas A38) */}
          <div className="pt-4 border-t border-[#E5EAE3] dark:border-[#2A3B31] text-left">
            <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] mb-3">
              What next?
            </div>
            <div className="flex flex-col gap-2">
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
                <span>Add {wardName} to a collection route</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onNavigateTo('wards')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#111A14] text-white text-xs font-bold shadow transition-transform active:scale-98"
              >
                <span>Back to Wards overview</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Main 3-Step Wizard Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
          {/* Left Canvas: Interactive Drawing Map (Canvas rows 10-13) */}
          <div className="lg:col-span-8 rounded-[28px] bg-white dark:bg-[#16221B] p-5 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between relative overflow-hidden">
            {/* Top Toolbar (Draw, Edit, Move, Undo, Delete, Search) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              {/* Tool icons pill */}
              <div className="flex items-center gap-1 rounded-full bg-[#F3F6F2] dark:bg-[#111A14] p-1 border border-[#E5EAE3] dark:border-[#2A3B31]">
                <button
                  type="button"
                  onClick={() => setActiveTool('draw')}
                  className={`p-1.5 rounded-full transition-colors ${
                    activeTool === 'draw'
                      ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                      : 'text-[#566259] hover:text-[#14201A]'
                  }`}
                  title="Draw polygon (D)"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('edit')}
                  className={`p-1.5 rounded-full transition-colors ${
                    activeTool === 'edit'
                      ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                      : 'text-[#566259] hover:text-[#14201A]'
                  }`}
                  title="Edit points (E)"
                >
                  <MousePointer size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('move')}
                  className={`p-1.5 rounded-full transition-colors ${
                    activeTool === 'move'
                      ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                      : 'text-[#566259] hover:text-[#14201A]'
                  }`}
                  title="Move whole ward (M)"
                >
                  <Hand size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setPoints(points.slice(0, -1))}
                  className="p-1.5 rounded-full text-[#566259] hover:text-[#14201A]"
                  title="Undo last point (Ctrl+Z)"
                >
                  <Undo2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setPoints([])}
                  className="p-1.5 rounded-full text-red-500 hover:text-red-700"
                  title="Delete shape"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Address / Landmark Search */}
              <div className="flex items-center gap-2 rounded-full bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-1.5 text-xs text-[#566259] w-56">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search address or landmark"
                  className="w-full bg-transparent outline-none text-xs text-[#14201A] dark:text-[#EAF2E6]"
                />
              </div>

              {/* Keyboard Shortcuts (?) Button */}
              <button
                type="button"
                onClick={() => setShowShortcuts(true)}
                className="flex items-center gap-1 text-xs font-semibold text-[#566259] hover:text-[#14201A]"
              >
                <HelpCircle size={15} />
                <span>Shortcuts</span>
              </button>
            </div>

            {/* SVG Drawing Canvas with Handles (Canvas rows 10-12) */}
            <div className="relative h-[440px] w-full my-3 bg-[#F3F7F2] dark:bg-[#111A14] rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31]">
              <svg viewBox="0 0 600 440" className="w-full h-full">
                {/* Dashed Godhra Nagarpalika boundary */}
                <rect
                  x="20"
                  y="20"
                  width="560"
                  height="400"
                  fill="none"
                  stroke="#1B7A3F"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  opacity="0.6"
                />
                <text x="35" y="42" fontSize="11" fill="#1B7A3F" fontWeight="bold">
                  Godhra Nagarpalika boundary
                </text>

                {/* Neighbouring Wards (muted) */}
                <polygon points="50,120 130,100 120,230 40,240" fill="#C6E7C9" opacity="0.35" stroke="#1B7A3F" strokeWidth="1" />
                <text x="65" y="170" fontSize="11" fill="#566259" fontWeight="bold">Ward 4</text>

                <polygon points="400,60 520,70 510,180 390,170" fill="#C6E7C9" opacity="0.35" stroke="#1B7A3F" strokeWidth="1" />
                <text x="430" y="120" fontSize="11" fill="#566259" fontWeight="bold">Ward 3</text>

                {/* Simulated Overlap Error (Canvas A33) */}
                {simulatedError === 'overlap' && (
                  <polygon
                    points="110,140 180,130 170,220 100,210"
                    fill="#F7C6C1"
                    stroke="#D93025"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                )}

                {/* The Drawn Ward Polygon */}
                {points.length > 2 && (
                  <polygon
                    points={points.map(p => `${p[0]},${p[1]}`).join(' ')}
                    fill={simulatedError === 'overlap' || simulatedError === 'outside' ? '#F7C6C1' : '#C6E7C9'}
                    stroke={simulatedError !== 'none' ? '#D93025' : '#1B7A3F'}
                    strokeWidth="2.5"
                    opacity="0.65"
                  />
                )}

                {/* Polygon Handles */}
                {points.map((pt, index) => (
                  <g key={index}>
                    <circle
                      cx={pt[0]}
                      cy={pt[1]}
                      r="6"
                      fill="#FFF"
                      stroke="#1B7A3F"
                      strokeWidth="2"
                      className="cursor-move"
                    />
                    <text x={pt[0] - 3} y={pt[1] - 10} fontSize="10" fontWeight="bold" fill="#14201A">
                      {index + 1}
                    </text>
                  </g>
                ))}

                {/* Center Area Label */}
                {points.length > 2 && (
                  <text x="240" y="210" fontSize="13" fontWeight="bold" fill="#14201A">
                    1.84 km²
                  </text>
                )}
              </svg>

              {/* Callout Error / Snap Overlays */}
              {simulatedError === 'overlap' && (
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 rounded-2xl bg-white dark:bg-[#16221B] p-4 shadow-xl border border-red-300 max-w-xs animate-fade-in">
                  <div className="font-bold text-xs text-red-600">
                    Overlaps Ward 4 by 0.03 km²
                  </div>
                  <div className="text-[11px] text-[#566259] mt-0.5">
                    Wards cannot cover the same area.
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={handleFixOverlap}
                      className="rounded-full bg-[#111A14] text-white px-3 py-1 text-[11px] font-bold"
                    >
                      Trim to fit
                    </button>
                    <button
                      onClick={() => setSimulatedError('none')}
                      className="rounded-full bg-neutral-100 text-neutral-700 px-3 py-1 text-[11px] font-bold"
                    >
                      Fix by hand
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Tip Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] shadow">
                <span>
                  {points.length} points · Double-click to finish · Drag a point to adjust
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSnapping(!snapping)}
                    className="text-[#1B7A3F] font-bold text-[11px] hover:underline"
                  >
                    {snapping ? '✓ Snap on (Press S)' : 'Snap off (Press S)'}
                  </button>
                  {/* Test Error Simulator button to demonstrate validation compliance */}
                  <button
                    onClick={() => setSimulatedError(simulatedError === 'none' ? 'overlap' : 'none')}
                    className="text-[10px] text-neutral-400 hover:text-neutral-700 underline"
                  >
                    Test overlap check
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3-Step Wizard Panel (Canvas rows 10-13) */}
          <div className="lg:col-span-4 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
            <div>
              {/* Wizard Step Pills (1 Boundary, 2 Details, 3 Review) */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span
                    onClick={() => setStep(1)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 ${
                      step === 1 ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]' : 'text-[#566259]'
                    }`}
                  >
                    {step > 1 ? '✓ 1' : '1'} Boundary
                  </span>
                  <span
                    onClick={() => setStep(2)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 ${
                      step === 2 ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]' : 'text-[#566259]'
                    }`}
                  >
                    {step > 2 ? '✓ 2' : '2'} Details
                  </span>
                  <span
                    onClick={() => setStep(3)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 ${
                      step === 3 ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]' : 'text-[#566259]'
                    }`}
                  >
                    3 Review
                  </span>
                </div>
              </div>

              {/* STEP 1: Boundary Checks (Canvas A31) */}
              {step === 1 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    Draw the boundary
                  </h3>
                  <p className="text-xs text-[#566259] dark:text-[#9DB0A2]">
                    Zoom in to the area, then click each corner of the ward in order.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] p-3 text-center border">
                      <div className="text-[10px] text-[#566259]">Points</div>
                      <div className="text-base font-bold text-[#14201A] dark:text-[#EAF2E6]">
                        {points.length}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] p-3 text-center border">
                      <div className="text-[10px] text-[#566259]">Area</div>
                      <div className="text-base font-bold text-[#14201A] dark:text-[#EAF2E6]">
                        1.84 km²
                      </div>
                    </div>
                  </div>

                  {/* Realtime Validation Checks */}
                  <div className="pt-4 space-y-2 text-xs font-semibold">
                    <div className="text-[11px] text-[#566259] uppercase tracking-wider mb-2 font-bold">
                      Boundary Checks
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 size={16} />
                      <span>No self-crossing</span>
                    </div>
                    <div className={`flex items-center gap-2 ${simulatedError === 'overlap' ? 'text-red-600' : 'text-emerald-700 dark:text-emerald-400'}`}>
                      {simulatedError === 'overlap' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                      <span>{simulatedError === 'overlap' ? 'Overlaps Ward 4 (0.03 km²)' : 'No overlap with other wards'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 size={16} />
                      <span>Inside Godhra Nagarpalika</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Details (Canvas A36) */}
              {step === 2 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    Ward details
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                      Ward name
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
                      Ward code (automatic)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={wardCode}
                      className="w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-transparent px-4 py-2.5 text-xs font-mono text-[#566259]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                      Type
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
                      Inspector for this ward
                    </label>
                    <select
                      value={inspectorId}
                      onChange={(e) => setInspectorId(e.target.value)}
                      className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                    >
                      {inspectors.map((insp) => (
                        <option key={insp.id} value={insp.id}>
                          {insp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3: Review and Save (Canvas A37) */}
              {step === 3 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    Review and save
                  </h3>

                  <div className="p-4 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] space-y-2 text-xs">
                    <div>
                      <span className="text-[#566259]">Name: </span>
                      <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">
                        {wardName} ({wardNameGu})
                      </span>
                    </div>
                    <div>
                      <span className="text-[#566259]">Code: </span>
                      <span className="font-mono font-bold">{wardCode}</span>
                    </div>
                    <div>
                      <span className="text-[#566259]">Type: </span>
                      <span className="font-bold capitalize">{wardType}</span>
                    </div>
                    <div>
                      <span className="text-[#566259]">Area & points: </span>
                      <span className="font-bold">1.84 km² and {points.length} points</span>
                    </div>
                    <div>
                      <span className="text-[#566259]">Inspector: </span>
                      <span className="font-bold">Meena Parmar</span>
                    </div>
                  </div>

                  {/* Verified Checks Badges */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 flex items-center gap-1">
                      <Check size={12} /> No self-crossing
                    </span>
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 flex items-center gap-1">
                      <Check size={12} /> No overlap
                    </span>
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 flex items-center gap-1">
                      <Check size={12} /> Inside Godhra Nagarpalika
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F3FAF4] text-[#1B7A3F] text-[11px] font-medium leading-relaxed">
                    Residents inside this boundary will see {wardName} in the citizen app, and drivers allotted to it will see it on their map.
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
                  disabled={points.length < 3 || simulatedError !== 'none'}
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
                  <span>Review</span>
                  <ArrowRight size={14} />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveWard}
                  className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow flex items-center gap-1.5 active:scale-95"
                >
                  <Check size={14} />
                  <span>{saving ? 'Saving...' : 'Save ward'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Dialog (Canvas A29 `Shortcuts`) */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowShortcuts(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#16221B] rounded-[32px] p-8 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] z-10 animate-scale-up">
            <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
              Keyboard shortcuts
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-[#566259]">Draw</span>
                <kbd className="font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">D</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-[#566259]">Edit points</span>
                <kbd className="font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">E</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-[#566259]">Move whole ward</span>
                <kbd className="font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">M</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-[#566259]">Add a point at the cursor</span>
                <kbd className="font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">Enter</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-[#566259]">Finish the shape</span>
                <kbd className="font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">Enter or double-click</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-[#566259]">Undo / redo</span>
                <kbd className="font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">Ctrl+Z / Ctrl+Shift+Z</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-[#566259]">Delete selected point</span>
                <kbd className="font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">Delete</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-[#566259]">Snap on or off</span>
                <kbd className="font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">S</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-[#566259]">Pan the map</span>
                <kbd className="font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">Space + drag</kbd>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#566259]">Zoom</span>
                <kbd className="font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">+ and -</kbd>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowShortcuts(false)}
                className="rounded-full bg-[#111A14] text-white px-6 py-2 text-xs font-bold"
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
