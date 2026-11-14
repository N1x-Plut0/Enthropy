"""4x anime upscaling (Real-ESRGAN x4plus_anime_6B) without PyTorch.

Reads the official .pth weights directly (torch zip format), rebuilds the
RRDBNet as an ONNX graph and runs it with onnxruntime.

  python3 tools/upscale.py <weights.pth> <in.png> <out.png>

Weights: https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x4plus_anime_6B.pth
"""
import pickle
import sys
import zipfile

import cv2
import numpy as np
import onnx
import onnxruntime as ort
from onnx import TensorProto, helper, numpy_helper


# ---------- minimal torch .pth reader ----------
class _Storage:
    def __init__(self, dtype):
        self.dtype = dtype


def load_pth(path):
    z = zipfile.ZipFile(path)
    prefix = z.namelist()[0].split('/')[0]
    dtypes = {'FloatStorage': np.float32, 'HalfStorage': np.float16, 'LongStorage': np.int64}

    def rebuild(storage, offset, size, stride, *_):
        dtype, key = storage
        raw = np.frombuffer(z.read(f'{prefix}/data/{key}'), dtype=dtype)
        if not size:
            return raw[offset:offset + 1].reshape(())
        itemsize = raw.itemsize
        return np.lib.stride_tricks.as_strided(
            raw[offset:], shape=size, strides=[s * itemsize for s in stride]).copy()

    class U(pickle.Unpickler):
        def find_class(self, mod, name):
            if name == '_rebuild_tensor_v2':
                return rebuild
            if name in dtypes:
                return dtypes[name]
            if mod == 'collections' and name == 'OrderedDict':
                import collections
                return collections.OrderedDict
            raise pickle.UnpicklingError(f'blocked {mod}.{name}')

        def persistent_load(self, pid):
            _, dtype, key, *_ = pid
            return (dtype, key)

    obj = U(z.open(f'{prefix}/data.pkl')).load()
    return obj.get('params_ema') or obj.get('params') or obj


# ---------- RRDBNet -> ONNX ----------
def build_onnx(sd, num_block=6):
    nodes, inits = [], []
    cnt = [0]

    def name(p):
        cnt[0] += 1
        return f'{p}_{cnt[0]}'

    def conv(x, key):
        w, b = sd[f'{key}.weight'].astype(np.float32), sd[f'{key}.bias'].astype(np.float32)
        inits.append(numpy_helper.from_array(w, key + '.w'))
        inits.append(numpy_helper.from_array(b, key + '.b'))
        o = name(key)
        nodes.append(helper.make_node('Conv', [x, key + '.w', key + '.b'], [o], pads=[1, 1, 1, 1]))
        return o

    def lrelu(x):
        o = name('lrelu')
        nodes.append(helper.make_node('LeakyRelu', [x], [o], alpha=0.2))
        return o

    def cat(xs):
        o = name('cat')
        nodes.append(helper.make_node('Concat', xs, [o], axis=1))
        return o

    def scaled_add(x, y, s):  # x + y*s
        k = name('k')
        inits.append(numpy_helper.from_array(np.array(s, np.float32), k))
        m, o = name('mul'), name('add')
        nodes.append(helper.make_node('Mul', [y, k], [m]))
        nodes.append(helper.make_node('Add', [x, m], [o]))
        return o

    def up2(x):
        sc = name('scales')
        inits.append(numpy_helper.from_array(np.array([1, 1, 2, 2], np.float32), sc))
        o = name('up')
        nodes.append(helper.make_node('Resize', [x, '', sc], [o], mode='nearest'))
        return o

    def rdb(x, key):
        x1 = lrelu(conv(x, f'{key}.conv1'))
        x2 = lrelu(conv(cat([x, x1]), f'{key}.conv2'))
        x3 = lrelu(conv(cat([x, x1, x2]), f'{key}.conv3'))
        x4 = lrelu(conv(cat([x, x1, x2, x3]), f'{key}.conv4'))
        x5 = conv(cat([x, x1, x2, x3, x4]), f'{key}.conv5')
        return scaled_add(x, x5, 0.2)

    feat = conv('input', 'conv_first')
    h = feat
    for i in range(num_block):
        r = h
        for j in (1, 2, 3):
            r = rdb(r, f'body.{i}.rdb{j}')
        h = scaled_add(h, r, 0.2)
    body = conv(h, 'conv_body')
    s = name('add')
    nodes.append(helper.make_node('Add', [feat, body], [s]))
    f = lrelu(conv(up2(s), 'conv_up1'))
    f = lrelu(conv(up2(f), 'conv_up2'))
    out = conv(lrelu(conv(f, 'conv_hr')), 'conv_last')
    nodes.append(helper.make_node('Identity', [out], ['output']))
    graph = helper.make_graph(
        nodes, 'rrdbnet',
        [helper.make_tensor_value_info('input', TensorProto.FLOAT, [1, 3, None, None])],
        [helper.make_tensor_value_info('output', TensorProto.FLOAT, [1, 3, None, None])],
        inits)
    model = helper.make_model(graph, opset_imports=[helper.make_opsetid('', 17)])
    model.ir_version = 8
    return model


def upscale(weights, img_bgr):
    sd = load_pth(weights)
    model = build_onnx(sd)
    sess = ort.InferenceSession(model.SerializeToString(), providers=['CPUExecutionProvider'])
    x = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    x = x.transpose(2, 0, 1)[None]
    y = sess.run(['output'], {'input': x})[0][0]
    y = np.clip(y.transpose(1, 2, 0), 0, 1)
    return cv2.cvtColor((y * 255).round().astype(np.uint8), cv2.COLOR_RGB2BGR)


if __name__ == '__main__':
    w, src, dst = sys.argv[1:4]
    img = cv2.imread(src, cv2.IMREAD_UNCHANGED)
    if img.ndim == 3 and img.shape[2] == 4:
        a = img[:, :, 3:4] / 255.0
        img = (img[:, :, :3] * a + img[:, :, :3].mean((0, 1)) * (1 - a)).astype(np.uint8)
    cv2.imwrite(dst, upscale(w, img))
