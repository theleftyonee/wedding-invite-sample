import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import config, { type WeddingEvent } from "../data/weddingConfig";
import { easeOut } from "../lib/motion";
import { isPlaceholder } from "../lib/placeholder";
import { useReveal } from "../lib/useReveal";
import EventExperience from "./EventExperience";
import SectionHeading from "./SectionHeading";

function EventMotif({ id }: { id: WeddingEvent["id"] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (id) {
    case "mehendi":
      return (
        <svg {...common}>
          <path d="M12 21c-4.5-2.6-6.5-6.4-5.6-10.6C7.2 6.6 10 4 12 3c2 1 4.8 3.6 5.6 7.4.9 4.2-1.1 8-5.6 10.6Z" />
          <path d="M12 6.5v14M12 11l-2.6-2M12 14l3-2.4M12 17l-2.8-2" />
        </svg>
      );
    case "sangeet":
      return (
        <svg {...common}>
          <path d="M9 17.5V5.5l10-2v12" />
          <circle cx="6.6" cy="17.6" r="2.4" />
          <circle cx="16.6" cy="15.6" r="2.4" />
          <path d="M9 9l10-2" />
        </svg>
      );
    case "ceremony":
      return (
        <svg {...common}>
          <path d="M12 3.5c1.8 2.2 2.6 3.8 2.6 5.2a2.6 2.6 0 0 1-5.2 0c0-1.4.8-3 2.6-5.2Z" />
          <path d="M4.5 14h15c-.6 3.4-3.6 6-7.5 6s-6.9-2.6-7.5-6Z" />
          <path d="M12 11.3V14" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M15.5 4.2A8 8 0 1 0 19.8 15 6.5 6.5 0 0 1 15.5 4.2Z" />
          <path d="M18.5 3.5l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5.5-1.4Z" />
        </svg>
      );
  }
}

export default function CelebrationsSection() {
  const { events, copy } = config;
  const revealRef = useReveal<HTMLDivElement>();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const restoreFocus = useCallback(() => {
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = Array.from(scroller.children) as HTMLElement[];
        const centre = scroller.scrollLeft + scroller.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;
        cards.forEach((card, index) => {
          const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centre);
          if (distance < best) {
            best = distance;
            nearest = index;
          }
        });
        setActive(nearest);
      });
    };
    measure();
    scroller.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  if (!events || events.length === 0) return null;

  const goTo = (index: number) => {
    const scroller = scrollerRef.current;
    const card = scroller?.children[index] as HTMLElement | undefined;
    if (!scroller || !card) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({
      left: card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const shift = (direction: -1 | 1) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return Math.min(events.length - 1, Math.max(0, current + direction));
    });
  };

  return (
    <section id="celebrations" className="section section--paper celebrations" aria-label="Wedding celebrations">
      <div ref={revealRef} className="section-inner reveal">
        <SectionHeading
          kicker={copy.celebrationsKicker}
          title={copy.celebrationsHeading}
          lede={copy.celebrationsText}
        />
        <div ref={scrollerRef} className="event-scroller">
          {events.map((event, index) => (
            <motion.article
              key={event.id}
              className={`invite-card invite-card--${event.id} theme--${event.themeColor}${
                index === active ? " is-active" : ""
              }`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.6, delay: index * 0.06, ease: easeOut }}
            >
              <figure>
                <img src={event.image} alt={event.imageAlt} width={640} height={800} loading="lazy" decoding="async" />
                <span className="invite-card-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </figure>
              <span className="invite-card-motif">
                <EventMotif id={event.id} />
              </span>
              <div className="invite-card-copy">
                <h3>{event.name}</h3>
                <p className="invite-card-when">
                  {isPlaceholder(event.date) ? "Date to follow" : event.date}
                  {isPlaceholder(event.time) ? null : (
                    <>
                      <br />
                      {event.time}
                    </>
                  )}
                </p>
                <p className="invite-card-text">{event.description}</p>
                <button
                  type="button"
                  className="invite-card-button"
                  onClick={(clickEvent) => {
                    triggerRef.current = clickEvent.currentTarget;
                    setOpenIndex(index);
                  }}
                >
                  View details
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="event-controls">
          <button
            type="button"
            className="event-arrow"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous celebration"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
          <div className="event-pips">
            {events.map((event, index) => (
              <button
                key={event.id}
                type="button"
                className={`event-pip theme--${event.themeColor}${index === active ? " is-active" : ""}`}
                onClick={() => goTo(index)}
                aria-label={`Show ${event.name}`}
                aria-current={index === active ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className="event-arrow"
            onClick={() => goTo(active + 1)}
            disabled={active === events.length - 1}
            aria-label="Next celebration"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && events[openIndex] ? (
          <EventExperience
            key="event-chapter"
            event={events[openIndex]}
            index={openIndex}
            total={events.length}
            onClose={() => setOpenIndex(null)}
            onShift={shift}
            onRestoreFocus={restoreFocus}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
