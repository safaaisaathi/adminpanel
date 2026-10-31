import React, { useMemo } from 'react';

interface ContourCardProps {
  seed?: number;
  lines?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * ContourCard: Signature element from Safai Sathi Design System v1.0 (Section 4.9 & CL-12)
 * Renders topographic contour lines with exact mathematical wave distortion.
 * Background: brandMid (#6DB36F), Lines: #1B7A3F at 35% opacity, Text: Ink (#111A14).
 */
export const ContourCard: React.FC<ContourCardProps> = ({
  seed = 42,
  lines = 8,
  className = '',
  children,
}) => {
  // Generate deterministic SVG contour paths matching Flutter ContourPainter
  const svgPaths = useMemo(() => {
    // Simple deterministic pseudo-random generator based on seed
    let s = seed % 2147483647;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    const cx = 350 * (0.35 + rnd() * 0.3);
    const cy = 200 * (0.35 + rnd() * 0.3);
    const p1 = rnd() * Math.PI * 2;
    const p2 = rnd() * Math.PI * 2;

    const paths: string[] = [];
    const maxR = 300;

    for (let i = 1; i <= lines; i++) {
      const r = (maxR * i) / lines;
      let d = '';

      for (let a = 0; a <= 360; a += 6) {
        const t = (a * Math.PI) / 180;
        const rr = r * (1 + 0.1 * Math.sin(2 * t + p1) + 0.06 * Math.sin(3 * t + p2));
        const x = cx + rr * Math.cos(t);
        const y = cy + rr * Math.sin(t) * 0.75;

        if (a === 0) {
          d += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
        } else {
          d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        }
      }
      d += ' Z';
      paths.push(d);
    }
    return paths;
  }, [seed, lines]);

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] bg-[#6DB36F] p-6 text-[#111A14] shadow-elev1 dark:shadow-elev1-dark transition-all ${className}`}
      style={{ minHeight: '160px' }}
    >
      {/* Topographic Contour Background */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
        viewBox="0 0 500 250"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {svgPaths.map((d, idx) => (
          <path
            key={idx}
            d={d}
            fill="none"
            stroke="#1B7A3F"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Card Content (Ink on brandMid passes WCAG AA at 7.05:1) */}
      <div className="relative z-10 flex flex-col justify-between h-full text-[#111A14]">
        {children}
      </div>
    </div>
  );
};
