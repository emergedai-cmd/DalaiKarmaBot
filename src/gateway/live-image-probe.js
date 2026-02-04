"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCatNoncePngBase64 = renderCatNoncePngBase64;
var node_zlib_1 = require("node:zlib");
var CRC_TABLE = (function () {
    var table = new Uint32Array(256);
    for (var i = 0; i < 256; i += 1) {
        var c = i;
        for (var k = 0; k < 8; k += 1) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[i] = c >>> 0;
    }
    return table;
})();
function crc32(buf) {
    var crc = 0xffffffff;
    for (var i = 0; i < buf.length; i += 1) {
        crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
    var typeBuf = Buffer.from(type, "ascii");
    var len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    var crc = crc32(Buffer.concat([typeBuf, data]));
    var crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
}
function encodePngRgba(buffer, width, height) {
    var stride = width * 4;
    var raw = Buffer.alloc((stride + 1) * height);
    for (var row = 0; row < height; row += 1) {
        var rawOffset = row * (stride + 1);
        raw[rawOffset] = 0; // filter: none
        buffer.copy(raw, rawOffset + 1, row * stride, row * stride + stride);
    }
    var compressed = (0, node_zlib_1.deflateSync)(raw);
    var signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    var ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // color type RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace
    return Buffer.concat([
        signature,
        pngChunk("IHDR", ihdr),
        pngChunk("IDAT", compressed),
        pngChunk("IEND", Buffer.alloc(0)),
    ]);
}
function fillPixel(buf, x, y, width, r, g, b, a) {
    if (a === void 0) { a = 255; }
    if (x < 0 || y < 0) {
        return;
    }
    if (x >= width) {
        return;
    }
    var idx = (y * width + x) * 4;
    if (idx < 0 || idx + 3 >= buf.length) {
        return;
    }
    buf[idx] = r;
    buf[idx + 1] = g;
    buf[idx + 2] = b;
    buf[idx + 3] = a;
}
var GLYPH_ROWS_5X7 = {
    "0": [14, 17, 19, 21, 25, 17, 14],
    "1": [4, 12, 4, 4, 4, 4, 14],
    "2": [14, 17, 1, 2, 4, 8, 31],
    "3": [30, 1, 1, 14, 1, 1, 30],
    "4": [2, 6, 10, 18, 31, 2, 2],
    "5": [31, 16, 30, 1, 1, 17, 14],
    "6": [6, 8, 16, 30, 17, 17, 14],
    "7": [31, 1, 2, 4, 8, 8, 8],
    "8": [14, 17, 17, 14, 17, 17, 14],
    "9": [14, 17, 17, 15, 1, 2, 12],
    A: [14, 17, 17, 31, 17, 17, 17],
    B: [30, 17, 17, 30, 17, 17, 30],
    C: [14, 17, 16, 16, 16, 17, 14],
    D: [30, 17, 17, 17, 17, 17, 30],
    E: [31, 16, 16, 30, 16, 16, 31],
    F: [31, 16, 16, 30, 16, 16, 16],
    T: [31, 4, 4, 4, 4, 4, 4],
};
function drawGlyph5x7(params) {
    var _a, _b;
    var rows = GLYPH_ROWS_5X7[params.char];
    if (!rows) {
        return;
    }
    for (var row = 0; row < 7; row += 1) {
        var bits = (_a = rows[row]) !== null && _a !== void 0 ? _a : 0;
        for (var col = 0; col < 5; col += 1) {
            var on = (bits & (1 << (4 - col))) !== 0;
            if (!on) {
                continue;
            }
            for (var dy = 0; dy < params.scale; dy += 1) {
                for (var dx = 0; dx < params.scale; dx += 1) {
                    fillPixel(params.buf, params.x + col * params.scale + dx, params.y + row * params.scale + dy, params.width, params.color.r, params.color.g, params.color.b, (_b = params.color.a) !== null && _b !== void 0 ? _b : 255);
                }
            }
        }
    }
}
function drawText(params) {
    var text = params.text.toUpperCase();
    var cursorX = params.x;
    for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
        var raw = text_1[_i];
        var ch = raw in GLYPH_ROWS_5X7 ? raw : raw.toUpperCase();
        drawGlyph5x7({
            buf: params.buf,
            width: params.width,
            x: cursorX,
            y: params.y,
            char: ch,
            scale: params.scale,
            color: params.color,
        });
        cursorX += 6 * params.scale;
    }
}
function measureTextWidthPx(text, scale) {
    return text.length * 6 * scale - scale; // 5px glyph + 1px space
}
function renderCatNoncePngBase64(nonce) {
    var top = "CAT";
    var bottom = nonce.toUpperCase();
    var scale = 12;
    var pad = 18;
    var gap = 18;
    var topWidth = measureTextWidthPx(top, scale);
    var bottomWidth = measureTextWidthPx(bottom, scale);
    var width = Math.max(topWidth, bottomWidth) + pad * 2;
    var height = pad * 2 + 7 * scale + gap + 7 * scale;
    var buf = Buffer.alloc(width * height * 4, 255);
    var black = { r: 0, g: 0, b: 0 };
    drawText({
        buf: buf,
        width: width,
        x: Math.floor((width - topWidth) / 2),
        y: pad,
        text: top,
        scale: scale,
        color: black,
    });
    drawText({
        buf: buf,
        width: width,
        x: Math.floor((width - bottomWidth) / 2),
        y: pad + 7 * scale + gap,
        text: bottom,
        scale: scale,
        color: black,
    });
    var png = encodePngRgba(buf, width, height);
    return png.toString("base64");
}
