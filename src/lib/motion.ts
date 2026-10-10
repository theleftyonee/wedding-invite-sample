import type { Transition, Variants } from "motion/react";

export const easeOut = [0.22, 0.61, 0.36, 1] as const;

export const rise: Transition = {
  duration: 0.75,
  ease: easeOut,
};

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 36 : -36,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -36 : 36,
    opacity: 0,
  }),
};

export const slideTransition: Transition = {
  duration: 0.32,
  ease: easeOut,
};
