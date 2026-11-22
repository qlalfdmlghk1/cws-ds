import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { DownIcon, UpIcon } from '../../internal/icons';

export interface AppCardProps extends HTMLAttributes<HTMLElement> {
  /** 'outline'(기본, 흰 바탕 + line 테두리) · 'filled'(surface-raised 바탕, 테두리 없음). */
  variant?: 'outline' | 'filled';
  /** 안쪽 여백. sm 12 · md 24(기본) · lg 32 · none 0. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** 카드 전체가 눌리는 링크·버튼. href가 있으면 <a>, onClick이면 <button>. */
  interactive?: boolean;
  href?: string;
  /** 고를 수 있는 카드의 선택 상태. brand 테두리 + brand-soft 바탕. */
  selected?: boolean;
  /** 감쌀 태그를 직접 정한다 (section, article, li…). */
  as?: ElementType;
}

export function AppCard({ variant = 'outline', padding = 'md', interactive, selected, as, className, children, ...rest }: AppCardProps) {
  const Tag: ElementType = as ?? (rest.href ? 'a' : interactive && rest.onClick ? 'button' : 'div');
  const extra: Record<string, unknown> = {};
  if (Tag === 'button') { extra.type = 'button'; if (selected !== undefined) extra['aria-pressed'] = !!selected; }
  return (
    <Tag
      {...rest}
      {...extra}
      className={cx('cds-card', `cds-card--${variant}`, `cds-card--pad-${padding}`, (interactive || rest.href) && 'cds-card--interactive', selected && 'is-selected', className)}
    >
      {children}
    </Tag>
  );
}

export interface AppCardHeaderProps {
  /** 제목 위 작은 분류 글자 (brand-ink). */
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** 오른쪽 위 AppIconButton(더보기 등)이나 작은 버튼. */
  action?: ReactNode;
  /** 제목 태그. 기본 h3. */
  titleAs?: ElementType;
  className?: string;
}
export function AppCardHeader({ eyebrow, title, description, action, titleAs: Title = 'h3', className }: AppCardHeaderProps) {
  return (
    <div className={cx('cds-card__head', className)}>
      <div className="cds-card__titles">
        {eyebrow && <span className="cds-card__eyebrow">{eyebrow}</span>}
        {title && <Title className="cds-card__title">{title}</Title>}
        {description && <p className="cds-card__desc">{description}</p>}
      </div>
      {action && <div className="cds-card__action">{action}</div>}
    </div>
  );
}
export function AppCardBody({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx('cds-card__body', className)}>{children}</div>;
}
/** 하단 버튼 줄. 기본 오른쪽 정렬, align="start"면 왼쪽. */
export function AppCardFooter({ children, align = 'end', className }: { children?: ReactNode; align?: 'start' | 'end'; className?: string }) {
  return <div className={cx('cds-card__foot', align === 'start' && 'cds-card__foot--start', className)}>{children}</div>;
}

export interface StatDelta {
  /** "+12.4%", "-3건" 처럼 화면에 보일 글자 그대로. */
  value: ReactNode;
  direction?: 'up' | 'down' | 'flat';
  /** 색. 기본은 up=positive(초록), down=negative(빨강). 줄어야 좋은 지표는 직접 뒤집는다. */
  tone?: 'positive' | 'negative' | 'neutral';
}
export interface AppStatCardProps {
  /** 지표 이름. "월 방문자". */
  label: ReactNode;
  /** 큰 숫자. 포맷은 쓰는 쪽에서. */
  value: ReactNode;
  /** 숫자 뒤 작은 단위. "명", "%", "원". */
  unit?: ReactNode;
  delta?: StatDelta;
  /** 변화량 옆 기준 설명. "지난주 대비". */
  caption?: ReactNode;
  icon?: ReactNode;
  variant?: 'outline' | 'filled';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}
export function AppStatCard({ label, value, unit, delta, caption, icon, variant, padding = 'md', className }: AppStatCardProps) {
  const dir = delta ? delta.direction ?? 'flat' : null;
  const tone = delta ? delta.tone ?? (dir === 'up' ? 'positive' : dir === 'down' ? 'negative' : 'neutral') : null;
  return (
    <AppCard variant={variant} padding={padding} className={cx('cds-stat', className)}>
      <div className="cds-stat__top">
        <span className="cds-stat__label">{label}</span>
        {icon && <span className="cds-stat__icon" aria-hidden="true">{icon}</span>}
      </div>
      <div className="cds-stat__value">{value}{unit && <span className="cds-stat__unit">{unit}</span>}</div>
      {(delta || caption) && (
        <div className="cds-stat__foot">
          {delta && (
            <span className={cx('cds-stat__delta', `cds-stat__delta--${tone}`)}>
              {dir === 'up' ? <UpIcon /> : dir === 'down' ? <DownIcon /> : null}
              <span className="cds-sr">{dir === 'up' ? '증가 ' : dir === 'down' ? '감소 ' : ''}</span>
              {delta.value}
            </span>
          )}
          {caption && <span className="cds-stat__caption">{caption}</span>}
        </div>
      )}
    </AppCard>
  );
}
