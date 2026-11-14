import { memo, useMemo, type Ref } from 'react';
import type { Character, Format } from '../model/character';
import { useBase } from './bases';
import { recolor } from './color';

interface Props {
  ch: Character;
  format?: Format;
  svgRef?: Ref<SVGSVGElement>;
  className?: string;
}

function TracedAvatarInner({ ch, format = 'full', svgRef, className }: Props) {
  const data = useBase(ch.base);

  const fills = useMemo(() => {
    if (!data) return [];
    const memo = new Map<string, string>();
    return data.paths.map(([, , , fill, zi]) => {
      const zone = data.zones[zi];
      const target = ch.colors[zone as keyof Character['colors']];
      const orig = data.base[zone];
      if (!target || !orig) return fill;
      const key = `${fill}|${zone}`;
      let out = memo.get(key);
      if (!out) {
        out = recolor(fill, orig, target);
        memo.set(key, out);
      }
      return out;
    });
  }, [data, ch.colors]);

  if (!data) {
    return <div className={`av-loading ${className ?? ''}`} aria-busy="true" />;
  }
  const vb = format === 'portrait' ? data.face.join(' ') : `0 0 ${data.w} ${data.h}`;
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={vb}
      className={`av ${className ?? ''}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={ch.name}
    >
      {data.paths.map(([d, tx, ty], i) => (
        <path key={i} d={d} fill={fills[i]} transform={tx || ty ? `translate(${tx},${ty})` : undefined} />
      ))}
    </svg>
  );
}

export const TracedAvatar = memo(TracedAvatarInner);
