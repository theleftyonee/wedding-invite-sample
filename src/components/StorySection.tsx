import config from "../data/weddingConfig";
import { useReveal } from "../lib/useReveal";

export default function StorySection() {
  const { story, couple } = config;
  const revealRef = useReveal<HTMLDivElement>();

  if (!story || story.length === 0) return null;

  return (
    <section id="story" className="section section--ink story" aria-label="Sample story">
      <div ref={revealRef} className="section-inner reveal">
        <p className="kicker">A sample story</p>
        <h2 className="section-title">Our story</h2>
        <p className="lede">
          Sample placeholders only. These are not moments from the life of {couple.partner1.firstName} and {couple.partner2.firstName}.
        </p>
        <ol className="story-line">
          {story.map((mark, index) => (
            <li key={mark.title} className={`story-mark stagger-${index + 1}`}>
              <img src={mark.image} alt={mark.imageAlt} width={96} height={96} loading="lazy" decoding="async" />
              <div>
                <p className="story-label">{mark.label}</p>
                <h3>{mark.title}</h3>
                <p>{mark.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
