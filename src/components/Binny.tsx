import React from 'react';

export type BinnyPose = 'wave' | 'wait' | 'celebrate' | 'sleep';

interface BinnyProps {
  pose?: BinnyPose;
  state?: BinnyPose;
  size?: number;
  className?: string;
  label?: string;
}

export const Binny: React.FC<BinnyProps> = ({
  pose,
  state = 'wave',
  size = 140,
  className = '',
  label,
}) => {
  const activePose = pose || state || 'wave';
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      role={label ? 'img' : 'presentation'}
      aria-label={label || 'Binny Mascot'}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="transition-transform duration-300 hover:scale-105"
      >
        {/* Binny Body: Soft rounded dustbin in brandMid / brand green */}
        <defs>
          <linearGradient id="binnyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6DB36F" />
            <stop offset="100%" stopColor="#1B7A3F" />
          </linearGradient>
          <filter id="binnyShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#111A14" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="50" cy="94" rx="28" ry="4" fill="#14201A" opacity="0.15" />

        {/* Canister Body */}
        <rect
          x="28"
          y="38"
          width="44"
          height="50"
          rx="12"
          fill="url(#binnyGrad)"
          stroke="#14201A"
          strokeWidth="3"
        />

        {/* Ridges on Canister */}
        <line x1="38" y1="48" x2="38" y2="76" stroke="#14201A" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
        <line x1="50" y1="48" x2="50" y2="76" stroke="#14201A" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
        <line x1="62" y1="48" x2="62" y2="76" stroke="#14201A" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />

        {/* Lid */}
        <path
          d="M22 36 C22 33 26 31 34 31 L66 31 C74 31 78 33 78 36 L76 39 L24 39 Z"
          fill="#B5CF8A"
          stroke="#14201A"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <rect x="44" y="27" width="12" height="5" rx="2.5" fill="#1B7A3F" stroke="#14201A" strokeWidth="2.5" />

        {/* Little Leaf Sprout on top */}
        <path
          d="M50 27 C50 18 62 14 62 21 C62 26 53 26 50 27 Z"
          fill="#B5CF8A"
          stroke="#14201A"
          strokeWidth="2"
        />
        <path
          d="M50 27 C46 20 40 22 41 26 C42 28 47 28 50 27 Z"
          fill="#B5CF8A"
          stroke="#14201A"
          strokeWidth="1.5"
        />

        {/* Friendly Eyes and Expression */}
        {activePose === 'sleep' ? (
          // Sleeping eyes: gently curved lines
          <>
            <path d="M40 54 Q44 58 48 54" fill="none" stroke="#111A14" strokeWidth="3" strokeLinecap="round" />
            <path d="M54 54 Q58 58 62 54" fill="none" stroke="#111A14" strokeWidth="3" strokeLinecap="round" />
            <text x="70" y="38" fontSize="12" fontWeight="bold" fill="#1B7A3F">z</text>
            <text x="78" y="28" fontSize="14" fontWeight="bold" fill="#1B7A3F">Z</text>
          </>
        ) : activePose === 'celebrate' ? (
          // Happy celebratory eyes: arcs
          <>
            <path d="M40 54 Q44 48 48 54" fill="none" stroke="#111A14" strokeWidth="3" strokeLinecap="round" />
            <path d="M54 54 Q58 48 62 54" fill="none" stroke="#111A14" strokeWidth="3" strokeLinecap="round" />
            {/* Big Smile */}
            <path d="M43 62 Q51 72 59 62" fill="#F0873A" stroke="#111A14" strokeWidth="2.5" />
            {/* Stars / Confetti */}
            <circle cx="20" cy="25" r="2.5" fill="#F0873A" />
            <circle cx="80" cy="25" r="2.5" fill="#F0873A" />
          </>
        ) : (
          // Normal / Wave / Wait: Open friendly cartoon eyes
          <>
            <circle cx="43" cy="53" r="4.5" fill="#111A14" />
            <circle cx="44.5" cy="51.5" r="1.5" fill="#FFFFFF" />
            <circle cx="58" cy="53" r="4.5" fill="#111A14" />
            <circle cx="59.5" cy="51.5" r="1.5" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="37" cy="58" r="3" fill="#F0873A" opacity="0.6" />
            <circle cx="64" cy="58" r="3" fill="#F0873A" opacity="0.6" />
            {/* Smile */}
            <path d="M46 62 Q51 68 56 62" fill="none" stroke="#111A14" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Arms / Hands based on Pose */}
        {activePose === 'wave' && (
          // Right arm raised waving
          <path
            d="M72 48 Q82 40 85 30 Q88 28 86 35 Q80 48 72 54"
            fill="#B5CF8A"
            stroke="#111A14"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        )}
        {activePose === 'celebrate' && (
          // Both arms raised high
          <>
            <path d="M28 48 Q18 36 15 28" fill="none" stroke="#111A14" strokeWidth="3" strokeLinecap="round" />
            <path d="M72 48 Q82 36 85 28" fill="none" stroke="#111A14" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
};
