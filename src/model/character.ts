export type StyleId = 'clean' | 'sketch';
export type Format = 'full' | 'portrait';
export type Pose = 'stand' | 'pockets';
export type Expression = 'neutral' | 'smile' | 'happy' | 'wink' | 'pout' | 'surprised' | 'sad';

export interface Parts {
  face: string;
  eyes: string;
  brows: string;
  nose: string;
  mouth: string;
  cheeks: string;
  hair: string;
  streak: string;
  bangs: string;
  top: string;
  outer: string;
  bottom: string;
  shoes: string;
  accessories: string[];
  bgPattern: string;
}

export interface Colors {
  skin: string;
  hair: string;
  streak: string;
  eyes: string;
  top: string;
  outer: string;
  bottom: string;
  shoes: string;
  accent: string;
  bg: string;
}

export interface Character {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  style: StyleId;
  pose: Pose;
  expression: Expression;
  parts: Parts;
  colors: Colors;
}

export const STYLES: { id: StyleId; label: string }[] = [
  { id: 'clean', label: 'Чистый лайн' },
  { id: 'sketch', label: 'Скетч' },
];

export const FORMATS: { id: Format; label: string }[] = [
  { id: 'full', label: 'В полный рост' },
  { id: 'portrait', label: 'Лицо' },
];

export const POSES: { id: Pose; label: string }[] = [
  { id: 'pockets', label: 'Руки в карманах' },
  { id: 'stand', label: 'Стоит' },
];

export const EXPRESSIONS: { id: Expression; label: string }[] = [
  { id: 'neutral', label: 'Спокойная' },
  { id: 'smile', label: 'Улыбка' },
  { id: 'happy', label: 'Радость' },
  { id: 'wink', label: 'Подмигивает' },
  { id: 'pout', label: 'Дуется' },
  { id: 'surprised', label: 'Удивление' },
  { id: 'sad', label: 'Грусть' },
];

export const PALETTES: Record<keyof Colors, string[]> = {
  skin: ['#fdeee4', '#f7dccb', '#f0cdb4', '#e4b896', '#cf9a76', '#a87454', '#7d523b', '#573829'],
  hair: [
    '#26201f', '#45332f', '#6b4a38', '#93694b', '#b98f62', '#d9b57f', '#ecd9a8', '#d9d3cb',
    '#8e8b93', '#6b3f4c', '#a24d48', '#c98aa0', '#3b4766', '#557993', '#6f8a6a',
  ],
  streak: ['#3e5a9a', '#5b86b8', '#7a5aa6', '#c96a8a', '#d9a8c0', '#d65a4a', '#e9e1d4', '#6faa8c', '#e3c46a'],
  eyes: ['#2f241f', '#5e4130', '#8a643c', '#a8834e', '#5f7a4f', '#4a6e86', '#7f8fa8', '#9a5560', '#6b5a8a', '#3a3a3a'],
  top: [],
  outer: [],
  bottom: [],
  shoes: [],
  accent: ['#c9a46c', '#d9d9d9', '#2b2427', '#e6e0d6', '#b5838d', '#7a96b8', '#a05a58', '#6e7f5e'],
  bg: ['#6e5c63', '#5c5a4a', '#8a7a6a', '#f3ece0', '#efe6ef', '#e2ebe4', '#f4e0e0', '#dde6ef', '#2f2b33', '#3b4458'],
};

const CLOTHES = [
  '#f4efe6', '#e3d9c6', '#c8b89e', '#8b7a6a', '#5a4d48', '#3a3336', '#242124',
  '#a9b6c4', '#7891ad', '#4e6584', '#34405a', '#b4bfa4', '#6e7f5e',
  '#d8b4b8', '#b06a68', '#7a3f48', '#6a4a6a', '#c9a46c',
];
PALETTES.top = CLOTHES;
PALETTES.outer = CLOTHES;
PALETTES.bottom = CLOTHES;
PALETTES.shoes = CLOTHES;

export const COLOR_LABELS: Record<keyof Colors, string> = {
  skin: 'Кожа',
  hair: 'Волосы',
  streak: 'Окрашенные пряди',
  eyes: 'Глаза',
  top: 'Верх',
  outer: 'Верхняя одежда',
  bottom: 'Низ',
  shoes: 'Обувь',
  accent: 'Аксессуары / принт',
  bg: 'Фон',
};

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function defaultCharacter(): Character {
  const now = Date.now();
  return {
    id: newId(),
    name: 'Новый персонаж',
    createdAt: now,
    updatedAt: now,
    style: 'clean',
    pose: 'pockets',
    expression: 'neutral',
    parts: {
      face: 'soft',
      eyes: 'soft',
      brows: 'soft',
      nose: 'line',
      mouth: 'small',
      cheeks: 'blush',
      hair: 'bun',
      streak: 'none',
      bangs: 'curtain',
      top: 'tee',
      outer: 'none',
      bottom: 'joggers',
      shoes: 'sneakers',
      accessories: ['studs'],
      bgPattern: 'plain',
    },
    colors: {
      skin: '#f7dccb',
      hair: '#93694b',
      streak: '#3e5a9a',
      eyes: '#5e4130',
      top: '#5a4d48',
      outer: '#5a4d48',
      bottom: '#3a3336',
      shoes: '#3a3336',
      accent: '#c9a46c',
      bg: '#6e5c63',
    },
  };
}

/** Fill in any fields missing from older saved data. */
export function normalize(raw: Partial<Character>): Character {
  const d = defaultCharacter();
  return {
    ...d,
    ...raw,
    parts: { ...d.parts, ...(raw.parts ?? {}) },
    colors: { ...d.colors, ...(raw.colors ?? {}) },
  } as Character;
}
