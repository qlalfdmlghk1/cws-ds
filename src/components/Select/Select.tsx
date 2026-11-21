import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../internal/cx';
import { useControllable, useFieldId } from '../../internal/hooks';
import { useOutside } from '../../internal/useOutside';
import { ChevronDownIcon, TickIcon } from '../../internal/icons';
import { FieldLabel, FieldMessage } from '../../internal/Field';

export interface SelectOption { value: string; label: string; description?: string; disabled?: boolean }
export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 아무것도 안 골랐을 때 문구. 기본 "선택하세요". */
  placeholder?: string;
  /** 높이. sm 32 · md 40 · lg 48px. TextInput과 같다. 기본 'md'. */
  size?: 'sm' | 'md' | 'lg';
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** 부모 너비를 꽉 채운다 (기본 280px). */
  fullWidth?: boolean;
  /** 처음부터 목록을 연 채로 그린다. 미리보기·문서용. */
  defaultOpen?: boolean;
  id?: string;
  className?: string;
}

export function Select({ label, options, value: valueProp, defaultValue, onChange, placeholder, size = 'md', helperText, error, required, disabled, fullWidth, defaultOpen, id: idProp, className }: SelectProps) {
  const id = useFieldId(idProp);
  const [value, setValue] = useControllable<string | undefined>(valueProp, defaultValue, onChange as (v: string | undefined) => void);
  const [open, setOpen] = useState(!!defaultOpen);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const userOpened = useRef(false);
  const selIndex = options.findIndex((o) => o.value === value);
  const selected = selIndex >= 0 ? options[selIndex] : null;
  const descId = error || helperText ? `${id}-desc` : undefined;

  const step = (from: number, dir: 1 | -1) => {
    for (let n = 1; n <= options.length; n++) {
      const j = (from + dir * n + options.length * 2) % options.length;
      if (!options[j].disabled) return j;
    }
    return from;
  };
  const openList = () => {
    if (disabled) return;
    userOpened.current = true;
    setActive(selIndex >= 0 ? selIndex : step(-1, 1));
    setOpen(true);
  };
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) btnRef.current?.focus();
  };
  const choose = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    setValue(o.value);
    close(true);
  };
  useOutside(rootRef, open, useCallback(() => setOpen(false), []));
  useEffect(() => { if (open && userOpened.current) listRef.current?.focus(); }, [open]);
  useEffect(() => {
    if (!open || active < 0) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active]);

  const onButtonKey = (e: KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList(); }
  };
  const onListKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); setActive(step(active, 1)); }
    else if (k === 'ArrowUp') { e.preventDefault(); setActive(step(active, -1)); }
    else if (k === 'Home') { e.preventDefault(); setActive(step(-1, 1)); }
    else if (k === 'End') { e.preventDefault(); setActive(step(options.length, -1)); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); choose(active); }
    else if (k === 'Escape') { e.preventDefault(); close(true); }
    else if (k === 'Tab') setOpen(false);
    else if (k.length === 1) {
      for (let n = 1; n <= options.length; n++) {
        const j = (active + n) % options.length;
        if (!options[j].disabled && options[j].label.toLowerCase().startsWith(k.toLowerCase())) { setActive(j); break; }
      }
    }
  };

  return (
    <div ref={rootRef} className={cx('cds-field', 'cds-select', fullWidth && 'cds-field--full', className)}>
      <FieldLabel as="span" id={`${id}-label`} required={required}>{label}</FieldLabel>
      <div className="cds-select__anchor">
        <button
          ref={btnRef}
          id={id}
          type="button"
          disabled={disabled}
          className={cx('cds-input', `cds-input--${size}`, 'cds-select__trigger', error && 'is-error', disabled && 'is-disabled', open && 'is-open')}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-labelledby={`${label ? `${id}-label ` : ''}${id}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={descId}
          onClick={() => (open ? close(false) : openList())}
          onKeyDown={onButtonKey}
        >
          <span className={cx('cds-select__value', !selected && 'is-placeholder')}>{selected ? selected.label : placeholder ?? '선택하세요'}</span>
          <span className="cds-select__chevron" aria-hidden="true"><ChevronDownIcon /></span>
        </button>
        {open && (
          <ul
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            tabIndex={-1}
            className="cds-select__list"
            aria-labelledby={label ? `${id}-label` : undefined}
            aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
            onKeyDown={onListKey}
            onBlur={(e) => { if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false); }}
          >
            {options.map((o, i) => (
              <li
                key={o.value}
                id={`${id}-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={i === selIndex}
                aria-disabled={o.disabled || undefined}
                className={cx('cds-select__option', i === active && 'is-active', i === selIndex && 'is-selected', o.disabled && 'is-disabled')}
                onMouseEnter={() => { if (!o.disabled) setActive(i); }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
              >
                <span className="cds-select__text">
                  <span>{o.label}</span>
                  {o.description && <span className="cds-choice__desc">{o.description}</span>}
                </span>
                {i === selIndex && <span className="cds-select__tick" aria-hidden="true"><TickIcon /></span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <FieldMessage id={descId} error={error} helperText={helperText} />
    </div>
  );
}
