import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Clock, BellRing, ShieldAlert, Sparkles } from 'lucide-react';
import { SettingsConfig } from '../types';

export const A04_Settings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [formData, setFormData] = useState<SettingsConfig>({ ...settings });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggleAlert = (key: keyof SettingsConfig['alerts']) => {
    setFormData((prev) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [key]: !prev.alerts[key]
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setToastMessage('Settings saved and applied across district rules');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-16 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#111A14] text-white px-5 py-3 shadow-2xl flex items-center gap-2 text-xs font-bold animate-slide-up">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Row: Escalation timing & Complaint categories (Canvas A04) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Escalation Timing Card */}
        <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
          <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-1">
            Escalation timing
          </h3>
          <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mb-6">
            Configure automated hierarchy escalation thresholds
          </p>

          <div className="space-y-4">
            {/* Level 1 */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31]">
              <div>
                <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Level 1: Chief Officer or TDO
                </div>
                <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                  If not resolved after
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={formData.escalationL1Hours}
                  onChange={(e) => setFormData({ ...formData, escalationL1Hours: parseInt(e.target.value) || 24 })}
                  className="w-16 rounded-xl bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] px-3 py-1.5 text-xs font-bold text-center text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                />
                <span className="text-xs font-bold text-[#566259]">h</span>
              </div>
            </div>

            {/* Level 2 */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31]">
              <div>
                <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Level 2: DDO
                </div>
                <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                  If still not resolved after
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={formData.escalationL2Hours}
                  onChange={(e) => setFormData({ ...formData, escalationL2Hours: parseInt(e.target.value) || 48 })}
                  className="w-16 rounded-xl bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] px-3 py-1.5 text-xs font-bold text-center text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                />
                <span className="text-xs font-bold text-[#566259]">h</span>
              </div>
            </div>

            {/* Resolve Target */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31]">
              <div>
                <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Resolve target
                </div>
                <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                  Complaint should be closed within
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="240"
                  value={formData.resolveTargetHours}
                  onChange={(e) => setFormData({ ...formData, resolveTargetHours: parseInt(e.target.value) || 72 })}
                  className="w-16 rounded-xl bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] px-3 py-1.5 text-xs font-bold text-center text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                />
                <span className="text-xs font-bold text-[#566259]">h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Categories SLA Card */}
        <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
          <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-1">
            Complaint categories
          </h3>
          <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mb-6">
            Specific category resolution targets & notifications
          </p>

          <div className="space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14]">
              <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">Garbage dump</span>
              <div className="flex items-center gap-3">
                <span className="text-[#566259] dark:text-[#9DB0A2]">Resolve in 48 h</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                  Notify inspector
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14]">
              <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">Open gutter</span>
              <div className="flex items-center gap-3">
                <span className="text-[#566259] dark:text-[#9DB0A2]">Resolve in 72 h</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                  Notify inspector
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14]">
              <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">Missed collection</span>
              <div className="flex items-center gap-3">
                <span className="text-[#566259] dark:text-[#9DB0A2]">Same day</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                  Notify inspector
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14]">
              <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">Other</span>
              <div className="flex items-center gap-3">
                <span className="text-[#566259] dark:text-[#9DB0A2]">72 h</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                  Notify inspector
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Automatic Alerts Card (Canvas A04) */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
        <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-1">
          Automatic alerts
        </h3>
        <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mb-6">
          Trigger system warnings to ward inspectors and officers
        </p>

        <div className="space-y-4">
          {/* Alert 1 */}
          <div className="flex items-center justify-between py-2 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
            <span className="text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6]">
              Van offline for more than 10 minutes
            </span>
            <button
              type="button"
              onClick={() => handleToggleAlert('vanOffline10m')}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.alerts.vanOffline10m ? 'bg-[#1B7A3F]' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${formData.alerts.vanOffline10m ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Alert 2 */}
          <div className="flex items-center justify-between py-2 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
            <span className="text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6]">
              Driver has not started the shift 15 minutes after schedule
            </span>
            <button
              type="button"
              onClick={() => handleToggleAlert('lateStart15m')}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.alerts.lateStart15m ? 'bg-[#1B7A3F]' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${formData.alerts.lateStart15m ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Alert 3 */}
          <div className="flex items-center justify-between py-2 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
            <span className="text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6]">
              Van leaves its route area
            </span>
            <button
              type="button"
              onClick={() => handleToggleAlert('vanLeavesArea')}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.alerts.vanLeavesArea ? 'bg-[#1B7A3F]' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${formData.alerts.vanLeavesArea ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Alert 4 */}
          <div className="flex items-center justify-between py-2 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
            <span className="text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6]">
              Licence or van document expires within 30 days
            </span>
            <button
              type="button"
              onClick={() => handleToggleAlert('docExpiring30d')}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.alerts.docExpiring30d ? 'bg-[#1B7A3F]' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${formData.alerts.docExpiring30d ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Alert 5 */}
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6]">
              Three or more missed-collection reports in one ward
            </span>
            <button
              type="button"
              onClick={() => handleToggleAlert('threeMissedReports')}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.alerts.threeMissedReports ? 'bg-[#1B7A3F]' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${formData.alerts.threeMissedReports ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button (Canvas A04) */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-8 py-3 text-xs font-bold shadow-md transition-transform active:scale-95"
        >
          Save changes
        </button>
      </div>
    </form>
  );
};
