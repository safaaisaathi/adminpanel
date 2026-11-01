import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, ShieldCheck, User } from 'lucide-react';

export const A25_AuditLog: React.FC = () => {
  const { auditLogs } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'wards' | 'drivers' | 'complaints' | 'settings'>('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (activeFilter === 'wards') return log.action.toLowerCase().includes('ward');
    if (activeFilter === 'drivers') return log.action.toLowerCase().includes('driver') || log.action.toLowerCase().includes('pin');
    if (activeFilter === 'complaints') return log.action.toLowerCase().includes('complaint');
    if (activeFilter === 'settings') return log.action.toLowerCase().includes('time') || log.action.toLowerCase().includes('setting');
    return true;
  });

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Time,User,Role,Action,Target,Device']
        .concat(
          filteredLogs.map(
            (l) => `${l.time},${l.user.name},${l.role},${l.action},${l.target},${l.device}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Safai_Sathi_AuditLog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Filter Chips & Export Header (Canvas A25) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'all' && '✓ '}All actions
          </button>
          <button
            onClick={() => setActiveFilter('wards')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'wards'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            Wards
          </button>
          <button
            onClick={() => setActiveFilter('drivers')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'drivers'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            Drivers
          </button>
          <button
            onClick={() => setActiveFilter('complaints')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'complaints'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            Complaints
          </button>
          <button
            onClick={() => setActiveFilter('settings')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'settings'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#16221B] px-5 py-2 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50 shadow-xs"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
      </div>

      {/* Immutable Audit Log Table (Canvas A25) */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] dark:text-[#9DB0A2] border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <tr>
                <th className="py-3.5 px-6 font-bold">Time</th>
                <th className="py-3.5 px-6 font-bold">User</th>
                <th className="py-3.5 px-6 font-bold">Role</th>
                <th className="py-3.5 px-6 font-bold">Action</th>
                <th className="py-3.5 px-6 font-bold">Target</th>
                <th className="py-3.5 px-6 font-bold">Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE3] dark:divide-[#2A3B31]">
              {filteredLogs.map((log) => {
                const isOfficer = log.role === 'chief_officer';
                const isDdo = log.role === 'ddo';

                return (
                  <tr key={log.id} className="hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] transition-colors">
                    <td className="py-4 px-6 text-[#566259] font-medium">
                      {log.time}
                    </td>

                    {/* User */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#E5EAE3] dark:bg-[#2A3B31] font-bold text-xs flex items-center justify-center">
                          {log.user.initials}
                        </div>
                        <div>
                          <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{log.user.name}</div>
                          <div className="text-[10px] text-[#566259] capitalize">{log.user.role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Pill */}
                    <td className="py-4 px-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isDdo
                            ? 'bg-[#EAF5EC] text-[#1B7A3F]'
                            : isOfficer
                            ? 'bg-[#EAF2FF] text-[#1B57C2]'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        {isDdo ? '✓ DDO' : isOfficer ? 'Chief Officer' : 'Inspector'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 font-bold text-[#14201A] dark:text-[#EAF2E6]">
                      {log.action}
                    </td>

                    {/* Target */}
                    <td className="py-4 px-6 font-mono font-medium text-[#14201A] dark:text-[#EAF2E6]">
                      {log.target}
                    </td>

                    {/* Device */}
                    <td className="py-4 px-6 text-[#566259]">
                      {log.device}
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
