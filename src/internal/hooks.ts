import { useCallback, useId, useRef, useState } from 'react';

/** Stable id for label/description wiring. Uses the caller's id when given. */
export function useFieldId(given?: string): string {
  const auto = useId();
  return given ?? auto;
}

/** Controlled-or-uncontrolled state. */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void): [T, (v: T) => void] {
  const [inner, setInner] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const set = useCallback(
    (v: T) => {
      if (!controlled) setInner(v);
      onChangeRef.current?.(v);
    },
    [controlled],
  );
  return [controlled ? (value as T) : inner, set];
}

export const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** id 여러 개를 공백으로 잇는다. 하나도 없으면 undefined (빈 속성을 안 남긴다). */
export function joinIds(...ids: Array<string | false | null | undefined>): string | undefined {
  const s = ids.filter(Boolean).join(' ');
  return s || undefined;
}
