import { createContext, useContext } from 'react';
import type { Character } from '../model/character';
import { luminance, mix, shade } from './color';

export const LINE = '#3b2926';

export function derive(ch: Character, uid: string) {
  const k = ch.colors;
  const streak = ch.parts.streak;
  const hairSh = shade(k.hair, -0.2);
  const hairFront = streak === 'tips' ? `url(#${uid}-hg)` : k.hair;
  return {
    line: LINE,
    skin: k.skin,
    skinSh: shade(k.skin, -0.12),
    skinLine: shade(k.skin, -0.45),
    blush: mix(k.skin, '#e8606c', 0.5),
    lips: mix(k.skin, '#c2505c', 0.45),
    hair: k.hair,
    hairSh,
    hairHl: shade(k.hair, 0.28),
    hairLine: shade(k.hair, -0.5),
    brow: shade(k.hair, -0.35),
    hairBack: streak === 'under' ? k.streak : streak === 'tips' ? `url(#${uid}-hgb)` : hairSh,
    hairFront,
    lock: streak === 'strands' ? k.streak : hairFront,
    streak: k.streak,
    eyes: k.eyes,
    eyesDark: shade(k.eyes, -0.6),
    eyesLight: shade(k.eyes, 0.45),
    top: k.top,
    topSh: shade(k.top, -0.16),
    topLine: luminance(k.top) < 0.05 ? shade(k.top, 0.25) : shade(k.top, -0.3),
    outer: k.outer,
    outerSh: shade(k.outer, -0.16),
    outerLine: luminance(k.outer) < 0.05 ? shade(k.outer, 0.25) : shade(k.outer, -0.3),
    bottom: k.bottom,
    bottomSh: shade(k.bottom, -0.16),
    bottomLine: luminance(k.bottom) < 0.05 ? shade(k.bottom, 0.25) : shade(k.bottom, -0.3),
    shoes: k.shoes,
    shoesSh: shade(k.shoes, -0.18),
    sole: '#f1ece4',
    accent: k.accent,
    accentSh: shade(k.accent, -0.25),
    bg: k.bg,
    bgInk: luminance(k.bg) > 0.35 ? shade(k.bg, -0.18) : shade(k.bg, 0.14),
  };
}

export type Palette = ReturnType<typeof derive>;

export interface AvCtxValue {
  uid: string;
  ch: Character;
  c: Palette;
}

export const AvCtx = createContext<AvCtxValue | null>(null);

export function useAv(): AvCtxValue {
  const v = useContext(AvCtx);
  if (!v) throw new Error('useAv outside Avatar');
  return v;
}
