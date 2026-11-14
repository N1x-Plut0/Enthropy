import { useCallback, useRef, useState } from 'react';
import { FORMATS, PALETTES, ZONES, type Character, type Format, type Zone } from '../model/character';
import { useBase, useBaseIndex } from '../render/bases';
import { downloadPNG, downloadSVG } from '../render/export';
import { TracedAvatar } from '../render/TracedAvatar';
import { ColorRow } from './ColorRow';

interface Props {
  ch: Character;
  update: (fn: (c: Character) => Character) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => void;
  onNew: () => void;
  format: Format;
  setFormat: (f: Format) => void;
}

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

export function Editor({ ch, update, undo, redo, canUndo, canRedo, onSave, onNew, format, setFormat }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [busy, setBusy] = useState(false);
  const bases = useBaseIndex();
  const data = useBase(ch.base);

  const onColor = useCallback(
    (z: Zone, v: string | undefined) =>
      update((c) => {
        const colors = { ...c.colors };
        if (v) colors[z] = v;
        else delete colors[z];
        return { ...c, colors };
      }),
    [update],
  );

  const randomColors = () =>
    update((c) => {
      const colors: Character['colors'] = {};
      for (const z of ZONES) if (Math.random() < 0.8) colors[z.id] = pick(PALETTES[z.id]);
      return { ...c, colors };
    });

  const exportPng = async () => {
    if (!svgRef.current) return;
    setBusy(true);
    try {
      await downloadPNG(svgRef.current, `${ch.name}-${format}`);
    } catch (e) {
      alert(String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="editor">
      <section className="stage card">
        <input
          className="name-input"
          value={ch.name}
          onChange={(e) => update((c) => ({ ...c, name: e.target.value }))}
          aria-label="Имя персонажа"
          maxLength={60}
        />
        <div className="seg" role="radiogroup" aria-label="Формат">
          {FORMATS.map((f) => (
            <button key={f.id} type="button" role="radio" aria-checked={format === f.id} className={format === f.id ? 'is-on' : ''} onClick={() => setFormat(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <div className={`canvas-wrap is-${format}`}>
          <TracedAvatar ch={ch} format={format} svgRef={svgRef} />
        </div>
        <div className="actions">
          <button type="button" className="btn" onClick={randomColors}>
            🎲 Случайные цвета
          </button>
          <button type="button" className="btn icon" onClick={undo} disabled={!canUndo} title="Отменить" aria-label="Отменить">
            ↶
          </button>
          <button type="button" className="btn icon" onClick={redo} disabled={!canRedo} title="Повторить" aria-label="Повторить">
            ↷
          </button>
          <button type="button" className="btn primary" onClick={onSave}>
            Сохранить
          </button>
          <button type="button" className="btn" onClick={exportPng} disabled={busy || !data}>
            {busy ? '…' : 'PNG'}
          </button>
          <button type="button" className="btn" disabled={!data} onClick={() => svgRef.current && downloadSVG(svgRef.current, `${ch.name}-${format}`)}>
            SVG
          </button>
          <button type="button" className="btn ghost" onClick={onNew}>
            + Новый
          </button>
        </div>
      </section>

      <section className="panel card">
        <div className="panel-body">
          <div className="slot">
            <h3>Персонаж</h3>
            <div className="base-grid">
              {bases.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`part ${ch.base === b.id ? 'is-selected' : ''}`}
                  onClick={() => update((c) => ({ ...c, base: b.id }))}
                >
                  <span className="part-thumb">
                    <TracedAvatar ch={{ ...ch, base: b.id }} format="portrait" />
                  </span>
                  <span className="part-label">{b.name}</span>
                </button>
              ))}
            </div>
          </div>
          {ZONES.map((z) => (
            <ColorRow key={z.id} zone={z.id} label={z.label} value={ch.colors[z.id]} original={data?.base[z.id]} onChange={onColor} />
          ))}
        </div>
      </section>
    </div>
  );
}
