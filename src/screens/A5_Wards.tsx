import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Star, CheckCircle, Clock, AlertCircle, Shield, ArrowUpRight } from 'lucide-react';

export const A5_Wards: React.FC = () => {
  const { t, scopedWards, complaints, ratings, trips, routes, availableStaff } = useApp();

  // Compute ward performance metrics
  const wardStats = useMemo(() => {
    return scopedWards.map((ward) => {
      // 1. Complaints for this ward
      const wardComplaints = complaints.filter((c) => c.wardId === ward.id);
      const totalComplaints = wardComplaints.length;
      const resolvedComplaints = wardComplaints.filter((c) => c.status === 'resolved').length;
      const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100;

      // 2. Ratings for this ward
      const wardRatings = ratings.filter((r) => r.wardId === ward.id);
      const avgRating =
        wardRatings.length > 0
          ? (wardRatings.reduce((acc, r) => acc + r.stars, 0) / wardRatings.length).toFixed(1)
          : '4.5';

      // 3. Route & Trip completion
      const route = routes.find((r) => r.id === ward.routeId);
      const isDoneToday = trips.some((t) => t.wardsDone.some((wd) => wd.wardId === ward.id));

      // 4. Assigned staff & escalation
      const inspector = availableStaff.find((s) => s.id === ward.inspectorId);
      const escalationOfficer = availableStaff.find((s) => s.id === ward.escalationTo);

      return {
        ward,
        totalComplaints,
        resolvedComplaints,
        resolutionRate,
        avgRating,
        isDoneToday,
        routeName: route?.name || ward.routeId,
        inspectorName: inspector?.name || 'Unassigned',
        escalationName: escalationOfficer?.name || 'District Authority',
      };
    });
  }, [scopedWards, complaints, ratings, trips, routes, availableStaff]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#14201A] dark:text-[#EAF2E6]">
          {t.wardsPage.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#566259] dark:text-[#9DB0A2] mt-0.5">
          Ward sanitation metrics, citizen ratings, and collection coverage
        </p>
      </div>

      {/* Ward Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {wardStats.map((item) => (
          <div
            key={item.ward.id}
            className="flex flex-col justify-between rounded-[22px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-4 sm:p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31] transition-all hover:shadow-elev2"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#1B7A3F] dark:text-[#6DB36F]">
                    {item.ward.code}
                  </span>
                  <h3 className="text-base font-bold text-[#14201A] dark:text-[#EAF2E6] mt-0.5">
                    {item.ward.name}
                  </h3>
                  <div className="text-xs text-[#566259] dark:text-[#9DB0A2]">
                    {item.ward.nameGu}
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    item.ward.type === 'urban'
                      ? 'bg-[#E3EDFF] text-[#1D4FB8] dark:bg-[#1B2B4D] dark:text-[#8DB4FF]'
                      : 'bg-[#FFF1D1] text-[#8A5A00] dark:bg-[#3A2E0E] dark:text-[#F7C85A]'
                  }`}
                >
                  {item.ward.type === 'urban' ? t.wardsPage.urban : t.wardsPage.rural}
                </span>
              </div>

              {/* Progress & Metrics */}
              <div className="mt-5 space-y-3 text-xs">
                {/* Resolution Rate */}
                <div>
                  <div className="flex justify-between font-medium text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    <span className="text-[#566259] dark:text-[#9DB0A2]">Resolution SLA:</span>
                    <span className="font-bold">{item.resolutionRate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        item.resolutionRate >= 80 ? 'bg-[#1E8E5A]' : 'bg-[#F0873A]'
                      }`}
                      style={{ width: `${item.resolutionRate}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[10px] text-[#566259] dark:text-[#9DB0A2] text-right">
                    {item.resolvedComplaints} of {item.totalComplaints} grievances resolved
                  </div>
                </div>

                {/* Public Rating & Today's Collection */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="rounded-2xl bg-[#F3F6F2] dark:bg-[#1E2D24] p-2.5">
                    <div className="text-[10px] text-[#566259] dark:text-[#9DB0A2]">
                      {t.wardsPage.avgRating}
                    </div>
                    <div className="flex items-center gap-1 font-bold text-sm text-[#14201A] dark:text-[#EAF2E6] mt-0.5">
                      <Star size={14} className="fill-[#F0873A] text-[#F0873A]" />
                      <span>{item.avgRating} / 5.0</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#F3F6F2] dark:bg-[#1E2D24] p-2.5">
                    <div className="text-[10px] text-[#566259] dark:text-[#9DB0A2]">
                      Today's Route
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-xs mt-0.5">
                      {item.isDoneToday ? (
                        <span className="text-[#1E8E5A] dark:text-[#7ED6A1] flex items-center gap-1">
                          <CheckCircle size={13} />
                          <span>Cleared</span>
                        </span>
                      ) : (
                        <span className="text-[#F0873A] flex items-center gap-1">
                          <Clock size={13} />
                          <span>In Progress</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ward Staff Jurisdiction */}
            <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-[#566259] dark:text-[#9DB0A2] space-y-1">
              <div>
                <span className="font-semibold text-[#14201A] dark:text-[#EAF2E6]">Inspector: </span>
                <span>{item.inspectorName}</span>
              </div>
              <div>
                <span className="font-semibold text-[#14201A] dark:text-[#EAF2E6]">Escalates To: </span>
                <span>{item.escalationName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
