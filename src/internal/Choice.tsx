import type { ReactNode } from 'react';

export function ChoiceText({ label, description }: { label?: ReactNode; description?: ReactNode }) {
  if (!label && !description) return null;
  return (
    <span className="cds-choice__text">
      {label && <span className="cds-choice__label">{label}</span>}
      {description && <span className="cds-choice__desc">{description}</span>}
    </span>
  );
}
