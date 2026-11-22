import { useLayoutEffect, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

/** portal이면 document.body로, 아니면 그 자리에 그린다. 서버 렌더링(document 없음)에서는 그 자리에. */
export function MaybePortal({ enabled, children }: { enabled?: boolean; children: ReactNode }) {
  if (!enabled || typeof document === 'undefined') return <>{children}</>;
  return createPortal(children, document.body);
}

export interface FloatingOptions {
  /** 꺼져 있으면 아무것도 하지 않는다 (CSS의 absolute 배치를 그대로 쓴다). */
  enabled: boolean;
  /** 트리거 왼쪽 끝(start) 또는 오른쪽 끝(end)에 맞춘다. */
  align?: 'start' | 'end';
  /** 트리거와 같은 너비. 목록형(AppSelect·AppMultiSelect). */
  matchWidth?: boolean;
  /** 트리거와의 간격(px). */
  gap?: number;
  /** 공간이 모자라면 높이를 줄인다 (안에서 스크롤되는 목록만). */
  fitHeight?: boolean;
}

const EDGE = 8;

/**
 * portal로 띄운 요소를 트리거 기준 position:fixed로 놓는다.
 * 아래 공간이 모자라고 위가 더 넓으면 위로 뒤집고, 스크롤·창 크기·요소 크기가 바뀌면 다시 계산한다.
 * 처음 한 번은 보이지 않게 그려서 크기를 잰 뒤 자리를 잡으므로 깜빡이지 않는다.
 */
export function useFloating(open: boolean, anchorRef: RefObject<HTMLElement>, floatRef: RefObject<HTMLElement>, o: FloatingOptions): { style: CSSProperties | undefined; placement: 'bottom' | 'top' } {
  const { enabled, align = 'start', matchWidth, gap = 4, fitHeight } = o;
  const [state, setState] = useState<{ style: CSSProperties; placement: 'bottom' | 'top' } | null>(null);

  useLayoutEffect(() => {
    if (!open || !enabled) { setState(null); return; }
    const place = () => {
      const a = anchorRef.current?.getBoundingClientRect();
      const f = floatRef.current;
      if (!a || !f) return;
      const vw = window.innerWidth, vh = window.innerHeight;
      const width = matchWidth ? a.width : f.offsetWidth;
      // CSS가 정한 높이(예: 목록 max-height 240px) 그대로 잰다. 앞서 줄여 둔 인라인 max-height는 잠깐 뺀다.
      const prevMax = f.style.maxHeight;
      f.style.maxHeight = '';
      const natural = f.offsetHeight;
      f.style.maxHeight = prevMax;
      const below = vh - a.bottom - gap - EDGE, above = a.top - gap - EDGE;
      const top = natural > below && above > below;
      const room = top ? above : below;
      const height = fitHeight ? Math.min(natural, Math.max(room, 120)) : natural;
      let left = align === 'end' ? a.right - width : a.left;
      left = Math.min(Math.max(left, EDGE), Math.max(EDGE, vw - width - EDGE));
      const style: CSSProperties = {
        position: 'fixed',
        top: top ? a.top - gap - height : a.bottom + gap,
        left,
        ...(matchWidth ? { width } : {}),
        ...(fitHeight && height < natural ? { maxHeight: height } : {}),
      };
      setState((prev) => {
        const same = prev && prev.placement === (top ? 'top' : 'bottom') &&
          (Object.keys(style) as Array<keyof CSSProperties>).every((k) => prev.style[k] === style[k]) &&
          Object.keys(prev.style).length === Object.keys(style).length;
        return same ? prev : { style, placement: top ? 'top' : 'bottom' };
      });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(place) : null;
    if (ro) { if (anchorRef.current) ro.observe(anchorRef.current); if (floatRef.current) ro.observe(floatRef.current); }
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      ro?.disconnect();
    };
  }, [open, enabled, anchorRef, floatRef, align, matchWidth, gap, fitHeight]);

  if (!enabled) return { style: undefined, placement: 'bottom' };
  return {
    // 크기를 재는 첫 순간: 투명하게만 (visibility:hidden이면 열자마자 목록으로 포커스를 옮길 수 없다).
    style: state?.style ?? { position: 'fixed', top: 0, left: 0, opacity: 0, pointerEvents: 'none' },
    placement: state?.placement ?? 'bottom',
  };
}
