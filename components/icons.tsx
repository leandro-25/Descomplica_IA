import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  fill?: string;
}

const createIcon = (paths: React.ReactNode) => ({
  size = 20,
  className = '',
  strokeWidth = 2,
  fill = 'none',
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {paths}
  </svg>
);

export const Icons = {
  Wand2: createIcon([
    <path key="1" d="M15 4V2" />,
    <path key="2" d="M15 16v-2" />,
    <path key="3" d="M8 9h2" />,
    <path key="4" d="M20 9h2" />,
    <path key="5" d="M17.8 11.8 19 13" />,
    <path key="6" d="M15 9h.01" />,
    <path key="7" d="M17.8 6.2 19 5" />,
    <path key="8" d="M12 4 10.5 5.5" />,
    <path key="9" d="M10.89 15.51 10 18" />,
    <path key="10" d="M8 14 6 16" />,
    <path key="11" d="M6 18H4" />,
    <path key="12" d="M16 14l2 2" />,
    <path key="13" d="M18 16h2" />,
  ]),

  Plus: createIcon([
    <path key="1" d="M5 12h14" />,
    <path key="2" d="M12 5v14" />,
  ]),

  Trash2: createIcon([
    <polyline key="1" points="3 6 5 6 21 6" />,
    <path key="2" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
    <line key="3" x1="10" y1="11" x2="10" y2="17" />,
    <line key="4" x1="14" y1="11" x2="14" y2="17" />,
  ]),

  CheckCircle2: createIcon([
    <circle key="1" cx="12" cy="12" r="10" />,
    <path key="2" d="M9 12l2 2 4-4" />,
  ]),

  Circle: createIcon([
    <circle key="1" cx="12" cy="12" r="10" />,
  ]),

  Flame: createIcon([
    <path key="1" d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
  ]),

  ChevronDown: createIcon([
    <path key="1" d="m6 9 6 6 6-6" />,
  ]),

  ChevronRight: createIcon([
    <path key="1" d="m9 18 6-6-6-6" />,
  ]),

  Loader2: createIcon(
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />,
    { strokeWidth: 2.5 }
  ),

  Clock: createIcon([
    <circle key="1" cx="12" cy="12" r="10" />,
    <path key="2" d="M12 6v6l4 2" />,
  ]),

  ShieldCheck: createIcon([
    <path key="1" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    <path key="2" d="M9 12l2 2 4-4" />,
  ]),

  Timer: createIcon([
    <line key="1" x1="10" y1="14" x2="10" y2="20" />,
    <line key="2" x1="14" y1="10" x2="15.54" y2="5.46" />,
    <circle key="3" cx="12" cy="12" r="8" />,
  ]),

  Zap: createIcon([
    <polygon key="1" points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  ]),

  CalendarDays: createIcon([
    <rect key="1" x="3" y="4" width="18" height="18" rx="2" ry="2" />,
    <line key="2" x1="16" y1="2" x2="16" y2="6" />,
    <line key="3" x1="8" y1="2" x2="8" y2="6" />,
    <line key="4" x1="3" y1="10" x2="21" y2="10" />,
    <path key="5" d="M8 14h.01" />,
    <path key="6" d="M12 14h.01" />,
    <path key="7" d="M16 14h.01" />,
    <path key="8" d="M8 18h.01" />,
    <path key="9" d="M12 18h.01" />,
    <path key="10" d="M16 18h.01" />,
  ]),

  Sparkles: createIcon([
    <path key="1" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M17.657 6.343l.707-.707m-13.314 11.314l.707.707" />,
  ]),

  Copy: createIcon([
    <rect key="1" x="9" y="9" width="13" height="13" rx="2" ry="2" />,
    <path key="2" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />,
  ]),

  Check: createIcon([
    <polyline key="1" points="20 6 9 17 4 12" />,
  ]),

  LayoutList: createIcon([
    <rect key="1" x="3" y="3" width="18" height="18" rx="2" ry="2" />,
    <line key="2" x1="9" y1="9" x2="20" y2="9" />,
    <line key="3" x1="9" y1="15" x2="20" y2="15" />,
    <line key="4" x1="9" y1="21" x2="20" y2="21" />,
  ]),

  MessageCircleQuestion: createIcon([
    <path key="1" d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
    <path key="2" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />,
    <path key="3" d="M12 17h.01" />,
  ]),

  AlignLeft: createIcon([
    <line key="1" x1="17" y1="10" x2="3" y2="10" />,
    <line key="2" x1="21" y1="6" x2="3" y2="6" />,
    <line key="3" x1="21" y1="14" x2="3" y2="14" />,
    <line key="4" x1="21" y1="18" x2="3" y2="18" />,
  ]),

  ListPlus: createIcon([
    <path key="1" d="M11 17H7" />,
    <path key="2" d="M11 12H7" />,
    <path key="3" d="M11 7H7" />,
    <path key="4" d="M16 19V17" />,
    <path key="5" d="M15 18H17" />,
    <line key="6" x1="21" y1="12" x2="12" y2="12" />,
    <line key="7" x1="21" y1="6" x2="12" y2="6" />,
    <line key="8" x1="21" y1="18" x2="12" y2="18" />,
  ]),

  ArrowRight: createIcon([
    <line key="1" x1="5" y1="12" x2="19" y2="12" />,
    <path key="2" d="m12 5 7 7-7 7" />,
  ]),

  Compass: createIcon([
    <circle key="1" cx="12" cy="12" r="10" />,
    <polygon key="2" points="12 2 15 9 12 16 9 9" />,
  ]),

  ThumbsUp: createIcon([
    <path key="1" d="M7 13.73V21" />,
    <path key="2" d="M15 11.29V21" />,
    <path key="3" d="M11 8.79V21" />,
    <path key="4" d="M19 8.69V21" />,
    <path key="5" d="M22 16.92 19 21" />,
    <path key="6" d="M3 17.35 5 21" />,
  ]),

  ThumbsDown: createIcon([
    <path key="1" d="M17 10.27v8.73" />,
    <path key="2" d="M9 12.71v8.29" />,
    <path key="3" d="M13 15.21v5.79" />,
    <path key="4" d="M5 15.31v8.69" />,
    <path key="5" d="M2 11.08l3-4.08" />,
    <path key="6" d="M21 7.65l-3 4.08" />,
  ]),

  Award: createIcon([
    <circle key="1" cx="12" cy="8" r="6" />,
    <path key="2" d="M20.66 5.34A10 10 0 0 1 12 18" />,
    <path key="3" d="M3.34 5.34A10 10 0 0 0 12 18" />
  ]),

  Info: createIcon([
    <circle key="1" cx="12" cy="12" r="10" />,
    <path key="2" d="M12 16v-4" />,
    <path key="3" d="M12 8h.01" />,
  ]),
};

export type IconName = keyof typeof Icons;