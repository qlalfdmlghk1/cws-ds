import type { ReactNode } from 'react';

export function FieldLabel(props: { htmlFor?: string; id?: string; required?: boolean; children?: ReactNode; as?: 'label' | 'span' | 'legend' }) {
  const Tag = props.as ?? 'label';
  if (!props.children) return null;
  return (
    <Tag className="cds-field__label" htmlFor={Tag === 'label' ? props.htmlFor : undefined} id={props.id}>
      {props.children}
      {props.required && <span className="cds-field__req" aria-hidden="true"> *</span>}
    </Tag>
  );
}

export function FieldMessage(props: { id?: string; error?: ReactNode; helperText?: ReactNode; count?: ReactNode }) {
  const msg = props.error || props.helperText;
  if (!msg && !props.count) return null;
  return (
    <div className="cds-field__foot">
      {msg ? (
        <p id={props.id} className={props.error ? 'cds-field__error' : 'cds-field__help'}>{msg}</p>
      ) : (
        <span />
      )}
      {props.count}
    </div>
  );
}

/** 화면에 label 없이 쓸 때 컴포넌트 이름을 주는 props. 버튼형 입력(Select·MultiSelect·Datepicker)이 받는다. */
export interface FieldNameProps {
  /** 보이는 label이 없을 때 스크린리더가 읽을 이름. "조회 기간". */
  'aria-label'?: string;
  /** 이름이 되는 다른 요소의 id. 보이는 label·aria-label보다 우선. */
  'aria-labelledby'?: string;
}

/**
 * 버튼형 입력의 이름 출처 id와, aria-label을 담을 숨은 요소.
 * 우선순위: aria-labelledby → 보이는 label → aria-label. 트리거는 이 id 뒤에 자기 id를 붙여 "이름, 현재 값"으로 읽힌다.
 */
export function fieldName(id: string, label: string | undefined, p: FieldNameProps): { nameId?: string; hidden: ReactNode } {
  if (p['aria-labelledby']) return { nameId: p['aria-labelledby'], hidden: null };
  if (label) return { nameId: `${id}-label`, hidden: null };
  if (p['aria-label']) return { nameId: `${id}-name`, hidden: <span id={`${id}-name`} hidden>{p['aria-label']}</span> };
  return { nameId: undefined, hidden: null };
}
