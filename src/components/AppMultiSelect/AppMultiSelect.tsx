import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../internal/cx';
import { joinIds, useControllable, useFieldId } from '../../internal/hooks';
import { useOutside } from '../../internal/useOutside';
import { CheckIcon, ChevronDownIcon, SearchIcon } from '../../internal/icons';
import { FieldLabel, FieldMessage, fieldName, type FieldNameProps } from '../../internal/Field';
import { MaybePortal, useFloating } from '../../internal/Floating';
import type { SelectOption } from '../AppSelect/AppSelect';

export interface AppMultiSelectProps extends FieldNameProps {
  /**
   * 목록을 document.body에 띄운다. 모달 본문처럼 스크롤되는 영역 안에서 목록이 잘릴 때 켠다.
   * 트리거 위치를 따라가고, 아래 공간이 모자라면 위로 펼친다. 기본 false.
   */
  portal?: boolean;
  label?: string;
  options: SelectOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  /** 목록 위 검색창. 선택지가 10개를 넘으면 켠다. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** 최대 선택 개수. 다 차면 나머지가 막힌다. */
  max?: number;
  /** 트리거에 보일 태그 수. 넘치면 "+N". 기본 2. */
  maxTagCount?: number;
  size?: 'sm' | 'md' | 'lg';
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  defaultOpen?: boolean;
  id?: string;
  className?: string;
}

export function AppMultiSelect({ label, options, value: valueProp, defaultValue = [], onChange, placeholder, searchable, searchPlaceholder, max, maxTagCount = 2, size = 'md', helperText, error, required, disabled, fullWidth, defaultOpen, portal, id: idProp, className, ...nameProps }: AppMultiSelectProps) {
  const id = useFieldId(idProp);
  const [value, setValue] = useControllable(valueProp, defaultValue, onChange);
  const on = new Set(value);
  const [open, setOpen] = useState(!!defaultOpen);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const userOpened = useRef(false);
  const shown = q ? options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())) : options;
  const descId = error || helperText ? `${id}-desc` : undefined;
  const { nameId, hidden } = fieldName(id, label, nameProps);
  const atMax = !!max && value.length >= max;

  const step = (from: number, dir: 1 | -1) => {
    for (let n = 1; n <= shown.length; n++) {
      const j = (from + dir * n + shown.length * 2) % shown.length;
      if (!shown[j].disabled) return j;
    }
    return -1;
  };
  const toggle = (o?: SelectOption) => {
    if (!o || o.disabled) return;
    if (!on.has(o.value) && atMax) return;
    setValue(on.has(o.value) ? value.filter((v) => v !== o.value) : options.filter((x) => on.has(x.value) || x.value === o.value).map((x) => x.value));
  };
  const openList = () => {
    if (disabled) return;
    userOpened.current = true;
    setQ('');
    setActive(-1);
    setOpen(true);
  };
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) btnRef.current?.focus();
  };
  useOutside([rootRef, popRef], open, useCallback(() => setOpen(false), []));
  const floating = useFloating(open, btnRef, popRef, { enabled: !!portal, matchWidth: true });
  useEffect(() => {
    if (!open || !userOpened.current) return;
    (searchable ? inputRef.current : listRef.current)?.focus();
    setActive(step(-1, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    if (open) setActive(shown.length ? step(-1, 1) : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  useEffect(() => {
    if (!open || active < 0) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active]);

  const onPopKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); setActive(step(active, 1)); }
    else if (k === 'ArrowUp') { e.preventDefault(); setActive(step(active, -1)); }
    else if (k === 'Enter' || (k === ' ' && !searchable)) { e.preventDefault(); toggle(shown[active]); }
    else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
    // 목록 안의 검색칸·버튼으로 Tab이 들어갔다가 목록과 함께 사라지지 않게, 닫고 트리거로 돌아온다.
    else if (k === 'Tab') { e.preventDefault(); close(true); }
  };
  const labels = options.filter((o) => on.has(o.value)).map((o) => o.label);
  const activeId = active >= 0 ? `${id}-opt-${active}` : undefined;

  return (
    <div ref={rootRef} className={cx('cds-field', 'cds-select', 'cds-mselect', fullWidth && 'cds-field--full', className)}>
      <FieldLabel as="span" id={`${id}-label`} required={required}>{label}</FieldLabel>
      {hidden}
      <div className="cds-select__anchor">
        <button
          ref={btnRef}
          id={id}
          type="button"
          disabled={disabled}
          className={cx('cds-input', `cds-input--${size}`, 'cds-select__trigger', error && 'is-error', disabled && 'is-disabled', open && 'is-open')}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={joinIds(nameId, id)}
          aria-invalid={error ? true : undefined}
          aria-describedby={descId}
          onClick={() => (open ? close(false) : openList())}
          onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.preventDefault(); close(false); } else if (e.key === 'ArrowDown') { e.preventDefault(); openList(); } }}
        >
          {labels.length ? (
            <span className="cds-mselect__tags">
              {labels.slice(0, maxTagCount).map((l, i) => <span key={i} className="cds-mselect__tag">{l}</span>)}
              {labels.length > maxTagCount && <span className="cds-mselect__more">+{labels.length - maxTagCount}</span>}
            </span>
          ) : (
            <span className="cds-select__value is-placeholder">{placeholder ?? '선택하세요'}</span>
          )}
          <span className="cds-select__chevron" aria-hidden="true"><ChevronDownIcon /></span>
        </button>
        {open && (
          <MaybePortal enabled={portal}>
          <div
            ref={popRef}
            className={cx('cds-select__list', 'cds-mselect__pop', portal && 'is-portal', floating.placement === 'top' && 'is-top')}
            style={floating.style}
            onKeyDown={onPopKey}
          >
            {searchable && (
              <div className="cds-mselect__search">
                <span className="cds-input__icon" aria-hidden="true"><SearchIcon /></span>
                <input
                  ref={inputRef}
                  className="cds-input__control"
                  value={q}
                  placeholder={searchPlaceholder ?? '검색'}
                  role="combobox"
                  aria-expanded
                  aria-controls={`${id}-list`}
                  aria-activedescendant={activeId}
                  aria-label="옵션 검색"
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            )}
            <ul
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              aria-multiselectable
              tabIndex={searchable ? undefined : -1}
              className="cds-mselect__list"
              aria-labelledby={nameId}
              aria-activedescendant={!searchable ? activeId : undefined}
            >
              {shown.length ? (
                shown.map((o, i) => {
                  const isOn = on.has(o.value);
                  const blocked = o.disabled || (!isOn && atMax);
                  return (
                    <li
                      key={o.value}
                      id={`${id}-opt-${i}`}
                      data-index={i}
                      role="option"
                      aria-selected={isOn}
                      aria-disabled={blocked || undefined}
                      className={cx('cds-select__option', 'cds-mselect__option', i === active && 'is-active', isOn && 'is-checked', blocked && 'is-disabled')}
                      onMouseEnter={() => { if (!o.disabled) setActive(i); }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => toggle(o)}
                    >
                      <span className="cds-check cds-mselect__box"><span className="cds-check__box" aria-hidden="true"><CheckIcon className="cds-check__mark" /></span></span>
                      <span className="cds-select__text">
                        <span>{o.label}</span>
                        {o.description && <span className="cds-choice__desc">{o.description}</span>}
                      </span>
                    </li>
                  );
                })
              ) : (
                <li className="cds-mselect__empty" role="presentation">검색 결과가 없어요.</li>
              )}
            </ul>
            <div className="cds-mselect__foot">
              <span className="cds-mselect__count">{max ? `${value.length} / ${max}개` : `${value.length}개 선택`}</span>
              {value.length > 0 && (
                <button type="button" className="cds-mselect__clear" onMouseDown={(e) => e.preventDefault()} onClick={() => setValue([])}>선택 해제</button>
              )}
            </div>
          </div>
          </MaybePortal>
        )}
      </div>
      <FieldMessage id={descId} error={error} helperText={helperText} />
    </div>
  );
}
