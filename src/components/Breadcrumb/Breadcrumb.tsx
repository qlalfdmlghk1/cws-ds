import { useState, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { NextIcon } from '../../internal/icons';

export interface BreadcrumbItem {
  label: ReactNode;
  /** 링크 주소. 마지막 항목(현재 페이지)은 빼도 된다. */
  href?: string;
  /** 라우터를 쓰면 여기서 이동하고 e.preventDefault(). */
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export interface BreadcrumbProps {
  /** 처음부터 현재 페이지까지. 마지막 항목이 현재 페이지(aria-current). */
  items: BreadcrumbItem[];
  /** 이보다 많으면 첫 항목과 끝 두 항목만 두고 가운데를 "…"로 접는다. "…"을 누르면 펼친다. */
  maxItems?: number;
  'aria-label'?: string;
  className?: string;
}

export function Breadcrumb({ items, maxItems, 'aria-label': ariaLabel = '현재 위치', className }: BreadcrumbProps) {
  const [expanded, setExpanded] = useState(false);
  const collapse = !expanded && maxItems !== undefined && items.length > maxItems && items.length > 3;
  type Row = { item: BreadcrumbItem; index: number } | 'more';
  const rows: Row[] = collapse
    ? [{ item: items[0], index: 0 }, 'more', ...items.slice(-2).map((item, k) => ({ item, index: items.length - 2 + k }))]
    : items.map((item, index) => ({ item, index }));

  return (
    <nav aria-label={ariaLabel} className={cx('cds-breadcrumb', className)}>
      <ol className="cds-breadcrumb__list">
        {rows.map((row, i) => (
          <li key={row === 'more' ? 'more' : row.index} className="cds-breadcrumb__item">
            {i > 0 && <NextIcon className="cds-breadcrumb__sep" aria-hidden="true" />}
            {row === 'more' ? (
              <button type="button" className="cds-breadcrumb__more" aria-label="경로 모두 보기" onClick={() => setExpanded(true)}>…</button>
            ) : row.index === items.length - 1 ? (
              <span className="cds-breadcrumb__current" aria-current="page">{row.item.label}</span>
            ) : (
              <a className="cds-breadcrumb__link" href={row.item.href} onClick={row.item.onClick}>{row.item.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
