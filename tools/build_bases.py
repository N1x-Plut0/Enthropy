"""Turn traced reference SVGs (vtracer output) into recolourable base JSON for the app.

Each path is assigned a zone by its vertical band on the figure and the nearest
prototype colour allowed in that band. Usage:
  python3 tools/build_bases.py <traced-dir> app/public/bases
"""
import json, re, sys, statistics

def rgb(h): return tuple(int(h[i:i+2], 16) for i in (1, 3, 5))
def dist(a, b): return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

LINE = ['#221413', '#2f2120', '#352424', '#3f2c2d']

BASES = {
  'r1': {
    'name': 'Пучок и джоггеры',
    'file': 'r1-front.svg',
    'face': [30, 10, 430, 470],
    'protos': {
      'hair': ['#876d5f', '#8c7767', '#846b5d', '#816a5d'],
      'skin': ['#be9e87', '#c2a491', '#bc9a86', '#bb9d89'],
      'top': ['#5a4844', '#574843', '#584844', '#544643'],
      'bottom': ['#4d3939', '#4c3838', '#453333'],
      'shoes': ['#3e312e', '#493b36'],
      'shoeLight': ['#c5ada9', '#caa8a3'],
      'bg': ['#735d5f', '#715c5c'],
      'line': LINE,
    },
    # (y_from, y_to, allowed zones)
    'bands': [
      (0, 395, ['hair', 'skin', 'bg', 'line']),
      (395, 960, ['top', 'skin', 'bg', 'line']),
      (960, 1050, ['top', 'bottom', 'skin', 'bg', 'line']),
      (1050, 1830, ['bottom', 'skin', 'bg', 'line']),
      (1830, 9999, ['shoes', 'shoeLight', 'bg', 'line']),
    ],
  },
  'r2': {
    'name': 'Длинные и шорты',
    'file': 'r2-front.svg',
    'face': [120, 10, 420, 460],
    'protos': {
      'hair': ['#856f4b', '#836d50', '#836a49', '#866d4d', '#7e6849', '#675136', '#7f6549', '#786045'],
      'skin': ['#a08061', '#977859', '#a27f5e', '#a07f5d', '#96795c', '#9b7d5e'],
      'top': ['#918571', '#a9977e', '#aa987f', '#9a876f', '#a6967d'],
      'print': ['#443f31', '#3e382d', '#8a4a40'],
      'bottom': ['#403930', '#3c362b', '#413a31'],
      'sock': ['#af9b7c'],
      'shoes': ['#312613', '#3a3326'],
      'bg': ['#57523f', '#544e3c'],
      'line': ['#1e170f', '#2a2219'],
    },
    'bands': [
      (0, 380, ['hair', 'skin', 'bg', 'line']),
      (380, 470, ['hair', 'top', 'skin', 'bg', 'line']),
      (470, 1000, ['top', 'print', 'skin', 'bg', 'line']),
      (1000, 1100, ['top', 'bottom', 'skin', 'bg', 'line']),
      (1100, 1400, ['bottom', 'skin', 'bg', 'line']),
      (1400, 1745, ['skin', 'bottom', 'bg', 'line']),
      (1745, 1850, ['sock', 'skin', 'bg', 'line']),
      (1850, 9999, ['shoes', 'sock', 'bg', 'line']),
    ],
    # zone may only appear inside these x ranges within the given y span
    'xlim': [
      ('skin', 470, 1000, [(0, 130), (430, 9999)]),
      ('hair', 110, 370, [(0, 285), (415, 9999)]),
      ('print', 0, 9999, [(130, 470)]),
    ],
  },
}

RECOLOR = ['hair', 'skin', 'top', 'bottom', 'shoes', 'bg']
PATH_RE = re.compile(r'<path d="([^"]+)" fill="(#[0-9A-Fa-f]{6})" transform="translate\(([-\d.]+),([-\d.]+)\)"')

def build(src_dir, out_dir):
    index = []
    for bid, cfg in BASES.items():
        s = open(f'{src_dir}/{cfg["file"]}').read()
        w, h = map(int, re.search(r'width="(\d+)" height="(\d+)"', s).groups())
        protos = {z: [rgb(c) for c in cs] for z, cs in cfg['protos'].items()}
        zones = list(protos)
        paths, weights = [], {z: [] for z in zones}
        for d, fill, tx, ty in PATH_RE.findall(s):
            nums = [float(n) for n in re.findall(r'-?\d+\.?\d*', d)]
            ys = nums[1::2]
            cy = (min(ys) + max(ys)) / 2 + float(ty)
            xs = nums[0::2]
            cx = (min(xs) + max(xs)) / 2 + float(tx)
            allowed = next(b[2] for b in cfg['bands'] if b[0] <= cy < b[1])
            for zone, y0, y1, ranges in cfg.get('xlim', []):
                small = (max(xs) - min(xs)) < 150 and (max(ys) - min(ys)) < 150
                if zone in allowed and small and y0 <= cy < y1 and not any(a <= cx < b for a, b in ranges):
                    allowed = [a for a in allowed if a != zone]
            c = rgb(fill.lower())
            z = min(allowed, key=lambda zz: min(dist(c, p) for p in protos[zz]))
            # whole-canvas background shapes
            if (max(nums[0::2]) - min(nums[0::2])) > w * 0.9 and (max(ys) - min(ys)) > h * 0.9:
                z = 'bg'
            paths.append([d.strip(), float(tx), float(ty), fill.lower(), zones.index(z)])
            weights[z].append((len(d), fill.lower()))
        base = {}
        for z in RECOLOR:
            if weights.get(z):
                best = {}
                for n, col in weights[z]:
                    best[col] = best.get(col, 0) + n
                base[z] = max(best, key=best.get)
        out = {'id': bid, 'name': cfg['name'], 'w': w, 'h': h, 'face': cfg['face'], 'zones': zones, 'base': base, 'paths': paths}
        with open(f'{out_dir}/{bid}.json', 'w') as fh:
            json.dump(out, fh, separators=(',', ':'))
        counts = {z: sum(1 for p in paths if p[4] == zones.index(z)) for z in zones}
        print(bid, len(paths), counts, base)
        index.append({'id': bid, 'name': cfg['name']})
    with open(f'{out_dir}/index.json', 'w') as fh:
        json.dump(index, fh, ensure_ascii=False)

if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2])
