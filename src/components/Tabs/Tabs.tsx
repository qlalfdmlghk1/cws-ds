import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllable, useFieldId } from '../../internal/hooks';

export interface TabItem {
  value: string;
  label: ReactNode;
  /** 라벨 옆 개수 배지. */
  count?: number | string;
  icon?: ReactNode;
  disabled?: boolean;
  /** 이 탭의 내용. 넣으면 Tabs가 패널까지 그린다. 없으면 탭 줄만 (라우팅·필터용). */
  content?: ReactNode;
}
export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 'line'(기본, 밑줄) — 다른 내용 전환 · 'segment'(알약) — 같은 데이터의 보기 방식 전환. */
  variant?: 'line' | 'segment';
  /** 탭을 너비에 꽉 채워 균등 분할. */
  fullWidth?: boolean;
  /** 탭 줄의 이름 (aria-label). */
  label?: string;
  id?: string;
  className?: string;
}

export function Tabs({ items, value: valueProp, defaultValue, onChange, variant = 'line', fullWidth, label, id: idProp, className }: TabsProps) {
  const id = useFieldId(idProp);
  const firstEnabled = items.find((t) => !t.disabled)?.value;
  const [value, setValue] = useControllable<string | undefined>(valueProp, defaultValue ?? firstEnabled, onChange as (v: string | undefined) => void);
  const listRef = useRef<HTMLDivElement>(null);
  const hasPanels = items.some((t) => t.content !== undefined);
  const active = items.find((t) => t.value === value);

  const onKey = (e: KeyboardEvent) => {
    const idx = items.findIndex((t) => t.value === value);
    let next = -1;
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (dir) {
      for (let n = 1; n <= items.length; n++) {
        const j = (idx + dir * n + items.length * 2) % items.length;
        if (!items[j].disabled) { next = j; break; }
      }
    } else if (e.key === 'Home') next = items.findIndex((t) => !t.disabled);
    else if (e.key === 'End') { for (let b = items.length - 1; b >= 0; b--) if (!items[b].disabled) { next = b; break; } }
    if (next < 0) return;
    e.preventDefault();
    setValue(items[next].value);
    listRef.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(items[next].value)}"]`)?.focus();
  };

  return (
    <div className={cx('cds-tabs', `cds-tabs--${variant}`, className)}>
      <div ref={listRef} role="tablist" aria-label={label} className={cx('cds-tabs__list', fullWidth && 'cds-tabs__list--full')} onKeyDown={onKey}>
        {items.map((t) => {
          const on = t.value === value;
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              id={`${id}-tab-${t.value}`}
              data-value={t.value}
              aria-selected={on}
              aria-controls={hasPanels ? `${id}-panel-${t.value}` : undefined}
              tabIndex={on ? 0 : -1}
              disabled={t.disabled}
              className={cx('cds-tabs__tab', on && 'is-active')}
              onClick={() => setValue(t.value)}
            >
              {t.icon && <span className="cds-tabs__icon" aria-hidden="true">{t.icon}</span>}
              <span>{t.label}</span>
              {t.count !== undefined && <span className="cds-tabs__count">{t.count}</span>}
            </button>
          );
        })}
      </div>
      {hasPanels && active && (
        <div role="tabpanel" id={`${id}-panel-${active.value}`} aria-labelledby={`${id}-tab-${active.value}`} tabIndex={0} className="cds-tabs__panel">
          {active.content}
        </div>
      )}
    </div>
  );
}
