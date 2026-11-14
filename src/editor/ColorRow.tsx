import { PALETTES, type Zone } from '../model/character';

interface Props {
  zone: Zone;
  label: string;
  value: string | undefined;
  original: string | undefined;
  onChange: (z: Zone, v: string | undefined) => void;
}

export function ColorRow({ zone, label, value, original, onChange }: Props) {
  const v = value?.toLowerCase();
  const inPalette = !v || PALETTES[zone].includes(v);
  return (
    <div className="color-row">
      <div className="color-title">{label}</div>
      <div className="swatches">
        <button
          type="button"
          className={`swatch swatch-orig ${!v ? 'is-selected' : ''}`}
          style={{ background: original }}
          title="Как на референсе"
          aria-label="Цвет как на референсе"
          onClick={() => onChange(zone, undefined)}
        >
          <span>↺</span>
        </button>
        {PALETTES[zone].map((col) => (
          <button
            key={col}
            type="button"
            className={`swatch ${col === v ? 'is-selected' : ''}`}
            style={{ background: col }}
            aria-label={col}
            onClick={() => onChange(zone, col)}
          />
        ))}
        <label className={`swatch swatch-custom ${inPalette ? '' : 'is-selected'}`} title="Свой цвет">
          <input type="color" value={value ?? original ?? '#888888'} onChange={(e) => onChange(zone, e.target.value)} />
          <span style={{ background: inPalette ? undefined : value }}>+</span>
        </label>
      </div>
    </div>
  );
}
