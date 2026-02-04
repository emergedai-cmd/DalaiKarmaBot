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
var sharp_1 = require("sharp");
var vitest_1 = require("vitest");
var tool_images_js_1 = require("./tool-images.js");
(0, vitest_1.describe)("tool image sanitizing", function () {
    (0, vitest_1.it)("shrinks oversized images to <=5MB", function () { return __awaiter(void 0, void 0, void 0, function () {
        var width, height, raw, bigPng, blocks, out, image, size;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    width = 2800;
                    height = 2800;
                    raw = Buffer.alloc(width * height * 3, 0xff);
                    return [4 /*yield*/, (0, sharp_1.default)(raw, {
                            raw: { width: width, height: height, channels: 3 },
                        })
                            .png({ compressionLevel: 0 })
                            .toBuffer()];
                case 1:
                    bigPng = _a.sent();
                    (0, vitest_1.expect)(bigPng.byteLength).toBeGreaterThan(5 * 1024 * 1024);
                    blocks = [
                        {
                            type: "image",
                            data: bigPng.toString("base64"),
                            mimeType: "image/png",
                        },
                    ];
                    return [4 /*yield*/, (0, tool_images_js_1.sanitizeContentBlocksImages)(blocks, "test")];
                case 2:
                    out = _a.sent();
                    image = out.find(function (b) { return b.type === "image"; });
                    if (!image || image.type !== "image") {
                        throw new Error("expected image block");
                    }
                    size = Buffer.from(image.data, "base64").byteLength;
                    (0, vitest_1.expect)(size).toBeLessThanOrEqual(5 * 1024 * 1024);
                    (0, vitest_1.expect)(image.mimeType).toBe("image/jpeg");
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
    (0, vitest_1.it)("sanitizes image arrays and reports drops", function () { return __awaiter(void 0, void 0, void 0, function () {
        var width, height, raw, png, images, _a, out, dropped, meta;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    width = 2600;
                    height = 400;
                    raw = Buffer.alloc(width * height * 3, 0x7f);
                    return [4 /*yield*/, (0, sharp_1.default)(raw, {
                            raw: { width: width, height: height, channels: 3 },
                        })
                            .png({ compressionLevel: 9 })
                            .toBuffer()];
                case 1:
                    png = _b.sent();
                    images = [
                        { type: "image", data: png.toString("base64"), mimeType: "image/png" },
                    ];
                    return [4 /*yield*/, (0, tool_images_js_1.sanitizeImageBlocks)(images, "test")];
                case 2:
                    _a = _b.sent(), out = _a.images, dropped = _a.dropped;
                    (0, vitest_1.expect)(dropped).toBe(0);
                    (0, vitest_1.expect)(out.length).toBe(1);
                    return [4 /*yield*/, (0, sharp_1.default)(Buffer.from(out[0].data, "base64")).metadata()];
                case 3:
                    meta = _b.sent();
                    (0, vitest_1.expect)(meta.width).toBeLessThanOrEqual(2000);
                    (0, vitest_1.expect)(meta.height).toBeLessThanOrEqual(2000);
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
    (0, vitest_1.it)("shrinks images that exceed max dimension even if size is small", function () { return __awaiter(void 0, void 0, void 0, function () {
        var width, height, raw, png, blocks, out, image, meta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    width = 2600;
                    height = 400;
                    raw = Buffer.alloc(width * height * 3, 0x7f);
                    return [4 /*yield*/, (0, sharp_1.default)(raw, {
                            raw: { width: width, height: height, channels: 3 },
                        })
                            .png({ compressionLevel: 9 })
                            .toBuffer()];
                case 1:
                    png = _a.sent();
                    blocks = [
                        {
                            type: "image",
                            data: png.toString("base64"),
                            mimeType: "image/png",
                        },
                    ];
                    return [4 /*yield*/, (0, tool_images_js_1.sanitizeContentBlocksImages)(blocks, "test")];
                case 2:
                    out = _a.sent();
                    image = out.find(function (b) { return b.type === "image"; });
                    if (!image || image.type !== "image") {
                        throw new Error("expected image block");
                    }
                    return [4 /*yield*/, (0, sharp_1.default)(Buffer.from(image.data, "base64")).metadata()];
                case 3:
                    meta = _a.sent();
                    (0, vitest_1.expect)(meta.width).toBeLessThanOrEqual(2000);
                    (0, vitest_1.expect)(meta.height).toBeLessThanOrEqual(2000);
                    (0, vitest_1.expect)(image.mimeType).toBe("image/jpeg");
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
    (0, vitest_1.it)("corrects mismatched jpeg mimeType", function () { return __awaiter(void 0, void 0, void 0, function () {
        var jpeg, blocks, out, image;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sharp_1.default)({
                        create: {
                            width: 10,
                            height: 10,
                            channels: 3,
                            background: { r: 255, g: 0, b: 0 },
                        },
                    })
                        .jpeg()
                        .toBuffer()];
                case 1:
                    jpeg = _a.sent();
                    blocks = [
                        {
                            type: "image",
                            data: jpeg.toString("base64"),
                            mimeType: "image/png",
                        },
                    ];
                    return [4 /*yield*/, (0, tool_images_js_1.sanitizeContentBlocksImages)(blocks, "test")];
                case 2:
                    out = _a.sent();
                    image = out.find(function (b) { return b.type === "image"; });
                    if (!image || image.type !== "image") {
                        throw new Error("expected image block");
                    }
                    (0, vitest_1.expect)(image.mimeType).toBe("image/jpeg");
                    return [2 /*return*/];
            }
        });
    }); });
});
