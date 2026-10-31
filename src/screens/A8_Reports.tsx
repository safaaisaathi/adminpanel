import React from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { GODHRA_CENTER } from '../constants';
import { Download, FileSpreadsheet, Flame } from 'lucide-react';

export const A8_Reports: React.FC = () => {
  const { t, complaints, trips, theme } = useApp();

  const handleExportComplaints = () => {
    const headers = ['Ticket ID', 'Category', 'Ward ID', 'Status', 'Escalation Level', 'Reported At', 'Resolved At', 'Citizen Note'];
    const rows = complaints.map((c) => [
      c.ticketId,
      c.category,
      c.wardId,
      c.status,
      c.escalationLevel,
      c.createdAt,
      c.resolvedAt || '',
      `"${(c.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Safai_Sathi_Complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportTrips = () => {
    const headers = ['Trip ID', 'Van ID', 'Route ID', 'Date', 'Started At', 'Wards Cleared Count', 'GPS Trail Count'];
    const rows = trips.map((t) => [
      t.id,
      t.vanId,
      t.routeId,
      t.date,
      t.startedAt,
      t.wardsDone.length,
      t.gpsTrail.length,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Safai_Sathi_Trips_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#14201A] dark:text-[#EAF2E6]">
            {t.reportsPage.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#566259] dark:text-[#9DB0A2] mt-0.5">
            Geographic hotspot analysis and data exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportComplaints}
            className="flex items-center gap-1.5 rounded-full bg-[#111A14] dark:bg-[#F2F7EE] px-3.5 py-2 text-xs font-semibold text-white dark:text-[#0E1612] hover:opacity-90"
          >
            <Download size={13} />
            <span>Complaints CSV</span>
          </button>
          <button
            onClick={handleExportTrips}
            className="flex items-center gap-1.5 rounded-full border border-[#DCE5D9] dark:border-[#2A3B31] bg-white dark:bg-[#16221B] px-3.5 py-2 text-xs font-semibold text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <FileSpreadsheet size={13} />
            <span>Trips CSV</span>
          </button>
        </div>
      </div>

      <div className="rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#16221B] p-4 sm:p-6 shadow-elev1 dark:shadow-elev1-dark border border-[#DCE5D9] dark:border-[#2A3B31]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-[#F0873A]" />
            <h2 className="text-sm sm:text-base font-bold text-[#14201A] dark:text-[#EAF2E6]">
              {t.reportsPage.heatmapTitle}
            </h2>
          </div>
          <span className="rounded-full bg-[#FFEBD9] dark:bg-[#3A2414] px-2.5 py-0.5 text-[11px] font-bold text-[#B34A0B] dark:text-[#F5A15F]">
            {complaints.length} Hotspots
          </span>
        </div>

        <div className="h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31] relative">
          <MapContainer
            center={[GODHRA_CENTER.lat, GODHRA_CENTER.lng]}
            zoom={14}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={
                theme === 'dark'
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              }
            />

            {complaints.map((c) => {
              const isGarbage = c.category === 'garbage_dump';
              const radius = isGarbage ? 32 : 20;
              const color = isGarbage ? '#D93025' : '#F0873A';

              return (
                <CircleMarker
                  key={c.id}
                  center={[c.location.lat, c.location.lng]}
                  radius={radius}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.35,
                    weight: 1.5,
                  }}
                >
                  <Popup>
                    <div className="text-xs">
                      <div className="font-bold text-[#14201A]">{c.ticketId}</div>
                      <div>Category: {t.categories[c.category]}</div>
                      <div>Status: {c.status}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
