interface BotanicalSprigProps {
  flip?: boolean;
  className?: string;
}

export default function BotanicalSprig({ flip = false, className = "" }: BotanicalSprigProps) {
  return (
    <svg
      className={`sprig ${flip ? "is-flipped" : ""} ${className}`.trim()}
      viewBox="0 0 200 280"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M34 268 C 58 214, 42 168, 82 122 C 112 88, 136 68, 172 26"
        stroke="#8C754B"
        strokeWidth="1.1"
      />
      <path d="M82 122 C 64 112, 50 118, 40 104" stroke="#8C754B" strokeWidth="0.9" />
      <path d="M104 98 C 118 80, 124 64, 114 48" stroke="#8C754B" strokeWidth="0.9" />
      <path d="M132 78 C 152 70, 166 78, 176 66" stroke="#8C754B" strokeWidth="0.9" />
      <ellipse cx="46" cy="100" rx="8" ry="5" transform="rotate(-28 46 100)" fill="#6C2938" opacity="0.72" />
      <ellipse cx="116" cy="48" rx="7" ry="4.4" transform="rotate(18 116 48)" fill="#6C2938" opacity="0.72" />
      <ellipse cx="170" cy="32" rx="6" ry="3.8" transform="rotate(-12 170 32)" fill="#6C2938" opacity="0.65" />
      <ellipse cx="60" cy="136" rx="16" ry="6" transform="rotate(-42 60 136)" fill="#737A60" opacity="0.85" />
      <ellipse cx="108" cy="104" rx="14" ry="5.4" transform="rotate(28 108 104)" fill="#737A60" opacity="0.8" />
      <ellipse cx="150" cy="72" rx="13" ry="5" transform="rotate(-18 150 72)" fill="#737A60" opacity="0.8" />
      <ellipse cx="78" cy="168" rx="15" ry="5.5" transform="rotate(36 78 168)" fill="#737A60" opacity="0.55" />
    </svg>
  );
}
