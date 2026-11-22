import type { ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { CloseIcon, ToneIcon } from '../../internal/icons';
import { AppIconButton } from '../AppIconButton/AppIconButton';

export interface AppAlertProps {
  /** 기본 'info'. danger는 role="alert"로 바로 읽힌다. */
  tone?: 'info' | 'success' | 'danger' | 'neutral';
  /** 한 줄 요약. */
  title?: ReactNode;
  /** 설명. 한두 문장. */
  children?: ReactNode;
  /** 오른쪽(좁으면 아래) 버튼. 보통 AppButton size="sm" 하나. */
  action?: ReactNode;
  /** 넣으면 × 버튼이 생긴다. 숨기는 건 쓰는 쪽. */
  onClose?: () => void;
  /** 아이콘 바꾸기. false면 아이콘 없음. neutral은 기본이 없음. */
  icon?: ReactNode | false;
  className?: string;
}

export function AppAlert({ tone = 'info', title, children, action, onClose, icon, className }: AppAlertProps) {
  const glyph = icon === false ? null : icon ?? (tone === 'neutral' ? null : <ToneIcon tone={tone} />);
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cx('cds-alert', `cds-alert--${tone}`, className)}>
      {glyph && <span className="cds-alert__icon" aria-hidden="true">{glyph}</span>}
      <div className="cds-alert__text">
        {title && <p className="cds-alert__title">{title}</p>}
        {children && <div className="cds-alert__desc">{children}</div>}
      </div>
      {action && <div className="cds-alert__action">{action}</div>}
      {onClose && <AppIconButton icon={<CloseIcon />} label="닫기" size="sm" variant="ghost" className="cds-alert__close" onClick={onClose} />}
    </div>
  );
}
