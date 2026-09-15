import { GUTTER, estimatedHeight } from '../../document/types';
import type { ComponentDef } from '../../document/types';
import type { UiPatch } from '../../document/state';

export const MIN_ZOOM = 0.05;
export const MAX_ZOOM = 5;

export const clampZoom = (value: number): number => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

export interface View {
  zoom: number;
  pan: { x: number; y: number };
}

/**
 * Zoom maths lives here rather than in the reducer because it needs the size
 * of the viewport, and the viewport is a fact about the window rather than
 * about the document. Putting it in the state tree would mean writing the
 * browser's dimensions into every undo entry.
 */
export function zoomAround(view: View, factor: number, at: { x: number; y: number }): UiPatch {
  const zoom = clampZoom(view.zoom * factor);
  const worldX = (at.x - view.pan.x) / view.zoom;
  const worldY = (at.y - view.pan.y) / view.zoom;
  return { zoom, pan: { x: at.x - worldX * zoom, y: at.y - worldY * zoom } };
}

/** Same zoom, centred on the viewport — what a keyboard shortcut should do. */
export const zoomByCentre = (view: View, factor: number, box: DOMRect): UiPatch =>
  zoomAround(view, factor, { x: box.width / 2, y: box.height / 2 });

/** Frames every artboard, using the same height estimate the layout uses. */
export function fitAll(components: ComponentDef[], box: DOMRect, measured: Record<string, number> = {}): UiPatch | null {
  if (!components.length) return null;

  const left = Math.min(...components.map((component) => component.x));
  const top = Math.min(...components.map((component) => component.y));
  const right = Math.max(...components.map((component) => component.x + component.width));
  const bottom = Math.max(...components.map((component) => component.y + (measured[component.id] ?? estimatedHeight(component))));

  const width = right - left;
  const height = bottom - top;
  if (width <= 0 || height <= 0) return null;

  const margin = GUTTER;
  const zoom = clampZoom(
    Math.min(1.5, Math.min((box.width - margin) / width, (box.height - margin) / height)),
  );

  return {
    zoom,
    pan: {
      x: (box.width - width * zoom) / 2 - left * zoom,
      y: (box.height - height * zoom) / 2 - top * zoom,
    },
  };
}

/** The stage rectangle, read from the DOM — it is a measurement, not state. */
export const stageBox = (): DOMRect | null =>
  document.querySelector('.stage')?.getBoundingClientRect() ?? null;
