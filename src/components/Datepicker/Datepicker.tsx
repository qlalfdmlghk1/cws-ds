import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cx } from '../../internal/cx';
import { FOCUSABLE, joinIds, useControllable, useFieldId } from '../../internal/hooks';
import { useOutside } from '../../internal/useOutside';
import { addDays, dotted, toKey, type DateKey, type DateRange } from '../../internal/dates';
import { CalendarIcon } from '../../internal/icons';
import { FieldLabel, FieldMessage, fieldName, type FieldNameProps } from '../../internal/Field';
import { MaybePortal, useFloating } from '../../internal/Floating';
import { Calendar, type CalendarProps } from './Calendar';

export interface DatePreset { label: string; range: () => [DateKey, DateKey] }
export interface DatepickerProps extends Omit<CalendarProps, 'autoFocus' | 'initialFocus' | 'className'>, FieldNameProps {
  defaultValue?: DateKey | DateRange | null;
  label?: string;
  /** 기본: 단일 "날짜 선택", 기간 "시작일 – 종료일". */
  placeholder?: string;
  /** 기간 모드 왼쪽 빠른 선택. datePresets.last7 등을 그대로 넣어도 된다. */
  presets?: DatePreset[];
  size?: 'sm' | 'md' | 'lg';
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** 달력을 트리거 오른쪽 끝에 맞춘다. */
  align?: 'start' | 'end';
  /**
   * 달력을 document.body에 띄운다. 모달 본문처럼 스크롤되는 영역 안에서 달력이 잘릴 때 켠다.
   * 트리거 위치를 따라가고, 아래 공간이 모자라면 위로 펼친다. 기본 false.
   */
  portal?: boolean;
  defaultOpen?: boolean;
  id?: string;
  className?: string;
}

export function Datepicker({ mode = 'single', value: valueProp, defaultValue, onChange, min, max, isDisabled, label, placeholder, presets, size = 'md', helperText, error, required, disabled, fullWidth, align, defaultOpen, portal, id: idProp, className, ...nameProps }: DatepickerProps) {
  const id = useFieldId(idProp);
  const range = mode === 'range';
  const [value, setValue] = useControllable<DateKey | DateRange | null>(valueProp ?? undefined, defaultValue ?? (range ? [null, null] : null), onChange as (v: DateKey | DateRange | null) => void);
  const [open, setOpen] = useState(!!defaultOpen);
  const userOpened = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const descId = error || helperText ? `${id}-desc` : undefined;
  const { nameId, hidden } = fieldName(id, label, nameProps);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) btnRef.current?.focus();
  }, []);
  useOutside([rootRef, popRef], open, useCallback(() => setOpen(false), []));
  const floating = useFloating(open, btnRef, popRef, { enabled: !!portal, align: align ?? 'start' });
  // 달력 맨 끝에서 Tab, 맨 앞에서 Shift+Tab → 닫고 트리거로. portal이어도 포커스가 페이지 밖으로 새지 않는다.
  const onPopKey = (ev: ReactKeyboardEvent<HTMLDivElement>) => {
    if (ev.key !== 'Tab') return;
    const items = Array.from(popRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((el) => el.tabIndex >= 0);
    const at = document.activeElement;
    if ((!ev.shiftKey && at === items[items.length - 1]) || (ev.shiftKey && at === items[0])) { ev.preventDefault(); close(true); }
  };
  useEffect(() => {
    if (!open) return;
    // capture 단계에서 먼저 받아 처리했다고 표시한다. 감싼 Modal·Drawer는 이 Esc로 닫히지 않는다.
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); close(true); } };
    document.addEventListener('keydown', key, true);
    return () => document.removeEventListener('keydown', key, true);
  }, [open, close]);

  const [s, e] = range ? ((value as DateRange) ?? [null, null]) : [null, null];
  const text = range ? (s ? `${dotted(s)} – ${e ? dotted(e) : ''}` : '') : dotted(value as DateKey | null);

  return (
    <div ref={rootRef} className={cx('cds-field', 'cds-dp', fullWidth && 'cds-field--full', range && 'cds-dp--range', className)}>
      <FieldLabel as="span" id={`${id}-label`} required={required}>{label}</FieldLabel>
      {hidden}
      <div className="cds-select__anchor">
        <button
          ref={btnRef}
          id={id}
          type="button"
          disabled={disabled}
          className={cx('cds-input', `cds-input--${size}`, 'cds-select__trigger', error && 'is-error', disabled && 'is-disabled', open && 'is-open')}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={joinIds(nameId, id)}
          aria-invalid={error ? true : undefined}
          aria-describedby={descId}
          onClick={() => { if (open) close(false); else { userOpened.current = true; setOpen(true); } }}
          onKeyDown={(ev) => { if (ev.key === 'ArrowDown') { ev.preventDefault(); userOpened.current = true; setOpen(true); } }}
        >
          <span className="cds-input__icon" aria-hidden="true"><CalendarIcon /></span>
          <span className={cx('cds-select__value', !text && 'is-placeholder')}>{text || placeholder || (range ? '시작일 – 종료일' : '날짜 선택')}</span>
        </button>
        {open && (
          <MaybePortal enabled={portal}>
          <div
            ref={popRef}
            className={cx('cds-dp__pop', align === 'end' && 'cds-dp__pop--end', portal && 'is-portal', floating.placement === 'top' && 'is-top')}
            style={floating.style}
            onKeyDown={onPopKey}
            role="dialog" aria-label={`${label || nameProps['aria-label'] || ''} 달력`.trim()}>
            {range && presets && (
              <div className="cds-dp__presets" role="group" aria-label="빠른 선택">
                {presets.map((p) => {
                  const pr = p.range();
                  const on = s === pr[0] && e === pr[1];
                  return (
                    <button key={p.label} type="button" className={cx('cds-dp__preset', on && 'is-active')} aria-pressed={on} onClick={() => { setValue(pr); close(true); }}>
                      {p.label}
                    </button>
                  );
                })}
              </div>
            )}
            <Calendar
              mode={mode}
              value={value}
              min={min}
              max={max}
              isDisabled={isDisabled}
              autoFocus={userOpened.current}
              onChange={(v) => { setValue(v); if (!range || (v as DateRange)[1]) close(true); }}
            />
          </div>
          </MaybePortal>
        )}
      </div>
      <FieldMessage id={descId} error={error} helperText={helperText} />
    </div>
  );
}

/** 자주 쓰는 기간 프리셋 (오늘 기준). */
export const datePresets = {
  last7: { label: '최근 7일', range: () => { const t = new Date(); return [toKey(addDays(t, -6)), toKey(t)]; } },
  last30: { label: '최근 30일', range: () => { const t = new Date(); return [toKey(addDays(t, -29)), toKey(t)]; } },
  thisMonth: { label: '이번 달', range: () => { const t = new Date(); return [toKey(new Date(t.getFullYear(), t.getMonth(), 1)), toKey(t)]; } },
  lastMonth: { label: '지난달', range: () => { const t = new Date(); return [toKey(new Date(t.getFullYear(), t.getMonth() - 1, 1)), toKey(new Date(t.getFullYear(), t.getMonth(), 0))]; } },
} satisfies Record<string, DatePreset>;
