import { useEffect, useState } from 'react';

export interface BaseData {
  id: string;
  name: string;
  w: number;
  h: number;
  /** portrait crop: x, y, w, h */
  face: [number, number, number, number];
  zones: string[];
  /** original dominant colour of each recolourable zone */
  base: Record<string, string>;
  /** [d, translateX, translateY, fill, zoneIndex] */
  paths: [string, number, number, string, number][];
}

export interface BaseInfo {
  id: string;
  name: string;
}

const url = (p: string) => `${import.meta.env.BASE_URL}bases/${p}`;
const cache = new Map<string, Promise<BaseData>>();
let indexP: Promise<BaseInfo[]> | null = null;

export function loadIndex(): Promise<BaseInfo[]> {
  indexP ??= fetch(url('index.json')).then((r) => {
    if (!r.ok) throw new Error('Не удалось загрузить список баз');
    return r.json();
  });
  return indexP;
}

export function loadBase(id: string): Promise<BaseData> {
  let p = cache.get(id);
  if (!p) {
    p = fetch(url(`${id}.json`)).then((r) => {
      if (!r.ok) throw new Error(`Не удалось загрузить базу ${id}`);
      return r.json();
    });
    cache.set(id, p);
  }
  return p;
}

export function useBase(id: string): BaseData | null {
  const [data, setData] = useState<BaseData | null>(null);
  useEffect(() => {
    let alive = true;
    setData(null);
    loadBase(id)
      .then((d) => alive && setData(d))
      .catch(() => alive && setData(null));
    return () => {
      alive = false;
    };
  }, [id]);
  return data;
}

export function useBaseIndex(): BaseInfo[] {
  const [list, setList] = useState<BaseInfo[]>([]);
  useEffect(() => {
    loadIndex().then(setList).catch(() => setList([]));
  }, []);
  return list;
}
