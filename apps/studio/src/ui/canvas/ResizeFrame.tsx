import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useStudio } from '../../document/StudioContext';
import type { DocNode, FrameDirection } from '../../document/types';

type Handle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const HANDLES: Handle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

const CURSOR: Record<Handle, string> = {
  n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize',
  ne: 'nesw-resize', sw: 'nesw-resize', nw: 'nwse-resize', se: 'nwse-resize',
};

interface Drag {
  pointerId: number;
  startX: number;
  startY: number;
  width: number;
  height: number;
  gesture: string;
}

interface Props {
  node: DocNode;
  parentDirection: FrameDirection;
}

const MIN = 24;

/**
 * Eight handles around the selected node. In an auto-layout document a drag
 * does not move the node — it pins that axis to a pixel size, which is what
 * Figma's "Fixed" means and what flexbox needs to stop hugging.
 */
export function ResizeFrame({ node }: Props): JSX.Element {
  const { state, dispatch } = useStudio();
  const drag = useRef<Drag | null>(null);

  const begin = (event: ReactPointerEvent<HTMLSpanElement>): void => {
    event.stopPropagation();
    event.preventDefault();
    const box = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!box) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      // The canvas is scaled, so screen pixels are not document pixels.
      width: box.width / state.zoom,
      height: box.height / state.zoom,
      gesture: `resize:${node.id}:${Date.now()}`,
    };
    document.body.classList.add('is-resizing-node');
  };

  const move = (handle: Handle) => (event: ReactPointerEvent<HTMLSpanElement>): void => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;

    const dx = (event.clientX - current.startX) / state.zoom;
    const dy = (event.clientY - current.startY) / state.zoom;

    if (handle.includes('e') || handle.includes('w')) {
      const delta = handle.includes('w') ? -dx : dx;
      dispatch({
        type: 'setSize', id: node.id, axis: 'width',
        value: Math.max(MIN, Math.round(current.width + delta)),
        coalesce: current.gesture,
      });
    }
    if (handle.includes('n') || handle.includes('s')) {
      const delta = handle.includes('n') ? -dy : dy;
      dispatch({
        type: 'setSize', id: node.id, axis: 'height',
        value: Math.max(MIN, Math.round(current.height + delta)),
        coalesce: current.gesture,
      });
    }
  };

  const end = (event: ReactPointerEvent<HTMLSpanElement>): void => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.current = null;
    document.body.classList.remove('is-resizing-node');
  };

  return (
    <>
      {HANDLES.map((handle) => (
        <span
          key={handle}
          className={`resize-node resize-node--${handle}`}
          style={{ cursor: CURSOR[handle] }}
          role="presentation"
          onPointerDown={begin}
          onPointerMove={move(handle)}
          onPointerUp={end}
          onPointerCancel={end}
        />
      ))}
    </>
  );
}
