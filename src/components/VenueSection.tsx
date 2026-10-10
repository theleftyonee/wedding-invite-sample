import config from "../data/weddingConfig";
import { directionsHref, isPlaceholder } from "../lib/placeholder";
import { useReveal } from "../lib/useReveal";
import AtmosphericImage from "./AtmosphericImage";

export default function VenueSection() {
  const { ceremony, guestInfo, images, contact, copy } = config;
  const revealRef = useReveal<HTMLDivElement>();

  const hasVenue = !isPlaceholder(ceremony.venue);
  const hasCity = !isPlaceholder(ceremony.city);
  const hasAddress = !isPlaceholder(ceremony.fullAddress);
  const mapHref = directionsHref(
    [ceremony.venue, ceremony.fullAddress, ceremony.city].filter((part) => !isPlaceholder(part)).join(", "),
    ceremony.mapUrl,
  );
  const hasAccommodation = !isPlaceholder(guestInfo.accommodation);
  const hasTravel = !isPlaceholder(guestInfo.travel);
  const hasDressCode = !isPlaceholder(guestInfo.dressCode);
  const hasContactName = !isPlaceholder(contact.name);
  const hasContactEmail = !isPlaceholder(contact.email);
  const hasContactPhone = !isPlaceholder(contact.phone);
  const hasContact = hasContactName || hasContactEmail || hasContactPhone;
  const hasNotes = hasAccommodation || hasTravel || hasDressCode || hasContact;

  return (
    <section id="venue" className="section venue-feature" aria-label="Venue and guest information">
      <AtmosphericImage
        className="venue-feature-media"
        src={images.venue}
        alt={images.venueAlt}
        width={1280}
        height={720}
      />
      <div className="venue-feature-scrim" aria-hidden="true" />

      <div ref={revealRef} className="venue-feature-inner reveal">
        <p className="kicker">{copy.venueKicker}</p>
        <h2 className="section-title">{copy.venueHeading}</h2>
        <p className="lede">{copy.venueText}</p>

        <div className="venue-panel">
          <h3 className="kicker">Location</h3>
          {hasVenue ? <p className="venue-place">{ceremony.venue}</p> : <p className="quiet-line">Details to follow.</p>}
          {hasAddress || hasCity ? (
            <p className="venue-address">
              {hasAddress ? <span className="block">{ceremony.fullAddress}</span> : null}
              {hasCity ? <span className="block">{ceremony.city}</span> : null}
            </p>
          ) : null}
          {mapHref ? (
            <a className="text-link" href={mapHref} target="_blank" rel="noopener noreferrer">
              Get directions
            </a>
          ) : null}

          {hasNotes ? (
            <div className="note-list">
              {hasAccommodation ? (
                <div>
                  <h3>Accommodation</h3>
                  <p>{guestInfo.accommodation}</p>
                </div>
              ) : null}
              {hasTravel ? (
                <div>
                  <h3>Travel</h3>
                  <p>{guestInfo.travel}</p>
                </div>
              ) : null}
              {hasDressCode ? (
                <div>
                  <h3>Dress</h3>
                  <p>{guestInfo.dressCode}</p>
                </div>
              ) : null}
              {hasContact ? (
                <div>
                  <h3>Queries</h3>
                  <p>
                    {hasContactName ? <span className="block">{contact.name}</span> : null}
                    {hasContactEmail ? <span className="block">{contact.email}</span> : null}
                    {hasContactPhone ? <span className="block">{contact.phone}</span> : null}
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="quiet-line">Notes on stay, travel, and dress will follow.</p>
          )}
        </div>

        <p className="atmosphere-note">{copy.atmosphereNote}</p>
      </div>
    </section>
  );
}
