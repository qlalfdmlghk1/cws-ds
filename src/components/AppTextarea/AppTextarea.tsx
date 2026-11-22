import { useLayoutEffect, useRef, useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { joinIds, useFieldId } from '../../internal/hooks';
import { FieldLabel, FieldMessage } from '../../internal/Field';

export interface AppTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  /** 처음 높이(줄 수). 기본 4. */
  rows?: number;
  /** 내용에 맞춰 높이가 늘어난다. maxRows를 넘으면 스크롤. */
  autoResize?: boolean;
  maxRows?: number;
  /** maxLength와 같이 쓰면 글자 수 표시. */
  showCount?: boolean;
  /** 손잡이로 높이 조절. 기본 'vertical'. */
  resize?: 'vertical' | 'none';
  fullWidth?: boolean;
}

export function AppTextarea({ label, helperText, error, rows = 4, autoResize, maxRows, showCount, resize, fullWidth, className, id: idProp, value: valueProp, defaultValue, onChange, ...rest }: AppTextareaProps) {
  const id = useFieldId(idProp);
  const controlled = valueProp !== undefined;
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const value = controlled ? valueProp : inner;
  const ref = useRef<HTMLTextAreaElement>(null);
  const descId = error || helperText ? `${id}-desc` : undefined;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !autoResize) return;
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || 22;
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    el.style.height = 'auto';
    const maxH = maxRows ? maxRows * lh + padY : Infinity;
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
    el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
  }, [value, autoResize, maxRows]);

  const handle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!controlled) setInner(e.target.value);
    onChange?.(e);
  };
  return (
    <div className={cx('cds-field', 'cds-textarea', fullWidth && 'cds-field--full', className)}>
      <FieldLabel htmlFor={id} required={rest.required}>{label}</FieldLabel>
      <div className={cx('cds-input', 'cds-textarea__box', error && 'is-error', rest.disabled && 'is-disabled', rest.readOnly && 'is-readonly')}>
        <textarea
          {...rest}
          ref={ref}
          id={id}
          rows={rows}
          value={value}
          onChange={handle}
          className={cx('cds-textarea__control', (resize === 'none' || autoResize) && 'is-noresize', autoResize && 'is-auto')}
          aria-invalid={error ? true : undefined}
          aria-describedby={joinIds(rest['aria-describedby'], descId)}
        />
      </div>
      <FieldMessage
        id={descId}
        error={error}
        helperText={helperText}
        count={showCount && rest.maxLength ? <span className="cds-field__count" aria-hidden="true">{String(value ?? '').length} / {rest.maxLength}</span> : null}
      />
    </div>
  );
}
