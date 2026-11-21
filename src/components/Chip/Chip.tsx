import type { ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { CheckIcon, CloseSmallIcon } from '../../internal/icons';

export interface ChipProps {
  children?: ReactNode;
  /** 필터 칩의 선택 상태. 넣으면 aria-pressed 토글 버튼이 된다. */
  selected?: boolean;
  onClick?: () => void;
  /** 넣으면 오른쪽에 × 버튼 (입력한 태그 등). */
  onRemove?: () => void;
  icon?: ReactNode;
  /** 라벨 뒤 개수. */
  count?: number | string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

export function Chip({ children, selected, onClick, onRemove, icon, count, size = 'md', disabled, className }: ChipProps) {
  const toggle = selected !== undefined || !!onClick;
  const cls = cx('cds-chip', `cds-chip--${size}`, selected && 'is-selected', disabled && 'is-disabled', onRemove && 'has-remove', className);
  const inner = (
    <>
      {selected && !icon && <span className="cds-chip__icon" aria-hidden="true"><CheckIcon /></span>}
      {icon && <span className="cds-chip__icon" aria-hidden="true">{icon}</span>}
      <span className="cds-chip__label">{children}</span>
      {count !== undefined && <span className="cds-chip__count">{count}</span>}
    </>
  );
  if (onRemove) {
    return (
      <span className={cls}>
        {toggle ? (
          <button type="button" className="cds-chip__main" aria-pressed={selected} disabled={disabled} onClick={onClick}>{inner}</button>
        ) : (
          <span className="cds-chip__main">{inner}</span>
        )}
        <button type="button" className="cds-chip__remove" aria-label={`${typeof children === 'string' ? `${children} ` : ''}삭제`} disabled={disabled} onClick={onRemove}>
          <CloseSmallIcon />
        </button>
      </span>
    );
  }
  if (toggle) {
    return (
      <button type="button" className={cls} aria-pressed={selected !== undefined ? !!selected : undefined} disabled={disabled} onClick={onClick}>
        <span className="cds-chip__main">{inner}</span>
      </button>
    );
  }
  return <span className={cls}><span className="cds-chip__main">{inner}</span></span>;
}
