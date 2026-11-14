import type { FC } from 'react';
import { useAv } from '../render/context';
import { MIR, Sym, type PartOption } from './types';

/* ================= Eyes ================= */
// Drawn for the viewer-left eye (outer corner at small x), mirrored for the other.

export interface EyeShape {
  white: string;
  lash: string;
  lower?: string;
  crease?: string;
  iris: { cx: number; cy: number; rx: number; ry: number };
  extra?: 'lashes' | 'bags';
}

const SOFT: EyeShape = {
  white: 'M 146 168 C 150 156, 178 151, 190 160 C 190 172, 182 182, 168 183 C 156 183, 148 177, 146 168 Z',
  lash: 'M 191 161 C 180 151, 158 151, 146 163 L 139 159 C 141 164, 143 168, 146 171 C 156 158, 178 156, 191 161 Z',
  lower: 'M 151 178 C 157 183, 164 185, 173 184',
  crease: 'M 150 154 C 160 146, 178 146, 188 151',
  iris: { cx: 169, cy: 169, rx: 11.5, ry: 14 },
};

export const EYE_SHAPES: Record<string, EyeShape> = {
  soft: SOFT,
  round: {
    white: 'M 145 169 C 147 153, 182 149, 191 162 C 193 176, 184 187, 168 187 C 154 187, 145 180, 145 169 Z',
    lash: 'M 192 163 C 182 148, 156 148, 145 165 L 140 162 C 141 167, 142 171, 145 173 C 154 156, 180 154, 192 163 Z',
    lower: 'M 150 181 C 156 187, 166 189, 176 187',
    crease: 'M 149 152 C 160 143, 180 143, 189 149',
    iris: { cx: 169, cy: 170, rx: 12.5, ry: 15.5 },
  },
  sharp: {
    white: 'M 145 166 C 152 158, 176 153, 191 161 C 188 171, 178 178, 167 178 C 156 178, 149 173, 145 166 Z',
    lash: 'M 192 162 C 180 152, 156 152, 145 161 L 135 154 C 137 161, 141 167, 145 170 C 156 158, 178 157, 192 162 Z',
    lower: 'M 152 176 C 158 179, 166 180, 174 179',
    crease: 'M 150 153 C 162 147, 178 147, 188 152',
    iris: { cx: 169, cy: 167, rx: 10.5, ry: 12.5 },
  },
  sleepy: {
    white: 'M 146 170 C 154 163, 180 161, 190 165 C 189 175, 181 182, 168 183 C 156 183, 149 178, 146 170 Z',
    lash: 'M 191 166 C 180 159, 156 160, 146 168 L 140 166 C 142 170, 144 172, 146 174 C 156 164, 180 162, 191 166 Z',
    lower: 'M 151 179 C 157 183, 164 185, 173 184',
    crease: 'M 150 160 C 162 154, 180 154, 188 158',
    iris: { cx: 169, cy: 172, rx: 11, ry: 13 },
  },
  tired: { ...SOFT, extra: 'bags' },
  lashes: { ...SOFT, extra: 'lashes' },
};

function EyeOne({ shape, closed }: { shape: EyeShape; closed: boolean }) {
  const { c, uid, ch } = useAv();
  if (closed) {
    return (
      <g>
        <path className="ink" fill="none" stroke={c.line} strokeWidth={3.4} strokeLinecap="round" d="M 145 171 C 154 160, 182 160, 191 170" />
        <path className="ink" fill="none" stroke={c.line} strokeWidth={2} strokeLinecap="round" d="M 147 168 L 140 164" />
      </g>
    );
  }
  const { cx, cy, rx, ry } = shape.iris;
  const pupil = ch.expression === 'surprised' ? 0.3 : 0.45;
  return (
    <g>
      <path className="f" fill="#fffaf6" d={shape.white} />
      <g clipPath={`url(#${uid}-eye)`}>
        <ellipse className="f" cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${uid}-iris)`} />
        <ellipse className="f" cx={cx} cy={cy + ry * 0.5} rx={rx * 0.72} ry={ry * 0.32} fill={c.eyesLight} opacity={0.7} />
        <ellipse className="ink" cx={cx} cy={cy + 1} rx={rx * pupil} ry={ry * (pupil + 0.08)} fill={c.eyesDark} />
        <ellipse className="ink" cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={c.eyesDark} strokeWidth={1.2} opacity={0.8} />
        <path className="sh" fill="#4a2a3a" opacity={0.28} d="M 136 140 L 200 140 L 200 164 C 182 156, 156 157, 136 174 Z" />
        <circle className="hl" cx={cx - 4.5} cy={cy - 6} r={3.4} fill="#ffffff" />
        <circle className="hl" cx={cx + 4} cy={cy + 6} r={1.6} fill="#ffffff" />
      </g>
      <path className="ink" fill={c.line} d={shape.lash} />
      {shape.lower && <path className="ln" opacity={0.65} d={shape.lower} />}
      {shape.crease && <path className="ln" opacity={0.55} d={shape.crease} />}
      {shape.extra === 'lashes' && (
        <g className="ink" fill="none" stroke={c.line} strokeWidth={1.8} strokeLinecap="round">
          <path d="M 146 164 L 136 158" />
          <path d="M 149 160 L 141 151" />
          <path d="M 154 157 L 149 148" />
          <path d="M 153 182 L 149 187" />
        </g>
      )}
      {shape.extra === 'bags' && (
        <path className="ln" opacity={0.4} d="M 152 189 C 160 193, 172 193, 182 188" />
      )}
    </g>
  );
}

function eyesFor(id: string): FC {
  return function Eyes() {
    const { ch } = useAv();
    const shape = EYE_SHAPES[id] ?? SOFT;
    const e = ch.expression;
    return (
      <g>
        <EyeOne shape={shape} closed={e === 'happy'} />
        <g transform={MIR}>
          <EyeOne shape={shape} closed={e === 'happy' || e === 'wink'} />
        </g>
      </g>
    );
  };
}

export const EYES: PartOption[] = [
  { id: 'soft', label: 'Мягкие' },
  { id: 'round', label: 'Круглые' },
  { id: 'sharp', label: 'Лисьи' },
  { id: 'sleepy', label: 'Сонные' },
  { id: 'tired', label: 'Уставшие' },
  { id: 'lashes', label: 'С ресницами' },
].map((o) => ({ ...o, layers: { eyes: eyesFor(o.id) } }));

/* ================= Brows ================= */

const BROWS_D: Record<string, { d: string; w: number; filled?: boolean }> = {
  soft: { d: 'M 150 146 C 158 140, 172 138, 186 141', w: 3 },
  straight: { d: 'M 150 143 C 162 141, 174 140, 186 141', w: 3.2 },
  thin: { d: 'M 148 147 C 156 136, 174 134, 186 139', w: 1.8 },
  thick: { d: 'M 148 147 C 156 138, 174 136, 187 139 L 187 144 C 174 141, 160 143, 150 149 Z', w: 1, filled: true },
};

function browsFor(id: string): FC {
  return function Brows() {
    const { c, ch } = useAv();
    const b = BROWS_D[id] ?? BROWS_D.soft;
    const e = ch.expression;
    const tf =
      e === 'sad' || e === 'pout'
        ? 'rotate(-9 168 142) translate(0 2)'
        : e === 'surprised'
          ? 'translate(0 -5)'
          : e === 'happy'
            ? 'translate(0 -2)'
            : undefined;
    const el = b.filled ? (
      <path className="ink" fill={c.brow} d={b.d} />
    ) : (
      <path className="ink" fill="none" stroke={c.brow} strokeWidth={b.w} strokeLinecap="round" d={b.d} />
    );
    return (
      <g opacity={0.92}>
        <g transform={tf}>{el}</g>
        <g transform={MIR}>
          <g transform={tf}>{el}</g>
        </g>
      </g>
    );
  };
}

export const BROWS: PartOption[] = [
  { id: 'soft', label: 'Мягкие' },
  { id: 'straight', label: 'Прямые' },
  { id: 'thin', label: 'Тонкие' },
  { id: 'thick', label: 'Густые' },
].map((o) => ({ ...o, layers: { brows: browsFor(o.id) } }));

/* ================= Nose ================= */

export const NOSES: PartOption[] = [
  {
    id: 'line',
    label: 'Линия',
    layers: {
      nose: () => {
        const { c } = useAv();
        return <path className="ink" fill="none" stroke={c.skinLine} strokeWidth={1.6} strokeLinecap="round" d="M 203 186 C 206 193, 204 198, 198 200" />;
      },
    },
  },
  {
    id: 'dot',
    label: 'Точка',
    layers: {
      nose: () => {
        const { c } = useAv();
        return <ellipse className="ink" cx={201} cy={198} rx={1.8} ry={1.2} fill={c.skinLine} />;
      },
    },
  },
  {
    id: 'button',
    label: 'Кнопка',
    layers: {
      nose: () => {
        const { c } = useAv();
        return (
          <g>
            <path className="sh" fill={c.skinSh} d="M 204 180 C 208 190, 208 196, 202 200 L 198 196 C 202 192, 203 186, 204 180 Z" />
            <path className="ink" fill="none" stroke={c.skinLine} strokeWidth={1.5} strokeLinecap="round" d="M 195 199 C 198 201, 202 201, 205 199" />
          </g>
        );
      },
    },
  },
  { id: 'none', label: 'Без носа' },
];

/* ================= Mouth ================= */

function MouthPath({ d, w = 1.8 }: { d: string; w?: number }) {
  const { c } = useAv();
  return <path className="ink" fill="none" stroke={c.line} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" d={d} />;
}

const NEUTRAL_MOUTHS: Record<string, FC> = {
  small: () => <MouthPath d="M 193 214 C 197 216, 203 216, 207 214" />,
  smirk: () => <MouthPath d="M 192 215 C 198 217, 204 215, 209 210" />,
  flat: () => (
    <g>
      <MouthPath d="M 191 214 L 209 214" />
      <path className="ln" opacity={0.4} d="M 196 220 L 204 220" />
    </g>
  ),
  cat: () => <MouthPath d="M 190 212 C 192 217, 196 217, 200 213 C 204 217, 208 217, 210 212" w={1.6} />,
  lips: () => {
    const { c } = useAv();
    return (
      <g>
        <path className="o2" fill={c.lips} d="M 191 214 C 195 210, 199 212, 200 213 C 201 212, 205 210, 209 214 C 205 221, 195 221, 191 214 Z" />
        <path className="ln" d="M 191 214 C 196 216, 204 216, 209 214" />
        <path className="hl" fill="#ffffff" opacity={0.6} d="M 196 217 C 198 218, 202 218, 204 217 C 202 219, 198 219, 196 217 Z" />
      </g>
    );
  },
};

const EXPRESSION_MOUTHS: Partial<Record<string, FC>> = {
  smile: () => <MouthPath d="M 188 211 C 194 219, 206 219, 212 211" />,
  wink: () => <MouthPath d="M 188 211 C 194 219, 206 219, 212 211" />,
  happy: () => {
    const { c } = useAv();
    return (
      <g>
        <path className="o2" fill="#7c3038" d="M 185 210 C 189 228, 211 228, 215 210 C 205 213, 195 213, 185 210 Z" />
        <path className="f" fill="#d9707a" d="M 192 221 C 196 218, 204 218, 208 221 C 204 225, 196 225, 192 221 Z" />
        <path className="f" fill="#ffffff" d="M 187 211 C 195 214, 205 214, 213 211 L 212 214 C 204 216, 196 216, 188 214 Z" />
        <path className="ink" fill="none" stroke={c.line} strokeWidth={1.8} strokeLinecap="round" d="M 185 210 C 195 213, 205 213, 215 210" />
      </g>
    );
  },
  pout: () => <MouthPath d="M 197 210 C 202 210, 203 214, 199 215 C 203 216, 203 220, 197 220" />,
  surprised: () => {
    const { c } = useAv();
    return <ellipse className="o2" cx={200} cy={216} rx={5} ry={6.5} fill="#7c3038" stroke={c.line} />;
  },
  sad: () => <MouthPath d="M 191 218 C 196 212, 204 212, 209 218" />,
};

function mouthFor(id: string): FC {
  return function Mouth() {
    const { ch } = useAv();
    const Ex = EXPRESSION_MOUTHS[ch.expression];
    const M = Ex ?? NEUTRAL_MOUTHS[id] ?? NEUTRAL_MOUTHS.small;
    return <M />;
  };
}

export const MOUTHS: PartOption[] = [
  { id: 'small', label: 'Маленький' },
  { id: 'smirk', label: 'Ухмылка' },
  { id: 'flat', label: 'Ровный' },
  { id: 'cat', label: 'Котик' },
  { id: 'lips', label: 'Губки' },
].map((o) => ({ ...o, layers: { mouth: mouthFor(o.id) } }));

/* ================= Cheeks ================= */

function Blush({ strong = false }: { strong?: boolean }) {
  const { c } = useAv();
  return (
    <Sym>
      <ellipse className="f" cx={160} cy={198} rx={15} ry={6.5} fill={c.blush} opacity={strong ? 0.75 : 0.5} />
      <g className="ln" opacity={0.45}>
        <path d="M 154 196 L 151 201" />
        <path d="M 160 196 L 157 201" />
        <path d="M 166 196 L 163 201" />
      </g>
    </Sym>
  );
}

function Freckles() {
  const { c } = useAv();
  const pts: [number, number][] = [
    [152, 192], [160, 189], [166, 195], [157, 198], [148, 198], [170, 190],
  ];
  return (
    <Sym>
      {pts.map(([x, y], i) => (
        <circle key={i} className="ink" cx={x} cy={y} r={1.1} fill={c.skinLine} opacity={0.7} />
      ))}
    </Sym>
  );
}

function CheeksFor(id: string): FC {
  return function Cheeks() {
    const { ch, c } = useAv();
    const extraBlush = ch.expression === 'pout' || ch.expression === 'happy';
    return (
      <g>
        {(id === 'blush' || id === 'both' || extraBlush) && <Blush strong={extraBlush} />}
        {(id === 'freckles' || id === 'both') && <Freckles />}
        {id === 'mole' && <circle className="ink" cx={238} cy={194} r={1.4} fill={c.skinLine} />}
      </g>
    );
  };
}

export const CHEEKS: PartOption[] = [
  { id: 'blush', label: 'Румянец' },
  { id: 'freckles', label: 'Веснушки' },
  { id: 'both', label: 'Румянец + веснушки' },
  { id: 'mole', label: 'Родинка' },
  { id: 'none', label: 'Ничего' },
].map((o) => ({ ...o, layers: { cheeks: CheeksFor(o.id) } }));
