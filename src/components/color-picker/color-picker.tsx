import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { RiArrowDownSLine, RiSipLine } from '@remixicon/react';
import { cn } from '../../lib/cn';
import { useId } from '../../hooks/use-id';
import { useControllableState } from '../../hooks/use-controllable-state';
import { directionOf } from '../../providers/direction';
import {
  hsvToRgb,
  rgbToHsv,
  rgbToHex,
  hexToRgb,
  rgbToCss,
  isLight,
} from '../../lib/color';
import {
  colorPickerVariants,
  colorDotSwatchVariants,
  colorSpectrumVariants,
  colorSliderVariants,
  colorThumbVariants,
  colorSpectrumThumbVariants,
  colorDotVariants,
} from './color-picker.styles';
import type {
  ColorDotProps,
  ColorSpectrumProps,
  ColorSliderProps,
  ColorPickerProps,
} from './color-picker.types';

const clamp = (n: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, n));

/** A single palette swatch — Figma Color Dots. */
export const ColorDot = forwardRef<HTMLButtonElement, ColorDotProps>(
  function ColorDot(
    { color, value, selected = false, className, style, type, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        data-selected={selected}
        aria-pressed={selected}
        className={cn(
          colorDotVariants({ color: value ? undefined : color }),
          className,
        )}
        style={
          value
            ? ({ ...style, '--nili-dot': value } as React.CSSProperties)
            : style
        }
        {...rest}
      >
        <span aria-hidden className={colorDotSwatchVariants()} />
      </button>
    );
  },
);

/**
 * Saturation / brightness area.
 *
 * Keyboard support is not decoration here: a pointer-only colour area is
 * unusable without a mouse, and "pick a colour" is a common form field. Arrow
 * keys move by 1%, Shift+Arrow by 10%.
 */
export const ColorSpectrum = forwardRef<HTMLDivElement, ColorSpectrumProps>(
  function ColorSpectrum(
    {
      hue,
      saturation,
      brightness,
      onChange,
      label = 'Saturation and brightness',
      className,
      ...rest
    },
    ref,
  ) {
    const areaRef = useRef<HTMLDivElement>(null);

    const apply = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        const box = areaRef.current?.getBoundingClientRect();
        if (!box) return;
        onChange({
          saturation: clamp(((event.clientX - box.left) / box.width) * 100),
          brightness: clamp(
            100 - ((event.clientY - box.top) / box.height) * 100,
          ),
        });
      },
      [onChange],
    );

    const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 10 : 1;
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, step],
        ArrowDown: [0, -step],
      };
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      onChange({
        saturation: clamp(saturation + move[0]),
        brightness: clamp(brightness + move[1]),
      });
    };

    const rgb = hsvToRgb({ h: hue, s: saturation, v: brightness });

    return (
      <div
        ref={(node) => {
          (areaRef as { current: HTMLDivElement | null }).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref)
            (ref as { current: HTMLDivElement | null }).current = node;
        }}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuetext={`${Math.round(saturation)}%, ${Math.round(brightness)}%`}
        aria-valuenow={Math.round(saturation)}
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          apply(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            apply(event);
        }}
        onKeyDown={onKeyDown}
        className={cn(colorSpectrumVariants(), className)}
        style={{
          backgroundImage: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue} 100% 50%))`,
        }}
        {...rest}
      >
        <span
          className={colorSpectrumThumbVariants()}
          style={{
            left: `${saturation}%`,
            top: `${100 - brightness}%`,
            backgroundColor: rgbToCss(rgb),
            borderColor: isLight(rgb) ? '#0E121B' : '#FFFFFF',
          }}
        />
      </div>
    );
  },
);

/** Hue or opacity track. */
export const ColorSlider = forwardRef<HTMLDivElement, ColorSliderProps>(
  function ColorSlider(
    {
      type = 'hue',
      value,
      onChange,
      baseColor = '#000',
      thumbColor: thumbColorProp,
      label,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const trackRef = useRef<HTMLDivElement>(null);
    const max = type === 'hue' ? 360 : 100;
    const thumbColor =
      thumbColorProp ?? (type === 'hue' ? `hsl(${value} 100% 50%)` : baseColor);

    const apply = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        const track = trackRef.current;
        const box = track?.getBoundingClientRect();
        if (!box) return;
        const raw = (event.clientX - box.left) / box.width;
        // The gradient is mirrored by `rtl:` and the thumb sits on
        // `inset-inline-start`, both of which follow the element's *computed*
        // direction. Read that same value rather than the context one, or a
        // host that sets `dir` without mounting a DirectionProvider gets a
        // thumb that runs away from the pointer.
        const ratio = directionOf(track) === 'rtl' ? 1 - raw : raw;
        onChange(Math.round(clamp(ratio, 0, 1) * max));
      },
      [max, onChange],
    );

    const percent = (value / max) * 100;

    return (
      <div
        ref={(node) => {
          (trackRef as { current: HTMLDivElement | null }).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref)
            (ref as { current: HTMLDivElement | null }).current = node;
        }}
        role="slider"
        tabIndex={0}
        aria-label={label ?? type}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          apply(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            apply(event);
        }}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 10 : 1;
          if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault();
            onChange(Math.min(max, value + step));
          } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault();
            onChange(Math.max(0, value - step));
          }
        }}
        className={cn(colorSliderVariants({ type }), className)}
        style={style}
        {...rest}
      >
        {type === 'opacity' && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              backgroundImage: `linear-gradient(to right, transparent, ${baseColor})`,
            }}
          />
        )}
        <span
          className={colorThumbVariants()}
          style={{
            insetInlineStart: `calc(${percent}% - 7px)`,
            backgroundColor: thumbColor,
          }}
        />
      </div>
    );
  },
);

/** Figma "Recommended Colors": gray, blue, orange, red, green, yellow, purple, sky. */
const DEFAULT_SWATCHES = [
  '#717784',
  '#335CFF',
  '#FF9147',
  '#FB3748',
  '#1FC16B',
  '#F6B51E',
  '#7D52F4',
  '#47C2FF',
];

/**
 * Composite picker: spectrum, hue, optional opacity, a hex field and swatches.
 *
 * Controlled or uncontrolled through the same `useControllableState` path as
 * every other stateful component here.
 */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  function ColorPicker(
    {
      value,
      defaultValue = '#335CFF',
      onChange,
      withOpacity = true,
      swatches,
      footer,
      labels,
      className,
      ...rest
    },
    ref,
  ) {
    const [hex, setHex] = useControllableState<string>({
      value,
      defaultValue,
      onChange,
    });
    const hexId = useId();

    const parsed = useMemo(
      () => hexToRgb(hex) ?? { r: 51, g: 92, b: 255, a: 1 },
      [hex],
    );
    const hsv = useMemo(
      () => rgbToHsv({ r: parsed.r, g: parsed.g, b: parsed.b }),
      [parsed],
    );

    const commit = (next: Partial<typeof hsv> & { a?: number }) => {
      const merged = { ...hsv, ...next };
      const alpha = next.a ?? parsed.a;
      setHex(rgbToHex(hsvToRgb(merged), withOpacity ? alpha : 1));
    };

    const opaque = rgbToHex({ r: parsed.r, g: parsed.g, b: parsed.b });
    const alphaPercent = Math.round(parsed.a * 100);
    const [format, setFormat] = useState<'hex' | 'rgb'>('hex');
    const palette = swatches ?? DEFAULT_SWATCHES;
    const canPickFromScreen =
      typeof window !== 'undefined' && 'EyeDropper' in window;

    const pickFromScreen = async () => {
      try {
        const EyeDropperCtor = (
          window as unknown as {
            EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> };
          }
        ).EyeDropper;
        const result = await new EyeDropperCtor().open();
        setHex(result.sRGBHex);
      } catch {
        // The user dismissed the picker.
      }
    };

    const fieldValue =
      format === 'hex'
        ? opaque.replace('#', '').toUpperCase()
        : `${parsed.r}, ${parsed.g}, ${parsed.b}`;

    return (
      <div ref={ref} className={cn(colorPickerVariants(), className)} {...rest}>
        <div className="flex flex-col gap-[13px] p-[15px]">
          <ColorSpectrum
            hue={hsv.h}
            saturation={hsv.s}
            brightness={hsv.v}
            label={labels?.spectrum}
            onChange={({ saturation, brightness }) =>
              commit({ s: saturation, v: brightness })
            }
          />

          <div className="flex flex-col gap-3.5">
            <ColorSlider
              type="hue"
              value={hsv.h}
              thumbColor={opaque}
              label={labels?.hue}
              onChange={(h) => commit({ h })}
            />
            {withOpacity && (
              <ColorSlider
                type="opacity"
                value={alphaPercent}
                baseColor={opaque}
                thumbColor={opaque}
                label={labels?.opacity}
                onChange={(a) => commit({ a: a / 100 })}
              />
            )}
          </div>

          <div className="flex flex-col gap-1">
            {/* Figma "Hex ▾": the value format. */}
            <label className="relative flex w-fit items-center gap-0.5 text-[14px] leading-5 font-medium text-strong-950">
              <select
                aria-label={labels?.format ?? 'Format'}
                value={format}
                onChange={(event) =>
                  setFormat(event.target.value as 'hex' | 'rgb')
                }
                className="cursor-pointer appearance-none bg-transparent pe-5 outline-hidden focus-visible:underline"
              >
                <option value="hex">{labels?.hex ?? 'Hex'}</option>
                <option value="rgb">RGB</option>
              </select>
              <RiArrowDownSLine
                size={20}
                aria-hidden
                className="pointer-events-none absolute end-0 text-soft-400"
              />
            </label>

            <div
              dir="ltr"
              className="flex h-8 items-stretch overflow-hidden rounded-lg border border-soft-200 bg-white-0 text-[14px] leading-5 focus-within:shadow-focus-neutral"
            >
              <button
                type="button"
                onClick={pickFromScreen}
                disabled={!canPickFromScreen}
                aria-label={
                  labels?.eyedropper ?? 'Pick a colour from the screen'
                }
                className="flex w-8 shrink-0 cursor-pointer items-center justify-center border-e border-soft-200 text-sub-600 outline-hidden hovered:bg-weak-50 disabled:cursor-default"
              >
                <RiSipLine size={20} />
              </button>
              <input
                id={hexId}
                value={fieldValue}
                spellCheck={false}
                // Hex codes are Latin even in a Persian UI.
                dir="ltr"
                aria-label={format === 'hex' ? (labels?.hex ?? 'Hex') : 'RGB'}
                onChange={(event) => {
                  const next = event.target.value.trim();
                  if (format === 'hex') {
                    setHex(next.startsWith('#') ? next : `#${next}`);
                    return;
                  }
                  const parts = next.split(/[\s,]+/).map(Number);
                  if (
                    parts.length === 3 &&
                    parts.every((n) => n >= 0 && n <= 255)
                  ) {
                    setHex(
                      rgbToHex(
                        { r: parts[0], g: parts[1], b: parts[2] },
                        parsed.a,
                      ),
                    );
                  }
                }}
                className="min-w-0 flex-1 bg-transparent px-2.5 text-strong-950 outline-hidden"
              />
              <span className="flex w-14 shrink-0 items-center justify-center border-s border-soft-200 text-sub-600">
                {alphaPercent}%
              </span>
            </div>
          </div>
        </div>

        {palette.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-soft-200 px-[15px] pt-4 pb-[15px]">
            <span className="text-[12px] leading-4 text-sub-600">
              {labels?.swatches ?? 'Recommended Colors'}
            </span>
            <div
              role="group"
              aria-label={labels?.swatches ?? 'Recommended Colors'}
              className="flex flex-wrap gap-1"
            >
              {palette.map((swatch) => (
                <ColorDot
                  key={swatch}
                  value={swatch}
                  aria-label={swatch}
                  selected={swatch.toLowerCase() === opaque.toLowerCase()}
                  onClick={() => setHex(swatch)}
                />
              ))}
            </div>
          </div>
        )}

        {footer}
      </div>
    );
  },
);
