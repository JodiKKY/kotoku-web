"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { CreditCard, IdCard, Plus, Star } from "lucide-react";
import { IPhoneFrame } from "@/components/iphone_frame";
import { WalletCard } from "@/components/wallet_card";
import { ListRow, TabBar } from "@/components/phone_parts";

type CardId = "debit" | "loyalty" | "id";

type CardInfo = {
  label: string;
  masked: string;
  revealed: string;
  type?: "reward" | "id";
  cardClass: string;
  icon: LucideIcon;
  tint: string;
};

/* The numbers shown when a card is tapped are placeholders, not real data. */
const CARDS: Record<CardId, CardInfo> = {
  debit: {
    label: "Debit card",
    masked: "•••• 4582",
    revealed: "0000 0000 0000 4582",
    cardClass: "bg-forest text-cream",
    icon: CreditCard,
    tint: "bg-sage",
  },
  loyalty: {
    label: "Loyalty card",
    masked: "Points · 2,840",
    revealed: "Member · 2840",
    type: "reward",
    cardClass: "bg-gold text-forest",
    icon: Star,
    tint: "bg-[#E9EDE3]",
  },
  id: {
    label: "Ghana Card",
    masked: "GHA-•••••••••-7",
    revealed: "GHA-000000000-7",
    type: "id",
    cardClass: "bg-[#F7F3E8] text-forest",
    icon: IdCard,
    tint: "bg-[#F7E5B7]",
  },
};

/* Depth 0 is the back of the stack, the last slot is the card in front. */
const SLOTS = ["top-0 z-10", "top-[56px] z-20", "top-[112px] z-30"];

const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;

export function HeroPhone() {
  const [order, setOrder] = useState<CardId[]>(["debit", "loyalty", "id"]);
  const [revealed, setRevealed] = useState<CardId | null>(null);
  const [moved, setMoved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const front = order[order.length - 1];

  function handleTap(id: CardId) {
    clearTimeout(timer.current);

    if (id !== front) {
      // Pull the tapped card to the front of the stack
      setOrder((prev) => [...prev.filter((c) => c !== id), id]);
      setRevealed(null);
      setMoved(true);
      return;
    }

    // Front card: peek at the number, then hide it again
    if (revealed === id) {
      setRevealed(null);
      return;
    }
    setRevealed(id);
    timer.current = setTimeout(() => setRevealed(null), 3000);
  }

  const recent = [...order].reverse().slice(0, 2);

  const hint = revealed
    ? "It hides itself again in a few seconds."
    : moved
      ? "Tap the front card to peek at its number."
      : "Tap a card to pull it out.";

  return (
    <div className="flex flex-col items-center">
      <IPhoneFrame
        className="phone-shell"
        label="Kotoku app showing a stack of cards: a debit card, a loyalty card and a Ghana Card"
      >
        <div className="px-[14px]">
          <div className="flex items-center justify-between">
            <h3 className="text-[28px] font-bold tracking-tight text-forest">Wallet</h3>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage text-forest">
              <Plus size={18} />
            </span>
          </div>

          {/* Stacked cards, like the iOS Wallet */}
          <div className="relative mt-4 h-[272px]">
            {order.map((id, depth) => {
              const card = CARDS[id];
              const isFront = id === front;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTap(id)}
                  aria-label={
                    isFront
                      ? `${card.label}. ${revealed === id ? "Hide" : "Show"} the number`
                      : `Bring ${card.label} to the front`
                  }
                  style={cssVars({ "--d": `${350 + depth * 150}ms` })}
                  className={`card-drop absolute inset-x-0 block cursor-pointer rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-forest/60 focus-visible:ring-offset-2 active:brightness-95 motion-safe:transition-[top] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)] ${SLOTS[depth]}`}
                >
                  <WalletCard
                    label={card.label}
                    number={revealed === id ? card.revealed : card.masked}
                    type={card.type}
                    className={card.cardClass}
                  />
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-[13px] font-semibold text-ink/50">Recently used</p>
          <ul className="mt-2 overflow-hidden rounded-2xl bg-white">
            {recent.map((id) => {
              const card = CARDS[id];
              return (
                <ListRow
                  key={id}
                  icon={card.icon}
                  title={card.label}
                  sub={card.masked}
                  tint={card.tint}
                />
              );
            })}
          </ul>
        </div>
        <TabBar />
      </IPhoneFrame>

      <p className="mt-4 text-xs font-medium text-forest/60" aria-live="polite">
        {hint}
      </p>
    </div>
  );
}