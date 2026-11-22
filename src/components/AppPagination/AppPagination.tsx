import { cx } from '../../internal/cx';
import { useControllable } from '../../internal/hooks';
import { NextIcon, PrevIcon } from '../../internal/icons';
import { AppIconButton } from '../AppIconButton/AppIconButton';

export interface AppPaginationProps {
  /** 전체 페이지 수. 없으면 total ÷ pageSize. */
  pageCount?: number;
  total?: number;
  pageSize?: number;
  page?: number;
  defaultPage?: number;
  onChange?: (page: number) => void;
  /** 현재 페이지 양옆에 보일 번호 개수. 기본 1. */
  siblingCount?: number;
  /** 왼쪽에 "총 N개" (total 필요). */
  showTotal?: boolean;
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}

export function pageRange(page: number, count: number, sib: number): Array<number | 'gap-l' | 'gap-r'> {
  const total = sib * 2 + 5;
  const nums = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  if (count <= total) return nums(1, count);
  const left = Math.max(page - sib, 1), right = Math.min(page + sib, count);
  const showL = left > 2, showR = right < count - 1;
  if (!showL && showR) return [...nums(1, 3 + sib * 2), 'gap-r', count];
  if (showL && !showR) return [1, 'gap-l', ...nums(count - (2 + sib * 2), count)];
  return [1, 'gap-l', ...nums(left, right), 'gap-r', count];
}

export function AppPagination({ pageCount, total, pageSize = 10, page: pageProp, defaultPage = 1, onChange, siblingCount = 1, showTotal, size = 'md', label, className }: AppPaginationProps) {
  const count = pageCount ?? Math.max(1, Math.ceil((total ?? 0) / pageSize));
  const [raw, setPage] = useControllable(pageProp, defaultPage, onChange);
  const page = Math.min(Math.max(1, raw), count);
  const go = (p: number) => { if (p >= 1 && p <= count && p !== page) setPage(p); };
  return (
    <nav className={cx('cds-pager', `cds-pager--${size}`, className)} aria-label={label ?? '페이지'}>
      {total !== undefined && showTotal && <span className="cds-pager__total">총 {total.toLocaleString('ko-KR')}개</span>}
      <ul className="cds-pager__list">
        <li><AppIconButton icon={<PrevIcon />} label="이전 페이지" size={size} tooltip={false} disabled={page <= 1} onClick={() => go(page - 1)} /></li>
        {pageRange(page, count, siblingCount).map((it) =>
          typeof it === 'string' ? (
            <li key={it} className="cds-pager__gap" aria-hidden="true">…</li>
          ) : (
            <li key={it}>
              <button type="button" className={cx('cds-pager__page', it === page && 'is-current')} aria-current={it === page ? 'page' : undefined} aria-label={`${it}페이지`} onClick={() => go(it)}>
                {it}
              </button>
            </li>
          ),
        )}
        <li><AppIconButton icon={<NextIcon />} label="다음 페이지" size={size} tooltip={false} disabled={page >= count} onClick={() => go(page + 1)} /></li>
      </ul>
    </nav>
  );
}
