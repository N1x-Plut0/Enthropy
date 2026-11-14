import type { FC, ReactNode } from 'react';
import { createElement, Fragment } from 'react';

/** Draw order, back to front. `handCover` is a virtual layer handled by the Avatar. */
export const LAYER_ORDER = [
  'hairBack',
  'body',
  'shoes',
  'bottom',
  'top',
  'outer',
  'arms',
  'sleeves',
  'outerSleeves',
  'handCover',
  'neckAcc',
  'bag',
  'head',
  'cheeks',
  'eyes',
  'nose',
  'mouth',
  'faceAcc',
  'earAcc',
  'hairFront',
  'bangs',
  'brows',
  'topAcc',
] as const;

export type LayerName = Exclude<(typeof LAYER_ORDER)[number], 'handCover'>;
export type Layers = Partial<Record<LayerName, FC>>;

export interface PartOption {
  id: string;
  label: string;
  layers?: Layers;
}

/* ---- Proportions (refs: ~7 heads tall) ----
 * Head features are drawn in a big "design" space and scaled down around the chin;
 * legs are stretched below the hips. */
export const HEAD_SCALE = 0.76;
export const HEAD_ANCHOR = { x: 200, y: 246 };
export const HEAD_TF = `translate(${HEAD_ANCHOR.x} ${HEAD_ANCHOR.y}) scale(${HEAD_SCALE}) translate(${-HEAD_ANCHOR.x} ${-HEAD_ANCHOR.y})`;
export const HEAD_LAYERS = new Set<string>([
  'hairBack', 'head', 'cheeks', 'eyes', 'nose', 'mouth', 'faceAcc', 'earAcc', 'hairFront', 'bangs', 'brows', 'topAcc',
]);

export const LEG_PIVOT = 560;
export const LEG_STRETCH = 1.3;
/** Group transform for elements lying entirely below the leg pivot. */
export const LEG_TF = `translate(0 ${LEG_PIVOT}) scale(1 ${LEG_STRETCH}) translate(0 ${-LEG_PIVOT})`;
export const legY = (y: number) => (y <= LEG_PIVOT ? y : LEG_PIVOT + (y - LEG_PIVOT) * LEG_STRETCH);

/** Warp an absolute path (M/L/C/Q/Z with x,y pairs) so its lower part follows the leg stretch. */
export function W(d: string): string {
  const tokens = d.match(/[MLCQZ]|-?\d*\.?\d+/g) ?? [];
  const out: string[] = [];
  let pair: number[] = [];
  for (const t of tokens) {
    if (/[MLCQZ]/.test(t)) {
      out.push(t);
      continue;
    }
    pair.push(parseFloat(t));
    if (pair.length === 2) {
      out.push(`${pair[0]} ${+legY(pair[1]).toFixed(1)}`);
      pair = [];
    }
  }
  return out.join(' ');
}

/** Mirror across the vertical centre line (canvas is 400 wide). */
export const MIR = 'matrix(-1 0 0 1 400 0)';

/** Render children, then a mirrored copy for the other side of the body. */
export function Sym({ children }: { children: ReactNode }) {
  return createElement(Fragment, null, children, createElement('g', { transform: MIR }, children));
}
