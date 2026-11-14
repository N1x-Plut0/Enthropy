import { useRef } from 'react';
import { newId, normalize, type Character } from '../model/character';
import { Avatar } from '../render/Avatar';
import { downloadJSON } from '../render/export';

interface Props {
  items: Character[];
  currentId: string;
  onOpen: (c: Character) => void;
  onDuplicate: (c: Character) => void;
  onDelete: (c: Character) => void;
  onImport: (cs: Character[]) => void;
}

export function Gallery({ items, currentId, onOpen, onDuplicate, onDelete, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const importFile = async (f: File) => {
    try {
      const data = JSON.parse(await f.text());
      const arr: unknown[] = Array.isArray(data) ? data : Array.isArray(data?.characters) ? data.characters : [data];
      const chars = arr
        .filter((x): x is Partial<Character> => !!x && typeof x === 'object')
        .map((x) => normalize({ ...x, id: x.id || newId() }));
      if (!chars.length) throw new Error('В файле нет персонажей');
      onImport(chars);
    } catch (e) {
      alert(`Не получилось импортировать: ${e instanceof Error ? e.message : e}`);
    }
  };

  return (
    <div className="gallery">
      <div className="gallery-head">
        <h2>Мои персонажи</h2>
        <div className="actions">
          <button
            type="button"
            className="btn"
            disabled={!items.length}
            onClick={() => downloadJSON({ app: 'enthropy', version: 1, characters: items }, 'enthropy-characters.json')}
          >
            Экспорт всех (JSON)
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            Импорт
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importFile(f);
              e.target.value = '';
            }}
          />
        </div>
      </div>
      {items.length === 0 ? (
        <p className="empty">
          Пока пусто. Собери персонажа в редакторе и нажми «Сохранить» — он появится здесь.
          <br />
          Персонажи хранятся в этом браузере; для переноса на другое устройство используй экспорт/импорт.
        </p>
      ) : (
        <div className="gallery-grid">
          {items.map((c) => (
            <article key={c.id} className={`g-card card ${c.id === currentId ? 'is-current' : ''}`}>
              <button type="button" className="g-thumb" onClick={() => onOpen(c)} aria-label={`Открыть ${c.name}`}>
                <Avatar ch={c} format="portrait" />
              </button>
              <div className="g-meta">
                <strong>{c.name}</strong>
                <span>{new Date(c.updatedAt).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="g-actions">
                <button type="button" className="btn small" onClick={() => onOpen(c)}>
                  Открыть
                </button>
                <button type="button" className="btn small" onClick={() => onDuplicate(c)}>
                  Копия
                </button>
                <button
                  type="button"
                  className="btn small danger"
                  onClick={() => confirm(`Удалить «${c.name}»?`) && onDelete(c)}
                >
                  Удалить
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
