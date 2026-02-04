"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var sharp_1 = require("sharp");
var vitest_1 = require("vitest");
var ssrf = require("../infra/net/ssrf.js");
var image_ops_js_1 = require("../media/image-ops.js");
var media_js_1 = require("./media.js");
var tmpFiles = [];
function writeTempFile(buffer, ext) {
    return __awaiter(this, void 0, void 0, function () {
        var file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-media-".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2)).concat(ext));
                    tmpFiles.push(file);
                    return [4 /*yield*/, promises_1.default.writeFile(file, buffer)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, file];
            }
        });
    });
}
function buildDeterministicBytes(length) {
    var buffer = Buffer.allocUnsafe(length);
    var seed = 0x12345678;
    for (var i = 0; i < length; i++) {
        seed = (1103515245 * seed + 12345) & 0x7fffffff;
        buffer[i] = seed & 0xff;
    }
    return buffer;
}
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(tmpFiles.map(function (file) { return promises_1.default.rm(file, { force: true }); }))];
            case 1:
                _a.sent();
                tmpFiles.length = 0;
                vitest_1.vi.restoreAllMocks();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("web media loading", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.spyOn(ssrf, "resolvePinnedHostname").mockImplementation(function (hostname) { return __awaiter(void 0, void 0, void 0, function () {
            var normalized, addresses;
            return __generator(this, function (_a) {
                normalized = hostname.trim().toLowerCase().replace(/\.$/, "");
                addresses = ["93.184.216.34"];
                return [2 /*return*/, {
                        hostname: normalized,
                        addresses: addresses,
                        lookup: ssrf.createPinnedLookup({ hostname: normalized, addresses: addresses }),
                    }];
            });
        }); });
    });
    (0, vitest_1.it)("compresses large local images under the provided cap", function () { return __awaiter(void 0, void 0, void 0, function () {
        var buffer, file, cap, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sharp_1.default)({
                        create: {
                            width: 1600,
                            height: 1600,
                            channels: 3,
                            background: "#ff0000",
                        },
                    })
                        .jpeg({ quality: 95 })
                        .toBuffer()];
                case 1:
                    buffer = _a.sent();
                    return [4 /*yield*/, writeTempFile(buffer, ".jpg")];
                case 2:
                    file = _a.sent();
                    cap = Math.floor(buffer.length * 0.8);
                    return [4 /*yield*/, (0, media_js_1.loadWebMedia)(file, cap)];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("image");
                    (0, vitest_1.expect)(result.buffer.length).toBeLessThanOrEqual(cap);
                    (0, vitest_1.expect)(result.buffer.length).toBeLessThan(buffer.length);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sniffs mime before extension when loading local files", function () { return __awaiter(void 0, void 0, void 0, function () {
        var pngBuffer, wrongExt, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sharp_1.default)({
                        create: { width: 2, height: 2, channels: 3, background: "#00ff00" },
                    })
                        .png()
                        .toBuffer()];
                case 1:
                    pngBuffer = _a.sent();
                    return [4 /*yield*/, writeTempFile(pngBuffer, ".bin")];
                case 2:
                    wrongExt = _a.sent();
                    return [4 /*yield*/, (0, media_js_1.loadWebMedia)(wrongExt, 1024 * 1024)];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("image");
                    (0, vitest_1.expect)(result.contentType).toBe("image/jpeg");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds extension to URL fileName when missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchMock = vitest_1.vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
                        ok: true,
                        body: true,
                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, Buffer.from("%PDF-1.4").buffer];
                        }); }); },
                        headers: { get: function () { return "application/pdf"; } },
                        status: 200,
                    });
                    return [4 /*yield*/, (0, media_js_1.loadWebMedia)("https://example.com/download", 1024 * 1024)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("document");
                    (0, vitest_1.expect)(result.contentType).toBe("application/pdf");
                    (0, vitest_1.expect)(result.fileName).toBe("download.pdf");
                    fetchMock.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("includes URL + status in fetch errors", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchMock = vitest_1.vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
                        ok: false,
                        body: true,
                        text: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, "Not Found"];
                        }); }); },
                        headers: { get: function () { return null; } },
                        status: 404,
                        statusText: "Not Found",
                        url: "https://example.com/missing.jpg",
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, media_js_1.loadWebMedia)("https://example.com/missing.jpg", 1024 * 1024)).rejects.toThrow(/Failed to fetch media from https:\/\/example\.com\/missing\.jpg.*HTTP 404/i)];
                case 1:
                    _a.sent();
                    fetchMock.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("respects maxBytes for raw URL fetches", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchMock = vitest_1.vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
                        ok: true,
                        body: true,
                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, Buffer.alloc(2048).buffer];
                        }); }); },
                        headers: { get: function () { return "image/png"; } },
                        status: 200,
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, media_js_1.loadWebMediaRaw)("https://example.com/too-big.png", 1024)).rejects.toThrow(/exceeds maxBytes 1024/i)];
                case 1:
                    _a.sent();
                    fetchMock.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses content-disposition filename when available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchMock, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchMock = vitest_1.vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
                        ok: true,
                        body: true,
                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, Buffer.from("%PDF-1.4").buffer];
                        }); }); },
                        headers: {
                            get: function (name) {
                                if (name === "content-disposition") {
                                    return 'attachment; filename="report.pdf"';
                                }
                                if (name === "content-type") {
                                    return "application/pdf";
                                }
                                return null;
                            },
                        },
                        status: 200,
                    });
                    return [4 /*yield*/, (0, media_js_1.loadWebMedia)("https://example.com/download?id=1", 1024 * 1024)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("document");
                    (0, vitest_1.expect)(result.fileName).toBe("report.pdf");
                    fetchMock.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves GIF animation by skipping JPEG optimization", function () { return __awaiter(void 0, void 0, void 0, function () {
        var gifBuffer, file, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gifBuffer = Buffer.from([
                        0x47,
                        0x49,
                        0x46,
                        0x38,
                        0x39,
                        0x61, // GIF89a
                        0x01,
                        0x00,
                        0x01,
                        0x00, // 1x1 dimensions
                        0x00,
                        0x00,
                        0x00, // no global color table
                        0x2c,
                        0x00,
                        0x00,
                        0x00,
                        0x00, // image descriptor
                        0x01,
                        0x00,
                        0x01,
                        0x00,
                        0x00, // 1x1 image
                        0x02,
                        0x01,
                        0x44,
                        0x00,
                        0x3b, // minimal LZW data + trailer
                    ]);
                    return [4 /*yield*/, writeTempFile(gifBuffer, ".gif")];
                case 1:
                    file = _a.sent();
                    return [4 /*yield*/, (0, media_js_1.loadWebMedia)(file, 1024 * 1024)];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("image");
                    (0, vitest_1.expect)(result.contentType).toBe("image/gif");
                    // GIF should NOT be converted to JPEG
                    (0, vitest_1.expect)(result.buffer.slice(0, 3).toString()).toBe("GIF");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves GIF from URL without JPEG conversion", function () { return __awaiter(void 0, void 0, void 0, function () {
        var gifBytes, fetchMock, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gifBytes = new Uint8Array([
                        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00,
                        0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x01, 0x44, 0x00, 0x3b,
                    ]);
                    fetchMock = vitest_1.vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
                        ok: true,
                        body: true,
                        arrayBuffer: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, gifBytes.buffer.slice(gifBytes.byteOffset, gifBytes.byteOffset + gifBytes.byteLength)];
                        }); }); },
                        headers: { get: function () { return "image/gif"; } },
                        status: 200,
                    });
                    return [4 /*yield*/, (0, media_js_1.loadWebMedia)("https://example.com/animation.gif", 1024 * 1024)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("image");
                    (0, vitest_1.expect)(result.contentType).toBe("image/gif");
                    (0, vitest_1.expect)(result.buffer.slice(0, 3).toString()).toBe("GIF");
                    fetchMock.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves PNG alpha when under the cap", function () { return __awaiter(void 0, void 0, void 0, function () {
        var buffer, file, result, meta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sharp_1.default)({
                        create: {
                            width: 64,
                            height: 64,
                            channels: 4,
                            background: { r: 255, g: 0, b: 0, alpha: 0.5 },
                        },
                    })
                        .png()
                        .toBuffer()];
                case 1:
                    buffer = _a.sent();
                    return [4 /*yield*/, writeTempFile(buffer, ".png")];
                case 2:
                    file = _a.sent();
                    return [4 /*yield*/, (0, media_js_1.loadWebMedia)(file, 1024 * 1024)];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("image");
                    (0, vitest_1.expect)(result.contentType).toBe("image/png");
                    return [4 /*yield*/, (0, sharp_1.default)(result.buffer).metadata()];
                case 4:
                    meta = _a.sent();
                    (0, vitest_1.expect)(meta.hasAlpha).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to JPEG when PNG alpha cannot fit under cap", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sizes, pngBuffer, smallestPng, jpegOptimized, cap, _i, sizes_1, size, raw, file, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sizes = [512, 768, 1024];
                    pngBuffer = null;
                    smallestPng = null;
                    jpegOptimized = null;
                    cap = 0;
                    _i = 0, sizes_1 = sizes;
                    _a.label = 1;
                case 1:
                    if (!(_i < sizes_1.length)) return [3 /*break*/, 6];
                    size = sizes_1[_i];
                    raw = buildDeterministicBytes(size * size * 4);
                    return [4 /*yield*/, (0, sharp_1.default)(raw, { raw: { width: size, height: size, channels: 4 } })
                            .png()
                            .toBuffer()];
                case 2:
                    pngBuffer = _a.sent();
                    return [4 /*yield*/, (0, image_ops_js_1.optimizeImageToPng)(pngBuffer, 1)];
                case 3:
                    smallestPng = _a.sent();
                    cap = Math.max(1, smallestPng.optimizedSize - 1);
                    return [4 /*yield*/, (0, media_js_1.optimizeImageToJpeg)(pngBuffer, cap)];
                case 4:
                    jpegOptimized = _a.sent();
                    if (jpegOptimized.buffer.length < smallestPng.optimizedSize) {
                        return [3 /*break*/, 6];
                    }
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    if (!pngBuffer || !smallestPng || !jpegOptimized) {
                        throw new Error("PNG fallback setup failed");
                    }
                    if (jpegOptimized.buffer.length >= smallestPng.optimizedSize) {
                        throw new Error("JPEG fallback did not shrink below PNG (jpeg=".concat(jpegOptimized.buffer.length, ", png=").concat(smallestPng.optimizedSize, ")"));
                    }
                    return [4 /*yield*/, writeTempFile(pngBuffer, ".png")];
                case 7:
                    file = _a.sent();
                    return [4 /*yield*/, (0, media_js_1.loadWebMedia)(file, cap)];
                case 8:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.kind).toBe("image");
                    (0, vitest_1.expect)(result.contentType).toBe("image/jpeg");
                    (0, vitest_1.expect)(result.buffer.length).toBeLessThanOrEqual(cap);
                    return [2 /*return*/];
            }
        });
    }); });
});
