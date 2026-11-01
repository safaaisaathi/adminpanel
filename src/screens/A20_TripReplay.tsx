import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../components/Sidebar';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  AlertTriangle,
  ArrowLeft,
  Clock,
  MapPin,
  Check,
  ZoomIn,
  ZoomOut,
  Navigation
} from 'lucide-react';
import L from 'leaflet';

interface A20TripReplayProps {
  onNavigateTo: (screen: ScreenId, param?: any) => void;
}

export const A20_TripReplay: React.FC<A20TripReplayProps> = ({ onNavigateTo }) => {
  const { trips } = useApp();
  const trip = trips[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [speed, setSpeed] = useState<1 | 4>(1);

  const trail = trip?.gpsTrail || [];
  const maxSteps = Math.max(1, trail.length - 1);

  // Map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);

  // Playback animation effect
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setSliderIndex((prev) => {
          if (prev >= maxSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, maxSteps]);

  const currentPoint = trail[sliderIndex] || trail[0];

  // Initialize Real Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter = currentPoint ? [currentPoint.lat, currentPoint.lng] : [22.7758, 73.6149];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter as L.LatLngExpression,
      zoom: 14,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Draw Complete GPS Trail Polyline
    if (trail.length > 1) {
      const latlngs = trail.map((p) => [p.lat, p.lng] as [number, number]);
      const pathLine = L.polyline(latlngs, {
        color: '#1B7A3F',
        weight: 4,
        opacity: 0.85,
        dashArray: '4 6'
      }).addTo(map);

      // Fit bounds to trail
      map.fitBounds(pathLine.getBounds(), { padding: [40, 40] });
    }

    // Render Stops and Flagged Points
    trail.forEach((pt) => {
      if (pt.isStop) {
        const stopIcon = L.divIcon({
          className: 'stop-point-marker',
          html: `<div style="
            width: 14px;
            height: 14px;
            background: #E8A317;
            border: 2.5px solid #FFF;
            border-radius: 9999px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            transform: translate(-50%, -50%);
          "></div>`,
          iconSize: [0, 0]
        });

        const stopMarker = L.marker([pt.lat, pt.lng], { icon: stopIcon }).addTo(map);
        stopMarker.bindTooltip(`<b>Stop at ${pt.t}</b><br/>Duration: ${pt.stopDurationMin} min`, {
          direction: 'top'
        });
      }

      if (pt.isFlagged) {
        const flagIcon = L.divIcon({
          className: 'flagged-point-marker',
          html: `<div style="
            width: 18px;
            height: 18px;
            background: #D93025;
            border: 2.5px solid #FFF;
            border-radius: 9999px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFF;
            font-size: 10px;
            font-weight: 800;
          ">!</div>`,
          iconSize: [0, 0]
        });

        const flagMarker = L.marker([pt.lat, pt.lng], { icon: flagIcon }).addTo(map);
        flagMarker.bindTooltip(`<b>Alert (${pt.t})</b>: ${pt.flagReason}`, {
          direction: 'top',
          permanent: true,
          className: 'text-xs text-red-700 font-bold bg-white px-2 py-1 rounded shadow-md'
        });
      }
    });

    // Vehicle marker
    const vehicleIcon = L.divIcon({
      className: 'replay-vehicle-marker',
      html: `<div style="
        width: 36px;
        height: 36px;
        background: #111A14;
        border: 2.5px solid #22C55E;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        transform: translate(-50%, -50%);
      ">🛺</div>`,
      iconSize: [0, 0]
    });

    const initPos = trail[0] ? [trail[0].lat, trail[0].lng] : [22.7758, 73.6149];
    const marker = L.marker(initPos as L.LatLngExpression, { icon: vehicleIcon }).addTo(map);
    vehicleMarkerRef.current = marker;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update animated vehicle marker position when timeline scrubs
  useEffect(() => {
    if (vehicleMarkerRef.current && currentPoint) {
      vehicleMarkerRef.current.setLatLng([currentPoint.lat, currentPoint.lng]);
    }
  }, [sliderIndex, currentPoint]);

  const handleExportTrail = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Time,Latitude,Longitude,IsStop,IsFlagged,Note']
        .concat(
          trail.map(
            (p) =>
              `${p.t},${p.lat},${p.lng},${p.isStop ? 'Yes' : 'No'},${p.isFlagged ? 'Yes' : 'No'},${p.flagReason || ''}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Trip_Trail_Ramesh_Bhai_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16 relative">
      {/* Back button */}
      <button
        onClick={() => onNavigateTo('attendance')}
        className="flex items-center gap-1.5 text-xs font-bold text-[#566259] hover:text-[#14201A] dark:hover:text-white"
      >
        <ArrowLeft size={15} />
        <span>Back to Attendance</span>
      </button>

      {/* Main Grid: Left Map Replay with Floating Player, Right Trip Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Map Card with Floating Controls */}
        <div className="lg:col-span-8 rounded-[28px] bg-white dark:bg-[#16221B] p-5 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
            <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] flex items-center gap-2">
              <MapPin size={15} className="text-[#1B7A3F]" />
              <span>Real GPS Route Trace: 07:30 to 12:42 · Godhra Nagarpalika</span>
            </div>
            <span className="text-xs font-bold text-[#1B7A3F]">
              Current Time: {currentPoint?.t || '07:30'}
            </span>
          </div>

          {/* Real Leaflet Map */}
          <div className="relative h-[440px] w-full my-3 bg-[#E5EBE3] dark:bg-[#111A14] rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31]">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Custom Map Controls */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
              <button
                onClick={() => mapInstanceRef.current?.zoomIn()}
                className="h-9 w-9 rounded-xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md shadow-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100"
                title="Zoom in"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => mapInstanceRef.current?.zoomOut()}
                className="h-9 w-9 rounded-xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md shadow-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[#14201A] dark:text-[#EAF2E6] hover:bg-neutral-100"
                title="Zoom out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={() => mapInstanceRef.current?.setView([22.7758, 73.6149], 14)}
                className="h-9 w-9 rounded-xl bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md shadow-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[#1B7A3F] hover:bg-neutral-100"
                title="Recenter to Godhra"
              >
                <Navigation size={17} />
              </button>
            </div>

            {/* Floating Player Controls */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md px-5 py-2.5 shadow-xl border border-[#DCE5D9] dark:border-[#2A3B31]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111A14] text-white hover:bg-black transition-transform active:scale-95 shadow-md"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                <span className="text-xs font-mono font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  07:30
                </span>
              </div>

              {/* Interactive Timeline Slider */}
              <input
                type="range"
                min="0"
                max={maxSteps}
                value={sliderIndex}
                onChange={(e) => setSliderIndex(parseInt(e.target.value))}
                className="w-1/2 accent-[#1B7A3F] cursor-pointer"
              />

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#14201A] dark:text-[#EAF2E6]">
                  12:42
                </span>
                <div className="flex rounded-full bg-neutral-100 dark:bg-neutral-800 p-0.5 text-[11px] font-bold">
                  <button
                    onClick={() => setSpeed(1)}
                    className={`rounded-full px-2 py-0.5 transition-colors ${speed === 1 ? 'bg-white dark:bg-[#111A14] shadow-xs' : 'text-[#566259]'}`}
                  >
                    1×
                  </button>
                  <button
                    onClick={() => setSpeed(4)}
                    className={`rounded-full px-2 py-0.5 transition-colors ${speed === 4 ? 'bg-white dark:bg-[#111A14] shadow-xs' : 'text-[#566259]'}`}
                  >
                    4×
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trail Legend */}
          <div className="pt-2 flex items-center justify-between text-xs text-[#566259] dark:text-[#9DB0A2]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2 w-5 bg-[#1B7A3F] rounded-full inline-block" />
                GPS Trail
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2.5 w-2.5 bg-[#E8A317] rounded-full inline-block" />
                Stops (collection points)
              </span>
              <span className="flex items-center gap-1.5 font-bold text-red-600">
                <span className="h-2.5 w-2.5 bg-[#D93025] rounded-full inline-block" />
                Flagged: 220m outside boundary
              </span>
            </div>
            <span className="font-mono text-[11px]">
              GPS: {currentPoint?.lat.toFixed(4)}°, {currentPoint?.lng.toFixed(4)}°
            </span>
          </div>
        </div>

        {/* Right Column: Shift Summary Card */}
        <div className="lg:col-span-4 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[#111A14] text-white flex items-center justify-center font-bold text-sm">
                  RB
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6]">
                    Ramesh Bhai
                  </h3>
                  <div className="text-[11px] text-[#566259] dark:text-[#9DB0A2]">
                    GJ-17-AB-1234 · Tata Ace
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-bold">
                Shift complete
              </span>
            </div>

            {/* Shift metrics */}
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#566259]">Total shift duration</span>
                  <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">5 h 12 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#566259]">Distance covered</span>
                  <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">28.4 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#566259]">Total stops made</span>
                  <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">11 stops</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#566259]">Wards completed</span>
                  <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">Ward 4, 5, 6, 7</span>
                </div>
              </div>

              {/* Red Flag Callout */}
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs">
                <div className="flex items-center gap-2 text-red-600 font-bold">
                  <AlertTriangle size={16} />
                  <span>Flagged discrepancy</span>
                </div>
                <p className="text-[11px] text-[#566259] dark:text-[#9DB0A2] mt-1.5 leading-relaxed">
                  Ward 6 marked complete at 09:15 AM while vehicle was 220 meters outside assigned ward boundary.
                </p>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="pt-6 border-t border-[#E5EAE3] dark:border-[#2A3B31]">
            <button
              onClick={handleExportTrail}
              className="w-full rounded-full bg-[#111A14] hover:bg-black text-white dark:bg-[#F2F7EE] dark:hover:bg-white dark:text-[#0E1612] px-6 py-3 text-xs font-bold shadow flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Download size={15} />
              <span>Export Trail as CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
