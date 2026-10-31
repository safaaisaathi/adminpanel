import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint } from '../types';
import { StatusChip } from '../components/StatusChip';
import {
  Search,
  CheckCircle,
  AlertTriangle,
  Camera,
  X,
  Copy,
  Check,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export const A4_Complaints: React.FC = () => {
  const {
    t,
    scopedComplaints,
    scopedWards,
    availableStaff,
    assignComplaint,
    resolveComplaint,
  } = useApp();

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showMerged, setShowMerged] = useState<boolean>(false);

  // Detail Drawer State
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  // Full-screen Image Preview State
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Resolve Modal State
  const [showResolveModal, setShowResolveModal] = useState<boolean>(false);
  const [resolvePhotoUrl, setResolvePhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1488342994276-7c3bc0742042?auto=format&fit=crop&w=800&q=80'
  );
  const [resolveNote, setResolveNote] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return scopedComplaints.filter((c) => {
      if (!showMerged && c.mergedInto) return false;

      if (
        searchQuery &&
        !c.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.note?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (selectedWard !== 'all' && c.wardId !== selectedWard) return false;
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;

      return true;
    });
  }, [scopedComplaints, searchQuery, selectedWard, selectedCategory, selectedStatus, showMerged]);

  const handleCopyTicket = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAssign = () => {
    if (!activeComplaint || !assigneeId) return;
    assignComplaint(activeComplaint.id, assigneeId);
    setActiveComplaint({
      ...activeComplaint,
      assignedTo: assigneeId,
      status: 'assigned',
    });
    setAssigneeId('');
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint || !resolvePhotoUrl) return;
    resolveComplaint(activeComplaint.id, resolvePhotoUrl, resolveNote);
    setActiveComplaint({
      ...activeComplaint,
      status: 'resolved',
      resolvedPhotoUrl: resolvePhotoUrl,
      resolvedAt: new Date().toISOString(),
    });
    setShowResolveModal(false);
    setResolveNote('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#14201A] dark:text-[#EAF2E6]">
            {t.complaints.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#566259] dark:text-[#9DB0A2] mt-0.5">
            Active grievance list and verified resolution proof
          </p>
        </div>

        <button
          onClick={() => setShowMerged(!showMerged)}
          className={`self-start sm:self-auto flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border ${
            showMerged
              ? 'bg-[#111A14] text-white border-[#111A14] dark:bg-[#F2F7EE] dark:text-[#0E1612]'
              : 'border-[#DCE5D9] dark:border-[#2A3B31] bg-white dark:bg-[#16221B] text-[#566259] dark:text-[#9DB0A2]'
          }`}
        >
          <Layers size={13} />
          <span>{showMerged ? t.complaints.hideMerged : t.complaints.showMerged}</span>
        </button>
      </div>

      {/* Filter Controls (Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 rounded-[22px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-3 sm:p-4 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Ticket ID..."
            className="w-full rounded-full border border-[#DCE5D9] dark:border-[#2A3B31] bg-[#F3F6F2] dark:bg-[#1E2D24] pl-9 pr-3 py-1.5 text-xs text-[#14201A] dark:text-[#EAF2E6] focus:outline-none focus:ring-2 focus:ring-[#1B7A3F]"
          />
        </div>

        {/* Ward Filter */}
        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          className="rounded-full border border-[#DCE5D9] dark:border-[#2A3B31] bg-[#F3F6F2] dark:bg-[#1E2D24] px-3 py-1.5 text-xs text-[#14201A] dark:text-[#EAF2E6] focus:outline-none"
        >
          <option value="all">All Wards</option>
          {scopedWards.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-full border border-[#DCE5D9] dark:border-[#2A3B31] bg-[#F3F6F2] dark:bg-[#1E2D24] px-3 py-1.5 text-xs text-[#14201A] dark:text-[#EAF2E6] focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="garbage_dump">{t.categories.garbage_dump}</option>
          <option value="open_gutter">{t.categories.open_gutter}</option>
          <option value="missed_collection">{t.categories.missed_collection}</option>
          <option value="other">{t.categories.other}</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-full border border-[#DCE5D9] dark:border-[#2A3B31] bg-[#F3F6F2] dark:bg-[#1E2D24] px-3 py-1.5 text-xs text-[#14201A] dark:text-[#EAF2E6] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="received">{t.status.received}</option>
          <option value="assigned">{t.status.assigned}</option>
          <option value="resolved">{t.status.resolved}</option>
          <option value="escalated">{t.status.escalated}</option>
        </select>
      </div>

      {/* Responsive View: Cards on Mobile (<640px), Table on Desktop (>=640px) */}
      <div className="rounded-[22px] sm:rounded-[28px] bg-white dark:bg-[#16221B] shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31] overflow-hidden">
        {/* Mobile Card List (<640px) */}
        <div className="block sm:hidden divide-y divide-[#DCE5D9] dark:divide-[#2A3B31]">
          {filteredComplaints.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#566259] dark:text-[#9DB0A2]">
              No grievances matching current filters.
            </div>
          ) : (
            filteredComplaints.map((c) => {
              const ward = scopedWards.find((w) => w.id === c.wardId);
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveComplaint(c)}
                  className="p-3 flex items-center gap-3 active:bg-neutral-100 dark:active:bg-[#1E2D24] transition-colors"
                >
                  {/* Photo Thumbnail */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage({
                        url: c.photoUrl,
                        title: `${t.categories[c.category]} • ${c.ticketId}`,
                      });
                    }}
                    className="relative group w-14 h-14 rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31] bg-neutral-100 dark:bg-neutral-800 shrink-0 cursor-zoom-in shadow-sm"
                    title="Click to zoom photo"
                  >
                    <img
                      src={c.photoUrl}
                      alt="Grievance evidence"
                      className="w-full h-full object-cover group-active:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 size={12} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                        {c.ticketId}
                      </span>
                      {c.mergedInto && (
                        <span className="rounded bg-neutral-200 dark:bg-neutral-800 px-1 py-0.2 text-[9px] font-bold">
                          Merged
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-[#14201A] dark:text-[#EAF2E6] truncate">
                      {t.categories[c.category]}
                    </div>
                    <div className="text-[10px] text-[#566259] dark:text-[#9DB0A2] truncate">
                      {ward?.name || c.wardId} • {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusChip status={c.status} size="sm" />
                    <ChevronRight size={14} className="text-neutral-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop / Tablet Table (>=640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3F6F2] dark:bg-[#1E2D24] border-b border-[#DCE5D9] dark:border-[#2A3B31] text-[#566259] dark:text-[#9DB0A2] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-16">Photo</th>
                <th className="py-3 px-4">{t.complaints.ticketId}</th>
                <th className="py-3 px-4">{t.complaints.category}</th>
                <th className="py-3 px-4">{t.complaints.ward}</th>
                <th className="py-3 px-4">{t.complaints.reportedAt}</th>
                <th className="py-3 px-4">{t.complaints.status}</th>
                <th className="py-3 px-4">{t.complaints.escalation}</th>
                <th className="py-3 px-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5D9] dark:divide-[#2A3B31]">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-[#566259] dark:text-[#9DB0A2]">
                    No grievances matching current filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const ward = scopedWards.find((w) => w.id === c.wardId);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setActiveComplaint(c)}
                      className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#1E2D24]/50 transition-colors"
                    >
                      <td className="py-2.5 px-4">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage({
                              url: c.photoUrl,
                              title: `${t.categories[c.category]} • ${c.ticketId}`,
                            });
                          }}
                          className="relative group w-11 h-11 rounded-xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31] bg-neutral-100 dark:bg-neutral-800 shrink-0 cursor-zoom-in shadow-xs"
                          title="Click to enlarge photo"
                        >
                          <img
                            src={c.photoUrl}
                            alt="Evidence"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Maximize2 size={12} />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-[#14201A] dark:text-[#EAF2E6]">
                        <div className="flex items-center gap-1.5">
                          <span>{c.ticketId}</span>
                          {c.mergedInto && (
                            <span className="rounded bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 text-[9px] font-bold text-neutral-600 dark:text-neutral-400">
                              Merged
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-[#14201A] dark:text-[#EAF2E6]">
                        {t.categories[c.category]}
                      </td>

                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                        {ward?.name || c.wardId}
                      </td>

                      <td className="py-3 px-4 text-neutral-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4">
                        <StatusChip status={c.status} size="sm" />
                      </td>

                      <td className="py-3 px-4">
                        {c.escalationLevel === 0 ? (
                          <span className="text-neutral-400">Normal (L0)</span>
                        ) : c.escalationLevel === 1 ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[#F0873A]">
                            <AlertTriangle size={12} />
                            <span>Level 1 (CO/TDO)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-[#D93025]">
                            <AlertTriangle size={12} />
                            <span>Level 2 (DDO)</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveComplaint(c);
                          }}
                          className="rounded-full bg-[#E4F1DF] dark:bg-[#1F3A2A] px-3 py-1 font-semibold text-[#1B7A3F] dark:text-[#6DB36F] hover:bg-[#B5CF8A]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Detail Drawer (Responsive) */}
      {activeComplaint && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="h-full w-full sm:max-w-md bg-white dark:bg-[#16221B] shadow-elev3 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between border-l border-[#DCE5D9] dark:border-[#2A3B31]">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#1B7A3F] dark:text-[#6DB36F]">
                      {activeComplaint.ticketId}
                    </span>
                    <button
                      onClick={() => handleCopyTicket(activeComplaint.ticketId)}
                      className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    >
                      {copiedId === activeComplaint.ticketId ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    {t.categories[activeComplaint.category]}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveComplaint(null)}
                  className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status and Escalation Badges */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <StatusChip status={activeComplaint.status} size="sm" />
                {activeComplaint.escalationLevel > 0 && (
                  <span className="rounded-full bg-[#FDE3E0] dark:bg-[#43201C] px-2.5 py-0.5 text-xs font-bold text-[#B3261E] dark:text-[#FF9B91]">
                    Escalation Level {activeComplaint.escalationLevel}
                  </span>
                )}
              </div>

              {/* Citizen Photo Evidence */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#566259] dark:text-[#9DB0A2] mb-1.5">
                  <span>{t.complaints.proofPhoto}</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Click to enlarge</span>
                </div>
                <div
                  onClick={() =>
                    setPreviewImage({
                      url: activeComplaint.photoUrl,
                      title: `Citizen Grievance Proof • ${activeComplaint.ticketId}`,
                    })
                  }
                  className="relative group cursor-zoom-in overflow-hidden rounded-2xl border border-[#DCE5D9] dark:border-[#2A3B31] shadow-xs"
                >
                  <img
                    src={activeComplaint.photoUrl}
                    alt="Citizen Grievance Proof"
                    className="w-full h-44 rounded-2xl object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[1px]">
                    <Maximize2 size={16} />
                    <span>View Full Photo</span>
                  </div>
                </div>
              </div>

              {/* Resolution Photo (if resolved) */}
              {activeComplaint.resolvedPhotoUrl && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#1E8E5A] dark:text-[#7ED6A1] mb-1.5">
                    <span className="flex items-center gap-1">
                      <CheckCircle size={14} />
                      <span>Verified Resolution Proof</span>
                    </span>
                    <span className="text-[10px] font-normal">Click to enlarge</span>
                  </div>
                  <div
                    onClick={() =>
                      setPreviewImage({
                        url: activeComplaint.resolvedPhotoUrl!,
                        title: `Resolution Proof • ${activeComplaint.ticketId}`,
                      })
                    }
                    className="relative group cursor-zoom-in overflow-hidden rounded-2xl border border-[#1E8E5A] shadow-xs"
                  >
                    <img
                      src={activeComplaint.resolvedPhotoUrl}
                      alt="Sanitation Resolution Proof"
                      className="w-full h-44 rounded-2xl object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[1px]">
                      <Maximize2 size={16} />
                      <span>View Full Photo</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Grievance Description */}
              {activeComplaint.note && (
                <div className="mt-3 rounded-xl bg-[#F3F6F2] dark:bg-[#1E2D24] p-3 text-xs text-[#14201A] dark:text-[#EAF2E6]">
                  {activeComplaint.note}
                </div>
              )}

              {/* Timeline */}
              <div className="mt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#566259] dark:text-[#9DB0A2] mb-2">
                  {t.complaints.timeline}
                </div>
                <div className="space-y-3 pl-2 border-l-2 border-[#1B7A3F] text-xs">
                  <div className="relative pl-3">
                    <div className="absolute -left-[17px] top-1 h-2.5 w-2.5 rounded-full bg-[#1B7A3F]" />
                    <div className="font-semibold text-[#14201A] dark:text-[#EAF2E6]">
                      {t.complaints.statusTimeline.received}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {new Date(activeComplaint.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {activeComplaint.assignedTo && (
                    <div className="relative pl-3">
                      <div className="absolute -left-[17px] top-1 h-2.5 w-2.5 rounded-full bg-[#2F6FDE]" />
                      <div className="font-semibold text-[#14201A] dark:text-[#EAF2E6]">
                        {t.complaints.statusTimeline.assigned}: {availableStaff.find((s) => s.id === activeComplaint.assignedTo)?.name || activeComplaint.assignedTo}
                      </div>
                    </div>
                  )}

                  {activeComplaint.status === 'resolved' && (
                    <div className="relative pl-3">
                      <div className="absolute -left-[17px] top-1 h-2.5 w-2.5 rounded-full bg-[#1E8E5A]" />
                      <div className="font-semibold text-[#1E8E5A]">
                        {t.complaints.statusTimeline.resolved}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Assign Officer Dropdown */}
              {activeComplaint.status !== 'resolved' && (
                <div className="mt-4 rounded-xl bg-[#F3F6F2] dark:bg-[#1E2D24] p-3">
                  <label className="block text-[11px] font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                    {t.complaints.assignOfficer}
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                      className="flex-1 rounded-full border border-[#DCE5D9] dark:border-[#2A3B31] bg-white dark:bg-[#16221B] px-3 py-1.5 text-xs text-[#14201A] dark:text-[#EAF2E6]"
                    >
                      <option value="">Select Staff</option>
                      {availableStaff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssign}
                      disabled={!assigneeId}
                      className="rounded-full bg-[#111A14] dark:bg-[#F2F7EE] px-3.5 py-1.5 text-xs font-semibold text-white dark:text-[#0E1612] disabled:opacity-40"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Resolve Button */}
            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              {activeComplaint.status !== 'resolved' ? (
                <button
                  onClick={() => setShowResolveModal(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#1B7A3F] py-3 text-xs font-semibold text-white hover:bg-[#146B3A] shadow-elev1"
                >
                  <CheckCircle size={16} />
                  <span>{t.complaints.resolveComplaint}</span>
                </button>
              ) : (
                <div className="rounded-full bg-[#DDF3E4] dark:bg-[#17382A] py-2.5 text-center text-xs font-bold text-[#146B3A] dark:text-[#7ED6A1]">
                  ✓ Verified & Resolved
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mark Resolved Modal */}
      {showResolveModal && activeComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-[#16221B] p-5 shadow-elev3 border border-[#DCE5D9] dark:border-[#2A3B31]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-semibold text-sm sm:text-base text-[#14201A] dark:text-[#EAF2E6]">
                {t.complaints.resolveComplaint} ({activeComplaint.ticketId})
              </h3>
              <button onClick={() => setShowResolveModal(false)}>✕</button>
            </div>

            <form onSubmit={handleConfirmResolve} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  {t.complaints.uploadProof}
                </label>
                <input
                  type="text"
                  value={resolvePhotoUrl}
                  onChange={(e) => setResolvePhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-full border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] px-4 py-1.5 text-xs"
                  required
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setResolvePhotoUrl(
                        'https://images.unsplash.com/photo-1488342994276-7c3bc0742042?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="text-[10px] rounded-full px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-[#E4F1DF] hover:text-[#1B7A3F]"
                  >
                    Preset: Clean Road
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setResolvePhotoUrl(
                        'https://images.unsplash.com/photo-1754638068938-2ed61ca52680?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="text-[10px] rounded-full px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-[#E4F1DF] hover:text-[#1B7A3F]"
                  >
                    Preset: Swept Street
                  </button>
                </div>

                {resolvePhotoUrl && (
                  <img
                    src={resolvePhotoUrl}
                    alt="Proof Preview"
                    className="mt-2 h-28 w-full rounded-xl object-cover border border-[#1E8E5A]"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  {t.complaints.resolutionNotes}
                </label>
                <textarea
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  placeholder="Sanitation actions completed..."
                  rows={2}
                  className="w-full rounded-xl border border-[#74897A] dark:border-[#5F7A68] bg-white dark:bg-[#1E2D24] p-2.5 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="flex-1 rounded-full border border-neutral-300 dark:border-neutral-700 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#1E8E5A] py-2 text-xs font-semibold text-white hover:bg-[#146B3A]"
                >
                  Confirm & Resolve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* High-Resolution Photo Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center bg-[#111A14] rounded-3xl overflow-hidden border border-white/10 shadow-elev3"
          >
            {/* Lightbox Header */}
            <div className="w-full flex items-center justify-between px-5 py-3.5 bg-black/40 border-b border-white/10">
              <span className="text-sm font-semibold text-white truncate pr-4">
                {previewImage.title}
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Lightbox Image */}
            <div className="p-3 sm:p-4 flex items-center justify-center overflow-auto max-h-[75vh]">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
