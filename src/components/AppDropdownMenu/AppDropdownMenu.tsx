import { cloneElement, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useFieldId } from '../../internal/hooks';
import { useOutside } from '../../internal/useOutside';

export interface MenuItem {
  label?: ReactNode;
  onSelect?: () => void;
  icon?: ReactNode;
  /** 오른쪽 단축키 표시. "⌘C". */
  shortcut?: string;
  /** 삭제처럼 위험한 항목 (danger-ink). 맨 아래에, 구분선 뒤에. */
  danger?: boolean;
  disabled?: boolean;
  /** true면 구분선 한 줄. */
  divider?: boolean;
}
export interface AppDropdownMenuProps {
  items: MenuItem[];
  /** 여는 버튼 하나 (AppIconButton, AppButton 등). */
  children: ReactElement;
  /** 메뉴를 트리거 오른쪽 끝에 맞춘다. 화면 오른쪽의 "더보기"는 'end'. */
  align?: 'start' | 'end';
  label?: string;
  defaultOpen?: boolean;
  id?: string;
  className?: string;
}

type TriggerProps = { onClick?: (e: unknown) => void; onKeyDown?: (e: KeyboardEvent) => void };

export function AppDropdownMenu({ items, children, align, label, defaultOpen, id: idProp, className }: AppDropdownMenuProps) {
  const id = useFieldId(idProp);
  const [open, setOpen] = useState(!!defaultOpen);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const userOpened = useRef(false);
  const usable = (i: number) => !!items[i] && !items[i].divider && !items[i].disabled;
  const step = (from: number, dir: 1 | -1) => {
    for (let n = 1; n <= items.length; n++) {
      const j = (from + dir * n + items.length * 2) % items.length;
      if (usable(j)) return j;
    }
    return from;
  };
  const trigger = () => wrapRef.current?.querySelector<HTMLElement>('button, [tabindex]');
  const openMenu = (at?: 'last') => { userOpened.current = true; setActive(at === 'last' ? step(items.length, -1) : step(-1, 1)); setOpen(true); };
  const close = (refocus: boolean) => { setOpen(false); if (refocus) trigger()?.focus(); };
  const choose = (i: number) => { if (!usable(i)) return; close(true); items[i].onSelect?.(); };

  useEffect(() => { if (open && userOpened.current) menuRef.current?.focus(); }, [open]);
  useOutside(wrapRef, open, useCallback(() => setOpen(false), []));

  const onMenuKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); setActive(step(active, 1)); }
    else if (k === 'ArrowUp') { e.preventDefault(); setActive(step(active, -1)); }
    else if (k === 'Home') { e.preventDefault(); setActive(step(-1, 1)); }
    else if (k === 'End') { e.preventDefault(); setActive(step(items.length, -1)); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); choose(active); }
    else if (k === 'Escape') { e.preventDefault(); close(true); }
    else if (k === 'Tab') setOpen(false);
    else if (k.length === 1) {
      for (let n = 1; n <= items.length; n++) {
        const j = (active + n) % items.length;
        if (usable(j) && String(items[j].label).toLowerCase().startsWith(k.toLowerCase())) { setActive(j); break; }
      }
    }
  };

  const childProps = children.props as TriggerProps;
  const trig = cloneElement(children as ReactElement<Record<string, unknown>>, {
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? `${id}-menu` : undefined,
    onClick: (e: unknown) => { childProps.onClick?.(e); if (open) close(false); else openMenu(); },
    onKeyDown: (e: KeyboardEvent) => {
      childProps.onKeyDown?.(e);
      if (e.key === 'ArrowDown') { e.preventDefault(); openMenu(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); openMenu('last'); }
    },
  });

  return (
    <span ref={wrapRef} className={cx('cds-menu-anchor', className)}>
      {trig}
      {open && (
        <div
          ref={menuRef}
          id={`${id}-menu`}
          role="menu"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={active >= 0 ? `${id}-item-${active}` : undefined}
          className={cx('cds-menu', align === 'end' && 'cds-menu--end')}
          onKeyDown={onMenuKey}
          onBlur={(e) => { if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false); }}
        >
          {items.map((it, i) =>
            it.divider ? (
              <div key={`d${i}`} role="separator" className="cds-menu__divider" />
            ) : (
              <div
                key={i}
                id={`${id}-item-${i}`}
                role="menuitem"
                aria-disabled={it.disabled || undefined}
                className={cx('cds-menu__item', i === active && 'is-active', it.danger && 'is-danger', it.disabled && 'is-disabled')}
                onMouseEnter={() => { if (usable(i)) setActive(i); }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
              >
                {it.icon && <span className="cds-menu__icon" aria-hidden="true">{it.icon}</span>}
                <span className="cds-menu__label">{it.label}</span>
                {it.shortcut && <kbd className="cds-menu__kbd">{it.shortcut}</kbd>}
              </div>
            ),
          )}
        </div>
      )}
    </span>
  );
}
