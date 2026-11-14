function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function serialize(svg: SVGSVGElement, width: number, height: number): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return new XMLSerializer().serializeToString(clone);
}

function sizeFor(svg: SVGSVGElement, longSide: number): [number, number] {
  const vb = svg.viewBox.baseVal;
  const s = longSide / Math.max(vb.width, vb.height);
  return [Math.round(vb.width * s), Math.round(vb.height * s)];
}

export function safeName(name: string): string {
  return (name.trim() || 'character').replace(/[\\/:*?"<>|]+/g, '_').slice(0, 60);
}

export function downloadSVG(svg: SVGSVGElement, name: string) {
  const [w, h] = sizeFor(svg, 1000);
  download(new Blob([serialize(svg, w, h)], { type: 'image/svg+xml' }), `${safeName(name)}.svg`);
}

export async function svgToPngBlob(svg: SVGSVGElement, longSide = 1800): Promise<Blob> {
  const [w, h] = sizeFor(svg, longSide);
  const url = URL.createObjectURL(new Blob([serialize(svg, w, h)], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('Не удалось отрисовать картинку'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas недоступен');
    ctx.drawImage(img, 0, 0, w, h);
    return await new Promise<Blob>((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error('PNG не создан'))), 'image/png'),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function downloadPNG(svg: SVGSVGElement, name: string) {
  download(await svgToPngBlob(svg), `${safeName(name)}.png`);
}

export function downloadJSON(data: unknown, filename: string) {
  download(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), filename);
}
