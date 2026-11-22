import { Children, cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { PersonIcon } from '../../internal/icons';

type Size = 'xs' | 'sm' | 'md' | 'lg';
export interface AppAvatarProps {
  /** 이미지 주소. 없거나 깨지면 이니셜, 이름도 없으면 사람 아이콘. */
  src?: string;
  /** 스크린리더 이름 + 이니셜 재료. 한글 3자 이상은 뒤 두 글자, 영문은 첫 글자들. */
  name?: string;
  /** xs 24 · sm 32 · md 40(기본) · lg 56px. */
  size?: Size;
  /** 기본 원형. 회사·프로젝트 로고는 'square'. */
  shape?: 'circle' | 'square';
  /** 오른쪽 아래 상태 점. */
  status?: 'online' | 'busy' | 'away';
  title?: string;
  className?: string;
}

export function initials(name?: string): string {
  const s = String(name ?? '').trim();
  if (!s) return '';
  const compact = s.replace(/\s/g, '');
  if (/^[가-힣]+$/.test(compact)) return compact.length >= 3 ? compact.slice(-2) : compact;
  const parts = s.split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export function AppAvatar({ src, name, size = 'md', shape, status, title, className }: AppAvatarProps) {
  const [broken, setBroken] = useState(false);
  return (
    <span className={cx('cds-avatar', `cds-avatar--${size}`, shape === 'square' && 'cds-avatar--square', className)} role="img" aria-label={name ?? '사용자'} title={title}>
      {src && !broken ? (
        <img src={src} alt="" onError={() => setBroken(true)} />
      ) : name ? (
        <span className="cds-avatar__text" aria-hidden="true">{initials(name)}</span>
      ) : (
        <PersonIcon className="cds-avatar__icon" aria-hidden="true" />
      )}
      {status && <span className={cx('cds-avatar__status', `is-${status}`)} aria-hidden="true" />}
    </span>
  );
}

export interface AppAvatarGroupProps {
  children: ReactNode;
  /** 이 개수를 넘으면 "+N"으로 줄인다. */
  max?: number;
  size?: Size;
  label?: string;
  className?: string;
}

export function AppAvatarGroup({ children, max, size = 'md', label, className }: AppAvatarGroupProps) {
  const list = Children.toArray(children).filter(isValidElement) as ReactElement<AppAvatarProps>[];
  const shown = list.slice(0, max ?? list.length);
  const rest = list.length - shown.length;
  return (
    <span className={cx('cds-avatar-group', className)} role="group" aria-label={label ?? `사용자 ${list.length}명`}>
      {shown.map((c) => cloneElement(c, { size }))}
      {rest > 0 && (
        <span className={cx('cds-avatar', `cds-avatar--${size}`, 'cds-avatar--more')} role="img" aria-label={`외 ${rest}명`}>
          <span className="cds-avatar__text" aria-hidden="true">+{rest}</span>
        </span>
      )}
    </span>
  );
}
