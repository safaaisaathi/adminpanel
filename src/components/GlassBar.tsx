import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  Moon,
  Sun,
  KeyRound,
  RotateCcw,
  Sparkles,
  ChevronDown,
  User,
  Shield,
  Check
} from 'lucide-react';
import { StaffRole } from '../types';
import { getSavedFirebaseConfig, saveFirebaseConfig } from '../services/firebaseConfig';

interface GlassBarProps {
  title?: string;
  onToggleMobileMenu?: () => void;
}

export const GlassBar: React.FC<GlassBarProps> = ({
  title,
  onToggleMobileMenu,
}) => {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    currentUser,
    setCurrentUser,
    availableStaff,
    t,
    resetAllData,
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);

  // Firebase config state
  const currentConfig = getSavedFirebaseConfig();
  const [fbApiKey, setFbApiKey] = useState(currentConfig.apiKey || '');
  const [fbProjectId, setFbProjectId] = useState(currentConfig.projectId || '');
  const [fbAuthDomain, setFbAuthDomain] = useState(currentConfig.authDomain || '');
  const [fbStorageBucket, setFbStorageBucket] = useState(currentConfig.storageBucket || '');

  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    saveFirebaseConfig({
      apiKey: fbApiKey.trim(),
      projectId: fbProjectId.trim(),
      authDomain: fbAuthDomain.trim(),
      storageBucket: fbStorageBucket.trim(),
    });
  };

  const roleLabel = (role: StaffRole) => {
    return t.roles[role] || role;
  };

  return (
    <>
      <header className="sticky top-0 z-30 mx-2 sm:mx-4 mt-2 sm:mt-3 mb-3 sm:mb-4 flex items-center justify-between rounded-full bg-white/90 dark:bg-[#16221B]/90 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-2.5 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
        {/* Left: Mobile Menu Toggle + Screen Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleMobileMenu}
            className="flex h-9 w-9 lg:hidden items-center justify-center rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu size={18} />
          </button>

          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#14201A] dark:text-[#EAF2E6] leading-tight">
              {title || t.appName}
            </h1>
            <p className="text-[10px] sm:text-xs text-[#566259] dark:text-[#9DB0A2] leading-none">
              Panchmahal Godhra • {currentUser?.role === 'ddo' ? 'All Wards' : roleLabel(currentUser?.role || 'inspector')}
            </p>
          </div>
        </div>

        {/* Right: Language, Theme, Unified User Profile Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Bilingual Language Switcher (Compact Pill) */}
          <div className="flex items-center rounded-full bg-[#E9F1E6] dark:bg-[#1E2D24] p-0.5 border border-[#DCE5D9] dark:border-[#2A3B31]">
            <button
              onClick={() => setLang('gu')}
              className={`rounded-full px-2 sm:px-2.5 py-1 text-[11px] font-semibold transition-all ${
                lang === 'gu'
                  ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                  : 'text-[#566259] dark:text-[#9DB0A2] hover:text-black dark:hover:text-white'
              }`}
            >
              ગુ
            </button>
            <button
              onClick={() => setLang('en')}
              className={`rounded-full px-2 sm:px-2.5 py-1 text-[11px] font-semibold transition-all ${
                lang === 'en'
                  ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                  : 'text-[#566259] dark:text-[#9DB0A2] hover:text-black dark:hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#DCE5D9] dark:border-[#2A3B31] bg-white dark:bg-[#16221B] text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Unified Officer Profile & Scope Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 rounded-full border border-[#DCE5D9] dark:border-[#2A3B31] bg-[#F3F6F2] dark:bg-[#1E2D24] pl-1.5 pr-2.5 sm:pr-3 py-1 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1B7A3F] text-white text-[10px] font-bold">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <span className="hidden sm:inline-block max-w-[120px] truncate">
                {currentUser?.name.split(' ')[0]}
              </span>
              <ChevronDown size={13} className="text-neutral-500" />
            </button>

            {/* Profile & Role Switcher Popup */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-[24px] bg-white dark:bg-[#16221B] p-3 shadow-elev3 dark:shadow-elev3-dark border border-[#DCE5D9] dark:border-[#2A3B31] z-50 animate-in fade-in duration-150">
                {/* Active User Card */}
                <div className="p-3 rounded-2xl bg-[#F3F6F2] dark:bg-[#1E2D24] mb-2">
                  <div className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                    {currentUser?.name}
                  </div>
                  <div className="text-[11px] font-medium text-[#1B7A3F] dark:text-[#6DB36F]">
                    {roleLabel(currentUser?.role || 'inspector')}
                  </div>
                  <div className="text-[10px] text-[#566259] dark:text-[#9DB0A2] mt-0.5 truncate">
                    {currentUser?.phone}
                  </div>
                </div>

                {/* Quick Role Switcher */}
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#566259] dark:text-[#9DB0A2]">
                  Switch Role Scope
                </div>
                <div className="space-y-1 mb-2">
                  {availableStaff.map((staff) => {
                    const isSelected = currentUser?.id === staff.id;
                    return (
                      <button
                        key={staff.id}
                        onClick={() => {
                          setCurrentUser(staff);
                          setShowProfileMenu(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-colors ${
                          isSelected
                            ? 'bg-[#E4F1DF] dark:bg-[#1F3A2A] font-semibold text-[#1B7A3F] dark:text-[#6DB36F]'
                            : 'text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-medium truncate">{staff.name}</div>
                          <div className="text-[10px] text-[#566259] dark:text-[#9DB0A2]">
                            {roleLabel(staff.role)}
                          </div>
                        </div>
                        {isSelected && <Check size={14} className="shrink-0 text-[#1B7A3F]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Database Settings & Reset Actions */}
                <div className="pt-2 border-t border-[#DCE5D9] dark:border-[#2A3B31] space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowFirebaseModal(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <KeyRound size={13} className="text-[#1B7A3F]" />
                    <span>Firebase Connection Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      resetAllData();
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Demo Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Firebase Credentials Modal */}
      {showFirebaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-[#16221B] p-5 sm:p-6 shadow-elev3 border border-[#DCE5D9] dark:border-[#2A3B31]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="text-[#1B7A3F]" size={18} />
                <h3 className="font-semibold text-base text-[#14201A] dark:text-[#EAF2E6]">
                  Firebase API Connection
                </h3>
              </div>
              <button
                onClick={() => setShowFirebaseModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <p className="mt-2.5 text-xs text-[#566259] dark:text-[#9DB0A2]">
              Connect your live Firebase credentials below. The portal switches seamlessly between live Firebase and high-fidelity simulated storage.
            </p>

            <form onSubmit={handleSaveFirebase} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  value={fbApiKey}
                  onChange={(e) => setFbApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={fbProjectId}
                  onChange={(e) => setFbProjectId(e.target.value)}
                  placeholder="safaai-sathi-godhra"
                  className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Storage Bucket
                </label>
                <input
                  type="text"
                  value={fbStorageBucket}
                  onChange={(e) => setFbStorageBucket(e.target.value)}
                  placeholder="safaai-sathi-godhra.appspot.com"
                  className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs"
                />
              </div>

              <div className="mt-5 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFirebaseModal(false)}
                  className="flex-1 rounded-full border border-neutral-300 dark:border-neutral-700 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#111A14] dark:bg-[#F2F7EE] py-2 text-xs font-semibold text-white dark:text-[#0E1612]"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
