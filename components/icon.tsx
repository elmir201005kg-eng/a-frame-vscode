import type { ReactNode, SVGProps } from "react";

const paths = {
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  "eye-off": <><path d="m3 3 18 18M10.6 5.1 12 5c6.5 0 10 7 10 7a20 20 0 0 1-3.1 4.2M6.1 6.1A20 20 0 0 0 2 12s3.5 7 10 7a12 12 0 0 0 5.9-1.9M10 10a3 3 0 0 0 4 4" /></>,
  settings: <><path d="m10 3-1 3-3 1-2 3 2 2v3l3 2 1 3h4l1-3 3-2v-3l2-2-2-3-3-1-1-3h-4Z" /><circle cx="12" cy="12" r="3" /></>,
  logout: <><path d="M9 4H4v16h5M9 12h12m-4-4 4 4-4 4" /></>,
  "arrow-up-right": <path d="M7 17 17 7M7 7h10v10" />,
  "arrow-right": <path d="M4 12h16m-6-6 6 6-6 6" />,
  "arrow-left": <path d="M20 12H4m6-6-6 6 6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /><circle cx="9" cy="7" r="4" /></>,
  user: <><circle cx="12" cy="7" r="4" /><path d="M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2" /></>,
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />,
  x: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />,
  whatsapp: <><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.1-4.9A8.5 8.5 0 1 1 20.5 11.5Z" /><path d="m8 7 1.5 3-1 1a8 8 0 0 0 3.5 3.5l1-1 3 1.5c0 1.2-1 2-2.2 2C10.1 17 7 13.9 7 10.2 7 9 7.2 7.5 8 7Z" /></>,
  telegram: <><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" /><path d="m6 11.5 12-5-3 11-4-3-2 2 .5-4L15 9l-6 3.5-3-1Z" fill="var(--background)" stroke="var(--background)" strokeWidth=".7" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18Z" /></>,
  mountain: <><path d="m3 20 8-16 10 16H3Z" /><path d="m8 10 3 3 3-3" /></>,
  tree: <><path d="m12 3-5 6h3l-5 6h4l-5 5h16l-5-5h4l-5-6h3l-5-6ZM12 20v2" /></>,
  leaf: <><path d="M20 4c-8-2-16 1-16 8a7 7 0 0 0 7 7c7 0 10-7 9-15Z" /><path d="M4 21 16 9" /></>,
  shield: <><path d="m12 3 8 4v6c0 5-8 9-8 9s-8-4-8-9V7l8-4Z" /><path d="m8.5 12 2.5 2.5 4.5-4.5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2m-3-9-1.5 1.5M6.5 17.5 5 19m0-16 1.5 1.5m11 13L19 19" /></>,
  wifi: <><path d="M2 8.8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 3.2a6 6 0 0 1 8 0" /><circle cx="12" cy="19" r=".7" fill="currentColor" /></>,
  parking: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></>,
  bath: <><path d="M3 13h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3ZM6 13V5a2 2 0 0 1 4 0m-2 0h4M6 20v2m12-2v2" /></>,
  bed: <><path d="M3 18v3m18-3v3M3 18h18V9H3v9ZM5 9V4h14v5M12 4v5" /></>,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" /><path d="M9 21v-8h6v8" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  waves: <path d="M2 6c3-3 5 3 8 0s5 3 8 0 4 0 4 0M2 12c3-3 5 3 8 0s5 3 8 0 4 0 4 0M2 18c3-3 5 3 8 0s5 3 8 0 4 0 4 0" />,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m16.2 7.8-2.8 5.6-5.6 2.8 2.8-5.6 5.6-2.8Z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  star: <path d="m12 3 2.8 5.7 6.3.9-4.55 4.43L17.62 21 12 18.05 6.38 21l1.07-6.97L2.9 9.6l6.3-.9L12 3Z" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {paths[name]}
    </svg>
  );
}
