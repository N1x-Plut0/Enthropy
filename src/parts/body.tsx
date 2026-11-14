import { useAv } from '../render/context';
import { Sym, W, type PartOption } from './types';

/* ---------- Geometry shared with clothing ---------- */

export const ARM = {
  stand: {
    fill: 'M 132 290 C 118 340, 112 400, 112 450 C 112 490, 114 520, 116 548 L 140 548 C 140 520, 142 488, 144 452 C 146 410, 150 360, 156 306 Z',
    outer: 'M 132 290 C 118 340, 112 400, 112 450 C 112 490, 114 520, 116 548',
    inner: 'M 156 306 C 150 360, 146 410, 144 452 C 142 488, 140 520, 140 548',
  },
  pockets: {
    fill: 'M 132 290 C 116 340, 106 392, 108 428 C 110 462, 128 496, 150 532 L 176 514 C 156 486, 136 456, 134 428 C 134 392, 142 350, 156 306 Z',
    outer: 'M 132 290 C 116 340, 106 392, 108 428 C 110 462, 128 496, 150 532',
    inner: 'M 156 306 C 142 350, 134 392, 134 428 C 136 456, 156 486, 176 514',
  },
};

/** Region past the pocket slit; clothes are re-drawn here so hands vanish into pockets. */
export const HAND_CLIP = 'M 176 488 L 139 530 L 128 640 L 200 640 L 200 488 Z';
export const POCKET_SLIT = 'M 176 488 C 160 500, 148 514, 139 530';

/* ---------- Base body (always drawn) ---------- */

const TORSO =
  'M 186 250 L 186 262 C 170 270, 142 274, 128 286 C 122 300, 124 330, 132 360 C 136 400, 136 440, 138 482 L 262 482 C 264 440, 264 400, 268 360 C 276 330, 278 300, 272 286 C 258 274, 230 270, 214 262 L 214 250 Z';
const LEG =
  'M 142 470 C 140 560, 144 640, 150 720 C 154 780, 156 830, 158 884 L 186 884 C 188 830, 192 780, 194 720 C 198 640, 200 560, 200 500 Z';

function Body() {
  const { c } = useAv();
  return (
    <g>
      <Sym>
        <path className="o" fill={c.skin} d={W(LEG)} />
        <path className="ln" opacity={0.35} d={W("M 160 692 C 166 697, 176 697, 184 692")} />
      </Sym>
      <path className="o" fill={c.skin} d={TORSO} />
      <path className="f" fill={c.skin} d="M 186 200 L 186 266 C 194 272, 206 272, 214 266 L 214 200 Z" />
      <path className="ln" d="M 186 214 L 186 262" />
      <path className="ln" d="M 214 214 L 214 262" />
      <path className="sh" fill={c.skinSh} d="M 186 222 C 192 240, 208 240, 214 222 L 214 248 C 206 254, 194 254, 186 248 Z" />
      <Sym>
        <path className="ln" opacity={0.45} d="M 168 284 C 176 289, 186 289, 194 286" />
      </Sym>
    </g>
  );
}

function Arms() {
  const { c, ch } = useAv();
  const a = ARM[ch.pose];
  return (
    <Sym>
      <path className="f" fill={c.skin} d={a.fill} />
      <path className="ln" d={a.outer} />
      <path className="ln" d={a.inner} />
      {ch.pose === 'stand' && (
        <g>
          <path className="o" fill={c.skin} d="M 115 544 C 108 562, 110 586, 122 592 C 134 596, 145 582, 141 560 L 140 544 Z" />
          <path className="ln" opacity={0.6} d="M 126 574 C 130 580, 134 584, 137 584" />
          <path className="ln" opacity={0.6} d="M 122 566 C 118 572, 118 578, 121 582" />
        </g>
      )}
    </Sym>
  );
}

export const BASE: PartOption = { id: 'base', label: 'base', layers: { body: Body, arms: Arms } };

/* ---------- Face shapes (layer: head) ---------- */

const EAR = 'M 130 146 C 116 134, 108 158, 115 173 C 119 183, 128 187, 135 180';

function headFor(d: string) {
  return function Head() {
    const { c } = useAv();
    return (
      <g>
        <Sym>
          <path className="o" fill={c.skin} d={EAR} />
          <path className="ln" opacity={0.5} d="M 126 156 C 120 158, 120 168, 125 174" />
        </Sym>
        <path className="o" fill={c.skin} d={d} />
        <path className="sh" fill={c.skinSh} opacity={0.8} d="M 128 124 C 150 104, 250 104, 272 124 L 274 142 C 250 120, 150 120, 126 142 Z" />
      </g>
    );
  };
}

export const FACES: PartOption[] = [
  {
    id: 'soft',
    label: 'Мягкое',
    layers: {
      head: headFor(
        'M 126 140 C 126 92, 160 62, 200 62 C 240 62, 274 92, 274 140 C 274 176, 264 198, 244 216 C 228 229, 214 235, 200 235 C 186 235, 172 229, 156 216 C 136 198, 126 176, 126 140 Z',
      ),
    },
  },
  {
    id: 'oval',
    label: 'Овальное',
    layers: {
      head: headFor(
        'M 128 138 C 128 90, 160 60, 200 60 C 240 60, 272 90, 272 138 C 272 178, 262 204, 242 224 C 228 236, 214 242, 200 242 C 186 242, 172 236, 158 224 C 138 204, 128 178, 128 138 Z',
      ),
    },
  },
  {
    id: 'round',
    label: 'Круглое',
    layers: {
      head: headFor(
        'M 124 142 C 124 92, 158 64, 200 64 C 242 64, 276 92, 276 142 C 276 180, 268 202, 250 216 C 232 228, 216 232, 200 232 C 184 232, 168 228, 150 216 C 132 202, 124 180, 124 142 Z',
      ),
    },
  },
  {
    id: 'sharp',
    label: 'Острое',
    layers: {
      head: headFor(
        'M 127 138 C 127 90, 160 62, 200 62 C 240 62, 273 90, 273 138 C 273 172, 266 192, 250 210 C 232 228, 212 240, 200 240 C 188 240, 168 228, 150 210 C 134 192, 127 172, 127 138 Z',
      ),
    },
  },
];
