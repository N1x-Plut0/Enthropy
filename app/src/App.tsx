import { useCallback, useEffect, useReducer, useState } from 'react';
import { Editor } from './editor/Editor';
import { Gallery } from './gallery/Gallery';
import { defaultCharacter, newId, type Character, type Format } from './model/character';
import { deleteCharacter, listCharacters, loadDraft, saveCharacter, saveDraft } from './storage/db';

interface Hist {
  ch: Character;
  past: Character[];
  future: Character[];
}
type Act =
  | { t: 'update'; fn: (c: Character) => Character }
  | { t: 'load'; ch: Character }
  | { t: 'undo' }
  | { t: 'redo' };

function reducer(s: Hist, a: Act): Hist {
  switch (a.t) {
    case 'update': {
      const next = a.fn(s.ch);
      if (next === s.ch) return s;
      return { ch: next, past: [...s.past, s.ch].slice(-100), future: [] };
    }
    case 'load':
      return { ch: a.ch, past: [], future: [] };
    case 'undo':
      if (!s.past.length) return s;
      return { ch: s.past[s.past.length - 1], past: s.past.slice(0, -1), future: [s.ch, ...s.future] };
    case 'redo':
      if (!s.future.length) return s;
      return { ch: s.future[0], past: [...s.past, s.ch], future: s.future.slice(1) };
  }
}

type Tab = 'editor' | 'gallery';

export default function App() {
  const [h, dispatch] = useReducer(reducer, null, () => ({ ch: loadDraft() ?? defaultCharacter(), past: [], future: [] }));
  const [tab, setTab] = useState<Tab>('editor');
  const [format, setFormat] = useState<Format>('full');
  const [saved, setSaved] = useState<Character[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = useCallback(() => {
    listCharacters()
      .then(setSaved)
      .catch(() => setSaved([]));
  }, []);
  useEffect(refresh, [refresh]);
  useEffect(() => saveDraft(h.ch), [h.ch]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || (e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        dispatch({ t: e.shiftKey ? 'redo' : 'undo' });
      } else if (e.key.toLowerCase() === 'y') {
        e.preventDefault();
        dispatch({ t: 'redo' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const update = useCallback((fn: (c: Character) => Character) => dispatch({ t: 'update', fn }), []);

  const onSave = async () => {
    try {
      const s = await saveCharacter(h.ch);
      dispatch({ t: 'load', ch: s });
      refresh();
      setToast(`«${s.name}» сохранён ✓`);
    } catch {
      setToast('Не удалось сохранить: браузер запретил хранилище');
    }
  };

  const open = (c: Character) => {
    dispatch({ t: 'load', ch: c });
    setTab('editor');
  };

  return (
    <div className="app">
      <header className="top">
        <div className="logo">
          Enthropy<span>креатор персонажей</span>
        </div>
        <nav className="tabs">
          <button type="button" className={tab === 'editor' ? 'is-on' : ''} onClick={() => setTab('editor')}>
            Редактор
          </button>
          <button type="button" className={tab === 'gallery' ? 'is-on' : ''} onClick={() => setTab('gallery')}>
            Галерея{saved.length ? ` · ${saved.length}` : ''}
          </button>
          <button type="button" disabled title="Следующий этап">
            Мудборды <em>скоро</em>
          </button>
        </nav>
      </header>
      <main>
        {tab === 'editor' ? (
          <Editor
            ch={h.ch}
            update={update}
            undo={() => dispatch({ t: 'undo' })}
            redo={() => dispatch({ t: 'redo' })}
            canUndo={h.past.length > 0}
            canRedo={h.future.length > 0}
            onSave={onSave}
            onNew={() => dispatch({ t: 'load', ch: defaultCharacter() })}
            format={format}
            setFormat={setFormat}
          />
        ) : (
          <Gallery
            items={saved}
            currentId={h.ch.id}
            onOpen={open}
            onDuplicate={async (c) => {
              await saveCharacter({ ...c, id: newId(), name: `${c.name} (копия)`, createdAt: Date.now() });
              refresh();
            }}
            onDelete={async (c) => {
              await deleteCharacter(c.id);
              refresh();
            }}
            onImport={async (cs) => {
              for (const c of cs) await saveCharacter(c);
              refresh();
              setToast(`Импортировано: ${cs.length}`);
            }}
          />
        )}
      </main>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
