import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, CheckCircle, UserCheck, Lock } from 'lucide-react';
import { Staff } from '../types';

export const A1_Login: React.FC = () => {
  const { t, currentUser, setCurrentUser, availableStaff } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const matched = availableStaff.find(
      (s) => s.email?.toLowerCase() === email.toLowerCase() || s.name.toLowerCase().includes(email.toLowerCase())
    );
    if (matched) {
      setCurrentUser(matched);
      setSuccessMsg(`Authenticated as ${matched.name} (${t.roles[matched.role]})`);
    } else {
      setSuccessMsg(`Session established for: ${email}`);
    }
  };

  const handleSwitchStaff = (staff: Staff) => {
    setCurrentUser(staff);
    setSuccessMsg(`Active role: ${staff.name} [${t.roles[staff.role]}]`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#14201A] dark:text-[#EAF2E6]">
          {t.nav.login} & Role Access
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm text-[#566259] dark:text-[#9DB0A2]">
          Official authority session and territorial jurisdiction
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#DDF3E4] dark:bg-[#17382A] p-3 text-xs sm:text-sm font-medium text-[#146B3A] dark:text-[#7ED6A1]">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Active Session Card */}
      <div className="rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-4 sm:p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E4F1DF] dark:bg-[#1F3A2A] text-[#1B7A3F] dark:text-[#6DB36F]">
              <Shield size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#1B7A3F] dark:text-[#6DB36F]">
                Active Officer
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#14201A] dark:text-[#EAF2E6]">
                {currentUser?.name}
              </h2>
            </div>
          </div>
          <span className="rounded-full bg-[#111A14] dark:bg-[#F2F7EE] px-3 py-1 text-xs font-semibold text-white dark:text-[#0E1612]">
            {currentUser?.role ? t.roles[currentUser.role] : 'N/A'}
          </span>
        </div>

        <div className="mt-3 text-xs text-[#566259] dark:text-[#9DB0A2] space-y-1">
          <div>
            <span className="font-semibold text-[#14201A] dark:text-[#EAF2E6]">Jurisdiction: </span>
            {currentUser?.role === 'ddo'
              ? 'Full District (All Wards)'
              : currentUser?.role === 'chief_officer'
              ? 'Urban Nagarpalika Wards'
              : currentUser?.role === 'tdo'
              ? 'Rural Taluka Wards'
              : `Assigned Wards (${currentUser?.wardIds.join(', ')})`}
          </div>
          <div>
            <span className="font-semibold text-[#14201A] dark:text-[#EAF2E6]">Official Email: </span>
            {currentUser?.email}
          </div>
        </div>
      </div>

      {/* One-Click Role Selector */}
      <div className="rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-4 sm:p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
        <h3 className="text-sm sm:text-base font-bold text-[#14201A] dark:text-[#EAF2E6] mb-3">
          Select Role Jurisdiction
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {availableStaff.map((staff) => {
            const isActive = currentUser?.id === staff.id;
            return (
              <button
                key={staff.id}
                onClick={() => handleSwitchStaff(staff)}
                className={`flex items-center justify-between rounded-2xl p-3 text-left transition-all border ${
                  isActive
                    ? 'border-[#1B7A3F] bg-[#E4F1DF] dark:bg-[#1F3A2A]'
                    : 'border-[#DCE5D9] dark:border-[#2A3B31] bg-white dark:bg-[#16221B] hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#14201A] dark:text-[#EAF2E6]">
                    {staff.name}
                  </div>
                  <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                    {t.roles[staff.role]}
                  </div>
                </div>
                {isActive && (
                  <span className="rounded-full bg-[#1B7A3F] px-2 py-0.5 text-[10px] font-bold text-white">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Email Login Form */}
      <div className="rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-4 sm:p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
        <h3 className="text-sm sm:text-base font-bold text-[#14201A] dark:text-[#EAF2E6] mb-3">
          Official Email Login
        </h3>
        <form onSubmit={handleCustomLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
              Email / Officer ID
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@gujarat.gov.in"
              className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#111A14] dark:bg-[#F2F7EE] py-2.5 text-xs font-semibold text-white dark:text-[#0E1612]"
          >
            <Lock size={14} />
            <span>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  );
};
