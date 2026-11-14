import type { FC } from 'react';
import { useAv } from '../render/context';
import { MIR, Sym, type PartOption } from './types';

/* ---------- shared pieces ---------- */

const CAP =
  'M 116 156 C 108 92, 150 48, 200 48 C 250 48, 292 92, 284 156 C 276 128, 258 108, 236 102 C 222 98, 210 97, 200 97 C 190 97, 178 98, 164 102 C 142 108, 124 128, 116 156 Z';

function Cap() {
  const { c } = useAv();
  return (
    <g>
      {/* flyaway clumps on the silhouette */}
      <path className="o" fill={c.hairFront} d="M 198 50 C 196 42, 190 36, 182 34 C 192 33, 200 38, 205 49 Z" />
      <path className="o" fill={c.hairFront} d={CAP} />
      {/* one cel-shadow tone, like the refs */}
      <path className="sh" fill={c.hairSh} opacity={0.75} d="M 232 62 C 262 76, 282 104, 284 150 C 274 126, 258 110, 238 102 C 246 90, 244 76, 232 62 Z" />
      <path className="sh" fill={c.hairSh} opacity={0.75} d="M 152 66 C 132 80, 118 104, 116 140 C 124 120, 136 108, 150 100 C 146 88, 146 76, 152 66 Z" />
      <path className="f" fill={c.hairHl} opacity={0.6} d="M 176 62 C 186 58, 196 58, 204 60 L 200 64 C 192 63, 184 64, 178 66 Z" />
      <path className="f" fill={c.hairHl} opacity={0.6} d="M 214 62 C 224 62, 234 66, 240 72 L 236 74 C 230 70, 222 67, 214 66 Z" />
      {['M 200 52 C 184 64, 168 80, 158 100', 'M 202 52 C 218 64, 234 80, 244 100', 'M 176 58 C 156 72, 140 92, 130 120',
        'M 226 58 C 246 72, 262 92, 270 120', 'M 190 54 C 176 66, 164 82, 150 104', 'M 212 54 C 230 68, 244 84, 256 104',
        'M 164 62 C 146 74, 132 92, 124 112'].map((d, i) => (
        <path key={i} className="st" stroke={c.hairLine} d={d} />
      ))}
    </g>
  );
}

/** A side lock drawn on the viewer-left and mirrored; left one can take the streak colour. */
function Locks({ d, strands = [] }: { d: string; strands?: string[] }) {
  const { c } = useAv();
  const body = (fill: string) => (
    <g>
      <path className="o" fill={fill} d={d} />
      {strands.map((s, i) => (
        <path key={i} className="st" stroke={c.hairLine} d={s} />
      ))}
    </g>
  );
  return (
    <g>
      {body(c.lock)}
      <g transform={MIR}>{body(c.hairFront)}</g>
    </g>
  );
}

function Back({ d, strands = [] }: { d: string; strands?: string[] }) {
  const { c } = useAv();
  return (
    <g>
      <path className="o" fill={c.hairBack} d={d} />
      {strands.map((s, i) => (
        <path key={i} className="st" stroke={c.hairLine} opacity={0.7} d={s} />
      ))}
    </g>
  );
}

function style(back: FC, locks?: FC): PartOption['layers'] {
  return {
    hairBack: back,
    hairFront: () => {
      const L = locks;
      return (
        <g>
          {L && <L />}
          <Cap />
        </g>
      );
    },
  };
}

/* ---------- hairstyles ---------- */

export const HAIRSTYLES: PartOption[] = [
  {
    id: 'lowbun',
    label: 'Низкий пучок',
    layers: style(
      () => {
        const { c } = useAv();
        return (
          <g>
            <Back d="M 116 150 C 108 90, 150 46, 200 46 C 250 46, 292 90, 284 150 C 286 184, 280 206, 262 220 C 240 232, 160 232, 138 220 C 120 206, 114 184, 116 150 Z" />
            <path className="o" fill={c.hairFront} d="M 270 168 C 300 160, 322 184, 318 212 C 314 238, 290 250, 270 244 C 252 238, 246 214, 252 196 C 256 182, 262 172, 270 168 Z" />
            <path className="st" stroke={c.hairLine} d="M 266 182 C 288 174, 306 192, 304 212 C 302 228, 288 236, 274 232" />
            <path className="o2" fill={c.accent} d="M 258 186 C 264 180, 272 182, 270 190 L 262 206 C 256 204, 254 194, 258 186 Z" />
          </g>
        );
      },
      () => (
        <Locks
          d="M 120 116 C 108 156, 110 204, 126 250 C 128 226, 132 202, 136 184 C 138 196, 140 206, 142 214 C 144 182, 146 148, 150 118 Z"
          strands={['M 130 130 C 122 170, 122 210, 128 240', 'M 140 140 C 138 170, 140 192, 142 208']}
        />
      ),
    ),
  },
  {
    id: 'bun',
    label: 'Пучок',
    layers: style(
      () => {
        const { c } = useAv();
        return (
          <g>
            <Back d="M 116 150 C 108 90, 150 46, 200 46 C 250 46, 292 90, 284 150 C 286 180, 280 200, 272 216 L 128 216 C 120 200, 114 180, 116 150 Z" />
            <path className="o" fill={c.hairFront} d="M 200 4 C 230 2, 250 24, 244 48 C 240 66, 220 74, 200 74 C 180 74, 160 66, 156 48 C 150 24, 170 6, 200 4 Z" />
            <path className="st" stroke={c.hairLine} d="M 172 30 C 186 16, 214 14, 228 30 C 236 42, 222 56, 204 54 C 190 52, 186 40, 198 34" />
            <path className="st" stroke={c.hairLine} d="M 236 20 C 248 10, 256 14, 262 8" />
            <path className="st" stroke={c.hairLine} d="M 160 26 C 150 18, 146 22, 138 16" />
          </g>
        );
      },
      () => (
        <Locks
          d="M 124 118 C 112 160, 114 204, 126 244 C 132 222, 134 196, 136 174 C 138 152, 140 136, 146 120 Z"
          strands={['M 132 132 C 126 166, 126 200, 128 232']}
        />
      ),
    ),
  },
  {
    id: 'bob',
    label: 'Каре',
    layers: style(
      () => (
        <Back
          d="M 114 150 C 104 88, 150 42, 200 42 C 250 42, 296 88, 286 150 C 290 190, 292 226, 282 252 C 262 260, 240 256, 226 248 L 174 248 C 160 256, 138 260, 118 252 C 108 226, 110 190, 114 150 Z"
        />
      ),
      () => (
        <Locks
          d="M 118 124 C 108 166, 112 214, 120 254 C 130 252, 142 244, 150 234 C 140 206, 138 168, 144 118 Z"
          strands={['M 128 140 C 122 180, 124 220, 130 246', 'M 138 150 C 134 186, 136 214, 142 236']}
        />
      ),
    ),
  },
  {
    id: 'long',
    label: 'Длинные',
    layers: style(
      () => (
        <Back
          d="M 110 150 C 100 80, 150 40, 200 40 C 250 40, 300 80, 290 150 C 298 250, 310 380, 300 520 C 276 532, 246 524, 232 506 L 168 506 C 154 524, 124 532, 100 520 C 90 380, 102 250, 110 150 Z"
          strands={['M 290 200 C 300 300, 300 400, 292 500', 'M 110 200 C 100 300, 100 400, 108 500']}
        />
      ),
      () => (
        <Locks
          d="M 120 118 C 104 180, 108 260, 122 330 C 130 380, 126 430, 134 478 C 148 446, 158 400, 154 350 C 150 290, 146 220, 148 124 Z"
          strands={['M 130 150 C 120 220, 124 300, 136 360 C 142 400, 140 430, 138 460', 'M 142 170 C 138 240, 142 300, 148 350']}
        />
      ),
    ),
  },
  {
    id: 'wavy',
    label: 'Волнистые',
    layers: style(
      () => (
        <Back
          d="M 110 150 C 100 80, 150 40, 200 40 C 250 40, 300 80, 290 150 C 300 200, 286 250, 300 300 C 314 350, 292 400, 306 450 C 316 490, 296 522, 278 520 C 262 516, 244 504, 232 490 L 168 490 C 156 504, 138 516, 122 520 C 104 522, 84 490, 94 450 C 108 400, 86 350, 100 300 C 114 250, 100 200, 110 150 Z"
          strands={['M 292 220 C 302 260, 288 300, 300 340 C 310 380, 294 420, 302 460', 'M 108 220 C 98 260, 112 300, 100 340 C 90 380, 106 420, 98 460']}
        />
      ),
      () => (
        <Locks
          d="M 120 118 C 106 170, 118 210, 110 250 C 102 290, 124 320, 116 360 C 110 400, 126 432, 124 466 C 142 444, 148 412, 140 380 C 134 340, 152 310, 146 270 C 140 230, 154 190, 148 122 Z"
          strands={['M 132 140 C 124 180, 132 220, 124 260 C 118 300, 134 330, 128 370 C 124 400, 132 420, 132 440']}
        />
      ),
    ),
  },
  {
    id: 'shag',
    label: 'Шэгги',
    layers: style(
      () => (
        <Back
          d="M 110 150 C 100 84, 150 40, 200 40 C 250 40, 300 84, 290 150 C 298 200, 304 250, 314 304 L 292 292 L 298 336 L 274 314 L 272 344 L 252 318 L 230 302 L 170 302 L 148 318 L 128 344 L 126 314 L 102 336 L 108 292 L 86 304 C 96 250, 102 200, 110 150 Z"
          strands={['M 284 190 C 292 230, 296 270, 300 300', 'M 116 190 C 108 230, 104 270, 100 300']}
        />
      ),
      () => (
        <Locks
          d="M 118 118 C 104 160, 104 212, 112 262 L 120 250 L 124 288 L 134 262 L 142 280 C 146 242, 140 202, 148 120 Z"
          strands={['M 128 136 C 120 180, 120 230, 124 270', 'M 140 150 C 136 190, 136 230, 140 260']}
        />
      ),
    ),
  },
  {
    id: 'ponytail',
    label: 'Хвост',
    layers: style(
      () => {
        const { c } = useAv();
        return (
          <g>
            <Back d="M 116 150 C 108 90, 150 46, 200 46 C 250 46, 292 90, 284 150 C 286 180, 280 200, 272 214 L 128 214 C 120 200, 114 180, 116 150 Z" />
            <path className="o" fill={c.hairFront} d="M 246 56 C 300 44, 330 110, 318 200 C 312 262, 298 320, 276 380 C 274 332, 282 280, 272 232 C 264 180, 258 120, 246 56 Z" />
            <path className="st" stroke={c.hairLine} d="M 262 70 C 300 90, 308 160, 300 230 C 296 280, 288 320, 280 356" />
            <ellipse className="o" cx={252} cy={60} rx={9} ry={12} fill={c.accent} />
          </g>
        );
      },
      () => <Locks d="M 124 120 C 114 156, 118 190, 128 222 C 132 196, 134 170, 142 122 Z" />,
    ),
  },
  {
    id: 'short',
    label: 'Короткая',
    layers: style(
      () => (
        <Back d="M 114 150 C 106 86, 150 44, 200 44 C 250 44, 294 86, 286 150 C 288 176, 284 196, 276 214 L 124 214 C 116 196, 112 176, 114 150 Z" />
      ),
      () => <Locks d="M 118 126 C 112 150, 114 178, 124 202 L 132 186 C 130 166, 132 146, 140 122 Z" />,
    ),
  },
];

/* ---------- streak modes (read by colours, no own layers) ---------- */

export const STREAKS: PartOption[] = [
  { id: 'none', label: 'Без окрашивания' },
  { id: 'under', label: 'Нижний слой' },
  { id: 'tips', label: 'Кончики' },
  { id: 'strands', label: 'Прядь у лица' },
];

/* ---------- bangs ---------- */

function spikes(tips: [number, number][], top = 86): string {
  let d = `M 120 154 C 118 112, 154 ${top}, 200 ${top} C 246 ${top}, 282 112, 280 154`;
  let [px, py] = [280, 154];
  for (const [x, y] of [...tips].reverse()) {
    const vx = (px + x) / 2;
    const vy = Math.min(py, y) - 30;
    d += ` Q ${px - 3} ${(py + vy) / 2} ${vx} ${vy} Q ${x + 3} ${(vy + y) / 2} ${x} ${y}`;
    px = x;
    py = y;
  }
  d += ` Q ${px - 3} ${(py + 128) / 2} ${(px + 120) / 2} 128 Q 120 140 120 154 Z`;
  return d;
}

function bangsFrom(d: string, strands: string[] = []): FC {
  return function Bangs() {
    const { c } = useAv();
    return (
      <g>
        <path className="o" fill={c.hairFront} d={d} />
        {strands.map((s, i) => (
          <path key={i} className="st" stroke={c.hairLine} d={s} />
        ))}
      </g>
    );
  };
}

const WISPY_TIPS: [number, number][] = [
  [130, 166], [148, 150], [166, 160], [184, 146], [200, 158], [216, 146], [234, 160], [252, 150], [270, 166],
];
const MESSY_TIPS: [number, number][] = [
  [128, 196], [148, 168], [174, 180], [196, 160], [220, 176], [246, 164], [270, 192],
];

export const BANGS: PartOption[] = [
  {
    id: 'parted',
    label: 'На пробор',
    layers: {
      bangs: () => {
        const { c } = useAv();
        const piece = (
          <g>
            <path
              className="f"
              fill={c.hairFront}
              d="M 204 88 C 176 86, 140 98, 122 128 C 116 150, 120 176, 128 196 C 134 180, 140 168, 148 158 C 148 162, 149 166, 150 170 C 156 154, 164 140, 176 130 C 178 138, 182 146, 186 152 C 188 132, 194 114, 204 98 Z"
            />
            <path
              className="ln"
              d="M 122 128 C 116 150, 120 176, 128 196 C 134 180, 140 168, 148 158 C 148 162, 149 166, 150 170 C 156 154, 164 140, 176 130 C 178 138, 182 146, 186 152 C 188 132, 194 114, 204 98"
            />
            <path className="st" stroke={c.hairLine} d="M 194 104 C 172 116, 150 140, 136 182" />
            <path className="st" stroke={c.hairLine} d="M 186 110 C 172 124, 162 140, 154 160" />
            <path className="st" stroke={c.hairLine} d="M 196 108 C 190 120, 186 134, 184 146" />
          </g>
        );
        return (
          <g>
            <Sym>{piece}</Sym>
            <path className="o" fill={c.hairFront} d="M 208 96 C 200 116, 194 136, 194 160 C 200 142, 206 124, 214 104 Z" />
            <path className="st" stroke={c.hairLine} d="M 200 52 L 201 96" />
          </g>
        );
      },
    },
  },
  {
    id: 'curtain',
    label: 'Шторки',
    layers: {
      bangs: () => {
        const { c } = useAv();
        const piece = (
          <g>
            <path className="o" fill={c.hairFront} d="M 202 92 C 178 98, 150 116, 136 156 C 130 178, 132 198, 138 216 C 144 186, 156 150, 178 124 C 186 112, 194 104, 202 98 Z" />
            <path className="st" stroke={c.hairLine} d="M 190 104 C 166 122, 150 150, 142 190" />
          </g>
        );
        return (
          <g>
            <Sym>{piece}</Sym>
            <path className="st" stroke={c.hairLine} d="M 200 52 L 200 96" />
          </g>
        );
      },
    },
  },
  {
    id: 'blunt',
    label: 'Ровная',
    layers: {
      bangs: bangsFrom(
        'M 126 150 C 122 112, 152 86, 200 86 C 248 86, 278 112, 274 150 C 266 146, 258 152, 250 148 C 242 152, 232 148, 224 152 C 216 148, 208 152, 200 149 C 192 152, 184 148, 176 152 C 168 148, 158 152, 150 148 C 142 152, 134 146, 126 150 Z',
        ['M 160 104 L 156 146', 'M 186 100 L 184 148', 'M 214 100 L 216 148', 'M 240 104 L 244 146'],
      ),
    },
  },
  {
    id: 'side',
    label: 'Набок',
    layers: {
      bangs: bangsFrom(
        'M 150 86 C 200 78, 262 98, 280 152 C 274 162, 264 170, 256 176 C 254 152, 242 134, 226 126 C 236 140, 240 154, 238 166 C 222 142, 196 130, 170 132 C 182 140, 186 150, 186 158 C 164 144, 140 148, 124 162 C 124 128, 132 100, 150 86 Z',
        ['M 170 96 C 214 100, 250 124, 262 164', 'M 160 112 C 196 116, 222 132, 232 156'],
      ),
    },
  },
  {
    id: 'wispy',
    label: 'Пёрышки',
    layers: {
      bangs: bangsFrom(spikes(WISPY_TIPS), ['M 176 100 L 166 156', 'M 214 100 L 216 150', 'M 240 108 L 250 152']),
    },
  },
  {
    id: 'messy',
    label: 'Небрежная',
    layers: {
      bangs: bangsFrom(spikes(MESSY_TIPS, 84), ['M 170 98 L 148 166', 'M 200 96 L 196 158', 'M 230 102 L 246 162']),
    },
  },
  { id: 'none', label: 'Открытый лоб' },
];
