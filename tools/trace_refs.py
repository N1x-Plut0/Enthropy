"""Clean up a small reference image and trace it to SVG.

Pipeline: crop -> 4x Lanczos upscale -> repeated bilateral filtering (smooths
paper/JPEG noise but keeps line edges) -> k-means palette reduction -> small
median clean-up -> vtracer in 'stacked' mode (shapes overlap, so no hairline
gaps between regions).

  python3 tools/trace_refs.py <image> <x0,y0,x1,y1> <out.svg> [colors] [passes] [scale]

For best quality first upscale the reference with tools/upscale.py and pass scale=1.5.
"""
import sys
import cv2
import numpy as np
import vtracer


def prep(path, box, colors=28, scale=6, passes=2):
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img.shape[2] == 4:  # flatten alpha onto the average background
        a = img[:, :, 3:4] / 255.0
        img = (img[:, :, :3] * a + img[:, :, :3].mean((0, 1)) * (1 - a)).astype(np.uint8)
    x0, y0, x1, y1 = box
    img = img[y0:y1, x0:x1]
    img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_LANCZOS4)
    for _ in range(passes):
        img = cv2.bilateralFilter(img, 7, 22, 7)
    # k-means palette reduction in Lab (perceptual)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5)
    _, labels, centers = cv2.kmeans(lab, colors, None, crit, 3, cv2.KMEANS_PP_CENTERS)
    q = centers[labels.flatten()].reshape(img.shape).astype(np.uint8)
    q = cv2.cvtColor(q, cv2.COLOR_LAB2BGR)
    q = cv2.medianBlur(q, 3)
    return q


def main():
    src, box, out = sys.argv[1], tuple(int(v) for v in sys.argv[2].split(',')), sys.argv[3]
    colors = int(sys.argv[4]) if len(sys.argv) > 4 else 40
    passes = int(sys.argv[5]) if len(sys.argv) > 5 else 2
    scale = float(sys.argv[6]) if len(sys.argv) > 6 else 6
    q = prep(src, box, colors, scale=scale, passes=passes)
    png = out.replace('.svg', '-prep.png')
    cv2.imwrite(png, q)
    vtracer.convert_image_to_svg_py(
        png, out, colormode='color', hierarchical='stacked', mode='spline',
        filter_speckle=10, color_precision=8, layer_difference=4, corner_threshold=70,
        length_threshold=5.0, max_iterations=10, splice_threshold=45, path_precision=1)


if __name__ == '__main__':
    main()
