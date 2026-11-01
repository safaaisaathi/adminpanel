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
  ShieldAlert
} from 'lucide-react';

interface A17ComplaintsProps {
  initialComplaint?: Complaint;
}

export const A17_Complaints: React.FC<A17ComplaintsProps> = ({ initialComplaint }) => {
  const { complaints, assignComplaint, resolveComplaint, escalateComplaint, availableStaff } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'escalated' | 'resolved'>('all');
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('7d');

  // Selected complaint for A18 drawer
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    initialComplaint || complaints[3] || complaints[0] || null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(!!initialComplaint);

  // Drawer Form state
  const [assignedStaffId, setAssignedStaffId] = useState(selectedComplaint?.assignedTo || '');
  const [proofPhotoUrl, setProofPhotoUrl] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inspectors = availableStaff.filter(s => s.role === 'inspector');

  const filteredComplaints = complaints.filter((c) => {
    if (activeFilter === 'open') return c.status === 'received' || c.status === 'assigned';
    if (activeFilter === 'escalated') return c.status === 'escalated';
    if (activeFilter === 'resolved') return c.status === 'resolved';
    return true;
  }).filter((c) => {
    if (selectedWard !== 'all') return c.wardId === selectedWard;
    return true;
  });

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
    setToastMessage('Complaint assigned to inspector');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolve = () => {
    if (!selectedComplaint) return;
    if (!proofPhotoUrl) {
      alert('Proof photo is required to mark a complaint resolved');
      return;
    }
    resolveComplaint(selectedComplaint.id, proofPhotoUrl, 'Action taken by sanitation crew');
    setIsDrawerOpen(false);
    setToastMessage('Complaint marked as resolved');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEscalate = () => {
    if (!selectedComplaint) return;
    const reason = prompt('Enter escalation reason:', 'No action taken within SLA threshold');
    if (reason) {
      escalateComplaint(selectedComplaint.id, reason);
      setToastMessage('Complaint escalated to next authority');
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
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#111A14] text-white px-5 py-3 shadow-2xl flex items-center gap-2 text-xs font-bold animate-slide-up">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Chips & Search Bar Row (Canvas A17) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'all' && '✓ '}All 214
          </button>
          <button
            onClick={() => setActiveFilter('open')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'open'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'open' && '✓ '}Open 148
          </button>
          <button
            onClick={() => setActiveFilter('escalated')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'escalated'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'escalated' && '✓ '}Escalated 31
          </button>
          <button
            onClick={() => setActiveFilter('resolved')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === 'resolved'
                ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                : 'bg-white dark:bg-[#16221B] text-[#566259] border border-[#E5EAE3] dark:border-[#2A3B31]'
            }`}
          >
            {activeFilter === 'resolved' && '✓ '}Resolved 35
          </button>
        </div>

        {/* Ward / Date dropdowns + Export CSV */}
        <div className="flex items-center gap-3">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="rounded-full bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] outline-none"
          >
            <option value="all">All wards</option>
            <option value="ward_4">Ward 4</option>
            <option value="ward_5">Ward 5</option>
            <option value="ward_6">Ward 6</option>
            <option value="ward_7">Ward 7</option>
          </select>

          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="rounded-full bg-white dark:bg-[#16221B] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#16221B] px-4 py-2 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-50"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Complaints Table (Canvas A17) */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] dark:text-[#9DB0A2] border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <tr>
                <th className="py-3.5 px-6 font-bold">Ticket</th>
                <th className="py-3.5 px-4 font-bold">Photo</th>
                <th className="py-3.5 px-6 font-bold">Category</th>
                <th className="py-3.5 px-6 font-bold">Ward</th>
                <th className="py-3.5 px-6 font-bold">Status</th>
                <th className="py-3.5 px-6 font-bold">Age</th>
                <th className="py-3.5 px-6 font-bold">Assigned to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE3] dark:divide-[#2A3B31]">
              {filteredComplaints.map((c) => {
                const isEscalated = c.status === 'escalated';
                const isResolved = c.status === 'resolved';
                const isAssigned = c.status === 'assigned';
                const isReceived = c.status === 'received';

                // Age calculation mock
                const ageText = isEscalated ? '27 h' : isResolved ? '1 day' : isReceived ? '12 min' : '2 h';
                const isAgePastSla = isEscalated; // Red text after SLA target time!

                return (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenComplaint(c)}
                    className="hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] cursor-pointer transition-colors"
                  >
                    {/* Ticket */}
                    <td className="py-4 px-6 font-mono font-bold text-[#14201A] dark:text-[#EAF2E6]">
                      {c.ticketId.slice(0, 7)}...{c.ticketId.slice(-4)}
                    </td>

                    {/* Photo thumbnail */}
                    <td className="py-4 px-4">
                      <div className="h-10 w-10 rounded-xl overflow-hidden bg-neutral-100 border">
                        <img src={c.photoUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 font-bold text-[#14201A] dark:text-[#EAF2E6] capitalize">
                      {c.category.replace('_', ' ')}
                    </td>

                    {/* Ward */}
                    <td className="py-4 px-6 font-medium text-[#566259] dark:text-[#9DB0A2]">
                      {c.wardId.replace('ward_', 'Ward ')}
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
                        {isEscalated ? `! Escalated L${c.escalationLevel}` : isResolved ? '✓ Resolved' : isAssigned ? 'Assigned' : '! Received'}
                      </span>
                    </td>

                    {/* Age (red if past SLA threshold) */}
                    <td className={`py-4 px-6 font-bold ${isAgePastSla ? 'text-red-600' : 'text-[#566259]'}`}>
                      {ageText}
                    </td>

                    {/* Assigned to */}
                    <td className="py-4 px-6">
                      {c.assignedToName ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-[#E5EAE3] text-[10px] font-bold flex items-center justify-center">
                            MP
                          </div>
                          <div>
                            <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">{c.assignedToName}</div>
                            <div className="text-[10px] text-[#566259]">Inspector</div>
                          </div>
                        </div>
                      ) : (
                        <span className="rounded-full bg-[#FFF8E6] text-[#A66800] px-2.5 py-0.5 text-[11px] font-bold">
                          ! Not assigned
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Details Drawer (Canvas A18 `ComplaintDetail`, 560px) */}
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
                          ? 'bg-[#EAF5EC] text-[#1B7A3F]'
                          : 'bg-[#FFF8E6] text-[#A66800]'
                      }`}
                    >
                      {selectedComplaint.status === 'escalated'
                        ? `! Escalated L${selectedComplaint.escalationLevel}`
                        : selectedComplaint.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-1 capitalize font-medium">
                    {selectedComplaint.category.replace('_', ' ')} · {selectedComplaint.wardId.replace('ward_', 'Ward ')} · 27 h ago
                  </p>
                  <p className="text-[11px] text-[#566259] mt-0.5">
                    Reported by a citizen (device {selectedComplaint.citizenDeviceId || '4F2A'}) at 25.6 N, 73.6 E
                  </p>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Photo of complaint */}
              <div className="my-5 rounded-2xl overflow-hidden border border-[#E5EAE3] dark:border-[#2A3B31] h-52 w-full bg-neutral-100">
                <img
                  src={selectedComplaint.photoUrl}
                  alt="Complaint Before"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Mini Map with Pin */}
              <div className="relative h-28 w-full rounded-2xl bg-[#EBF3EB] dark:bg-[#111A14] overflow-hidden border border-[#E5EAE3] dark:border-[#2A3B31] flex items-center justify-center mb-5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1B7A3F]">
                  <MapPin size={18} className="text-[#D93025]" />
                  <span>Godhra Nagarpalika · 22.778 N, 73.618 E</span>
                </div>
              </div>

              {/* Timeline (Canvas A18: Received -> Assigned -> Escalated -> Resolved) */}
              <div className="space-y-4 my-6 text-xs">
                <div className="font-bold text-[#14201A] dark:text-[#EAF2E6] mb-2">
                  Timeline
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-[#1B7A3F] flex items-center justify-center shrink-0">
                    <Check size={14} />
                  </div>
                  <div>
                    <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">Received</div>
                    <div className="text-[11px] text-[#566259]">Yesterday 08:12</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-[#1B7A3F] flex items-center justify-center shrink-0">
                    <Check size={14} />
                  </div>
                  <div>
                    <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">
                      Assigned to {selectedComplaint.assignedToName || 'Mahesh Rana'}
                    </div>
                    <div className="text-[11px] text-[#566259]">Yesterday 09:30</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <AlertCircle size={14} />
                  </div>
                  <div>
                    <div className="font-bold text-red-600">
                      Escalated to Chief Officer
                    </div>
                    <div className="text-[11px] text-[#566259]">Today 09:30, no action in 24 h</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-60">
                  <div className="h-6 w-6 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-[#566259]">
                    <Clock size={14} />
                  </div>
                  <div>
                    <div className="font-bold text-[#14201A] dark:text-[#EAF2E6]">Resolved</div>
                    <div className="text-[11px] text-[#566259]">Waiting for resolution proof</div>
                  </div>
                </div>
              </div>

              {/* Assign to Dropdown */}
              <div className="my-4">
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Assign to
                </label>
                <select
                  value={assignedStaffId}
                  onChange={(e) => handleAssign(e.target.value)}
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] outline-none"
                >
                  <option value="">Select Inspector...</option>
                  {inspectors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Inspector)
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Proof Photo to Resolve Tile */}
              <div
                onClick={() => {
                  const url = prompt(
                    'Enter Resolved photo URL or camera snap:',
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
                  );
                  if (url) setProofPhotoUrl(url);
                }}
                className="border-2 border-dashed border-[#DCE5D9] dark:border-[#2A3B31] rounded-2xl p-4 text-center cursor-pointer hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] transition-colors"
              >
                {proofPhotoUrl ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700">
                    <CheckCircle2 size={16} />
                    <span>Proof photo uploaded</span>
                  </div>
                ) : (
                  <>
                    <Camera size={20} className="text-[#1B7A3F] mx-auto mb-1" />
                    <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
                      Upload proof photo to resolve
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Actions: Mark resolved & Escalate (Canvas A18) */}
            <div className="pt-6 border-t border-[#E5EAE3] dark:border-[#2A3B31] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResolve}
                disabled={!proofPhotoUrl}
                className="flex-1 rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] py-3 text-xs font-bold shadow flex items-center justify-center gap-2 disabled:opacity-40 transition-transform active:scale-95"
              >
                <Check size={15} />
                <span>Mark resolved</span>
              </button>

              <button
                type="button"
                onClick={handleEscalate}
                className="rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#16221B] hover:bg-neutral-50 px-6 py-3 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]"
              >
                Escalate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
