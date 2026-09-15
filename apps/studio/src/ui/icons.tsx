import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

/** 16px grid, 1.5 stroke, round caps — one geometry for the whole chrome. */
function Icon({ children, ...props }: IconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const UndoIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M3 7h7.5a3 3 0 0 1 0 6H7" />
    <path d="M5.5 4.5 3 7l2.5 2.5" />
  </Icon>
);

export const RedoIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M13 7H5.5a3 3 0 0 0 0 6H9" />
    <path d="M10.5 4.5 13 7l-2.5 2.5" />
  </Icon>
);

export const SunIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="2.75" />
    <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.4 3.4l.85.85M11.75 11.75l.85.85M12.6 3.4l-.85.85M4.25 11.75l-.85.85" />
  </Icon>
);

export const MoonIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M13.2 9.6A5.6 5.6 0 1 1 6.4 2.8a4.4 4.4 0 0 0 6.8 6.8Z" />
  </Icon>
);

export const ContrastIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 2a6 6 0 0 1 0 12Z" fill="currentColor" stroke="none" />
  </Icon>
);

export const CodeIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M5.5 11 2.5 8l3-3M10.5 5l3 3-3 3M9.2 3.4 6.8 12.6" />
  </Icon>
);

export const CursorIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M3.5 2.2 12 7.1l-3.6.9-1.1 3.6Z" fill="currentColor" />
  </Icon>
);

export const FrameIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M5 1.5v13M11 1.5v13M1.5 5h13M1.5 11h13" />
  </Icon>
);

export const PlusIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M8 3.5v9M3.5 8h9" />
  </Icon>
);

export const MinusIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M3.5 8h9" />
  </Icon>
);

export const ChevronIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M6 4l4 4-4 4" />
  </Icon>
);

export const CopyIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <rect x="6" y="6" width="8" height="8" rx="1.6" />
    <path d="M3.5 10V3.6A1.6 1.6 0 0 1 5.1 2h5.3" />
  </Icon>
);

export const PasteIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <rect x="3" y="3" width="10" height="11" rx="1.6" />
    <path d="M6 3V2h4v1" />
  </Icon>
);

export const DuplicateIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <rect x="2" y="2" width="8.5" height="8.5" rx="1.6" />
    <path d="M13.5 5.5v7a1.5 1.5 0 0 1-1.5 1.5H5.5" />
  </Icon>
);

export const GroupIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M2 5V3.5A1.5 1.5 0 0 1 3.5 2H5M11 2h1.5A1.5 1.5 0 0 1 14 3.5V5M14 11v1.5a1.5 1.5 0 0 1-1.5 1.5H11M5 14H3.5A1.5 1.5 0 0 1 2 12.5V11" />
    <rect x="5.5" y="5.5" width="5" height="5" rx="1" />
  </Icon>
);

export const ArrowUpIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M8 13V3M4 7l4-4 4 4" />
  </Icon>
);

export const ArrowDownIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M8 3v10M4 9l4 4 4-4" />
  </Icon>
);

export const TrashIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M2.5 4h11M6 4V2.8h4V4M12.3 4l-.6 9.2H4.3L3.7 4" />
  </Icon>
);

export const ResetZoomIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" />
  </Icon>
);

/* Rail destinations. One drawing per panel, on the same 16px grid as the rest
   of the chrome so the rail does not read as a different toolkit. */

export const DocumentIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <rect x="2" y="2" width="12" height="12" rx="2" />
    <path d="M2 6h12M6 6v8" />
  </Icon>
);

export const InsertIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <rect x="2" y="2" width="5.2" height="5.2" rx="1.2" />
    <rect x="2" y="8.8" width="5.2" height="5.2" rx="1.2" />
    <rect x="8.8" y="2" width="5.2" height="5.2" rx="1.2" />
    <path d="M11.4 8.8v5.2M8.8 11.4h5.2" />
  </Icon>
);

export const DataIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <ellipse cx="8" cy="4" rx="5" ry="2" />
    <path d="M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2" />
  </Icon>
);

export const StylesIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="5.8" />
    <path d="M8 2.2a5.8 5.8 0 000 11.6 2.9 2.9 0 000-5.8 2.9 2.9 0 010-5.8z" />
  </Icon>
);

export const ChecksIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M8 1.8l5.2 2.1v3.5c0 3-2.1 5.4-5.2 6.1-3.1-.7-5.2-3.1-5.2-6.1V3.9z" />
    <path d="M5.9 7.9l1.5 1.5 2.8-2.9" />
  </Icon>
);

export const FitIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M2 5.6V2.6h3M14 5.6V2.6h-3M2 10.4v3h3M14 10.4v3h-3" />
    <rect x="5.6" y="5.6" width="4.8" height="4.8" rx="1" opacity="0.5" />
  </Icon>
);

export const PlayIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M4.5 2.8l8.2 5.2-8.2 5.2z" />
  </Icon>
);

export const TextIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M3.2 4.4V2.9h9.6v1.5M8 2.9v10.2M6.2 13.1h3.6" />
  </Icon>
);

export const ImageIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <rect x="2.2" y="3" width="11.6" height="10" rx="1.6" />
    <circle cx="6" cy="6.5" r="1.1" />
    <path d="M2.6 11.2l3.1-3a1.2 1.2 0 011.7 0l4 3.9" />
  </Icon>
);

export const SearchIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <circle cx="7.2" cy="7.2" r="4.4" />
    <path d="M10.5 10.5 13.5 13.5" />
  </Icon>
);

export const MoreIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <circle cx="3.4" cy="8" r=".9" fill="currentColor" stroke="none" />
    <circle cx="8" cy="8" r=".9" fill="currentColor" stroke="none" />
    <circle cx="12.6" cy="8" r=".9" fill="currentColor" stroke="none" />
  </Icon>
);

/** The contract: a box with a plug on its side. */
export const ApiIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <rect x="5.4" y="2.6" width="8.2" height="10.8" rx="1.6" />
    <path d="M5.4 5.6H2.4M5.4 8H2.4M5.4 10.4H2.4" />
  </Icon>
);

export const LinkedIcon = (p: IconProps): JSX.Element => (
  <Icon {...p}>
    <path d="M6.6 9.4a2.4 2.4 0 003.6.3l1.9-1.9a2.4 2.4 0 10-3.4-3.4l-1 1" />
    <path d="M9.4 6.6a2.4 2.4 0 00-3.6-.3l-1.9 1.9a2.4 2.4 0 103.4 3.4l1-1" />
  </Icon>
);
