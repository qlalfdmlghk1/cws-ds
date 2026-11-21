import { useEffect, useRef, type RefObject } from 'react';
import { FOCUSABLE } from './hooks';

/**
 * Shared by Modal and Drawer while open: locks page scroll, moves focus in
 * ([data-autofocus] → first control in the body → in the footer → the panel),
 * keeps Tab inside, closes on Esc, and gives focus back to the opener.
 */
export function useDialog(open: boolean, panelRef: RefObject<HTMLElement>, onClose: () => void, prefix: string) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = panelRef.current;
    const inside = (sel: string) => panel?.querySelector(sel)?.querySelector<HTMLElement>(FOCUSABLE) ?? null;
    const target =
      panel?.querySelector<HTMLElement>('[data-autofocus]') ?? inside(`.${prefix}__body`) ?? inside(`.${prefix}__foot`) ?? panel;
    target?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onCloseRef.current(); return; }
      if (e.key !== 'Tab' || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, panelRef, prefix]);
}
