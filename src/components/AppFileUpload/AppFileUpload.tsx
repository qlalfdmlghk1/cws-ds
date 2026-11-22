import { useRef, useState, type DragEvent } from 'react';
import { cx } from '../../internal/cx';
import { useControllable, useFieldId } from '../../internal/hooks';
import { FieldLabel, FieldMessage } from '../../internal/Field';
import { CloseSmallIcon, FileIcon, UploadIcon } from '../../internal/icons';

export interface AppFileUploadProps {
  label?: string;
  /** 고른 파일. 지우거나 더하면 새 배열로 onChange. */
  value?: File[];
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  /** input의 accept 그대로. "image/*", ".pdf,.docx". */
  accept?: string;
  /** 여러 개. 기본 false(새로 고르면 바뀐다). */
  multiple?: boolean;
  /** 바이트. 넘는 파일은 빼고 안내한다. */
  maxSize?: number;
  /** multiple일 때 최대 개수. */
  maxFiles?: number;
  /** 상자 안 두 번째 줄. 기본은 accept·maxSize로 만든다. "PNG, JPG · 5MB까지". */
  hint?: string;
  helperText?: string;
  /** 바깥에서 주는 오류. 크기·형식 오류는 컴포넌트가 직접 띄운다. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)}KB`;
  const mb = n / 1024 / 1024;
  return `${mb < 10 ? Number(mb.toFixed(1)) : Math.round(mb)}MB`;
}

const KINDS: Record<string, string> = { 'image/*': '이미지', 'video/*': '동영상', 'audio/*': '오디오' };
function describeAccept(accept: string): string {
  return accept.split(',').map((s) => s.trim()).filter(Boolean)
    .map((r) => KINDS[r.toLowerCase()] ?? (r.startsWith('.') ? r.slice(1).toUpperCase() : r.split('/').pop()!.toUpperCase()))
    .join(', ');
}

function accepts(file: File, accept?: string): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  return accept.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean).some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
}

export function AppFileUpload({ label, value, defaultValue = [], onChange, accept, multiple, maxSize, maxFiles, hint, helperText, error, required, disabled, fullWidth, name, id: idProp, className }: AppFileUploadProps) {
  const id = useFieldId(idProp);
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useControllable(value, defaultValue, onChange);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);

  const add = (list: FileList | null) => {
    if (!list?.length) return;
    const picked = Array.from(list);
    const ok: File[] = [], bad: string[] = [];
    for (const f of picked) {
      if (!accepts(f, accept)) bad.push(`${f.name}: 올릴 수 없는 형식이에요.`);
      else if (maxSize !== undefined && f.size > maxSize) bad.push(`${f.name}: ${formatBytes(maxSize)}보다 커요.`);
      else ok.push(f);
    }
    let next = multiple ? [...files, ...ok] : ok.slice(0, 1);
    if (multiple && maxFiles !== undefined && next.length > maxFiles) {
      bad.push(`최대 ${maxFiles}개까지 올릴 수 있어요.`);
      next = next.slice(0, maxFiles);
    }
    setRejected(bad.length ? bad.join(' ') : null);
    if (ok.length) setFiles(next);
  };

  const remove = (i: number) => setFiles(files.filter((_, k) => k !== i));
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); if (!disabled) add(e.dataTransfer.files); };
  const full = !multiple ? false : maxFiles !== undefined && files.length >= maxFiles;
  const autoHint = hint ?? [accept && describeAccept(accept), maxSize && `${formatBytes(maxSize)}까지`].filter(Boolean).join(' · ');
  const err = error || rejected || undefined;

  return (
    <div className={cx('cds-field', 'cds-upload', fullWidth && 'cds-field--full', className)}>
      <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>
      <input
        ref={inputRef}
        id={id}
        type="file"
        name={name}
        className="cds-sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled || full}
        required={required && files.length === 0}
        aria-describedby={err || helperText ? `${id}-msg` : undefined}
        aria-invalid={err ? true : undefined}
        aria-label={label ? undefined : '파일 선택'}
        onChange={(e) => { add(e.target.files); e.target.value = ''; }}
      />
      {/* 눌러서 여는 영역. 이름은 위 라벨 하나만 갖도록 스크린리더에서는 숨기고, 키보드는 input이 받는다. */}
      <div
        className={cx('cds-upload__zone', dragging && 'is-dragging', err && 'is-error', (disabled || full) && 'is-disabled')}
        onClick={() => { if (!disabled && !full) inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled && !full) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        aria-hidden="true"
      >
        <UploadIcon className="cds-upload__icon" aria-hidden="true" />
        <span className="cds-upload__main">
          {full ? `${maxFiles}개를 모두 골랐어요` : <><span className="cds-upload__link">파일 선택</span> 또는 여기로 끌어다 놓기</>}
        </span>
        {autoHint && <span className="cds-upload__hint">{autoHint}</span>}
      </div>
      {files.length > 0 && (
        <ul className="cds-upload__list" aria-label="고른 파일">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="cds-upload__file">
              <FileIcon className="cds-upload__file-icon" aria-hidden="true" />
              <span className="cds-upload__name">{f.name}</span>
              <span className="cds-upload__size">{formatBytes(f.size)}</span>
              {!disabled && (
                <button type="button" className="cds-upload__remove" aria-label={`${f.name} 빼기`} onClick={() => remove(i)}>
                  <CloseSmallIcon aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <FieldMessage id={`${id}-msg`} error={err} helperText={helperText} />
    </div>
  );
}
