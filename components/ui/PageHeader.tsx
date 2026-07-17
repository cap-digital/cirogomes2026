import type { ReactNode } from "react";

/** Clean page header — just the page name, plus an optional meta pill. */
export default function PageHeader({
  title,
  meta,
}: {
  title: string;
  meta?: ReactNode;
}) {
  return (
    <header className="animate-in relative z-20 mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-[clamp(1.7rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight">
        {title}
      </h1>
      {meta && <div className="shrink-0">{meta}</div>}
    </header>
  );
}

export function RangePill({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-wash-1 px-4 py-2 text-sm text-ink-2">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_10px_2px_rgba(79,214,230,0.6)]" />
      {children}
    </div>
  );
}
