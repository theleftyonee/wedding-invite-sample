import { useEffect, useState } from "react";

const sections = [
  { id: "welcome", label: "Welcome" },
  { id: "celebrations", label: "Events" },
  { id: "venue", label: "Venue" },
  { id: "gallery", label: "Gallery" },
  { id: "rsvp", label: "RSVP" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("welcome");
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setIsVisible(window.scrollY > window.innerHeight * 0.72);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);

      let current = "";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.42 && rect.bottom >= window.innerHeight * 0.28) {
          current = section.id;
        }
      }
      if (current) setActiveSection(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="read-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      {isVisible ? (
        <nav className="site-nav is-visible" aria-label="Invitation">
          <div className="site-nav-bar">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {section.label}
                </a>
              );
            })}
          </div>
        </nav>
      ) : null}
    </>
  );
}
