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

/** Mirror across the vertical centre line (canvas is 400 wide). */
export const MIR = 'matrix(-1 0 0 1 400 0)';

/** Render children, then a mirrored copy for the other side of the body. */
export function Sym({ children }: { children: ReactNode }) {
  return createElement(Fragment, null, children, createElement('g', { transform: MIR }, children));
}
