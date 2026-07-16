"use client";

export interface MetricOption {
  key: string;
  label: string;
}

/** Pill selector — lets the user choose which metric a chart displays. */
export default function MetricToggle<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-[12px]";
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            aria-pressed={active}
            className={`rounded-full border font-medium transition ${pad} ${
              active
                ? "border-[var(--border-violet)] bg-[var(--violet)]/15 text-ink"
                : "border-line bg-wash-1 text-ink-3 hover:text-ink-2"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
