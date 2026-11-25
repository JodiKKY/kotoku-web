import { CreditCard, IdCard, Star } from "lucide-react";

type PassType = "bank" | "id" | "reward";

const meta = {
  bank: { icon: CreditCard, tag: "Kotoku Pay" },
  id: { icon: IdCard, tag: "Identity" },
  reward: { icon: Star, tag: "Rewards" },
} as const;

type WalletCardProps = {
  label: string;
  number: string;
  type?: PassType;
  className?: string;
};

/**
 * Standard card ratio (1.586). Self-contained: no custom CSS needed,
 * so the old `.wallet-card` rule in globals.css can be deleted.
 */
export function WalletCard({ label, number, type = "bank", className = "" }: WalletCardProps) {
  const { icon: Icon, tag } = meta[type];

  return (
    <div
      className={`flex aspect-[1.586] flex-col justify-between rounded-[20px] p-5 shadow-lg ring-1 ring-black/5 ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
          <Icon size={18} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-80">
          {tag}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="mt-1 text-xs opacity-75">{number}</p>
        </div>
        {type === "bank" && (
          <div aria-hidden="true" className="flex">
            <span className="h-6 w-6 rounded-full bg-[#E95D42]/90" />
            <span className="-ml-2.5 h-6 w-6 rounded-full bg-[#F5C14A]/90" />
          </div>
        )}
      </div>
    </div>
  );
}