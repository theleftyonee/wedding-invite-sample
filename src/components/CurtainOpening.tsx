import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";

const pauseMs = 550;
const glideMs = 1800;
const drape: [number, number, number, number] = [0.62, 0.04, 0.24, 1];

const glide: Transition = {
  x: { duration: glideMs / 1000, ease: drape },
  scaleX: { duration: glideMs / 1000, ease: drape },
  opacity: { duration: glideMs / 1000, times: [0, 0.72, 1], ease: "easeOut" },
};

export default function CurtainOpening() {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }

    const pause = window.setTimeout(() => setOpen(true), pauseMs);
    const finish = window.setTimeout(() => setGone(true), pauseMs + glideMs + 60);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGone(true);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(pause);
      window.clearTimeout(finish);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const panel = (side: "left" | "right") => {
    const outward = side === "left" ? "-102%" : "102%";
    return (
      <motion.div
        className={`curtain curtain--${side}`}
        initial={false}
        animate={
          open
            ? { x: outward, scaleX: 0.78, opacity: [1, 1, 0] }
            : { x: "0%", scaleX: 1, opacity: 1 }
        }
        transition={glide}
      >
        <img src="/assets/curtain-hem.jpg" alt="" decoding="async" />
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {gone ? null : (
        <motion.div
          className={open ? "curtain-stage is-opening" : "curtain-stage"}
          exit={{
            opacity: 0,
            pointerEvents: "none",
            transition: { duration: 0.4, ease: "easeOut" },
          }}
        >
          {panel("left")}
          {panel("right")}
          <button type="button" className="curtain-skip" onClick={() => setGone(true)}>
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
