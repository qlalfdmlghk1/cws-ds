import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 모양. 기본 'primary'. primary는 한 화면에 하나만. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** 크기. sm 32px · md 40px · lg 48px. 기본 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** 처리 중. 스피너를 보여주고 클릭을 막는다. */
  loading?: boolean;
  /** 부모 너비를 꽉 채운다. */
  fullWidth?: boolean;
  /** 라벨 앞 아이콘 (svg 노드). */
  iconLeft?: ReactNode;
  /** 라벨 뒤 아이콘 (svg 노드). */
  iconRight?: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading = false, fullWidth, iconLeft, iconRight, className, children, type = 'button', disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx('cds-btn', `cds-btn--${variant}`, `cds-btn--${size}`, fullWidth && 'cds-btn--full', loading && 'is-loading', className)}
    >
      {loading ? <span className="cds-btn__spinner" aria-hidden="true" /> : iconLeft ? <span className="cds-btn__icon" aria-hidden="true">{iconLeft}</span> : null}
      <span className="cds-btn__label">{children}</span>
      {!loading && iconRight ? <span className="cds-btn__icon" aria-hidden="true">{iconRight}</span> : null}
    </button>
  );
}
