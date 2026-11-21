// Storybook 전용 데모 아이콘과 레이아웃 도우미. 패키지에는 들어가지 않는다.
import type { CSSProperties, ReactNode } from 'react';

const svg = (paths: string[]) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    {paths.map((d) => <path key={d} d={d} />)}
  </svg>
);

export const icons = {
  arrow: svg(['M4 12h16', 'M13 5l7 7-7 7']),
  close: svg(['M6 6l12 12', 'M18 6L6 18']),
  more: svg(['M5 12h.01', 'M12 12h.01', 'M19 12h.01']),
  search: svg(['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M20 20l-4-4']),
  plus: svg(['M12 5v14', 'M5 12h14']),
  trash: svg(['M4 7h16', 'M10 11v6', 'M14 11v6', 'M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12', 'M9 7V4h6v3']),
  pencil: svg(['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4']),
  copy: svg(['M9 9h10v10H9z', 'M5 15V5h10']),
  link: svg(['M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1', 'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1']),
  share: svg(['M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7', 'M16 6l-4-4-4 4', 'M12 2v13']),
  filter: svg(['M4 6h16', 'M7 12h10', 'M10 18h4']),
  help: svg(['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M9.5 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2.2-2.4 3.7', 'M12 17h.01']),
  chevron: svg(['M6 9l6 6 6-6']),
  users: svg(['M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1', 'M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M21 19v-1a4 4 0 0 0-3-3.9', 'M15.5 3.1a3.5 3.5 0 0 1 0 6.8']),
  clock: svg(['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2']),
  alert: svg(['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 8v4', 'M12 16h.01']),
};

/** 가로 한 줄: 왼쪽 작은 이름표 + 예시들. */
export function Row({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      {label && <span style={{ width: 72, fontSize: 12, lineHeight: '16px', color: 'var(--ink-muted)' }}>{label}</span>}
      {children}
    </div>
  );
}

export function Stack({ gap = 16, style, children }: { gap?: number; style?: CSSProperties; children: ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>{children}</div>;
}
