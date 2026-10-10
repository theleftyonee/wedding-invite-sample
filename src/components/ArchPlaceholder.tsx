interface ArchPlaceholderProps {
  label?: string;
  decorative?: boolean;
}

export default function ArchPlaceholder({ label, decorative = false }: ArchPlaceholderProps) {
  return (
    <div
      className="arch-placeholder"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
    >
      <svg viewBox="0 0 200 250" fill="none" aria-hidden="true">
        <path
          d="M28 250 V128 C28 78 62 52 100 38 C138 52 172 78 172 128 V250"
          stroke="#B39765"
          strokeWidth="1.25"
        />
        <path
          d="M44 250 V134 C44 94 70 72 100 60 C130 72 156 94 156 134 V250"
          stroke="#B39765"
          strokeWidth="0.7"
          opacity="0.7"
        />
        <path d="M100 30 L104 38 L100 46 L96 38 Z" fill="#B39765" />
        <path
          d="M22 46 C40 40 52 52 58 66 C46 58 34 60 22 46 Z"
          fill="#6C2938"
          opacity="0.45"
        />
        <path
          d="M178 46 C160 40 148 52 142 66 C154 58 166 60 178 46 Z"
          fill="#6C2938"
          opacity="0.45"
        />
      </svg>
    </div>
  );
}
