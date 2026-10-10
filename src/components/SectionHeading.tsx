interface SectionHeadingProps {
  kicker: string;
  title: string;
  lede?: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  kicker,
  title,
  lede,
  align = "center",
}: SectionHeadingProps) {
  return (
    <header className={`section-heading${align === "left" ? " is-left" : ""}`}>
      <p className="kicker">{kicker}</p>
      <h2 className="section-title">{title}</h2>
      <div className="ornament" aria-hidden="true">
        <span />
        <i />
        <span />
      </div>
      {lede ? <p className="lede">{lede}</p> : null}
    </header>
  );
}
