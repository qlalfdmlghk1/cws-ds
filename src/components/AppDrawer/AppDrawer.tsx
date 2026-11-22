import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../internal/cx';
import { useFieldId } from '../../internal/hooks';
import { useDialog } from '../../internal/useDialog';
import { CloseIcon } from '../../internal/icons';
import { AppIconButton } from '../AppIconButton/AppIconButton';

export interface AppDrawerProps {
  open: boolean;
  /** 닫기 버튼, Esc, 바깥 클릭 때 불린다. open을 false로 바꾸는 건 쓰는 쪽. */
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** 하단 고정 버튼 영역. 오른쪽 정렬. */
  footer?: ReactNode;
  /** 열리는 쪽. 기본 'right'. */
  side?: 'right' | 'left';
  /** 너비. sm 360 · md 480(기본) · lg 640px. 화면이 좁으면 꽉 찬다. */
  size?: 'sm' | 'md' | 'lg';
  /** 바깥 클릭으로 닫기. 기본 true. 입력 중인 폼이면 false. */
  closeOnOverlay?: boolean;
  hideClose?: boolean;
  id?: string;
  className?: string;
}

export function AppDrawer({ open, onClose, title, description, children, footer, side = 'right', size = 'md', closeOnOverlay = true, hideClose, id: idProp, className }: AppDrawerProps) {
  const id = useFieldId(idProp);
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(open, panelRef, onClose, 'cds-drawer');

  if (!open) return null;
  return createPortal(
    <div className={cx('cds-drawer', `cds-drawer--${side}`)}>
      <div className="cds-drawer__scrim" aria-hidden="true" onClick={closeOnOverlay ? onClose : undefined} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal
        tabIndex={-1}
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-describedby={description ? `${id}-desc` : undefined}
        className={cx('cds-drawer__panel', `cds-drawer__panel--${size}`, className)}
      >
        <div className="cds-drawer__head">
          <div className="cds-drawer__titles">
            {title && <h2 id={`${id}-title`} className="cds-drawer__title">{title}</h2>}
            {description && <p id={`${id}-desc`} className="cds-drawer__desc">{description}</p>}
          </div>
          {!hideClose && <AppIconButton icon={<CloseIcon />} label="닫기" size="sm" className="cds-drawer__close" onClick={onClose} />}
        </div>
        {children && <div className="cds-drawer__body">{children}</div>}
        {footer && <div className="cds-drawer__foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
