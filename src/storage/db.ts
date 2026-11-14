import { createStore, del, entries, get, set } from 'idb-keyval';
import { normalize, type Character } from '../model/character';

const store = createStore('enthropy', 'characters');

export async function listCharacters(): Promise<Character[]> {
  const all = await entries<string, Character>(store);
  return all.map(([, v]) => normalize(v)).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveCharacter(ch: Character): Promise<Character> {
  const saved = { ...ch, updatedAt: Date.now() };
  await set(saved.id, saved, store);
  return saved;
}

export async function getCharacter(id: string): Promise<Character | undefined> {
  const v = await get<Character>(id, store);
  return v ? normalize(v) : undefined;
}

export async function deleteCharacter(id: string): Promise<void> {
  await del(id, store);
}

/* ---- draft autosave (per-browser convenience) ---- */
const DRAFT_KEY = 'enthropy:draft';

export function loadDraft(): Character | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? normalize(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveDraft(ch: Character): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(ch));
  } catch {
    /* storage unavailable */
  }
}
