import type { ReactNode } from "react";

export interface NavItem {
  href: string;
  label: string;
  kicker: string;
  icon: ReactNode;
}

const s = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const NAV: NavItem[] = [
  {
    href: "/",
    label: "Visão geral",
    kicker: "Bloco 01",
    icon: (
      <svg {...s}>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/criativos",
    label: "Criativos",
    kicker: "Bloco 02",
    icon: (
      <svg {...s}>
        <rect x="3" y="3" width="18" height="18" rx="2.5" />
        <circle cx="8.5" cy="8.5" r="1.6" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
  },
  {
    href: "/publico",
    label: "Público",
    kicker: "Bloco 03",
    icon: (
      <svg {...s}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />
      </svg>
    ),
  },
  {
    href: "/campanhas",
    label: "Campanhas",
    kicker: "Bloco 04",
    icon: (
      <svg {...s}>
        <path d="M3 3v18h18" />
        <path d="m7 15 3-4 3 3 5-7" />
        <path d="M18 7h3v3" />
      </svg>
    ),
  },
];
