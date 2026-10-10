interface MonogramBadgeProps {
  initial1: string;
  initial2: string;
  tone?: "ink" | "light";
}

export default function MonogramBadge({
  initial1,
  initial2,
  tone = "ink",
}: MonogramBadgeProps) {
  return (
    <div
      className={`monogram monogram--${tone}`}
      role="img"
      aria-label={`Monogram ${initial1} and ${initial2}`}
    >
      <span className="monogram-initials">
        {initial1}
        <span className="monogram-amp">&amp;</span>
        {initial2}
      </span>
    </div>
  );
}
