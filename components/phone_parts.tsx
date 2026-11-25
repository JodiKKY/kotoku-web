import type { LucideIcon } from "lucide-react";
import { ChevronRight, CreditCard, UserRound, Wallet } from "lucide-react";

/*
  Shared by the hero phone (a client component) and the cards phone (server).
  Keep this file free of hooks and "use client" so both can import it.
*/

export function ListRow({
  icon: Icon,
  title,
  sub,
  tint,
}: {
  icon: LucideIcon;
  title: string;
  sub: string;
  tint: string;
}) {
  return (
    <li className="flex items-center gap-3 border-b border-ink/5 px-3 py-2.5 last:border-0">
      <span className={`flex h-9 w-9 items-center justify-center rounded-[10px] text-forest ${tint}`}>
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-ink">{title}</span>
        <span className="block text-[11px] text-ink/55">{sub}</span>
      </span>
      <ChevronRight size={16} className="text-ink/30" />
    </li>
  );
}

export function TabBar() {
  const tabs = [
    { icon: Wallet, label: "Wallet", active: true },
    { icon: CreditCard, label: "Cards", active: false },
    { icon: UserRound, label: "You", active: false },
  ];

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex justify-around border-t border-ink/10 bg-[#FFFCF4]/85 px-4 pb-5.5 pt-2.5 backdrop-blur-xl">
      {tabs.map(({ icon: Icon, label, active }) => (
        <div
          key={label}
          className={`flex w-16 flex-col items-center gap-0.75 ${active ? "text-forest" : "text-ink/45"}`}
        >
          <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
          <span className="text-[10px] font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}