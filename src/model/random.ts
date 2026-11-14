import { CATEGORIES } from '../parts/registry';
import { EXPRESSIONS, PALETTES, POSES, type Character, type Colors, type Parts } from './character';

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

const EXCLUSIVE = [['headphones', 'catears'], ['studs', 'hoops'], ['choker', 'necklace']];

export function randomize(ch: Character): Character {
  const parts = { ...ch.parts } as Parts;
  for (const cat of CATEGORIES) {
    for (const slot of cat.slots) {
      if (slot.multi) {
        const pool = slot.options.map((o) => o.id).filter((id) => id !== 'tote' || Math.random() < 0.5);
        const n = Math.floor(Math.random() * 3);
        const chosen: string[] = [];
        while (chosen.length < n && pool.length) {
          const id = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
          const clash = EXCLUSIVE.some((g) => g.includes(id) && g.some((x) => chosen.includes(x)));
          if (!clash) chosen.push(id);
        }
        parts.accessories = chosen;
      } else {
        (parts[slot.key] as string) = pick(slot.options).id;
      }
    }
  }
  if (Math.random() < 0.6) parts.streak = 'none';
  if (Math.random() < 0.55) parts.outer = 'none';
  if (Math.random() < 0.6) parts.bgPattern = 'plain';

  const colors = { ...ch.colors } as Colors;
  (Object.keys(colors) as (keyof Colors)[]).forEach((k) => {
    colors[k] = pick(PALETTES[k]);
  });

  return {
    ...ch,
    parts,
    colors,
    pose: pick(POSES).id,
    expression: Math.random() < 0.5 ? 'neutral' : pick(EXPRESSIONS).id,
  };
}
