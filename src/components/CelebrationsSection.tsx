import { useState } from "react";
import config, { type WeddingEvent } from "../data/weddingConfig";
import { directionsHref, isPlaceholder } from "../lib/placeholder";
import { downloadCalendar, parseInstant, type CalendarEntry } from "../lib/schedule";
import { useReveal } from "../lib/useReveal";
import AtmosphericImage from "./AtmosphericImage";
import SectionHeading from "./SectionHeading";

const tones = ["mehendi", "sangeet", "ceremony", "reception"] as const;

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

export default function CelebrationsSection() {
  const { events, copy, couple } = config;
  const revealRef = useReveal<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const [calendarNote, setCalendarNote] = useState("");
  const names = `${couple.partner1.firstName} & ${couple.partner2.firstName}`;
  const event = events[active];

  if (!events || events.length === 0 || !event) return null;

  const entry = calendarEntry(event, names);
  const directions = directionsHref(event.venue, "");
  const hasDate = !isPlaceholder(event.date);
  const hasTime = !isPlaceholder(event.time);
  const hasVenue = !isPlaceholder(event.venue);
  const hasDress = !isPlaceholder(event.dressCode);

  const saveEvent = () => {
    if (!entry) return;
    const saved = downloadCalendar(`${event.name.toLowerCase().replace(/\s+/g, "-")}.ics`, [entry]);
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

        <div className="event-index" role="tablist" aria-label="Celebrations">
          {events.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.name}
                type="button"
                role="tab"
                className={`event-row${selected ? " is-selected" : ""}`}
                aria-selected={selected}
                aria-controls="event-sheet"
                id={`event-tab-${index}`}
                onClick={() => {
                  setActive(index);
                  setCalendarNote("");
                }}
              >
                <img src={item.image} alt="" width={72} height={72} loading="lazy" decoding="async" />
                <span>
                  <strong>{item.name}</strong>
                  <em>{isPlaceholder(item.date) ? "Date to follow" : item.date}</em>
                </span>
              </button>
            );
          })}
        </div>

        <article
          id="event-sheet"
          role="tabpanel"
          aria-labelledby={`event-tab-${active}`}
          className={`event-sheet event-sheet--${tones[active] ?? "mehendi"}`}
        >
          <figure className="event-sheet-media">
            <AtmosphericImage src={event.image} alt={event.imageAlt} width={864} height={1080} />
          </figure>
          <div className="event-sheet-copy">
            <p className="chapter-index">0{active + 1}</p>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <dl>
              <div>
                <dt>Date</dt>
                <dd>{hasDate ? event.date : "Details to follow."}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{hasTime ? event.time : "Details to follow."}</dd>
              </div>
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
            <div className="chapter-actions">
              {entry ? (
                <button type="button" className="text-link" onClick={saveEvent}>
                  Add to calendar
                </button>
              ) : null}
              {directions ? (
                <a className="text-link" href={directions} target="_blank" rel="noopener noreferrer">
                  Directions
                </a>
              ) : null}
            </div>
            {calendarNote ? <p className="calendar-note">{calendarNote}</p> : null}
          </div>
        </article>
      </div>
    </section>
  );
}
