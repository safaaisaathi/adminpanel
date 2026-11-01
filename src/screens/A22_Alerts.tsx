import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertItem } from '../types';
import {
  AlertTriangle,
  Phone,
  CheckCircle2,
  Info,
  AlertCircle,
  Check
} from 'lucide-react';

export const A22_Alerts: React.FC = () => {
  const { alerts, acknowledgeAlert } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === 'critical') return a.severity === 'critical';
    if (activeFilter === 'warning') return a.severity === 'warning';
    if (activeFilter === 'info') return a.severity === 'info';
    return true;
  });

  const handleAcknowledge = (id: string) => {
    acknowledgeAlert(id);
    setToastMessage('Alert acknowledged');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 pb-16 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#111A14] text-white px-5 py-3 shadow-2xl flex items-center gap-2 text-xs font-bold animate-slide-up">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Chips (Canvas A22) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
              : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
          }`}
        >
          {activeFilter === 'all' && '✓ '}All 9
        </button>
        <button
          onClick={() => setActiveFilter('critical')}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
            activeFilter === 'critical'
              ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
              : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
          }`}
        >
          {activeFilter === 'critical' && '✓ '}Critical 2
        </button>
        <button
          onClick={() => setActiveFilter('warning')}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
            activeFilter === 'warning'
              ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
              : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
          }`}
        >
          {activeFilter === 'warning' && '✓ '}Warning 4
        </button>
        <button
          onClick={() => setActiveFilter('info')}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
            activeFilter === 'info'
              ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
              : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
          }`}
        >
          {activeFilter === 'info' && '✓ '}Info 3
        </button>
      </div>

      {/* Alerts Rows Card (Canvas A22) */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-4 sm:p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] divide-y divide-[#E5EAE3] dark:divide-[#2A3B31]">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isWarning = alert.severity === 'warning';

          return (
            <div
              key={alert.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4 transition-colors ${
                alert.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Severity Pill */}
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize shrink-0 ${
                    isCritical
                      ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                      : isWarning
                      ? 'bg-[#FFF8E6] text-[#A66800] dark:bg-[#332611] dark:text-[#F3BA54]'
                      : 'bg-[#EAF2FF] text-[#1B57C2] dark:bg-[#13233F] dark:text-[#8DB4FF]'
                  }`}
                >
                  {isCritical ? '! Critical' : isWarning ? '! Warning' : 'ℹ Info'}
                </span>

                <div>
                  <h4 className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-[#566259] dark:text-[#9DB0A2] mt-0.5">
                    {alert.detail}
                  </p>
                </div>
              </div>

              {/* Time + Action Buttons */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                  {alert.timeAgo}
                </span>

                <button
                  type="button"
                  disabled={alert.acknowledged}
                  onClick={() => handleAcknowledge(alert.id)}
                  className="rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#16221B] hover:bg-neutral-50 px-4 py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] disabled:opacity-40"
                >
                  {alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                </button>

                <a
                  href={`tel:${alert.driverPhone || '+919800000000'}`}
                  className="rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#16221B] hover:bg-neutral-50 px-4 py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] flex items-center gap-1"
                >
                  <Phone size={12} />
                  <span>Call</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
