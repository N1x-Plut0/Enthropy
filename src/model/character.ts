export type Format = 'full' | 'portrait';
export type Zone = 'hair' | 'skin' | 'top' | 'bottom' | 'shoes' | 'bg';

export const ZONES: { id: Zone; label: string }[] = [
  { id: 'hair', label: 'Волосы' },
  { id: 'skin', label: 'Кожа' },
  { id: 'top', label: 'Верх' },
  { id: 'bottom', label: 'Низ' },
  { id: 'shoes', label: 'Обувь' },
  { id: 'bg', label: 'Фон' },
];

export const FORMATS: { id: Format; label: string }[] = [
  { id: 'full', label: 'В полный рост' },
  { id: 'portrait', label: 'Лицо' },
];

export interface Character {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  /** id of the traced base drawing (public/bases/<id>.json) */
  base: string;
  /** target colour per zone; a missing zone keeps the original drawing colour */
  colors: Partial<Record<Zone, string>>;
}

export const PALETTES: Record<Zone, string[]> = {
  hair: ['#2a2220', '#4a3630', '#6b4b3a', '#846b5d', '#a3825f', '#c9a46c', '#e3cf9c', '#d9d3cb', '#8e8b93', '#6b3f4c', '#a24d48', '#c98aa0', '#3b4766', '#557993', '#6f8a6a'],
  skin: ['#f7e3d6', '#efd2bf', '#e2bca4', '#bb9d89', '#c9a07c', '#a8805e', '#80593f', '#5a3c2b'],
  top: ['#f2ede4', '#d9cfbf', '#b5a58c', '#8b7a6a', '#574843', '#3a3336', '#232022', '#a9b6c4', '#5d7690', '#34405a', '#b4bfa4', '#6e7f5e', '#d8b4b8', '#a05a58', '#6a4a6a'],
  bottom: ['#f2ede4', '#c8b89e', '#8b7a6a', '#4d3939', '#3a3336', '#232022', '#a9b6c4', '#5d7690', '#34405a', '#6e7f5e', '#7a3f48', '#6a4a6a'],
  shoes: ['#f2ede4', '#c8b89e', '#493736', '#232022', '#5d7690', '#a05a58', '#d8b4b8', '#6e7f5e'],
  bg: ['#715c5c', '#544e3c', '#6e6a78', '#3b4458', '#2f2b33', '#8a7a6a', '#f3ece0', '#efe6ef', '#dde6ef', '#e2ebe4'],
};

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function defaultCharacter(base = 'r1'): Character {
  const now = Date.now();
  return { id: newId(), name: 'Новый персонаж', createdAt: now, updatedAt: now, base, colors: {} };
}

/** Fill in missing fields; drops data from the old part-based format. */
export function normalize(raw: Partial<Character>): Character {
  const d = defaultCharacter();
  const colors: Partial<Record<Zone, string>> = {};
  const rc = (raw.colors ?? {}) as Record<string, unknown>;
  for (const z of ZONES) if (typeof rc[z.id] === 'string') colors[z.id] = rc[z.id] as string;
  return {
    id: raw.id || d.id,
    name: raw.name || d.name,
    createdAt: raw.createdAt ?? d.createdAt,
    updatedAt: raw.updatedAt ?? d.updatedAt,
    base: typeof raw.base === 'string' ? raw.base : d.base,
    colors,
  };
}
