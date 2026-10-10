import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type MouseEvent, type TouchEvent } from "react";
import config from "../data/weddingConfig";
import { easeOut } from "../lib/motion";
import { useReveal } from "../lib/useReveal";
import ArchPlaceholder from "./ArchPlaceholder";
import SectionHeading from "./SectionHeading";

export default function GallerySection() {
  const { gallery, copy } = config;
  const revealRef = useReveal<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    if (failed[index]) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    setActiveIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    previousFocusRef.current?.focus();
  }, []);

  const goToNext = useCallback((event?: MouseEvent) => {
    event?.stopPropagation();
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      const next = Math.min(gallery.length - 1, prev + 1);
      return failed[next] ? prev : next;
    });
  }, [failed, gallery.length]);

  const goToPrev = useCallback((event?: MouseEvent) => {
    event?.stopPropagation();
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      const next = Math.max(0, prev - 1);
      return failed[next] ? prev : next;
    });
  }, [failed]);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") goToNext();
      if (event.key === "ArrowLeft") goToPrev();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, closeLightbox, goToNext, goToPrev]);

  const handleTouchStart = (event: TouchEvent) => {
    setTouchStart(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = event.changedTouches[0]?.clientX ?? touchStart;
    const diff = touchStart - touchEnd;
    if (diff > 50) goToNext();
    if (diff < -50) goToPrev();
    setTouchStart(null);
  };

  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="gallery" className="section section--paper" aria-label="Gallery">
      <div ref={revealRef} className="section-inner reveal">
        <SectionHeading
          kicker={copy.galleryKicker}
          title={copy.galleryHeading}
          lede={copy.galleryText}
        />

        <div className="gallery-grid">
          {gallery.map((still, index) => {
            const className = `gallery-cell g-${index}`;
            if (failed[index]) {
              return (
                <div key={still.src} className={`${className} gallery-static`}>
                  <ArchPlaceholder label={still.alt} />
                </div>
              );
            }

            return (
              <button
                key={still.src}
                type="button"
                className={className}
                onClick={() => openLightbox(index)}
                aria-label={`View larger: ${still.alt}`}
              >
                <img
                  src={still.src}
                  alt={still.alt}
                  width={index === 0 ? 864 : 1152}
                  height={index === 0 ? 1152 : 864}
                  loading="lazy"
                  decoding="async"
                  onError={() => setFailed((current) => ({ ...current, [index]: true }))}
                />
              </button>
            );
          })}
        </div>

        <p className="atmosphere-note">{copy.atmosphereNote}</p>
      </div>

      <AnimatePresence>
      {activeIndex !== null ? (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded photograph"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: easeOut }}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close photograph"
            autoFocus
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {activeIndex > 0 ? (
            <button
              type="button"
              className="lightbox-nav lightbox-nav--prev"
              onClick={goToPrev}
              aria-label="Previous photograph"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                <path d="M15 5L8 12l7 7" />
              </svg>
            </button>
          ) : null}

          {activeIndex < gallery.length - 1 ? (
            <button
              type="button"
              className="lightbox-nav lightbox-nav--next"
              onClick={goToNext}
              aria-label="Next photograph"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : null}

          <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
            <img
              src={gallery[activeIndex].src}
              alt={gallery[activeIndex].alt}
            />
            <figcaption className="lightbox-count">
              {activeIndex + 1} / {gallery.length}
            </figcaption>
          </figure>
        </motion.div>
      ) : null}
      </AnimatePresence>
    </section>
  );
}
