import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import { Ward } from '../types';
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
  Clock
} from 'lucide-react';
import { Binny } from '../components/Binny';

interface A05WardsProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A05_Wards: React.FC<A05WardsProps> = ({ onNavigateTo }) => {
  const { wards, drivers, complaints, routes, deleteWard, currentUser } = useApp();

  const [selectedWard, setSelectedWard] = useState<Ward | null>(wards[1] || wards[0] || null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [startMethod, setStartMethod] = useState<'draw' | 'upload' | 'copy'>('draw');
  const [blockedDeleteReasons, setBlockedDeleteReasons] = useState<string[] | null>(null);

  const isInspector = currentUser?.role === 'inspector';

  // Count wards without inspector
  const wardsWithoutInspector = wards.filter(w => !w.inspectorId).length;

  const handleSelectWard = (w: Ward) => {
    setSelectedWard(w);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (ward: Ward) => {
    const res = deleteWard(ward.id);
    if (!res.success && res.reasons) {
      setBlockedDeleteReasons(res.reasons);
    } else {
      setIsDrawerOpen(false);
      setSelectedWard(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* If No Wards (Empty state Canvas A26 `WardsEmpty`) */}
      {wards.length === 0 ? (
        <div className="rounded-[32px] bg-white dark:bg-[#16221B] p-12 text-center border border-[#E5EAE3] dark:border-[#2A3B31] shadow-sm flex flex-col items-center justify-center min-h-[500px]">
          <Binny state="wait" size={140} />
          <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6] mt-4">
            No wards yet
          </h2>
          <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1 max-w-sm">
            Draw the first ward on the map. Citizens, drivers and inspectors will use it.
          </p>
          {!isInspector && (
            <button
              onClick={() => setShowStartModal(true)}
              className="mt-6 rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow"
            >
              Create ward
            </button>
          )}
        </div>
      ) : (
        /* Wards List + Interactive Map Grid (Canvas A05) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px]">
          {/* Left Column: Wards List (5 cols) */}
          <div className="lg:col-span-5 rounded-[28px] bg-white dark:bg-[#16221B] p-5 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Wards
                </h3>
                <span className="text-xs text-[#566259] dark:text-[#9DB0A2]">
                  Showing {wards.length} wards
                </span>
              </div>

              {/* Ward list items */}
              <div className="mt-3 space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {wards.map((ward) => {
                  const isSelected = selectedWard?.id === ward.id;
                  const inspector = ward.inspectorId ? 'M. Parmar' : 'not assigned';

                  return (
                    <div
                      key={ward.id}
                      onClick={() => handleSelectWard(ward)}
                      className={`cursor-pointer rounded-2xl p-4 transition-all ${
                        isSelected
                          ? 'bg-[#EBF3EB] dark:bg-[#1E2D24] border border-[#1B7A3F]'
                          : 'bg-[#F8FAF7] dark:bg-[#111A14] hover:bg-[#EAEFE9] dark:hover:bg-[#16221B] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                          {ward.name} <span className="text-[#566259] font-normal">{ward.code}</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
                          {ward.areaKm2} km²
                        </span>
                      </div>
                      <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2] mt-1">
                        Inspector: <span className={ward.inspectorId ? 'font-medium text-[#14201A] dark:text-[#EAF2E6]' : 'text-amber-600 font-semibold'}>{inspector}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom summary pill (Canvas A05) */}
            <div className="pt-3 border-t border-[#E5EAE3] dark:border-[#2A3B31] flex items-center justify-between text-xs font-semibold">
              <span className="text-[#14201A] dark:text-[#EAF2E6]">{wards.length} wards</span>
              {wardsWithoutInspector > 0 && (
                <span className="text-[#A66800] dark:text-[#F3BA54] flex items-center gap-1 font-bold">
                  ! {wardsWithoutInspector} without inspector
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Ward Polygons Map (7 cols, Canvas A05) */}
          <div className="lg:col-span-7 rounded-[28px] bg-white dark:bg-[#16221B] p-5 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                Jurisdiction: Godhra Nagarpalika
              </div>
              {!isInspector && (
                <button
                  onClick={() => setShowStartModal(true)}
                  className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-4 py-1.5 text-xs font-bold shadow-sm"
                >
                  Create ward
                </button>
              )}
            </div>

            {/* Map Canvas with SVG Ward Polygons */}
            <div className="relative h-[480px] w-full bg-[#F3F7F2] dark:bg-[#111A14] rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31]">
              <svg viewBox="0 0 600 480" className="w-full h-full">
                {/* Road curves */}
                <path d="M 0 200 Q 300 240 600 180" stroke="#FFF" strokeWidth="16" fill="none" opacity="0.9" />
                <path d="M 220 0 Q 240 240 210 480" stroke="#FFF" strokeWidth="12" fill="none" opacity="0.9" />
                <path d="M 400 0 Q 380 240 450 480" stroke="#FFF" strokeWidth="12" fill="none" opacity="0.9" />

                {/* Ward 4 Polygon (Canvas A05 top left) */}
                <polygon
                  points="140,80 240,70 260,170 160,180"
                  fill="#C6E7C9"
                  stroke="#1B7A3F"
                  strokeWidth={selectedWard?.id === 'ward_4' ? 3.5 : 2}
                  className="cursor-pointer transition-all hover:opacity-80"
                  onClick={() => handleSelectWard(wards.find(w => w.id === 'ward_4') || wards[0])}
                />
                <text x="180" y="130" fontSize="12" fontWeight="bold" fill="#14201A">Ward 4</text>

                {/* Ward 5 Polygon (Canvas A05 top right, blue tint) */}
                <polygon
                  points="280,80 430,100 440,210 300,190"
                  fill="#CDE3F7"
                  stroke="#2F6FDE"
                  strokeWidth={selectedWard?.id === 'ward_5' ? 3.5 : 2}
                  className="cursor-pointer transition-all hover:opacity-80"
                  onClick={() => handleSelectWard(wards.find(w => w.id === 'ward_5') || wards[1])}
                />
                <text x="340" y="145" fontSize="12" fontWeight="bold" fill="#14201A">Ward 5</text>

                {/* Ward 6 Polygon (Canvas A05 bottom left, orange tint) */}
                <polygon
                  points="170,210 280,200 270,320 150,310"
                  fill="#FCE3C8"
                  stroke="#E87A17"
                  strokeWidth={selectedWard?.id === 'ward_6' ? 3.5 : 2}
                  className="cursor-pointer transition-all hover:opacity-80"
                  onClick={() => handleSelectWard(wards.find(w => w.id === 'ward_6') || wards[2])}
                />
                <text x="195" y="260" fontSize="12" fontWeight="bold" fill="#14201A">Ward 6</text>

                {/* Ward 7 Polygon (Canvas A05 bottom right, green tint) */}
                <polygon
                  points="320,210 490,230 470,350 310,330"
                  fill="#C6E7C9"
                  stroke="#1B7A3F"
                  strokeWidth={selectedWard?.id === 'ward_7' ? 3.5 : 2}
                  className="cursor-pointer transition-all hover:opacity-80"
                  onClick={() => handleSelectWard(wards.find(w => w.id === 'ward_7') || wards[3])}
                />
                <text x="380" y="275" fontSize="12" fontWeight="bold" fill="#14201A">Ward 7</text>

                {/* Ward 8 Polygon (Canvas A05 lower) */}
                <polygon
                  points="190,340 330,330 320,440 180,430"
                  fill="#EAF2E8"
                  stroke="#1B7A3F"
                  strokeWidth={selectedWard?.id === 'ward_8' ? 3.5 : 2}
                  className="cursor-pointer transition-all hover:opacity-80"
                  onClick={() => handleSelectWard(wards.find(w => w.id === 'ward_8') || wards[4])}
                />
                <text x="235" y="385" fontSize="12" fontWeight="bold" fill="#14201A">Ward 8</text>
              </svg>

              <div className="absolute bottom-3 left-3 rounded-full bg-white/90 dark:bg-[#16221B]/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-[#14201A] dark:text-[#EAF2E6] shadow">
                Click any ward to view detailed jurisdiction drawer
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ward Details Drawer (Canvas A41 `WardDrawer`) */}
      {isDrawerOpen && selectedWard && (
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

              {/* Boundary Preview Graphic */}
              <div className="my-5 h-40 w-full rounded-2xl bg-[#F3F7F2] dark:bg-[#111A14] flex items-center justify-center border border-[#E5EAE3] dark:border-[#2A3B31]">
                <svg viewBox="0 0 200 120" className="h-full w-full p-2">
                  <polygon
                    points="40,20 160,25 150,95 30,90"
                    fill="#C6E7C9"
                    stroke="#1B7A3F"
                    strokeWidth="2.5"
                  />
                  <text x="80" y="60" fontSize="11" fontWeight="bold" fill="#14201A">
                    {selectedWard.name}
                  </text>
                </svg>
              </div>

              {/* Stat Boxes: Area, Points, Created */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] p-3 text-center border border-[#E5EAE3] dark:border-[#2A3B31]">
                  <div className="text-[10px] text-[#566259]">Area</div>
                  <div className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mt-0.5">
                    {selectedWard.areaKm2} km²
                  </div>
                </div>
                <div className="rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] p-3 text-center border border-[#E5EAE3] dark:border-[#2A3B31]">
                  <div className="text-[10px] text-[#566259]">Points</div>
                  <div className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mt-0.5">
                    {selectedWard.pointsCount || 8}
                  </div>
                </div>
                <div className="rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] p-3 text-center border border-[#E5EAE3] dark:border-[#2A3B31]">
                  <div className="text-[10px] text-[#566259]">Created</div>
                  <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] mt-0.5">
                    {selectedWard.createdDate || '12 Jun, R. Shah'}
                  </div>
                </div>
              </div>

              {/* Inspector Section */}
              <div className="mt-5 p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31]">
                <div className="text-[11px] text-[#566259] mb-1">Inspector</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#1B7A3F] text-white flex items-center justify-center font-bold text-xs">
                      MP
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                        Meena Parmar
                      </div>
                      <div className="text-[10px] text-[#566259]">+91 98xxxx02</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drivers & Vans */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31]">
                <div className="text-[11px] text-[#566259] mb-2">Drivers and vans</div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white dark:bg-[#16221B] px-3 py-1 text-xs font-bold shadow-xs border">
                    Ramesh Bhai
                  </span>
                  <span className="rounded-full bg-white dark:bg-[#16221B] px-3 py-1 text-xs font-bold shadow-xs border">
                    Suresh Vaja
                  </span>
                  <span className="rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-3 py-1 text-xs font-mono font-bold border border-emerald-200">
                    GJ-17-AB-1234
                  </span>
                </div>
              </div>

              {/* Route and complaints */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31]">
                <div className="text-[11px] text-[#566259] mb-2">Route and complaints</div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 px-3 py-1 text-xs font-bold">
                    East route
                  </span>
                  <span className="rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 px-3 py-1 text-xs font-bold">
                    ! 12 open complaints
                  </span>
                </div>
              </div>

              {/* History */}
              <div className="mt-4 text-xs space-y-1 text-[#566259]">
                <div className="font-bold text-[#14201A] dark:text-[#EAF2E6] mb-1">History</div>
                <div>Boundary edited, 02 Aug</div>
                <div>Inspector changed, 14 Sep</div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#E5EAE3] dark:border-[#2A3B31] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onNavigateTo('wardEditor', { editWard: selectedWard });
                  }}
                  className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-4 py-2 text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <Edit2 size={13} />
                  <span>Edit boundary</span>
                </button>
                <button
                  onClick={() => alert(`Assign inspector for ${selectedWard.name}`)}
                  className="rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-4 py-2 text-xs font-bold"
                >
                  Assign inspector
                </button>
              </div>

              <button
                onClick={() => handleDeleteClick(selectedWard)}
                className="rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-2 text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Choose How to Start Modal (Canvas A27 `StartModal`) */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowStartModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-[#16221B] rounded-[32px] p-8 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] z-10 animate-scale-up">
            <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6]">
              Create a ward
            </h2>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
              Choose how you want to start.
            </p>

            <div className="mt-6 space-y-3">
              {/* Option 1: Draw on the map */}
              <div
                onClick={() => setStartMethod('draw')}
                className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                  startMethod === 'draw'
                    ? 'border-[#1B7A3F] bg-[#F3FAF4] dark:bg-[#162B1D]'
                    : 'border-[#E5EAE3] dark:border-[#2A3B31] hover:bg-neutral-50 dark:hover:bg-[#111A14]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Pencil size={18} className="text-[#1B7A3F]" />
                    <span className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                      Draw on the map
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                    ✓ Recommended
                  </span>
                </div>
                <p className="text-[11px] text-[#566259] dark:text-[#9DB0A2] mt-1 ml-7">
                  Click around the area to draw its boundary
                </p>
              </div>

              {/* Option 2: Upload a boundary file */}
              <div
                onClick={() => setStartMethod('upload')}
                className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                  startMethod === 'upload'
                    ? 'border-[#1B7A3F] bg-[#F3FAF4] dark:bg-[#162B1D]'
                    : 'border-[#E5EAE3] dark:border-[#2A3B31] hover:bg-neutral-50 dark:hover:bg-[#111A14]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Upload size={18} className="text-[#566259]" />
                  <span className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                    Upload a boundary file
                  </span>
                </div>
                <p className="text-[11px] text-[#566259] dark:text-[#9DB0A2] mt-1 ml-7">
                  KML or GeoJSON, up to 2 MB
                </p>
              </div>

              {/* Option 3: Copy an existing ward */}
              <div
                onClick={() => setStartMethod('copy')}
                className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                  startMethod === 'copy'
                    ? 'border-[#1B7A3F] bg-[#F3FAF4] dark:bg-[#162B1D]'
                    : 'border-[#E5EAE3] dark:border-[#2A3B31] hover:bg-neutral-50 dark:hover:bg-[#111A14]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Copy size={18} className="text-[#566259]" />
                  <span className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                    Copy an existing ward
                  </span>
                </div>
                <p className="text-[11px] text-[#566259] dark:text-[#9DB0A2] mt-1 ml-7">
                  Start from Ward 4 and change it
                </p>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowStartModal(false)}
                className="rounded-full px-5 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowStartModal(false);
                  onNavigateTo('wardEditor');
                }}
                className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow transition-transform active:scale-95"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Blocked Modal (Canvas A40 `DeleteBlocked`) */}
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
              Move these first, then try again.
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
