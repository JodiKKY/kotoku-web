"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

const EASE = [0.22, 1, 0.36, 1] as const;

// Mobile menu: the links arrive one after another
const menuVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // The bar gets a little more compact once you leave the top, and back at the very top => Home
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      if (window.scrollY < 8) setActiveId("home");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy: highlight the link for the section currently in view
  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      {
        // A section becomes active when it crosses the upper-middle of the viewport
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu when the viewport grows to the desktop layout
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // While the mobile menu is open: Escape closes it, and so does a tap outside
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4">
        <motion.nav
          ref={navRef}
          aria-label="Main navigation"
          // One entrance on load, then the bar tightens up a little as you scroll
          initial={{ y: -28, opacity: 0, maxWidth: 1280, height: 72, marginTop: 20 }}
          animate={{
            y: 0,
            opacity: 1,
            maxWidth: scrolled ? 880 : 1280,
            height: scrolled ? 60 : 72,
            marginTop: scrolled ? 12 : 20,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 30 }}
          className={cn(
            "pointer-events-auto relative mx-auto w-full rounded-full",
            "border border-forest/10 bg-cream/80 backdrop-blur-xl",
            "transition-shadow duration-300",
            scrolled ? "shadow-lg shadow-forest/10" : "shadow-md shadow-forest/5"
          )}
        >
          <div className="flex h-full items-center justify-between pl-5 pr-2.5 md:grid md:grid-cols-[1fr_auto_1fr] md:pl-6 md:pr-3">
            <Link
              href="/"
              aria-label="Kotoku home"
              className={cn(
                "flex items-center justify-self-start rounded-full",
                "transition-opacity hover:opacity-80",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-forest focus-visible:ring-offset-2"
              )}
            >
              <Image
                src="/kotoku-logo.svg"
                alt="Kotoku"
                width={156}
                height={50}
                priority
                className="h-9 w-auto object-contain object-left"
              />
            </Link>

            {/* Desktop links: the underline marks the section you're in */}
            <div className="hidden items-center gap-8 text-sm font-semibold text-ink/70 md:flex">
              {NAV_LINKS.map((link) => {
                const isActive = activeId === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setActiveId(link.href.slice(1))}
                    className={cn("nav-link", isActive && "active")}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2">
              {/* The label rolls up and is replaced by a copy on hover */}
              <a
                href="#get-started"
                className="button button-gold group hidden items-center gap-2 sm:inline-flex"
              >
                <span className="relative block overflow-hidden leading-tight">
                  <span className="block transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                    Get early access
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 block translate-y-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                  >
                    Get early access
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>

              {/* Two lines that turn into a cross */}
              <button
                ref={menuButtonRef}
                type="button"
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full md:hidden",
                  "border border-forest/15 text-forest",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-forest focus-visible:ring-offset-2"
                )}
              >
                <span aria-hidden="true" className="relative block h-[14px] w-5">
                  <motion.span
                    className="absolute left-0 top-0 block h-[1.5px] w-full rounded-full bg-current"
                    animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                  <motion.span
                    className="absolute bottom-0 left-0 block h-[1.5px] w-full rounded-full bg-current"
                    animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                key="mobile-menu"
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ transformOrigin: "top center" }}
                className={cn(
                  "absolute inset-x-0 top-[calc(100%+0.5rem)] md:hidden",
                  "rounded-[28px] border border-forest/10 bg-cream/95 p-3",
                  "shadow-lg shadow-forest/10 backdrop-blur-xl"
                )}
              >
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-1"
                >
                  {NAV_LINKS.map((link) => {
                    const id = link.href.slice(1);
                    const isActive = activeId === id;
                    return (
                      <motion.a
                        key={link.href}
                        variants={itemVariants}
                        href={link.href}
                        aria-current={isActive ? "location" : undefined}
                        onClick={() => {
                          setActiveId(id);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-4 py-3.5",
                          "text-lg font-semibold tracking-tight transition-colors",
                          isActive ? "bg-forest/[0.08] text-forest" : "text-ink/70 hover:bg-forest/5"
                        )}
                      >
                        {link.label}
                        {isActive ? (
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-forest" />
                        ) : (
                          <ArrowUpRight size={18} aria-hidden="true" className="text-ink/30" />
                        )}
                      </motion.a>
                    );
                  })}
                  <motion.a
                    variants={itemVariants}
                    href="#get-started"
                    onClick={() => setOpen(false)}
                    className="button button-gold mt-2 inline-flex items-center justify-center gap-2"
                  >
                    Get early access
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </motion.a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </header>
    </MotionConfig>
  );
}