import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users2, Shield, Phone, Mail, Plus, MapPin, CheckCircle } from 'lucide-react';
import { StaffRole } from '../types';

export const A9_Staff: React.FC = () => {
  const { t, availableStaff, scopedWards, currentUser } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('inspector');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedWards, setSelectedWards] = useState<string[]>([]);
  const [successNotice, setSuccessNotice] = useState('');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // Simulate addition
    setSuccessNotice(`Officer profile created for: ${name}`);
    setTimeout(() => {
      setSuccessNotice('');
      setShowAddModal(false);
      setName('');
      setPhone('');
      setEmail('');
      setSelectedWards([]);
    }, 1800);
  };

  const isDdoOrCo = currentUser?.role === 'ddo' || currentUser?.role === 'chief_officer';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-[#14201A] dark:text-[#EAF2E6]">
            {t.staffPage.title}
          </h1>
          <p className="text-sm text-[#566259] dark:text-[#9DB0A2] mt-0.5">
            District sanitation administrative chain of command and territorial jurisdictions
          </p>
        </div>

        {isDdoOrCo && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#111A14] dark:bg-[#F2F7EE] px-4 py-2.5 text-xs font-semibold text-white dark:text-[#0E1612] hover:opacity-90"
          >
            <Plus size={15} />
            <span>{t.staffPage.addStaff}</span>
          </button>
        )}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {availableStaff.map((staff) => (
          <div
            key={staff.id}
            className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      staff.role === 'ddo'
                        ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612]'
                        : staff.role === 'chief_officer'
                        ? 'bg-[#E3EDFF] text-[#1D4FB8]'
                        : staff.role === 'tdo'
                        ? 'bg-[#FFF1D1] text-[#8A5A00]'
                        : 'bg-[#E4F1DF] text-[#1B7A3F]'
                    }`}
                  >
                    {t.roles[staff.role]}
                  </span>
                  <h3 className="text-base font-bold text-[#14201A] dark:text-[#EAF2E6] mt-2">
                    {staff.name}
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3F6F2] dark:bg-[#1E2D24] text-[#1B7A3F]">
                  <Shield size={20} />
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-[#566259] dark:text-[#9DB0A2]">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-neutral-400" />
                  <span>{staff.phone}</span>
                </div>
                {staff.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-neutral-400" />
                    <span>{staff.email}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#DCE5D9] dark:border-[#2A3B31]">
                <div className="text-[11px] font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1.5 flex items-center gap-1">
                  <MapPin size={13} className="text-[#1B7A3F]" />
                  <span>Territorial Jurisdiction:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {staff.role === 'ddo' ? (
                    <span className="rounded-full bg-[#E4F1DF] dark:bg-[#1F3A2A] px-2.5 py-0.5 text-[10px] font-bold text-[#1B7A3F] dark:text-[#6DB36F]">
                      Entire Panchmahal District (Urban & Rural)
                    </span>
                  ) : (
                    staff.wardIds.map((wid) => {
                      const ward = scopedWards.find((w) => w.id === wid);
                      return (
                        <span
                          key={wid}
                          className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          {ward?.name || wid}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-elev3 border border-[#DCE5D9] dark:border-[#2A3B31]">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-[#14201A] dark:text-[#EAF2E6]">
                {t.staffPage.addStaff}
              </h3>
              <button onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            {successNotice ? (
              <div className="my-6 flex items-center gap-2 rounded-2xl bg-[#DDF3E4] p-3 text-xs font-semibold text-[#146B3A]">
                <CheckCircle size={16} />
                <span>{successNotice}</span>
              </div>
            ) : (
              <form onSubmit={handleAddStaff} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Officer Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vijay Solanki"
                    required
                    className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Jurisdiction Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs"
                  >
                    <option value="inspector">{t.roles.inspector}</option>
                    <option value="chief_officer">{t.roles.chief_officer}</option>
                    <option value="tdo">{t.roles.tdo}</option>
                    <option value="ddo">{t.roles.ddo}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Official Mobile
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98250 XXXXX"
                    required
                    className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@gujarat.gov.in"
                    className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-2 text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 rounded-full border border-neutral-300 dark:border-neutral-700 py-2 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-[#111A14] dark:bg-[#F2F7EE] py-2 text-xs font-semibold text-white dark:text-[#0E1612]"
                  >
                    Create Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
