import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { ChoiceText } from '../../internal/Choice';

export interface AppSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** 스위치 왼쪽 라벨. */
  label?: ReactNode;
  description?: ReactNode;
  /** 기본 36×20, sm 28×16. */
  size?: 'sm' | 'md';
}

export function AppSwitch({ label, description, size, className, ...rest }: AppSwitchProps) {
  return (
    <label className={cx('cds-choice', 'cds-choice--switch', rest.disabled && 'is-disabled', className)}>
      <ChoiceText label={label} description={description} />
      <span className={cx('cds-switch', size === 'sm' && 'cds-switch--sm')}>
        <input {...rest} type="checkbox" role="switch" className="cds-choice__input" />
        <span className="cds-switch__track" aria-hidden="true"><span className="cds-switch__knob" /></span>
      </span>
    </label>
  );
}
