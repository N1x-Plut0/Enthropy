import { memo, useMemo } from 'react';
import type { Character, Parts } from '../model/character';
import type { Category, Slot } from '../parts/registry';
import { Avatar } from '../render/Avatar';

interface Props {
  ch: Character;
  cat: Category;
  slot: Slot;
  onPick: (key: keyof Parts, id: string) => void;
}

function thumbChar(ch: Character, cat: Category, slot: Slot, id: string): Character {
  const parts: Parts = { ...ch.parts };
  if (cat.id !== 'acc') parts.accessories = [];
  if (cat.id !== 'outer') parts.outer = 'none';
  if (slot.multi) parts.accessories = [id];
  else (parts[slot.key] as string) = id;
  const neutral = cat.id === 'eyes' || cat.id === 'mouth' || cat.id === 'brows';
  return { ...ch, parts, style: 'clean', expression: neutral ? 'neutral' : ch.expression };
}

function PartGridInner({ ch, cat, slot, onPick }: Props) {
  const value = ch.parts[slot.key];
  const thumbs = useMemo(
    () => slot.options.map((o) => ({ o, tc: thumbChar(ch, cat, slot, o.id) })),
    [ch.parts, ch.colors, ch.pose, ch.expression, cat, slot],
  );
  return (
    <div className="part-grid" role="listbox" aria-label={slot.label} aria-multiselectable={slot.multi}>
      {thumbs.map(({ o, tc }) => {
        const selected = Array.isArray(value) ? value.includes(o.id) : value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`part ${selected ? 'is-selected' : ''}`}
            onClick={() => onPick(slot.key, o.id)}
            title={o.label}
          >
            <span className="part-thumb">
              <Avatar ch={tc} viewBox={cat.focus} style="clean" />
            </span>
            <span className="part-label">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export const PartGrid = memo(PartGridInner);
