import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllable, useFieldId } from '../../internal/hooks';
import { FieldLabel, FieldMessage } from '../../internal/Field';

export interface SliderProps {
  label?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** 기본 0. */
  min?: number;
  /** 기본 100. */
  max?: number;
  /** 기본 1. */
  step?: number;
  /** 라벨 오른쪽에 현재 값. 기본 true. */
  showValue?: boolean;
  /** 값 표시를 바꾼다. "70%", "3만 원". 스크린리더에도 이 문구를 읽힌다. */
  formatValue?: (value: number) => string;
  /** 막대 아래 양 끝 글자. 기본은 없음. */
  minLabel?: ReactNode;
  maxLabel?: ReactNode;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export function Slider({ label, value, defaultValue, onChange, min = 0, max = 100, step = 1, showValue = true, formatValue, minLabel, maxLabel, helperText, disabled, fullWidth, name, id: idProp, className }: SliderProps) {
  const id = useFieldId(idProp);
  const [v, setV] = useControllable(value, defaultValue ?? min, onChange);
  const pct = max > min ? ((v - min) / (max - min)) * 100 : 0;
  const text = formatValue ? formatValue(v) : String(v);
  return (
    <div className={cx('cds-field', 'cds-slider', fullWidth && 'cds-field--full', disabled && 'is-disabled', className)}>
      {(label || showValue) && (
        <div className="cds-slider__head">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {showValue && <span className="cds-slider__value" aria-hidden="true">{text}</span>}
        </div>
      )}
      <input
        id={id}
        type="range"
        name={name}
        className="cds-slider__input"
        min={min}
        max={max}
        step={step}
        value={v}
        disabled={disabled}
        aria-valuetext={formatValue ? text : undefined}
        aria-describedby={helperText ? `${id}-msg` : undefined}
        style={{ '--cds-slider-pct': `${pct}%` } as CSSProperties}
        onChange={(e) => setV(Number(e.target.value))}
      />
      {(minLabel || maxLabel) && (
        <div className="cds-slider__ends" aria-hidden="true"><span>{minLabel}</span><span>{maxLabel}</span></div>
      )}
      <FieldMessage id={`${id}-msg`} helperText={helperText} />
    </div>
  );
}
