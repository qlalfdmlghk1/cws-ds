import { useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { joinIds, useFieldId } from '../../internal/hooks';
import { FieldLabel, FieldMessage } from '../../internal/Field';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** 입력창 위 라벨. 거의 항상 넣는다. 없으면 aria-label을 직접 넣을 것. */
  label?: string;
  /** 입력창 아래 도움말. error가 있으면 error가 대신 보인다. */
  helperText?: string;
  /** 에러 메시지. 넣으면 빨간 테두리 + 메시지 + aria-invalid. */
  error?: string;
  /** 높이. sm 32 · md 40 · lg 48px. 옆 Button과 맞춘다. 기본 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** 입력값 앞 아이콘 (검색 돋보기 등). */
  iconLeft?: ReactNode;
  /** 입력값 뒤 단위·텍스트 ("원", "%"). */
  suffix?: ReactNode;
  /** maxLength와 같이 쓰면 "12 / 50" 글자 수 표시. */
  showCount?: boolean;
  /** 부모 너비를 꽉 채운다 (기본 280px). */
  fullWidth?: boolean;
}

export function TextInput({ label, helperText, error, size = 'md', iconLeft, suffix, showCount, fullWidth, className, id: idProp, value: valueProp, defaultValue, onChange, type = 'text', ...rest }: TextInputProps) {
  const id = useFieldId(idProp);
  const controlled = valueProp !== undefined;
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const value = controlled ? valueProp : inner;
  const descId = error || helperText ? `${id}-desc` : undefined;
  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    if (!controlled) setInner(e.target.value);
    onChange?.(e);
  };
  return (
    <div className={cx('cds-field', fullWidth && 'cds-field--full', className)}>
      <FieldLabel htmlFor={id} required={rest.required}>{label}</FieldLabel>
      <div className={cx('cds-input', `cds-input--${size}`, error && 'is-error', rest.disabled && 'is-disabled', rest.readOnly && 'is-readonly')}>
        {iconLeft && <span className="cds-input__icon" aria-hidden="true">{iconLeft}</span>}
        <input {...rest} id={id} type={type} value={value} onChange={handle} className="cds-input__control" aria-invalid={error ? true : undefined} aria-describedby={joinIds(rest['aria-describedby'], descId)} />
        {suffix && <span className="cds-input__suffix">{suffix}</span>}
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
