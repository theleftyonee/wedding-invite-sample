import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import config, { type WeddingEvent } from "../data/weddingConfig";
import { easeOut, slideTransition, slideVariants } from "../lib/motion";
import { directionsHref, isPlaceholder } from "../lib/placeholder";
import { downloadCalendar, eventTimeRange, parseInstant, type CalendarEntry } from "../lib/schedule";

const slides = ["Details", "Dress", "Venue", "Moments", "Save"] as const;

const icons = {
  calendar: "M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4",
  clock: "M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15ZM12 8v4.3l2.8 1.7",
  pin: "M12 20.5s-6-5.4-6-10a6 6 0 0 1 12 0c0 4.6-6 10-6 10ZM12 12.3a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z",
  dress: "M9.5 3.5h5l-.8 4 3.8 12.5h-11L10.3 7.5zM10.3 7.5h3.4",
  share: "M8.5 12.5 15.5 16M15.5 8 8.5 11.5M17.5 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM17.5 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
} as const;

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={icons[name]} />
    </svg>
  );
}

function InfoTile({ icon, label, value, muted = false }: { icon: keyof typeof icons; label: string; value: string; muted?: boolean }) {
  return (
    <div className={`info-tile${muted ? " is-muted" : ""}`}>
      <span className="info-tile-icon">
        <Icon name={icon} />
      </span>
      <div>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    </div>
  );
}

function AttireTile({ tone, label, text }: { tone: string; label: string; text: string }) {
  return (
    <figure className="attire-tile">
      <svg viewBox="0 0 80 120" aria-hidden="true">
        <path d="M28 18c6 8 18 8 24 0l8 10-8 8v62H28V36l-8-8z" fill={tone} />
        <path d="M34 16h12l2 8H32z" fill="#f7f2e9" opacity="0.85" />
      </svg>
      <figcaption>
        <strong>{label}</strong>
        {text}
      </figcaption>
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

  const previousEvent = config.events[index - 1];
  const nextEvent = config.events[index + 1];
  const count = (value: number) => String(value).padStart(2, "0");

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
        className={`event-dialog-panel theme--${event.themeColor}`}
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
          <p className="event-dialog-count">
            <span>{count(index + 1)}</span> / {count(total)}
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
            <figcaption>
              <span className="event-dialog-date">{event.date}</span>
              <h2 id="event-dialog-title">{event.name}</h2>
              <p>{event.time}</p>
            </figcaption>
          </figure>

          <div className="event-dialog-body">
            <div className="event-tabs" role="tablist" aria-label={`${event.name} information`}>
              {slides.map((label, tab) => (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  id={`event-tab-${tab}`}
                  aria-selected={tab === slide}
                  aria-controls="event-tabpanel"
                  className={tab === slide ? "is-current" : ""}
                  onClick={() => goToSlide(tab)}
                >
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              className="event-slide"
              id="event-tabpanel"
              role="tabpanel"
              aria-labelledby={`event-tab-${slide}`}
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
                  <p className="event-slide-lede">{event.description}</p>
                  <dl className="info-grid">
                    <InfoTile icon="calendar" label="Date" value={event.date} />
                    <InfoTile icon="clock" label="Time" value={when} />
                    <InfoTile icon="pin" label="Venue" value={hasVenue ? event.venue : "To be confirmed"} muted={!hasVenue} />
                    <InfoTile icon="dress" label="Dress code" value={event.dressCode} />
                  </dl>
                </>
              ) : null}

              {slide === 1 ? (
                <>
                  <figure className="attire-lineup">
                    <img
                      src={`/images/attire/${event.id}.jpg`}
                      alt={`Illustrated outfit ideas for the ${event.name}. ${event.attireWomen} ${event.attireMen}`}
                      width={1024}
                      height={768}
                      decoding="async"
                    />
                    <figcaption>Illustration, for inspiration only</figcaption>
                  </figure>
                  <p className="event-card-label attire-lineup-label">Dress code</p>
                  <h3 className="event-slide-title">{event.dressCode}</h3>
                  <p className="event-slide-note">{event.dressNote}</p>
                  <div className="event-card">
                    <p className="event-card-label">Colour palette</p>
                    <div className="palette" aria-label="Suggested colour palette">
                      {event.palette.map((color) => (
                        <span key={color} style={{ background: color }} title={color} />
                      ))}
                    </div>
                  </div>
                  <div className="attire-grid">
                    <AttireTile tone={event.palette[0] ?? "#737A60"} label="Women" text={event.attireWomen} />
                    <AttireTile tone={event.palette[1] ?? "#29251F"} label="Men" text={event.attireMen} />
                  </div>
                </>
              ) : null}

              {slide === 2 ? (
                <>
                  <figure className="event-venue-still">
                    <img src={images.venue} alt={images.venueAlt} width={1280} height={720} />
                  </figure>
                  <dl className="info-grid">
                    <InfoTile icon="pin" label="Venue" value={hasVenue ? event.venue : "To be confirmed"} muted={!hasVenue} />
                    <InfoTile icon="clock" label="Arrive for" value={when} />
                  </dl>
                  {directions ? (
                    <a className="invitation-button" href={directions} target="_blank" rel="noopener noreferrer">
                      Get directions
                    </a>
                  ) : (
                    <button type="button" className="invitation-button" disabled>
                      Directions once the venue is confirmed
                    </button>
                  )}
                  <p className="event-footnote">{copy.atmosphereNote}</p>
                </>
              ) : null}

              {slide === 3 ? (
                <>
                  <h3 className="event-slide-title">A sense of the room</h3>
                  <div className="experience-row">
                    {event.experience.map((still) => (
                      <figure key={still.src}>
                        <img src={still.src} alt={still.alt} width={640} height={800} loading="lazy" decoding="async" />
                      </figure>
                    ))}
                  </div>
                  <p className="event-footnote">{copy.atmosphereNote}</p>
                </>
              ) : null}

              {slide === 4 ? (
                <>
                  <h3 className="event-slide-title">Keep this gathering</h3>
                  <div className="event-action-list">
                    <button type="button" className="event-action is-primary" onClick={save} disabled={!canSave}>
                      <Icon name="calendar" />
                      Add to calendar
                    </button>
                    {directions ? (
                      <a className="event-action" href={directions} target="_blank" rel="noopener noreferrer">
                        <Icon name="pin" />
                        Get directions
                      </a>
                    ) : (
                      <button type="button" className="event-action" disabled>
                        <Icon name="pin" />
                        Directions to follow
                      </button>
                    )}
                    <button type="button" className="event-action" onClick={share}>
                      <Icon name="share" />
                      Share invitation
                    </button>
                  </div>
                  {note ? <p className="calendar-note">{note}</p> : null}
                </>
              ) : null}
            </motion.div>
            </AnimatePresence>

            <nav className="event-switch" aria-label="Other celebrations">
              {previousEvent ? (
                <button type="button" onClick={() => onShift(-1)} aria-label={`Previous celebration: ${previousEvent.name}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M14.5 6 8.5 12l6 6" />
                  </svg>
                  <span>{previousEvent.name}</span>
                </button>
              ) : <span />}
              {nextEvent ? (
                <button type="button" onClick={() => onShift(1)} aria-label={`Next celebration: ${nextEvent.name}`}>
                  <span>{nextEvent.name}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="m9.5 6 6 6-6 6" />
                  </svg>
                </button>
              ) : <span />}
            </nav>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
