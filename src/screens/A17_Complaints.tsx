import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus } from '../types';
import {
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  X,
  Upload,
  Camera,
  MapPin,
  Check,
  ChevronRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';

interface A17ComplaintsProps {
  initialComplaint?: Complaint;
}

export const A17_Complaints: React.FC<A17ComplaintsProps> = ({ initialComplaint }) => {
  const { complaints, assignComplaint, resolveComplaint, escalateComplaint, availableStaff, lang } = useApp();
  const isGu = lang === 'gu';

  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'escalated' | 'resolved'>('all');
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState<'7d' | '30d' | 'all'>('30d');

  // Selected complaint for A18 drawer
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    initialComplaint || complaints[0] || null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(!!initialComplaint);

  // Drawer Form state
  const [assignedStaffId, setAssignedStaffId] = useState(selectedComplaint?.assignedTo || '');
  const [proofPhotoUrl, setProofPhotoUrl] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inspectors = availableStaff.filter((s) => s.role === 'inspector');

  // Real date range filtering (7d, 30d, all)
  const now = Date.now();
  const dateFiltered = complaints.filter((c) => {
    const createdTime = new Date(c.createdAt).getTime();
    const diffMs = now - createdTime;

    if (selectedDateRange === '7d') {
      return diffMs <= 7 * 24 * 60 * 60 * 1000;
    }
    if (selectedDateRange === '30d') {
      return diffMs <= 30 * 24 * 60 * 60 * 1000;
    }
    return true; // 'all'
  });

  // Ward filtering
  const wardFiltered = dateFiltered.filter((c) => {
    if (selectedWard !== 'all') return c.wardId === selectedWard;
    return true;
  });

  // Dynamic counts for status chips
  const countAll = wardFiltered.length;
  const countOpen = wardFiltered.filter((c) => c.status === 'received' || c.status === 'assigned').length;
  const countEscalated = wardFiltered.filter((c) => c.status === 'escalated').length;
  const countResolved = wardFiltered.filter((c) => c.status === 'resolved').length;

  // Status filtering
  const filteredComplaints = wardFiltered.filter((c) => {
    if (activeFilter === 'open') return c.status === 'received' || c.status === 'assigned';
    if (activeFilter === 'escalated') return c.status === 'escalated';
    if (activeFilter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const getAgeText = (createdAt: string) => {
    const diffMs = now - new Date(createdAt).getTime();
    const diffMin = Math.max(1, Math.round(diffMs / (60 * 1000)));
    const diffHours = Math.round(diffMs / (60 * 60 * 1000));
    const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

    if (isGu) {
      if (diffMin < 60) return `${diffMin} મિ. પહેલાં`;
      if (diffHours < 24) return `${diffHours} કલાક પહેલાં`;
      return `${diffDays} દિવસ પહેલાં`;
    }

    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHours < 24) return `${diffHours} h ago`;
    return `${diffDays} d ago`;
  };

  const getCategoryLabel = (cat: string) => {
    if (!isGu) return cat.replace('_', ' ');
    const map: Record<string, string> = {
      garbage_dump: 'કચરાનો ઢગલો',
      open_gutter: 'ખુલ્લી ગટર',
      missed_collection: 'કચરો ન લેવાયો',
      other: 'અન્ય પ્રશ્ન'
    };
    return map[cat] || cat;
  };

  const handleOpenComplaint = (c: Complaint) => {
    setSelectedComplaint(c);
    setAssignedStaffId(c.assignedTo || '');
    setProofPhotoUrl(c.resolvedPhotoUrl || '');
    setIsDrawerOpen(true);
  };

  const handleAssign = (staffId: string) => {
    if (!selectedComplaint) return;
    setAssignedStaffId(staffId);
    assignComplaint(selectedComplaint.id, staffId);
    setToastMessage(isGu ? 'ફરિયાદ ઇન્સ્પેક્ટરને સોંપાઈ' : 'Complaint assigned to inspector');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolve = () => {
    if (!selectedComplaint) return;
    if (!proofPhotoUrl) {
      alert(isGu ? 'નિવારણ માર્ક કરવા ફોટો પુરાવો જરૂરી છે' : 'Proof photo is required to mark a complaint resolved');
      return;
    }
    resolveComplaint(selectedComplaint.id, proofPhotoUrl, 'Action taken by sanitation crew');
    setIsDrawerOpen(false);
    setToastMessage(isGu ? 'ફરિયાદ સફળતાપૂર્વક ઉકેલાઈ ગઈ' : 'Complaint marked as resolved');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEscalate = () => {
    if (!selectedComplaint) return;
    const reason = prompt(
      isGu ? 'એસ્કેલેશનનું કારણ દાખલ કરો:' : 'Enter escalation reason:',
      isGu ? 'SLA સમયમર્યાદામાં કોઈ કાર્યવાહી ન થઈ' : 'No action taken within SLA threshold'
    );
    if (reason) {
      escalateComplaint(selectedComplaint.id, reason);
      setToastMessage(isGu ? 'ફરિયાદ આગલા અધિકારી સ્તરે મોકલાઈ' : 'Complaint escalated to next authority');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Ticket,Category,Ward,Status,Created At,Assigned To']
        .concat(
          filteredComplaints.map(
            (c) =>
              `${c.ticketId},${c.category},${c.wardId},${c.status},${c.createdAt},${c.assignedToName || 'Unassigned'}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Safai_Sathi_Complaints_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#111A14] text-white px-5 py-3 shadow-2xl flex items-center gap-2 text-xs font-bold animate-slide-up border border-emerald-500/30">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Chips & Search Bar Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#16221B] p-4 rounded-2xl border border-[#E5EAE3] dark:border-[#2A3B31]">
        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-neutral-50 dark:bg-[#111A14] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'all' && '✓ '}
            {isGu ? `બધા (${countAll})` : `All (${countAll})`}
          </button>
          <button
            onClick={() => setActiveFilter('open')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'open'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-neutral-50 dark:bg-[#111A14] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'open' && '✓ '}
            {isGu ? `બાકી (${countOpen})` : `Open (${countOpen})`}
          </button>
          <button
            onClick={() => setActiveFilter('escalated')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'escalated'
                ? 'bg-red-50 text-red-700 border border-red-300 dark:bg-red-950/40 dark:text-red-400'
                : 'bg-neutral-50 dark:bg-[#111A14] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'escalated' && '✓ '}
            {isGu ? `એસ્કેલેટેડ (${countEscalated})` : `Escalated (${countEscalated})`}
          </button>
          <button
            onClick={() => setActiveFilter('resolved')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'resolved'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-neutral-50 dark:bg-[#111A14] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'resolved' && '✓ '}
            {isGu ? `ઉકેલાયેલ (${countResolved})` : `Resolved (${countResolved})`}
          </button>
        </div>

        {/* Ward / Date dropdowns + Export CSV */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Ward Selector */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="rounded-full bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-2 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] outline-none"
          >
            <option value="all">{isGu ? 'તમામ વોર્ડ' : 'All wards'}</option>
            <option value="ward_4">{isGu ? 'વોર્ડ ૪' : 'Ward 4'}</option>
            <option value="ward_5">{isGu ? 'વોર્ડ ૫' : 'Ward 5'}</option>
            <option value="ward_6">{isGu ? 'વોર્ડ ૬' : 'Ward 6'}</option>
            <option value="ward_7">{isGu ? 'વોર્ડ ૭' : 'Ward 7'}</option>
          </select>

          {/* Date Range Selector: 7 Days vs 30 Days vs All time */}
          <div className="flex items-center rounded-full bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] p-0.5 text-xs font-bold">
            <button
              onClick={() => setSelectedDateRange('7d')}
              className={`rounded-full px-3 py-1.5 transition-all ${
                selectedDateRange === '7d'
                  ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612] shadow-xs'
                  : 'text-[#566259] hover:text-[#14201A] dark:text-[#9DB0A2]'
              }`}
            >
              {isGu ? '૭ દિવસ' : 'Last 7 days'}
            </button>
            <button
              onClick={() => setSelectedDateRange('30d')}
              className={`rounded-full px-3 py-1.5 transition-all ${
                selectedDateRange === '30d'
                  ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612] shadow-xs'
                  : 'text-[#566259] hover:text-[#14201A] dark:text-[#9DB0A2]'
              }`}
            >
              {isGu ? '૩૦ દિવસ' : 'Last 30 days'}
            </button>
            <button
              onClick={() => setSelectedDateRange('all')}
              className={`rounded-full px-3 py-1.5 transition-all ${
                selectedDateRange === 'all'
                  ? 'bg-[#111A14] text-white dark:bg-[#F2F7EE] dark:text-[#0E1612] shadow-xs'
                  : 'text-[#566259] hover:text-[#14201A] dark:text-[#9DB0A2]'
              }`}
            >
              {isGu ? 'સમગ્ર' : 'All time'}
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#16221B] px-4 py-2 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50 shadow-xs"
          >
            <Download size={14} />
            <span>{isGu ? 'CSV ડાઉનલોડ' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Complaints Table (Showing Full 30-Day Records) */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] dark:text-[#9DB0A2] border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <tr>
                <th className="py-3.5 px-6 font-bold">{isGu ? 'ટિકિટ આઈડી' : 'Ticket'}</th>
                <th className="py-3.5 px-4 font-bold">{isGu ? 'ફોટો' : 'Photo'}</th>
                <th className="py-3.5 px-6 font-bold">{isGu ? 'શ્રેણી / પ્રકાર' : 'Category'}</th>
                <th className="py-3.5 px-6 font-bold">{isGu ? 'વોર્ડ' : 'Ward'}</th>
                <th className="py-3.5 px-6 font-bold">{isGu ? 'સ્થિતિ' : 'Status'}</th>
                <th className="py-3.5 px-6 font-bold">{isGu ? 'સમયાવધિ (Age)' : 'Age'}</th>
                <th className="py-3.5 px-6 font-bold">{isGu ? 'સોંપાયેલ અધિકારી' : 'Assigned to'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE3] dark:divide-[#2A3B31]">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#566259] dark:text-[#9DB0A2]">
                    {isGu ? 'આ સમયગાળામાં કોઈ ફરિયાદ મળી નથી.' : 'No complaints found for this selection.'}
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const isEscalated = c.status === 'escalated';
                  const isResolved = c.status === 'resolved';
                  const isAssigned = c.status === 'assigned';
                  const isReceived = c.status === 'received';
                  const ageText = getAgeText(c.createdAt);
                  const isAgePastSla = isEscalated;

                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleOpenComplaint(c)}
                      className="hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] cursor-pointer transition-colors"
                    >
                      {/* Ticket */}
                      <td className="py-4 px-6 font-mono font-bold text-[#14201A] dark:text-[#EAF2E6]">
                        {c.ticketId}
                      </td>

                      {/* Photo thumbnail */}
                      <td className="py-4 px-4">
                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                          <img src={c.photoUrl} alt="" className="h-full w-full object-cover" />
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 font-bold text-[#14201A] dark:text-[#EAF2E6]">
                        {getCategoryLabel(c.category)}
                      </td>

                      {/* Ward */}
                      <td className="py-4 px-6 font-medium text-[#566259] dark:text-[#9DB0A2]">
                        {isGu ? c.wardId.replace('ward_', 'વોર્ડ ') : c.wardId.replace('ward_', 'Ward ')}
                      </td>

                      {/* Status Pill */}
                      <td className="py-4 px-6">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isEscalated
                              ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                              : isResolved
                              ? 'bg-[#EAF5EC] text-[#1B7A3F]'
                              : isAssigned
                              ? 'bg-[#EAF2FF] text-[#1B57C2]'
                              : 'bg-[#FFF8E6] text-[#A66800]'
                          }`}
                        >
                          {isEscalated
                            ? isGu ? `! એસ્કેલેટેડ L${c.escalationLevel}` : `! Escalated L${c.escalationLevel}`
                            : isResolved
                            ? isGu ? '✓ ઉકેલાયેલ' : '✓ Resolved'
                            : isAssigned
                            ? isGu ? 'સોંપાયેલ' : 'Assigned'
                            : isGu ? '! પ્રાપ્ત થયેલ' : '! Received'}
                        </span>
                      </td>

                      {/* Age */}
                      <td className={`py-4 px-6 font-bold ${isAgePastSla ? 'text-red-600' : 'text-[#566259] dark:text-[#9DB0A2]'}`}>
                        {ageText}
                      </td>

                      {/* Assigned to */}
                      <td className="py-4 px-6">
                        {c.assignedToName ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-[#E5EAE3] text-[10px] font-bold flex items-center justify-center">
                              {c.assignedToName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{c.assignedToName}</div>
                              <div className="text-[10px] text-[#566259]">{isGu ? 'ઇન્સ્પેક્ટર' : 'Inspector'}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="rounded-full bg-[#FFF8E6] text-[#A66800] px-2.5 py-0.5 text-[11px] font-bold">
                            {isGu ? '! બિનસોંપાયેલ' : '! Not assigned'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Details Drawer */}
      {isDrawerOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-xl bg-white dark:bg-[#16221B] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto z-10 animate-slide-left">
            <div>
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold font-mono text-[#14201A] dark:text-[#EAF2E6]">
                      {selectedComplaint.ticketId}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        selectedComplaint.status === 'escalated'
                          ? 'bg-red-50 text-red-700'
                          : selectedComplaint.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1">
                    {isGu ? 'વોર્ડ: ' : 'Ward: '} {selectedComplaint.wardId} · {getAgeText(selectedComplaint.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Photos Comparison (Citizen Report vs Resolved Proof) */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] font-bold text-[#566259] dark:text-[#9DB0A2] mb-1.5">
                    {isGu ? 'નાગરિક ફોટો પુરાવો' : 'Citizen Photo Proof'}
                  </div>
                  <div className="h-40 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                    <img src={selectedComplaint.photoUrl} alt="Reported" className="h-full w-full object-cover" />
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-[#566259] dark:text-[#9DB0A2] mb-1.5">
                    {isGu ? 'નિવારણ ફોટો પુરાવો' : 'Resolution Proof'}
                  </div>
                  {selectedComplaint.resolvedPhotoUrl ? (
                    <div className="h-40 rounded-2xl overflow-hidden bg-neutral-100 border border-emerald-300">
                      <img src={selectedComplaint.resolvedPhotoUrl} alt="Resolved" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-40 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center p-3 text-center">
                      <Camera size={24} className="text-neutral-400 mb-1" />
                      <span className="text-[11px] text-neutral-500">
                        {isGu ? 'હજી સુધી ઉકેલાયેલ ફોટો અપલોડ થયો નથી' : 'No resolved proof uploaded yet'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Assign Inspector Control */}
              <div className="mt-6 p-4 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31]">
                <label className="block text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] mb-2">
                  {isGu ? 'વોર્ડ ઇન્સ્પેક્ટર સોંપો' : 'Assign Ward Inspector'}
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={assignedStaffId}
                    onChange={(e) => handleAssign(e.target.value)}
                    className="flex-1 rounded-xl bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] px-3.5 py-2 text-xs font-medium outline-none"
                  >
                    <option value="">{isGu ? 'ઇન્સ્પેક્ટર પસંદ કરો...' : 'Select inspector...'}</option>
                    {inspectors.map((insp) => (
                      <option key={insp.id} value={insp.id}>
                        {insp.name} ({insp.phone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Proof & Resolve Section */}
              {selectedComplaint.status !== 'resolved' && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                  <label className="block text-xs font-bold text-[#1B7A3F] dark:text-[#6DB36F] mb-1.5">
                    {isGu ? 'નિવારણ ફોટો URL (સફાઈ પુરાવો)' : 'Resolution Proof Photo URL'}
                  </label>
                  <input
                    type="text"
                    value={proofPhotoUrl}
                    onChange={(e) => setProofPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl bg-white dark:bg-[#16221B] border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 text-xs outline-none"
                  />
                  <button
                    onClick={() => setProofPhotoUrl('https://images.unsplash.com/photo-1518770660439-4636190af475?w=600')}
                    className="mt-1.5 text-[10px] text-[#1B7A3F] hover:underline font-bold"
                  >
                    {isGu ? '+ નમૂના ફોટો પુરાવો ભરો' : '+ Fill Sample Clean Photo'}
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#E5EAE3] dark:border-[#2A3B31] flex items-center justify-between gap-3">
              {selectedComplaint.status !== 'resolved' && (
                <button
                  onClick={handleEscalate}
                  className="rounded-full px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 transition-colors"
                >
                  <ShieldAlert size={15} />
                  <span>{isGu ? 'ઉચ્ચ સ્તરે મોકલો (Escalate)' : 'Escalate Complaint'}</span>
                </button>
              )}

              {selectedComplaint.status !== 'resolved' ? (
                <button
                  onClick={handleResolve}
                  className="rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-2.5 text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>{isGu ? 'નિવારણ પૂર્ણ માર્ક કરો' : 'Mark as Resolved'}</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>{isGu ? 'આ ફરિયાદ ઉકેલાઈ ગયેલ છે' : 'Complaint is already resolved'}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
