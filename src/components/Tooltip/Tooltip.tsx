import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../internal/cx';
import { useFieldId } from '../../internal/hooks';

export interface TooltipProps {
  /** 보여줄 짧은 문구. 한 줄, 길어도 두 줄. */
  content: ReactNode;
  /** 감쌀 요소 하나 (버튼, 아이콘, 줄임표 처리된 텍스트 등). */
  children: ReactElement;
  /** 기본 'top'. 화면 밖으로 나가면 반대쪽으로 뒤집힌다. */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** hover 후 뜨기까지 ms. 기본 400. 키보드 포커스는 바로 뜬다. */
  delay?: number;
  disabled?: boolean;
  /** 직접 열고 닫기 (문서·미리보기용). 넣으면 hover로 바뀌지 않는다. */
  open?: boolean;
  /** 감싼 요소에 aria-describedby로 연결. 기본 true. 이름(aria-label)과 같은 문구면 false. */
  describe?: boolean;
  id?: string;
  className?: string;
}

type Side = 'top' | 'bottom' | 'left' | 'right';
interface Pos { top: number; left: number; side: Side; arrow: number }

export function Tooltip({ content, children, placement = 'top', delay = 400, disabled, open: openProp, describe = true, id: idProp, className }: TooltipProps) {
  const id = useFieldId(idProp);
  const controlled = openProp !== undefined;
  const [innerOpen, setInnerOpen] = useState(false);
  const open = controlled ? !!openProp : innerOpen;
  const [pos, setPos] = useState<Pos | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = (now: boolean) => {
    if (disabled || !content) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setInnerOpen(true), now ? 0 : delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    if (controlled) return;
    setInnerOpen(false);
    setPos(null);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const el = wrapRef.current?.firstElementChild;
    if (!el || !describe) return;
    if (open) el.setAttribute('aria-describedby', id);
    else el.removeAttribute('aria-describedby');
  }, [open, describe, id]);

  useLayoutEffect(() => {
    if (!open || !tipRef.current || !wrapRef.current) return;
    const target = (wrapRef.current.firstElementChild as HTMLElement) ?? wrapRef.current;
    const r = target.getBoundingClientRect();
    const t = tipRef.current.getBoundingClientRect();
    const gap = 8, vw = window.innerWidth, vh = window.innerHeight;
    let side: Side = placement;
    if (side === 'top' && r.top - t.height - gap < 4) side = 'bottom';
    else if (side === 'bottom' && r.bottom + t.height + gap > vh - 4) side = 'top';
    else if (side === 'left' && r.left - t.width - gap < 4) side = 'right';
    else if (side === 'right' && r.right + t.width + gap > vw - 4) side = 'left';
    let top: number, left: number;
    if (side === 'top' || side === 'bottom') {
      top = side === 'top' ? r.top - t.height - gap : r.bottom + gap;
      left = Math.min(Math.max(4, r.left + r.width / 2 - t.width / 2), vw - t.width - 4);
    } else {
      left = side === 'left' ? r.left - t.width - gap : r.right + gap;
      top = Math.min(Math.max(4, r.top + r.height / 2 - t.height / 2), vh - t.height - 4);
    }
    const arrow = side === 'top' || side === 'bottom' ? r.left + r.width / 2 - left : r.top + r.height / 2 - top;
    setPos({ top, left, side, arrow });
  }, [open, placement]);

  useEffect(() => {
    if (!open || controlled) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); hide(); } };
    const onScroll = () => hide();
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, controlled]);

  const style = (pos ? { top: pos.top, left: pos.left, '--cds-arrow': `${pos.arrow}px` } : { top: 0, left: 0 }) as CSSProperties;
  const tip = open ? (
    <div ref={tipRef} id={id} role="tooltip" className={cx('cds-tooltip', pos && `cds-tooltip--${pos.side}`, pos && 'is-placed')} style={style}>
      {content}
    </div>
  ) : null;

  return (
    <span
      ref={wrapRef}
      className={cx('cds-tooltip-anchor', className)}
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={(e) => { if ((e.target as HTMLElement).matches?.(':focus-visible') ?? true) show(true); }}
      onBlur={hide}
      onPointerDown={hide}
    >
      {children}
      {tip && typeof document !== 'undefined' ? createPortal(tip, document.body) : null}
    </span>
  );
}
