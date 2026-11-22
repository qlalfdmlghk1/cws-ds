import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllable, useFieldId } from '../../internal/hooks';
import { ChoiceText } from '../../internal/Choice';
import { FieldLabel } from '../../internal/Field';

export interface AppRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
}

/** 단독으로도 쓸 수 있지만 보통은 AppRadioGroup을 쓴다. */
export function AppRadio({ label, description, className, ...rest }: AppRadioProps) {
  return (
    <label className={cx('cds-choice', rest.disabled && 'is-disabled', className)}>
      <span className="cds-radio">
        <input {...rest} type="radio" className="cds-choice__input" />
        <span className="cds-radio__dot" aria-hidden="true" />
      </span>
      <ChoiceText label={label} description={description} />
    </label>
  );
}

export interface RadioGroupOption { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }
export interface AppRadioGroupProps {
  /** 그룹 제목 (legend). */
  label?: string;
  options: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 기본 'vertical'. 짧은 선택지 2~3개면 'horizontal'. */
  direction?: 'vertical' | 'horizontal';
  name?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  error?: string;
  className?: string;
}

export function AppRadioGroup({ label, options, value: valueProp, defaultValue, onChange, direction = 'vertical', name: nameProp, required, disabled, helperText, error, className }: AppRadioGroupProps) {
  const name = useFieldId(nameProp);
  const [value, setValue] = useControllable<string | undefined>(valueProp, defaultValue, onChange as (v: string | undefined) => void);
  const descId = error || helperText ? `${name}-desc` : undefined;
  return (
    <fieldset className={cx('cds-group', className)} aria-describedby={descId} disabled={disabled}>
      <FieldLabel as="legend" required={required}>{label}</FieldLabel>
      <div className={cx('cds-group__items', direction === 'horizontal' && 'cds-group__items--row')}>
        {options.map((o) => (
          <AppRadio
            key={o.value}
            name={name}
            value={o.value}
            label={o.label}
            description={o.description}
            disabled={disabled || o.disabled}
            required={required}
            checked={value === o.value}
            onChange={() => setValue(o.value)}
          />
        ))}
      </div>
      {descId && <p id={descId} className={error ? 'cds-field__error' : 'cds-field__help'}>{error || helperText}</p>}
    </fieldset>
  );
}
