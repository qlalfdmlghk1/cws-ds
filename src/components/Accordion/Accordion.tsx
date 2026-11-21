import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllable, useFieldId } from '../../internal/hooks';
import { ChevronDownIcon } from '../../internal/icons';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** 여러 개를 함께 펼칠 수 있다. 기본 false(하나를 펴면 나머지는 접힌다). */
  multiple?: boolean;
  /** 펼친 항목 id 목록. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  id?: string;
  className?: string;
}

export function Accordion({ items, multiple, value, defaultValue = [], onChange, id: idProp, className }: AccordionProps) {
  const id = useFieldId(idProp);
  const [open, setOpen] = useControllable(value, defaultValue, onChange);
  const rootRef = useRef<HTMLDivElement>(null);

  const toggle = (key: string) => {
    const isOpen = open.includes(key);
    if (multiple) setOpen(isOpen ? open.filter((k) => k !== key) : [...open, key]);
    else setOpen(isOpen ? [] : [key]);
  };

  // 위아래 화살표·Home·End로 제목 사이를 오간다.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const triggers = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>('.cds-accordion__trigger:not(:disabled)') ?? []);
    const i = triggers.indexOf(e.currentTarget);
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? triggers.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + triggers.length) % triggers.length;
    e.preventDefault();
    triggers[next]?.focus();
  };

  return (
    <div ref={rootRef} className={cx('cds-accordion', className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const head = `${id}-${item.id}-head`, panel = `${id}-${item.id}-panel`;
        return (
          <div key={item.id} className={cx('cds-accordion__item', isOpen && 'is-open')}>
            <h3 className="cds-accordion__heading">
              <button
                type="button"
                id={head}
                className="cds-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panel}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
                onKeyDown={onKeyDown}
              >
                <span className="cds-accordion__title">{item.title}</span>
                <ChevronDownIcon className="cds-accordion__chevron" aria-hidden="true" />
              </button>
            </h3>
            <div id={panel} role="region" aria-labelledby={head} className="cds-accordion__panel" hidden={!isOpen}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
