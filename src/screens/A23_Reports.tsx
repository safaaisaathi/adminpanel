import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Download,
  Calendar,
  Check,
  Building,
  Mail,
  FileCheck
} from 'lucide-react';

export const A23_Reports: React.FC = () => {
  const { reports } = useApp();

  const [dateRange, setDateRange] = useState('1 to 28 Oct 2026');
  const [selectedArea, setSelectedArea] = useState('Godhra Nagarpalika');
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [emailScheduled, setEmailScheduled] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleGenerate = (reportName: string) => {
    setToastMessage(`Generated ${reportName} (${format.toUpperCase()})`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownload = (report: any) => {
    const blob = new Blob([`Report: ${report.name}\nRange: ${report.range}\nFormat: ${report.format}\nAuthority: Godhra Nagarpalika`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.name.replace(/\s+/g, '_')}_${report.range}.${report.format.toLowerCase()}`;
    link.click();
    URL.revokeObjectURL(url);
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

      {/* Main Grid: 4 Template Cards + Options Card (Canvas A23) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 4 Report Template Cards (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Daily Collection */}
          <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#EAF5EC] text-[#1B7A3F]">
                  <FileText size={18} />
                </span>
                <h4 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Daily collection
                </h4>
              </div>
              <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-2">
                Wards done, vans, times per ward
              </p>
            </div>
            <button
              onClick={() => handleGenerate('Daily collection')}
              className="mt-4 self-start rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] hover:bg-[#EAEFE9] px-4 py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] transition-colors"
            >
              Generate
            </button>
          </div>

          {/* Card 2: Complaint Resolution */}
          <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#EAF2FF] text-[#1B57C2]">
                  <FileCheck size={18} />
                </span>
                <h4 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Complaint resolution
                </h4>
              </div>
              <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-2">
                Counts, speed and escalations
              </p>
            </div>
            <button
              onClick={() => handleGenerate('Complaint resolution')}
              className="mt-4 self-start rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] hover:bg-[#EAEFE9] px-4 py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] transition-colors"
            >
              Generate
            </button>
          </div>

          {/* Card 3: Driver Performance */}
          <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#FFF8E6] text-[#A66800]">
                  <FileText size={18} />
                </span>
                <h4 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Driver performance
                </h4>
              </div>
              <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-2">
                On-time start, wards completed
              </p>
            </div>
            <button
              onClick={() => handleGenerate('Driver performance')}
              className="mt-4 self-start rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] hover:bg-[#EAEFE9] px-4 py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] transition-colors"
            >
              Generate
            </button>
          </div>

          {/* Card 4: Contractor Scorecard */}
          <div className="rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#EAF5EC] text-[#1B7A3F]">
                  <FileCheck size={18} />
                </span>
                <h4 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  Contractor scorecard
                </h4>
              </div>
              <p className="text-xs text-[#566259] dark:text-[#9DB0A2] mt-2">
                Performance per contractor
              </p>
            </div>
            <button
              onClick={() => handleGenerate('Contractor scorecard')}
              className="mt-4 self-start rounded-full bg-[#F3F6F2] dark:bg-[#1E2D24] hover:bg-[#EAEFE9] px-4 py-1.5 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] transition-colors"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Options Card (4 cols, Canvas A23) */}
        <div className="lg:col-span-4 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
              Options
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Date range
                </label>
                <div className="flex items-center rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5">
                  <Calendar size={15} className="text-[#566259] mr-2" />
                  <input
                    type="text"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full bg-transparent outline-none font-medium text-[#14201A] dark:text-[#EAF2E6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Area
                </label>
                <input
                  type="text"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31] px-4 py-2.5 font-medium text-[#14201A] dark:text-[#EAF2E6] outline-none"
                />
              </div>

              {/* Format Toggle: PDF / CSV */}
              <div>
                <label className="block text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] mb-1">
                  Format
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('pdf')}
                    className={`rounded-full px-4 py-1.5 font-bold transition-all ${
                      format === 'pdf'
                        ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                        : 'bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] border'
                    }`}
                  >
                    {format === 'pdf' && '✓ '}PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('csv')}
                    className={`rounded-full px-4 py-1.5 font-bold transition-all ${
                      format === 'csv'
                        ? 'bg-[#EAF2E8] text-[#1B7A3F] border border-[#1B7A3F]'
                        : 'bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] border'
                    }`}
                  >
                    {format === 'csv' && '✓ '}CSV
                  </button>
                </div>
              </div>

              {/* Email Schedule Toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-[#E5EAE3] dark:border-[#2A3B31]">
                <span className="text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6]">
                  Email every day at 07:00
                </span>
                <button
                  type="button"
                  onClick={() => setEmailScheduled(!emailScheduled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    emailScheduled ? 'bg-[#1B7A3F]' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${emailScheduled ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Table (Canvas A23) */}
      <div className="rounded-[28px] bg-white dark:bg-[#16221B] shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] overflow-hidden">
        <div className="p-5 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
          <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
            Recent reports
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF7] dark:bg-[#111A14] text-[#566259] dark:text-[#9DB0A2] border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <tr>
                <th className="py-3.5 px-6 font-bold">Report</th>
                <th className="py-3.5 px-6 font-bold">Range</th>
                <th className="py-3.5 px-6 font-bold">Format</th>
                <th className="py-3.5 px-6 font-bold">Created by</th>
                <th className="py-3.5 px-6 font-bold text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE3] dark:divide-[#2A3B31]">
              {reports.map((rep: any) => (
                <tr key={rep.id} className="hover:bg-[#F8FAF7] dark:hover:bg-[#111A14] transition-colors">
                  <td className="py-4 px-6 font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    {rep.name}
                  </td>
                  <td className="py-4 px-6 text-[#566259] font-medium">
                    {rep.range}
                  </td>
                  <td className="py-4 px-6 font-bold font-mono">
                    {rep.format}
                  </td>
                  <td className="py-4 px-6 font-medium text-[#14201A] dark:text-[#EAF2E6]">
                    {rep.createdBy}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDownload(rep)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B7A3F] hover:underline"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
