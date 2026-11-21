import type { ReactNode } from 'react';
import { cx } from '../../internal/cx';

export interface BadgeProps {
  children?: ReactNode;
  /** 의미 색. neutral(기본) · brand · success · danger. */
  tone?: 'neutral' | 'brand' | 'success' | 'danger';
  /** soft(기본, 옅은 바탕) · solid(채움) · outline(테두리). */
  variant?: 'soft' | 'solid' | 'outline';
  /** 24px(기본) · sm 20px. */
  size?: 'sm' | 'md';
  /** 글자 앞 작은 점 (상태 표시). */
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
}

export function Badge({ children, tone = 'neutral', variant = 'soft', size, dot, icon, className }: BadgeProps) {
  return (
    <span className={cx('cds-badge', `cds-badge--${tone}`, `cds-badge--${variant}`, size === 'sm' && 'cds-badge--sm', className)}>
      {dot && <span className="cds-badge__dot" aria-hidden="true" />}
      {icon && <span className="cds-badge__icon" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
