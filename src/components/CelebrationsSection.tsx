import { useState } from "react";
import config, { type WeddingEvent } from "../data/weddingConfig";
import { isPlaceholder } from "../lib/placeholder";
import { downloadCalendar, parseInstant, type CalendarEntry } from "../lib/schedule";
import { useReveal } from "../lib/useReveal";
import AtmosphericImage from "./AtmosphericImage";
import SectionHeading from "./SectionHeading";

function calendarEntry(event: WeddingEvent, names: string): CalendarEntry | null {
  if (!parseInstant(event.startsAt)) return null;
  return {
    uid: `${event.name.toLowerCase().replace(/\s+/g, "-")}-aanya-arjun@invitation`,
    title: `${event.name} — ${names}`,
    startsAt: event.startsAt,
    durationHours: event.durationHours,
    details: event.description,
    location: event.venue,
  };
}

function EventChapter({
  event,
  index,
  names,
}: {
  event: WeddingEvent;
  index: number;
  names: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [calendarNote, setCalendarNote] = useState("");
  const revealRef = useReveal<HTMLElement>();
  const hasDate = !isPlaceholder(event.date);
  const hasTime = !isPlaceholder(event.time);
  const hasVenue = !isPlaceholder(event.venue);
  const hasDress = !isPlaceholder(event.dressCode);
  const entry = calendarEntry(event, names);
  const night = index === 2;

  const saveEvent = () => {
    if (!entry) return;
    const saved = downloadCalendar(`${event.name.toLowerCase().replace(/\s+/g, "-")}.ics`, [entry]);
    setCalendarNote(saved ? "A calendar file is downloading to this device." : "");
  };

  return (
    <article
      ref={revealRef}
      className={`chapter reveal${night ? " chapter--night" : ""}${index % 2 === 1 ? " is-flipped" : ""}`}
      aria-labelledby={`event-title-${index}`}
    >
      <figure className="chapter-media">
        <AtmosphericImage src={event.image} alt={event.imageAlt} width={864} height={1080} />
      </figure>

      <div className="chapter-copy">
        <p className="chapter-index">0{index + 1}</p>
        <h3 id={`event-title-${index}`}>{event.name}</h3>
        <p>{event.description}</p>

        <button
          type="button"
          className="event-toggle"
          onClick={() => setIsExpanded((open) => !open)}
          aria-expanded={isExpanded}
          aria-controls={`event-details-${index}`}
        >
          {isExpanded ? "Hide details" : "View details"}
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>

        {isExpanded ? (
          <div id={`event-details-${index}`} className="event-details animate-fade-in">
            <dl>
              {hasDate ? (
                <div>
                  <dt>Date</dt>
                  <dd>{event.date}</dd>
                </div>
              ) : null}
              {hasTime ? (
                <div>
                  <dt>Time</dt>
                  <dd>{event.time}</dd>
                </div>
              ) : null}
              <div>
                <dt>Venue</dt>
                <dd>{hasVenue ? event.venue : "Details to follow."}</dd>
              </div>
              {hasDress ? (
                <div>
                  <dt>Dress</dt>
                  <dd>{event.dressCode}</dd>
                </div>
              ) : null}
            </dl>
            {entry ? (
              <button type="button" className="text-link" onClick={saveEvent}>
                Add to calendar
              </button>
            ) : null}
            {calendarNote ? <p className="calendar-note">{calendarNote}</p> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function CelebrationsSection() {
  const { events, copy, couple } = config;
  const revealRef = useReveal<HTMLDivElement>();
  const [calendarNote, setCalendarNote] = useState("");
  const names = `${couple.partner1.firstName} & ${couple.partner2.firstName}`;
  const entries = events.flatMap((event) => {
    const entry = calendarEntry(event, names);
    return entry ? [entry] : [];
  });

  if (!events || events.length === 0) return null;

  const saveAll = () => {
    const saved = downloadCalendar("aanya-arjun-celebrations.ics", entries);
    setCalendarNote(saved ? "A calendar file is downloading to this device." : "");
  };

  return (
    <section id="celebrations" className="section section--paper" aria-label="Wedding celebrations">
      <div ref={revealRef} className="section-inner reveal">
        <SectionHeading
          kicker={copy.celebrationsKicker}
          title={copy.celebrationsHeading}
          lede={copy.celebrationsText}
        />
        {entries.length > 0 ? (
          <div className="chapter-save">
            <button type="button" className="quiet-button" onClick={saveAll}>
              Add the celebrations
            </button>
            {calendarNote ? <p className="calendar-note">{calendarNote}</p> : null}
          </div>
        ) : null}
        <div className="chapter-list">
          {events.map((event, index) => (
            <EventChapter key={event.name} event={event} index={index} names={names} />
          ))}
        </div>
      </div>
    </section>
  );
}
