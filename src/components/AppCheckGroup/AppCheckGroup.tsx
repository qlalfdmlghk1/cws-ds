import type { ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllable, useFieldId } from '../../internal/hooks';
import { FieldLabel } from '../../internal/Field';
import { AppCheckbox } from '../AppCheckbox/AppCheckbox';

export interface CheckGroupOption { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }
export interface AppCheckGroupProps {
  label?: string;
  options: CheckGroupOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** 넣으면 맨 위에 "전체 선택" 체크박스 (세로 배치일 때). */
  allLabel?: string;
  direction?: 'vertical' | 'horizontal';
  name?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  error?: string;
  className?: string;
}

export function AppCheckGroup({ label, options, value: valueProp, defaultValue = [], onChange, allLabel, direction = 'vertical', name: nameProp, required, disabled, helperText, error, className }: AppCheckGroupProps) {
  const name = useFieldId(nameProp);
  const [value, setValue] = useControllable(valueProp, defaultValue, onChange);
  const on = new Set(value);
  const enabled = options.filter((o) => !o.disabled).map((o) => o.value);
  const nOn = enabled.filter((v) => on.has(v)).length;
  const descId = error || helperText ? `${name}-desc` : undefined;
  const showAll = !!allLabel && direction !== 'horizontal';
  const ordered = (pred: (v: string) => boolean) => options.filter((o) => pred(o.value)).map((o) => o.value);

  return (
    <fieldset className={cx('cds-group', className)} aria-describedby={descId} disabled={disabled}>
      <FieldLabel as="legend" required={required}>{label}</FieldLabel>
      {showAll && (
        <AppCheckbox
          label={allLabel}
          className="cds-group__all"
          disabled={disabled}
          checked={enabled.length > 0 && nOn === enabled.length}
          indeterminate={nOn > 0 && nOn < enabled.length}
          onChange={() => setValue(nOn === enabled.length ? value.filter((v) => !enabled.includes(v)) : ordered((v) => on.has(v) || enabled.includes(v)))}
        />
      )}
      <div className={cx('cds-group__items', direction === 'horizontal' && 'cds-group__items--row', showAll && 'cds-group__items--nested')}>
        {options.map((o) => (
          <AppCheckbox
            key={o.value}
            name={name}
            value={o.value}
            label={o.label}
            description={o.description}
            disabled={disabled || o.disabled}
            checked={on.has(o.value)}
            onChange={() => setValue(on.has(o.value) ? value.filter((v) => v !== o.value) : ordered((v) => on.has(v) || v === o.value))}
          />
        ))}
      </div>
      {descId && <p id={descId} className={error ? 'cds-field__error' : 'cds-field__help'}>{error || helperText}</p>}
    </fieldset>
  );
}
