import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import config from "../data/weddingConfig";
import { isPlaceholder } from "../lib/placeholder";
import CelebrationsSection from "./CelebrationsSection";
import Countdown from "./Countdown";
import FooterSection from "./FooterSection";
import GallerySection from "./GallerySection";
import MonogramBadge from "./MonogramBadge";
import Navigation from "./Navigation";
import RsvpSection from "./RsvpSection";
import ScrollIndicator from "./ScrollIndicator";
import VenueSection from "./VenueSection";
import WelcomeSection from "./WelcomeSection";

export default function OpeningScreen() {
  const [isOpened, setIsOpened] = useState(false);
  const [heroFailed, setHeroFailed] = useState(false);
  const welcomeRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpened(true);

    requestAnimationFrame(() => {
      window.setTimeout(() => {
        const welcome = welcomeRef.current;
        if (!welcome) return;
        welcome.scrollIntoView({
          behavior: prefersReducedMotion.current ? "auto" : "smooth",
          block: "start",
        });
        welcome.focus({ preventScroll: true });
      }, prefersReducedMotion.current ? 0 : 150);
    });
  }, []);

  const { couple, ceremony, copy, images } = config;
  const showDate = !isPlaceholder(ceremony.displayDate);
  const showVenue = !isPlaceholder(ceremony.venue);
  const heroStyle = {
    "--hero-image": heroFailed ? "none" : `url("${images.hero}")`,
  } as CSSProperties;

  return (
    <>
      <section
        className={`hero${heroFailed ? " hero--fallback" : ""}`}
        style={heroStyle}
        aria-label="Wedding invitation cover"
      >
        {heroFailed ? null : (
          <>
            <div className="hero-bleed" aria-hidden="true" />
            <img
              className="hero-media"
              src={images.hero}
              alt={images.heroAlt}
              width={720}
              height={1280}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={() => setHeroFailed(true)}
            />
          </>
        )}
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-stage">
          <div className="hero-names animate-fade-in-up">
            <MonogramBadge
              initial1={couple.partner1.initial}
              initial2={couple.partner2.initial}
            />
          </div>
          <div className="hero-title-slot">
            <h1 className="hero-title animate-fade-in-up">
              <span>{couple.partner1.firstName}</span>
              <span className="hero-amp">&amp;</span>
              <span>{couple.partner2.firstName}</span>
            </h1>
          </div>

          <div className="hero-bottom animate-fade-in-up" style={{ animationDelay: "240ms" }}>
            <div className="hero-card">
              <p className="kicker">{copy.openingLine}</p>
              <p className="hero-invite">{copy.invitationText}</p>
              {showDate || showVenue ? (
                <>
                  <div className="hero-rule" aria-hidden="true" />
                  <p className="hero-meta">
                    {showDate ? ceremony.displayDate : null}
                    {showDate && showVenue ? " · " : null}
                    {showVenue ? `${ceremony.venue}${isPlaceholder(ceremony.city) ? "" : `, ${ceremony.city}`}` : null}
                  </p>
                </>
              ) : (
                <div className="hero-rule" aria-hidden="true" />
              )}
              <Countdown iso={ceremony.date} variant="compact" />
              <button
                type="button"
                className="invitation-button"
                onClick={handleOpen}
                aria-label={isOpened ? "Continue to the welcome" : "Open the wedding invitation"}
              >
                {isOpened ? "Continue" : "Open Invitation"}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>
            <ScrollIndicator tone={heroFailed ? "ink" : "light"} />
          </div>
        </div>
      </section>

      {isOpened ? (
        <>
          <Navigation />
          <WelcomeSection ref={welcomeRef} />
          <CelebrationsSection />
          <VenueSection />
          <GallerySection />
          <RsvpSection />
          <FooterSection />
        </>
      ) : null}
    </>
  );
}
