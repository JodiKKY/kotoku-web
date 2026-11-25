"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { CreditCard, IdCard, Star, Ticket } from "lucide-react";
import { IPhoneFrame } from "@/components/iphone_frame";
import { WalletCard } from "@/components/wallet_card";
import { ListRow, TabBar } from "@/components/phone_parts";
import { EASE, MaskLines } from "@/components/motion_kit";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Add a card",
    description: "Enter the details once: a bank card, an ID, a loyalty card or a ticket.",
  },
  {
    number: "02",
    title: "Pin the ones you use",
    description: "Your most-used cards stay at the top of the stack.",
  },
  {
    number: "03",
    title: "Pull it up",
    description: "Open the card, check the number, close the app. No digging.",
  },
];

/* How long each step shows on mobile before moving to the next one */
const AUTOPLAY_MS = 5000;

function Screen({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0 px-3.5"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay: 0.18, ease: EASE } }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
    >
      {children}
    </motion.div>
  );
}

function AddScreen() {
  return (
    <>
      <h3 className="font-display text-[28px] font-semibold tracking-tight text-forest">Add a card</h3>
      <ul className="mt-4 overflow-hidden rounded-2xl bg-white">
        <ListRow icon={CreditCard} title="Bank card" sub="Debit or credit" tint="bg-sage" />
        <ListRow icon={IdCard} title="ID or membership" sub="Ghana Card, student ID" tint="bg-[#F8E3A7]" />
        <ListRow icon={Star} title="Loyalty card" sub="Any shop" tint="bg-[#E9EDE3]" />
        <ListRow icon={Ticket} title="Ticket" sub="Events, boarding passes" tint="bg-[#EAE5D8]" />
      </ul>
    </>
  );
}

/* The debit card slides out of the stack and takes the top spot */
function StackScreen() {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPinned(true), 650);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      id: "debit",
      label: "Debit card",
      number: "•••• 4582",
      className: "bg-forest text-cream",
      type: undefined,
      y: pinned ? 84 : 0,
      z: pinned ? 3 : 1,
    },
    {
      id: "ghana",
      label: "Ghana Card",
      number: "GHA-•••••••••-7",
      className: "bg-[#F7F3E8] text-forest",
      type: "id" as const,
      y: pinned ? 0 : 42,
      z: pinned ? 1 : 2,
    },
    {
      id: "loyalty",
      label: "Loyalty card",
      number: "Points · 2,840",
      className: "bg-gold text-forest",
      type: "reward" as const,
      y: pinned ? 42 : 84,
      z: pinned ? 2 : 3,
    },
  ];

  return (
    <>
      <h3 className="font-display text-[28px] font-semibold tracking-tight text-forest">Your cards</h3>
      <div className="relative mt-5 h-60">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="absolute inset-x-0 top-0"
            style={{ zIndex: card.z }}
            initial={false}
            animate={{ y: card.y }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
          >
            <WalletCard
              label={card.label}
              number={card.number}
              type={card.type}
              className={card.className}
            />
          </motion.div>
        ))}
      </div>
      <motion.p
        className="mt-2 text-center text-[12px] font-semibold text-forest/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: pinned ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        Debit card pinned to the top
      </motion.p>
    </>
  );
}

/* Numbers stay hidden until you tap. These are sample numbers, not real ones. */
function DetailScreen() {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <WalletCard label="Debit card" number="•••• 4582" className="bg-forest text-cream" />
      <div className="mt-4 overflow-hidden rounded-2xl bg-white text-[12.5px]">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-ink/55">Card number</span>
          <span className="font-semibold tabular-nums text-forest">
            {revealed ? "1234 5678 9012 4582" : "•••• •••• •••• 4582"}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-forest/10 px-4 py-3">
          <span className="text-ink/55">Expiry</span>
          <span className="font-semibold tabular-nums text-forest">{revealed ? "08/28" : "••/••"}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setRevealed((value) => !value)}
        className="mt-3 w-full rounded-2xl border border-forest/20 py-2.5 text-[13px] font-semibold text-forest transition-colors hover:bg-forest/5"
      >
        {revealed ? "Hide details" : "Tap to reveal"}
      </button>
    </>
  );
}

/* ---------- Section ---------- */

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const inView = useInView(sectionRef, { amount: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Mobile: step through the screens on a timer while the section is on screen.
  // Stops for good once the person taps a step, and never runs with reduced motion.
  useEffect(() => {
    if (desktop || !autoplay || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((current) => (current + 1) % steps.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [desktop, autoplay, inView]);

  // On desktop the section is tall and the phone stays pinned: scrolling moves through the steps
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!desktop) return;
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length))));
  });

  // Clicking a step: on desktop scroll to it, on mobile just switch to it
  function goTo(index: number) {
    const section = sectionRef.current;
    if (!desktop || !section) {
      setAutoplay(false);
      setActive(index);
      return;
    }
    const top = section.getBoundingClientRect().top + window.scrollY;
    const range = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + range * ((index + 0.5) / steps.length), behavior: "smooth" });
  }

  return (
    <MotionConfig reducedMotion="user">
      <section id="how-it-works" ref={sectionRef} className="relative bg-[#F4F1E7] md:h-[320vh]">
        <div className="md:sticky md:top-0 md:flex md:h-screen md:items-center md:overflow-hidden">
          {/*
            Mobile order: heading, phone, steps (so the phone is visible while you tap a step).
            Desktop: heading and steps in the left column, phone on the right.
          */}
          <div className="mx-auto grid w-full max-w-7xl items-center gap-y-8 px-5 py-16 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:gap-x-16 md:gap-y-0 md:py-0 lg:px-12">
            <h2 className="font-display max-w-xl text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-forest sm:text-5xl md:col-start-1 md:row-start-1 md:self-end">
              <MaskLines lines={["Stop digging through your bag.", "Open Kotoku instead."]} />
            </h2>

            <div className="mx-auto w-full min-w-0 max-w-85 justify-self-center md:col-start-2 md:row-span-2 md:row-start-1 [&>*]:mx-auto">
              <IPhoneFrame label={`Kotoku app, step ${active + 1}: ${steps[active].title}`}>
                <div className="relative h-93 overflow-hidden">
                  <AnimatePresence initial={false}>
                    {active === 0 && (
                      <Screen key="add">
                        <AddScreen />
                      </Screen>
                    )}
                    {active === 1 && (
                      <Screen key="stack">
                        <StackScreen />
                      </Screen>
                    )}
                    {active === 2 && (
                      <Screen key="detail">
                        <DetailScreen />
                      </Screen>
                    )}
                  </AnimatePresence>
                </div>
                <TabBar />
              </IPhoneFrame>
            </div>

            <div className="relative md:col-start-1 md:row-start-2 md:mt-14 md:self-start">
              {/* The line beside the steps fills as you scroll (desktop only) */}
              <div
                className="absolute bottom-2 left-0 top-2 hidden w-px bg-forest/15 md:block"
                aria-hidden="true"
              >
                <motion.span style={{ scaleY: fill }} className="block h-full w-px origin-top bg-forest" />
              </div>

              <ol className="space-y-2 md:space-y-10 md:pl-8">
                {steps.map((step, index) => {
                  const on = index === active;
                  return (
                    <li key={step.number}>
                      <button
                        type="button"
                        onClick={() => goTo(index)}
                        aria-current={on ? "step" : undefined}
                        className={cn(
                          "block min-h-12 w-full rounded-2xl border px-4 py-3 text-left transition-all duration-500",
                          "md:min-h-0 md:rounded-none md:border-0 md:bg-transparent md:p-0",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-4",
                          on
                            ? "border-forest/25 bg-white opacity-100 shadow-sm md:shadow-none"
                            : "border-transparent opacity-70 md:opacity-35 md:hover:opacity-60"
                        )}
                      >
                        <span className="flex items-baseline gap-3 md:block">
                          <span className="font-display text-sm font-semibold tabular-nums text-forest/50">
                            {step.number}
                          </span>
                          <span className="font-display block text-xl font-semibold tracking-[-0.01em] text-forest md:mt-1 md:text-3xl">
                            {step.title}
                          </span>
                        </span>
                        {/* Only the current step is open, on every screen size */}
                        <span
                          className={cn(
                            "grid transition-[grid-template-rows] duration-500",
                            on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          )}
                        >
                          <span className="overflow-hidden">
                            <span className="mt-2 block max-w-sm text-sm leading-6 text-ink/65 md:mt-3">
                              {step.description}
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              {/* Progress dots, mobile only */}
              <div className="mt-5 flex justify-center gap-2 md:hidden" aria-hidden="true">
                {steps.map((step, index) => (
                  <span
                    key={step.number}
                    className={cn(
                      "h-1.5 rounded-full bg-forest transition-all duration-500",
                      index === active ? "w-6 opacity-100" : "w-1.5 opacity-25"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}