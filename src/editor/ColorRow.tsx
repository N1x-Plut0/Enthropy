import { COLOR_LABELS, PALETTES, type Colors } from '../model/character';

interface Props {
  k: keyof Colors;
  value: string;
  onChange: (k: keyof Colors, v: string) => void;
}

export function ColorRow({ k, value, onChange }: Props) {
  const inPalette = PALETTES[k].includes(value.toLowerCase());
  return (
    <div className="color-row">
      <div className="color-title">{COLOR_LABELS[k]}</div>
      <div className="swatches">
        {PALETTES[k].map((col) => (
          <button
            key={col}
            type="button"
            className={`swatch ${col === value.toLowerCase() ? 'is-selected' : ''}`}
            style={{ background: col }}
            aria-label={col}
            onClick={() => onChange(k, col)}
          />
        ))}
        <label className={`swatch swatch-custom ${inPalette ? '' : 'is-selected'}`} title="Свой цвет">
          <input type="color" value={value} onChange={(e) => onChange(k, e.target.value)} />
          <span style={{ background: inPalette ? undefined : value }}>+</span>
        </label>
      </div>
    </div>
  );
}
