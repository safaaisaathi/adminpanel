import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoticeTargetType } from '../types';
import { Radio, Send, Bell, Users, Truck, CheckCircle2, History } from 'lucide-react';
import { Binny } from '../components/Binny';

export const A7_Notices: React.FC = () => {
  const { t, notices, sendNotice, scopedWards, scopedVans, currentUser } = useApp();

  const [targetType, setTargetType] = useState<NoticeTargetType>('all');
  const [targetId, setTargetId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendNotice({
      targetType,
      targetId: targetType === 'all' ? undefined : targetId,
      message: message.trim(),
      createdBy: currentUser ? `${currentUser.name} (${t.roles[currentUser.role]})` : 'District Admin',
    });

    setMessage('');
    setTargetId('');
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#14201A] dark:text-[#EAF2E6]">
          {t.noticesPage.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#566259] dark:text-[#9DB0A2] mt-0.5">
          Broadcast official announcements to citizens and collection drivers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Compose Form (1 Column) */}
        <div className="rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-4 sm:p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
          <h2 className="text-base sm:text-lg font-bold text-[#14201A] dark:text-[#EAF2E6] mb-3 flex items-center gap-2">
            <Radio size={18} className="text-[#1B7A3F] dark:text-[#6DB36F]" />
            <span>{t.noticesPage.createNotice}</span>
          </h2>

          {sendSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-[#DDF3E4] p-3 text-xs font-semibold text-[#146B3A]">
              <CheckCircle2 size={16} />
              <span>Broadcast dispatched to FCM topic: {targetType === 'all' ? 'all' : `${targetType}_${targetId}`}</span>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1.5">
                {t.noticesPage.target}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('all');
                    setTargetId('');
                  }}
                  className={`rounded-full py-2 text-xs font-semibold transition-all border ${
                    targetType === 'all'
                      ? 'bg-[#111A14] text-white border-[#111A14] dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                      : 'border-[#DCE5D9] dark:border-[#2A3B31] text-[#566259] dark:text-[#9DB0A2]'
                  }`}
                >
                  All Apps
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('ward');
                    if (scopedWards[0]) setTargetId(scopedWards[0].id);
                  }}
                  className={`rounded-full py-2 text-xs font-semibold transition-all border ${
                    targetType === 'ward'
                      ? 'bg-[#111A14] text-white border-[#111A14] dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                      : 'border-[#DCE5D9] dark:border-[#2A3B31] text-[#566259] dark:text-[#9DB0A2]'
                  }`}
                >
                  Ward Citizens
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('van');
                    if (scopedVans[0]) setTargetId(scopedVans[0].id);
                  }}
                  className={`rounded-full py-2 text-xs font-semibold transition-all border ${
                    targetType === 'van'
                      ? 'bg-[#111A14] text-white border-[#111A14] dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                      : 'border-[#DCE5D9] dark:border-[#2A3B31] text-[#566259] dark:text-[#9DB0A2]'
                  }`}
                >
                  Van Driver
                </button>
              </div>
            </div>

            {/* Target Selector */}
            {targetType === 'ward' && (
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Select Target Ward
                </label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs text-[#14201A] dark:text-[#EAF2E6]"
                >
                  {scopedWards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'van' && (
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Select Target Van
                </label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs text-[#14201A] dark:text-[#EAF2E6]"
                >
                  {scopedVans.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNo} ({v.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                {t.noticesPage.message}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Compose announcement for citizen alerts or driver route updates..."
                rows={4}
                required
                className="w-full rounded-2xl border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] p-3 text-xs text-[#14201A] dark:text-[#EAF2E6]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#111A14] dark:bg-[#F2F7EE] py-3 text-xs font-semibold text-white dark:text-[#0E1612] hover:opacity-90 transition-opacity"
            >
              <Send size={15} />
              <span>{t.noticesPage.send}</span>
            </button>
          </form>
        </div>

        {/* Notices Broadcast History (2 Columns) */}
        <div className="lg:col-span-2 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
          <h2 className="text-lg font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4 flex items-center gap-2">
            <History size={20} className="text-[#1B7A3F] dark:text-[#6DB36F]" />
            <span>{t.noticesPage.history}</span>
          </h2>

          {notices.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Binny pose="wait" size={140} />
              <div className="mt-3 font-semibold text-sm text-[#14201A] dark:text-[#EAF2E6]">
                No broadcasts sent yet
              </div>
              <p className="text-xs text-[#566259] dark:text-[#9DB0A2]">
                Announcements sent from this dashboard appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="rounded-2xl border border-[#DCE5D9] dark:border-[#2A3B31] bg-[#F3F6F2] dark:bg-[#1E2D24] p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#DCE5D9] dark:border-[#2A3B31]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            notice.targetType === 'all'
                              ? 'bg-[#E4F1DF] text-[#1B7A3F]'
                              : notice.targetType === 'ward'
                              ? 'bg-[#E3EDFF] text-[#1D4FB8]'
                              : 'bg-[#FFF1D1] text-[#8A5A00]'
                          }`}
                        >
                          Target: {notice.targetType.toUpperCase()} {notice.targetId ? `(${notice.targetId})` : ''}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                        {new Date(notice.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] leading-relaxed">
                      {notice.message}
                    </p>
                  </div>

                  <div className="mt-3 text-[11px] text-[#566259] dark:text-[#9DB0A2] text-right">
                    Dispatched by: <span className="font-semibold text-[#14201A] dark:text-[#EAF2E6]">{notice.createdBy}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
