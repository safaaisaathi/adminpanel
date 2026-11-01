import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  CalendarCheck
} from 'lucide-react';

interface A19AttendanceProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A19_Attendance: React.FC<A19AttendanceProps> = ({ onNavigateTo }) => {
  const { attendance } = useApp();

  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week'>('today');

  const onTimeCount = attendance.filter((a) => a.status === 'on_time').length;
  const lateCount = attendance.filter((a) => a.status === 'late').length;
  const absentCount = attendance.filter((a) => a.status === 'absent').length;

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Driver Name,Driver ID,Van,Scheduled,Started,Ended,Wards Done,Status']
        .concat(
          attendance.map(
            (a) =>
              `${a.driverName},${a.driverCode},${a.vanPlate},${a.scheduled},${a.started},${a.ended},${a.wardsDone},${a.status}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Safai_Sathi_Attendance_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Filter Chips & Stats & Export Header (Canvas A19) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Day chips & count pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Day selection */}
          <div className="flex items-center gap-1.5 rounded-full bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] p-1">
            <button
              onClick={() => setDateFilter('today')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                dateFilter === 'today'
                  ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                  : 'text-[#566259]'
              }`}
            >
              {dateFilter === 'today' && '✓ '}Today
            </button>
            <button
              onClick={() => setDateFilter('yesterday')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                dateFilter === 'yesterday'
                  ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                  : 'text-[#566259]'
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                dateFilter === 'week'
                  ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                  : 'text-[#566259]'
              }`}
            >
              This week
            </button>
          </div>

          {/* Metric count pills (Canvas A19) */}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#EAF5EC] text-[#1B7A3F] dark:bg-[#163321] dark:text-[#6DB36F] px-3 py-1.5 text-xs font-bold flex items-center gap-1">
              ✓ On time {onTimeCount}
            </span>
            <span className="rounded-full bg-[#FFF8E6] text-[#A66800] dark:bg-[#332611] dark:text-[#F3BA54] px-3 py-1.5 text-xs font-bold flex items-center gap-1">
              ! Late {lateCount}
            </span>
            <span className="rounded-full bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 px-3 py-1.5 text-xs font-bold flex items-center gap-1">
              ! Absent {absentCount}
            </span>
          </div>
        </div>

        {/* Right: Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#16221B] px-5 py-2 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50 shadow-xs"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
      </div>

      {/* Attendance Table (Canvas A19) */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] dark:text-[#9DB0A2] border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <tr>
                <th className="py-3.5 px-6 font-bold">Driver</th>
                <th className="py-3.5 px-6 font-bold">Van</th>
                <th className="py-3.5 px-6 font-bold">Scheduled</th>
                <th className="py-3.5 px-6 font-bold">Started</th>
                <th className="py-3.5 px-6 font-bold">Ended</th>
                <th className="py-3.5 px-6 font-bold">Wards done</th>
                <th className="py-3.5 px-6 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE3] dark:divide-[#2A3B31]">
              {attendance.map((rec) => {
                const initials = rec.driverName.split(' ').map((n) => n[0]).join('').slice(0, 2);
                const isLate = rec.status === 'late';
                const isAbsent = rec.status === 'absent';
                const isOffDuty = rec.status === 'off_duty';

                return (
                  <tr
                    key={rec.id}
                    onClick={() => onNavigateTo('tripReplay')}
                    className="hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] cursor-pointer transition-colors"
                  >
                    {/* Driver Name & Code */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#E5EAE3] dark:bg-[#2A3B31] font-bold text-xs flex items-center justify-center">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{rec.driverName}</div>
                          <div className="text-[10px] font-mono text-[#566259]">{rec.driverCode}</div>
                        </div>
                      </div>
                    </td>

                    {/* Van */}
                    <td className="py-4 px-6 font-mono font-bold text-[#14201A] dark:text-[#EAF2E6]">
                      {rec.vanPlate}
                    </td>

                    {/* Scheduled */}
                    <td className="py-4 px-6 font-medium text-[#14201A] dark:text-[#EAF2E6]">
                      {rec.scheduled}
                    </td>

                    {/* Started */}
                    <td className="py-4 px-6 font-medium text-[#14201A] dark:text-[#EAF2E6]">
                      {rec.started}
                    </td>

                    {/* Ended */}
                    <td className="py-4 px-6 text-[#566259]">
                      {rec.ended}
                    </td>

                    {/* Wards done */}
                    <td className="py-4 px-6 font-medium text-[#14201A] dark:text-[#EAF2E6]">
                      {rec.wardsDone}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isAbsent
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                            : isLate
                            ? 'bg-[#FFF8E6] text-[#A66800] dark:bg-[#332611] dark:text-[#F3BA54]'
                            : isOffDuty
                            ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                            : 'bg-[#EAF5EC] text-[#1B7A3F] dark:bg-[#163321] dark:text-[#6DB36F]'
                        }`}
                      >
                        {isAbsent
                          ? '! Absent'
                          : isLate
                          ? `! Late ${rec.lateMinutes || 12} min`
                          : isOffDuty
                          ? 'Off duty'
                          : '✓ On time'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
