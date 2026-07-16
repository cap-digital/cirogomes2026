import type { ReactNode } from "react";

/** Footer takeaway callout, echoing the reference report's summary line. */
export default function Insight({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="card animate-in flex items-start gap-4 p-5 sm:p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--border-violet)] bg-[var(--violet)]/12 text-[var(--violet-bright)]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" />
        </svg>
      </span>
      <p className="text-[14px] leading-relaxed text-ink-2 sm:text-[15px]">{children}</p>
    </div>
  );
}

export function Hi({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}
