import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../internal/cx';
import { useFieldId } from '../../internal/hooks';
import { useDialog } from '../../internal/useDialog';
import { CloseIcon } from '../../internal/icons';
import { IconButton } from '../IconButton/IconButton';
import { Button } from '../Button/Button';

export interface ModalProps {
  open: boolean;
  /** 닫기 버튼, Esc, 바깥 클릭 때 불린다. open을 false로 바꾸는 건 쓰는 쪽. */
  onClose: () => void;
  title?: ReactNode;
  /** 제목 아래 한두 줄 설명. */
  description?: ReactNode;
  children?: ReactNode;
  /** 하단 버튼 영역. 보통 [secondary 취소, primary 확인]. 오른쪽 정렬. */
  footer?: ReactNode;
  /** 너비. sm 400 · md 560 · lg 800px. 기본 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** 바깥(어두운 막) 클릭으로 닫기. 기본 true. 입력 중인 폼이면 false. */
  closeOnOverlay?: boolean;
  /** 오른쪽 위 × 버튼 숨기기. */
  hideClose?: boolean;
  role?: 'dialog' | 'alertdialog';
  id?: string;
  className?: string;
}

export function Modal({ open, onClose, title, description, children, footer, size = 'md', closeOnOverlay = true, hideClose, role = 'dialog', id: idProp, className }: ModalProps) {
  const id = useFieldId(idProp);
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(open, panelRef, onClose, 'cds-modal');

  if (!open) return null;
  return createPortal(
    <div className="cds-modal">
      <div className="cds-modal__scrim" aria-hidden="true" onClick={closeOnOverlay ? onClose : undefined} />
      <div
        ref={panelRef}
        role={role}
        aria-modal
        tabIndex={-1}
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-describedby={description ? `${id}-desc` : undefined}
        className={cx('cds-modal__panel', `cds-modal__panel--${size}`, className)}
      >
        <div className="cds-modal__head">
          <div className="cds-modal__titles">
            {title && <h2 id={`${id}-title`} className="cds-modal__title">{title}</h2>}
            {description && <p id={`${id}-desc`} className="cds-modal__desc">{description}</p>}
          </div>
          {!hideClose && <IconButton icon={<CloseIcon />} label="닫기" size="sm" className="cds-modal__close" onClick={onClose} />}
        </div>
        {children && <div className="cds-modal__body">{children}</div>}
        {footer && <div className="cds-modal__foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** 기본 "확인". 동작을 쓴다: "삭제하기", "나가기". */
  confirmLabel?: string;
  /** 기본 "취소". */
  cancelLabel?: string;
  /** 'danger'면 확인 버튼이 빨간색이고, 실수 방지로 처음 포커스가 취소에 간다. */
  tone?: 'default' | 'danger';
  /** 처리 중. 확인 버튼에 스피너, 닫기 막힘. */
  loading?: boolean;
}

export function ConfirmModal({ open, onClose, onConfirm, title, description, children, confirmLabel = '확인', cancelLabel = '취소', tone = 'default', loading }: ConfirmModalProps) {
  const danger = tone === 'danger';
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      role="alertdialog"
      size="sm"
      title={title}
      description={description}
      hideClose
      closeOnOverlay={false}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading} data-autofocus={danger ? true : undefined}>{cancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading} data-autofocus={danger ? undefined : true}>{confirmLabel}</Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
