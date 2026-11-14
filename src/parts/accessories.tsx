import { useAv } from '../render/context';
import { Sym, type PartOption } from './types';

export const ACCESSORIES: PartOption[] = [
  {
    id: 'studs',
    label: 'Серьги-гвоздики',
    layers: {
      earAcc: () => {
        const { c } = useAv();
        return (
          <Sym>
            <circle className="o2" cx={121} cy={181} r={3.2} fill={c.accent} />
            <circle className="o2" cx={118} cy={166} r={2.2} fill={c.accent} />
          </Sym>
        );
      },
    },
  },
  {
    id: 'hoops',
    label: 'Кольца',
    layers: {
      earAcc: () => {
        const { c } = useAv();
        return (
          <Sym>
            <circle className="ink" cx={121} cy={191} r={8} fill="none" stroke={c.accent} strokeWidth={2.4} />
          </Sym>
        );
      },
    },
  },
  {
    id: 'choker',
    label: 'Чокер',
    layers: {
      neckAcc: () => {
        const { c } = useAv();
        return (
          <g>
            <path className="o2" fill="#2b2427" d="M 185 234 C 194 241, 206 241, 215 234 L 215 243 C 206 250, 194 250, 185 243 Z" />
            <circle className="o2" cx={200} cy={252} r={3.4} fill={c.accent} />
          </g>
        );
      },
    },
  },
  {
    id: 'necklace',
    label: 'Цепочка',
    layers: {
      neckAcc: () => {
        const { c } = useAv();
        return (
          <g>
            <path className="ink" fill="none" stroke={c.accent} strokeWidth={1.4} d="M 186 250 C 186 290, 214 290, 214 250" />
            <path className="o2" fill={c.accent} d="M 200 282 L 203 288 L 209 289 L 204 293 L 206 299 L 200 296 L 194 299 L 196 293 L 191 289 L 197 288 Z" />
          </g>
        );
      },
    },
  },
  {
    id: 'headphones',
    label: 'Наушники',
    layers: {
      topAcc: () => {
        const { c } = useAv();
        return (
          <g>
            <path className="o" fill={c.accent} d="M 106 150 C 98 62, 150 22, 200 22 C 250 22, 302 62, 294 150 L 284 150 C 290 74, 248 34, 200 34 C 152 34, 110 74, 116 150 Z" />
            <Sym>
              <path className="o" fill={c.accent} d="M 104 138 C 94 138, 92 150, 92 166 C 92 184, 96 196, 106 196 L 118 196 C 126 196, 128 184, 128 166 C 128 148, 126 138, 118 138 Z" />
              <path className="sh" fill={c.accentSh} d="M 96 150 C 94 160, 94 176, 98 188 L 104 192 C 100 178, 100 160, 102 146 Z" />
              <path className="ln" d="M 118 142 C 124 150, 124 184, 118 192" />
            </Sym>
          </g>
        );
      },
    },
  },
  {
    id: 'clips',
    label: 'Заколки',
    layers: {
      topAcc: () => {
        const { c } = useAv();
        return (
          <g className="ink" fill="none" stroke={c.accent} strokeWidth={5} strokeLinecap="round">
            <path d="M 236 108 L 262 118" />
            <path d="M 232 122 L 258 132" />
          </g>
        );
      },
    },
  },
  {
    id: 'glasses',
    label: 'Очки',
    layers: {
      topAcc: () => (
        <g className="ink" fill="none" stroke="#3b3033" strokeWidth={2.2}>
          <circle cx={168} cy={170} r={22} />
          <circle cx={232} cy={170} r={22} />
          <path d="M 190 166 C 195 161, 205 161, 210 166" />
          <path d="M 146 166 L 126 160" />
          <path d="M 254 166 L 274 160" />
        </g>
      ),
    },
  },
  {
    id: 'catears',
    label: 'Кошачьи ушки',
    layers: {
      topAcc: () => {
        const { c } = useAv();
        return (
          <Sym>
            <path className="o" fill="#2b2427" d="M 124 96 L 132 28 L 180 66 Z" />
            <path className="f" fill="#d9a0aa" d="M 134 84 L 138 46 L 166 68 Z" />
            <path className="ln" stroke={c.line} d="M 134 84 L 138 46 L 166 68" />
          </Sym>
        );
      },
    },
  },
  {
    id: 'bandaid',
    label: 'Пластырь',
    layers: {
      faceAcc: () => (
        <g transform="rotate(-18 240 204)">
          <rect className="o2" x={226} y={199} width={28} height={10} rx={4} fill="#efd3b9" />
          <rect className="f" x={235} y={200} width={10} height={8} fill="#e2c1a3" />
        </g>
      ),
    },
  },
  {
    id: 'tote',
    label: 'Шоппер',
    layers: {
      bag: () => {
        const { c } = useAv();
        return (
          <g>
            <path className="ln" strokeWidth={3} d="M 232 268 C 244 330, 252 400, 254 462" />
            <path className="ln" strokeWidth={3} d="M 248 266 C 262 330, 274 400, 282 460" />
            <path className="o" fill="#e8dcc4" d="M 240 458 L 312 452 L 324 584 L 236 590 Z" />
            <path className="sh" fill="#d3c4a6" d="M 240 458 L 252 457 L 250 589 L 236 590 Z" />
            <path className="o2" fill={c.accent} d="M 280 520 C 272 508, 258 516, 266 528 L 280 542 L 294 528 C 302 516, 288 508, 280 520 Z" />
          </g>
        );
      },
    },
  },
];

/* ---------- background patterns ---------- */

export const BG_PATTERNS: PartOption[] = [
  { id: 'plain', label: 'Однотонный' },
  { id: 'dots', label: 'Горошек' },
  { id: 'grid', label: 'Клетка' },
  { id: 'doodles', label: 'Сердечки и звёзды' },
];

export const BG_PATTERN_LIST = BG_PATTERNS.map((p) => p.id);
