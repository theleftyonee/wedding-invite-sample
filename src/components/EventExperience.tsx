import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import config, { type WeddingEvent } from "../data/weddingConfig";
import { easeOut, slideTransition, slideVariants } from "../lib/motion";
import { directionsHref, isPlaceholder } from "../lib/placeholder";
import { downloadCalendar, eventTimeRange, parseInstant, type CalendarEntry } from "../lib/schedule";

const slides = ["The celebration", "Dress", "Venue", "Atmosphere", "Actions"] as const;

function AttireMark({ tone, label }: { tone: string; label: string }) {
  return (
    <figure className="attire-mark">
      <svg viewBox="0 0 80 120" aria-hidden="true">
        <path d="M28 18c6 8 18 8 24 0l8 10-8 8v62H28V36l-8-8z" fill={tone} />
        <path d="M34 16h12l2 8H32z" fill="#f7f2e9" opacity="0.85" />
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

export default function EventExperience({
  event,
  index,
  total,
  onClose,
  onShift,
  onRestoreFocus,
}: {
  event: WeddingEvent;
  index: number;
  total: number;
  onClose: () => void;
  onShift: (direction: -1 | 1) => void;
  onRestoreFocus: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [note, setNote] = useState("");
  const { couple, images, copy } = config;
  const names = `${couple.partner1.firstName} & ${couple.partner2.firstName}`;
  const hasVenue = !isPlaceholder(event.venue);
  const directions = directionsHref(event.venue, "");
  const when = eventTimeRange(event.startsAt, event.durationHours, event.time);
  const canSave = Boolean(parseInstant(event.startsAt));

  const goToSlide = (next: number) => {
    setDirection(next > slide ? 1 : -1);
    setSlide(next);
  };

  useEffect(() => {
    setDirection(1);
    setSlide(0);
    setNote("");
  }, [event.id]);

  useEffect(() => {
    return () => onRestoreFocus();
  }, [onRestoreFocus]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const root = document.getElementById("root");
    root?.setAttribute("inert", "");
    const closeButton = panel.querySelector<HTMLButtonElement>(".event-dialog-close");
    closeButton?.focus();

    const onKey = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") {
        keyEvent.preventDefault();
        onClose();
        return;
      }
      if (keyEvent.key === "ArrowRight") {
        setDirection(1);
        setSlide((current) => Math.min(slides.length - 1, current + 1));
      }
      if (keyEvent.key === "ArrowLeft") {
        setDirection(-1);
        setSlide((current) => Math.max(0, current - 1));
      }
      if (keyEvent.key !== "Tab") return;
      const nodes = [...panel.querySelectorAll<HTMLElement>("button, a[href]")].filter(
        (node) => !node.hasAttribute("disabled"),
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (keyEvent.shiftKey && document.activeElement === first) {
        keyEvent.preventDefault();
        last?.focus();
      } else if (!keyEvent.shiftKey && document.activeElement === last) {
        keyEvent.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      root?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, event.id]);

  const save = () => {
    const entry: CalendarEntry = {
      uid: `${event.id}-aanya-arjun@invitation`,
      title: `${event.name} — ${names}`,
      startsAt: event.startsAt,
      durationHours: event.durationHours,
      details: event.description,
      location: event.venue,
    };
    const saved = downloadCalendar(`${event.id}.ics`, [entry]);
    setNote(saved ? "A calendar file is downloading to this device." : "This event has no start time yet.");
  };

  const share = async () => {
    const data = {
      title: `${event.name} — ${names}`,
      text: `${event.name}. ${event.date}.`,
      url: window.location.href,
    };
    if (!navigator.share) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setNote("The invitation link is copied.");
      } catch {
        setNote("Copy the address from the browser bar.");
      }
      return;
    }
    try {
      await navigator.share(data);
    } catch (error) {
      if ((error as Error).name !== "AbortError") setNote("Copy the address from the browser bar.");
    }
  };

  return createPortal(
    <motion.div
      className="event-dialog"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: easeOut }}
    >
      <motion.div
        ref={panelRef}
        className="event-dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-dialog-title"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 18, opacity: 0 }}
        transition={{ duration: 0.4, ease: easeOut }}
      >
        <header className="event-dialog-bar">
          <p>
            {index + 1} / {total}
            <span>{event.name}</span>
          </p>
          <button type="button" className="event-dialog-close" onClick={onClose} aria-label="Close event">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="event-dialog-layout">
          <figure className="event-dialog-hero">
            <img src={event.image} alt={event.imageAlt} width={864} height={1080} />
          </figure>

          <div className="event-dialog-body">
            <div className="event-switch">
              <button type="button" onClick={() => onShift(-1)} disabled={index === 0} aria-label="Previous celebration">
                Previous
              </button>
              <button type="button" onClick={() => onShift(1)} disabled={index === total - 1} aria-label="Next celebration">
                Next
              </button>
            </div>

            <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              className="event-slide"
              key={`${event.id}-${slide}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              dragDirectionLock
              onDragEnd={(_, info) => {
                if (info.offset.x <= -64) goToSlide(Math.min(slides.length - 1, slide + 1));
                if (info.offset.x >= 64) goToSlide(Math.max(0, slide - 1));
              }}
            >
              {slide === 0 ? (
                <>
                  <p className="kicker">{slides[0]}</p>
                  <h2 id="event-dialog-title">{event.name}</h2>
                  <p className="event-slide-lede">{event.description}</p>
                  <dl className="event-facts">
                    <div><dt>Date</dt><dd>{event.date}</dd></div>
                    <div><dt>Time</dt><dd>{when}</dd></div>
                    <div><dt>Venue</dt><dd>{hasVenue ? event.venue : "Details to follow."}</dd></div>
                  </dl>
                </>
              ) : null}

              {slide === 1 ? (
                <>
                  <p className="kicker">{slides[1]}</p>
                  <h2 id="event-dialog-title">{event.dressCode}</h2>
                  <p className="event-slide-lede">{event.dressNote}</p>
                  <div className="palette" aria-label="Sample colour palette">
                    {event.palette.map((color) => (
                      <span key={color} style={{ background: color }} title={color} />
                    ))}
                  </div>
                  <div className="attire-row">
                    <AttireMark tone={event.palette[0] ?? "#737A60"} label={event.attireWomen} />
                    <AttireMark tone={event.palette[1] ?? "#29251F"} label={event.attireMen} />
                  </div>
                </>
              ) : null}

              {slide === 2 ? (
                <>
                  <p className="kicker">{slides[2]}</p>
                  <h2 id="event-dialog-title">{hasVenue ? event.venue : "Venue to follow"}</h2>
                  <figure className="event-venue-still">
                    <img src={images.venue} alt={images.venueAlt} width={1280} height={720} />
                  </figure>
                  <p className="event-slide-lede">{copy.atmosphereNote}</p>
                  <p className="event-slide-lede">Arrive for {when}.</p>
                  {directions ? (
                    <a className="invitation-button" href={directions} target="_blank" rel="noopener noreferrer">
                      Get directions
                    </a>
                  ) : (
                    <button type="button" className="invitation-button" disabled>
                      Directions when the venue is confirmed
                    </button>
                  )}
                </>
              ) : null}

              {slide === 3 ? (
                <>
                  <p className="kicker">{slides[3]}</p>
                  <h2 id="event-dialog-title">A sense of the room</h2>
                  <p className="event-slide-lede">{copy.atmosphereNote}</p>
                  <div className="experience-row">
                    {event.experience.map((still) => (
                      <figure key={still.src}>
                        <img src={still.src} alt={still.alt} width={640} height={800} loading="lazy" decoding="async" />
                      </figure>
                    ))}
                  </div>
                </>
              ) : null}

              {slide === 4 ? (
                <>
                  <p className="kicker">{slides[4]}</p>
                  <h2 id="event-dialog-title">Keep this gathering</h2>
                  <div className="event-action-list">
                    <button type="button" className="invitation-button" onClick={save} disabled={!canSave}>
                      Add to calendar
                    </button>
                    {directions ? (
                      <a className="quiet-button" href={directions} target="_blank" rel="noopener noreferrer">
                        Get directions
                      </a>
                    ) : (
                      <button type="button" className="quiet-button" disabled>
                        Directions to follow
                      </button>
                    )}
                    <button type="button" className="quiet-button" onClick={share}>
                      Share invitation
                    </button>
                  </div>
                  {note ? <p className="calendar-note">{note}</p> : null}
                </>
              ) : null}
            </motion.div>
            </AnimatePresence>

            <div className="slide-nav">
              <button type="button" onClick={() => goToSlide(Math.max(0, slide - 1))} disabled={slide === 0} aria-label="Previous information">
                Back
              </button>
              <div className="slide-dots" aria-label={`Slide ${slide + 1} of ${slides.length}: ${slides[slide]}`}>
                {slides.map((label, dot) => (
                  <button
                    key={label}
                    type="button"
                    className={dot === slide ? "is-current" : ""}
                    aria-label={label}
                    aria-current={dot === slide ? "true" : undefined}
                    onClick={() => goToSlide(dot)}
                  />
                ))}
              </div>
              <button type="button" onClick={() => goToSlide(Math.min(slides.length - 1, slide + 1))} disabled={slide === slides.length - 1} aria-label="Next information">
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
