import { cx } from '../../internal/cx';

export interface AppSpinnerProps {
  /** sm 16 · md 24(기본) · lg 32px. */
  size?: 'sm' | 'md' | 'lg';
  /** 'brand'(기본) 또는 'current'(감싼 글자색을 따른다). */
  tone?: 'brand' | 'current';
  /** 스크린리더가 읽는 문구. 기본 "불러오는 중". */
  label?: string;
  className?: string;
}

export function AppSpinner({ size = 'md', tone = 'brand', label = '불러오는 중', className }: AppSpinnerProps) {
  return (
    <span role="status" className={cx('cds-spinner', `cds-spinner--${size}`, tone === 'current' && 'cds-spinner--current', className)}>
      <span className="cds-spinner__ring" aria-hidden="true" />
      <span className="cds-sr-only">{label}</span>
    </span>
  );
}
