# Enthropy

Креатор персонажей: упрощённые векторные копии референсов, которые можно перекрашивать по зонам
(волосы, кожа, верх, низ, обувь, фон). Два формата (в полный рост / лицо), сохранение в браузере,
экспорт PNG/SVG/JSON. Мудборды — следующий этап.

```bash
npm install
npm run dev      # разработка
npm run site     # собрать сайт в корень репозитория (его отдаёт GitHub Pages)
```

Исходники — в `app/`. Файлы `index.html`, `assets/`, `bases/` в корне — это собранный сайт, руками их не править.

## Как добавить нового персонажа-базу

1. Увеличить реф нейросетью: `python3 tools/upscale.py RealESRGAN_x4plus_anime_6B.pth ref.png ref-x4.png`
   (веса: https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x4plus_anime_6B.pth;
   нужны `pip install onnx onnxruntime opencv-python-headless vtracer`).
   Затем оцифровать фигуру: `python3 tools/trace_refs.py ref-x4.png x0,y0,x1,y1 <id>-front.svg 56 1 1.5`.
2. Описать базу в `BASES` в `tools/build_bases.py`: прототипы цветов зон и вертикальные полосы фигуры.
3. `python3 tools/build_bases.py <папка-с-svg> app/public/bases` — появятся `app/public/bases/<id>.json` и обновится `index.json`.
