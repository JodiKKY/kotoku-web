import {
  CreditCard,
  Fingerprint,
  IdCard,
  LockKeyhole,
  ShieldCheck,
  Star,
  Ticket,
  UserRound,
} from "lucide-react";
import { HeroStage } from "@/components/hero_stage";
import { HowItWorks } from "@/components/how_it_works";
import { LineDraw, MaskLines, Reveal, ScrollScale } from "@/components/motion_kit";

const essentials = [
  {
    icon: CreditCard,
    title: "Bank cards",
    description: "Debit and credit cards, with numbers hidden until you tap.",
    tone: "sage",
  },
  {
    icon: IdCard,
    title: "IDs & memberships",
    description: "Ghana Card, student ID, gym pass.",
    tone: "gold",
  },
  {
    icon: UserRound,
    title: "Personal details",
    description: "Emergency contact, next of kin, the numbers you can never remember.",
    tone: "cream",
  },
  {
    icon: Star,
    title: "Loyalty cards",
    description: "Every shop’s card in one place, so the keyring can go.",
    tone: "sage",
  },
  {
    icon: Ticket,
    title: "Tickets & documents",
    description: "Event tickets, boarding passes, and the paper you keep needing.",
    tone: "gold",
  },
];

/*
  Replace these with what the app really does before launch.
  They describe the intended design, not shipped behaviour.
*/
const privacyPoints = [
  {
    icon: Fingerprint,
    title: "Unlock with Face ID or fingerprint",
    description: "Card numbers stay hidden until you unlock the app.",
  },
  {
    icon: LockKeyhole,
    title: "Masked by default",
    description: "You see •••• 4582, not the full number, until you tap to reveal it.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing is shared without you",
    description: "A card only leaves your phone when you choose to send it.",
  },
];

const toneClass: Record<string, string> = {
  gold: "bg-[#F8E3A7]",
  sage: "bg-[#DCE9DA]",
  cream: "bg-[#EAE5D8]",
};

export default function HomePage() {
  return (
    <main className="relative isolate overflow-x-clip bg-cream pt-20 text-ink">
      {/* Soft paper grain over the whole page: stops flat colour looking digital */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Hero: one sequence on load. Headline lines rise, the copy follows, the cards fan out from behind the phone. */}
      <section
        id="home"
        className="relative mx-auto grid min-h-170 w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 md:grid-cols-[0.92fr_1.08fr] md:gap-4 md:px-12 md:pb-28 md:pt-8"
      >
        <div className="relative z-10 max-w-xl">
          <h1 className="font-display max-w-162.5 text-[clamp(3.3rem,7vw,6.3rem)] font-medium leading-[0.98] tracking-[-0.04em] text-forest">
            <MaskLines onLoad delay={0.1} stagger={0.14} lines={["Your pocket,", "minus the clutter."]} />
          </h1>

          <Reveal onLoad delay={0.55} className="mt-8 max-w-md">
            <p className="text-base leading-7 text-ink/70 sm:text-lg sm:leading-8">
              Bank cards, your Ghana Card, loyalty cards and tickets in one app, so you can stop
              emptying your bag to find them.
            </p>
          </Reveal>

          <Reveal onLoad delay={0.7} className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#get-started" className="button button-green">
              Get early access
            </a>
            <a href="#features" className="button button-outline">
              See what it holds
            </a>
          </Reveal>

          <Reveal onLoad delay={0.85}>
            <p className="mt-8 text-sm text-ink/55">Early access, made in Ghana.</p>
          </Reveal>
        </div>

        <HeroStage />
      </section>

      {/* What it holds: a plain list. Each divider draws itself as you reach it. */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28 lg:px-12">
        <h2 className="font-display max-w-2xl text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-forest sm:text-5xl">
          <MaskLines lines={["Everything you carry,", "in one app."]} />
        </h2>

        <ul className="mt-12 md:mt-16">
          {essentials.map(({ icon: Icon, title, description, tone }, index) => (
            <li key={title} className="group relative">
              <LineDraw className="absolute inset-x-0 top-0 h-px bg-forest/15" delay={index * 0.08} />
              <div className="grid items-center gap-4 py-8 md:grid-cols-[1.1fr_1fr] md:gap-12 md:py-10">
                <div className="flex items-center gap-5">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-forest ${toneClass[tone]}`}
                  >
                    <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-3xl font-medium tracking-[-0.03em] text-forest motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-2 md:text-[2.6rem]">
                    {title}
                  </h3>
                </div>
                <p className="max-w-sm text-base leading-7 text-ink/65">{description}</p>
              </div>
            </li>
          ))}
          <li aria-hidden="true">
            <LineDraw className="h-px bg-forest/15" delay={essentials.length * 0.08} />
          </li>
        </ul>
      </section>

      {/* How it works: the phone stays pinned while the steps scroll past */}
      <HowItWorks />

      {/* Security: the panel grows to full size as you scroll to it */}
      <section id="security" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <ScrollScale>
          <div className="relative overflow-hidden rounded-4xl bg-forest px-6 py-12 text-cream shadow-[0_40px_80px_-40px_rgba(14,52,36,0.7)] sm:px-10 md:px-14 md:py-16">
            <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
              <h2 className="font-display max-w-sm text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-[2.7rem]">
                <MaskLines lines={["Your cards stay", "behind a lock."]} />
              </h2>

              <ul>
                {privacyPoints.map(({ icon: Icon, title, description }, index) => (
                  <li key={title} className="relative">
                    <LineDraw
                      className="absolute inset-x-0 top-0 h-px bg-cream/15"
                      delay={index * 0.1}
                    />
                    <div className="flex gap-5 py-7">
                      <span className="mt-0.5 shrink-0 text-gold">
                        <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold">{title}</h3>
                        <p className="mt-1 max-w-md text-sm leading-6 text-cream/70">{description}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollScale>
      </section>

      {/* Call to action */}
      <section id="get-started" className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="cta-panel relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 overflow-hidden rounded-4xl bg-[#E9EEDC] px-6 py-12 sm:px-10 md:flex-row md:items-center md:px-14 md:py-16">
          <div className="relative z-10 max-w-lg">
            <h2 className="font-display text-4xl font-medium leading-[1.04] tracking-[-0.04em] text-forest sm:text-[3.4rem]">
              <MaskLines lines={["Be one of the", "first to try it."]} />
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-ink/70">
              Kotoku is still being built. Send a message if you want to try it when it’s ready.
            </p>
          </div>
          <div className="relative z-10">
            <a
              href="mailto:hello@kotoku.app?subject=Early%20access%20to%20Kotoku"
              className="button button-green"
            >
              Ask for early access
            </a>
            <p className="mt-3 text-xs text-ink/60">hello@kotoku.app</p>
          </div>

          {/* The Kotoku K, drawn stroke by stroke as the panel scrolls into view */}
          <svg
            aria-hidden="true"
            viewBox="0 0 160 160"
            className="k-draw pointer-events-none absolute -bottom-12 -right-8 hidden w-[320px] text-forest/10 md:block"
            fill="none"
            stroke="currentColor"
            strokeWidth="18"
            strokeLinecap="round"
          >
            <line pathLength={1} x1="56" y1="42" x2="56" y2="118" />
            <line pathLength={1} x1="64" y1="82" x2="108" y2="44" />
            <line pathLength={1} x1="66" y1="80" x2="110" y2="118" />
          </svg>
        </div>
      </section>
    </main>
  );
}