import type { CSSProperties } from 'react';
import { cx } from '../../internal/cx';

export interface SkeletonProps {
  /** text(기본, 12px 막대) · rect(이미지·카드 자리) · circle(아바타 자리). */
  variant?: 'text' | 'rect' | 'circle';
  /** text일 때 줄 수. 마지막 줄은 60% 길이. */
  lines?: number;
  width?: number | string;
  height?: number | string;
  /** circle 지름. 기본 40. */
  size?: number;
  className?: string;
}

export function Skeleton({ variant = 'text', lines = 1, width, height, size = 40, className }: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <span className={cx('cds-skel-lines', className)} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className="cds-skel cds-skel--text" style={{ width: i === lines - 1 ? '60%' : '100%' }} />
        ))}
      </span>
    );
  }
  const style: CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;
  if (variant === 'circle') { style.width = size; style.height = size; }
  return <span className={cx('cds-skel', `cds-skel--${variant}`, className)} style={style} aria-hidden="true" />;
}
