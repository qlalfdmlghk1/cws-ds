import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../internal/cx';
import { addDays, addMonths, fromKey, toKey, WEEK, type DateKey, type DateRange } from '../../internal/dates';
import { NextIcon, PrevIcon } from '../../internal/icons';
import { IconButton } from '../IconButton/IconButton';

export interface CalendarProps {
  mode?: 'single' | 'range';
  value?: DateKey | DateRange | null;
  onChange?: (value: DateKey | DateRange) => void;
  /** 고를 수 있는 가장 이른 날짜. */
  min?: DateKey;
  /** 고를 수 있는 가장 늦은 날짜. */
  max?: DateKey;
  /** 날짜별로 막기 (주말, 공휴일 등). */
  isDisabled?: (date: DateKey) => boolean;
  /** 처음 보일 달의 기준 날짜. 기본: 선택값 또는 오늘. */
  initialFocus?: DateKey;
  autoFocus?: boolean;
  className?: string;
}

/** 펼쳐진 달력. 페이지 안에 바로 둘 때. 보통은 Datepicker를 쓴다. */
export function Calendar({ mode = 'single', value, onChange, min, max, isDisabled, initialFocus, autoFocus, className }: CalendarProps) {
  const range = mode === 'range';
  const r = (range ? (value as DateRange | null | undefined) : null) ?? [null, null];
  const start = range ? r[0] : null;
  const end = range ? r[1] : null;
  const single = range ? null : ((value as DateKey | null | undefined) ?? null);
  const todayKey = toKey(new Date());
  const initial = fromKey(initialFocus || single || start || todayKey);
  const [focus, setFocus] = useState(initial);
  const [view, setView] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [hover, setHover] = useState<DateKey | null>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const wantFocus = useRef(!!autoFocus);

  const disabled = (k: DateKey) => !!((min && k < min) || (max && k > max) || isDisabled?.(k));
  const moveFocus = (d: Date) => {
    setFocus(d);
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) setView(new Date(d.getFullYear(), d.getMonth(), 1));
    wantFocus.current = true;
  };
  useEffect(() => {
    if (!wantFocus.current || !gridRef.current) return;
    const el = gridRef.current.querySelector<HTMLElement>(`[data-key="${toKey(focus)}"]`);
    if (el) { el.focus({ preventScroll: true }); wantFocus.current = false; }
  });

  const pick = (k: DateKey) => {
    if (disabled(k)) return;
    if (!range) return onChange?.(k);
    if (!start || end) return onChange?.([k, null]);
    onChange?.(k < start ? [k, start] : [start, k]);
    setHover(null);
  };
  const onKey = (e: KeyboardEvent) => {
    const d = focus;
    let n: Date | null = null;
    switch (e.key) {
      case 'ArrowLeft': n = addDays(d, -1); break;
      case 'ArrowRight': n = addDays(d, 1); break;
      case 'ArrowUp': n = addDays(d, -7); break;
      case 'ArrowDown': n = addDays(d, 7); break;
      case 'Home': n = addDays(d, -d.getDay()); break;
      case 'End': n = addDays(d, 6 - d.getDay()); break;
      case 'PageUp': n = addMonths(d, e.shiftKey ? -12 : -1); break;
      case 'PageDown': n = addMonths(d, e.shiftKey ? 12 : 1); break;
      case 'Enter':
      case ' ': e.preventDefault(); pick(toKey(d)); return;
      default: return;
    }
    e.preventDefault();
    moveFocus(n);
    if (range && start && !end) setHover(toKey(n));
  };
  const shiftView = (n: number) => { setView(addMonths(view, n)); setFocus(addMonths(focus, n)); };

  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const gridStart = addDays(first, -first.getDay());
  let lo = start, hi = end || (start && hover ? hover : null);
  if (lo && hi && hi < lo) [lo, hi] = [hi, lo];
  const title = `${view.getFullYear()}년 ${view.getMonth() + 1}월`;

  return (
    <div className={cx('cds-cal', className)} onMouseLeave={() => setHover(null)}>
      <div className="cds-cal__head">
        <IconButton icon={<PrevIcon />} label="이전 달" size="sm" tooltip={false} onClick={() => shiftView(-1)} />
        <div className="cds-cal__title" aria-live="polite">{title}</div>
        <IconButton icon={<NextIcon />} label="다음 달" size="sm" tooltip={false} onClick={() => shiftView(1)} />
      </div>
      <table ref={gridRef} role="grid" aria-label={title} className="cds-cal__grid" onKeyDown={onKey}>
        <thead>
          <tr>
            {WEEK.map((w, i) => (
              <th key={w} scope="col" className={cx('cds-cal__wd', i === 0 && 'is-sun')}><abbr title={`${w}요일`}>{w}</abbr></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, w) => (
            <tr key={w}>
              {Array.from({ length: 7 }, (_, dd) => {
                const day = addDays(gridStart, w * 7 + dd);
                const k = toKey(day);
                if (day.getMonth() !== view.getMonth()) return <td key={k} role="gridcell" className="cds-cal__cell" />;
                const isStart = range && !!lo && k === lo;
                const isEnd = range && !!hi && k === hi;
                const inRange = range && !!lo && !!hi && k > lo && k < hi;
                const sel = (!range && single === k) || isStart || isEnd;
                return (
                  <td
                    key={k}
                    role="gridcell"
                    aria-selected={sel || inRange || undefined}
                    className={cx('cds-cal__cell', inRange && 'is-in-range', isStart && hi && hi !== lo && 'is-range-start', isEnd && lo && hi !== lo && 'is-range-end')}
                  >
                    <button
                      type="button"
                      data-key={k}
                      tabIndex={k === toKey(focus) ? 0 : -1}
                      disabled={disabled(k)}
                      className={cx('cds-cal__day', k === todayKey && 'is-today', sel && 'is-selected', dd === 0 && 'is-sun')}
                      aria-label={`${day.getFullYear()}년 ${day.getMonth() + 1}월 ${day.getDate()}일 ${WEEK[dd]}요일${k === todayKey ? ', 오늘' : ''}`}
                      aria-current={k === todayKey ? 'date' : undefined}
                      onClick={() => { setFocus(day); pick(k); }}
                      onMouseEnter={range && start && !end ? () => setHover(k) : undefined}
                    >
                      {day.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
