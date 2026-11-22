import { useEffect, type RefObject } from 'react';

/** active일 때 refs 바깥에 mousedown이 오면 onOutside. portal로 띄운 목록은 refs에 함께 넣는다. */
export function useOutside(refs: RefObject<HTMLElement> | Array<RefObject<HTMLElement>>, active: boolean, onOutside: () => void) {
  useEffect(() => {
    if (!active) return;
    const list = Array.isArray(refs) ? refs : [refs];
    const down = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!list.some((r) => r.current?.contains(t))) onOutside();
    };
    document.addEventListener('mousedown', down);
    return () => document.removeEventListener('mousedown', down);
    // refs 배열은 렌더마다 새로 만들어지므로 안의 ref 객체만 비교한다.
  }, [active, onOutside, ...(Array.isArray(refs) ? refs : [refs])]);
}
