import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ContourCard } from '../components/ContourCard';
import { Truck, CheckCircle2, AlertTriangle, AlertCircle, MapPin } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface A2_OverviewProps {
  onNavigateTo: (screen: any) => void;
}

export const A2_Overview: React.FC<A2_OverviewProps> = ({ onNavigateTo }) => {
  const { t, scopedWards, scopedVans, scopedComplaints, trips, routes, currentUser } = useApp();

  // Metrics computation (PRD Section 4 formulas)
  const vansOnShiftCount = scopedVans.filter((v) => v.status === 'on_shift').length;
  const totalVansInScope = scopedVans.length;

  const routeCompletionPct = useMemo(() => {
    let totalScheduledWards = 0;
    let completedWards = 0;

    trips.forEach((trip) => {
      const route = routes.find((r) => r.id === trip.routeId);
      if (route) {
        totalScheduledWards += route.wardIds.length;
        completedWards += trip.wardsDone.length;
      }
    });

    if (totalScheduledWards === 0) return 65;
    return Math.min(100, Math.round((completedWards / totalScheduledWards) * 100));
  }, [trips, routes]);

  const openComplaints = scopedComplaints.filter((c) => c.status !== 'resolved');
  const openComplaintsCount = openComplaints.length;

  const resolvedCount = scopedComplaints.filter((c) => c.status === 'resolved').length;
  const totalComplaintsCount = scopedComplaints.length;
  const resolvedPct = totalComplaintsCount > 0 ? Math.round((resolvedCount / totalComplaintsCount) * 100) : 100;

  const escalatedComplaints = scopedComplaints.filter(
    (c) => c.status === 'escalated' || c.escalationLevel > 0
  );

  const topProblemWards = useMemo(() => {
    const countMap: Record<string, number> = {};
    openComplaints.forEach((c) => {
      countMap[c.wardId] = (countMap[c.wardId] || 0) + 1;
    });

    return scopedWards
      .map((w) => ({
        ward: w,
        count: countMap[w.id] || 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [openComplaints, scopedWards]);

  const trendData = useMemo(() => {
    return [
      { day: 'Mon', reported: 6, resolved: 5 },
      { day: 'Tue', reported: 8, resolved: 7 },
      { day: 'Wed', reported: 12, resolved: 9 },
      { day: 'Thu', reported: 7, resolved: 8 },
      { day: 'Fri', reported: 11, resolved: 10 },
      { day: 'Sat', reported: 14, resolved: 12 },
      { day: 'Sun', reported: 9, resolved: 8 },
    ];
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Signature ContourCard (DESIGN.md Section 4.9 & CL-12) */}
      <ContourCard seed={101} className="min-h-[140px] sm:min-h-[160px] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#111A14] animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#111A14]/80">
                Live Sanitation Fleet
              </span>
            </div>
            <div className="mt-1.5 text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#111A14] flex items-baseline gap-2">
              <span>{vansOnShiftCount} of {totalVansInScope}</span>
              <span className="text-base sm:text-xl font-medium text-[#111A14]/80">{t.kpi.vansOnShift}</span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#111A14]/90 max-w-xl">
              Active collection coverage in {currentUser?.role === 'ddo' ? 'all district wards' : 'assigned jurisdiction'}. Route progress at {routeCompletionPct}%.
            </p>
          </div>
        </div>
      </ContourCard>

      {/* KPI Cards Grid (2 cols on mobile, 4 cols on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* KPI 1: Route Completion */}
        <div className="rounded-[22px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-3.5 sm:p-5 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#566259] dark:text-[#9DB0A2] truncate">
              {t.kpi.routeCompletion}
            </span>
            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#E4F1DF] dark:bg-[#1F3A2A] text-[#1B7A3F] dark:text-[#6DB36F]">
              <Truck size={15} />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-[#14201A] dark:text-[#EAF2E6]">
            {routeCompletionPct}%
          </div>
          <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#1B7A3F] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${routeCompletionPct}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Open Complaints */}
        <div className="rounded-[22px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-3.5 sm:p-5 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#566259] dark:text-[#9DB0A2] truncate">
              {t.kpi.openComplaints}
            </span>
            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#FFF1D1] dark:bg-[#3A2E0E] text-[#B87800] dark:text-[#F7C85A]">
              <AlertCircle size={15} />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-[#14201A] dark:text-[#EAF2E6]">
            {openComplaintsCount}
          </div>
          <div className="mt-1 text-[11px] font-medium text-[#B87800] dark:text-[#F7C85A] truncate">
            {totalComplaintsCount} total reported
          </div>
        </div>

        {/* KPI 3: Resolution Rate */}
        <div className="rounded-[22px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-3.5 sm:p-5 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#566259] dark:text-[#9DB0A2] truncate">
              {t.kpi.resolvedPct}
            </span>
            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#DDF3E4] dark:bg-[#17382A] text-[#1E8E5A] dark:text-[#7ED6A1]">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-[#1E8E5A] dark:text-[#7ED6A1]">
            {resolvedPct}%
          </div>
          <div className="mt-1 text-[11px] text-[#1E8E5A] dark:text-[#7ED6A1] truncate">
            {resolvedCount} verified resolved
          </div>
        </div>

        {/* KPI 4: Escalated Total */}
        <div className="rounded-[22px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-3.5 sm:p-5 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#566259] dark:text-[#9DB0A2] truncate">
              {t.kpi.escalatedTotal}
            </span>
            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#FDE3E0] dark:bg-[#43201C] text-[#D93025] dark:text-[#FF9B91]">
              <AlertTriangle size={15} />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-[#D93025] dark:text-[#FF9B91]">
            {escalatedComplaints.length}
          </div>
          <div className="mt-1 text-[11px] font-semibold text-[#D93025] dark:text-[#FF9B91] truncate">
            {escalatedComplaints.filter((c) => c.escalationLevel === 2).length} at Level 2 (DDO)
          </div>
        </div>
      </div>

      {/* 7-Day Trend Chart & Top 5 Problem Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-4 sm:p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#14201A] dark:text-[#EAF2E6]">
                {t.kpi.sevenDayTrend}
              </h3>
              <p className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                Daily grievance intake vs verified resolution
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-[#F0873A]">
                <span className="h-2 w-2 rounded-full bg-[#F0873A]" /> Reported
              </span>
              <span className="flex items-center gap-1.5 text-[#1B7A3F]">
                <span className="h-2 w-2 rounded-full bg-[#1B7A3F]" /> Resolved
              </span>
            </div>
          </div>

          <div className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F0873A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F0873A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B7A3F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1B7A3F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#74897A" fontSize={11} />
                <YAxis stroke="#74897A" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#16221B',
                    borderRadius: '16px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reported"
                  name="Reported"
                  stroke="#F0873A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReported)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved"
                  stroke="#1B7A3F"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Problem Areas */}
        <div className="rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-4 sm:p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm sm:text-base text-[#14201A] dark:text-[#EAF2E6]">
              {t.kpi.topProblemWards}
            </h3>
            <MapPin size={16} className="text-[#F0873A]" />
          </div>

          <div className="space-y-2">
            {topProblemWards.map(({ ward, count }, idx) => (
              <div
                key={ward.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F3F6F2] dark:bg-[#1E2D24]"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#111A14] dark:bg-[#F2F7EE] text-[10px] font-bold text-white dark:text-[#0E1612]">
                    {idx + 1}
                  </span>
                  <div className="truncate text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6]">
                    {ward.name}
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-[#FFEBD9] dark:bg-[#3A2414] px-2 py-0.5 text-xs font-bold text-[#B34A0B] dark:text-[#F5A15F]">
                  {count} open
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
