import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import {
  Camera,
  Upload,
  Calendar,
  Phone,
  Truck,
  Copy,
  Check,
  User
} from 'lucide-react';
import { Driver } from '../types';

interface A11EnrollDriverProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
  onDriverEnrolled: (driver: Driver) => void;
}

export const A11_EnrollDriver: React.FC<A11EnrollDriverProps> = ({
  onNavigateTo,
  onDriverEnrolled,
}) => {
  const { enrollDriver, vans, wards, drivers } = useApp();

  // Driver ID format 'XX-0000' (starting 2 alphabets and 4 digits e.g. GJ-0048)
  const nextSeq = Math.max(1, 48 + (drivers?.length || 0) - 6);
  const defaultDriverId = `GJ-${String(nextSeq).padStart(4, '0')}`;
  const [driverId, setDriverId] = useState(defaultDriverId);
  const [driverIdError, setDriverIdError] = useState('');

  // Personal details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('14/03/1992');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Driving details
  const [licenceNumber, setLicenceNumber] = useState('GJ17 2024 0012345');
  const [licenceClass, setLicenceClass] = useState('LMV (Transport)');
  const [licenceIssued, setLicenceIssued] = useState('10/01/2024');
  const [licenceValidUntil, setLicenceValidUntil] = useState('Dec 2028');

  // Allotment
  const [selectedVanId, setSelectedVanId] = useState(vans[0]?.id || '');
  const [selectedWards, setSelectedWards] = useState<string[]>(['ward_5', 'ward_6']);
  const [shiftStart, setShiftStart] = useState('07:30 AM');
  const [shiftEnd, setShiftEnd] = useState('02:30 PM');
  const [effectiveFrom, setEffectiveFrom] = useState('30 Oct 2026');

  // Credentials
  const [sendSms, setSendSms] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  const handleDriverIdChange = (val: string) => {
    let formatted = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (formatted.length === 2 && !formatted.includes('-') && /^[A-Z]{2}$/.test(formatted)) {
      formatted = formatted + '-';
    }
    if (formatted.length > 7) {
      formatted = formatted.slice(0, 7);
    }
    setDriverId(formatted);

    const regex = /^[A-Z]{2}-\d{4}$/;
    if (!regex.test(formatted)) {
      setDriverIdError("Driver ID must follow 'XX-0000' format (2 letters, hyphen, 4 digits e.g. GJ-0048)");
    } else {
      setDriverIdError('');
    }
  };

  const toggleWard = (wardId: string) => {
    if (selectedWards.includes(wardId)) {
      setSelectedWards(selectedWards.filter((w) => w !== wardId));
    } else {
      setSelectedWards([...selectedWards, wardId]);
    }
  };

  const handleSaveAndIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Please enter Driver Full Name and Phone number');
      return;
    }

    const regex = /^[A-Z]{2}-\d{4}$/;
    if (!regex.test(driverId)) {
      alert("Invalid Driver ID! Driver ID must strictly follow 'XX-0000' format (starting 2 letters followed by hyphen and 4 digits, e.g. GJ-0048)");
      return;
    }

    const van = vans.find((v) => v.id === selectedVanId);

    const newDriver = enrollDriver({
      driverId,
      name: fullName.trim(),
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      dob,
      address,
      emergencyContact: {
        name: emergencyName || 'Family contact',
        phone: emergencyPhone || '+91 98251 00000'
      },
      licenceNumber,
      licenceClass,
      licenceIssued,
      licenceValidUntil,
      vanId: selectedVanId,
      vanPlate: van?.plateNo || 'GJ-17-AB-1234',
      wardIds: selectedWards,
      shiftStart,
      shiftEnd,
      effectiveFrom,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    onDriverEnrolled(newDriver);
  };

  return (
    <form onSubmit={handleSaveAndIssue} className="space-y-6 pb-16">
      {/* 2-Column Grid matching Canvas A11 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personal & Driving details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Personal Details Card */}
          <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
              Personal details
            </h3>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Photo Upload Tile */}
              <div
                onClick={() => {
                  const url = prompt('Enter image URL or use mock avatar:', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');
                  if (url) setPhotoUrl(url);
                }}
                className="cursor-pointer h-32 w-32 shrink-0 rounded-2xl border-2 border-dashed border-[#DCE5D9] dark:border-[#2A3B31] bg-[#F8FAF7] dark:bg-[#111A14] flex flex-col items-center justify-center text-center p-3 hover:border-[#1B7A3F] transition-colors"
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="" className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <>
                    <Camera size={24} className="text-[#1B7A3F] mb-1.5" />
                    <span className="text-[11px] font-bold text-[#14201A] dark:text-[#EAF2E6]">
                      Add photo
                    </span>
                  </>
                )}
              </div>

              {/* Personal Fields */}
              <div className="flex-1 space-y-3.5">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98251 00048"
                      className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                      Date of birth
                    </label>
                    <input
                      type="text"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      placeholder="DD / MM / YYYY"
                      className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, street, village or ward"
                className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
              />
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Emergency contact name
                </label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Name"
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Emergency contact phone
                </label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+91"
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Driving Details Card */}
          <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
              Driving details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Licence number
                </label>
                <input
                  type="text"
                  value={licenceNumber}
                  onChange={(e) => setLicenceNumber(e.target.value)}
                  placeholder="GJ17 2024 0012345"
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs font-mono font-bold text-[#14201A] dark:text-[#EAF2E6] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Licence class
                </label>
                <input
                  type="text"
                  value={licenceClass}
                  onChange={(e) => setLicenceClass(e.target.value)}
                  placeholder="LMV (Transport)"
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Issued on
                </label>
                <input
                  type="text"
                  value={licenceIssued}
                  onChange={(e) => setLicenceIssued(e.target.value)}
                  placeholder="DD / MM / YYYY"
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Valid until
                </label>
                <input
                  type="text"
                  value={licenceValidUntil}
                  onChange={(e) => setLicenceValidUntil(e.target.value)}
                  placeholder="DD / MM / YYYY"
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                />
              </div>
            </div>

            {/* Upload licence photo tile */}
            <div className="mt-4 border-2 border-dashed border-[#DCE5D9] dark:border-[#2A3B31] rounded-2xl p-4 text-center cursor-pointer hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] transition-colors">
              <Upload size={20} className="text-[#1B7A3F] mx-auto mb-1" />
              <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                Upload licence photo (front and back)
              </div>
              <div className="text-[10px] text-[#566259] mt-0.5">
                PNG or JPG under 1 MB
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Allotment & Login Credentials (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Allotment Card */}
          <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
              Allotment
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Van
                </label>
                <select
                  value={selectedVanId}
                  onChange={(e) => setSelectedVanId(e.target.value)}
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] outline-none"
                >
                  {vans.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNo} · {v.type || 'Tata Ace'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Wards multi-select chips */}
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-2">
                  Wards (created by the Chief Officer)
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Shift start
                  </label>
                  <input
                    type="text"
                    value={shiftStart}
                    onChange={(e) => setShiftStart(e.target.value)}
                    className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    Shift end
                  </label>
                  <input
                    type="text"
                    value={shiftEnd}
                    onChange={(e) => setShiftEnd(e.target.value)}
                    className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Effective from
                </label>
                <input
                  type="text"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs text-[#14201A] dark:text-[#EAF2E6] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Login Credentials Card */}
          <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31]">
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-3">
              Login credentials
            </h3>

            <div className="p-3.5 rounded-2xl bg-[#F3FAF4] dark:bg-[#162B1D] border border-emerald-200 dark:border-emerald-900/50">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold uppercase tracking-wider">
                  Driver ID (Format: XX-0000)
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(driverId);
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2000);
                  }}
                  className="px-2 py-1 text-[#1B7A3F] dark:text-[#6DB36F] hover:bg-white dark:hover:bg-[#111A14] rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="Copy Driver ID"
                >
                  {copiedId ? (
                    <>
                      <Check size={14} />
                      <span className="text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={driverId}
                  onChange={(e) => handleDriverIdChange(e.target.value)}
                  maxLength={7}
                  placeholder="GJ-0048"
                  className="w-full bg-white dark:bg-[#111A14] border border-emerald-300 dark:border-emerald-700 rounded-xl px-3.5 py-2 text-lg font-bold font-mono tracking-widest text-[#1B7A3F] dark:text-[#6DB36F] outline-none uppercase focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {driverIdError ? (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{driverIdError}</p>
              ) : (
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
                  ✓ Valid format (2 letters + hyphen + 4 digits, e.g. GJ-0048)
                </p>
              )}
            </div>

            <p className="text-[11px] text-[#566259] dark:text-[#9DB0A2] mt-2.5">
              PIN is created when you save and shown once.
            </p>

            {/* Toggle SMS */}
            <div className="mt-4 flex items-center justify-between py-2 border-t border-[#E5EAE3] dark:border-[#2A3B31]">
              <span className="text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6]">
                Send ID and PIN by SMS
              </span>
              <button
                type="button"
                onClick={() => setSendSms(!sendSms)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  sendSms ? 'bg-[#1B7A3F]' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${sendSms ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Form Action Buttons */}
            <div className="mt-6 flex items-center justify-between gap-3 pt-3">
              <button
                type="button"
                onClick={() => onNavigateTo('drivers')}
                className="rounded-full px-5 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow transition-transform active:scale-95"
              >
                Save and issue ID
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
