import React, { useState, useEffect } from 'react';
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
  Check
} from 'lucide-react';

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
        className="flex items-center gap-1.5 text-xs font-bold text-[#566259] hover:text-[#14201A]"
      >
        <ArrowLeft size={15} />
        <span>Back to Attendance</span>
      </button>

      {/* Main Grid: Left Map Replay with Floating Player, Right Trip Summary (Canvas A20) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Map Card with Floating Controls (Canvas A20) */}
        <div className="lg:col-span-8 rounded-[28px] bg-white dark:bg-[#16221B] p-5 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
            <div className="text-xs font-bold text-[#14201A] dark:text-[#EAF2E6]">
              GPS Route Trace: 07:30 to 12:42
            </div>
            <span className="text-xs font-bold text-[#1B7A3F]">
              Current Time: {currentPoint?.t || '07:30'}
            </span>
          </div>

          {/* SVG Map Trail with Stop Dots & Flagged Points */}
          <div className="relative h-[440px] w-full my-3 bg-[#F3F7F2] dark:bg-[#111A14] rounded-2xl overflow-hidden border border-[#DCE5D9] dark:border-[#2A3B31]">
            <svg viewBox="0 0 600 440" className="w-full h-full">
              {/* Roads */}
              <path d="M 0 220 Q 300 280 600 200" stroke="#FFF" strokeWidth="20" fill="none" opacity="0.9" />
              <path d="M 220 0 Q 240 220 200 440" stroke="#FFF" strokeWidth="14" fill="none" opacity="0.9" />

              {/* Dotted GPS Trail */}
              <path
                d="M 120 320 C 140 240, 200 180, 240 180 C 280 180, 360 140, 420 190 C 460 220, 380 320, 320 310"
                stroke="#1B7A3F"
                strokeWidth="4"
                strokeDasharray="4 6"
                fill="none"
              />

              {/* Orange Stop Dots (11 stops on route) */}
              <circle cx="160" cy="225" r="7" fill="#E8A317" stroke="#FFF" strokeWidth="2" />
              <circle cx="210" cy="185" r="7" fill="#E8A317" stroke="#FFF" strokeWidth="2" />
              <circle cx="280" cy="170" r="7" fill="#E8A317" stroke="#FFF" strokeWidth="2" />
              <circle cx="340" cy="155" r="7" fill="#E8A317" stroke="#FFF" strokeWidth="2" />
              <circle cx="410" cy="180" r="7" fill="#E8A317" stroke="#FFF" strokeWidth="2" />
              <circle cx="430" cy="230" r="7" fill="#E8A317" stroke="#FFF" strokeWidth="2" />

              {/* Red Flagged Point (Canvas A20) */}
              <circle cx="270" cy="200" r="9" fill="#D93025" stroke="#FFF" strokeWidth="2" />
              <text x="285" y="205" fontSize="10" fontWeight="bold" fill="#D93025">
                ! Flagged outside boundary (220m)
              </text>

              {/* Animated Van Marker following slider */}
              {(() => {
                const stepPositions = [
                  [120, 320],
                  [160, 225],
                  [210, 185],
                  [270, 200],
                  [340, 155],
                  [410, 180],
                  [430, 230],
                  [380, 290],
                  [320, 310]
                ];
                const pos = stepPositions[sliderIndex] || stepPositions[0];

                return (
                  <g className="transition-all duration-300">
                    <circle cx={pos[0]} cy={pos[1]} r="18" fill="#1B7A3F" stroke="#FFF" strokeWidth="3" />
                    <text x={pos[0] - 7} y={pos[1] + 5} fontSize="12" fill="#FFF">🛺</text>
                  </g>
                );
              })()}
            </svg>

            {/* Floating Player Controls (Canvas A20 bottom) */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-full bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md px-5 py-2.5 shadow-xl border border-[#DCE5D9] dark:border-[#2A3B31]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111A14] text-white hover:bg-black transition-transform active:scale-95"
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
                    1x
                  </button>
                  <button
                    onClick={() => setSpeed(4)}
                    className={`rounded-full px-2 py-0.5 transition-colors ${speed === 4 ? 'bg-white dark:bg-[#111A14] shadow-xs' : 'text-[#566259]'}`}
                  >
                    4x
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Trip Summary Card (Canvas A20) */}
        <div className="lg:col-span-4 rounded-[28px] bg-white dark:bg-[#16221B] p-6 shadow-sm border border-[#E5EAE3] dark:border-[#2A3B31] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#14201A] dark:text-[#EAF2E6] mb-4">
              Trip summary
            </h3>

            {/* Driver Identity */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#111A14] border border-[#E5EAE3] dark:border-[#2A3B31]">
              <div className="h-10 w-10 rounded-full bg-[#1B7A3F] text-white flex items-center justify-center font-bold text-xs">
                RB
              </div>
              <div>
                <div className="font-bold text-xs text-[#14201A] dark:text-[#EAF2E6]">
                  Ramesh Bhai
                </div>
                <div className="text-[10px] font-mono text-[#566259]">
                  GJ-17-AB-1234
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="mt-5 space-y-3.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <span className="text-[#566259]">Distance</span>
                <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">42 km</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <span className="text-[#566259]">Duration</span>
                <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">5 h 12 min</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <span className="text-[#566259]">Stops</span>
                <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">11</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EAE3] dark:border-[#2A3B31]">
                <span className="text-[#566259]">Wards done</span>
                <span className="font-bold text-[#14201A] dark:text-[#EAF2E6]">9 of 9</span>
              </div>
            </div>

            {/* Flagged Alert Box (Canvas A20) */}
            <div className="mt-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs border border-red-200 dark:border-red-900/50">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <AlertTriangle size={15} />
                <span>1 flagged</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Ward 6 marked done 220 m outside the boundary
              </p>
            </div>
          </div>

          {/* Export Trail CSV Button */}
          <div className="pt-6 border-t border-[#E5EAE3] dark:border-[#2A3B31]">
            <button
              onClick={handleExportTrail}
              className="w-full rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#16221B] hover:bg-neutral-50 py-3 text-xs font-bold text-[#14201A] dark:text-[#EAF2E6] shadow-xs flex items-center justify-center gap-2"
            >
              <Download size={14} />
              <span>Export trail as CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
