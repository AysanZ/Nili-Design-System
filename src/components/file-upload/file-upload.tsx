import {
  forwardRef,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import {
  RiUploadCloud2Line,
  RiCloseLine,
  RiRefreshLine,
} from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { Icon } from '../icon';
import { CompactButton } from '../button';
import {
  fileUploadAreaVariants,
  fileCardVariants,
  fileProgressVariants,
  fileProgressBarVariants,
  fileFormatIconVariants,
  imageUploadVariants,
  imageUploadRootVariants,
  type FileFormatIconVariantProps,
  type ImageUploadVariantProps,
} from './file-upload.styles';

export type FileStatus = 'progress' | 'success' | 'error';
export type FileFormatColor = NonNullable<FileFormatIconVariantProps['color']>;
export type ImageUploadShape = NonNullable<ImageUploadVariantProps['shape']>;

/** Extension → swatch colour, so a PDF is always red and a sheet always green. */
const FORMAT_COLORS: Record<string, FileFormatColor> = {
  pdf: 'red',
  doc: 'blue',
  docx: 'blue',
  xls: 'green',
  xlsx: 'green',
  csv: 'green',
  ppt: 'orange',
  pptx: 'orange',
  zip: 'yellow',
  rar: 'yellow',
  png: 'purple',
  jpg: 'purple',
  jpeg: 'purple',
  gif: 'purple',
  svg: 'purple',
  mp4: 'pink',
  mov: 'pink',
  mp3: 'teal',
  wav: 'teal',
  txt: 'gray',
  json: 'sky',
};

export function formatColorFor(fileName: string): FileFormatColor {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  return FORMAT_COLORS[extension] ?? 'gray';
}

export interface FileFormatIconProps extends Omit<
  ComponentPropsWithoutRef<'span'>,
  'color'
> {
  fileName: string;
  color?: FileFormatColor;
  size?: 'md' | 'xs';
}

/** The coloured extension chip from Figma's File Format Icons set. */
export const FileFormatIcon = forwardRef<HTMLSpanElement, FileFormatIconProps>(
  function FileFormatIcon(
    { fileName, color, size = 'md', className, ...rest },
    ref,
  ) {
    const extension = fileName.split('.').pop()?.slice(0, 4) ?? '?';
    return (
      <span
        ref={ref}
        aria-hidden
        className={cn(
          fileFormatIconVariants({
            color: color ?? formatColorFor(fileName),
            size,
          }),
          className,
        )}
        {...rest}
      >
        <svg viewBox="0 0 40 40" className="size-full" fill="none">
          <path
            d="M10 .75h10.515c1.392 0 2.727.553 3.712 1.538l9.485 9.485a5.25 5.25 0 0 1 1.538 3.712V34A5.25 5.25 0 0 1 30 39.25H10A5.25 5.25 0 0 1 4.75 34V6A5.25 5.25 0 0 1 10 .75Z"
            className="fill-white-0 stroke-sub-300"
            strokeWidth="1.5"
          />
          <rect
            x="0"
            y="18"
            width="28"
            height="16"
            rx="4"
            fill="currentColor"
          />
          <text
            x="14"
            y="29.2"
            textAnchor="middle"
            fill="white"
            fontSize="9"
            fontWeight="600"
            style={{
              textTransform: 'uppercase',
              fontFamily: 'var(--nili-font-latin)',
            }}
          >
            {extension}
          </text>
        </svg>
      </span>
    );
  },
);

export interface FileUploadAreaProps extends Omit<
  ComponentPropsWithoutRef<'label'>,
  'onDrop' | 'onChange' | 'title'
> {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Accessible name for the hidden file input. */
  label?: string;
}

/**
 * Drag-and-drop zone.
 *
 * A real `<input type="file">` sits behind it — visually hidden but present,
 * so the control is keyboard reachable, works with the OS file picker, and
 * participates in a form. Drag-and-drop is the enhancement, not the mechanism.
 */
export const FileUploadArea = forwardRef<HTMLLabelElement, FileUploadAreaProps>(
  function FileUploadArea(
    {
      onFiles,
      accept,
      multiple = false,
      disabled = false,
      invalid = false,
      title = 'Choose a file or drag it here',
      description,
      icon,
      label = 'Upload file',
      className,
      ...rest
    },
    ref,
  ) {
    const [dragging, setDragging] = useState(false);
    const inputId = useId();

    const handleFiles = (list: FileList | null) => {
      if (!list || list.length === 0) return;
      onFiles(Array.from(list));
    };

    return (
      // A <label>, not a <div onClick>. The browser forwards the click to the
      // input for free, the input stays keyboard reachable, and there is no
      // static element pretending to be interactive.
      <label
        ref={ref}
        htmlFor={inputId}
        data-dragging={dragging || undefined}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          fileUploadAreaVariants({ dragging, invalid, disabled }),
          className,
        )}
        {...rest}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-label={label}
          onChange={(event) => handleFiles(event.target.files)}
          className="sr-only"
        />
        {icon ?? (
          <Icon icon={RiUploadCloud2Line} size={24} className="text-sub-600" />
        )}
        <span className="text-[14px] font-medium leading-5 text-strong-950">
          {title}
        </span>
        {description && (
          <span className="text-[12px] leading-4 text-soft-400">
            {description}
          </span>
        )}
      </label>
    );
  },
);

export interface FileUploadCardProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'children'
> {
  fileName: string;
  /** Pre-formatted — size formatting is a locale decision. */
  fileSize?: string;
  status?: FileStatus;
  /** 0–100. Ignored unless `status` is `'progress'`. */
  progress?: number;
  errorMessage?: ReactNode;
  onRemove?: () => void;
  onRetry?: () => void;
  removeLabel?: string;
  retryLabel?: string;
}

/** One uploaded file: format chip, name, size, progress and controls. */
export const FileUploadCard = forwardRef<HTMLDivElement, FileUploadCardProps>(
  function FileUploadCard(
    {
      fileName,
      fileSize,
      status = 'progress',
      progress = 0,
      errorMessage,
      onRemove,
      onRetry,
      removeLabel = 'Remove',
      retryLabel = 'Retry',
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-status={status}
        className={cn(fileCardVariants({ status }), className)}
        {...rest}
      >
        <FileFormatIcon fileName={fileName} />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-[14px] font-medium leading-5 text-strong-950">
            {fileName}
          </span>
          {fileSize && (
            <span className="text-[12px] leading-4 text-soft-400">
              {fileSize}
            </span>
          )}

          {status === 'progress' && (
            <div
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={fileName}
              className={cn(fileProgressVariants(), 'mt-1')}
            >
              <div
                className={fileProgressBarVariants({ status })}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}

          {status === 'error' && errorMessage && (
            // role="alert" because the failure happens after the fact — a
            // silent failed upload is the worst outcome here.
            <span
              role="alert"
              className="text-[12px] leading-4 text-error-base"
            >
              {errorMessage}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {status === 'error' && onRetry && (
            <CompactButton
              appearance="ghost"
              aria-label={retryLabel}
              onClick={onRetry}
            >
              <Icon icon={RiRefreshLine} />
            </CompactButton>
          )}
          {onRemove && (
            <CompactButton
              appearance="ghost"
              aria-label={removeLabel}
              onClick={onRemove}
            >
              <Icon icon={RiCloseLine} />
            </CompactButton>
          )}
        </div>
      </div>
    );
  },
);

export interface ImageUploadProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange'
> {
  shape?: ImageUploadShape;
  alignment?: 'vertical' | 'horizontal';
  /** Preview URL. Absent means the Figma "Empty" state. */
  src?: string;
  onFiles: (files: File[]) => void;
  accept?: string;
  label?: string;
  hint?: ReactNode;
  actions?: ReactNode;
  alt?: string;
  /** Overrides the preview button size, e.g. `w-full` or `w-40`. */
  previewClassName?: string;
}

/** Avatar, logo or aspect-ratio image slot with a preview. */
export const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(
  function ImageUpload(
    {
      shape = 'square',
      alignment = 'vertical',
      src,
      onFiles,
      accept = 'image/*',
      label = 'Upload image',
      hint,
      actions,
      alt = '',
      previewClassName,
      className,
      ...rest
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div
        ref={ref}
        className={cn(imageUploadRootVariants({ alignment }), className)}
        {...rest}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={label}
          className={cn(imageUploadVariants({ shape }), previewClassName)}
        >
          {src ? (
            <img src={src} alt={alt} className="size-full object-cover" />
          ) : (
            <Icon
              icon={RiUploadCloud2Line}
              size={24}
              className="text-soft-400"
            />
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          aria-label={label}
          onChange={(event) =>
            event.target.files && onFiles(Array.from(event.target.files))
          }
          className="sr-only"
        />

        {(hint || actions) && (
          <div className="flex flex-col items-start gap-2">
            {hint && (
              <span className="text-[12px] leading-4 text-soft-400">
                {hint}
              </span>
            )}
            {actions}
          </div>
        )}
      </div>
    );
  },
);
