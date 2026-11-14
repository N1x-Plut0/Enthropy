import { useCallback, useRef, useState } from 'react';
import {
  EXPRESSIONS,
  FORMATS,
  POSES,
  STYLES,
  type Character,
  type Colors,
  type Format,
  type Parts,
} from '../model/character';
import { randomize } from '../model/random';
import { CATEGORIES } from '../parts/registry';
import { Avatar } from '../render/Avatar';
import { downloadPNG, downloadSVG } from '../render/export';
import { ColorRow } from './ColorRow';
import { PartGrid } from './PartGrid';

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

function Seg<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          role="radio"
          aria-checked={value === it.id}
          className={value === it.id ? 'is-on' : ''}
          onClick={() => onChange(it.id)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export function Editor({ ch, update, undo, redo, canUndo, canRedo, onSave, onNew, format, setFormat }: Props) {
  const [catId, setCatId] = useState(CATEGORIES[0].id);
  const cat = CATEGORIES.find((c) => c.id === catId) ?? CATEGORIES[0];
  const svgRef = useRef<SVGSVGElement>(null);
  const [busy, setBusy] = useState(false);

  const onPick = useCallback(
    (key: keyof Parts, id: string) =>
      update((c) => {
        const v = c.parts[key];
        if (Array.isArray(v)) {
          const next = v.includes(id) ? v.filter((x) => x !== id) : [...v, id];
          return { ...c, parts: { ...c.parts, [key]: next } };
        }
        return { ...c, parts: { ...c.parts, [key]: id } };
      }),
    [update],
  );

  const onColor = useCallback(
    (k: keyof Colors, v: string) => update((c) => ({ ...c, colors: { ...c.colors, [k]: v } })),
    [update],
  );

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
        <div className="stage-toggles">
          <Seg label="Формат" items={FORMATS} value={format} onChange={setFormat} />
          <Seg label="Стиль" items={STYLES} value={ch.style} onChange={(s) => update((c) => ({ ...c, style: s }))} />
        </div>
        <div className={`canvas-wrap is-${format}`}>
          <Avatar ch={ch} format={format} svgRef={svgRef} />
        </div>
        <div className="chips-block">
          {format === 'full' && (
            <div className="chips">
              <span className="chips-label">Поза</span>
              {POSES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`chip ${ch.pose === p.id ? 'is-on' : ''}`}
                  onClick={() => update((c) => ({ ...c, pose: p.id }))}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <div className="chips">
            <span className="chips-label">Эмоция</span>
            {EXPRESSIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`chip ${ch.expression === p.id ? 'is-on' : ''}`}
                onClick={() => update((c) => ({ ...c, expression: p.id }))}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="actions">
          <button type="button" className="btn" onClick={() => update(randomize)}>
            🎲 Случайно
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
          <button type="button" className="btn" onClick={exportPng} disabled={busy}>
            {busy ? '…' : 'PNG'}
          </button>
          <button type="button" className="btn" onClick={() => svgRef.current && downloadSVG(svgRef.current, `${ch.name}-${format}`)}>
            SVG
          </button>
          <button type="button" className="btn ghost" onClick={onNew}>
            + Новый
          </button>
        </div>
      </section>

      <section className="panel card">
        <nav className="cats" aria-label="Категории">
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className={`cat ${c.id === catId ? 'is-on' : ''}`} onClick={() => setCatId(c.id)}>
              {c.label}
            </button>
          ))}
        </nav>
        <div className="panel-body">
          {cat.slots.map((slot) => (
            <div key={slot.key} className="slot">
              {cat.slots.length > 1 || slot.multi ? <h3>{slot.label}</h3> : null}
              <PartGrid ch={ch} cat={cat} slot={slot} onPick={onPick} />
            </div>
          ))}
          {cat.colors.map((k) => (
            <ColorRow key={k} k={k} value={ch.colors[k]} onChange={onColor} />
          ))}
        </div>
      </section>
    </div>
  );
}
