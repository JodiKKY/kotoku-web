"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/*
  Headline lines that rise out of a hidden strip, one after another.
  Put it inside your own <h1>/<h2>; it only renders the lines.
  onLoad = play straight away (hero). Otherwise it plays when scrolled into view.
*/
export function MaskLines({
  lines,
  delay = 0,
  stagger = 0.12,
  onLoad = false,
}: {
  lines: ReactNode[];
  delay?: number;
  stagger?: number;
  onLoad?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <>
      {lines.map((line, i) => (
        // Extra bottom/right room so descenders and italics aren't clipped by the strip
        <span key={i} className="mb-[-0.14em] block overflow-hidden pb-[0.14em] pr-[0.1em]">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "108%" }}
            {...(onLoad
              ? { animate: { y: 0 } }
              : { whileInView: { y: 0 }, viewport: { once: true, margin: "-12% 0px" } })}
            transition={{ duration: 0.95, delay: delay + i * stagger, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/* A soft fade-in for the text that follows a headline. Use sparingly. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  onLoad = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  onLoad?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      {...(onLoad
        ? { animate: { opacity: 1, y: 0 } }
        : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-10% 0px" } })}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* A hairline that draws itself from the left when it scrolls into view */
export function LineDraw({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      className={`block origin-left ${className}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    />
  );
}

/* A button that leans toward the cursor, then settles back */
export function Magnetic({
  children,
  strength = 0.28,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/* A panel that grows to full size and settles as you scroll to it (tied to the scroll, not a timer) */
export function ScrollScale({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, 0]);

  return (
    <motion.div ref={ref} style={{ scale, y }} className={className}>
      {children}
    </motion.div>
  );
}