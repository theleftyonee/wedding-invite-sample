import { motion } from "motion/react";
import { useState } from "react";
import { easeOut } from "../lib/motion";
import config from "../data/weddingConfig";
import MonogramBadge from "./MonogramBadge";

export default function FooterSection() {
  const { couple, copy, images } = config;
  const [copied, setCopied] = useState(false);
  const [shareNote, setShareNote] = useState("");

  const markCopied = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setShareNote("");
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setShareNote("Copy the address from the browser bar.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${couple.partner1.firstName} & ${couple.partner2.firstName}`,
      text: "You are invited to our wedding celebration.",
      url: window.location.href,
    };

    if (!navigator.share) {
      await markCopied();
      return;
    }

    try {
      if (navigator.canShare && !navigator.canShare(shareData)) {
        throw new Error("Cannot share");
      }
      await navigator.share(shareData);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        await markCopied();
      }
    }
  };

  return (
    <footer className="closing" aria-label="Closing">
      <img
        className="closing-media"
        src={images.closing}
        alt=""
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
      />
      <div className="closing-scrim" aria-hidden="true" />

      <motion.div
        className="closing-inner"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <p className="kicker" style={{ color: "rgba(247,242,233,0.78)" }}>
          {copy.closingKicker}
        </p>
        <MonogramBadge
          initial1={couple.partner1.initial}
          initial2={couple.partner2.initial}
          tone="light"
        />
        <h2>{copy.closingHeading}</h2>
        <p className="closing-lede">{copy.closingText}</p>

        <div className="closing-actions">
          <button type="button" className="ghost-button" onClick={handleShare}>
            Share invitation
          </button>
          <button type="button" className="ghost-button" onClick={markCopied}>
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>

        {shareNote ? <p className="closing-names">{shareNote}</p> : null}
        <p className="closing-names">
          {couple.partner1.firstName} &amp; {couple.partner2.firstName}
        </p>
      </motion.div>
    </footer>
  );
}
