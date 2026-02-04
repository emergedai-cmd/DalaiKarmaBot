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
exports.DEFAULT_INPUT_PDF_MIN_TEXT_CHARS = exports.DEFAULT_INPUT_PDF_MAX_PIXELS = exports.DEFAULT_INPUT_PDF_MAX_PAGES = exports.DEFAULT_INPUT_TIMEOUT_MS = exports.DEFAULT_INPUT_MAX_REDIRECTS = exports.DEFAULT_INPUT_FILE_MAX_CHARS = exports.DEFAULT_INPUT_FILE_MAX_BYTES = exports.DEFAULT_INPUT_IMAGE_MAX_BYTES = exports.DEFAULT_INPUT_FILE_MIMES = exports.DEFAULT_INPUT_IMAGE_MIMES = void 0;
exports.normalizeMimeType = normalizeMimeType;
exports.parseContentType = parseContentType;
exports.normalizeMimeList = normalizeMimeList;
exports.fetchWithGuard = fetchWithGuard;
exports.extractImageContentFromSource = extractImageContentFromSource;
exports.extractFileContentFromSource = extractFileContentFromSource;
var fetch_guard_js_1 = require("../infra/net/fetch-guard.js");
var logger_js_1 = require("../logger.js");
var canvasModulePromise = null;
var pdfJsModulePromise = null;
// Lazy-load optional PDF/image deps so non-PDF paths don't require native installs.
function loadCanvasModule() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!canvasModulePromise) {
                canvasModulePromise = Promise.resolve().then(function () { return require("@napi-rs/canvas"); }).catch(function (err) {
                    canvasModulePromise = null;
                    throw new Error("Optional dependency @napi-rs/canvas is required for PDF image extraction: ".concat(String(err)));
                });
            }
            return [2 /*return*/, canvasModulePromise];
        });
    });
}
function loadPdfJsModule() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!pdfJsModulePromise) {
                pdfJsModulePromise = Promise.resolve().then(function () { return require("pdfjs-dist/legacy/build/pdf.mjs"); }).catch(function (err) {
                    pdfJsModulePromise = null;
                    throw new Error("Optional dependency pdfjs-dist is required for PDF extraction: ".concat(String(err)));
                });
            }
            return [2 /*return*/, pdfJsModulePromise];
        });
    });
}
exports.DEFAULT_INPUT_IMAGE_MIMES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
exports.DEFAULT_INPUT_FILE_MIMES = [
    "text/plain",
    "text/markdown",
    "text/html",
    "text/csv",
    "application/json",
    "application/pdf",
];
exports.DEFAULT_INPUT_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
exports.DEFAULT_INPUT_FILE_MAX_BYTES = 5 * 1024 * 1024;
exports.DEFAULT_INPUT_FILE_MAX_CHARS = 200000;
exports.DEFAULT_INPUT_MAX_REDIRECTS = 3;
exports.DEFAULT_INPUT_TIMEOUT_MS = 10000;
exports.DEFAULT_INPUT_PDF_MAX_PAGES = 4;
exports.DEFAULT_INPUT_PDF_MAX_PIXELS = 4000000;
exports.DEFAULT_INPUT_PDF_MIN_TEXT_CHARS = 200;
function normalizeMimeType(value) {
    if (!value) {
        return undefined;
    }
    var raw = value.split(";")[0];
    var normalized = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase();
    return normalized || undefined;
}
function parseContentType(value) {
    if (!value) {
        return {};
    }
    var parts = value.split(";").map(function (part) { return part.trim(); });
    var mimeType = normalizeMimeType(parts[0]);
    var charset = parts
        .map(function (part) { var _a, _b; return (_b = (_a = part.match(/^charset=(.+)$/i)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim(); })
        .find(function (part) { return part && part.length > 0; });
    return { mimeType: mimeType, charset: charset };
}
function normalizeMimeList(values, fallback) {
    var input = values && values.length > 0 ? values : fallback;
    return new Set(input.map(function (value) { return normalizeMimeType(value); }).filter(Boolean));
}
function fetchWithGuard(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, response, release, contentLength, size, buffer, _b, _c, contentType, parsed, mimeType;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, fetch_guard_js_1.fetchWithSsrFGuard)({
                        url: params.url,
                        maxRedirects: params.maxRedirects,
                        timeoutMs: params.timeoutMs,
                        init: { headers: { "User-Agent": "OpenClaw-Gateway/1.0" } },
                    })];
                case 1:
                    _a = _e.sent(), response = _a.response, release = _a.release;
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, , 4, 6]);
                    if (!response.ok) {
                        throw new Error("Failed to fetch: ".concat(response.status, " ").concat(response.statusText));
                    }
                    contentLength = response.headers.get("content-length");
                    if (contentLength) {
                        size = parseInt(contentLength, 10);
                        if (size > params.maxBytes) {
                            throw new Error("Content too large: ".concat(size, " bytes (limit: ").concat(params.maxBytes, " bytes)"));
                        }
                    }
                    _c = (_b = Buffer).from;
                    return [4 /*yield*/, response.arrayBuffer()];
                case 3:
                    buffer = _c.apply(_b, [_e.sent()]);
                    if (buffer.byteLength > params.maxBytes) {
                        throw new Error("Content too large: ".concat(buffer.byteLength, " bytes (limit: ").concat(params.maxBytes, " bytes)"));
                    }
                    contentType = response.headers.get("content-type") || undefined;
                    parsed = parseContentType(contentType);
                    mimeType = (_d = parsed.mimeType) !== null && _d !== void 0 ? _d : "application/octet-stream";
                    return [2 /*return*/, { buffer: buffer, mimeType: mimeType, contentType: contentType }];
                case 4: return [4 /*yield*/, release()];
                case 5:
                    _e.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function decodeTextContent(buffer, charset) {
    var encoding = (charset === null || charset === void 0 ? void 0 : charset.trim().toLowerCase()) || "utf-8";
    try {
        return new TextDecoder(encoding).decode(buffer);
    }
    catch (_a) {
        return new TextDecoder("utf-8").decode(buffer);
    }
}
function clampText(text, maxChars) {
    if (text.length <= maxChars) {
        return text;
    }
    return text.slice(0, maxChars);
}
function extractPdfContent(params) {
    return __awaiter(this, void 0, void 0, function () {
        var buffer, limits, getDocument, pdf, maxPages, textParts, pageNum, page, textContent, pageText, text, canvasModule, err_1, createCanvas, images, pageNum, page, viewport, maxPixels, pixelBudget, pagePixels, scale, scaled, canvas, png;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buffer = params.buffer, limits = params.limits;
                    return [4 /*yield*/, loadPdfJsModule()];
                case 1:
                    getDocument = (_a.sent()).getDocument;
                    return [4 /*yield*/, getDocument({
                            data: new Uint8Array(buffer),
                            disableWorker: true,
                        }).promise];
                case 2:
                    pdf = _a.sent();
                    maxPages = Math.min(pdf.numPages, limits.pdf.maxPages);
                    textParts = [];
                    pageNum = 1;
                    _a.label = 3;
                case 3:
                    if (!(pageNum <= maxPages)) return [3 /*break*/, 7];
                    return [4 /*yield*/, pdf.getPage(pageNum)];
                case 4:
                    page = _a.sent();
                    return [4 /*yield*/, page.getTextContent()];
                case 5:
                    textContent = _a.sent();
                    pageText = textContent.items
                        .map(function (item) { return ("str" in item ? String(item.str) : ""); })
                        .filter(Boolean)
                        .join(" ");
                    if (pageText) {
                        textParts.push(pageText);
                    }
                    _a.label = 6;
                case 6:
                    pageNum += 1;
                    return [3 /*break*/, 3];
                case 7:
                    text = textParts.join("\n\n");
                    if (text.trim().length >= limits.pdf.minTextChars) {
                        return [2 /*return*/, { text: text, images: [] }];
                    }
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, loadCanvasModule()];
                case 9:
                    canvasModule = _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_1 = _a.sent();
                    (0, logger_js_1.logWarn)("media: PDF image extraction skipped; ".concat(String(err_1)));
                    return [2 /*return*/, { text: text, images: [] }];
                case 11:
                    createCanvas = canvasModule.createCanvas;
                    images = [];
                    pageNum = 1;
                    _a.label = 12;
                case 12:
                    if (!(pageNum <= maxPages)) return [3 /*break*/, 16];
                    return [4 /*yield*/, pdf.getPage(pageNum)];
                case 13:
                    page = _a.sent();
                    viewport = page.getViewport({ scale: 1 });
                    maxPixels = limits.pdf.maxPixels;
                    pixelBudget = Math.max(1, maxPixels);
                    pagePixels = viewport.width * viewport.height;
                    scale = Math.min(1, Math.sqrt(pixelBudget / pagePixels));
                    scaled = page.getViewport({ scale: Math.max(0.1, scale) });
                    canvas = createCanvas(Math.ceil(scaled.width), Math.ceil(scaled.height));
                    return [4 /*yield*/, page.render({
                            canvas: canvas,
                            viewport: scaled,
                        }).promise];
                case 14:
                    _a.sent();
                    png = canvas.toBuffer("image/png");
                    images.push({ type: "image", data: png.toString("base64"), mimeType: "image/png" });
                    _a.label = 15;
                case 15:
                    pageNum += 1;
                    return [3 /*break*/, 12];
                case 16: return [2 /*return*/, { text: text, images: images }];
            }
        });
    });
}
function extractImageContentFromSource(source, limits) {
    return __awaiter(this, void 0, void 0, function () {
        var mimeType, buffer, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (source.type === "base64") {
                        if (!source.data) {
                            throw new Error("input_image base64 source missing 'data' field");
                        }
                        mimeType = (_a = normalizeMimeType(source.mediaType)) !== null && _a !== void 0 ? _a : "image/png";
                        if (!limits.allowedMimes.has(mimeType)) {
                            throw new Error("Unsupported image MIME type: ".concat(mimeType));
                        }
                        buffer = Buffer.from(source.data, "base64");
                        if (buffer.byteLength > limits.maxBytes) {
                            throw new Error("Image too large: ".concat(buffer.byteLength, " bytes (limit: ").concat(limits.maxBytes, " bytes)"));
                        }
                        return [2 /*return*/, { type: "image", data: source.data, mimeType: mimeType }];
                    }
                    if (!(source.type === "url" && source.url)) return [3 /*break*/, 2];
                    if (!limits.allowUrl) {
                        throw new Error("input_image URL sources are disabled by config");
                    }
                    return [4 /*yield*/, fetchWithGuard({
                            url: source.url,
                            maxBytes: limits.maxBytes,
                            timeoutMs: limits.timeoutMs,
                            maxRedirects: limits.maxRedirects,
                        })];
                case 1:
                    result = _b.sent();
                    if (!limits.allowedMimes.has(result.mimeType)) {
                        throw new Error("Unsupported image MIME type from URL: ".concat(result.mimeType));
                    }
                    return [2 /*return*/, { type: "image", data: result.buffer.toString("base64"), mimeType: result.mimeType }];
                case 2: throw new Error("input_image must have 'source.url' or 'source.data'");
            }
        });
    });
}
function extractFileContentFromSource(params) {
    return __awaiter(this, void 0, void 0, function () {
        var source, limits, filename, buffer, mimeType, charset, parsed, result, parsed, extracted, text_1, text;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    source = params.source, limits = params.limits;
                    filename = source.filename || "file";
                    if (!(source.type === "base64")) return [3 /*break*/, 1];
                    if (!source.data) {
                        throw new Error("input_file base64 source missing 'data' field");
                    }
                    parsed = parseContentType(source.mediaType);
                    mimeType = parsed.mimeType;
                    charset = parsed.charset;
                    buffer = Buffer.from(source.data, "base64");
                    return [3 /*break*/, 4];
                case 1:
                    if (!(source.type === "url" && source.url)) return [3 /*break*/, 3];
                    if (!limits.allowUrl) {
                        throw new Error("input_file URL sources are disabled by config");
                    }
                    return [4 /*yield*/, fetchWithGuard({
                            url: source.url,
                            maxBytes: limits.maxBytes,
                            timeoutMs: limits.timeoutMs,
                            maxRedirects: limits.maxRedirects,
                        })];
                case 2:
                    result = _b.sent();
                    parsed = parseContentType(result.contentType);
                    mimeType = (_a = parsed.mimeType) !== null && _a !== void 0 ? _a : normalizeMimeType(result.mimeType);
                    charset = parsed.charset;
                    buffer = result.buffer;
                    return [3 /*break*/, 4];
                case 3: throw new Error("input_file must have 'source.url' or 'source.data'");
                case 4:
                    if (buffer.byteLength > limits.maxBytes) {
                        throw new Error("File too large: ".concat(buffer.byteLength, " bytes (limit: ").concat(limits.maxBytes, " bytes)"));
                    }
                    if (!mimeType) {
                        throw new Error("input_file missing media type");
                    }
                    if (!limits.allowedMimes.has(mimeType)) {
                        throw new Error("Unsupported file MIME type: ".concat(mimeType));
                    }
                    if (!(mimeType === "application/pdf")) return [3 /*break*/, 6];
                    return [4 /*yield*/, extractPdfContent({ buffer: buffer, limits: limits })];
                case 5:
                    extracted = _b.sent();
                    text_1 = extracted.text ? clampText(extracted.text, limits.maxChars) : "";
                    return [2 /*return*/, {
                            filename: filename,
                            text: text_1,
                            images: extracted.images.length > 0 ? extracted.images : undefined,
                        }];
                case 6:
                    text = clampText(decodeTextContent(buffer, charset), limits.maxChars);
                    return [2 /*return*/, { filename: filename, text: text }];
            }
        });
    });
}
