import type { SVGProps } from 'react';

const stroke = (w = 1.75) =>
  ({ fill: 'none', stroke: 'currentColor', strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round' }) as const;

export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...stroke()} {...p}><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>
);
export const CloseSmallIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...stroke()} {...p}><path d="M4.5 4.5l7 7" /><path d="M11.5 4.5l-7 7" /></svg>
);
export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...stroke(2.25)} {...p}><path d="M3.5 8.5l3 3 6-7" /></svg>
);
export const DashIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...stroke(2.25)} {...p}><path d="M4 8h8" /></svg>
);
export const ChevronDownIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...stroke()} {...p}><path d="M5 7.5l5 5 5-5" /></svg>
);
export const TickIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...stroke(2)} {...p}><path d="M4.5 10.5l3.5 3.5 7.5-8" /></svg>
);
export const PrevIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...stroke()} {...p}><path d="M12.5 5l-5 5 5 5" /></svg>
);
export const NextIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...stroke()} {...p}><path d="M7.5 5l5 5-5 5" /></svg>
);
export const UpIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...stroke(2)} {...p}><path d="M8 12.5V3.5" /><path d="M4 7.5l4-4 4 4" /></svg>
);
export const DownIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...stroke(2)} {...p}><path d="M8 3.5v9" /><path d="M4 8.5l4 4 4-4" /></svg>
);
export const SortNoneIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...stroke(1.5)} {...p}><path d="M5 6l3-3 3 3" /><path d="M5 10l3 3 3-3" /></svg>
);
export const SortAscIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...stroke()} {...p}><path d="M4.5 9.5L8 6l3.5 3.5" /></svg>
);
export const SortDescIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" {...stroke()} {...p}><path d="M4.5 6.5L8 10l3.5-3.5" /></svg>
);
export const CalendarIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...stroke(1.6)} {...p}><rect x="3" y="4.5" width="14" height="12.5" rx="2" /><path d="M3 8.5h14" /><path d="M7 2.5v3" /><path d="M13 2.5v3" /></svg>
);
export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" {...stroke()} {...p}><circle cx="9" cy="9" r="5.5" /><path d="M16.5 16.5l-3.5-3.5" /></svg>
);
export const PersonIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" /></svg>
);
export const ToneIcon = ({ tone }: { tone: 'success' | 'danger' | 'info' }) => (
  <svg viewBox="0 0 20 20" {...stroke()}>
    <circle cx="10" cy="10" r="7.5" />
    {tone === 'success' && <path d="M6.75 10.25l2.25 2.25 4.25-4.75" />}
    {tone === 'danger' && (<><path d="M10 6.25v4.5" /><path d="M10 13.6v.15" /></>)}
    {tone === 'info' && (<><path d="M10 9.25v4.5" /><path d="M10 6.4v.15" /></>)}
  </svg>
);
