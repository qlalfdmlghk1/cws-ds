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
