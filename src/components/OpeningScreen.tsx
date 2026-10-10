import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import config from "../data/weddingConfig";
import { fadeRise, rise } from "../lib/motion";
import { isPlaceholder } from "../lib/placeholder";
import CelebrationsSection from "./CelebrationsSection";
import CurtainOpening from "./CurtainOpening";
import Countdown from "./Countdown";
import FooterSection from "./FooterSection";
import GallerySection from "./GallerySection";
import MonogramBadge from "./MonogramBadge";
import Navigation from "./Navigation";
import RsvpSection from "./RsvpSection";
import ScrollIndicator from "./ScrollIndicator";
import StorySection from "./StorySection";
import VenueSection from "./VenueSection";
import WelcomeSection from "./WelcomeSection";

export default function OpeningScreen() {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [heroFailed, setHeroFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [musicOn, setMusicOn] = useState(true);
  const welcomeRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicPaused = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      prefersReducedMotion.current = media.matches;
      setReducedMotion(media.matches);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || musicPaused.current) return false;
    audio.volume = 0.4;
    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Browsers may refuse audible autoplay until the first user gesture.
    const gestures = ["pointerdown", "keydown", "touchend"] as const;
    const onGesture = (event: Event) => {
      const target = event.target as Element | null;
      if (target?.closest?.(".sound-toggle")) return;
      void playMusic().then((playing) => {
        if (playing) detach();
      });
    };
    const detach = () => {
      gestures.forEach((name) => window.removeEventListener(name, onGesture, true));
    };
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) audio.pause();
      else void playMusic();
    };

    // Only one open copy of the invitation should play at a time: the tab that
    // starts playing asks every other tab to fall silent.
    const music = audioRef.current;
    const tabId = Math.random().toString(36).slice(2);
    const channel = "BroadcastChannel" in window ? new BroadcastChannel("wedding-music") : null;
    const onPlay = () => channel?.postMessage(tabId);
    const onOtherTab = (message: MessageEvent<string>) => {
      if (message.data === tabId) return;
      music?.pause();
      musicPaused.current = true;
      setMusicOn(false);
      detach();
    };
    music?.addEventListener("play", onPlay);
    channel?.addEventListener("message", onOtherTab);

    gestures.forEach((name) => window.addEventListener(name, onGesture, true));
    document.addEventListener("visibilitychange", onVisibility);
    void playMusic().then((playing) => {
      if (playing) detach();
    });

    return () => {
      detach();
      document.removeEventListener("visibilitychange", onVisibility);
      music?.removeEventListener("play", onPlay);
      channel?.close();
    };
  }, [playMusic]);

  const toggleMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      musicPaused.current = true;
      setMusicOn(false);
      return;
    }
    musicPaused.current = false;
    setMusicOn(true);
    await playMusic();
  }, [musicOn, playMusic]);

  const handleOpen = useCallback(() => {
    setIsOpening(true);
    setIsOpened(true);
    void playMusic();

    requestAnimationFrame(() => {
      window.setTimeout(() => {
        const welcome = welcomeRef.current;
        if (!welcome) return;
        welcome.scrollIntoView({
          behavior: prefersReducedMotion.current ? "auto" : "smooth",
          block: "start",
        });
        welcome.focus({ preventScroll: true });
      }, prefersReducedMotion.current ? 0 : 280);
    });
  }, [playMusic]);

  const { couple, ceremony, copy, images } = config;
  const showDate = !isPlaceholder(ceremony.displayDate);
  const showVenue = !isPlaceholder(ceremony.venue);
  const heroStyle = {
    "--hero-image": heroFailed ? "none" : `url("${images.hero}")`,
  } as CSSProperties;

  return (
    <>
      <audio ref={audioRef} src={config.audio} loop preload="auto" />
      {reducedMotion ? null : <CurtainOpening />}
      <button
        type="button"
        className={`sound-toggle${musicOn ? " is-on" : ""}`}
        onClick={() => void toggleMusic()}
        aria-pressed={!musicOn}
        aria-label="Mute the music"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2.5 6.2h2.2L8 3.4v9.2L4.7 9.8H2.5V6.2Z" fill="currentColor" />
          {musicOn ? (
            <path d="M10 5.4c.8.7 1.2 1.6 1.2 2.6S10.8 9.9 10 10.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          ) : (
            <path d="M10.2 6.1 13.4 9.9M13.4 6.1 10.2 9.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          )}
        </svg>
      </button>
      <section
        className={`hero${heroFailed ? " hero--fallback" : ""}${isOpening ? " is-opening" : ""}`}
        style={heroStyle}
        aria-label="Wedding invitation cover"
      >
        {heroFailed ? null : (
          <>
            <div className="hero-bleed" aria-hidden="true" />
            {reducedMotion ? (
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
            ) : (
              <video
                className="hero-media"
                src={images.heroVideo}
                poster={images.hero}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label={images.heroAlt}
                onError={() => setHeroFailed(true)}
              />
            )}
          </>
        )}
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-stage">
          <motion.div
            className="hero-names"
            variants={fadeRise}
            initial="hidden"
            animate="show"
            transition={{ ...rise, delay: 0.08 }}
          >
            <MonogramBadge
              initial1={couple.partner1.initial}
              initial2={couple.partner2.initial}
            />
          </motion.div>
          <div className="hero-title-slot">
            <motion.h1
              className="hero-title"
              variants={fadeRise}
              initial="hidden"
              animate="show"
              transition={{ ...rise, delay: 0.28 }}
            >
              <span>{couple.partner1.firstName}</span>
              <span className="hero-amp">&amp;</span>
              <span>{couple.partner2.firstName}</span>
            </motion.h1>
          </div>

          <motion.div
            className="hero-bottom"
            variants={fadeRise}
            initial="hidden"
            animate="show"
            transition={{ ...rise, delay: 0.52 }}
          >
            <div className="hero-copy">
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
          </motion.div>
        </div>
      </section>
      {isOpening ? <div className="open-veil" aria-hidden="true" /> : null}

      {isOpened ? (
        <>
          <Navigation />
          <WelcomeSection ref={welcomeRef} />
          <StorySection />
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
