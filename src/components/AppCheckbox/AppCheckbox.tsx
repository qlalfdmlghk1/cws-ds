import { forwardRef, useEffect, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { CheckIcon, DashIcon } from '../../internal/icons';
import { ChoiceText } from '../../internal/Choice';

export interface AppCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 옆에 붙는 라벨. 클릭 영역에 포함된다. */
  label?: ReactNode;
  /** 라벨 아래 보조 설명. */
  description?: ReactNode;
  /** 일부만 선택된 상태(–). "전체 선택" 체크박스에 쓴다. */
  indeterminate?: boolean;
}

export const AppCheckbox = forwardRef<HTMLInputElement, AppCheckboxProps>(function AppCheckbox({ label, description, indeterminate, className, ...rest }, fwd) {
  const ref = useRef<HTMLInputElement>(null);
  useImperativeHandle(fwd, () => ref.current as HTMLInputElement);
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return (
    <label className={cx('cds-choice', rest.disabled && 'is-disabled', className)}>
      <span className={cx('cds-check', indeterminate && 'is-mixed')}>
        <input {...rest} ref={ref} type="checkbox" className="cds-choice__input" aria-checked={indeterminate ? 'mixed' : undefined} />
        <span className="cds-check__box" aria-hidden="true">
          <CheckIcon className="cds-check__mark" />
          <DashIcon className="cds-check__dash" />
        </span>
      </span>
      <ChoiceText label={label} description={description} />
    </label>
  );
});
