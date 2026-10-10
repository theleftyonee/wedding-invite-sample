interface ScrollIndicatorProps {
  tone?: "ink" | "light";
}

export default function ScrollIndicator({ tone = "ink" }: ScrollIndicatorProps) {
  const color = tone === "light" ? "rgba(247, 242, 233, 0.88)" : "var(--color-champagne-dark)";

  return (
    <div className="scroll-cue animate-breathe" aria-hidden="true">
      <span style={{ color }}>Scroll</span>
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
        <line x1="8" y1="0" x2="8" y2="18" stroke={color} strokeWidth="1" />
        <path d="M 3 14 L 8 20 L 13 14" stroke={color} strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}
