import { useState, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { SortAscIcon, SortDescIcon, SortNoneIcon } from '../../internal/icons';
import { Checkbox } from '../Checkbox/Checkbox';

type Key = string | number;
export interface TableColumn<Row> {
  /** 행 객체의 필드 이름. 정렬 기준과 기본 표시값. */
  key: string;
  header: ReactNode;
  /** 셀 내용을 직접 그린다. 없으면 row[key]. */
  render?: (row: Row, index: number) => ReactNode;
  /** 'right'는 숫자·금액, 'center'는 아이콘·상태 점. */
  align?: 'left' | 'right' | 'center';
  /** 숫자 열. 폭이 같은 숫자 글꼴. 보통 align: 'right'와 같이. */
  numeric?: boolean;
  sortable?: boolean;
  /** 정렬에 쓸 값 (render로 꾸민 열일 때). */
  sortValue?: (row: Row) => string | number;
  width?: number | string;
}
export interface TableSort { key: string; direction: 'asc' | 'desc' }
export interface TableProps<Row> {
  columns: TableColumn<Row>[];
  rows: Row[];
  /** 행 고유값 필드 이름 또는 함수. 기본 'id'. */
  rowKey?: keyof Row | ((row: Row) => Key);
  /** 스크린리더용 표 제목. */
  caption?: string;
  /** 'comfortable'(기본, 행 52px) · 'compact'(40px). */
  density?: 'comfortable' | 'compact';
  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  /** true면 정렬은 서버에서 (rows를 그대로 그림). */
  manualSort?: boolean;
  /** 맨 앞 체크박스 열. */
  selectable?: boolean;
  selectedKeys?: Key[];
  onSelectionChange?: (keys: Key[]) => void;
  onRowClick?: (row: Row) => void;
  /** 로딩 중 스켈레톤 행. */
  loading?: boolean;
  loadingRows?: number;
  /** 행이 없을 때 내용. 기본 "데이터가 없어요." */
  empty?: ReactNode;
  /** 헤더 고정 + maxHeight에서 스크롤. */
  stickyHeader?: boolean;
  maxHeight?: number | string;
  className?: string;
}

const icons = { none: <SortNoneIcon />, asc: <SortAscIcon />, desc: <SortDescIcon /> };

export function Table<Row extends object>(props: TableProps<Row>) {
  const { columns, rows, rowKey = 'id' as keyof Row, caption, density = 'comfortable', selectable, loading, loadingRows = 4, empty, stickyHeader, maxHeight, className } = props;
  const keyOf = (r: Row): Key => (typeof rowKey === 'function' ? rowKey(r) : (r[rowKey] as unknown as Key));
  const sortControlled = props.sort !== undefined;
  const [innerSort, setInnerSort] = useState<TableSort | null>(props.defaultSort ?? null);
  const sort = sortControlled ? props.sort ?? null : innerSort;
  const selControlled = props.selectedKeys !== undefined;
  const [innerSel, setInnerSel] = useState<Key[]>([]);
  const selected = selControlled ? props.selectedKeys ?? [] : innerSel;

  const setSort = (s: TableSort | null) => { if (!sortControlled) setInnerSort(s); props.onSortChange?.(s); };
  const toggleSort = (c: TableColumn<Row>) => {
    if (!sort || sort.key !== c.key) setSort({ key: c.key, direction: 'asc' });
    else if (sort.direction === 'asc') setSort({ key: c.key, direction: 'desc' });
    else setSort(null);
  };
  const setSelected = (k: Key[]) => { if (!selControlled) setInnerSel(k); props.onSelectionChange?.(k); };

  let shown = rows;
  if (sort && !props.manualSort) {
    const col = columns.find((c) => c.key === sort.key);
    const get = col?.sortValue ?? ((r: Row) => (r as Record<string, unknown>)[sort.key] as string | number | null | undefined);
    shown = [...rows].sort((a, b) => {
      const x = get(a), y = get(b);
      if (x == null) return 1;
      if (y == null) return -1;
      const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko', { numeric: true });
      return sort.direction === 'desc' ? -c : c;
    });
  }
  const keys = shown.map(keyOf);
  const sel = new Set(selected);
  const nSel = keys.filter((k) => sel.has(k)).length;
  const allOn = keys.length > 0 && nSel === keys.length;
  const colCount = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cx('cds-table-wrap', stickyHeader && 'is-sticky', className)} style={maxHeight ? { maxHeight } : undefined}>
      <table className={cx('cds-table', `cds-table--${density}`)}>
        {caption && <caption className="cds-sr">{caption}</caption>}
        <thead>
          <tr>
            {selectable && (
              <th className="cds-table__check" scope="col">
                <Checkbox
                  aria-label="전체 선택"
                  checked={allOn}
                  indeterminate={nSel > 0 && !allOn}
                  disabled={!keys.length || loading}
                  onChange={() => setSelected(allOn ? selected.filter((k) => !keys.includes(k)) : [...selected, ...keys.filter((k) => !sel.has(k))])}
                />
              </th>
            )}
            {columns.map((c) => {
              const dir = sort && sort.key === c.key ? sort.direction : null;
              return (
                <th
                  key={c.key}
                  scope="col"
                  style={c.width ? { width: c.width } : undefined}
                  className={cx('cds-table__th', c.align && `is-${c.align}`)}
                  aria-sort={c.sortable ? (dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none') : undefined}
                >
                  {c.sortable ? (
                    <button type="button" className={cx('cds-table__sort', dir && 'is-sorted')} onClick={() => toggleSort(c)}>
                      <span>{c.header}</span>
                      <span className="cds-table__sort-icon" aria-hidden="true">{icons[dir ?? 'none']}</span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        {loading ? (
          <tbody aria-busy="true">
            {Array.from({ length: loadingRows }, (_, n) => (
              <tr key={`sk${n}`} className="cds-table__row">
                {selectable && <td className="cds-table__check" />}
                {columns.map((c, ci) => (
                  <td key={c.key} className={cx('cds-table__td', c.align && `is-${c.align}`)}>
                    <span className="cds-skel" style={{ width: `${50 + ((n * 17 + ci * 23) % 40)}%` }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : !shown.length ? (
          <tbody>
            <tr><td colSpan={colCount} className="cds-table__empty">{empty ?? '데이터가 없어요.'}</td></tr>
          </tbody>
        ) : (
          <tbody>
            {shown.map((r, ri) => {
              const k = keyOf(r);
              const on = sel.has(k);
              return (
                <tr
                  key={k}
                  className={cx('cds-table__row', on && 'is-selected', props.onRowClick && 'is-clickable')}
                  onClick={props.onRowClick ? (e) => { if ((e.target as HTMLElement).closest('button, a, input, label')) return; props.onRowClick?.(r); } : undefined}
                >
                  {selectable && (
                    <td className="cds-table__check">
                      <Checkbox aria-label="행 선택" checked={on} onChange={() => setSelected(on ? selected.filter((x) => x !== k) : [...selected, k])} />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className={cx('cds-table__td', c.align && `is-${c.align}`, c.numeric && 'is-num')}>
                      {c.render ? c.render(r, ri) : ((r as Record<string, unknown>)[c.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
}
