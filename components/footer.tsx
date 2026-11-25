"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <motion.footer className="border-t border-forest/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <a href="#home" aria-label="Kotoku home" className="inline-flex items-center">
          <Image
            src="/kotoku-logo.svg"
            alt="Kotoku"
            width={130}
            height={42}
            className="h-9 w-auto object-contain object-left"
          />
        </a>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-ink/60">
          <a href="#features" className="hover:text-forest">Features</a>
          <a href="#how-it-works" className="hover:text-forest">How it works</a>
          <a href="#security" className="hover:text-forest">Privacy</a>
          <a href="mailto:hello@kotoku.app" className="hover:text-forest">Contact</a>
        </nav>
        <div className="flex flex-col gap-1 text-xs text-ink/45 md:items-end">
          <p>© {year ?? ""} Kotoku. Made for everyday life.</p>
          <p>
            Developed by{" "}
            <a
              href="https://osd-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink/60 hover:text-forest"
            >
              OSD
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}