import type { FC } from 'react';
import { useAv } from '../render/context';
import { POCKET_SLIT } from './body';
import { Sym, type PartOption } from './types';

/* ================= Sleeves ================= */

const SHORT_SLEEVE = 'M 130 278 C 112 312, 100 360, 96 408 C 112 414, 134 418, 150 414 C 150 380, 154 340, 162 300 Z';

const LONG_SLEEVE = {
  stand: {
    d: 'M 128 280 C 108 336, 102 400, 104 452 C 104 494, 106 522, 108 548 C 120 552, 136 552, 148 548 C 148 520, 150 490, 152 452 C 154 410, 158 360, 164 302 Z',
    cuff: 'M 107 534 C 120 538, 136 538, 149 534',
    fold: 'M 118 430 C 126 436, 136 436, 144 430',
  },
  pockets: {
    d: 'M 128 280 C 108 336, 98 392, 100 430 C 102 468, 124 504, 148 540 L 182 516 C 160 484, 142 458, 142 428 C 142 392, 150 350, 164 302 Z',
    cuff: 'M 140 528 L 170 506',
    fold: 'M 108 432 C 118 440, 130 440, 140 432',
  },
};

const BULKY_SLEEVE = {
  stand: {
    d: 'M 122 278 C 102 336, 96 400, 98 452 C 98 494, 100 522, 102 548 C 118 553, 138 553, 152 548 C 152 520, 154 490, 156 452 C 158 410, 162 360, 168 302 Z',
    cuff: 'M 101 532 C 118 537, 138 537, 153 532',
    fold: 'M 108 420 C 120 428, 138 428, 150 420',
  },
  pockets: {
    d: 'M 122 278 C 102 336, 92 392, 94 430 C 96 470, 120 506, 146 544 L 186 518 C 162 486, 146 458, 146 428 C 146 392, 154 350, 168 302 Z',
    cuff: 'M 136 530 L 174 504',
    fold: 'M 100 428 C 114 438, 132 438, 146 428',
  },
};

function LongSleeves({ fill, line, bulky = false }: { fill: string; line: string; bulky?: boolean }) {
  const { ch } = useAv();
  const s = (bulky ? BULKY_SLEEVE : LONG_SLEEVE)[ch.pose];
  return (
    <Sym>
      <path className="o" fill={fill} d={s.d} />
      <path className="st" stroke={line} d={s.cuff} />
      <path className="st" stroke={line} opacity={0.7} d={s.fold} />
    </Sym>
  );
}

/* ================= Tops ================= */

const TEE =
  'M 184 256 C 168 264, 142 268, 126 282 C 118 300, 120 340, 126 380 C 130 420, 132 470, 128 514 C 170 522, 230 522, 272 514 C 268 470, 270 420, 274 380 C 280 340, 282 300, 274 282 C 258 268, 232 264, 216 256 C 210 266, 190 266, 184 256 Z';

function TeeBody({ print }: { print?: boolean }) {
  const { c } = useAv();
  return (
    <g>
      <path className="o" fill={c.top} d={TEE} />
      <path className="sh" fill={c.topSh} d="M 128 300 C 124 340, 130 380, 134 420 C 138 460, 136 490, 134 512 L 152 515 C 150 470, 146 420, 142 380 C 138 340, 136 312, 140 292 Z" />
      <path className="o2" fill={c.topSh} d="M 182 254 C 188 275, 212 275, 218 254 C 212 268, 188 268, 182 254 Z" />
      <path className="st" stroke={c.topLine} d="M 150 440 C 154 470, 152 495, 148 512" />
      <path className="st" stroke={c.topLine} d="M 248 430 C 245 460, 248 490, 252 512" />
      <path className="st" stroke={c.topLine} opacity={0.6} d="M 170 330 C 182 346, 200 350, 214 346" />
      {print && (
        <g className="ink">
          <text x={200} y={340} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={26} fill={c.accent}>
            Enthropy
          </text>
          <text x={200} y={410} textAnchor="middle" fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} fontSize={68} fill={c.accent} opacity={0.92}>
            94
          </text>
        </g>
      )}
    </g>
  );
}

const TeeSleeves: FC = () => {
  const { c } = useAv();
  return (
    <Sym>
      <path className="o" fill={c.top} d={SHORT_SLEEVE} />
      <path className="st" stroke={c.topLine} d="M 98 396 C 114 401, 134 404, 150 402" />
      <path className="st" stroke={c.topLine} opacity={0.6} d="M 116 340 C 122 352, 130 360, 140 364" />
    </Sym>
  );
};

const TopTopSleeves: FC = () => {
  const { c } = useAv();
  return <LongSleeves fill={c.top} line={c.topLine} />;
};

export const TOPS: PartOption[] = [
  { id: 'tee', label: 'Оверсайз футболка', layers: { top: () => <TeeBody />, sleeves: TeeSleeves } },
  { id: 'tee94', label: 'Футболка с принтом', layers: { top: () => <TeeBody print />, sleeves: TeeSleeves } },
  { id: 'longsleeve', label: 'Лонгслив', layers: { top: () => <TeeBody />, sleeves: TopTopSleeves } },
  {
    id: 'hoodie',
    label: 'Худи',
    layers: {
      top: () => {
        const { c } = useAv();
        return (
          <g>
            <path
              className="o"
              fill={c.top}
              d="M 182 254 C 164 262, 138 266, 122 282 C 114 300, 116 340, 122 380 C 126 420, 128 460, 126 500 L 128 520 C 170 528, 230 528, 272 520 L 274 500 C 272 460, 274 420, 278 380 C 284 340, 286 300, 278 282 C 262 266, 236 262, 218 254 Z"
            />
            <path className="sh" fill={c.topSh} d="M 124 300 C 120 340, 126 380, 130 420 C 134 460, 132 490, 130 516 L 148 518 C 146 470, 142 420, 138 380 C 134 340, 132 312, 136 292 Z" />
            <path className="st" stroke={c.topLine} d="M 127 502 C 170 510, 230 510, 273 502" />
            <path className="o2" fill={c.top} d="M 160 430 L 240 430 L 258 494 L 142 494 Z" />
            <path className="st" stroke={c.topLine} d="M 166 434 L 152 492" />
            <path className="st" stroke={c.topLine} d="M 234 434 L 248 492" />
            <path
              className="o"
              fill={c.topSh}
              d="M 158 264 C 152 238, 172 226, 186 240 L 186 262 C 192 272, 208 272, 214 262 L 214 240 C 228 226, 248 238, 242 264 C 238 286, 222 294, 200 294 C 178 294, 162 286, 158 264 Z"
            />
            <path className="ln" d="M 190 286 L 188 336" />
            <path className="ln" d="M 210 286 L 212 336" />
            <circle className="o2" cx={188} cy={338} r={2.5} fill={c.accent} />
            <circle className="o2" cx={212} cy={338} r={2.5} fill={c.accent} />
          </g>
        );
      },
      sleeves: TopTopSleeves,
    },
  },
  {
    id: 'tank',
    label: 'Майка',
    layers: {
      top: () => {
        const { c } = useAv();
        return (
          <g>
            <Sym>
              <path className="o2" fill={c.top} d="M 160 268 L 167 268 L 160 300 L 152 300 Z" />
            </Sym>
            <path
              className="o"
              fill={c.top}
              d="M 152 298 C 166 322, 234 322, 248 298 L 260 302 C 264 320, 268 336, 268 350 C 264 390, 262 440, 264 484 L 136 484 C 138 440, 136 390, 132 350 C 132 336, 136 320, 140 302 Z"
            />
            <path className="sh" fill={c.topSh} d="M 134 352 C 138 392, 140 440, 140 484 L 156 484 C 154 440, 150 392, 146 350 Z" />
            <path className="st" stroke={c.topLine} d="M 154 302 C 160 308, 164 304, 170 310 C 176 316, 182 312, 188 316 C 194 320, 206 320, 212 316 C 218 312, 224 316, 230 310 C 236 304, 240 308, 246 302" />
            <path className="st" stroke={c.topLine} opacity={0.6} d="M 170 420 C 176 450, 174 470, 170 484" />
          </g>
        );
      },
    },
  },
];

/* ================= Outerwear ================= */

function OpenFront({ hem, collar, extra }: { hem: number; collar: 'lapel' | 'knit' | 'leather'; extra?: FC }) {
  const { c } = useAv();
  const X = extra;
  const panel = `M 182 252 C 164 260, 132 264, 118 282 C 108 300, 110 340, 116 380 C 120 420, 120 ${hem - 50}, 118 ${hem} L 166 ${hem + 6} C 166 ${hem - 50}, 168 420, 172 370 C 176 320, 182 290, 186 262 Z`;
  return (
    <Sym>
      <path className="o" fill={c.outer} d={panel} />
      <path className="sh" fill={c.outerSh} d={`M 120 300 C 114 340, 118 380, 122 420 C 124 ${hem - 40}, 124 ${hem - 20}, 122 ${hem - 2} L 136 ${hem} C 136 ${hem - 40}, 134 420, 132 380 C 128 340, 128 312, 132 292 Z`} />
      {collar === 'lapel' && (
        <path className="o2" fill={c.outerSh} d="M 182 252 C 172 262, 164 290, 160 326 L 176 304 C 178 286, 182 270, 190 260 Z" />
      )}
      {collar === 'leather' && (
        <path className="o2" fill={c.outerSh} d="M 184 252 C 168 262, 150 274, 144 290 L 162 312 L 158 334 L 174 306 C 176 288, 180 270, 190 260 Z" />
      )}
      {collar === 'knit' && (
        <g>
          <path className="o2" fill={c.outerSh} d={`M 184 254 C 178 300, 172 360, 168 ${hem + 4} L 160 ${hem + 4} C 162 360, 168 300, 178 256 Z`} />
          <path className="st" stroke={c.outerLine} d={`M 120 ${hem - 14} L 164 ${hem - 10}`} />
        </g>
      )}
      {X && <X />}
    </Sym>
  );
}

const OuterSleeves: FC = () => {
  const { c } = useAv();
  return <LongSleeves fill={c.outer} line={c.outerLine} bulky />;
};

export const OUTERS: PartOption[] = [
  { id: 'none', label: 'Без верхней одежды' },
  {
    id: 'jacket',
    label: 'Куртка',
    layers: {
      outer: () => (
        <OpenFront
          hem={520}
          collar="lapel"
          extra={() => {
            const { c } = useAv();
            return (
              <g>
                <path className="o2" fill={c.outer} d="M 132 340 L 162 342 L 160 360 L 132 358 Z" />
                <path className="st" stroke={c.outerLine} d="M 128 470 L 164 474" />
              </g>
            );
          }}
        />
      ),
      outerSleeves: OuterSleeves,
    },
  },
  {
    id: 'cardigan',
    label: 'Кардиган',
    layers: {
      outer: () => (
        <OpenFront
          hem={590}
          collar="knit"
          extra={() => {
            const { c } = useAv();
            return (
              <g>
                <path className="st" stroke={c.outerLine} opacity={0.5} d="M 140 380 C 142 450, 140 520, 138 580" />
                <path className="st" stroke={c.outerLine} opacity={0.5} d="M 152 380 C 152 450, 152 520, 150 582" />
              </g>
            );
          }}
        />
      ),
      outerSleeves: OuterSleeves,
    },
  },
  {
    id: 'leather',
    label: 'Кожанка',
    layers: {
      outer: () => (
        <OpenFront
          hem={486}
          collar="leather"
          extra={() => {
            const { c } = useAv();
            return (
              <g>
                <path className="hl" fill="#ffffff" opacity={0.25} d="M 128 330 C 126 360, 128 400, 132 430 L 136 430 C 134 400, 132 360, 134 330 Z" />
                <path className="ln" d="M 168 360 L 166 486" />
                <rect className="o2" x={136} y={400} width={20} height={4} fill={c.accent} />
              </g>
            );
          }}
        />
      ),
      outerSleeves: OuterSleeves,
    },
  },
];

/* ================= Bottoms ================= */

function Pockets() {
  const { c } = useAv();
  return (
    <Sym>
      <path className="st" stroke={c.bottomLine} d={POCKET_SLIT} />
    </Sym>
  );
}

function Pants({ d, extra }: { d: string; extra?: FC }) {
  const { c } = useAv();
  const X = extra;
  return (
    <g>
      <path className="o" fill={c.bottom} d={d} />
      <path className="st" stroke={c.bottomLine} d="M 136 488 L 264 488" />
      <Pockets />
      {X && <X />}
    </g>
  );
}

export const BOTTOMS: PartOption[] = [
  {
    id: 'joggers',
    label: 'Джоггеры',
    layers: {
      bottom: () => (
        <Pants
          d="M 136 472 L 264 472 C 270 540, 274 620, 270 700 C 268 760, 262 810, 258 852 L 212 852 C 210 780, 206 690, 202 600 L 198 600 C 194 690, 190 780, 188 852 L 142 852 C 138 810, 132 760, 130 700 C 126 620, 130 540, 136 472 Z"
          extra={() => {
            const { c } = useAv();
            return (
              <g>
                <Sym>
                  <path className="o" fill={c.bottomSh} d="M 142 850 L 188 850 C 190 860, 189 868, 186 874 L 146 874 C 142 868, 141 860, 142 850 Z" />
                  <path className="sh" fill={c.bottomSh} d="M 136 520 C 132 600, 134 700, 142 846 L 156 846 C 150 760, 146 640, 150 520 Z" />
                  <path className="st" stroke={c.bottomLine} d="M 160 640 C 170 680, 168 740, 164 800" />
                  <path className="st" stroke={c.bottomLine} d="M 176 760 C 172 790, 178 820, 174 846" />
                </Sym>
                <path className="ln" d="M 196 488 L 192 516" />
                <path className="ln" d="M 204 488 L 208 516" />
              </g>
            );
          }}
        />
      ),
    },
  },
  {
    id: 'wide',
    label: 'Широкие джинсы',
    layers: {
      bottom: () => (
        <Pants
          d="M 136 472 L 264 472 C 274 560, 284 700, 292 902 L 208 904 C 206 800, 204 690, 201 600 L 199 600 C 196 690, 194 800, 192 904 L 108 902 C 116 700, 126 560, 136 472 Z"
          extra={() => {
            const { c } = useAv();
            return (
              <g>
                <Sym>
                  <path className="sh" fill={c.bottomSh} d="M 134 520 C 126 620, 118 760, 112 900 L 128 900 C 132 760, 138 640, 146 520 Z" />
                  <path className="st" stroke={c.bottomLine} d="M 162 620 C 160 700, 156 800, 150 900" />
                  <path className="st" stroke={c.bottomLine} opacity={0.6} d="M 120 860 C 140 868, 170 868, 190 862" />
                  <rect className="o2" x={152} y={470} width={6} height={22} fill={c.bottom} />
                </Sym>
                <path className="st" stroke={c.bottomLine} d="M 200 488 C 200 540, 198 570, 192 594" />
              </g>
            );
          }}
        />
      ),
    },
  },
  {
    id: 'cargo',
    label: 'Карго',
    layers: {
      bottom: () => (
        <Pants
          d="M 136 472 L 264 472 C 272 560, 276 700, 280 880 L 210 882 C 208 790, 205 690, 201 600 L 199 600 C 195 690, 192 790, 190 882 L 120 880 C 124 700, 128 560, 136 472 Z"
          extra={() => {
            const { c } = useAv();
            return (
              <Sym>
                <path className="o2" fill={c.bottom} d="M 124 640 L 154 642 L 152 712 L 124 710 Z" />
                <path className="o2" fill={c.bottomSh} d="M 123 640 L 155 642 L 155 656 L 123 654 Z" />
                <path className="sh" fill={c.bottomSh} d="M 134 520 C 128 640, 124 760, 122 878 L 136 878 C 138 760, 142 640, 148 520 Z" />
                <path className="st" stroke={c.bottomLine} d="M 170 740 C 168 790, 166 840, 164 878" />
              </Sym>
            );
          }}
        />
      ),
    },
  },
  {
    id: 'shorts',
    label: 'Шорты',
    layers: {
      bottom: () => (
        <Pants
          d="M 136 472 L 264 472 C 272 540, 282 600, 286 666 L 206 670 C 204 632, 202 612, 200 598 C 198 612, 196 632, 194 670 L 114 666 C 118 600, 128 540, 136 472 Z"
          extra={() => {
            const { c } = useAv();
            return (
              <Sym>
                <path className="sh" fill={c.bottomSh} d="M 132 520 C 126 580, 120 630, 118 664 L 134 664 C 136 630, 140 580, 146 520 Z" />
                <path className="st" stroke={c.bottomLine} d="M 160 600 C 158 620, 156 640, 156 666" />
              </Sym>
            );
          }}
        />
      ),
    },
  },
  {
    id: 'skirt',
    label: 'Юбка',
    layers: {
      bottom: () => {
        const { c } = useAv();
        return (
          <g>
            <path className="o" fill={c.bottom} d="M 138 470 L 262 470 L 294 630 C 240 642, 160 642, 106 630 Z" />
            <path className="st" stroke={c.bottomLine} d="M 138 488 L 262 488" />
            {[150, 172, 200, 228, 250].map((x) => (
              <path key={x} className="st" stroke={c.bottomLine} d={`M ${x} 490 L ${x + (x - 200) * 0.45} 636`} />
            ))}
            <path className="sh" fill={c.bottomSh} d="M 138 490 L 106 630 L 124 634 L 150 490 Z" />
          </g>
        );
      },
    },
  },
];

/* ================= Shoes ================= */

function Socks() {
  return (
    <Sym>
      <path className="o2" fill="#f2eee8" d="M 156 818 L 188 818 L 188 862 L 156 862 Z" />
      <path className="ln" opacity={0.35} d="M 160 822 L 160 834" />
      <path className="ln" opacity={0.35} d="M 172 822 L 172 834" />
      <path className="ln" opacity={0.35} d="M 184 822 L 184 834" />
    </Sym>
  );
}

export const SHOES: PartOption[] = [
  {
    id: 'sneakers',
    label: 'Кроссовки',
    layers: {
      shoes: () => {
        const { c } = useAv();
        return (
          <g>
            <Socks />
            <Sym>
              <path className="o" fill={c.shoesSh} d="M 158 854 L 160 842 L 186 842 L 188 854 Z" />
              <path className="o" fill={c.shoes} d="M 154 852 C 150 870, 140 888, 138 902 C 136 916, 150 922, 172 922 C 192 922, 200 914, 196 900 C 194 884, 190 868, 188 852 Z" />
              <path className="o2" fill={c.sole} d="M 148 884 C 160 880, 170 882, 176 890 C 166 892, 154 892, 146 896 Z" />
              <path className="o" fill={c.sole} d="M 134 904 C 132 916, 136 932, 146 934 L 194 934 C 202 932, 204 916, 200 904 C 180 912, 156 912, 134 904 Z" />
              <path className="ln" opacity={0.6} d="M 136 920 C 160 924, 182 924, 202 920" />
              <path className="ln" d="M 162 866 L 182 868" />
              <path className="ln" d="M 160 876 L 184 878" />
            </Sym>
          </g>
        );
      },
    },
  },
  {
    id: 'hightops',
    label: 'Кеды',
    layers: {
      shoes: () => {
        const { c } = useAv();
        return (
          <Sym>
            <path className="o" fill={c.shoes} d="M 154 812 L 190 812 C 192 850, 194 880, 198 902 L 136 902 C 142 880, 150 850, 154 812 Z" />
            <circle className="o2" cx={160} cy={862} r={5} fill={c.sole} />
            <path className="ln" d="M 166 828 L 182 828" />
            <path className="ln" d="M 164 844 L 184 844" />
            <path className="ln" d="M 162 860 L 186 860" />
            <path className="o" fill={c.sole} d="M 134 900 L 200 900 C 204 912, 202 924, 196 928 L 140 928 C 132 924, 130 912, 134 900 Z" />
            <path className="o2" fill={c.sole} d="M 140 902 C 150 896, 162 896, 172 904 L 170 914 L 138 914 Z" />
            <path className="ln" d="M 134 912 L 202 912" />
          </Sym>
        );
      },
    },
  },
  {
    id: 'boots',
    label: 'Ботинки',
    layers: {
      shoes: () => {
        const { c } = useAv();
        return (
          <Sym>
            <path className="o" fill={c.shoes} d="M 150 800 L 194 800 C 196 840, 198 880, 202 906 L 132 906 C 138 880, 146 840, 150 800 Z" />
            <path className="o2" fill={c.shoesSh} d="M 150 800 L 194 800 L 194 812 L 150 812 Z" />
            <path className="ln" d="M 166 820 L 180 826 M 164 836 L 182 842 M 162 852 L 184 858" />
            <path className="o" fill="#2a2427" d="M 128 904 L 206 904 C 210 918, 208 930, 202 936 L 134 936 C 126 930, 124 918, 128 904 Z" />
            <path className="hl" fill="#ffffff" opacity={0.25} d="M 154 830 L 158 830 L 154 890 L 150 890 Z" />
          </Sym>
        );
      },
    },
  },
];
