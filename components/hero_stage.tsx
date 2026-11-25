"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { HeroPhone } from "@/components/hero_phone";
import { WalletCard } from "@/components/wallet_card";
import { EASE } from "@/components/motion_kit";

/*
  One layer of depth. Pointer moves shift it (further = more), and scrolling
  lifts it at its own speed, so the cards, the phone and the page all drift apart.
*/
function Layer({
  depth,
  rise,
  sx,
  sy,
  scroll,
  children,
}: {
  depth: number;
  rise: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  scroll: MotionValue<number>;
  children: ReactNode;
}) {
  const x = useTransform(sx, [-0.5, 0.5], [depth, -depth]);
  const y = useTransform(
    [sy, scroll],
    (latest: number[]) => -latest[0] * 2 * depth + latest[1] * rise
  );

  return <motion.div style={{ x, y }}>{children}</motion.div>;
}

export function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Pointer position across the stage, from -0.5 (left/top) to 0.5 (right/bottom)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 20, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 80, damping: 20, mass: 0.7 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // A small 3D tilt on the phone, following the cursor
  const tiltY = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const tiltX = useTransform(sy, [-0.5, 0.5], [3, -3]);

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    px.set(0);
    py.set(0);
  }

  // With reduced motion on, nothing follows the cursor or the scroll
  const k = reduce ? 0 : 1;

  // Cards start tucked behind the phone, then spring out to their places
  const fan = (fromX: number, delay: number) => ({
    initial: reduce ? false : { opacity: 0, x: fromX, scale: 0.86 },
    animate: { opacity: 1, x: 0, scale: 1 },
    transition: { type: "spring" as const, stiffness: 70, damping: 15, delay },
  });

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="hero-art relative mx-auto flex min-h-[560px] w-full max-w-[620px] items-center justify-center md:min-h-[700px]"
    >
      {/* Debit card, upper left */}
      <div
        className="float-card absolute left-[2%] top-[18%] z-20 hidden w-[205px] -rotate-[14deg] sm:block"
        aria-hidden="true"
      >
        <Layer depth={34 * k} rise={-50 * k} sx={sx} sy={sy} scroll={scrollYProgress}>
          <motion.div {...fan(90, 0.6)}>
            <WalletCard label="Debit card" number="•••• 4582" className="bg-forest text-cream" />
          </motion.div>
        </Layer>
      </div>

      {/* Loyalty card, lower left */}
      <div
        className="float-card absolute bottom-[16%] left-[0%] z-20 hidden w-[205px] -rotate-[7deg] sm:block"
        aria-hidden="true"
      >
        <Layer depth={46 * k} rise={-90 * k} sx={sx} sy={sy} scroll={scrollYProgress}>
          <motion.div {...fan(90, 0.75)}>
            <WalletCard
              label="Loyalty card"
              number="Points · 2,840"
              type="reward"
              className="bg-gold text-forest"
            />
          </motion.div>
        </Layer>
      </div>

      {/* Ghana Card, right */}
      <div
        className="float-card absolute right-[0%] top-[22%] z-20 hidden w-[190px] rotate-[10deg] sm:block"
        aria-hidden="true"
      >
        <Layer depth={40 * k} rise={-70 * k} sx={sx} sy={sy} scroll={scrollYProgress}>
          <motion.div {...fan(-90, 0.9)}>
            <WalletCard
              label="Ghana Card"
              number="GHA-•••••••••-7"
              type="id"
              className="bg-[#F7F3E8] text-forest"
            />
          </motion.div>
        </Layer>
      </div>

      {/* The phone rises first, stays upright, and only tilts a few degrees */}
      <motion.div
        className="relative z-10 py-4"
        initial={reduce ? false : { opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
      >
        <Layer depth={9 * k} rise={-26 * k} sx={sx} sy={sy} scroll={scrollYProgress}>
          <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}>
            <HeroPhone />
          </motion.div>
        </Layer>
      </motion.div>
    </div>
  );
}