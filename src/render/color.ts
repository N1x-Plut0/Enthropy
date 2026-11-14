type RGB = [number, number, number];
type HSL = [number, number, number];

export function parse(hex: string): RGB {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((x) => x + x).join('');
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return [128, 128, 128];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function toHex([r, g, b]: RGB): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function rgbToHsl([r, g, b]: RGB): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h /= 6;
  return [h, s, l];
}

function hslToRgb([h, s, l]: HSL): RGB {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const hue = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue(p, q, h + 1 / 3) * 255, hue(p, q, h) * 255, hue(p, q, h - 1 / 3) * 255];
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Move `color` from the zone's original base colour to `target`, keeping its
 * relative shading (lighter/darker, more/less saturated, small hue drift).
 */
export function recolor(color: string, base: string, target: string): string {
  if (base.toLowerCase() === target.toLowerCase()) return color;
  const [ch, cs, cl] = rgbToHsl(parse(color));
  const [bh, bs, bl] = rgbToHsl(parse(base));
  const [th, ts, tl] = rgbToHsl(parse(target));
  let dh = ch - bh;
  if (dh > 0.5) dh -= 1;
  if (dh < -0.5) dh += 1;
  // scale lightness deltas so shading stays visible on very light / very dark targets
  const dl = cl - bl;
  const room = dl >= 0 ? (1 - tl) / Math.max(0.05, 1 - bl) : tl / Math.max(0.05, bl);
  const l = clamp(tl + dl * Math.min(1.6, Math.max(0.5, room)));
  const s = clamp(ts + (cs - bs) * (ts > 0.08 ? 1 : 0.3));
  return toHex(hslToRgb([(th + dh + 1) % 1, s, l]));
}
