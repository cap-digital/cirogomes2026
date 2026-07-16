/** Abstract brand mark — a diagonal ribbon echoing the reference report, no lettering. */
export default function Brand({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative shrink-0 overflow-hidden rounded-[12px] ring-1 ring-white/12"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#241a52] to-[#120c2c]" />
        <div className="absolute -inset-2 rotate-[38deg]">
          <div className="absolute left-1/2 top-0 h-full w-[26%] -translate-x-[130%] bg-gradient-to-b from-[#8b7be8] to-[#6c56cf]" />
          <div className="absolute left-1/2 top-0 h-full w-[18%] translate-x-[10%] bg-gradient-to-b from-[#4fd6e6] to-[#1f97ab] opacity-90" />
        </div>
      </div>
      <div className="leading-tight">
        <p className="text-[15px] font-semibold tracking-tight text-ink">
          Ciro Gomes <span className="text-gradient-violet">2026</span>
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-3">
          Mídia digital
        </p>
      </div>
    </div>
  );
}
