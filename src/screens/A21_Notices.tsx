import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Camera,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  Check
} from 'lucide-react';
import { NoticeTargetType } from '../types';

export const A21_Notices: React.FC = () => {
  const { notices, sendNotice, wards } = useApp();

  const [targetType, setTargetType] = useState<NoticeTargetType>('all');
  const [selectedWards, setSelectedWards] = useState<string[]>(['ward_5', 'ward_6']);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState(
    'Ward 7 is added to the East route from Monday. Please start with Ward 5 as usual.'
  );
  const [when, setWhen] = useState('Send now');
  const [language, setLanguage] = useState('Gujarati and English');
  const [photoUrl, setPhotoUrl] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendNotice({
      title: title || 'District Announcement',
      targetType,
      wardIds: targetType === 'ward' ? selectedWards : [],
      message: message.trim(),
      createdBy: 'R. Shah',
      when,
      language,
      photoUrl
    });

    setTitle('');
    setMessage('');
    setToastMessage('Notice dispatched to targeted devices');
    setTimeout(() => setToastMessage(null), 3500);
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

      {/* Main Grid: Left New Notice Form, Right Sent Notices List (Canvas A21) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Column: New Notice Form (Canvas A21) */}
        <div className="lg:col-span-7 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
          <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
            New notice
          </h3>

          <form onSubmit={handleSendNotice} className="space-y-4">
            {/* Send To Target Chips */}
            <div>
              <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-2">
                Send to
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType('all')}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    targetType === 'all'
                      ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                      : 'bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
                  }`}
                >
                  {targetType === 'all' && '✓ '}All drivers
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('ward')}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    targetType === 'ward'
                      ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                      : 'bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
                  }`}
                >
                  {targetType === 'ward' && '✓ '}Ward drivers
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('citizens')}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    targetType === 'citizens'
                      ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                      : 'bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
                  }`}
                >
                  {targetType === 'citizens' && '✓ '}Citizens of a ward
                </button>
              </div>
            </div>

            {/* Wards Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                Wards
              </label>
              <input
                type="text"
                value="Ward 5, Ward 6"
                readOnly
                className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
              />
            </div>

            {/* Message Box */}
            <div>
              <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                Message
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type notice message..."
                className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] p-4 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
              />
            </div>

            {/* When & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  When
                </label>
                <input
                  type="text"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Language
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                />
              </div>
            </div>

            {/* Attach Photo Tile */}
            <div
              onClick={() => {
                const url = prompt('Enter photo URL to attach:', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400');
                if (url) setPhotoUrl(url);
              }}
              className="border-2 border-dashed border-[#DCE5D9] dark:border-[#2A3B31] rounded-2xl p-4 text-center cursor-pointer hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] transition-colors"
            >
              <Camera size={18} className="text-[#1B7A3F] mx-auto mb-1" />
              <span className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                {photoUrl ? 'Photo attached' : 'Attach a photo (optional)'}
              </span>
            </div>

            {/* Send Notice Button (Canvas A21) */}
            <div className="pt-2">
              <button
                type="submit"
                className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow flex items-center gap-2 active:scale-95"
              >
                <Send size={14} />
                <span>Send notice</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Sent Notices Cards (Canvas A21) */}
        <div className="lg:col-span-5 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
          <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
            Sent
          </h3>

          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] space-y-1.5"
              >
                <div className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                  {n.title || 'Notice Broadcast'}
                </div>
                <p className="text-[11px] text-[#566259] dark:text-[#9DB0A2] leading-relaxed">
                  {n.message}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-[10px] font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
                  <CheckCircle2 size={13} />
                  <span>Delivered to {n.deliveredCount || 5} of {n.totalTarget || 5}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
