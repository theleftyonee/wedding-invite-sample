import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import config from "../data/weddingConfig";
import { isPlaceholder } from "../lib/placeholder";
import { useReveal } from "../lib/useReveal";
import AtmosphericImage from "./AtmosphericImage";
import SectionHeading from "./SectionHeading";

type ReplyState = "idle" | "demo" | "sent";

export default function RsvpSection() {
  const { rsvp, copy, gallery } = config;
  const { maxGuestsPerInvitation, formEndpoint, deadline } = rsvp;
  const isPreview = !formEndpoint;
  const revealRef = useReveal<HTMLDivElement>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reply, setReply] = useState<ReplyState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [attendance, setAttendance] = useState<"accepts" | "declines" | "">("");

  const hasDeadline = !isPlaceholder(deadline);
  const portrait = gallery[2] ?? gallery[0];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");

    const formData = new FormData(event.currentTarget);
    const guestName = String(formData.get("guestName") ?? "").trim();
    const attending = String(formData.get("attendance") ?? "");

    if (!guestName || !attending) {
      setErrorMsg("Please add your name, and say whether you can attend.");
      return;
    }

    if (isPreview) {
      setReply("demo");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setReply("sent");
    } catch {
      setErrorMsg("Something went wrong. Please try again, or write to the family directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="section section--ivory" aria-label="RSVP">
      <div ref={revealRef} className="section-inner rsvp-layout reveal">
        {portrait ? (
          <figure className="arch-frame">
            <AtmosphericImage src={portrait.src} alt={portrait.alt} width={1152} height={864} />
          </figure>
        ) : null}

        <div className="rsvp-form">
          <SectionHeading
            kicker={copy.rsvpKicker}
            title={copy.rsvpHeading}
            lede={`${copy.rsvpText}${hasDeadline ? ` Please reply by ${deadline}.` : ""}`}
          />

          {isPreview ? (
            <p className="preview-note">Preview only. This page does not send your reply.</p>
          ) : null}

          {reply === "demo" ? (
            <div className="reply-panel" role="status" aria-live="polite">
              <h3>With thanks</h3>
              <p>This is a preview. Your response was not sent.</p>
            </div>
          ) : null}

          {reply === "sent" ? (
            <div className="reply-panel" role="status" aria-live="polite">
              <h3>Thank you</h3>
              <p>Your response has been graciously received.</p>
            </div>
          ) : null}

          {reply === "idle" ? (
            <form onSubmit={handleSubmit} noValidate>
              {errorMsg ? (
                <p className="form-error" role="alert">
                  {errorMsg}
                </p>
              ) : null}

              <div className="fields">
                <div className="field">
                  <label className="field-label" htmlFor="guestName">
                    Guest name
                  </label>
                  <input
                    id="guestName"
                    name="guestName"
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    placeholder="Your name"
                    aria-required="true"
                    aria-invalid={errorMsg ? true : undefined}
                  />
                </div>

                <fieldset className="field">
                  <legend className="field-label" id="attendance-label">
                    Attendance
                  </legend>
                  <div className="choices" role="radiogroup" aria-labelledby="attendance-label">
                    <motion.label whileTap={{ scale: 0.985 }} className={`choice${attendance === "accepts" ? " is-selected" : ""}`}>
                      <input
                        type="radio"
                        name="attendance"
                        value="accepts"
                        onChange={() => setAttendance("accepts")}
                      />
                      Joyfully accepts
                    </motion.label>
                    <motion.label whileTap={{ scale: 0.985 }} className={`choice${attendance === "declines" ? " is-selected" : ""}`}>
                      <input
                        type="radio"
                        name="attendance"
                        value="declines"
                        onChange={() => setAttendance("declines")}
                      />
                      Regretfully declines
                    </motion.label>
                  </div>
                </fieldset>

                {attendance === "accepts" && maxGuestsPerInvitation > 1 ? (
                  <div className="field">
                    <label className="field-label" htmlFor="guestCount">
                      Guests attending
                    </label>
                    <select id="guestCount" name="guestCount" defaultValue="1">
                      {Array.from({ length: maxGuestsPerInvitation }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {attendance === "accepts" ? (
                  <div className="field">
                    <label className="field-label" htmlFor="dietary">
                      Meal preference <span className="optional">optional</span>
                    </label>
                    <select id="dietary" name="dietary" defaultValue="">
                      <option value="">No preference yet</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Jain">Jain</option>
                      <option value="Non-vegetarian">Non-vegetarian</option>
                    </select>
                  </div>
                ) : null}

                {attendance ? (
                  <div className="field">
                    <label className="field-label" htmlFor="message">
                      A note <span className="optional">optional</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      maxLength={500}
                      placeholder={
                        attendance === "declines"
                          ? "A wish, if you would like to send one"
                          : "A wish, or a song you hope to hear"
                      }
                    />
                  </div>
                ) : null}
              </div>

              <button type="submit" className="invitation-button" disabled={isSubmitting}>
                {isSubmitting ? "Sending" : "Submit reply"}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </section>
  );
}
