import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Truck,
  ClipboardList,
  CheckCheck,
  AlertCircle
} from 'lucide-react';

interface A02DdoOverviewProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A02_DdoOverview: React.FC<A02DdoOverviewProps> = ({ onNavigateTo }) => {
  const { complaints, vans, alerts } = useApp();

  // Areas data from Wireframe A02
  const areasRanked = [
    { name: 'Godhra Nagarpalika', rate: 91, color: '#1B7A3F' },
    { name: 'Halol Nagarpalika', rate: 84, color: '#1B7A3F' },
    { name: 'Kalol Nagarpalika', rate: 78, color: '#E8A317' },
    { name: 'Shehera Taluka', rate: 66, color: '#E87A17' },
    { name: 'Ghoghamba Taluka', rate: 52, color: '#D93025' },
  ];

  const weeklyTrend = [
    { day: 'Mon', value: 42 },
    { day: 'Tue', value: 58 },
    { day: 'Wed', value: 31 },
    { day: 'Thu', value: 65 },
    { day: 'Fri', value: 51 },
    { day: 'Sat', value: 28 },
    { day: 'Sun', value: 38 },
  ];

  const maxVal = Math.max(...weeklyTrend.map(w => w.value));

  return (
    <div className="space-y-6 pb-12">
      {/* 4 KPI Cards (Row 1 Canvas A02) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vans on shift */}
        <div
          onClick={() => onNavigateTo('liveMap')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            Vans on shift
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            38 / 52
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
            <CheckCircle2 size={14} />
            <span>73% active</span>
          </div>
        </div>

        {/* Route completion */}
        <div
          onClick={() => onNavigateTo('routes')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            Route completion
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            76%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
            <TrendingUp size={14} />
            <span>+4% vs yesterday</span>
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
            214
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#E8A317]">
            <AlertTriangle size={14} />
            <span>31 escalated</span>
          </div>
        </div>

        {/* Resolved within target */}
        <div
          onClick={() => onNavigateTo('complaints')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            Resolved within target
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            88%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#E8A317]">
            <AlertCircle size={14} />
            <span>Target 90%</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Resolution Rate by Area & Areas Ranked (Canvas A02) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Card: Resolution Rate by Area */}
        <div className="lg:col-span-7 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
              Resolution rate by area
            </h3>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
              Jurisdiction breakdown across Panchmahal District
            </p>
          </div>

          {/* SVG Map Shape Representation of Panchmahal District (Canvas A02) */}
          <div className="my-6 relative flex items-center justify-center h-64 bg-[#F8FAF7] dark:bg-[#111A14] rounded-2xl overflow-hidden border border-[#E5EAE3] dark:border-[#2A3B31]">
            <svg viewBox="0 0 600 320" className="w-full h-full p-4">
              {/* Halol Nagarpalika: Green >80% */}
              <polygon
                points="120,40 280,30 250,140 100,120"
                fill="#C6E7C9"
                stroke="#1B7A3F"
                strokeWidth="2.5"
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
              <text x="180" y="85" fontSize="12" fontWeight="bold" fill="#14201A">Halol (84%)</text>

              {/* Godhra Nagarpalika: Green >80% */}
              <polygon
                points="310,40 500,60 480,180 300,160"
                fill="#B8E2BD"
                stroke="#1B7A3F"
                strokeWidth="2.5"
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
              <text x="370" y="110" fontSize="13" fontWeight="bold" fill="#14201A">Godhra (91%)</text>

              {/* Kalol Nagarpalika: Amber 60-80% */}
              <polygon
                points="110,140 260,155 240,260 90,230"
                fill="#FDE4B8"
                stroke="#E8A317"
                strokeWidth="2.5"
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
              <text x="150" y="200" fontSize="12" fontWeight="bold" fill="#14201A">Kalol (78%)</text>

              {/* Shehera & Ghoghamba: Orange/Red <60% */}
              <polygon
                points="270,165 470,190 420,290 250,265"
                fill="#F7C6C1"
                stroke="#D93025"
                strokeWidth="2.5"
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
              <text x="320" y="230" fontSize="12" fontWeight="bold" fill="#14201A">Shehera / Ghoghamba (58%)</text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-2 border-t border-[#E5EAE3] dark:border-[#2A3B31]">
            <div className="flex items-center gap-1.5 text-[#1B7A3F] dark:text-[#6DB36F]">
              <span className="h-3 w-3 rounded-md bg-[#C6E7C9] border border-[#1B7A3F]" />
              <span>Above 80%</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#E8A317]">
              <span className="h-3 w-3 rounded-md bg-[#FDE4B8] border border-[#E8A317]" />
              <span>60 to 80%</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#D93025]">
              <span className="h-3 w-3 rounded-md bg-[#F7C6C1] border border-[#D93025]" />
              <span>Below 60%</span>
            </div>
          </div>
        </div>

        {/* Ranked Areas List Card */}
        <div className="lg:col-span-5 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
              Areas ranked by resolution
            </h3>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
              Highest to lowest SLA adherence
            </p>

            <div className="mt-6 space-y-4">
              {areasRanked.map((area) => (
                <div key={area.name}>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#14201A] dark:text-[#EAF2E6]">{area.name}</span>
                    <span style={{ color: area.color }}>{area.rate}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${area.rate}%`, backgroundColor: area.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 text-xs text-[#566259] dark:text-[#9DB0A2] text-right">
            Updated today, 12:30 PM
          </div>
        </div>
      </div>

      {/* Bottom Row: Complaints last 7 days + Needs Attention (Canvas A02) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Complaints Last 7 Days Bar Chart */}
        <div className="lg:col-span-7 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
          <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
            Complaints, last 7 days
          </h3>
          <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
            Daily citizen grievances inflow
          </p>

          <div className="mt-8 flex items-end justify-between h-44 px-4 pb-2 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
            {weeklyTrend.map((item) => {
              const heightPct = Math.round((item.value / maxVal) * 100);
              return (
                <div key={item.day} className="flex flex-col items-center gap-2 group flex-1">
                  <div className="text-[10px] font-bold text-[#566259] dark:text-[#9DB0A2] opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value}
                  </div>
                  <div className="w-8 sm:w-10 rounded-t-xl bg-[#2D8A4E] hover:bg-[#1B7A3F] transition-all" style={{ height: `${heightPct}%` }} />
                  <span className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Needs Attention Alert Box */}
        <div className="lg:col-span-5 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
              Needs attention
            </h3>
            <span className="rounded-full bg-red-100 dark:bg-red-950/40 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
              3 alerts
            </span>
          </div>
          <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
            Priority triggers across district jurisdictions
          </p>

          <div className="mt-6 space-y-3">
            <div
              onClick={() => onNavigateTo('alerts')}
              className="cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8E6] dark:bg-[#332611] text-[#A66800] dark:text-[#F3BA54] text-xs font-bold hover:shadow-sm transition-all"
            >
              <AlertTriangle size={16} className="shrink-0" />
              <span>Kalol: 9 vans offline</span>
            </div>

            <div
              onClick={() => onNavigateTo('alerts')}
              className="cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8E6] dark:bg-[#332611] text-[#A66800] dark:text-[#F3BA54] text-xs font-bold hover:shadow-sm transition-all"
            >
              <AlertTriangle size={16} className="shrink-0" />
              <span>Shehera: 14 complaints past 48 h</span>
            </div>

            <div
              onClick={() => onNavigateTo('alerts')}
              className="cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8E6] dark:bg-[#332611] text-[#A66800] dark:text-[#F3BA54] text-xs font-bold hover:shadow-sm transition-all"
            >
              <AlertTriangle size={16} className="shrink-0" />
              <span>4 licences expire in 30 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
