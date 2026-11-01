import React from 'react';
import { Driver } from '../types';
import { Check, Printer, Send, QrCode } from 'lucide-react';

interface A12IdIssuedModalProps {
  driver: Driver;
  onClose: () => void;
}

export const A12_IdIssuedModal: React.FC<A12IdIssuedModalProps> = ({ driver, onClose }) => {
  const pinDigits = (driver.oneTimePin || '4827').split('');
  const initials = driver.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Scrim Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card (Canvas A12) */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#16221B] rounded-[36px] p-8 shadow-2xl border border-[#E5EAE3] dark:border-[#2A3B31] z-10 animate-scale-up text-center">
        {/* Top Header: Green Check + ID issued */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B7A3F] text-white">
            <Check size={16} strokeWidth={3} />
          </div>
          <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6]">
            ID issued
          </h2>
        </div>

        {/* Official Green ID Card Preview (Canvas A12) */}
        <div className="rounded-3xl bg-[#67B579] text-white p-6 shadow-md text-left relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1B7A3F] font-bold text-base shadow-sm">
                {initials}
              </div>
              <div>
                <div className="font-bold text-base leading-tight">{driver.name}</div>
                <div className="text-[11px] text-white/90 mt-0.5">
                  {driver.wardIds.length > 0 ? driver.wardIds.map(w => w.replace('ward_', 'Ward ')).join(', ') : 'Ward 5, 6'} · {driver.vanPlate || 'GJ-17-AB-1234'}
                </div>
              </div>
            </div>

            {/* QR Code Graphic Representation */}
            <div className="h-10 w-10 bg-black/90 p-1 rounded-lg flex items-center justify-center">
              <QrCode size={28} className="text-white" />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-[10px] uppercase font-semibold text-white/80">
              Driver ID
            </div>
            <div className="text-2xl font-black font-mono tracking-wider mt-0.5">
              {driver.driverId}
            </div>
          </div>
        </div>

        {/* One-time PIN Section */}
        <div className="my-6">
          <div className="text-xs font-semibold text-[#566259] dark:text-[#9DB0A2] mb-3">
            One-time PIN
          </div>

          <div className="flex items-center justify-center gap-3">
            {pinDigits.map((digit, index) => (
              <div
                key={index}
                className="flex h-14 w-12 items-center justify-center rounded-2xl bg-white dark:bg-[#111A14] border-2 border-neutral-300 dark:border-neutral-700 text-2xl font-bold font-mono text-[#14201A] dark:text-[#EAF2E6] shadow-xs"
              >
                {digit}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#566259] dark:text-[#9DB0A2] mt-3">
            Shown only once. The driver must change it at first login.
          </p>
        </div>

        {/* Print & SMS Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111A14] py-2.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50"
          >
            <Printer size={15} />
            <span>Print ID card</span>
          </button>

          <button
            type="button"
            onClick={() => alert(`ID and PIN sent via SMS to ${driver.phone}`)}
            className="flex items-center justify-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100"
          >
            <Send size={15} />
            <span>Send by SMS</span>
          </button>
        </div>

        {/* Done Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:text-[#0E1612] py-3.5 text-xs font-bold shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2"
        >
          <Check size={16} />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};
