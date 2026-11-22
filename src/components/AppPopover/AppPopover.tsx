import { cloneElement, useCallback, useEffect, useRef, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { FOCUSABLE, useControllable, useFieldId } from '../../internal/hooks';
import { useOutside } from '../../internal/useOutside';

export interface AppPopoverProps {
  /** 여는 버튼 하나. */
  children: ReactElement;
  /** 패널 내용. 함수면 { close }를 받아 안쪽 버튼에서 닫을 수 있다. */
  content: ReactNode | ((api: { close: () => void }) => ReactNode);
  title?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'end';
  /** 기본 'bottom'. */
  placement?: 'bottom' | 'top';
  /** 기본 280px. */
  width?: number | string;
  label?: string;
  id?: string;
  className?: string;
}

export function AppPopover({ children, content, title, open: openProp, defaultOpen = false, onOpenChange, align, placement, width, label, id: idProp, className }: AppPopoverProps) {
  const id = useFieldId(idProp);
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const userOpened = useRef(false);
  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) wrapRef.current?.querySelector<HTMLElement>('button, [tabindex]')?.focus();
  }, [setOpen]);
  useOutside(wrapRef, open, useCallback(() => setOpen(false), [setOpen]));
  useEffect(() => {
    if (!open) return;
    if (userOpened.current && panelRef.current) {
      const f = panelRef.current.querySelector<HTMLElement>('[data-autofocus]') ?? panelRef.current.querySelector<HTMLElement>(FOCUSABLE);
      (f ?? panelRef.current).focus({ preventScroll: true });
    }
    // capture 단계에서 먼저 받아 처리했다고 표시한다. 감싼 AppModal·AppDrawer는 이 Esc로 닫히지 않는다.
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); close(true); } };
    document.addEventListener('keydown', key, true);
    return () => document.removeEventListener('keydown', key, true);
  }, [open, close]);

  const childProps = children.props as { onClick?: (e: unknown) => void };
  const trig = cloneElement(children as ReactElement<Record<string, unknown>>, {
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? id : undefined,
    onClick: (e: unknown) => { childProps.onClick?.(e); userOpened.current = true; setOpen(!open); },
  });
  const body = typeof content === 'function' ? content({ close: () => close(true) }) : content;

  return (
    <span ref={wrapRef} className={cx('cds-menu-anchor', className)}>
      {trig}
      {open && (
        <div
          ref={panelRef}
          id={id}
          role="dialog"
          tabIndex={-1}
          aria-label={label ?? (typeof title === 'string' ? title : undefined)}
          className={cx('cds-popover', align === 'end' && 'cds-popover--end', placement === 'top' && 'cds-popover--top')}
          style={width ? { width } : undefined}
        >
          {title && <div className="cds-popover__title">{title}</div>}
          <div className="cds-popover__body">{body}</div>
        </div>
      )}
    </span>
  );
}
