import type { Colors, Parts } from '../model/character';
import { ACCESSORIES, BG_PATTERNS } from './accessories';
import { FACES } from './body';
import { BOTTOMS, OUTERS, SHOES, TOPS } from './clothes';
import { BROWS, CHEEKS, EYES, MOUTHS, NOSES } from './face';
import { BANGS, HAIRSTYLES, STREAKS } from './hair';
import type { PartOption } from './types';

export interface Slot {
  key: keyof Parts;
  label: string;
  options: PartOption[];
  multi?: boolean;
}

export interface Category {
  id: string;
  label: string;
  slots: Slot[];
  colors: (keyof Colors)[];
  /** viewBox used for option thumbnails */
  focus: string;
}

export const CATEGORIES: Category[] = [
  { id: 'face', label: 'Лицо', slots: [{ key: 'face', label: 'Форма лица', options: FACES }], colors: ['skin'], focus: '121 89 158 167' },
  { id: 'eyes', label: 'Глаза', slots: [{ key: 'eyes', label: 'Глаза', options: EYES }], colors: ['eyes'], focus: '150 159 100 50' },
  { id: 'brows', label: 'Брови', slots: [{ key: 'brows', label: 'Брови', options: BROWS }], colors: ['hair'], focus: '150 149 100 58' },
  { id: 'nose', label: 'Нос', slots: [{ key: 'nose', label: 'Нос', options: NOSES }], colors: ['skin'], focus: '170 181 61 53' },
  { id: 'mouth', label: 'Рот', slots: [{ key: 'mouth', label: 'Рот', options: MOUTHS }], colors: ['skin'], focus: '174 200 52 38' },
  { id: 'cheeks', label: 'Щёки', slots: [{ key: 'cheeks', label: 'Щёки', options: CHEEKS }], colors: ['skin'], focus: '139 165 122 76' },
  {
    id: 'hair',
    label: 'Причёска',
    slots: [
      { key: 'hair', label: 'Причёска', options: HAIRSTYLES },
      { key: 'streak', label: 'Окрашивание', options: STREAKS },
    ],
    colors: ['hair', 'streak'],
    focus: '80 50 260 440',
  },
  { id: 'bangs', label: 'Чёлка', slots: [{ key: 'bangs', label: 'Чёлка', options: BANGS }], colors: ['hair'], focus: '124 89 152 160' },
  { id: 'top', label: 'Верх', slots: [{ key: 'top', label: 'Верх', options: TOPS }], colors: ['top', 'accent'], focus: '60 220 280 380' },
  { id: 'outer', label: 'Куртки', slots: [{ key: 'outer', label: 'Верхняя одежда', options: OUTERS }], colors: ['outer'], focus: '50 220 300 430' },
  { id: 'bottom', label: 'Низ', slots: [{ key: 'bottom', label: 'Низ', options: BOTTOMS }], colors: ['bottom'], focus: '40 440 320 620' },
  { id: 'shoes', label: 'Обувь', slots: [{ key: 'shoes', label: 'Обувь', options: SHOES }], colors: ['shoes'], focus: '100 850 200 200' },
  {
    id: 'acc',
    label: 'Аксессуары',
    slots: [{ key: 'accessories', label: 'Аксессуары (можно несколько)', options: ACCESSORIES, multi: true }],
    colors: ['accent'],
    focus: '70 50 260 520',
  },
  { id: 'bg', label: 'Фон', slots: [{ key: 'bgPattern', label: 'Узор', options: BG_PATTERNS }], colors: ['bg'], focus: '0 0 400 400' },
];

export const ALL_SLOTS: Slot[] = CATEGORIES.flatMap((c) => c.slots);

export function slotOf(key: keyof Parts): Slot | undefined {
  return ALL_SLOTS.find((s) => s.key === key);
}
