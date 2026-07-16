"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "./nav";
import Brand from "./Brand";
import ThemeToggle from "./ThemeToggle";
import { useData } from "./DataProvider";
import { updatedAt } from "@/lib/format";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1.5">
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 transition-colors ${
              active
                ? "bg-wash-2 text-ink"
                : "text-ink-3 hover:bg-wash-1 hover:text-ink-2"
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[var(--violet-bright)] to-[var(--cyan)]" />
            )}
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition-colors ${
                active
                  ? "border-[var(--border-violet)] bg-[var(--violet)]/15 text-[var(--violet-bright)]"
                  : "border-line bg-wash-1 text-ink-3 group-hover:text-ink-2"
              }`}
            >
              {item.icon}
            </span>
            <span className="text-[14px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const { timestamp } = useData();
  return (
    <div className="flex h-full flex-col">
      <div className="px-2 pb-6 pt-1">
        <Brand />
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto space-y-3 pt-6">
        <ThemeToggle />
        {timestamp && (
          <p className="px-2 text-[10px] leading-relaxed text-ink-muted">
            Atualizado em<br />
            <span className="text-ink-3">{updatedAt(timestamp)}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer on route change.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-[100dvh]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-line bg-[var(--bg-2)]/70 px-4 py-6 backdrop-blur-xl lg:flex">
        <SidebarInner />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-[var(--bg-2)]/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Brand size={34} />
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="grid h-10 w-10 place-items-center rounded-xl border border-line-2 bg-wash-1 text-ink-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[82%] max-w-[300px] flex-col border-r border-line-2 bg-[var(--bg-2)] px-4 py-6 shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="absolute right-3 top-5 grid h-9 w-9 place-items-center rounded-lg text-ink-3 hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <SidebarInner onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      {/* Content */}
      <main className="lg:pl-[264px]">
        <div className="mx-auto max-w-content px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
