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
  /** 이 탭의 내용. 넣으면 AppTabs가 패널까지 그린다. 없으면 탭 줄만 (라우팅·필터용). */
  content?: ReactNode;
}
export interface AppTabsProps {
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
  /**
   * 탭 줄 오른쪽 끝에 붙는 버튼 등 ("+ 작성"). line이면 기준선이 이 아래까지 이어지고,
   * 탭이 많아 가로로 스크롤돼도 이 자리는 고정된다.
   */
  actions?: ReactNode;
  id?: string;
  className?: string;
}

export function AppTabs({ items, value: valueProp, defaultValue, onChange, variant = 'line', fullWidth, label, actions, id: idProp, className }: AppTabsProps) {
  const id = useFieldId(idProp);
  const firstEnabled = items.find((t) => !t.disabled)?.value;
  const [value, setValue] = useControllable<string | undefined>(valueProp, defaultValue ?? firstEnabled, onChange as (v: string | undefined) => void);
  const listRef = useRef<HTMLDivElement>(null);
  const hasPanels = items.some((t) => t.content !== undefined);
  const active = items.find((t) => t.value === value);

  // Tab 키로 들어오는 탭 하나 (roving tabindex). 선택된 탭이 없으면(값이 어느 탭과도 안 맞으면) 첫 활성 탭.
  const focusable = active && !active.disabled ? active.value : firstEnabled;

  const onKey = (e: KeyboardEvent) => {
    // 방향키는 선택이 아니라 지금 포커스된 탭을 기준으로 움직인다. 선택이 없어도 어긋나지 않는다.
    const focused = (e.target as HTMLElement).closest<HTMLElement>('[role="tab"]')?.dataset.value;
    const idx = items.findIndex((t) => t.value === (focused ?? focusable));
    let next = -1;
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (dir) {
      for (let n = 1; n <= items.length; n++) {
        const j = (((idx + dir * n) % items.length) + items.length) % items.length;
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
      <Row actions={actions}>
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
              tabIndex={t.value === focusable ? 0 : -1}
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
      </Row>
      {hasPanels && active && (
        <div role="tabpanel" id={`${id}-panel-${active.value}`} aria-labelledby={`${id}-tab-${active.value}`} tabIndex={0} className="cds-tabs__panel">
          {active.content}
        </div>
      )}
    </div>
  );
}

/** actions가 있으면 [탭 목록 | actions]를 한 줄로 묶는다. 없으면 목록만 (기존 구조 그대로). */
function Row({ actions, children }: { actions?: ReactNode; children: ReactNode }) {
  if (actions === undefined || actions === null || actions === false) return <>{children}</>;
  return (
    <div className="cds-tabs__row">
      {children}
      <div className="cds-tabs__actions">{actions}</div>
    </div>
  );
}
