import { useEffect, type RefObject } from 'react';

/** Calls onOutside when a mousedown lands outside ref, while active. */
export function useOutside(ref: RefObject<HTMLElement>, active: boolean, onOutside: () => void) {
  useEffect(() => {
    if (!active) return;
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener('mousedown', down);
    return () => document.removeEventListener('mousedown', down);
  }, [active, ref, onOutside]);
}
