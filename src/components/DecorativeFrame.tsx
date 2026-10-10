/**
 * DecorativeFrame
 *
 * A substantial, tasteful architectural illustration inspired by Indian
 * heritage architecture (Rajput / Mughal motifs). It uses solid shapes,
 * a classic scalloped archway, and restrained botanical flourishes
 * to frame the couple's names and invitation content.
 *
 * This SVG acts as a strong structural element rather than a faint border.
 */

interface DecorativeFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: "full" | "crown";
}

export default function DecorativeFrame({
  children,
  className = "",
  variant = "full",
}: DecorativeFrameProps) {
  const crown = variant === "crown";

  return (
    <div className={`relative w-full flex flex-col items-center ${className}`.trim()}>
      {/* ── Substantial Architectural Arch ─────── */}
      <div
        className="w-full flex justify-center"
        aria-hidden="true"
      >
        <svg
          viewBox={crown ? "0 0 400 156" : "0 0 400 240"}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Main Solid Arch Backdrop */}
          {/* A multi-foil scalloped arch silhouette */}
          <path
            d="M 20 240 L 20 120 
               C 20 90, 60 90, 80 70 
               C 100 50, 130 60, 150 40 
               C 170 20, 190 10, 200 10 
               C 210 10, 230 20, 250 40 
               C 270 60, 300 50, 320 70 
               C 340 90, 380 90, 380 120 
               L 380 240 L 360 240 L 360 125
               C 360 105, 330 105, 310 90
               C 290 75, 270 80, 255 60
               C 240 40, 215 30, 200 30
               C 185 30, 160 40, 145 60
               C 130 80, 110 75, 90 90
               C 70 105, 40 105, 40 125
               L 40 240 Z"
            fill="var(--color-champagne)"
            opacity="0.15"
          />

          {/* Intricate Inner Arch Line */}
          <path
            d="M 40 240 L 40 125
               C 40 105, 70 105, 90 90
               C 110 75, 130 80, 145 60
               C 160 40, 185 30, 200 30
               C 215 30, 240 40, 255 60
               C 270 80, 290 75, 310 90
               C 330 105, 360 105, 360 125
               L 360 240"
            stroke="var(--color-champagne)"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Secondary Parallel Arch Line */}
          <path
            d="M 52 240 L 52 130
               C 52 115, 78 115, 95 102
               C 112 89, 128 93, 140 76
               C 152 59, 175 42, 200 42
               C 225 42, 248 59, 260 76
               C 272 93, 288 89, 305 102
               C 322 115, 348 115, 348 130
               L 348 240"
            stroke="var(--color-champagne)"
            strokeWidth="0.75"
            opacity="0.5"
          />

          {/* Solid Base Pillars (Left & Right margins) */}
          <rect x="20" y="120" width="10" height="120" fill="var(--color-champagne)" opacity="0.3" />
          <rect x="370" y="120" width="10" height="120" fill="var(--color-champagne)" opacity="0.3" />

          {/* Restrained Botanical Details (Top Corners & Keystone) */}
          {/* Keystone Drop */}
          <path d="M 200 10 L 206 20 L 200 28 L 194 20 Z" fill="var(--color-champagne)" opacity="0.8" />
          
          {/* Left Corner Botanical Motif */}
          <path d="M 30 25 Q 60 25 80 45 Q 60 40 45 60 Q 40 45 30 25 Z" fill="var(--color-champagne)" opacity="0.25" />
          <path d="M 30 25 Q 50 15 70 20 Q 55 35 30 25 Z" fill="var(--color-champagne)" opacity="0.15" />

          {/* Right Corner Botanical Motif */}
          <path d="M 370 25 Q 340 25 320 45 Q 340 40 355 60 Q 360 45 370 25 Z" fill="var(--color-champagne)" opacity="0.25" />
          <path d="M 370 25 Q 350 15 330 20 Q 345 35 370 25 Z" fill="var(--color-champagne)" opacity="0.15" />
        </svg>
      </div>

      {/* ── Content Area ──────────────────────── */}
      <div className="relative w-full flex-grow flex flex-col items-center">
        {crown ? null : (
        <>
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: "max(12px, calc(50% - 180px))",
            width: "10px",
            background: "linear-gradient(to bottom, color-mix(in srgb, var(--color-champagne) 30%, transparent), transparent)",
          }}
        />
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            right: "max(12px, calc(50% - 180px))",
            width: "10px",
            background: "linear-gradient(to bottom, color-mix(in srgb, var(--color-champagne) 30%, transparent), transparent)",
          }}
        />
        
        {/* Inner thin lines continuing down */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: "max(24px, calc(50% - 168px))",
            width: "1.5px",
            background: "linear-gradient(to bottom, color-mix(in srgb, var(--color-champagne) 80%, transparent), transparent)",
          }}
        />
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            right: "max(24px, calc(50% - 168px))",
            width: "1.5px",
            background: "linear-gradient(to bottom, color-mix(in srgb, var(--color-champagne) 80%, transparent), transparent)",
          }}
        />
        </>
        )}

        <div className="relative z-10 w-full" style={{ padding: crown ? "0 0.25rem" : "0 clamp(36px, 10vw, 48px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
