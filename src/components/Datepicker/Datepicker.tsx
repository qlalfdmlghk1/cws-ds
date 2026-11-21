import { useCallback, useEffect, useRef, useState } from 'react';
import { cx } from '../../internal/cx';
import { useControllable, useFieldId } from '../../internal/hooks';
import { useOutside } from '../../internal/useOutside';
import { addDays, dotted, toKey, type DateKey, type DateRange } from '../../internal/dates';
import { CalendarIcon } from '../../internal/icons';
import { FieldLabel, FieldMessage } from '../../internal/Field';
import { Calendar, type CalendarProps } from './Calendar';

export interface DatePreset { label: string; range: () => [DateKey, DateKey] }
export interface DatepickerProps extends Omit<CalendarProps, 'autoFocus' | 'initialFocus' | 'className'> {
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
  defaultOpen?: boolean;
  id?: string;
  className?: string;
}

export function Datepicker({ mode = 'single', value: valueProp, defaultValue, onChange, min, max, isDisabled, label, placeholder, presets, size = 'md', helperText, error, required, disabled, fullWidth, align, defaultOpen, id: idProp, className }: DatepickerProps) {
  const id = useFieldId(idProp);
  const range = mode === 'range';
  const [value, setValue] = useControllable<DateKey | DateRange | null>(valueProp ?? undefined, defaultValue ?? (range ? [null, null] : null), onChange as (v: DateKey | DateRange | null) => void);
  const [open, setOpen] = useState(!!defaultOpen);
  const userOpened = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const descId = error || helperText ? `${id}-desc` : undefined;

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) btnRef.current?.focus();
  }, []);
  useOutside(rootRef, open, useCallback(() => setOpen(false), []));
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); close(true); } };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open, close]);

  const [s, e] = range ? ((value as DateRange) ?? [null, null]) : [null, null];
  const text = range ? (s ? `${dotted(s)} – ${e ? dotted(e) : ''}` : '') : dotted(value as DateKey | null);

  return (
    <div ref={rootRef} className={cx('cds-field', 'cds-dp', fullWidth && 'cds-field--full', range && 'cds-dp--range', className)}>
      <FieldLabel as="span" id={`${id}-label`} required={required}>{label}</FieldLabel>
      <div className="cds-select__anchor">
        <button
          ref={btnRef}
          id={id}
          type="button"
          disabled={disabled}
          className={cx('cds-input', `cds-input--${size}`, 'cds-select__trigger', error && 'is-error', disabled && 'is-disabled', open && 'is-open')}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={`${label ? `${id}-label ` : ''}${id}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={descId}
          onClick={() => { if (open) close(false); else { userOpened.current = true; setOpen(true); } }}
          onKeyDown={(ev) => { if (ev.key === 'ArrowDown') { ev.preventDefault(); userOpened.current = true; setOpen(true); } }}
        >
          <span className="cds-input__icon" aria-hidden="true"><CalendarIcon /></span>
          <span className={cx('cds-select__value', !text && 'is-placeholder')}>{text || placeholder || (range ? '시작일 – 종료일' : '날짜 선택')}</span>
        </button>
        {open && (
          <div className={cx('cds-dp__pop', align === 'end' && 'cds-dp__pop--end')} role="dialog" aria-label={label ? `${label} 달력` : '달력'}>
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
