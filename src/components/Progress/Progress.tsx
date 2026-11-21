import type { ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useFieldId } from '../../internal/hooks';

export interface ProgressProps {
  /** 0~max. 빼면 끝을 모르는 진행 (막대가 오간다). */
  value?: number;
  /** 기본 100. */
  max?: number;
  /** 막대 위 왼쪽 문구. 없으면 aria-label을 넣는다. */
  label?: ReactNode;
  /** 막대 위 오른쪽에 퍼센트. 기본 false. */
  showValue?: boolean;
  /** 오른쪽 값 표시를 바꾼다. "3 / 12개". */
  formatValue?: (value: number, max: number) => ReactNode;
  /** 기본 'brand'. 다 끝나면 success, 실패하면 danger. */
  tone?: 'brand' | 'success' | 'danger';
  /** sm 4px · md 8px(기본). */
  size?: 'sm' | 'md';
  'aria-label'?: string;
  id?: string;
  className?: string;
}

export function Progress({ value, max = 100, label, showValue, formatValue, tone = 'brand', size = 'md', id: idProp, className, ...aria }: ProgressProps) {
  const id = useFieldId(idProp);
  const known = typeof value === 'number';
  const v = known ? Math.min(Math.max(value, 0), max) : 0;
  const pct = max > 0 ? (v / max) * 100 : 0;
  const shown = known && (formatValue ? formatValue(v, max) : showValue ? `${Math.round(pct)}%` : null);
  return (
    <div className={cx('cds-progress', `cds-progress--${tone}`, `cds-progress--${size}`, className)}>
      {(label || shown) && (
        <div className="cds-progress__head">
          {label && <span id={`${id}-label`} className="cds-progress__label">{label}</span>}
          {shown && <span className="cds-progress__value">{shown}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-label={label ? undefined : aria['aria-label']}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={known ? v : undefined}
        className={cx('cds-progress__track', !known && 'is-indeterminate')}
      >
        <span className="cds-progress__bar" style={known ? { width: `${pct}%` } : undefined} />
      </div>
    </div>
  );
}
