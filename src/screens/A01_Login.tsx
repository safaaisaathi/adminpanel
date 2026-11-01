import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import { Binny } from '../components/Binny';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { StaffRole } from '../types';

interface A01LoginProps {
  onLoginSuccess: (screen: ScreenId) => void;
}

export const A01_Login: React.FC<A01LoginProps> = ({ onLoginSuccess }) => {
  const { switchRole, availableStaff, lang, setLang } = useApp();
  const [email, setEmail] = useState('name@gujarat.gov.in');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Check your email and password');
      return;
    }
    // Determine target overview by current selected staff or default to DDO
    onLoginSuccess('overview');
  };

  const handleRoleSelect = (role: StaffRole, defaultEmail: string) => {
    switchRole(role);
    setEmail(defaultEmail);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8FAF7] dark:bg-[#0E1612]">
      {/* Left Column: Brand & Mascot (Canvas A01) */}
      <div className="relative w-full md:w-1/2 bg-[#1B7A3F] p-8 sm:p-12 md:p-16 flex flex-col justify-between overflow-hidden">
        {/* Subtle decorative leaf shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#B5CF8A]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-lg">
              🌱
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Safai Sathi</span>
          </div>

          {/* Language Toggle in Top Right */}
          <div className="flex items-center rounded-full bg-white/10 backdrop-blur-md p-0.5 text-xs text-white">
            <button
              onClick={() => setLang('gu')}
              className={`rounded-full px-2.5 py-1 font-semibold transition-all ${
                lang === 'gu' ? 'bg-white text-[#1B7A3F]' : 'hover:bg-white/20'
              }`}
            >
              ગુ
            </button>
            <button
              onClick={() => setLang('en')}
              className={`rounded-full px-2.5 py-1 font-semibold transition-all ${
                lang === 'en' ? 'bg-white text-[#1B7A3F]' : 'hover:bg-white/20'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Center Mascot: Binny */}
        <div className="relative z-10 my-auto py-12 flex flex-col items-center justify-center">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <Binny state="wave" size={200} />
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Safai Sathi
          </h2>
          <p className="text-white/80 text-sm mt-2 max-w-md font-medium leading-relaxed">
            Sanitation monitoring for Panchmahal district. Sign in with the account your office created.
          </p>
        </div>
      </div>

      {/* Right Column: Sign In Card (Canvas A01) */}
      <div className="w-full md:w-1/2 p-6 sm:p-12 md:p-16 flex flex-col justify-center items-center bg-[#F8FAF7] dark:bg-[#0E1612]">
        <div className="w-full max-w-md bg-white dark:bg-[#16221B] rounded-[32px] p-8 sm:p-10 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31]">
          <h2 className="text-2xl font-bold text-[#14201A] dark:text-[#EAF2E6] tracking-tight">
            Sign in
          </h2>
          <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1">
            Use the account created by your office.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1.5">
                Email
              </label>
              <div className="flex items-center rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-3 focus-within:border-[#1B7A3F] transition-colors">
                <Mail size={16} className="text-[#566259] mr-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gujarat.gov.in"
                  className="w-full bg-transparent outline-none text-xs text-[#14201A] dark:text-[#EAF2E6]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1.5">
                Password
              </label>
              <div className="flex items-center rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-3 focus-within:border-[#1B7A3F] transition-colors">
                <Lock size={16} className="text-[#566259] mr-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-xs text-[#14201A] dark:text-[#EAF2E6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#566259] hover:text-[#14201A] ml-2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => alert('Password reset instructions sent to registered government email.')}
                className="text-xs font-semibold text-[#1B7A3F] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 p-2.5 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Primary Sign In Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] py-3.5 text-xs font-bold transition-all shadow-md active:scale-98"
            >
              <span>Sign in</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick Demo Role Selectors (Matches DDO · Chief Officer / TDO · Ward Inspector line) */}
          <div className="mt-8 pt-6 border-t border-[#E5EAE3] dark:border-[#2A3B31] text-center">
            <p className="text-[11px] font-semibold text-[#566259] dark:text-[#9DB0A2] mb-3">
              Quick Sign In as Role:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('ddo', 'ddo.panchmahal@gujarat.gov.in')}
                className="rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] px-3 py-1.5 text-[11px] font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-[#1B7A3F] hover:text-white transition-colors"
              >
                DDO
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('chief_officer', 'co.godhra@gujarat.gov.in')}
                className="rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] px-3 py-1.5 text-[11px] font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-[#1B7A3F] hover:text-white transition-colors"
              >
                Chief Officer
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('inspector', 'meena.parmar@gujarat.gov.in')}
                className="rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] px-3 py-1.5 text-[11px] font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-[#1B7A3F] hover:text-white transition-colors"
              >
                Ward Inspector
              </button>
            </div>
            <p className="text-[10px] text-[#566259] dark:text-[#9DB0A2] mt-3">
              DDO · Chief Officer / TDO · Ward Inspector
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
