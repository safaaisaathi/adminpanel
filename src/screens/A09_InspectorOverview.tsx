import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  ArrowRight,
  MapPin,
  AlertCircle
} from 'lucide-react';

interface A09InspectorOverviewProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A09_InspectorOverview: React.FC<A09InspectorOverviewProps> = ({ onNavigateTo }) => {
  const { drivers, vans, complaints } = useApp();

  const driversToday = drivers.slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* 4 KPI Cards (Canvas A09) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Drivers on duty */}
        <div
          onClick={() => onNavigateTo('drivers')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            Drivers on duty
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            5 / 6
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#E8A317]">
            <Clock size={14} />
            <span>1 late</span>
          </div>
        </div>

        {/* Vans moving */}
        <div
          onClick={() => onNavigateTo('liveMap')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            Vans moving
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            5
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
            <CheckCircle2 size={14} />
            <span>All online</span>
          </div>
        </div>

        {/* Open complaints */}
        <div
          onClick={() => onNavigateTo('complaints')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            Open complaints
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            12
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#E8A317]">
            <AlertTriangle size={14} />
            <span>2 near 48 h</span>
          </div>
        </div>

        {/* Wards done today */}
        <div
          onClick={() => onNavigateTo('attendance')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            Wards done today
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            14 / 18
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
            <CheckCircle2 size={14} />
            <span>78%</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Drivers Today (Left) & Mini Live Map (Right) (Canvas A09) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drivers Today Card */}
        <div className="lg:col-span-7 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
              Drivers today
            </h3>
            <button
              onClick={() => onNavigateTo('drivers')}
              className="text-xs font-bold text-[#1B7A3F] hover:underline"
            >
              View all drivers
            </button>
          </div>

          <div className="space-y-4">
            {driversToday.map((driver) => {
              const initials = driver.name.split(' ').map(n => n[0]).join('').slice(0, 2);
              const isLate = driver.status === 'late';
              const isOffDuty = driver.status === 'off_duty';

              return (
                <div
                  key={driver.id}
                  onClick={() => onNavigateTo('driverProfile', driver)}
                  className="cursor-pointer flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5EAE3] dark:bg-[#2A3B31] font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                      {initials}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                        {driver.name}
                      </div>
                      <div className="text-[10px] text-[#566259] dark:text-[#9DB0A2]">
                        {driver.vanPlate || 'Not started'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Status Pill */}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isLate
                          ? 'bg-[#FFF8E6] text-[#A66800] dark:bg-[#332611] dark:text-[#F3BA54]'
                          : isOffDuty
                          ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                          : 'bg-[#EAF5EC] text-[#1B7A3F] dark:bg-[#163321] dark:text-[#6DB36F]'
                      }`}
                    >
                      {isLate ? `! Late ${driver.lateMinutes || 12} min` : isOffDuty ? 'Off duty' : '✓ On shift'}
                    </span>

                    {/* Progress Bar & Value */}
                    <div className="flex items-center gap-2 w-28">
                      <span className="text-[11px] font-bold text-[#14201A] dark:text-[#EAF2E6] w-7 text-right">
                        {driver.shiftProgressPct}%
                      </span>
                      <div className="h-2 w-full rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${driver.shiftProgressPct}%`,
                            backgroundColor: isLate ? '#E8A317' : isOffDuty ? '#9DB0A2' : '#1B7A3F'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mini Live Map Card */}
        <div
          onClick={() => onNavigateTo('liveMap')}
          className="cursor-pointer lg:col-span-5 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                Ward 5 & 6 Live Map
              </h3>
              <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
                5 active vehicles tracking
              </p>
            </div>
            <ArrowRight size={16} className="text-[#1B7A3F] group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Graphical Map Representation */}
          <div className="my-4 relative h-60 w-full bg-[#EBF3EB] dark:bg-[#132219] rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31]">
            <svg viewBox="0 0 400 240" className="w-full h-full">
              {/* Road lines */}
              <path d="M 0 120 Q 200 180 400 120" stroke="#FFF" strokeWidth="12" fill="none" opacity="0.8" />
              <path d="M 140 0 Q 180 120 160 240" stroke="#FFF" strokeWidth="10" fill="none" opacity="0.8" />
              <path d="M 280 0 Q 250 120 320 240" stroke="#FFF" strokeWidth="10" fill="none" opacity="0.8" />

              {/* Ward Polygons */}
              <polygon points="50,40 180,30 190,140 40,150" fill="#C6E7C9" opacity="0.5" stroke="#1B7A3F" strokeWidth="1.5" />
              <text x="70" y="80" fontSize="11" fontWeight="bold" fill="#14201A">Ward 5</text>

              <polygon points="210,50 360,60 340,180 200,160" fill="#D3E8D6" opacity="0.5" stroke="#1B7A3F" strokeWidth="1.5" />
              <text x="240" y="90" fontSize="11" fontWeight="bold" fill="#14201A">Ward 6</text>

              {/* Van Markers */}
              <circle cx="120" cy="110" r="12" fill="#1B7A3F" />
              <circle cx="270" cy="140" r="12" fill="#1B7A3F" />
              <circle cx="310" cy="90" r="12" fill="#E8A317" />
            </svg>

            <div className="absolute bottom-3 right-3 rounded-full bg-white/90 dark:bg-[#16221B]/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-[#14201A] dark:text-[#EAF2E6] shadow">
              Tap to open live fleet map
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            <span>Average van speed: 18 km/h</span>
            <span className="text-[#1B7A3F] font-bold">All routes active</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Needs attention & Latest complaints (Canvas A09) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Needs attention list */}
        <div className="lg:col-span-6 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
          <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
            Needs attention
          </h3>

          <div className="space-y-3">
            <div
              onClick={() => onNavigateTo('drivers')}
              className="cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8E6] dark:bg-[#332611] text-[#A66800] dark:text-[#F3BA54] text-xs font-bold hover:shadow-sm transition-all"
            >
              <AlertTriangle size={16} className="shrink-0" />
              <span>Suresh Vaja has not started (12 min late)</span>
            </div>

            <div
              onClick={() => onNavigateTo('liveMap')}
              className="cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs font-bold hover:shadow-sm transition-all"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>Van GJ-17-CD-2210 offline for 11 min</span>
            </div>

            <div
              onClick={() => onNavigateTo('drivers')}
              className="cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8E6] dark:bg-[#332611] text-[#A66800] dark:text-[#F3BA54] text-xs font-bold hover:shadow-sm transition-all"
            >
              <AlertTriangle size={16} className="shrink-0" />
              <span>Dilip Rana: licence expires in 21 days</span>
            </div>
          </div>
        </div>

        {/* Latest complaints list */}
        <div className="lg:col-span-6 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
              Latest complaints
            </h3>
            <button
              onClick={() => onNavigateTo('complaints')}
              className="text-xs font-bold text-[#1B7A3F] hover:underline"
            >
              View complaints
            </button>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => onNavigateTo('complaints')}
              className="cursor-pointer flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-[#E5EAE3] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>PMH-...0412 Garbage dump</span>
              </div>
              <span className="text-[10px] text-neutral-500">12 min ago</span>
            </div>

            <div
              onClick={() => onNavigateTo('complaints')}
              className="cursor-pointer flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-[#E5EAE3] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>PMH-...0398 Open gutter</span>
              </div>
              <span className="text-[10px] text-neutral-500">2 h ago</span>
            </div>

            <div
              onClick={() => onNavigateTo('complaints')}
              className="cursor-pointer flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-[#E5EAE3] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>PMH-...0301 Missed collection</span>
              </div>
              <span className="text-[10px] text-neutral-500">Today, 06:45</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
