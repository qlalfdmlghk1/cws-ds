import { useEffect, useRef, type RefObject } from 'react';
import { FOCUSABLE } from './hooks';

// 열린 순서대로 쌓는다. Esc와 Tab 가두기는 맨 위 것만 처리한다 (모달 위에 모달·Drawer가 겹칠 때).
const stack: object[] = [];

/**
 * Shared by Modal and Drawer while open: locks page scroll, moves focus in
 * ([data-autofocus] → first control in the body → in the footer → the panel),
 * keeps Tab inside, closes on Esc (unless an open popup inside already handled it), and gives focus back to the opener.
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
    const token = {};
    stack.push(token);
    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== token) return;
      // 안에서 열린 목록·달력·팝오버가 먼저 Esc를 처리했으면(preventDefault) 그것만 닫히게 둔다.
      if (e.key === 'Escape') { if (e.defaultPrevented) return; e.preventDefault(); onCloseRef.current(); return; }
      if (e.key !== 'Tab' || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      stack.splice(stack.indexOf(token), 1);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, panelRef, prefix]);
}
