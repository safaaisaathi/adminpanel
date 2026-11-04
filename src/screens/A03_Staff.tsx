import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Staff, StaffRole } from '../types';
import {
  UserPlus,
  Shield,
  X,
  Mail,
  Phone,
  Building,
  Check,
  AlertTriangle
} from 'lucide-react';

export const A03_Staff: React.FC = () => {
  const { availableStaff, addStaff, toggleStaffActive, wards } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'officers' | 'inspectors'>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<StaffRole>('inspector');
  const [jurisdiction, setJurisdiction] = useState('Godhra Nagarpalika');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedWards, setSelectedWards] = useState<string[]>(['ward_5', 'ward_6']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const officersCount = availableStaff.filter((s) => s.role === 'chief_officer' || s.role === 'tdo' || s.role === 'ddo').length;
  const inspectorsCount = availableStaff.filter((s) => s.role === 'inspector').length;

  // Filtered staff list
  const filteredStaff = availableStaff.filter((s) => {
    if (activeFilter === 'officers') return s.role === 'chief_officer' || s.role === 'tdo' || s.role === 'ddo';
    if (activeFilter === 'inspectors') return s.role === 'inspector';
    return true;
  });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    addStaff({
      authUid: 'uid_' + Date.now(),
      name: fullName.trim(),
      role,
      wardIds: role === 'inspector' ? selectedWards : [],
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: email.trim(),
      jurisdiction: jurisdiction.trim()
    });

    setIsDrawerOpen(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setToastMessage(`Invitation sent to ${email.trim()}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleWard = (wardId: string) => {
    if (selectedWards.includes(wardId)) {
      setSelectedWards(selectedWards.filter((id) => id !== wardId));
    } else {
      setSelectedWards([...selectedWards, wardId]);
    }
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#111A14] text-white px-5 py-3 shadow-2xl flex items-center gap-2 text-xs font-bold animate-slide-up">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Chips & Action Header (Canvas A03) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] dark:text-[#9DB0A2] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'all' && '✓ '}All {availableStaff.length}
          </button>
          <button
            onClick={() => setActiveFilter('officers')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'officers'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] dark:text-[#9DB0A2] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'officers' && '✓ '}Chief Officers and TDOs {officersCount}
          </button>
          <button
            onClick={() => setActiveFilter('inspectors')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'inspectors'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] dark:text-[#9DB0A2] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'inspectors' && '✓ '}Inspectors {inspectorsCount}
          </button>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-5 py-2 text-xs font-bold shadow transition-transform active:scale-95"
        >
          Add staff
        </button>
      </div>

      {/* Staff Table (Canvas A03) */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] dark:text-[#9DB0A2] border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <tr>
                <th className="py-3.5 px-6 font-bold">Name</th>
                <th className="py-3.5 px-6 font-bold">Role</th>
                <th className="py-3.5 px-6 font-bold">Jurisdiction</th>
                <th className="py-3.5 px-6 font-bold">Wards</th>
                <th className="py-3.5 px-6 font-bold">Last active</th>
                <th className="py-3.5 px-6 font-bold text-center">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE3] dark:divide-[#2A3B31]">
              {filteredStaff.map((person) => {
                const initials = person.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                const isOfficer = person.role === 'chief_officer' || person.role === 'tdo';

                return (
                  <tr key={person.id} className="hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] transition-colors">
                    {/* Name + Phone */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5EAE3] dark:bg-[#2A3B31] font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{person.name}</div>
                          <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">{person.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Pill */}
                    <td className="py-4 px-6">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          person.role === 'ddo'
                            ? 'bg-[#EAF5EC] text-[#1B7A3F]'
                            : isOfficer
                            ? 'bg-[#EAF2FF] text-[#1B57C2]'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        {person.role === 'chief_officer'
                          ? 'Chief Officer'
                          : person.role === 'tdo'
                          ? 'TDO'
                          : person.role === 'ddo'
                          ? 'DDO'
                          : 'Inspector'}
                      </span>
                    </td>

                    {/* Jurisdiction */}
                    <td className="py-4 px-6 font-medium text-[#14201A] dark:text-[#EAF2E6]">
                      {person.jurisdiction || 'Godhra Nagarpalika'}
                    </td>

                    {/* Wards */}
                    <td className="py-4 px-6 font-medium text-[#566259] dark:text-[#9DB0A2]">
                      {person.wardIds && person.wardIds.length > 0
                        ? person.wardIds.map(id => wards.find(w => w.id === id)?.name || id).join(', ')
                        : isOfficer
                        ? '14 wards'
                        : 'Unassigned'}
                    </td>

                    {/* Last active */}
                    <td className="py-4 px-6 text-[#566259] dark:text-[#9DB0A2]">
                      {person.lastActive || 'Today, 09:10'}
                    </td>

                    {/* Active toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Change status for ${person.name}?`)) {
                            toggleStaffActive(person.id);
                          }
                        }}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          person.active !== false ? 'bg-[#1B7A3F]' : 'bg-neutral-300 dark:bg-neutral-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            person.active !== false ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Drawer (Canvas A03 right drawer) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Scrim */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Body (560px) */}
          <div className="relative w-full max-w-lg bg-white dark:bg-[#16221B] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto z-10 animate-slide-left">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <div>
                  <h2 className="text-xl font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    Add staff
                  </h2>
                  <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-0.5">
                    They will get an email to set a password.
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSendInvite} id="add-staff-form" className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                  >
                    <option value="inspector">Ward Inspector</option>
                    <option value="chief_officer">Chief Officer</option>
                    <option value="tdo">Taluka Development Officer (TDO)</option>
                  </select>
                </div>

                {/* Jurisdiction */}
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none focus:border-[#1B7A3F]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Email
                  </label>
                  <div className="flex items-center rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 focus-within:border-[#1B7A3F]">
                    <Mail size={15} className="text-[#566259] mr-2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gujarat.gov.in"
                      className="w-full bg-transparent outline-none text-xs text-[#14201A] dark:text-[#EAF2E6]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Phone
                  </label>
                  <div className="flex items-center rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 focus-within:border-[#1B7A3F]">
                    <Phone size={15} className="text-[#566259] mr-2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98xxxxxx"
                      className="w-full bg-transparent outline-none text-xs text-[#14201A] dark:text-[#EAF2E6]"
                    />
                  </div>
                </div>

                {/* Wards selector for inspector */}
                {role === 'inspector' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-2">
                      Wards (for inspectors)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {wards.map((w) => {
                        const isSelected = selectedWards.includes(w.id);
                        return (
                          <button
                            type="button"
                            key={w.id}
                            onClick={() => toggleWard(w.id)}
                            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[#FFF8E6] text-[#A66800] border border-[#E8A317]'
                                : 'bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
                            }`}
                          >
                            {isSelected && '✓ '}{w.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#E5EAE3] dark:border-[#2A3B31] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-full px-5 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-staff-form"
                className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow transition-transform active:scale-95"
              >
                Send invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
