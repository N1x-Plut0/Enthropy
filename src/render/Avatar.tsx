import { memo, useId, useMemo, type Ref } from 'react';
import type { Character, Format, StyleId } from '../model/character';
import { BASE, HAND_CLIP, POCKET_SLIT } from '../parts/body';
import { EYE_SHAPES } from '../parts/face';
import { ALL_SLOTS } from '../parts/registry';
import { HEAD_LAYERS, HEAD_TF, LAYER_ORDER, LEG_TF, MIR, SHOE_SHIFT, type LayerName, type PartOption } from '../parts/types';
import { shade } from './color';
import { AvCtx, derive, useAv } from './context';

export const VIEWBOX: Record<Format, string> = {
  full: '20 40 360 1010',
  portrait: '100 72 200 230',
};

const SK = '#3d3436';
const AV_CSS = `
.av-clean .o{stroke:#3b2926;stroke-width:1.7;stroke-linejoin:round;stroke-linecap:round}
.av-clean .o2{stroke:#3b2926;stroke-width:1.1;stroke-linejoin:round}
.av-clean .ln{fill:none;stroke:#3b2926;stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
.av-clean .st{fill:none;stroke-width:1;stroke-linecap:round}
.av-sketch .o,.av-sketch .o2,.av-sketch .ln{stroke:${SK};stroke-linejoin:round;stroke-linecap:round}
.av-sketch .o{stroke-width:1.8}.av-sketch .o2{stroke-width:1.2}
.av-sketch .ln{fill:none;stroke-width:1.3}
.av-sketch .st{fill:none;stroke-width:1.1;stroke-linecap:round}
.av-sketch .fills .o,.av-sketch .fills .o2{stroke:none}
.av-sketch .fills .ln,.av-sketch .fills .st,.av-sketch .fills .ink,.av-sketch .fills .hl{display:none}
.av-sketch .lines .o,.av-sketch .lines .o2,.av-sketch .lines .f{fill:#fff}
.av-sketch .lines .sh,.av-sketch .lines .hl{display:none}
.av-sketch .lines2 .ink{display:none}
.av-sketch .hlp{visibility:hidden}.av-sketch .hlp .hl{visibility:visible}
`;

function selectedOptions(ch: Character): PartOption[] {
  const out: PartOption[] = [BASE];
  for (const slot of ALL_SLOTS) {
    const v = ch.parts[slot.key];
    const ids = Array.isArray(v) ? v : [v];
    for (const id of ids) {
      const o = slot.options.find((x) => x.id === id);
      if (o) out.push(o);
    }
  }
  return out;
}

function LayerStack() {
  const { ch, uid } = useAv();
  const opts = useMemo(() => selectedOptions(ch), [ch]);
  const render = (layer: LayerName) =>
    opts.map((o, i) => {
      const C = o.layers?.[layer];
      return C ? <C key={`${layer}-${o.id}-${i}`} /> : null;
    });
  return (
    <>
      {LAYER_ORDER.map((l) => {
        if (l === 'handCover') {
          return ch.pose === 'pockets' ? (
            <g key={l} clipPath={`url(#${uid}-hc)`}>
              {render('bottom')}
              {render('top')}
              {render('outer')}
              <path className="ln" d={POCKET_SLIT} />
              <path className="ln" d={POCKET_SLIT} transform={MIR} />
            </g>
          ) : null;
        }
        if (l === 'sleeves' && ch.parts.outer !== 'none') return null;
        return (
          <g key={l} transform={HEAD_LAYERS.has(l) ? HEAD_TF : l === 'shoes' ? LEG_TF : undefined}>
            {render(l)}
          </g>
        );
      })}
    </>
  );
}

function Defs() {
  const { uid, c, ch } = useAv();
  const eye = EYE_SHAPES[ch.parts.eyes] ?? EYE_SHAPES.calm;
  return (
    <defs>
      <linearGradient id={`${uid}-iris`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c.eyesDark} />
        <stop offset="0.38" stopColor={c.eyesDark} />
        <stop offset="0.7" stopColor={c.eyes} />
        <stop offset="1" stopColor={shade(c.eyes, 0.3)} />
      </linearGradient>
      <linearGradient id={`${uid}-hg`} gradientUnits="userSpaceOnUse" x1="0" y1="150" x2="0" y2="480">
        <stop offset="0" stopColor={c.hair} />
        <stop offset="0.35" stopColor={c.hair} />
        <stop offset="1" stopColor={c.streak} />
      </linearGradient>
      <linearGradient id={`${uid}-hgb`} gradientUnits="userSpaceOnUse" x1="0" y1="150" x2="0" y2="480">
        <stop offset="0" stopColor={c.hairSh} />
        <stop offset="0.35" stopColor={c.hairSh} />
        <stop offset="1" stopColor={shade(c.streak, -0.15)} />
      </linearGradient>
      <clipPath id={`${uid}-eye`} clipPathUnits="userSpaceOnUse">
        <path d={eye.white} />
      </clipPath>
      <clipPath id={`${uid}-hc`} clipPathUnits="userSpaceOnUse">
        <path d={HAND_CLIP} />
        <path d={HAND_CLIP} transform={MIR} />
      </clipPath>

      {/* watercolour fill: wobbly edges + pigment grain */}
      <filter id={`${uid}-wc`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" seed="9" result="g" />
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -0.6 0 0 0 1.25" result="g2" />
        <feComposite in="d" in2="g2" operator="in" result="mottled" />
        <feMerge>
          <feMergeNode in="mottled" />
          <feMergeNode in="mottled" />
        </feMerge>
      </filter>
      {/* pencil line: slight wobble + grain */}
      <filter id={`${uid}-pc`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="1" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="3" result="g" />
        <feColorMatrix in="g" type="matrix" values="0.55 0 0 0 0  0.55 0 0 0 0  0.55 0 0 0 0  0 0 0 0 1" result="gray" />
        <feBlend in="d" in2="gray" mode="screen" result="b" />
        <feComposite in="b" in2="d" operator="in" />
      </filter>
      <filter id={`${uid}-pc2`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="G" yChannelSelector="R" />
      </filter>
      <filter id={`${uid}-paper`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.2  0 0 0 -0.9 0.55" />
      </filter>
    </defs>
  );
}

function Doodles({ color }: { color: string }) {
  const heart = 'M 0 4 C -6 -4, -14 4, 0 14 C 14 4, 6 -4, 0 4 Z';
  const star = 'M 0 -10 L 3 -3 L 10 -3 L 4 2 L 6 10 L 0 5 L -6 10 L -4 2 L -10 -3 L -3 -3 Z';
  const items: [number, number, 'h' | 's', number][] = [
    [50, 60, 'h', -12], [340, 90, 's', 10], [60, 300, 's', 0], [350, 330, 'h', 14], [40, 560, 'h', 8],
    [355, 600, 's', -8], [70, 820, 's', 12], [335, 860, 'h', -10], [210, 10, 's', 0], [345, 220, 's', 20],
    [40, 180, 's', -15], [360, 470, 'h', 4], [30, 700, 's', 6],
  ];
  return (
    <g fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round">
      {items.map(([x, y, t, r], i) => (
        <path key={i} d={t === 'h' ? heart : star} transform={`translate(${x} ${y}) rotate(${r})`} />
      ))}
    </g>
  );
}

function Background({ transparent }: { transparent?: boolean }) {
  const { c, ch, uid } = useAv();
  if (transparent) return null;
  const p = ch.parts.bgPattern;
  return (
    <g>
      <rect x={-200} y={-200} width={800} height={1400} fill={c.bg} />
      {p === 'dots' && (
        <>
          <pattern id={`${uid}-dots`} width={26} height={26} patternUnits="userSpaceOnUse">
            <circle cx={6} cy={6} r={3} fill={c.bgInk} />
            <circle cx={19} cy={19} r={3} fill={c.bgInk} />
          </pattern>
          <rect x={-200} y={-200} width={800} height={1400} fill={`url(#${uid}-dots)`} />
        </>
      )}
      {p === 'grid' && (
        <>
          <pattern id={`${uid}-grid`} width={24} height={24} patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 L 0 24" fill="none" stroke={c.bgInk} strokeWidth={1} />
          </pattern>
          <rect x={-200} y={-200} width={800} height={1400} fill={`url(#${uid}-grid)`} />
        </>
      )}
      {p === 'doodles' && <Doodles color={c.bgInk} />}
      {ch.style === 'sketch' && <rect x={-200} y={-200} width={800} height={1400} filter={`url(#${uid}-paper)`} opacity={0.5} />}
      <ellipse cx={200} cy={938 + SHOE_SHIFT} rx={96} ry={10} fill="#000" opacity={0.12} />
    </g>
  );
}

export interface AvatarProps {
  ch: Character;
  format?: Format;
  viewBox?: string;
  style?: StyleId;
  className?: string;
  svgRef?: Ref<SVGSVGElement>;
  transparent?: boolean;
}

function AvatarInner({ ch, format = 'full', viewBox, style, className, svgRef, transparent }: AvatarProps) {
  const raw = useId();
  const uid = 'a' + raw.replace(/[^a-zA-Z0-9]/g, '');
  const st = style ?? ch.style;
  const eff = useMemo(() => (st === ch.style ? ch : { ...ch, style: st }), [ch, st]);
  const value = useMemo(() => ({ uid, ch: eff, c: derive(eff, uid) }), [eff, uid]);
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox ?? VIEWBOX[format]}
      className={`av av-${st} ${className ?? ''}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={ch.name}
    >
      <style>{AV_CSS}</style>
      <AvCtx.Provider value={value}>
        <Defs />
        <Background transparent={transparent} />
        {st === 'clean' ? (
          <g className="clean">
            <LayerStack />
          </g>
        ) : (
          <>
            <g className="fills" filter={`url(#${uid}-wc)`} opacity={0.95}>
              <LayerStack />
            </g>
            <g className="lines" filter={`url(#${uid}-pc)`} style={{ mixBlendMode: 'multiply' }}>
              <LayerStack />
            </g>
            <g className="lines lines2" filter={`url(#${uid}-pc2)`} opacity={0.3} style={{ mixBlendMode: 'multiply' }}>
              <LayerStack />
            </g>
            <g className="hlp">
              <LayerStack />
            </g>
          </>
        )}
      </AvCtx.Provider>
    </svg>
  );
}

export const Avatar = memo(AvatarInner);
