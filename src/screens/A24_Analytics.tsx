import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Star,
  MapPin,
  Flame,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const A24_Analytics: React.FC = () => {
  const [selectedWardZoom, setSelectedWardZoom] = useState<string | null>(null);

  const worstWards = [
    { name: 'Ward 7, Godhra', complaints: 41, rate: 72, rating: 3.6, color: '#E8A317' },
    { name: 'Ward 3, Halol', complaints: 33, rate: 81, rating: 4.0, color: '#1B7A3F' },
    { name: 'Shehera village 12', complaints: 29, rate: 58, rating: 3.4, color: '#D93025' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Grid: Hotspots Heatmap & Category Donut + Ratings (Canvas A24) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[460px]">
        {/* Hotspots Heatmap Card (7 cols, Canvas A24) */}
        <div className="lg:col-span-7 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                Complaint hotspots, last 30 days
              </h3>
              {selectedWardZoom && (
                <button
                  onClick={() => setSelectedWardZoom(null)}
                  className="text-xs font-semibold text-[#1B7A3F] underline"
                >
                  Reset zoom ({selectedWardZoom})
                </button>
              )}
            </div>
            <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
              Heat concentration of citizen complaints in Godhra
            </p>
          </div>

          {/* Graphical Heatmap SVG (Canvas A24) */}
          <div className="my-5 relative h-72 w-full bg-[#EBF3EB] dark:bg-[#111A14] rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31]">
            <svg viewBox="0 0 500 300" className="w-full h-full">
              <defs>
                <radialGradient id="heat1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D93025" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#E87A17" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#E87A17" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heat2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D93025" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#E8A317" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#E8A317" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Road grid lines */}
              <path d="M 0 150 Q 250 200 500 140" stroke="#FFF" strokeWidth="16" fill="none" opacity="0.85" />
              <path d="M 180 0 Q 200 150 170 300" stroke="#FFF" strokeWidth="12" fill="none" opacity="0.85" />
              <path d="M 340 0 Q 320 150 360 300" stroke="#FFF" strokeWidth="12" fill="none" opacity="0.85" />

              {/* Heat radial blobs */}
              <circle cx="160" cy="120" r="50" fill="url(#heat1)" />
              <circle cx="280" cy="90" r="65" fill="url(#heat2)" />
              <circle cx="320" cy="220" r="60" fill="url(#heat1)" />
              <circle cx="180" cy="240" r="45" fill="url(#heat2)" />
            </svg>

            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 dark:bg-[#16221B]/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#14201A] dark:text-[#EAF2E6] shadow">
              Highest density: Ward 7 & Shaher Market
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-[#566259]">
            <span>Click any ward in the table below to zoom</span>
            <span className="text-[#D93025] font-bold">4 hotspots identified</span>
          </div>
        </div>

        {/* Donut Chart & Average Rating Cards (5 cols, Canvas A24) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Complaints by Category Card */}
          <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
              Complaints by category
            </h3>

            <div className="flex items-center gap-6">
              {/* SVG Donut Chart */}
              <div className="relative h-28 w-28 shrink-0">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  {/* Background circle */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#E5EAE3" strokeWidth="4.5" />
                  {/* Garbage dump 46% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#1B7A3F"
                    strokeWidth="4.5"
                    strokeDasharray="46 100"
                    strokeDashoffset="0"
                  />
                  {/* Open gutter 30% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#E8A317"
                    strokeWidth="4.5"
                    strokeDasharray="30 100"
                    strokeDashoffset="-46"
                  />
                  {/* Missed van 24% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#2F6FDE"
                    strokeWidth="4.5"
                    strokeDasharray="24 100"
                    strokeDashoffset="-76"
                  />
                </svg>
              </div>

              {/* Legend with exact labels and colors (Canvas A24) */}
              <div className="space-y-2 text-xs font-bold">
                <div className="flex items-center gap-2 text-[#1B7A3F]">
                  <CheckCircle2 size={14} />
                  <span>Garbage dump 46%</span>
                </div>
                <div className="flex items-center gap-2 text-[#E8A317]">
                  <AlertTriangle size={14} />
                  <span>Open gutter 30%</span>
                </div>
                <div className="flex items-center gap-2 text-[#2F6FDE]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2F6FDE]" />
                  <span>Missed van 24%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Average Citizen Rating Card (Canvas A24) */}
          <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
              Average citizen rating
            </h3>
            <div className="mt-3 text-3xl font-extrabold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
              4.2 of 5
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#EAF5EC] text-[#1B7A3F] dark:bg-[#163321] dark:text-[#6DB36F] px-3 py-1 text-xs font-bold">
              <TrendingUp size={14} />
              <span>+0.3 this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Worst Wards Table (Canvas A24) */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] overflow-hidden">
        <div className="p-5 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
          <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
            Worst wards
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] dark:text-[#9DB0A2] border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <tr>
                <th className="py-3.5 px-6 font-bold">Worst wards</th>
                <th className="py-3.5 px-6 font-bold">Complaints</th>
                <th className="py-3.5 px-6 font-bold">Resolved in target</th>
                <th className="py-3.5 px-6 font-bold">Average rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE3] dark:divide-[#2A3B31]">
              {worstWards.map((w, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedWardZoom(w.name)}
                  className="hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] cursor-pointer transition-colors"
                >
                  <td className="py-4 px-6 font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    {w.name}
                  </td>
                  <td className="py-4 px-6 font-bold">
                    {w.complaints}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        w.rate >= 80
                          ? 'bg-[#EAF5EC] text-[#1B7A3F]'
                          : w.rate >= 60
                          ? 'bg-[#FFF8E6] text-[#A66800]'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {w.rate >= 80 ? '✓ ' : '! '}{w.rate}%
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold flex items-center gap-1">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{w.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
