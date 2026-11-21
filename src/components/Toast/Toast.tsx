import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../internal/cx';
import { CloseIcon, ToneIcon } from '../../internal/icons';
import { IconButton } from '../IconButton/IconButton';

export type ToastTone = 'neutral' | 'success' | 'danger' | 'info';
export interface ToastAction { label: string; onClick: () => void }
export interface ToastOptions {
  /** 한 줄 요약. "저장했어요". */
  title: ReactNode;
  description?: ReactNode;
  /** 기본 'neutral'(아이콘 없음). danger는 role="alert"로 바로 읽힌다. */
  tone?: ToastTone;
  /** 오른쪽 텍스트 버튼 하나. "실행 취소", "보기". */
  action?: ToastAction;
  /** ms. 기본 4000, danger·action이 있으면 6000. 0이면 직접 닫을 때까지. */
  duration?: number;
  /** 같은 id로 다시 띄우면 앞의 것을 교체한다. */
  id?: string;
}
export interface ToastProps extends Omit<ToastOptions, 'duration' | 'id'> {
  onClose?: () => void;
  role?: string;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

/** 토스트 카드 하나. 보통은 직접 쓰지 않고 useToast().toast()로 띄운다. */
export function Toast({ title, description, tone = 'neutral', action, onClose, role, className, ...events }: ToastProps) {
  return (
    <div className={cx('cds-toast', `cds-toast--${tone}`, className)} role={role} {...events}>
      {tone !== 'neutral' && <span className="cds-toast__icon" aria-hidden="true"><ToneIcon tone={tone} /></span>}
      <div className="cds-toast__text">
        <p className="cds-toast__title">{title}</p>
        {description && <p className="cds-toast__desc">{description}</p>}
      </div>
      {action && (
        <button type="button" className="cds-toast__action" onClick={() => { action.onClick(); onClose?.(); }}>{action.label}</button>
      )}
      {onClose && <IconButton icon={<CloseIcon />} label="알림 닫기" size="sm" className="cds-toast__close" onClick={onClose} />}
    </div>
  );
}

interface Item extends Required<Pick<ToastOptions, 'id' | 'tone' | 'duration'>> { title: ReactNode; description?: ReactNode; action?: ToastAction }
interface ToastApi { toast: (opts: ToastOptions | string) => string; dismiss: (id: string) => void }
const ToastContext = createContext<ToastApi | null>(null);
let seq = 0;

function ToastItem({ item, onDismiss }: { item: Item; onDismiss: (id: string) => void }) {
  const hover = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const left = useRef(item.duration);
  const started = useRef(0);
  const start = () => {
    if (!left.current) return;
    started.current = Date.now();
    timer.current = setTimeout(() => onDismiss(item.id), left.current);
  };
  const pause = () => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    left.current = Math.max(800, left.current - (Date.now() - started.current));
  };
  useEffect(() => {
    start();
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Toast
      title={item.title}
      description={item.description}
      tone={item.tone}
      action={item.action}
      role={item.tone === 'danger' ? 'alert' : undefined}
      onClose={() => onDismiss(item.id)}
      onMouseEnter={() => { hover.current = true; pause(); }}
      onMouseLeave={() => { hover.current = false; start(); }}
      onFocus={pause}
      onBlur={() => { if (!hover.current) start(); }}
    />
  );
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** 기본 'bottom-center'. */
  position?: 'bottom-center' | 'bottom-right' | 'top-center' | 'top-right';
  /** 한 번에 보이는 최대 개수. 넘치면 오래된 것부터 사라진다. 기본 3. */
  max?: number;
}

/** 앱 최상단에 한 번 감싼다. */
export function ToastProvider({ children, position = 'bottom-center', max = 3 }: ToastProviderProps) {
  const [list, setList] = useState<Item[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const api = useMemo<ToastApi>(() => {
    const dismiss = (id: string) => setList((l) => l.filter((x) => x.id !== id));
    const toast = (input: ToastOptions | string) => {
      const opts: ToastOptions = typeof input === 'string' ? { title: input } : input;
      const id = opts.id ?? `toast-${++seq}`;
      const tone = opts.tone ?? 'neutral';
      const duration = opts.duration ?? (tone === 'danger' || opts.action ? 6000 : 4000);
      setList((l) => [...l.filter((x) => x.id !== id), { id, title: opts.title, description: opts.description, tone, action: opts.action, duration }].slice(-max));
      return id;
    };
    return { toast, dismiss };
  }, [max]);
  const region = (
    <div className={cx('cds-toaster', `cds-toaster--${position}`)} role="status" aria-live="polite" aria-label="알림">
      {list.map((t) => <ToastItem key={t.id} item={t} onDismiss={api.dismiss} />)}
    </div>
  );
  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted ? createPortal(region, document.body) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast는 <ToastProvider> 안에서만 쓸 수 있어요.');
  return ctx;
}
