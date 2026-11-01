import React, { useState } from 'react';
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
  AlertCircle,
  Calendar,
  BarChart3
} from 'lucide-react';

interface A02DdoOverviewProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A02_DdoOverview: React.FC<A02DdoOverviewProps> = ({ onNavigateTo }) => {
  const { complaints, vans, alerts, lang } = useApp();
  const isGu = lang === 'gu';

  // Toggle for 7 Days vs 30 Days trend
  const [trendRange, setTrendRange] = useState<'7d' | '30d'>('7d');

  // Areas data from Wireframe A02
  const areasRanked = [
    { name: isGu ? 'ગોધરા નગરપાલિકા' : 'Godhra Nagarpalika', rate: 91, color: '#1B7A3F' },
    { name: isGu ? 'હાલોલ નગરપાલિકા' : 'Halol Nagarpalika', rate: 84, color: '#1B7A3F' },
    { name: isGu ? 'કાલોલ નગરપાલિકા' : 'Kalol Nagarpalika', rate: 78, color: '#E8A317' },
    { name: isGu ? 'શહેરા તાલુકા' : 'Shehera Taluka', rate: 66, color: '#E87A17' },
    { name: isGu ? 'ઘોઘંબા તાલુકા' : 'Ghoghamba Taluka', rate: 52, color: '#D93025' },
  ];

  // 7-day trend
  const weeklyTrend = [
    { day: isGu ? 'સોમ' : 'Mon', value: 42 },
    { day: isGu ? 'મંગળ' : 'Tue', value: 58 },
    { day: isGu ? 'બુધ' : 'Wed', value: 31 },
    { day: isGu ? 'ગુરુ' : 'Thu', value: 65 },
    { day: isGu ? 'શુક્ર' : 'Fri', value: 51 },
    { day: isGu ? 'શનિ' : 'Sat', value: 28 },
    { day: isGu ? 'રવિ' : 'Sun', value: 38 },
  ];

  // 30-day weekly aggregated trend
  const monthlyTrend = [
    { day: isGu ? 'સપ્તાહ ૧' : 'Week 1', value: 185 },
    { day: isGu ? 'સપ્તાહ ૨' : 'Week 2', value: 210 },
    { day: isGu ? 'સપ્તાહ ૩' : 'Week 3', value: 165 },
    { day: isGu ? 'સપ્તાહ ૪' : 'Week 4', value: 232 },
  ];

  const activeTrend = trendRange === '7d' ? weeklyTrend : monthlyTrend;
  const maxVal = Math.max(...activeTrend.map((w) => w.value));

  return (
    <div className="space-y-6 pb-12">
      {/* 4 KPI Cards (Row 1 Canvas A02) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vans on shift */}
        <div
          onClick={() => onNavigateTo('liveMap')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-all hover:scale-[1.01]"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            {isGu ? 'રૂટ પર કાર્યરત વાન' : 'Vans on shift'}
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            38 / 52
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
            <CheckCircle2 size={14} />
            <span>{isGu ? '૭૩% સક્રિય' : '73% active'}</span>
          </div>
        </div>

        {/* Route completion */}
        <div
          onClick={() => onNavigateTo('routes')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-all hover:scale-[1.01]"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            {isGu ? 'કચરા રૂટ પૂર્ણતા દર' : 'Route completion'}
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            76%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
            <TrendingUp size={14} />
            <span>{isGu ? '+૪% ગઇકાલ કરતાં વધુ' : '+4% vs yesterday'}</span>
          </div>
        </div>

        {/* Open complaints */}
        <div
          onClick={() => onNavigateTo('complaints')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-all hover:scale-[1.01]"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            {isGu ? 'કુલ બાકી ફરિયાદો' : 'Open complaints'}
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            214
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#E8A317]">
            <AlertTriangle size={14} />
            <span>{isGu ? '૩૧ એસ્કેલેટેડ (મુદત વીતેલી)' : '31 escalated'}</span>
          </div>
        </div>

        {/* Resolved within target */}
        <div
          onClick={() => onNavigateTo('complaints')}
          className="cursor-pointer rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] hover:shadow-md transition-all hover:scale-[1.01]"
        >
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2]">
            {isGu ? 'લક્ષ્ય સમયમાં નિવારણ દર' : 'Resolved within target'}
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            88%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#E8A317]">
            <AlertCircle size={14} />
            <span>{isGu ? 'લક્ષ્ય ૯૦%' : 'Target 90%'}</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Resolution Rate by Area & Areas Ranked (Canvas A02) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Card: Resolution Rate by Area */}
        <div className="lg:col-span-7 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
              {isGu ? 'વિસ્તાર મુજબ ફરિયાદ નિવારણ દર' : 'Resolution rate by area'}
            </h3>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
              {isGu ? 'પંચમહાલ જિલ્લાના અધિકારક્ષેત્રનું વિશ્લેષણ' : 'Jurisdiction breakdown across Panchmahal District'}
            </p>
          </div>

          {/* Area Polygons Visual */}
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
              <text x="175" y="85" fontSize="13" fontWeight="bold" fill="#14201A">
                {isGu ? 'હાલોલ (૮૪%)' : 'Halol (84%)'}
              </text>

              {/* Godhra Nagarpalika: Green >80% */}
              <polygon
                points="310,40 500,60 480,180 300,160"
                fill="#B8E2BD"
                stroke="#1B7A3F"
                strokeWidth="2.5"
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
              <text x="365" y="110" fontSize="14" fontWeight="bold" fill="#14201A">
                {isGu ? 'ગોધરા (૯૧%)' : 'Godhra (91%)'}
              </text>

              {/* Kalol Nagarpalika: Amber 60-80% */}
              <polygon
                points="110,140 260,155 240,260 90,230"
                fill="#FDE4B8"
                stroke="#E8A317"
                strokeWidth="2.5"
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
              <text x="145" y="200" fontSize="13" fontWeight="bold" fill="#14201A">
                {isGu ? 'કાલોલ (૭૮%)' : 'Kalol (78%)'}
              </text>

              {/* Shehera & Ghoghamba: Orange/Red <60% */}
              <polygon
                points="270,165 470,190 420,290 250,265"
                fill="#F7C6C1"
                stroke="#D93025"
                strokeWidth="2.5"
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
              <text x="310" y="230" fontSize="13" fontWeight="bold" fill="#14201A">
                {isGu ? 'શહેરા / ઘોઘંબા (૫૮%)' : 'Shehera / Ghoghamba (58%)'}
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-2 border-t border-[#E5EAE3] dark:border-[#2A3B31]">
            <div className="flex items-center gap-1.5 text-[#1B7A3F] dark:text-[#6DB36F]">
              <span className="h-3 w-3 rounded-md bg-[#C6E7C9] border border-[#1B7A3F]" />
              <span>{isGu ? '૮૦% થી વધુ' : 'Above 80%'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#E8A317]">
              <span className="h-3 w-3 rounded-md bg-[#FDE4B8] border border-[#E8A317]" />
              <span>{isGu ? '૬૦% થી ૮૦%' : '60 to 80%'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#D93025]">
              <span className="h-3 w-3 rounded-md bg-[#F7C6C1] border border-[#D93025]" />
              <span>{isGu ? '૬૦% થી ઓછું' : 'Below 60%'}</span>
            </div>
          </div>
        </div>

        {/* Ranked Areas List Card */}
        <div className="lg:col-span-5 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
              {isGu ? 'નિવારણ દર મુજબ ક્રમ' : 'Areas ranked by resolution'}
            </h3>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
              {isGu ? 'સૌથી વધુ થી સૌથી ઓછું SLA પાલન' : 'Highest to lowest SLA adherence'}
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
            {isGu ? 'આજે અપડેટ કરેલ, બપોરે ૧૨:૩૦' : 'Updated today, 12:30 PM'}
          </div>
        </div>
      </div>

      {/* Bottom Row: Complaints Bar Chart (FIXED & HIGH VISIBILITY) + Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Complaints Bar Chart with 7d / 30d Toggle */}
        <div className="lg:col-span-7 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                {trendRange === '7d'
                  ? isGu ? 'ફરિયાદોનો પ્રવાહ (છેલ્લા ૭ દિવસ)' : 'Complaints, last 7 days'
                  : isGu ? 'ફરિયાદોનો પ્રવાહ (છેલ્લા ૩૦ દિવસ)' : 'Complaints, last 30 days'}
              </h3>
              <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
                {isGu ? 'દૈનિક નાગરિક ફરિયાદ નોંધણી આંકડા' : 'Daily citizen grievances inflow'}
              </p>
            </div>

            {/* Toggle 7 Days vs 30 Days */}
            <div className="flex rounded-full bg-neutral-100 dark:bg-neutral-800 p-0.5 text-xs font-bold">
              <button
                onClick={() => setTrendRange('7d')}
                className={`rounded-full px-3 py-1 transition-all ${
                  trendRange === '7d'
                    ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612] shadow-xs'
                    : 'text-[#566259] dark:text-[#9DB0A2] hover:text-[#14201A]'
                }`}
              >
                {isGu ? '૭ દિવસ' : '7 Days'}
              </button>
              <button
                onClick={() => setTrendRange('30d')}
                className={`rounded-full px-3 py-1 transition-all ${
                  trendRange === '30d'
                    ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612] shadow-xs'
                    : 'text-[#566259] dark:text-[#9DB0A2] hover:text-[#14201A]'
                }`}
              >
                {isGu ? '૩૦ દિવસ' : '30 Days'}
              </button>
            </div>
          </div>

          {/* Fully Visible Bar Chart (Guaranteed Explicit Height Tracks) */}
          <div className="mt-8 flex items-end justify-between h-48 px-2 pb-2 border-b border-[#E5EAE3] dark:border-[#2A3B31] gap-2">
            {activeTrend.map((item) => {
              const heightPct = Math.max(12, Math.round((item.value / maxVal) * 100));
              return (
                <div key={item.day} className="flex-1 h-full flex flex-col justify-end items-center group">
                  {/* Value on top of bar */}
                  <span className="text-[11px] font-bold text-[#14201A] dark:text-[#EAF2E6] mb-1.5 transition-transform group-hover:scale-110">
                    {item.value}
                  </span>

                  {/* Fixed track container with explicit height */}
                  <div className="w-full max-w-[44px] h-32 flex items-end justify-center rounded-t-xl bg-[#F4F7F3] dark:bg-[#1E2D24]/50 p-0.5 overflow-hidden">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#1B7A3F] to-[#22C55E] shadow-sm transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  {/* Day label below */}
                  <span className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2] mt-2 whitespace-nowrap">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#566259] dark:text-[#9DB0A2]">
            <span>{isGu ? 'કુલ નોંધાયેલ: ' : 'Total inflow: '} <b className="text-[#14201A] dark:text-[#EAF2E6]">{activeTrend.reduce((a, b) => a + b.value, 0)}</b></span>
            <span>{isGu ? 'સરેરાશ દૈનિક: ' : 'Daily average: '} <b className="text-[#14201A] dark:text-[#EAF2E6]">{Math.round(activeTrend.reduce((a, b) => a + b.value, 0) / activeTrend.length)}</b></span>
          </div>
        </div>

        {/* Needs Attention Alert Box */}
        <div className="lg:col-span-5 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
              {isGu ? 'ધ્યાન આપવા જેવી બાબતો' : 'Needs attention'}
            </h3>
            <span className="rounded-full bg-red-100 dark:bg-red-950/40 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
              {isGu ? '૩ ચેતવણીઓ' : '3 alerts'}
            </span>
          </div>
          <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
            {isGu ? 'જિલ્લા અધિકારક્ષેત્રમાં પ્રાથમિક ચેતવણીઓ' : 'Priority triggers across district jurisdictions'}
          </p>

          <div className="mt-6 space-y-3">
            <div
              onClick={() => onNavigateTo('alerts')}
              className="cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8E6] dark:bg-[#332611] text-[#A66800] dark:text-[#F3BA54] text-xs font-bold hover:shadow-sm transition-all"
            >
              <AlertTriangle size={16} className="shrink-0" />
              <span>{isGu ? 'કાલોલ: ૯ વાન હાલ ઓફલાઇન છે' : 'Kalol: 9 vans offline'}</span>
            </div>

            <div
              onClick={() => onNavigateTo('alerts')}
              className="cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8E6] dark:bg-[#332611] text-[#A66800] dark:text-[#F3BA54] text-xs font-bold hover:shadow-sm transition-all"
            >
              <AlertTriangle size={16} className="shrink-0" />
              <span>{isGu ? 'શહેરા: છેલ્લા ૪૮ કલાકમાં ૧૪ ફરિયાદો' : 'Shehera: 14 complaints past 48 h'}</span>
            </div>

            <div
              onClick={() => onNavigateTo('alerts')}
              className="cursor-pointer flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8E6] dark:bg-[#332611] text-[#A66800] dark:text-[#F3BA54] text-xs font-bold hover:shadow-sm transition-all"
            >
              <AlertTriangle size={16} className="shrink-0" />
              <span>{isGu ? '૪ ડ્રાઇવિંગ લાયસન્સ ૩૦ દિવસમાં સમાપ્ત થશે' : '4 licences expire in 30 days'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
