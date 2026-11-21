import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Tooltip } from '../Tooltip/Tooltip';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 아이콘 (svg 노드, currentColor로 그린 것). */
  icon: ReactNode;
  /** 필수. 스크린리더용 이름이자 hover 때 뜨는 Tooltip 문구. 예: "닫기", "설정". */
  label: string;
  /** 모양. 기본 'ghost'. Button과 같은 색 규칙. */
  variant?: 'ghost' | 'secondary' | 'primary' | 'danger';
  /** 크기. sm 32px · md 40px · lg 48px 정사각형. 아이콘은 16 · 20 · 24px. 기본 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** hover·키보드 포커스 때 label을 Tooltip으로 보여준다. 기본 true. */
  tooltip?: boolean;
  /** Tooltip 위치. 기본 'top'. */
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

export function IconButton({ icon, label, variant = 'ghost', size = 'md', tooltip = true, tooltipPlacement, className, type = 'button', ...rest }: IconButtonProps) {
  const btn = (
    <button {...rest} type={type} aria-label={label} className={cx('cds-ibtn', `cds-btn--${variant}`, `cds-ibtn--${size}`, className)}>
      <span className="cds-ibtn__icon" aria-hidden="true">{icon}</span>
    </button>
  );
  return tooltip ? <Tooltip content={label} placement={tooltipPlacement} describe={false}>{btn}</Tooltip> : btn;
}
