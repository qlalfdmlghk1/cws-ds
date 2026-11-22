import type { ReactNode } from 'react';
import { cx } from '../../internal/cx';

export interface AppDividerProps {
  /** 기본 'horizontal'. 'vertical'은 한 줄에 놓인 요소 사이 (부모가 flex일 때). */
  orientation?: 'horizontal' | 'vertical';
  /** 가로 선 가운데 짧은 글자. "또는", "2026년". */
  label?: ReactNode;
  className?: string;
}

export function AppDivider({ orientation = 'horizontal', label, className }: AppDividerProps) {
  if (orientation === 'vertical') {
    return <span role="separator" aria-orientation="vertical" className={cx('cds-divider', 'cds-divider--vertical', className)} />;
  }
  if (label) {
    return (
      <div role="separator" className={cx('cds-divider', 'cds-divider--label', className)}>
        <span className="cds-divider__label">{label}</span>
      </div>
    );
  }
  return <hr className={cx('cds-divider', className)} />;
}
