import { forwardRef } from "react";
import config from "../data/weddingConfig";
import { useReveal } from "../lib/useReveal";
import { useParallax } from "../lib/useParallax";
import AtmosphericImage from "./AtmosphericImage";
import Countdown from "./Countdown";
import BotanicalSprig from "./BotanicalSprig";

const WelcomeSection = forwardRef<HTMLElement>((_, ref) => {
  const { copy, images, ceremony } = config;
  const revealRef = useReveal<HTMLDivElement>();
  const portraitRef = useParallax<HTMLImageElement>(14);

  return (
    <section
      id="welcome"
      ref={ref}
      className="section section--ivory welcome"
      tabIndex={-1}
      aria-label="Welcome"
    >
      <BotanicalSprig className="sprig--left" />
      <BotanicalSprig className="sprig--right" flip />

      <div ref={revealRef} className="section-inner welcome-grid reveal">
        <figure className="arch-frame">
          <AtmosphericImage
            className="welcome-portrait"
            imageRef={portraitRef}
            src={images.welcome}
            alt={images.welcomeAlt}
            width={864}
            height={1152}
          />
        </figure>

        <div className="welcome-copy">
          <p className="kicker">{copy.welcomeKicker}</p>
          <h2 className="section-title">{copy.welcomeHeading}</h2>
          <p className="script-line">{copy.welcomeScript}</p>
          <p className="lede">{copy.welcomeText}</p>
          <Countdown iso={ceremony.date} />
        </div>
      </div>
    </section>
  );
});

WelcomeSection.displayName = "WelcomeSection";

export default WelcomeSection;
