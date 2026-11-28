import type { ReactNode } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";

type IPhoneFrameProps = {
  children: ReactNode;
  /** Describes the screen for screen readers, since the mockup is not real UI. */
  label: string;
  className?: string;
};


export function IPhoneFrame({ children, label, className = "" }: IPhoneFrameProps) {
  return (
    <div role="img" aria-label={label} className={`relative w-75 ${className}`}>
      {/* Side buttons: action, volume up, volume down, power */}
      <span aria-hidden="true" className="absolute -left-0.75 top-24 h-6.5 w-0.75 rounded-l-sm bg-[#2A352F]" />
      <span aria-hidden="true" className="absolute -left-0.75 top-35 h-12 w-0.75 rounded-l-sm bg-[#2A352F]" />
      <span aria-hidden="true" className="absolute -left-0.75 top-50 h-12 w-0.75 rounded-l-sm bg-[#2A352F]" />
      <span aria-hidden="true" className="absolute -right-0.75 top-40 h-19 w-0.75 rounded-r-sm bg-[#2A352F]" />

      {/* Metal edge */}
      <div className="rounded-[49px] bg-[linear-gradient(145deg,#56635B,#1A221E_40%,#2E3A33)] p-0.5 shadow-[0_40px_70px_-28px_rgba(23,58,43,0.55)]">
        {/* Black bezel */}
        <div className="rounded-[47px] bg-black p-2">
          {/* Screen */}
          <div
            className="relative aspect-393/852 overflow-hidden rounded-[39px] bg-[#FFFCF4] text-ink"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-2 z-30 h-6.5 w-22.5 -translate-x-1/2 rounded-full bg-black" />

            {/* Status bar */}
            <div className="absolute inset-x-0 top-0 z-20 flex h-11.5 items-center justify-between px-7 pt-1.5 text-[13px] font-semibold">
              <span>9:41</span>
              <span className="flex items-center gap-1.25">
                <Signal size={14} strokeWidth={2.4} />
                <Wifi size={14} strokeWidth={2.4} />
                <BatteryFull size={19} strokeWidth={2} />
              </span>
            </div>

            <div className="relative z-10 h-full pt-13.5">{children}</div>

            {/* Home indicator */}
            <div className="absolute bottom-1.75 left-1/2 z-30 h-1.25 w-25 -translate-x-1/2 rounded-full bg-ink/85" />
          </div>
        </div>
      </div>
    </div>
  );
}