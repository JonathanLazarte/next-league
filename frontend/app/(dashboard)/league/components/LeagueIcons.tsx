import React from 'react';

export function TrueDamageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 9l10 13 10-13-10-7zm0 3.3L18.4 9 12 17.6 5.6 9 12 5.3z" />
    </svg>
  );
}

export function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 19h14a1 1 0 0 0 1-1v-1H4v1a1 1 0 0 0 1 1zm14.6-11.3a1 1 0 0 0-1.4.3L15.3 13l-2.6-6.4a1 1 0 0 0-1.8 0L8.2 13 5.4 8a1 1 0 0 0-1.4-.3 1 1 0 0 0-.4 1.4l3.5 7.9h10.8l3.5-7.9a1 1 0 0 0-.4-1.4z" />
    </svg>
  );
}

export function MasksIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.5 3h-15C3.1 3 2 4.1 2 5.5v7c0 4.1 3.4 7.5 7.5 7.5.9 0 1.8-.2 2.5-.5.7.3 1.6.5 2.5.5 4.1 0 7.5-3.4 7.5-7.5v-7c0-1.4-1.1-2.5-2.5-2.5zM6 8c.8 0 1.5.7 1.5 1.5S6.8 11 6 11s-1.5-.7-1.5-1.5S5.2 8 6 8zm1.5 6.5c-.8.8-2.2.8-3 0l-1-1c1.4-1.4 3.6-1.4 5 0l-1 1zm10.5-3.5c-.8 0-1.5-.7-1.5-1.5S17.2 8 18 8s1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm1 4.5l-1-1c-.8.8-2.2.8-3 0l-1 1c1.4 1.4 3.6 1.4 5 0z" />
    </svg>
  );
}

export function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 4h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v2a4 4 0 0 0 4 4h.4a7 7 0 0 0 4.6 4.6V19H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-1.4a7 7 0 0 0 4.6-4.6h.4a4 4 0 0 0 4-4V7a3 3 0 0 0-3-3zM5 10a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1h1v4H5zm14 0h-1V6h1a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2z" />
    </svg>
  );
}

export function PatchNotesIcon({
  className,
  width,
  height,
}: {
  className?: string;
  width?: number | string;
  height?: number | string;
}) {
  return (
    <svg
      className={className}
      width={width ?? 18}
      height={height ?? 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function RpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 13 14" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.63343 2.25848L6.5001 0.600098L4.36676 2.25848V8.25781L6.5001 9.7405L8.63343 8.25781V2.25848ZM12.0468 6.1152L12.9001 5.49383L10.3401 3.11553V9.11486L7.35343 11.2575V13.4001L12.9001 9.68479L12.0468 8.68634V6.1152ZM2.6601 3.11553L0.100098 5.49383L0.953431 6.1152V8.68634L0.100098 9.68479L5.64676 13.4001V11.2575L2.6601 9.11486V3.11553Z"
      />
    </svg>
  );
}

export function TierCrestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="32" height="26" viewBox="0 0 32 26" fill="none">
      <path
        d="M16 1L30 8.5V17.5L16 25L2 17.5V8.5L16 1Z"
        fill="#010a13"
        stroke="#00e5ff"
        strokeWidth="1.5"
      />
      <polygon
        points="16,5 24,10 24,16 16,21 8,16 8,10"
        fill="#00e5ff"
        opacity="0.8"
      />
      <polygon
        points="16,8 21,11 21,15 16,18 11,15 11,11"
        fill="#ffffff"
      />
    </svg>
  );
}
